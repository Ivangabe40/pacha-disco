import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, XCircle, Clock, Crown, PartyPopper, Phone, Mail, Calendar, Users, MessageSquare, RefreshCw } from "lucide-react";

const STATUS_CONFIG = {
  pendiente: { label: "Pendiente", color: "#C9A84C", bg: "rgba(201,168,76,0.1)", icon: Clock },
  confirmada: { label: "Confirmada", color: "#22c55e", bg: "rgba(34,197,94,0.1)", icon: CheckCircle2 },
  cancelada: { label: "Cancelada", color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: XCircle },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pendiente;
  const Icon = cfg.icon;
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}33` }}>
      <Icon size={11} />{cfg.label}
    </span>
  );
}

function RequestRow({ item, type, onUpdate }) {
  const [updating, setUpdating] = useState(false);

  const update = async (status) => {
    setUpdating(true);
    const entity = type === "vip" ? base44.entities.VIPReservation : base44.entities.PrivateEventRequest;
    await entity.update(item.id, { status });
    onUpdate();
    setUpdating(false);
  };

  const isPending = item.status === "pendiente";

  return (
    <div className="rounded-xl p-4 space-y-3 transition-all"
      style={{ background: "#111", border: `1px solid ${isPending ? "rgba(201,168,76,0.2)" : "#1e1e1e"}` }}>

      {/* Header row */}
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-sm">{item.name}</span>
            <StatusBadge status={item.status} />
          </div>
          <div className="flex flex-wrap gap-3 mt-1.5">
            {item.phone && (
              <a href={`tel:${item.phone}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                <Phone size={10} />{item.phone}
              </a>
            )}
            {item.email && (
              <a href={`mailto:${item.email}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                <Mail size={10} />{item.email}
              </a>
            )}
          </div>
        </div>

        {/* Actions */}
        {isPending && (
          <div className="flex gap-2 shrink-0">
            <button onClick={() => update("confirmada")} disabled={updating}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>
              <CheckCircle2 size={12} /> Aprobar
            </button>
            <button onClick={() => update("cancelada")} disabled={updating}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)" }}>
              <XCircle size={12} /> Rechazar
            </button>
          </div>
        )}
        {!isPending && (
          <button onClick={() => update("pendiente")} disabled={updating}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-gray-600 hover:text-gray-400 transition-all"
            style={{ border: "1px solid #2a2a2a" }}>
            <RefreshCw size={10} /> Reabrir
          </button>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
        {(item.event_date || item.date) && (
          <span className="flex items-center gap-1">
            <Calendar size={10} />
            {new Date(item.event_date || item.date).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}
          </span>
        )}
        {item.guests && (
          <span className="flex items-center gap-1">
            <Users size={10} />{item.guests} personas
          </span>
        )}
        {item.sector && (
          <span className="flex items-center gap-1">
            <Crown size={10} />{item.sector}
          </span>
        )}
        {item.event_type && (
          <span className="flex items-center gap-1">
            <PartyPopper size={10} />{item.event_type}
          </span>
        )}
      </div>

      {item.message && (
        <div className="flex items-start gap-1.5 text-xs text-gray-600">
          <MessageSquare size={10} className="mt-0.5 shrink-0" />
          <span className="italic">"{item.message}"</span>
        </div>
      )}

      <div className="text-xs text-gray-700">
        Recibida: {new Date(item.created_date).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
}

export default function AdminReservations() {
  const [vipList, setVipList] = useState([]);
  const [privateList, setPrivateList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("vip");
  const [filter, setFilter] = useState("pendiente");

  const load = async () => {
    setLoading(true);
    const [vip, priv] = await Promise.all([
      base44.entities.VIPReservation.list("-created_date"),
      base44.entities.PrivateEventRequest.list("-created_date"),
    ]);
    setVipList(vip);
    setPrivateList(priv);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const currentList = (activeTab === "vip" ? vipList : privateList)
    .filter(i => filter === "todas" || i.status === filter);

  const pendingVip = vipList.filter(i => i.status === "pendiente").length;
  const pendingPrivate = privateList.filter(i => i.status === "pendiente").length;

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {[
          { id: "vip", label: "Reservas VIP", icon: Crown, pending: pendingVip },
          { id: "private", label: "Eventos Privados", icon: PartyPopper, pending: pendingPrivate },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={activeTab === t.id
                ? { background: "rgba(232,0,29,0.12)", color: "#E8001D", border: "1px solid rgba(232,0,29,0.35)" }
                : { background: "#111", color: "#666", border: "1px solid #1e1e1e" }}>
              <Icon size={14} />
              {t.label}
              {t.pending > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-xs font-black"
                  style={{ background: "#E8001D", color: "#fff", minWidth: "18px", textAlign: "center" }}>
                  {t.pending}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {["pendiente", "confirmada", "cancelada", "todas"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
            style={filter === f
              ? { background: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.35)" }
              : { background: "#111", color: "#555", border: "1px solid #1e1e1e" }}>
            {f}
          </button>
        ))}
        <button onClick={load} className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-gray-600 hover:text-gray-400 transition-all"
          style={{ border: "1px solid #1e1e1e" }}>
          <RefreshCw size={11} /> Actualizar
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full animate-spin" style={{ border: "2px solid #1a1a1a", borderTop: "2px solid #E8001D" }} />
        </div>
      ) : currentList.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <Clock size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No hay solicitudes {filter !== "todas" ? `"${filter}"` : ""} en esta categoría.</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {currentList.map(item => (
            <RequestRow key={item.id} item={item}
              type={activeTab === "vip" ? "vip" : "private"}
              onUpdate={load}
            />
          ))}
        </div>
      )}
    </div>
  );
}