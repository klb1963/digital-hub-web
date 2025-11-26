// src/app/blog/BlogContentRenderer.tsx

'use client';

import type { LayoutBlock } from '@/lib/cms';
import { TextBlockRenderer } from './TextBlockRenderer';
import { QuoteBlockRenderer } from './QuoteBlockRenderer';
import { ImageBlockRenderer } from './ImageBlockRenderer';

type Props = {
  layout?: LayoutBlock[] | null;
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

          case 'quoteBlock':
            return (
              <QuoteBlockRenderer
                key={block.id ?? `quote-${index}`}
                block={block}
              />
            );

          case 'imageBlock':
            return (
              <ImageBlockRenderer
                key={block.id ?? `image-${index}`}
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