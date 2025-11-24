// src/app/blog/TextBlockRenderer.tsx

'use client';

import { RichText } from '@payloadcms/richtext-lexical/react';
import type { TextBlockLayout } from '@/lib/cms';

export type TextBlock = TextBlockLayout;

export function TextBlockRenderer({ block }: { block: TextBlock }) {
  if (!block?.content) return null;

  return (
    <div className="prose prose-neutral max-w-none">
      <RichText data={block.content} />
    </div>
  );
}