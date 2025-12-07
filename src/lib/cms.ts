// src/lib/cms.ts

const CMS_URL =
  process.env.NEXT_PUBLIC_CMS_URL ?? process.env.CMS_URL ?? '';

if (!CMS_URL) {
  throw new Error('CMS_URL / NEXT_PUBLIC_CMS_URL is not defined');
}

// 👇 добавляем флаг окружения
const isDev = process.env.NODE_ENV !== 'production';

// ─────────────────────────────────────────────
// Типы для layout-блоков
// ─────────────────────────────────────────────

type CmsImage = {
  id?: number | string;
  url?: string | null;
  alt?: string | null;
} | null;

export type TextBlockLayout = {
  id?: string;
  blockType: 'textBlock';
  content: unknown;
};

export type QuoteBlockLayout = {
  id?: string;
  blockType: 'quoteBlock';
  quote: string;
  author?: string | null;
};

export type ImageBlockLayout = {
  id?: string;
  blockType: 'imageBlock';
  image: {
    id: number;
    url?: string | null;
  };
  caption?: string | null;
};

export type GalleryBlock = {
  blockType: 'galleryBlock';
  id: string;
  layout: 'grid' | 'carousel';
  items: {
    id: string;
    image: CmsImage;
    caption?: string | null;
  }[];
};

export type VideoBlock = {
  blockType: 'videoBlock';
  id: string;
  provider: 'youtube' | 'vimeo' | 'other';
  url: string;
  title?: string | null;
  caption?: string | null;
};

export type LayoutBlock = 
  | TextBlockLayout 
  | QuoteBlockLayout 
  | ImageBlockLayout
  | GalleryBlock
  | VideoBlock; // позже сюда добавим другие блоки

// ─────────────────────────────────────────────
// Базовые типы для работы с Payload
// ─────────────────────────────────────────────

type PayloadListResponse<T> = {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
};

export type Category = {
  id: number;
  title?: string;
  slug?: string;
};

export type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  publishDate?: string | null;
  // На деле Payload сейчас отдаёт либо числовой ID, либо развёрнутый объект.
  category?:
    | number
    | {
        id: number;
        title?: string;
        slug?: string;
      }
    | null;
  coverImage?:
    | {
        id: number;
        url?: string | null;
      }
    | null;
  content?: unknown;
  layout?: LayoutBlock[] | null; // ← добавили layout для блочного контента
};

// ─────────────────────────────────────────────
// Общая функция fetch’а из Payload CMS
// ─────────────────────────────────────────────

async function fetchFromCMS<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${CMS_URL}${path}`;

  const res = await fetch(url, {
    ...init,
    // 👇 в dev всегда тянем свежие данные, в проде — замораживаем снапшот
    cache: (isDev ? 'no-store' : 'force-cache') as RequestCache,
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

