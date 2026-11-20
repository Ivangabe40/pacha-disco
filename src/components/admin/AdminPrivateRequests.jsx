import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { ClipboardList, RefreshCw, CalendarDays, Users, Mail, Phone, MessageSquare, Check, X, Clock3 } from "lucide-react";

const statusOptions = [
  { value: "pendiente", label: "Pendiente", icon: Clock3, color: "#D8B76A" },
  { value: "confirmada", label: "Confirmada", icon: Check, color: "#75BD91" },
  { value: "cancelada", label: "Cancelada", icon: X, color: "#E17D7D" },
];

export default function AdminPrivateRequests() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pendiente");
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await base44.entities.PrivateEventRequest.list("-created_date", 100);
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError("No se pudieron cargar las solicitudes. Verificá los permisos de acceso a esta información.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (item, status) => {
    setSavingId(item.id);
    try {
      await base44.entities.PrivateEventRequest.update(item.id, { status });
      setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, status } : entry));
    } catch {
      setError("No se pudo actualizar el estado de la solicitud.");
    } finally {
      setSavingId(null);
    }
  };

  const visible = items.filter((item) => filter === "todas" || (item.status || "pendiente") === filter);

  return (
    <section className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] mb-2" style={{ color: "#C9A84C" }}>Atención comercial</p>
          <h2 className="text-2xl font-bold text-white">Solicitudes privadas</h2>
          <p className="text-sm text-gray-500 mt-1">Consultas recibidas. Cambiar el estado no confirma disponibilidad ni presupuesto.</p>
        </div>
        <button type="button" onClick={load} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-300" style={{ background: "#151515", border: "1px solid #303030" }}><RefreshCw size={14} /> Actualizar</button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {[{ value: "pendiente", label: "Pendientes" }, { value: "confirmada", label: "Confirmadas" }, { value: "cancelada", label: "Canceladas" }, { value: "todas", label: "Todas" }].map((option) => (
          <button type="button" key={option.value} onClick={() => setFilter(option.value)} className="shrink-0 rounded-full px-4 py-2 text-xs font-semibold" style={{ color: filter === option.value ? "#0b0b0b" : "#aaa", background: filter === option.value ? "#C9A84C" : "#171717", border: "1px solid #303030" }}>{option.label}</button>
        ))}
      </div>

      {error && <div role="alert" className="rounded-xl p-3 text-sm text-red-300" style={{ background: "rgba(180,30,30,.1)", border: "1px solid rgba(180,30,30,.25)" }}>{error}</div>}
      {loading ? <div className="py-12 text-center text-sm text-gray-500">Cargando solicitudes…</div> :
        visible.length === 0 ? <div className="rounded-2xl p-10 text-center" style={{ background: "#111", border: "1px solid #292929" }}><ClipboardList className="mx-auto mb-3 text-gray-600" size={28} /><p className="text-sm text-gray-400">No hay solicitudes en esta categoría.</p></div> :
        <div className="space-y-3">
          {visible.map((item) => {
            const status = statusOptions.find((option) => option.value === (item.status || "pendiente")) || statusOptions[0];
            const StatusIcon = status.icon;
            return (
              <article key={item.id} className="rounded-2xl p-4 md:p-5 space-y-4" style={{ background: "#111", border: "1px solid #292929" }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-white break-words">{item.name || "Sin nombre"}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.event_type || "Tipo de evento no indicado"}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ color: status.color, background: status.color + "18" }}><StatusIcon size={12} />{status.label}</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-400">
                  {item.email && <a className="flex items-center gap-2 min-w-0 break-all" href={`mailto:${item.email}`}><Mail size={14} className="shrink-0" />{item.email}</a>}
                  {item.phone && <a className="flex items-center gap-2" href={`tel:${item.phone}`}><Phone size={14} className="shrink-0" />{item.phone}</a>}
                  {item.date && <p className="flex items-center gap-2"><CalendarDays size={14} />{item.date}</p>}
                  {item.guests && <p className="flex items-center gap-2"><Users size={14} />{item.guests} invitados</p>}
                </div>
                {item.message && <div className="rounded-xl p-3 text-sm text-gray-300 whitespace-pre-wrap" style={{ background: "#090909" }}><MessageSquare size={14} className="inline mr-2 text-gray-500" />{item.message}</div>}
                <div className="flex flex-wrap gap-2 pt-1">
                  {statusOptions.filter((option) => option.value !== status.value).map((option) => (
                    <button type="button" key={option.value} disabled={savingId === item.id} onClick={() => updateStatus(item, option.value)} className="rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50" style={{ color: option.color, background: option.color + "12", border: `1px solid ${option.color}40` }}>{savingId === item.id ? "Guardando…" : `Marcar ${option.label.toLowerCase()}`}</button>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      }
    </section>
  );
}
