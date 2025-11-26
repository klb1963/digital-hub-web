// src/app/blog/ImageBlockRenderer.tsx

'use client';

import Image from 'next/image';
import type { ImageBlockLayout } from '@/lib/cms';

type Props = {
  block: ImageBlockLayout;
};

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? '';

export function ImageBlockRenderer({ block }: Props) {
  const url = block.image?.url;
  if (!url) return null;

  return (
    <figure className="my-10">
      <Image
        src={`${CMS_URL}${url}`}
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