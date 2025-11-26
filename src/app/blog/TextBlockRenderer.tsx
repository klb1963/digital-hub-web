// src/app/blog/TextBlockRenderer.tsx

'use client';

import { RichText } from '@payloadcms/richtext-lexical/react';
import type { TextBlockLayout } from '@/lib/cms';

type Props = {
  block: TextBlockLayout;
};

export function TextBlockRenderer({ block }: Props) {
  if (!block?.content) return null;

  return (
    <div className="prose prose-neutral max-w-none">
      <RichText data={block.content} />
    </div>
  );
}