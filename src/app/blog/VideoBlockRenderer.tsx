// src/app/blog/VideoBlockRenderer.tsx

import type { VideoBlock } from '@/lib/cms-types';

type Props = {
  block: VideoBlock;
};

function getEmbedUrl(provider: VideoBlock['provider'], url: string): string {
  if (!url) return '';

  if (provider === 'youtube') {
    // поддержим и обычные ссылки, и уже готовые embed
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^?&/]+)/
    );
    const id = match?.[1];
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }

  if (provider === 'vimeo') {
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    const id = match?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : url;
  }

  // other — считаем, что пользователь дал готовый embed-URL
  return url;
}

export function VideoBlockRenderer({ block }: Props) {
  const src = getEmbedUrl(block.provider, block.url);
  if (!src) return null;

  return (
    <section className="my-10">
      {block.title && (
        <h3 className="mb-3 text-lg font-semibold text-neutral-50">
          {block.title}
        </h3>
      )}

      <div className="overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-950/80 shadow-[0_18px_60px_rgba(0,0,0,0.7)]">
        <div className="relative aspect-video w-full">
          <iframe
            src={src}
            title={block.title ?? 'Video'}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
        {block.caption && (
          <p className="px-4 py-3 text-sm text-neutral-400">
            {block.caption}
          </p>
        )}
      </div>
    </section>
  );
}