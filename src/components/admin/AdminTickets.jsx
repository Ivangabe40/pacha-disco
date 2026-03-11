import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Search, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    base44.entities.Ticket.list("-created_date").then(d => { setTickets(d); setLoading(false); });
  }, []);

  const filtered = tickets.filter(t =>
    t.buyer_name?.toLowerCase().includes(search.toLowerCase()) ||
    t.buyer_email?.toLowerCase().includes(search.toLowerCase()) ||
    t.ticket_code?.toLowerCase().includes(search.toLowerCase()) ||
    t.event_title?.toLowerCase().includes(search.toLowerCase())
  );

  const total = tickets.filter(t => t.status === "confirmado").reduce((s, t) => s + (t.total_amount || 0), 0);

  const statusIcon = (s) => {
    if (s === "confirmado") return <CheckCircle size={14} className="text-green-400" />;
    if (s === "pendiente") return <Clock size={14} className="text-yellow-400" />;
    return <XCircle size={14} className="text-red-400" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Entradas Vendidas</h2>
        <p className="text-sm mb-4" style={{ color: "#C9A84C" }}>Total recaudado: ${total.toLocaleString()}</p>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o código..."
            className="pl-9 pr-4 py-2.5 rounded-xl text-white text-sm outline-none w-full"
            style={{ background: "#111", border: "1px solid #333" }} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-t-yellow-500 border-gray-800 animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid #222" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#111", borderBottom: "1px solid #222" }}>
                {["Código", "Comprador", "Evento", "Tipo", "Cant.", "Total", "Estado", "Fecha"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id} style={{ background: i % 2 === 0 ? "#0d0d0d" : "#111", borderBottom: "1px solid #1a1a1a" }}>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "#C9A84C" }}>{t.ticket_code}</td>
                  <td className="px-4 py-3">
                    <div className="text-white font-medium">{t.buyer_name}</div>
                    <div className="text-gray-500 text-xs">{t.buyer_email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-300 max-w-xs truncate">{t.event_title}</td>
                  <td className="px-4 py-3">
                    <span className="capitalize px-2 py-0.5 rounded text-xs"
                      style={t.ticket_type === "anticipada"
                        ? { background: "rgba(201,168,76,0.15)", color: "#C9A84C" }
                        : { background: "rgba(136,136,255,0.15)", color: "#8888FF" }}>
                      {t.ticket_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white text-center">{t.quantity}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: "#C9A84C" }}>
                    {t.total_amount ? `$${t.total_amount.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {statusIcon(t.status)}
                      <span className="capitalize text-gray-300">{t.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {t.created_date ? format(new Date(t.created_date), "d MMM HH:mm", { locale: es }) : ""}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-600">No se encontraron entradas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}