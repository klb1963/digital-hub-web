// src/app/blog/TextBlockRenderer.tsx

'use client';

import type { TextBlockLayout } from '@/lib/cms-types';
import { RichTextRenderer } from '@/components/RichText';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';

type Props = {
  block: TextBlockLayout;
};

export function TextBlockRenderer({ block }: Props) {
   const content =
    (block.content as SerializedEditorState | null) ?? null;

  return <RichTextRenderer content={content} />;
}