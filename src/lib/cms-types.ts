// src/lib/cms-types.ts
// ✅ SAFE FOR CLIENT IMPORTS (no env, no fetch)

// ─────────────────────────────────────────────
// Типы для layout-блоков
// ─────────────────────────────────────────────

export type CmsImage = {
  id?: number | string;
  url?: string | null;
  alt?: string | null;
} | null;

export type TextBlockLayout = {
  id?: string;
  blockType: 'textBlock';
  content: unknown;
};

export type QuoteBlockLayout = {
  id?: string;
  blockType: 'quoteBlock';
  quote: string;
  author?: string | null;
};

export type ImageBlockLayout = {
  id?: string;
  blockType: 'imageBlock';
  image: {
    id: number;
    url?: string | null;
  };
  caption?: string | null;
};

export type GalleryBlock = {
  blockType: 'galleryBlock';
  id: string;
  layout: 'grid' | 'carousel';
  items: {
    id: string;
    image: CmsImage;
    caption?: string | null;
  }[];
};

export type VideoBlock = {
  blockType: 'videoBlock';
  id: string;
  provider: 'youtube' | 'vimeo' | 'other';
  url: string;
  title?: string | null;
  caption?: string | null;
};

export type LayoutBlock =
  | TextBlockLayout
  | QuoteBlockLayout
  | ImageBlockLayout
  | GalleryBlock
  | VideoBlock;

// ─────────────────────────────────────────────
// Базовые типы для работы с Payload
// ─────────────────────────────────────────────

export type PayloadListResponse<T> = {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
};

export type Category = {
  id: number;
  title?: string;
  slug?: string;
};

export type Post = {
  id: number;
  title: string;
  slug: string;
  tags?: string[];
  excerpt?: string | null;
  publishDate?: string | null;
  category?:
    | number
    | {
        id: number;
        title?: string;
        slug?: string;
      }
    | null;
  coverImage?:
    | {
        id: number;
        url?: string | null;
      }
    | null;
  content?: unknown;
  layout?: LayoutBlock[] | null;
};

// ─────────────────────────────────────────────
// IT Worries Quiz (Payload Global)
// ─────────────────────────────────────────────

export type ItWorriesModeKey = 'TEST' | 'FORMAL' | 'JOKES';

export type ItWorriesSeverity = 'GREEN' | 'YELLOW' | 'RED' | 'RED_HOT';

export type ItWorriesQuestionKey =
  | 'hosting'
  | 'domains'
  | 'backups'
  | 'budget'
  | 'access'
  | 'ownership';

export type ItWorriesMode = {
  id?: string;
  modeKey: ItWorriesModeKey;
  label: string;
  description: string;
  badge?: string | null;
};

export type ItWorriesLocalizedText = {
  test: string;
  formal: string;
  jokes: string;
};

export type ItWorriesAnswer = {
  id?: string;
  severity: ItWorriesSeverity;
  label: ItWorriesLocalizedText;
};

export type ItWorriesQuestion = {
  id?: string;
  questionKey: ItWorriesQuestionKey;
  prompt: ItWorriesLocalizedText;
  answers: ItWorriesAnswer[];
};

export type ItWorriesResult = {
  title: string;
  body: unknown; // richText lexical JSON
  ctaLabel: string;
  ctaHref: string;
};

export type ItWorriesQuizGlobal = {
  id?: number | string;
  heroTitle: string;
  heroSubtitle?: string | null;
  disclaimer?: unknown;
  modes: ItWorriesMode[];
  questions: ItWorriesQuestion[];
  results: {
    green: ItWorriesResult;
    yellow: ItWorriesResult;
    red: ItWorriesResult;
  };
  scoring: {
    greenMaxScore: number;
    yellowMaxScore: number;
    redHotForcesAtLeastYellow?: boolean;
    ownershipRedHotForcesRed?: boolean;
  };
};
