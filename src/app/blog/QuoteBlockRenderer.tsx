// src/app/blog/QuoteBlockRenderer.tsx

'use client';

import type { QuoteBlockLayout } from '@/lib/cms-types';

type Props = {
  block: QuoteBlockLayout;
};

export function QuoteBlockRenderer({ block }: Props) {
  if (!block.quote) return null;

  return (
    <figure className="my-8 border-l-4 border-neutral-300 pl-4 italic text-neutral-800">
      <p className="text-lg leading-relaxed">“{block.quote}”</p>
      {block.author && (
        <figcaption className="mt-2 text-sm font-medium text-neutral-500">
          — {block.author}
        </figcaption>
      )}
    </figure>
  );
}