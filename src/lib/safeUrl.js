// Only allow http(s) links or app-relative paths before rendering into href.
export function safeExternalUrl(url) {
  if (!url || typeof url !== "string") return null;
  const value = url.trim();
  if (/^https?:\/\//i.test(value)) return value;
  if (/^\/(?!\/)/.test(value)) return value;
  return null;
}