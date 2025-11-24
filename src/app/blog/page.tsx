// src/app/blog/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, getAllCategories } from '@/lib/cms';
import type { Category, Post } from '@/lib/cms';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? '';

type BlogPageProps = {
  // В Next 16 searchParams в серверном компоненте — Promise
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // Разворачиваем промис c query-параметрами
  const { category } = await searchParams;
  const activeCategorySlug = category ?? 'all';

  // Тянем посты и категории параллельно
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
  ]);

  // Словарь категорий по id — нужен и для подписи, и для фильтрации
  const categoriesById = new Map(categories.map((cat) => [cat.id, cat]));

  // Добавляем "All" (виртуальную категорию)
  const allCategory: Category = {
    id: 0,
    title: 'All',
    slug: 'all',
  };
  const categoriesWithAll: Category[] = [allCategory, ...categories];

  // Фильтрация постов по activeCategorySlug
  const filteredPosts: Post[] =
    activeCategorySlug === 'all'
      ? posts
      : posts.filter((post) => {
          let slug: string | undefined;

          if (typeof post.category === 'object' && post.category) {
            slug = post.category.slug;
          } else if (typeof post.category === 'number') {
            slug = categoriesById.get(post.category)?.slug;
          }

          return slug === activeCategorySlug;
        });

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Блог</h1>
        <p className="text-sm text-neutral-500">
          Заметки, архитектура, MVP и история Open Digital Hub.
        </p>
      </header>

      {/* Панель категорий сверху */}
      {categoriesWithAll.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2 pt-2">
          {categoriesWithAll.map((cat) => {
            const slug = cat.slug ?? '';
            const isActive = activeCategorySlug === slug;

            const href = isActive
              ? '/blog'
              : `/blog?category=${encodeURIComponent(cat.slug ?? '')}`;

            return (
              <Link
                key={cat.id}

                href={href}
                scroll={false}
                className={[
                  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors',
                  isActive
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-300 bg-neutral-50 text-neutral-700 hover:border-neutral-500',
                ].join(' ')}
              >
                {cat.title ?? 'Без названия'}
              </Link>
            );
          })}
        </div>
      )}

      <section className="space-y-6">
        {filteredPosts.length === 0 && (
          <p className="text-neutral-500">Постов пока нет.</p>
        )}

        {filteredPosts.map((post) => {
          // Подпись категории для карточки
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