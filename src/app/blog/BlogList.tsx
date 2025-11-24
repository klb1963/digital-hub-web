// src/app/blog/BlogList.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import type { Post, Category } from '@/lib/cms';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? '';

type BlogListProps = {
  posts: Post[];
  categories: Category[];
};

export function BlogList({ posts, categories }: BlogListProps) {
  const searchParams = useSearchParams();
  const activeCategorySlug = searchParams.get('category') ?? 'all';

  // Словарь категорий по id
  const categoriesById = new Map(categories.map((cat) => [cat.id, cat]));

  // Виртуальная категория "All"
  const allCategory: Category = {
    id: 0,
    title: 'All',
    slug: 'all',
  };
  const categoriesWithAll: Category[] = [allCategory, ...categories];

  // Фильтрация постов по активной категории
  const filteredPosts =
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
    <>
      {/* Панель категорий сверху */}
      {categoriesWithAll.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2 pt-2">
          {categoriesWithAll.map((cat) => {
            const slug = cat.slug ?? '';
            const isActive = activeCategorySlug === slug;

            const href =
              slug === 'all'
                ? '/blog'
                : `/blog?category=${encodeURIComponent(slug)}`;

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
    </>
  );
}