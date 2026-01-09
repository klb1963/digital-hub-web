// src/lib/cms.ts
import 'server-only';

import type {
  Category,
  Post,
  PayloadListResponse,
  ItWorriesQuizGlobal,
} from './cms-types';

type NextFetchOptions = {
  revalidate?: number | false;
  tags?: string[];
};

type CMSFetchInit = RequestInit & {
  next?: NextFetchOptions;
};

function getCmsBaseServer(): string {
  const base =
    process.env.CMS_INTERNAL_URL ||
    process.env.CMS_URL ||
    process.env.NEXT_PUBLIC_CMS_URL ||
    '';

  return base.replace(/\/$/, '');
}

// ✅ Re-export types for server usage (optional)
export type { Category, Post, ItWorriesQuizGlobal } from './cms-types';

// ─────────────────────────────────────────────
// Общая функция fetch’а из Payload CMS
// ─────────────────────────────────────────────

async function fetchFromCMS<T>(path: string, init?: CMSFetchInit): Promise<T> {
  const base = getCmsBaseServer();
  if (!base) {
    throw new Error(
      'CMS base URL is not defined (CMS_INTERNAL_URL / CMS_URL / NEXT_PUBLIC_CMS_URL)',
    );
  }

  const url = `${base}${path}`;

  const res = await fetch(url, {
    ...init,
    next: { revalidate: 60, ...(init?.next ?? {}) },
  });

  if (!res.ok) {
    throw new Error(`CMS request failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
}

// ─────────────────────────────────────────────
// список категорий
// ─────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  try {
    const data = await fetchFromCMS<PayloadListResponse<Category>>(
      '/api/categories?' + 'limit=1000&' + 'depth=1',
    );

    return data.docs;
  } catch (err) {
    console.error('Failed to load categories from CMS', err);
    // Фолбэк: без категорий, но билд не падает
    return [];
  }
}

// ─────────────────────────────────────────────
// список постов (опционально с поиском по title / excerpt)
// ─────────────────────────────────────────────

export async function getAllPosts(
  options?: { search?: string | null },
): Promise<Post[]> {
  const params = new URLSearchParams();

  // только опубликованные, сортировка по дате
  params.set('where[_status][equals]', 'published');
  params.set('sort', '-publishDate');
  // категории всё равно подтягиваем отдельным запросом
  params.set('depth', '1');

  const q = options?.search?.trim();
  if (q) {
    // title LIKE q OR excerpt LIKE q
    // (Payload интерпретирует это как: status=published AND (title LIKE q OR excerpt LIKE q))
    params.set('where[or][0][title][like]', q);
    params.set('where[or][1][excerpt][like]', q);
  }

  try {
    const data = await fetchFromCMS<PayloadListResponse<Post>>(
      '/api/posts?' + params.toString(),
    );

    return data.docs;
  } catch (err) {
    console.error('Failed to load posts list from CMS', err);
    // Важно: не роняем build, просто возвращаем пустой список
    return [];
  }
}

// ─────────────────────────────────────────────
// один пост по slug
// ─────────────────────────────────────────────

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const bySlug = await fetchFromCMS<PayloadListResponse<Post>>(
      `/api/posts?` +
        `where[slug][equals]=${encodeURIComponent(slug)}` +
        `&limit=1` +
        `&depth=2`,
    );

    if (bySlug.docs[0]) return bySlug.docs[0];

    const all = await fetchFromCMS<PayloadListResponse<Post>>(
      '/api/posts?depth=2&limit=50',
    );
    return all.docs.find((p) => p.slug === slug) ?? null;
  } catch (err) {
    console.error('Failed to load post by slug from CMS', err);
    // На всякий случай: не роняем билд, просто нет поста
    return null;
  }
}

// ─────────────────────────────────────────────
// slug’и для generateStaticParams
// ─────────────────────────────────────────────

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const data = await fetchFromCMS<PayloadListResponse<Pick<Post, 'slug'>>>(
      '/api/posts?' +
        'where[_status][equals]=published&' +
        'limit=1000&' +
        'depth=1',
    );

    return data.docs
      .map((p) => p.slug)
      .filter((slug): slug is string => Boolean(slug));
  } catch (err) {
    console.error('Failed to load post slugs from CMS', err);
    return [];
  }
}

// ─────────────────────────────────────────────
// IT Worries Test (Global) - named quiz in Payload
// ─────────────────────────────────────────────

export async function getItWorriesTest(): Promise<ItWorriesQuizGlobal | null> {
  try {
    // globals endpoint in Payload: /api/globals/<slug>
    const data = await fetchFromCMS<ItWorriesQuizGlobal>(
      '/api/globals/it-worries-quiz?depth=2',
    );
    return data;
  } catch (err) {
    console.error('Failed to load it-worries-test global from CMS', err);
    return null;
  }
}