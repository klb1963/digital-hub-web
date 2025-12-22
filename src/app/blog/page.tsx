// src/app/blog/page.tsx

import { getAllPosts, getAllCategories } from '@/lib/cms';
import { BlogList } from './BlogList';
import type { Post, Category } from '@/lib/cms';

/**
 * Получаем публичный base URL CMS
 */
function getCmsPublicBase(): string {
  return (
    process.env.NEXT_PUBLIC_CMS_URL ||
    process.env.CMS_URL ||
    ''
  ).replace(/\/$/, '');
}

/**
 * В Next.js 15 App Router searchParams
 * типизирован как Promise — используем именно так
 */
type BlogPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

/**
 * ISR — пересборка страницы раз в 60 секунд
 */
export const revalidate = 60;

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams?.q?.trim() ?? '';

  const cmsPublicBaseUrl = getCmsPublicBase();

  // Загружаем посты и категории на сервере
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

      {/* Клиентский компонент со всей логикой фильтрации и UI */}
      <BlogList
        posts={posts as Post[]}
        categories={categories as Category[]}
        cmsPublicBaseUrl={cmsPublicBaseUrl}
      />
    </main>
  );
}

