// src/app/blog/TagCloud.tsx

import Link from 'next/link';

export type TagStat = {
  label: string;
  slug: string;
  count: number;
  level: 1 | 2 | 3;
};

export function TagCloud({
  tags,
  activeTag,
}: {
  tags: TagStat[];
  activeTag?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => {
        const isActive = tag.slug === activeTag;

        const sizeClass =
          tag.level === 1
            ? 'text-xs'
            : tag.level === 2
            ? 'text-sm'
            : 'text-base font-semibold';

        return (
          <Link
            key={tag.slug}
            href={
              isActive
                ? '/blog'
                : `/blog?tag=${encodeURIComponent(tag.slug)}`
            }
            className={[
              'rounded-full border px-3 py-1 transition',
              sizeClass,
              isActive
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100',
            ].join(' ')}
          >
            {tag.label}
          </Link>
        );
      })}
    </div>
  );
}