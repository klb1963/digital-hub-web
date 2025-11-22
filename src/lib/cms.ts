// src/lib/cms.ts
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL;

if (!CMS_URL) {
  throw new Error('NEXT_PUBLIC_CMS_URL is not defined');
}

type PayloadListResponse<T> = {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
};

export type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  publishDate?: string | null;
  category?: {
    id: number;
    title?: string;
    slug?: string;
  } | null;
  coverImage?: {
    id: number;
    url?: string | null;
  } | null;
  content?: unknown;
};

async function fetchFromCMS<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${CMS_URL}${path}`;

  const res = await fetch(url, {
    ...init,
    // для SSG: кешируем, нам не нужен runtime revalidate
    cache: 'force-cache',
  });

  if (!res.ok) {
    throw new Error(`CMS request failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
}

// все опубликованные посты
export async function getAllPosts(): Promise<Post[]> {
  const data = await fetchFromCMS<PayloadListResponse<Post>>(
    `/api/posts?where[_status][equals]=published&sort=-publishDate`
  );
  return data.docs;
}

// один пост по slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  // Сначала пробуем стандартный фильтр по slug
  const bySlug = await fetchFromCMS<PayloadListResponse<Post>>(
    `/api/posts?where[slug][equals]=${encodeURIComponent(slug)}&depth=2&limit=1`
  );

  if (bySlug.docs[0]) {
    return bySlug.docs[0];
  }

  // Если почему-то ничего не нашли — подстраховка:
  // загрузим до 50 постов и найдём slug вручную
  const all = await fetchFromCMS<PayloadListResponse<Post>>(
    `/api/posts?depth=2&limit=50`
  );

  const found = all.docs.find((p) => p.slug === slug);
  return found ?? null;
}

// слуги всех опубликованных постов — для generateStaticParams
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const data = await fetchFromCMS<PayloadListResponse<Pick<Post, 'slug'>>>(
      `/api/posts?limit=1000&depth=0`
    );

    return data.docs
      .map((p) => p.slug)
      .filter((slug): slug is string => Boolean(slug));
  } catch (err) {
    console.error('Failed to load post slugs from CMS', err);
    // Чтобы билд не падал, просто не генерируем ни одной статической страницы поста
    return [];
  }
}