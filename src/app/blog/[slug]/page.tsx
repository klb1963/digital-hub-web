// src/app/blog/[slug]/page.tsx

import {
  getAllPostSlugs,
  getPostBySlug,
  getAllPosts,
} from '@/lib/cms';
import type { Post } from '@/lib/cms';
import Image from 'next/image';
import Link from 'next/link';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? '';

type PageParams = {
  slug: string;
};

type PageProps = {
  // ⬅ ВАЖНО: в Next 15 params — Promise
  params: Promise<PageParams>;
};

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

export default async function BlogPostPage({ params }: PageProps) {
  // ⬅ РАЗВОРАЧИВАЕМ Promise
  const { slug } = await params;

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
      {post.coverImage?.url && (
        <div className="mb-6">
          <Image
            src={`${CMS_URL}${post.coverImage.url}`}
            alt={post.title}
            width={800}
            height={400}
            className="w-full h-auto rounded-lg border border-gray-200"
          />
        </div>
      )}

      {/* Основной текст */}
      <section className="mt-6">
        {post.content ? (
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

              const relatedCoverUrl = related.coverImage?.url;

              return (
                <article
                  key={related.id}
                  className="rounded-xl border border-neutral-200 p-4 transition hover:border-neutral-400"
                >
                  <div className="flex gap-4">
                    {relatedCoverUrl && (
                      <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
                        <Image
                          src={`${CMS_URL}${relatedCoverUrl}`}
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