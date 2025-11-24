// src/app/blog/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, getAllCategories } from '@/lib/cms';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? '';

export const dynamic = 'force-static';

export default async function BlogPage() {
  // Тянем посты и категории параллельно
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
  ]);

  // Словарь категорий по id, чтобы уметь расшифровывать numeric category
  const categoriesById = new Map(
    categories.map((cat) => [cat.id, cat]),
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Блог</h1>
        <p className="text-sm text-neutral-500">
          Заметки, архитектура, MVP и история Open Digital Hub.
        </p>
      </header>

      {/* Панель категорий сверху (пока без фильтрации) */}
      {categories.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2 pt-2">
          {categories.map((cat) => (
            <span
              key={cat.id}
              className="inline-flex items-center rounded-full 
                         border border-neutral-300
                         bg-neutral-50 px-3 py-1 
                         text-xs font-medium text-neutral-700
                         whitespace-nowrap"
            >
              {cat.title ?? 'Без названия'}
            </span>
          ))}
        </div>
      )}

      <section className="space-y-6">
        {posts.length === 0 && (
          <p className="text-neutral-500">Постов пока нет.</p>
        )}

        {posts.map((post) => {
          // Расшифровываем категорию для карточки
          let categoryTitle: string | undefined;

          if (typeof post.category === 'object' && post.category) {
            categoryTitle = post.category.title;
          } else if (typeof post.category === 'number') {
            const cat = categoriesById.get(post.category);
            categoryTitle = cat?.title;
          }

          const publishDate = post.publishDate
            ? new Date(post.publishDate).toLocaleDateString('de-DE')
            : '';

          return (
            <article
              key={post.id}
              className="border border-neutral-200 rounded-xl p-5 hover:border-neutral-400 transition"
            >
              <div className="flex gap-4">
                {post.coverImage?.url && (
                  <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
                    <Image
                      src={`${CMS_URL}${post.coverImage.url}`}
                      alt={post.title}
                      fill
                      sizes="128px"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col gap-2">
                  {/* дата + категория */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                    {publishDate && <time>{publishDate}</time>}
                    {categoryTitle && (
                      <>
                        <span>•</span>
                        <span>{categoryTitle}</span>
                      </>
                    )}
                  </div>

                  <h2 className="text-xl font-semibold">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  {post.excerpt && (
                    <p className="text-sm text-neutral-600">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="pt-1">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Читать →
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}