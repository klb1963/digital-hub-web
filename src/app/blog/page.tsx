// src/app/blog/page.tsx

import { getAllPosts, getAllCategories } from '@/lib/cms';
import { BlogList } from './BlogList';
import type { Post, Category } from '@/lib/cms';

export const dynamic = 'force-static';

export default async function BlogPage() {
  // Тянем посты и категории один раз на сервере (статически)
  const [posts, categories] = await Promise.all([
    getAllPosts(),
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

      {/* Вся логика фильтрации и чтения query-параметров — уже в клиентском компоненте */}
      <BlogList posts={posts as Post[]} categories={categories as Category[]} />
    </main>
  );
}