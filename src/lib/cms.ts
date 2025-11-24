// src/lib/cms.ts
const CMS_URL =
  process.env.NEXT_PUBLIC_CMS_URL ?? process.env.CMS_URL ?? '';

if (!CMS_URL) {
  throw new Error('CMS_URL / NEXT_PUBLIC_CMS_URL is not defined');
}

// 👇 добавляем флаг окружения
const isDev = process.env.NODE_ENV !== 'production';

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
};

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

// список категорий
export async function getAllCategories(): Promise<Category[]> {
  const data = await fetchFromCMS<PayloadListResponse<Category>>(
    '/api/categories?' +
      'limit=1000&' +
      'depth=1',
  );

  return data.docs;
}

// список постов (опционально с поиском по title / excerpt)
export async function getAllPosts(
  options?: { search?: string | null },
): Promise<Post[]> {
  const params = new URLSearchParams();

  // только опубликованные, сортировка по дате
  params.set('where[_status][equals]', 'published');
  params.set('sort', '-publishDate');
  // категории всё равно подтягиваем отдельным запросом
  params.set('depth', '0');

  const q = options?.search?.trim();
  if (q) {
    // title LIKE q OR excerpt LIKE q
    // (Payload интерпретирует это как: status=published AND (title LIKE q OR excerpt LIKE q))
    params.set('where[or][0][title][like]', q);
    params.set('where[or][1][excerpt][like]', q);
  }

  const data = await fetchFromCMS<PayloadListResponse<Post>>(
    '/api/posts?' + params.toString(),
  );

  return data.docs;
}

// один пост по slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const bySlug = await fetchFromCMS<PayloadListResponse<Post>>(
    `/api/posts?` +
      `where[slug][equals]=${encodeURIComponent(slug)}` +
      `&limit=1` +
      `&depth=2`
  );
 

  if (bySlug.docs[0]) return bySlug.docs[0];

  const all = await fetchFromCMS<PayloadListResponse<Post>>(
    '/api/posts?depth=2&limit=50',
  );
  return all.docs.find((p) => p.slug === slug) ?? null;
}

// slug’и для generateStaticParams
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const data = await fetchFromCMS<
      PayloadListResponse<Pick<Post, 'slug'>>
    >(
      '/api/posts?' +
        'where[_status][equals]=published&' +
        'limit=1000&' +
        'depth=0'
    );

    return data.docs
      .map((p) => p.slug)
      .filter((slug): slug is string => Boolean(slug));
  } catch (err) {
    console.error('Failed to load post slugs from CMS', err);
    return [];
  }
}