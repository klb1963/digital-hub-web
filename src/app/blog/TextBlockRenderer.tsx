// src/app/blog/TextBlockRenderer.tsx

'use client';

import type { TextBlockLayout } from '@/lib/cms';

type Props = {
  block: TextBlockLayout;
};

// Минимальные типы под Lexical JSON
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

export function TextBlockRenderer({ block }: Props) {
  const content = block.content as unknown as LexicalRootJSON | null;
  const root = content?.root;
  const paragraphs = Array.isArray(root?.children) ? root!.children! : [];

  if (!paragraphs.length) return null;

  return (
    <div className="prose prose-invert max-w-none">
      {paragraphs.map((node, idx) => {
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