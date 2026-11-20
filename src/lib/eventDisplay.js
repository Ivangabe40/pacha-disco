// Utilidades de presentación pública de eventos de Pachá Disco.
//
// REGLA COMERCIAL DE FECHAS: la noche se comunica como "SÁBADO" aunque la
// actividad continúe durante la madrugada del domingo. Los eventos guardados
// con hora de madrugada (menor a 12:00) se muestran como la noche del día
// anterior, para que el cliente nunca vea "domingo".
export function getDisplayDate(event) {
  const d = new Date(event.date);
  if (!isNaN(d.getTime()) && d.getHours() < 12) {
    d.setDate(d.getDate() - 1);
  }
  return d;
}

// Fase operativa real de un evento, derivada de la fecha (no del campo status,
// que se usó históricamente con otros significados):
//   proximo   → aún no empezó
//   vigente   > transcurriendo (esta noche)
//   finalizado → ya terminó (incluye eventos históricos con status "agotado")
//   cancelado → cancelado explícitamente
export function getEventPhase(event, now = new Date()) {
  if (event.status === "cancelado") return "cancelado";
  const raw = new Date(event.date);
  if (isNaN(raw.getTime())) return "finalizado";
  const start = new Date(raw.getTime() - 30 * 60000);
  const end = new Date(raw.getTime() + 7 * 3600000); // cierre ~06:30 de la madrugada
  if (now >= end) return "finalizado";
  if (now >= start) return "vigente";
  return "proximo";
}

// 23:59 es un marcador administrativo de fecha, no una hora anunciable.
export function hasConfirmedEventTime(event) {
  const raw = new Date(event?.date);
  return !isNaN(raw.getTime()) && !(raw.getHours() === 23 && raw.getMinutes() === 59);
}

export const PHASE_LABELS = {
  proximo: "Próximo",
  vigente: "Esta noche",
  finalizado: "Finalizado",
  cancelado: "Cancelado",
};