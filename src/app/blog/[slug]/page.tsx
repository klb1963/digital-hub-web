// src/app/blog/[slug]/page.tsx

import { getAllPostSlugs, getPostBySlug } from '@/lib/cms';
import Image from 'next/image';
import Link from "next/link";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? '';

type PageProps = {
  params: { slug: string };
};

// Нужен для output: 'export'
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

// Типы для упрощённого Lexical-JSON
interface LexicalTextNode {
  text?: string;
}

interface LexicalParagraphNode {
  type?: string;
  children?: LexicalTextNode[];
}

interface LexicalRootJSON {
  root?: {
    children?: LexicalParagraphNode[];
  };
}

// Простой рендер Lexical-контента в параграфы
function renderLexicalContent(content: unknown) {
  const root = (content as LexicalRootJSON).root;
  const children = Array.isArray(root?.children) ? root.children : [];

  return (
    <div className="prose max-w-none">
      {children.map((node, idx) => {
        if (node?.type !== 'paragraph') return null;

        const text = Array.isArray(node.children)
          ? node.children
              .map((ch) => (typeof ch.text === 'string' ? ch.text : ''))
              .join('')
          : '';

        if (!text) return null;

        return <p key={idx}>{text}</p>;
      })}
    </div>
  );
}

export default async function BlogPostPage({ params }: PageProps) {
  // 👇 правильно «разворачиваем» params (params — Promise)
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold mb-4">Пост не найден</h1>
        <p className="text-gray-600 mb-2">
          slug:{' '}
          <code className="font-mono">
            {JSON.stringify(slug, null, 2)}
          </code>
        </p>
        <p className="text-gray-600">
          params (debug):{' '}
          <code className="font-mono">
            {JSON.stringify(await params, null, 2)}
          </code>
        </p>
      </main>
    );
  }

  const publishDate = post.publishDate
    ? new Date(post.publishDate).toLocaleDateString('ru-RU')
    : '';

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* Навигация назад к списку постов */}
      <div className="mb-6">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <span className="mr-2">&larr;</span>
          Назад к блогу
        </Link>
      </div>
      
      <p className="text-sm text-gray-500 mb-2">{publishDate}</p>
      <h1 className="text-3xl font-semibold mb-4">{post.title}</h1>

      {post.category?.title && (
        <p className="text-sm text-gray-500 mb-6">
          Категория:{' '}
          <span className="font-medium">{post.category.title}</span>
        </p>
      )}

        {post.excerpt && (
            <p className="mb-4 text-lg text-gray-700">{post.excerpt}</p>
        )}

        {post.coverImage?.url && (
            <div className="mb-6">
                <Image
                    src={`${CMS_URL}${post.coverImage.url}`}
                    alt={post.title}
                    width={800}
                    height={400}
                    className="w-full h-auto rounded-lg border border-gray-200"
                />
            </div>
        )}

      <section className="mt-6">
        {post.content ? (
          renderLexicalContent(post.content)
        ) : (
          <p className="text-gray-500 text-sm">Нет содержимого</p>
        )}
      </section>
         
      {/* Навигация назад к списку постов */}
      <div className="mb-6 mt-6">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <span className="mr-2">&larr;</span>
          Назад к блогу
        </Link>
      </div>
    </main>
  );
}