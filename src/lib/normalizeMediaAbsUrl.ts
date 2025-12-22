// /src/lib/normalizeMediaAbsUrl.ts

export function normalizeMediaAbsUrl(url?: string) {
  if (!url) return undefined;

  // Payload иногда отдаёт double-encoded UTF-8 (%25D0%25...)
  if (!url.includes('%25')) return url;

  try {
    return decodeURIComponent(url);
  } catch {
    return url;
  }
}