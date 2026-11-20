// Conversiones de Google Ads (AW-18261261008).
// Se disparan únicamente ante la acción real del usuario y una sola vez por carga,
// para evitar conversiones duplicadas en navegación SPA o doble clic.

const CONVERSIONS = {
  como_llegar: "AW-18261261008/yweyCMC118MCEND100NE",
  contacto: "AW-18261261008/14t-CMO118MCEND100NE",
};

const fired = new Set();

export function trackConversion(name) {
  const sendTo = CONVERSIONS[name];
  if (!sendTo || typeof window === "undefined" || fired.has(name)) return;
  if (typeof window.gtag !== "function") return;
  fired.add(name);
  window.gtag("event", "conversion", { send_to: sendTo });
}