// src/app/blog/GalleryBlockRenderer.tsx

import type { GalleryBlock } from '@/lib/cms-types';
import GalleryLightboxClient from './GalleryLightboxClient';

type Props = {
  block: GalleryBlock;
  cmsPublicBaseUrl: string;
};

function resolveCmsImageSrc(base: string, url: string): string {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${base}${url}`;
}

// type guard, чтобы дальше работать с image как с non-null
function hasImage(
  item: GalleryBlock['items'][number],
): item is GalleryBlock['items'][number] & {
  image: NonNullable<GalleryBlock['items'][number]['image']>;
} {
  return Boolean(item.image && item.image.url);
}

export function GalleryBlockRenderer({ block, cmsPublicBaseUrl }: Props) {
  const items = (block.items ?? [])
    .filter(hasImage)
    .map((item) => {
      const src = resolveCmsImageSrc(
        cmsPublicBaseUrl,
        item.image.url as string,
      );

      return {
        src,
        alt: item.image.alt ?? block.blockType,
        caption: item.caption ?? null,
      };
    });

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="my-10">
      <GalleryLightboxClient items={items} />
    </section>
  );
}