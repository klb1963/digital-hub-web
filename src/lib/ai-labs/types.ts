// src/lib/ai-labs/types.ts

export type InsightPreview = {
  title: string
  summary: string
  why?: string | null
  evidencePosts?: {
    role: 'supporting' | 'counterexample'
    tgMessageId: string
    url: string
    date?: string | null
    views?: number | null
    snippet?: string | null
  }[]
}