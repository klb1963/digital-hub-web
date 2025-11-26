// src/app/blog/GalleryBlockRenderer.tsx

import Image from 'next/image';
import type { GalleryBlock } from '@/lib/cms';

type Props = {
  block: GalleryBlock;
};

// type guard, чтобы дальше работать с image как с non-null
function hasImage(
  item: GalleryBlock['items'][number],
): item is GalleryBlock['items'][number] & {
  image: NonNullable<GalleryBlock['items'][number]['image']>;
} {
  return Boolean(item.image && item.image.url);
}

export function GalleryBlockRenderer({ block }: Props) {
  const items = (block.items ?? []).filter(hasImage);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="my-10">
      <div
        className="
          grid gap-4
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        {items.map((item) => {
          const { image } = item;
          const src = image.url as string; // безопасно: прошли type guard
          const alt = image.alt ?? block.blockType;

          return (
            <figure
              key={item.id}
              className="overflow-hidden rounded-2xl border border-neutral-800/70 bg-neutral-950/60"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>

              {item.caption && (
                <figcaption className="px-3 py-2 text-xs text-neutral-400">
                  {item.caption}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>
    </section>
  );
}