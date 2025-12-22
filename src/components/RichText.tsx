// src/components/RichText.tsx

'use client';

import { RichText } from '@payloadcms/richtext-lexical/react';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';

type Props = {
  content?: SerializedEditorState | null;
  className?: string;
};

export function RichTextRenderer({ content, className }: Props) {
  if (!content) return null;

  return (
    <div className={className}>
      <RichText data={content} />
    </div>
  );
}