// src/app/blog/BlogContentRenderer.tsx

'use client';

import type { LayoutBlock } from '@/lib/cms-types';
import { TextBlockRenderer } from './TextBlockRenderer';
import { QuoteBlockRenderer } from './QuoteBlockRenderer';
import { ImageBlockRenderer } from './ImageBlockRenderer';
import { GalleryBlockRenderer } from './GalleryBlockRenderer';
import { VideoBlockRenderer } from './VideoBlockRenderer';

type Props = {
  layout?: LayoutBlock[] | null;
  cmsPublicBaseUrl: string;
};

export function BlogContentRenderer({ layout, cmsPublicBaseUrl }: Props) {
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
                cmsPublicBaseUrl={cmsPublicBaseUrl}
              />
            );

          case 'galleryBlock':
            return (
              <GalleryBlockRenderer
                key={block.id ?? `gallery-${index}`}
                block={block}
                cmsPublicBaseUrl={cmsPublicBaseUrl}
              />
            );

          case 'videoBlock':
            return (
              <VideoBlockRenderer
                key={block.id ?? `video-${index}`}
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