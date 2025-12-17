// src/app/blog/[slug]/page.tsx

import {
  getAllPostSlugs,
  getPostBySlug,
  getAllPosts,
} from '@/lib/cms';
import type { Post } from '@/lib/cms';
import Image from 'next/image';
import Link from 'next/link';
import { BlogContentRenderer } from '../BlogContentRenderer';
import type { Metadata } from 'next';

// Локальное описание SEO-поля из Payload
type PostSEO = {
  seoTitle?: string | null;
  seoDescription?: string | null;
};

type PostWithSEO = Post & {
  seo?: PostSEO | null;
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://leonidk.de';

function getCmsPublicBase(): string {
  return (
    process.env.NEXT_PUBLIC_CMS_URL ||
    process.env.CMS_URL ||
    ''
  ).replace(/\/$/, '');
}

function resolveMediaUrl(pathOrUrl?: string | null, base?: string) {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const b = (base ?? '').replace(/\/$/, '');
  if (!b) return pathOrUrl; // fallback: как было
  return `${b}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

function normalizeMediaAbsUrl(url?: string) {
  if (!url) return undefined;

  // Детектор двойного энкодинга: %25D0%25... вместо %D0%...
  if (!url.includes('%25')) return url;

  try {
    // Снимаем один слой энкодинга: %25D0 -> %D0
    return decodeURIComponent(url);
  } catch {
    return url;
  }
}

type PageParams = {
  slug: string;
};

type PageProps = {
  // ⬅ ВАЖНО: в Next 15 params — Promise
  params: Promise<PageParams>;
};

export const revalidate = 60;

// 🔹 Вот эта строка — ключевая для output: 'export'
// export const dynamicParams = false;

// Нужен для output: 'export'
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

// Типы для упрощённого Lexical-JSON
interface LexicalTextNode {
  text?: string;
}

interface LexicalParagraphNode {
  type?: string;
  children?: LexicalTextNode[];
}

interface LexicalRootJSON {
  root?: {
    children?: LexicalParagraphNode[];
  };
}

// Простой рендер Lexical-контента в параграфы
function renderLexicalContent(content: unknown) {
  const root = (content as LexicalRootJSON).root;
  const children = Array.isArray(root?.children) ? root.children : [];

  return (
    <div className="prose max-w-none">
      {children.map((node, idx) => {
        if (node?.type !== 'paragraph') return null;

        const text = Array.isArray(node.children)
          ? node.children
              .map((ch) => (typeof ch.text === 'string' ? ch.text : ''))
              .join('')
          : '';

        if (!text) return null;

        return <p key={idx}>{text}</p>;
      })}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Выбор «связанных» постов:
//   1) сначала по той же категории, что и текущий
//   2) затем остальные, пока не доберём limit
// ────────────────────────────────────────────────────────────
function pickRelatedPosts(
  allPosts: Post[],
  currentPost: Post,
  limit = 3,
): Post[] {
  // отбрасываем текущий пост
  const others = allPosts.filter((p) => p.id !== currentPost.id);

  const currentCategoryId =
    typeof currentPost.category === 'object' && currentPost.category
      ? currentPost.category.id
      : typeof currentPost.category === 'number'
        ? currentPost.category
        : null;

  const sameCategory: Post[] = [];
  const differentCategory: Post[] = [];

  for (const p of others) {
    const catId =
      typeof p.category === 'object' && p.category
        ? p.category.id
        : typeof p.category === 'number'
          ? p.category
          : null;

    if (currentCategoryId && catId === currentCategoryId) {
      sameCategory.push(p);
    } else {
      differentCategory.push(p);
    }
  }

  return [...sameCategory, ...differentCategory].slice(0, limit);
}

// generateMetadata for blog post page (TG, Whatsapp, etc.)
export async function generateMetadata(
  { params }: PageProps,
): Promise<Metadata> {
  
  //console.log('[generateMetadata] called with params =', params);

  // В Next 15+ для страниц params — Promise, как и в самом компоненте страницы
  const { slug } = await params;

  // console.log('[generateMetadata] slug =', slug);

  const post = await getPostBySlug(slug);

  const canonicalUrl = `${SITE_URL}/blog/${slug}`;

  // Ветка 404 — тоже отдаём нормальные OG-теги
  if (!post) {
    const title = 'Пост не найден — Open Digital Hub';
    const description = 'Запрошенный пост не найден.';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        url: canonicalUrl,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  }

  const postWithSEO = post as PostWithSEO;

  const title =
    postWithSEO.seo?.seoTitle ??
    post.title ??
    'Open Digital Hub — Blog';

  const description =
    postWithSEO.seo?.seoDescription ??
    post.excerpt ??
    'Заметки, архитектура, MVP и история Open Digital Hub.';

  const cmsPublicBaseUrl = getCmsPublicBase();

  type MediaWithSizes = {
    url?: string | null;
    sizes?: {
      og?: { url?: string; width?: number; height?: number };
      openGraph?: { url?: string; width?: number; height?: number };
      large?: { url?: string; width?: number; height?: number };
      medium?: { url?: string; width?: number; height?: number };
    };
  };

  // Берём обложку поста как OG-картинку.
  // Важно: Telegram часто не подтягивает слишком большие изображения,
  // поэтому сначала пытаемся взять уменьшенный вариант из Payload sizes.
  const cover =
  typeof post.coverImage === 'object' && post.coverImage
    ? (post.coverImage as MediaWithSizes)
    : undefined;

  const ogCandidate =
    cover?.sizes?.og?.url ||
    cover?.sizes?.openGraph?.url ||
    cover?.sizes?.large?.url ||
    cover?.sizes?.medium?.url ||
    cover?.url ||
    undefined;

  const ogImageUrl = normalizeMediaAbsUrl(
    resolveMediaUrl(ogCandidate, cmsPublicBaseUrl),
  );

  const ogW =
    cover?.sizes?.og?.width ||
    cover?.sizes?.openGraph?.width ||
    cover?.sizes?.large?.width ||
    cover?.sizes?.medium?.width ||
    undefined;

  const ogH =
    cover?.sizes?.og?.height ||
    cover?.sizes?.openGraph?.height ||
    cover?.sizes?.large?.height ||
    cover?.sizes?.medium?.height ||
    undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonicalUrl,
      ...(ogImageUrl
        ? {
            images: [
              {
                url: ogImageUrl,
                alt: title,
                ...(ogW ? { width: ogW } : {}),
                ...(ogH ? { height: ogH } : {}),
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImageUrl ? { images: [{ url: ogImageUrl, alt: title }] } : {}),
    },
  };
}


export default async function BlogPostPage({ params }: PageProps) {
  // ⬅ РАЗВОРАЧИВАЕМ Promise
  const { slug } = await params;

  // ✅ ВАЖНО: эта переменная нужна здесь, а не только в generateMetadata
  const cmsPublicBaseUrl = getCmsPublicBase();

  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug),
    getAllPosts(),
  ]);

  if (!post) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold mb-4">Пост не найден</h1>
        <p className="text-gray-600 mb-2">
          slug: <code className="font-mono">{slug}</code>
        </p>
      </main>
    );
  }

  const publishDate = post.publishDate
    ? new Date(post.publishDate).toLocaleDateString('ru-RU')
    : '';

  const coverSrc = normalizeMediaAbsUrl(
    resolveMediaUrl(post.coverImage?.url, cmsPublicBaseUrl)
  );

  // связанные посты для блока «Читать еще»
  const relatedPosts = pickRelatedPosts(allPosts, post, 3);  

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* Навигация наверх – обратно к списку постов */}
      <div className="mb-6">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <span className="mr-2">&larr;</span>
          Назад к блогу
        </Link>
      </div>

      {/* Дата */}
      <p className="text-sm text-gray-500 mb-2">{publishDate}</p>

      {/* Заголовок */}
      <h1 className="text-3xl font-semibold mb-4">{post.title}</h1>

      {/* Категория */}
      {typeof post.category === 'object' && post.category?.title && (
        <p className="text-sm text-gray-500 mb-6">
          Категория:{' '}
          <span className="font-medium">{post.category.title}</span>
        </p>
      )}

      {/* Excerpt */}
      {post.excerpt && (
        <p className="mb-4 text-lg text-gray-700">{post.excerpt}</p>
      )}

      {/* Обложка */}
      {coverSrc && (
        <div className="mb-6">
          <Image
            src={coverSrc}
            alt={post.title}
            width={800}
            height={400}
            className="w-full h-auto rounded-lg border border-gray-200"
          />
        </div>
      )}

      {/* Основной текст */}
      <section className="mt-6">
        {Array.isArray(post.layout) && post.layout.length > 0 ? (
          <BlogContentRenderer layout={post.layout} cmsPublicBaseUrl={cmsPublicBaseUrl} />
        ) : post.content ? (
          renderLexicalContent(post.content)
        ) : (
          <p className="text-gray-500 text-sm">Нет содержимого</p>
        )}
      </section>

      {/* Блок "Читать еще" */}
      {relatedPosts.length > 0 && (
        <section className="mt-10 border-t border-gray-200 pt-6">
          <h2 className="mb-4 text-lg font-semibold">Читать ещё</h2>

          <div className="space-y-4">
            {relatedPosts.map((related) => {
              const relatedDate = related.publishDate
                ? new Date(related.publishDate).toLocaleDateString('ru-RU')
                : '';

              const relatedCategoryTitle =
                typeof related.category === 'object' &&
                related.category?.title
                  ? related.category.title
                  : undefined;

              const relatedCoverSrc = normalizeMediaAbsUrl(
                resolveMediaUrl(related.coverImage?.url, cmsPublicBaseUrl)
              );

              return (
                <article
                  key={related.id}
                  className="rounded-xl border border-neutral-200 p-4 transition hover:border-neutral-400"
                >
                  <div className="flex gap-4">
                    {relatedCoverSrc && (
                      <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
                        <Image
                          src={relatedCoverSrc}
                          alt={related.title}
                          fill
                          sizes="112px"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                        {relatedDate && <time>{relatedDate}</time>}
                        {relatedCategoryTitle && (
                          <>
                            <span>•</span>
                            <span>{relatedCategoryTitle}</span>
                          </>
                        )}
                      </div>

                      <h3 className="text-base font-semibold">
                        <Link
                          href={`/blog/${related.slug}`}
                          className="hover:underline"
                        >
                          {related.title}
                        </Link>
                      </h3>

                      {related.excerpt && (
                        <p className="text-sm text-neutral-600 line-clamp-2">
                          {related.excerpt}
                        </p>
                      )}
                    </div>
                  </div>

                </article>
              );
            })}
          </div>
        </section>
      )}      

      {/* Навигация вниз (вторая копия) */}
      <div className="mb-6 mt-6">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <span className="mr-2">&larr;</span>
          Назад к блогу
        </Link>
      </div>
    </main>
  );
}