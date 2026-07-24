import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Ticket, DollarSign, Package, Clock, Save, Check, TrendingUp, Info } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AdminTicketSales() {
  const [events, setEvents] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [edits, setEdits] = useState({});

  const load = async () => {
    try {
      const [eventData, orderData] = await Promise.all([
        base44.entities.Event.list("-date"),
        base44.entities.TicketOrder.list("-created_date"),
      ]);
      setEvents(eventData);
      setOrders(orderData);
      const newEdits = {};
      eventData.forEach(e => {
        newEdits[e.id] = {
          ticket_price: e.ticket_price || "",
          ticket_price_door: e.ticket_price_door || "",
          capacity: e.capacity || "",
          tickets_enabled: e.tickets_enabled !== false,
        };
      });
      setEdits(newEdits);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const approved = orders.filter(o => o.status === "approved");
  const totalSold = approved.reduce((s, o) => s + (o.quantity || 0), 0);
  const totalRevenue = approved.reduce((s, o) => s + (o.total || 0), 0);
  const pendingCount = orders.filter(o => o.status === "pending").length;

  const handleSave = async (eventId) => {
    const e = edits[eventId];
    if (!e) return;
    setSavingId(eventId);
    try {
      await base44.entities.Event.update(eventId, {
        ticket_price: e.ticket_price ? Number(e.ticket_price) : null,
        ticket_price_door: e.ticket_price_door ? Number(e.ticket_price_door) : null,
        capacity: e.capacity ? Number(e.capacity) : null,
        tickets_enabled: e.tickets_enabled,
      });
      setSavedId(eventId);
      setTimeout(() => setSavedId(null), 2000);
      load();
    } catch { alert("Error al guardar los cambios"); }
    finally { setSavingId(null); }
  };

  const updateEdit = (eventId, field, value) => {
    setEdits(prev => ({ ...prev, [eventId]: { ...prev[eventId], [field]: value } }));
  };

  const inputStyle = { background: "#1a1a1a", border: "1px solid #333" };

  if (loading) return (
    <div className="flex justify-center py-12">
      <Loader2 size={24} className="animate-spin" style={{ color: "#C9A84C" }} />
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}>
          <Ticket size={18} style={{ color: "#C9A84C" }} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Venta de Entradas</h2>
          <p className="text-gray-500 text-xs">Configurá precios, capacidad y disponibilidad por evento</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="p-4 rounded-xl" style={{ background: "#111", border: "1px solid #222" }}>
          <Ticket size={16} style={{ color: "#C9A84C" }} />
          <div className="text-2xl font-bold text-white mt-1">{totalSold}</div>
          <div className="text-xs text-gray-500">Entradas vendidas</div>
        </div>
        <div className="p-4 rounded-xl" style={{ background: "#111", border: "1px solid #222" }}>
          <DollarSign size={16} style={{ color: "#22c55e" }} />
          <div className="text-2xl font-bold text-white mt-1">${totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Recaudación</div>
        </div>
        <div className="p-4 rounded-xl" style={{ background: "#111", border: "1px solid #222" }}>
          <Clock size={16} style={{ color: "#eab308" }} />
          <div className="text-2xl font-bold text-white mt-1">{pendingCount}</div>
          <div className="text-xs text-gray-500">Pagos pendientes</div>
        </div>
        <div className="p-4 rounded-xl" style={{ background: "#111", border: "1px solid #222" }}>
          <Package size={16} style={{ color: "#FF0000" }} />
          <div className="text-2xl font-bold text-white mt-1">
            {events.filter(e => e.tickets_enabled !== false && e.ticket_price > 0 && e.status === "activo").length}
          </div>
          <div className="text-xs text-gray-500">Eventos activos</div>
        </div>
      </div>

      {/* Event Ticket Config */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-12 text-gray-600">No hay eventos creados aún.</div>
        ) : (
          events.map(event => {
            const edit = edits[event.id] || {};
            const sold = event.tickets_sold || 0;
            const cap = event.capacity || 0;
            const remaining = cap > 0 ? cap - sold : null;
            const pct = cap > 0 ? Math.min(100, (sold / cap) * 100) : 0;
            const isSaving = savingId === event.id;
            const isSaved = savedId === event.id;
            const eventOrders = approved.filter(o => o.event_id === event.id);
            const eventRevenue = eventOrders.reduce((s, o) => s + (o.total || 0), 0);

            return (
              <div key={event.id} className="p-4 md:p-5 rounded-2xl" style={{ background: "#111", border: "1px solid #222" }}>
                {/* Event Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-bold text-sm truncate">{event.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded capitalize ${event.status === "activo" ? "bg-green-900/30 text-green-400" : event.status === "agotado" ? "bg-orange-900/30 text-orange-400" : "bg-gray-900/30 text-gray-400"}`}>
                        {event.status}
                      </span>
                      {event.date && (
                        <span className="text-xs text-gray-500 capitalize">
                          {format(new Date(event.date), "d MMM yyyy", { locale: es })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>{sold} vendidas</span>
                      {remaining !== null && <span>· {remaining} restantes</span>}
                      {eventRevenue > 0 && <span>· ${eventRevenue.toLocaleString()} recaudado</span>}
                    </div>
                  </div>
                  {/* Toggle */}
                  <button
                    onClick={() => updateEdit(event.id, "tickets_enabled", !edit.tickets_enabled)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0"
                    style={{
                      background: edit.tickets_enabled ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.08)",
                      border: edit.tickets_enabled ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(239,68,68,0.2)",
                      color: edit.tickets_enabled ? "#22c55e" : "#ef4444",
                    }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: edit.tickets_enabled ? "#22c55e" : "#ef4444" }} />
                    {edit.tickets_enabled ? "Venta activa" : "Venta pausada"}
                  </button>
                </div>

                {/* Progress bar */}
                {cap > 0 && (
                  <div className="mb-4">
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#1a1a1a" }}>
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: pct >= 90 ? "#ef4444" : pct >= 70 ? "#eab308" : "#22c55e" }} />
                    </div>
                  </div>
                )}

                {/* Editable fields */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Anticipada ($)</label>
                    <input type="number" value={edit.ticket_price ?? ""}
                      onChange={e => updateEdit(event.id, "ticket_price", e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                      style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Puerta ($)</label>
                    <input type="number" value={edit.ticket_price_door ?? ""}
                      onChange={e => updateEdit(event.id, "ticket_price_door", e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                      style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Capacidad</label>
                    <input type="number" value={edit.capacity ?? ""}
                      onChange={e => updateEdit(event.id, "capacity", e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                      style={inputStyle} />
                  </div>
                </div>

                {/* Save button */}
                <div className="flex justify-end mt-3">
                  <button onClick={() => handleSave(event.id)} disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: isSaved ? "#22c55e" : isSaving ? "#333" : "#FF0000",
                      color: "#fff",
                      opacity: isSaving ? 0.7 : 1,
                    }}>
                    {isSaving ? <Loader2 size={13} className="animate-spin" /> : isSaved ? <Check size={13} /> : <Save size={13} />}
                    {isSaving ? "Guardando..." : isSaved ? "Guardado" : "Guardar"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MP Setup Guide */}
      <div className="mt-8 p-5 rounded-2xl" style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}>
        <div className="flex items-center gap-2 mb-3">
          <Info size={16} style={{ color: "#009ee3" }} />
          <h4 className="text-sm font-bold text-white">Configuración de Mercado Pago</h4>
        </div>
        <ol className="space-y-2 text-xs text-gray-500 list-decimal list-inside">
          <li>Obtené tus credenciales en <a href="https://www.mercadopago.com.ar/developers/panel/app" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#009ee3" }}>Mercado Pago Developers</a></li>
          <li>Cargá las credenciales en Dashboard → Secrets:
            <code className="block mt-1 p-2 rounded text-gray-400 text-xs" style={{ background: "#1a1a1a" }}>
              MERCADOPAGO_ACCESS_TOKEN=tu_access_token<br/>
              BASE_URL=https://tu-app.base44.app<br/>
              MAX_TICKETS_PER_ORDER=10
            </code>
          </li>
          <li>Deployá los backend functions: <code className="px-1.5 py-0.5 rounded text-gray-400" style={{ background: "#1a1a1a" }}>create-preference</code> y <code className="px-1.5 py-0.5 rounded text-gray-400" style={{ background: "#1a1a1a" }}>mercadopago-webhook</code></li>
          <li>Configurá el webhook en <a href="https://www.mercadopago.com.ar/developers/panel/app/webhooks" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#009ee3" }}>MP Webhooks</a> con la URL:<br/>
            <code className="block mt-1 p-2 rounded text-gray-400 text-xs break-all" style={{ background: "#1a1a1a" }}>https://tu-app.base44.app/functions/mercadopago-webhook</code>
          </li>
          <li>Activá el evento "payment" en la configuración de webhooks.</li>
          <li>Para producción: usá credenciales de producción (no las de test).</li>
        </ol>
      </div>
    </div>
  );
}