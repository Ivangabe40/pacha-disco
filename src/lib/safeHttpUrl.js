export function safeHttpUrl(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  const raw = value.trim();

  try {
    const base = typeof window !== "undefined" ? window.location.origin : "https://pachadisco.com.ar";
    const parsed = new URL(raw, base);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;

    // Keep internal paths relative; normalize all external links to absolute HTTP(S) URLs.
    if (parsed.origin === base && raw.startsWith("/")) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
    return parsed.href;
  } catch {
    return null;
  }
}
