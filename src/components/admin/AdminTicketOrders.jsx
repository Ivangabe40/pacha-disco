import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Filter, TrendingUp, Ticket, DollarSign, Package } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AdminTicketOrders() {
  const [orders, setOrders] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const load = async () => {
    const [orderData, eventData] = await Promise.all([
      base44.entities.TicketOrder.list("-created_date"),
      base44.entities.Event.list("-date")
    ]);
    setOrders(orderData);
    setEvents(eventData);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = statusFilter === "all"
    ? orders
    : orders.filter(o => o.status === statusFilter);

  const approved = orders.filter(o => o.status === "approved");
  const totalTickets = approved.reduce((s, o) => s + (o.quantity || 0), 0);
  const totalRevenue = approved.reduce((s, o) => s + (o.total || 0), 0);

  const stockInfo = events.map(e => ({
    title: e.title,
    capacity: e.capacity || 0,
    sold: e.tickets_sold || 0,
    remaining: e.capacity ? e.capacity - (e.tickets_sold || 0) : null
  })).filter(e => e.capacity > 0);

  const statusColors = {
    approved: { bg: "rgba(34,197,94,0.15)", color: "#22c55e", label: "Aprobado" },
    pending: { bg: "rgba(234,179,8,0.15)", color: "#eab308", label: "Pendiente" },
    rejected: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", label: "Rechazado" },
  };

  if (loading) return (
    <div className="flex justify-center py-12">
      <Loader2 size={24} className="animate-spin" style={{ color: "#C9A84C" }} />
    </div>
  );

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-4 rounded-xl" style={{ background: "#111", border: "1px solid #222" }}>
          <Ticket size={16} style={{ color: "#C9A84C" }} />
          <div className="text-2xl font-bold text-white mt-1">{totalTickets}</div>
          <div className="text-xs text-gray-500">Entradas vendidas</div>
        </div>
        <div className="p-4 rounded-xl" style={{ background: "#111", border: "1px solid #222" }}>
          <DollarSign size={16} style={{ color: "#22c55e" }} />
          <div className="text-2xl font-bold text-white mt-1">${totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Recaudación total</div>
        </div>
        <div className="p-4 rounded-xl" style={{ background: "#111", border: "1px solid #222" }}>
          <Package size={16} style={{ color: "#75AADB" }} />
          <div className="text-2xl font-bold text-white mt-1">{stockInfo.reduce((s, e) => s + e.remaining, 0)}</div>
          <div className="text-xs text-gray-500">Stock restante</div>
        </div>
      </div>

      {/* Stock por evento */}
      {stockInfo.length > 0 && (
        <div className="mb-6 p-4 rounded-xl" style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Stock por evento</p>
          <div className="space-y-2">
            {stockInfo.map((e, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-gray-300 truncate">{e.title}</span>
                <span style={{ color: e.remaining <= 20 ? "#ef4444" : "#888" }}>
                  {e.sold}/{e.capacity} vendidas · {e.remaining} restantes
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtro */}
      <div className="flex items-center gap-3 mb-6">
        <Filter size={16} className="text-gray-500" />
        <div className="flex gap-2">
          {["all", "pending", "approved", "rejected"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={statusFilter === s
                ? { background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)", color: "#C9A84C" }
                : { background: "#111", border: "1px solid #222", color: "#666" }}>
              {s === "all" ? "Todas" : statusColors[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de órdenes */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-600">No hay órdenes para mostrar</div>
      ) : (
        <div className="space-y-2">
          {filtered.map(order => {
            const sc = statusColors[order.status] || statusColors.pending;
            return (
              <div key={order.id} className="p-4 rounded-xl"
                style={{ background: "#111", border: "1px solid #222" }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium text-sm truncate">{order.event_title}</span>
                      <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: sc.bg, color: sc.color }}>
                        {sc.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span>{order.quantity} entrada{order.quantity > 1 ? "s" : ""}</span>
                      <span>${order.total?.toLocaleString()}</span>
                      <span>${order.unit_price?.toLocaleString()}/u</span>
                      {order.buyer_email && <span className="truncate">{order.buyer_email}</span>}
                      {order.created_date && <span>{format(new Date(order.created_date), "d MMM HH:mm", { locale: es })}</span>}
                    </div>
                    {order.payment_id && (
                      <div className="text-xs text-gray-700 mt-1 font-mono">MP: {order.payment_id}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Instrucciones de configuración */}
      <div className="mt-8 p-5 rounded-xl" style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}>
        <h4 className="text-sm font-bold text-white mb-3">Configuración de Mercado Pago Checkout Pro</h4>
        <ol className="space-y-2 text-xs text-gray-500 list-decimal list-inside">
          <li>Obtené tus credenciales en <a href="https://www.mercadopago.com.ar/developers/panel/app" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#009ee3" }}>Mercado Pago Developers</a>.</li>
          <li>Cargá las credenciales en Dashboard → Secrets:
            <code className="block mt-1 p-2 rounded text-gray-400 text-xs" style={{ background: "#1a1a1a" }}>
              MERCADOPAGO_ACCESS_TOKEN=tu_access_token<br/>
              BASE_URL=https://tu-app.base44.app<br/>
              MAX_TICKETS_PER_ORDER=10
            </code>
          </li>
          <li>Deployá los backend functions:<br/>
            <code className="block mt-1 p-2 rounded text-gray-400 text-xs" style={{ background: "#1a1a1a" }}>npx base44 functions deploy</code>
          </li>
          <li>Configurá el webhook en <a href="https://www.mercadopago.com.ar/developers/panel/app/webhooks" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#009ee3" }}>MP Webhooks</a> con la URL:<br/>
            <code className="block mt-1 p-2 rounded text-gray-400 text-xs break-all" style={{ background: "#1a1a1a" }}>https://tu-app.base44.app/functions/mercadopago-webhook</code>
          </li>
          <li>Activá el evento "payment" en la configuración de webhooks.</li>
          <li>Para producción: usá las credenciales de producción (no las de test).</li>
        </ol>
      </div>
    </div>
  );
}