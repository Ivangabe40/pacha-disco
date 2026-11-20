// Validación centralizada de URLs antes de usarlas en href, src o window.open.
// Solo se aceptan http(s) absolutas, rutas internas relativas y medios https.

const CONTROL_CHARS = /[\u0000-\u001F\u007F-\u009F]/;
const SAFE_ABSOLUTE = /^https?:\/\/[^\s]+$/i;
const SAFE_INTERNAL = /^\/(?!\/)[^\s]*$/;
const SAFE_MEDIA = /^https:\/\/[^\s]+$/i;

export function safeExternalUrl(url) {
  if (!url || typeof url !== "string") return null;
  const value = url.trim();
  if (!value || CONTROL_CHARS.test(value)) return null;
  if (SAFE_ABSOLUTE.test(value)) return value;
  if (SAFE_INTERNAL.test(value)) return value;
  return null;
}

export function safeMediaUrl(url) {
  if (!url || typeof url !== "string") return null;
  const value = url.trim();
  if (!value || CONTROL_CHARS.test(value)) return null;
  return SAFE_MEDIA.test(value) ? value : null;
}