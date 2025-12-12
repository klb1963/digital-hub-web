// src/app/blog/page.tsx

import { getAllPosts, getAllCategories } from '@/lib/cms';
import { BlogList } from './BlogList';
import type { Post, Category } from '@/lib/cms';

function getCmsPublicBase(): string {
  return (
    process.env.NEXT_PUBLIC_CMS_URL ||
    process.env.CMS_URL ||
    process.env.CMS_INTERNAL_URL ||
    ''
  ).replace(/\/$/, '');
}

type BlogPageProps = {
  // В Next 16 searchParams в серверном компоненте — Promise
  searchParams: Promise<{
    q?: string;
  }>;
};

// Страница блога должна подхватывать новые посты без полного деплоя.
// Делаем ISR: пересборка раз в 60 секунд.
export const revalidate = 60;

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // разворачиваем query-параметры
  const { q } = await searchParams;
  const searchQuery = q?.trim() ?? '';

  const cmsPublicBaseUrl = getCmsPublicBase();

  // Тянем посты (с учётом поиска) и категории один раз на сервере
  const [posts, categories] = await Promise.all([
    getAllPosts({ search: searchQuery }),
    getAllCategories(),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Блог</h1>
        <p className="text-sm text-neutral-500">
          Заметки, архитектура, MVP и история Open Digital Hub.
        </p>
      </header>

      {/* Вся логика категорий и чтения query-параметров — в клиентском компоненте */}
      <BlogList
        posts={posts as Post[]}
        categories={categories as Category[]}
        cmsPublicBaseUrl={cmsPublicBaseUrl}
      />
    </main>
  );
}