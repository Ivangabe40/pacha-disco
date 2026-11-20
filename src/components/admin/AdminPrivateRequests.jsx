import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Mail, Phone, Calendar, Users, Loader2, CheckCircle2, XCircle, RotateCcw } from "lucide-react";

const FILTERS = [
  { id: "pendiente", label: "Pendientes" },
  { id: "confirmada", label: "Confirmadas" },
  { id: "cancelada", label: "Canceladas" },
];

const STATUS_ACTIONS = {
  pendiente: [
    { status: "confirmada", label: "Confirmar", icon: CheckCircle2, color: "#22c55e" },
    { status: "cancelada", label: "Cancelar", icon: XCircle, color: "#ef4444" },
  ],
  confirmada: [
    { status: "cancelada", label: "Cancelar", icon: XCircle, color: "#ef4444" },
    { status: "pendiente", label: "Volver a pendiente", icon: RotateCcw, color: "#C9A84C" },
  ],
  cancelada: [
    { status: "pendiente", label: "Volver a pendiente", icon: RotateCcw, color: "#C9A84C" },
  ],
};

export default function AdminPrivateRequests() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("pendiente");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const page = await base44.entities.PrivateEventRequest.filter(
        { status: filter },
        { sort: "-created_date", limit: 50 }
      );
      setItems(page.items || []);
    } catch {
      setItems([]);
      setFeedback({ type: "error", text: "No se pudieron cargar las solicitudes." });
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const changeStatus = async (item, status) => {
    setUpdating(item.id);
    setFeedback(null);
    try {
      await base44.entities.PrivateEventRequest.update(item.id, { status });
      setFeedback({ type: "ok", text: `Solicitud de ${item.name} actualizada a "${status}".` });
      setConfirming(null);
      await load();
    } catch {
      setFeedback({ type: "error", text: "No se pudo actualizar la solicitud." });
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto">
        {FILTERS.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className="px-3 py-2 rounded-lg text-xs font-semibold shrink-0 transition-colors"
            style={filter === f.id
              ? { background: "rgba(201,168,76,0.12)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.4)" }
              : { color: "#777", border: "1px solid #222" }}>
            {f.label}
          </button>
        ))}
      </div>

      {feedback && (
        <p className="text-xs px-3 py-2 rounded-lg"
          style={feedback.type === "ok"
            ? { background: "rgba(34,197,94,0.08)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.25)" }
            : { background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" }}>
          {feedback.text}
        </p>
      )}

      {loading ? (
        <div className="py-10 flex justify-center">
          <Loader2 size={22} className="animate-spin" style={{ color: "#C9A84C" }} />
        </div>
      ) : items.length === 0 ? (
        <p className="text-gray-600 text-sm py-8 text-center">No hay solicitudes en este estado.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl p-4" style={{ background: "#111", border: "1px solid #222" }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{item.name}</p>
                  <p className="text-gray-500 text-xs">
                    {item.event_type || "Evento privado"} · recibida {item.created_date ? new Date(item.created_date).toLocaleDateString("es-AR") : "—"}
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded shrink-0"
                  style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C" }}>
                  {item.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mb-2">
                <a href={`mailto:${item.email}`} className="flex items-center gap-1 hover:text-white">
                  <Mail size={11} /> {item.email}
                </a>
                {item.phone && (
                  <a href={`tel:${item.phone}`} className="flex items-center gap-1 hover:text-white">
                    <Phone size={11} /> {item.phone}
                  </a>
                )}
                {item.date && (
                  <span className="flex items-center gap-1"><Calendar size={11} /> {item.date}</span>
                )}
                {item.guests ? (
                  <span className="flex items-center gap-1"><Users size={11} /> {item.guests} invitados</span>
                ) : null}
              </div>

              {item.message && (
                <p className="text-gray-400 text-xs leading-relaxed mb-3 whitespace-pre-line">{item.message}</p>
              )}

              {confirming === item.id ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-400">
                    ¿Confirmás el cambio de estado?
                  </span>
                  {STATUS_ACTIONS[item.status]?.map(({ status, label, icon: Icon, color }) => (
                    <button key={status} onClick={() => changeStatus(item, status)} disabled={updating === item.id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold"
                      style={{ color, border: `1px solid ${color}55` }}>
                      {updating === item.id ? <Loader2 size={11} className="animate-spin" /> : <Icon size={11} />}
                      {label}
                    </button>
                  ))}
                  <button onClick={() => setConfirming(null)} className="text-xs text-gray-500 underline">
                    Volver
                  </button>
                </div>
              ) : (
                <button onClick={() => setConfirming(item.id)}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg"
                  style={{ color: "#C9A84C", border: "1px solid rgba(201,168,76,0.35)" }}>
                  Cambiar estado
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}