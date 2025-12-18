// src/app/blog/BlogList.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import type { Post, Category } from '@/lib/cms';

type BlogListProps = {
  posts: Post[];
  categories: Category[];
  cmsPublicBaseUrl: string;
};

function resolveCmsImageSrc(base: string, url: string) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${base}${url}`;
}

function normalizePayloadMediaUrl(absUrl: string, publicBase: string) {
  if (!absUrl) return '';

  // снимем двойной энкодинг, если он есть (%25...)
  let candidate = absUrl;
  for (let i = 0; i < 2; i++) {
    if (candidate.includes('%25')) {
      try { candidate = decodeURIComponent(candidate); } catch { break; }
    }
  }

  try {
    const u = new URL(candidate);
    // если пришло с cms.leonidk.de — заменяем origin на publicBase (обычно api.leonidk.de)
    if (publicBase) {
      const pb = new URL(publicBase);
      if (u.hostname === 'cms.leonidk.de') {
        u.protocol = pb.protocol;
        u.host = pb.host;
      }
    }

    // NFC-нормализация имени файла после /api/media/file/
    const prefix = '/api/media/file/';
    const idx = u.pathname.indexOf(prefix);
    if (idx >= 0) {
      const before = u.pathname.slice(0, idx + prefix.length);
      const filePart = u.pathname.slice(idx + prefix.length); // encoded
      const decodedName = decodeURIComponent(filePart);
      const nfcName = decodedName.normalize('NFC');
      const encodedName = encodeURIComponent(nfcName);
      u.pathname = before + encodedName;
    }

    return u.toString();
  } catch {
    return absUrl;
  }
}

export function BlogList({ posts, categories, cmsPublicBaseUrl }: BlogListProps) {
  const searchParams = useSearchParams();

  const activeCategorySlug = searchParams.get('category') ?? 'all';
  const searchQuery = searchParams.get('q') ?? '';
  const pageParam = searchParams.get('page') ?? '1';
  const pageSizeParam = searchParams.get('pageSize') ?? '10'; // по умолчанию 10

  // Словарь категорий по id
  const categoriesById = new Map(categories.map((cat) => [cat.id, cat]));

  // Виртуальная категория "All"
  const allCategory: Category = {
    id: 0,
    title: 'All',
    slug: 'all',
  };
  const categoriesWithAll: Category[] = [allCategory, ...categories];

  // ─────────────────────────
  // Фильтрация по категории + поиску
  // ─────────────────────────
  const normalizedQuery = searchQuery.trim().toLowerCase();

  let filteredPosts = posts;

  // 1) фильтр по категории
  if (activeCategorySlug !== 'all') {
    filteredPosts = filteredPosts.filter((post) => {
      let slug: string | undefined;

      if (typeof post.category === 'object' && post.category) {
        slug = post.category.slug;
      } else if (typeof post.category === 'number') {
        slug = categoriesById.get(post.category)?.slug;
      }

      return slug === activeCategorySlug;
    });
  }

  // 2) фильтр по тексту (title + excerpt)
  if (normalizedQuery) {
    filteredPosts = filteredPosts.filter((post) => {
      const haystack = (
        (post.title ?? '') +
        ' ' +
        (post.excerpt ?? '')
      ).toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }

  const totalPosts = filteredPosts.length;

  // ─────────────────────────
  // Пагинация
  // pageSize: 5 / 10 / 20 / 'all'
  // ─────────────────────────
  let pageSize: number | 'all';

  if (pageSizeParam === 'all') {
    pageSize = 'all';
  } else {
    const n = Number(pageSizeParam);
    pageSize = [5, 10, 20].includes(n) ? n : 10;
  }

  let currentPage = Number(pageParam);
  if (!Number.isFinite(currentPage) || currentPage < 1) {
    currentPage = 1;
  }

  let totalPages = 1;
  let paginatedPosts = filteredPosts;

  if (pageSize !== 'all') {
    totalPages = Math.max(1, Math.ceil(totalPosts / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    paginatedPosts = filteredPosts.slice(start, end);
  }

  const currentPageSizeKey = pageSize === 'all' ? 'all' : String(pageSize);
  const pageSizeOptions: Array<'5' | '10' | '20' | 'all'> = ['5', '10', '20', 'all'];

  const hasCategoryFilter = activeCategorySlug !== 'all';

  return (
    <>
      {/* Форма поиска */}
      <form
        action="/blog"
        method="GET"
        className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:gap-3"
      >
        <input
          type="text"
          name="q"
          defaultValue={searchQuery}
          placeholder="Поиск по заголовку и описанию…"
          className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
        />
        {hasCategoryFilter && (
          <input type="hidden" name="category" value={activeCategorySlug} />
        )}
        {/* сохраняем размер страницы при поиске */}
        {pageSizeParam && (
          <input type="hidden" name="pageSize" value={pageSizeParam} />
        )}
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full border border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-900 hover:text-white"
        >
          Найти
        </button>
      </form>

      {/* Строка "сколько найдено" + выбор размера страницы */}
      <div className="mt-3 flex flex-col items-start justify-between gap-2 text-xs text-neutral-600 sm:flex-row sm:items-center">
        <span>Найдено {totalPosts} постов</span>
        <div className="flex items-center gap-2">
          <span>На странице:</span>
          <div className="inline-flex gap-1 rounded-full bg-neutral-50 px-1 py-1">
            {pageSizeOptions.map((sizeKey) => {
              const isActive = currentPageSizeKey === sizeKey;

              const params = new URLSearchParams(searchParams.toString());
              params.delete('page'); // при смене размера всегда возвращаемся на 1 страницу
              params.set('pageSize', sizeKey);

              const href = `/blog?${params.toString()}`;

              return (
                <Link
                  key={sizeKey}
                  href={href}
                  scroll={false}
                  className={[
                    'rounded-full px-2 py-1',
                    'transition-colors',
                    isActive
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-700 hover:bg-neutral-200',
                  ].join(' ')}
                >
                  {sizeKey === 'all' ? 'Все' : sizeKey}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Панель категорий сверху */}
      {categoriesWithAll.length > 0 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2 pt-2">
          {categoriesWithAll.map((cat) => {
            const slug = cat.slug ?? '';
            const isActive = activeCategorySlug === slug;

            // Сохраняем текущий поисковый запрос и размер страницы при переключении категорий
            const params = new URLSearchParams(searchParams.toString());
            params.delete('page'); // при смене категории идём на 1 страницу

            if (slug === 'all') {
              params.delete('category');
            } else {
              params.set('category', slug);
            }

            const hrefParams = params.toString();
            const href = hrefParams ? `/blog?${hrefParams}` : '/blog';

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
        {totalPosts === 0 && (
          <p className="text-neutral-500">Постов пока нет.</p>
        )}

        {paginatedPosts.map((post) => {
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
                      src={normalizePayloadMediaUrl(
                        resolveCmsImageSrc(cmsPublicBaseUrl, post.coverImage.url),
                        cmsPublicBaseUrl
                      )}
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

      {/* Пагинация: только если не "Все" и страниц больше одной */}
      {pageSize !== 'all' && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-xs text-neutral-600">
          <span>
            Страница {currentPage} из {totalPages}
          </span>
          <div className="flex gap-2">
            {/* Prev */}
            {currentPage > 1 ? (
              (() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', String(currentPage - 1));
                const href = `/blog?${params.toString()}`;
                return (
                  <Link
                    href={href}
                    scroll={false}
                    className="rounded-full border border-neutral-300 px-3 py-1 hover:bg-neutral-100"
                  >
                    ← Назад
                  </Link>
                );
              })()
            ) : (
              <span className="rounded-full px-3 py-1 text-neutral-400">
                ← Назад
              </span>
            )}

            {/* Next */}
            {currentPage < totalPages ? (
              (() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', String(currentPage + 1));
                const href = `/blog?${params.toString()}`;
                return (
                  <Link
                    href={href}
                    scroll={false}
                    className="rounded-full border border-neutral-300 px-3 py-1 hover:bg-neutral-100"
                  >
                    Вперёд →
                  </Link>
                );
              })()
            ) : (
              <span className="rounded-full px-3 py-1 text-neutral-400">
                Вперёд →
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}