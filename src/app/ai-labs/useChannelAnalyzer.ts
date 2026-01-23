// src/app/ai-labs/useChannelAnalyzer.ts

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type ReportLanguage = "EN" | "RU" | "DE";
export type PollStatus = "IDLE" | "CREATED" | "PROCESSING" | "READY" | "FAILED";

type CreateResponse = { requestId: string };
type CreateErrorResponse = { error?: unknown; details?: unknown; message?: unknown };
type CreateApiResponse = CreateResponse | CreateErrorResponse;

type PollReadyResponse = { status: "READY"; result: unknown; meta?: unknown };
type PollNotReadyResponse = { status: string; error?: unknown | null; message?: unknown };
type PollResponse = PollReadyResponse | PollNotReadyResponse;

function isPollReady(r: PollResponse): r is PollReadyResponse {
  return r.status === "READY";
}
function isCreateOk(r: CreateApiResponse): r is CreateResponse {
  return typeof (r as { requestId?: unknown }).requestId === "string";
}

export function normalizeChannelInput(input: string) {
  const s = input.trim();
  return s.replace(/^https?:\/\/t\.me\//i, "").replace(/^@/, "");
}

function errToText(x: unknown): string {
  if (!x) return "";
  if (typeof x === "string") return x;
  if (x instanceof Error) return x.message;
  try {
    return JSON.stringify(x);
  } catch {
    return String(x);
  }
}

export function useChannelAnalyzer() {
  const [channelInput, setChannelInput] = useState("");
  const [reportLanguage, setReportLanguage] = useState<ReportLanguage>("EN");
  const [depth, setDepth] = useState<number>(200);
  const [purposeHint] = useState<string>("ui-open-v1");

  const [requestId, setRequestId] = useState<string | null>(null);
  const [status, setStatus] = useState<PollStatus>("IDLE");
  const [result, setResult] = useState<unknown>(null);
  const [meta, setMeta] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pollingTimerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const canSubmit = useMemo(() => {
    const s = channelInput.trim();
    return s.length > 0 && depth >= 200 && depth <= 500;
  }, [channelInput, depth]);

  const isBusy = useMemo(() => status === "CREATED" || status === "PROCESSING", [status]);

  function stopPolling() {
    if (pollingTimerRef.current) {
      window.clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }

  async function pollOnce(id: string) {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch(`/api/ai-labs/channel-analyzer/${id}`, {
        method: "GET",
        cache: "no-store",
        signal: ac.signal,
      });

      const data = (await res.json()) as PollResponse;

      if (!res.ok) {
        setStatus("FAILED");
        const err = "error" in data && data.error != null ? data.error : "POLL_FAILED";
        const msg = "message" in data && data.message != null ? data.message : "";
        setError(`${errToText(err)}${msg ? `: ${errToText(msg)}` : ""}`.trim());
        stopPolling();
        return;
      }

      if (isPollReady(data)) {
        setStatus("READY");
        setResult(data.result ?? null);
        setMeta(data.meta ?? null);
        setError(null);
        stopPolling();
        return;
      }

      setStatus("PROCESSING");
    } catch (e: unknown) {
      if (typeof e === "object" && e !== null && "name" in e) {
        const name = (e as { name?: unknown }).name;
        if (name === "AbortError") return;
      }
      setStatus("FAILED");
      setError(e instanceof Error ? e.message : "Polling error");
      stopPolling();
    }
  }

  function startPolling(id: string) {
    stopPolling();
    setStatus("PROCESSING");
    void pollOnce(id);
    pollingTimerRef.current = window.setInterval(() => void pollOnce(id), 1500);
  }

  async function submit() {
    if (!canSubmit || isSubmitting) return;

    if (requestId && (status === "CREATED" || status === "PROCESSING")) {
      startPolling(requestId);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setResult(null);
    setMeta(null);

    const payload = {
      channelInput: normalizeChannelInput(channelInput),
      reportLanguage,
      depth,
      purposeHint: purposeHint.trim() || undefined,
    };

    try {
      const res = await fetch("/api/ai-labs/channel-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as CreateApiResponse;

      if (!res.ok) {
        setStatus("FAILED");
        const err = "error" in data && data.error != null ? data.error : "CREATE_FAILED";
        const details =
          "details" in data && data.details != null
            ? data.details
            : "message" in data && data.message != null
              ? data.message
              : "";
        setError(`${errToText(err)}${details ? `: ${errToText(details)}` : ""}`.trim());
        return;
      }

      if (!isCreateOk(data)) {
        setStatus("FAILED");
        setError("CREATE_FAILED: invalid response shape");
        return;
      }

      const id = String(data.requestId);
      setRequestId(id);
      setStatus("CREATED");
      startPolling(id);
    } catch (e: unknown) {
      setStatus("FAILED");
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => () => stopPolling(), []);

  return {
    // inputs
    channelInput,
    setChannelInput,
    reportLanguage,
    setReportLanguage,
    depth,
    setDepth,

    // state
    requestId,
    status,
    result,
    meta,
    error,
    isSubmitting,
    canSubmit,
    isBusy,

    // actions
    submit,
  };
}