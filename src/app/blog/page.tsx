// src/app/blog/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/cms';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? '';

export const dynamic = 'force-static';

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Блог</h1>
        <p className="text-sm text-neutral-500">
          Заметки, архитектура, MVP и история Open Digital Hub.
        </p>
      </header>

      <section className="space-y-6">
        {posts.length === 0 && (
          <p className="text-neutral-500">Постов пока нет.</p>
        )}

        {posts.map((post) => (
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
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                {post.publishDate && (
                  <time dateTime={post.publishDate}>
                    {new Date(post.publishDate).toLocaleDateString('de-DE')}
                  </time>
                )}
                {post.category?.title && (
                  <>
                    <span>•</span>
                    <span>{post.category.title}</span>
                  </>
                )}
              </div>

              <h2 className="text-xl font-semibold">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>

              {post.excerpt && (
                <p className="text-sm text-neutral-600">{post.excerpt}</p>
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
        ))}
      </section>
    </main>
  );
}