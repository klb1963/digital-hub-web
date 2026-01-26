// src/app/api/ai-labs/types.ts

export type ReportLanguage = "EN" | "RU" | "DE"
export type PollStatus = "IDLE" | "CREATED" | "PROCESSING" | "READY" | "FAILED"

export type AnalyzerResultWithChannel = {
  _result?: {
    channel?: string
  }
}