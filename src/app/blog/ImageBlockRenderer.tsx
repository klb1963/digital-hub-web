// src/app/blog/ImageBlockRenderer.tsx

'use client';

import Image from 'next/image';
import type { ImageBlockLayout } from '@/lib/cms-types';

type Props = {
  block: ImageBlockLayout;
  cmsPublicBaseUrl: string;
};

function resolveCmsImageSrc(base: string, url: string) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${base}${url}`;
}

export function ImageBlockRenderer({ block, cmsPublicBaseUrl }: Props) {
  const url = block.image?.url;
  if (!url) return null;

  const src = resolveCmsImageSrc(cmsPublicBaseUrl, url);

  return (
    <figure className="my-10">
      <Image
        src={src}
        alt={block.caption ?? 'Image'}
        width={1200}
        height={800}
        className="w-full h-auto rounded-lg border border-neutral-200"
      />

      {block.caption && (
        <figcaption className="mt-2 text-sm text-center text-neutral-600">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}