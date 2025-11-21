// src/app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPostSlugs, getPostBySlug } from '@/lib/cms';

export const dynamic = 'force-static';

type PageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <div className="text-sm text-neutral-500 mb-4">
        <Link href="/blog" className="hover:underline">
          ← Ко всем постам
        </Link>
      </div>

      <article className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {post.title}
          </h1>

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
        </header>

        {/* TODO: рендер контента из Lexical */}
        <section className="prose prose-neutral max-w-none">
          <p className="text-neutral-500 text-sm">
            Контент поста пока не отрисован. Следующим шагом подключим
            рендер Lexical rich text.
          </p>
          <pre className="mt-3 overflow-x-auto text-xs bg-neutral-50 p-3 rounded">
            {JSON.stringify(post.content, null, 2)}
          </pre>
        </section>
      </article>
    </main>
  );
}