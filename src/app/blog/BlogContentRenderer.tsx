// src/app/blog/BlogContentRenderer.tsx
'use client';

import type { TextBlock } from './TextBlockRenderer';
import { TextBlockRenderer } from './TextBlockRenderer';

// Пока у нас единственный вид блока — текстовый.
// Потом можно сделать union: type Block = TextBlock | QuoteBlock | ImageBlock ...
type Block = TextBlock;

type Props = {
  layout?: Block[] | null;
};

export function BlogContentRenderer({ layout }: Props) {
  if (!layout || layout.length === 0) return null;

  return (
    <div className="space-y-8">
      {layout.map((block, index) => {
        switch (block.blockType) {
          case 'textBlock':
            return (
              <TextBlockRenderer
                key={block.id ?? `text-${index}`}
                block={block}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}