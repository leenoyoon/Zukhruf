export function pickMediaUrl(...candidates) {
  for (const url of candidates) {
    if (!url) continue;
    if (url.includes("127.0.0.1") || url.includes("localhost")) continue;
    // HF / production: فضّل https عشان CORS يمر
    return url.replace(/^http:\/\//i, "https://");
  }
  const fallback = candidates.find(Boolean) || null;
  return fallback ? fallback.replace(/^http:\/\//i, "https://") : null;
}