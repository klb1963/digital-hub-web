// src/app/blog/GalleryLightboxClient.tsx

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

type Item = {
  src: string;
  alt: string;
  caption?: string | null;
};

type Props = {
  items: Item[];
};

export default function GalleryLightboxClient({ items }: Props) {
  const safeItems = useMemo(() => items.filter((i) => Boolean(i.src)), [items]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const len = safeItems.length;
  const hasMany = len > 1;
  const current = safeItems[index];

  const close = useCallback(() => setOpen(false), []);

  const openAt = useCallback((i: number) => {
    setIndex(i);
    setOpen(true);
  }, []);

  const prev = useCallback(() => {
    if (len <= 1) return;
    setIndex((i) => (i - 1 + len) % len);
  }, [len]);

  const next = useCallback(() => {
    if (len <= 1) return;
    setIndex((i) => (i + 1) % len);
  }, [len]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (!hasMany) return;
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, hasMany, close, prev, next]);

  // блокируем скролл под модалкой
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (len === 0) return null;

  return (
    <>
      <div
        className="
          grid gap-4
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        {safeItems.map((item, i) => (
          <figure
            key={`${item.src}-${i}`}
            className="overflow-hidden rounded-2xl border border-neutral-800/70 bg-neutral-950/60"
          >
            <button
              type="button"
              onClick={() => openAt(i)}
              className="block w-full text-left"
              aria-label="Open image"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>
            </button>

            {item.caption && (
              <figcaption className="px-3 py-2 text-xs text-neutral-400">
                {item.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {open && current && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onMouseDown={(e) => {
            // клик по затемнению закрывает
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="absolute inset-0 bg-black/80" />

          <div className="relative z-[1001] w-[min(1100px,92vw)]">
            {/* картинка */}
            <div className="relative overflow-hidden rounded-2xl border border-neutral-700 bg-black">
              <div className="relative h-[min(78vh,720px)] w-full">
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="92vw"
                  className="object-contain"
                  priority
                />
              </div>

              {(current.caption || hasMany) && (
                <div className="flex items-center justify-between gap-3 border-t border-neutral-800 px-4 py-3">
                  <div className="min-w-0 text-sm text-neutral-300">
                    {current.caption ?? ''}
                  </div>
                  {hasMany && (
                    <div className="shrink-0 text-xs text-neutral-400">
                      {index + 1}/{len}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* close */}
            <button
              type="button"
              onClick={close}
              className="absolute -top-4 -right-4 rounded-full border border-neutral-700 bg-neutral-950/90 px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-900"
              aria-label="Close"
            >
              ✕
            </button>

            {/* nav */}
            {hasMany && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-2xl border border-neutral-700 bg-neutral-950/70 px-3 py-3 text-neutral-200 hover:bg-neutral-900"
                  aria-label="Previous image"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-0 top-1/2 -translate-y-1/2 rounded-l-2xl border border-neutral-700 bg-neutral-950/70 px-3 py-3 text-neutral-200 hover:bg-neutral-900"
                  aria-label="Next image"
                >
                  →
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}