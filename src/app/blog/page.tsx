// src/app/blog/page.tsx

import { getAllPosts, getAllCategories } from '@/lib/cms';
import { BlogList } from './BlogList';
import type { Post, Category } from '@/lib/cms';
import type { TagStat } from './types';

function slugifyTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, '-');
}

function toLevel(count: number): 1 | 2 | 3 {
  if (count === 1) return 1;
  if (count <= 3) return 2;
  return 3;
}

function buildTagStats(posts: Post[]): TagStat[] {
  const map = new Map<string, { label: string; count: number }>();

  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      const label = tag.trim();
      const slug = slugifyTag(label);

      const entry = map.get(slug);
      if (entry) entry.count += 1;
      else map.set(slug, { label, count: 1 });
    }
  }

  return Array.from(map.entries())
    .map(([slug, { label, count }]) => ({
      label,
      slug,
      count,
      level: toLevel(count),
    }))
    .sort((a, b) => b.count - a.count);
}

function getCmsPublicBase(): string {
  return (
    process.env.NEXT_PUBLIC_CMS_URL ||
    process.env.CMS_URL ||
    ''
  ).replace(/\/$/, '');
}

/**
 * ISR — пересборка страницы раз в 60 секунд
 */
export const revalidate = 60;

type BlogPageProps = {
  searchParams?: Promise<{
    q?: string;
    tag?: string;
  }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;

  const searchQuery = resolvedSearchParams?.q?.trim() ?? '';
  const activeTag = resolvedSearchParams?.tag?.trim() ?? '';
  const cmsPublicBaseUrl = getCmsPublicBase();

  const [posts, categories] = await Promise.all([
    getAllPosts({ search: searchQuery }),
    getAllCategories(),
  ]);

  const tagStats = buildTagStats(posts as Post[]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Блог</h1>
        <p className="text-sm text-neutral-500">
          Заметки, архитектура, MVP и история Open Digital Hub.
        </p>
      </header>

      <BlogList
        posts={posts as Post[]}
        categories={categories as Category[]}
        tagStats={tagStats}
        activeTag={activeTag}
        cmsPublicBaseUrl={cmsPublicBaseUrl}
      />
    </main>
  );
}