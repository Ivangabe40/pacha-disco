import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Ticket as TicketIcon, Loader2, Mail, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import TicketCard from "@/components/tickets/TicketCard";

export default function MisEntradas() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    base44.auth.me().then(async u => {
      if (!u) {
        setNeedsLogin(true);
        setLoading(false);
        return;
      }
      setUser(u);
      try {
        const ticks = await base44.entities.Ticket.filter({
          buyer_email: u.email,
          status: "confirmado",
        }, "-created_date");
        setTickets(ticks);
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    }).catch(() => {
      setNeedsLogin(true);
      setLoading(false);
    });
  }, []);

  // Agrupar entradas por orden/evento
  const grouped = tickets.reduce((acc, t) => {
    const key = t.order_id || t.event_id + t.event_date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#070707" }}>
      <Loader2 size={32} className="animate-spin" style={{ color: "#C9A84C" }} />
    </div>
  );

  if (needsLogin) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4" style={{ background: "#070707" }}>
      <TicketIcon size={48} style={{ color: "#C9A84C", opacity: 0.5 }} />
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Iniciá sesión
        </h2>
        <p className="text-gray-500 text-sm">Necesitás una cuenta para ver tus entradas</p>
      </div>
      <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
        className="px-6 py-3 rounded-lg text-sm font-bold text-white"
        style={{ background: "#C9A84C" }}>
        Iniciar Sesión
      </button>
    </div>
  );

  return (
    <div style={{ background: "#070707", minHeight: "100vh" }} className="pb-24">
      <div className="max-w-md mx-auto px-4 pt-8">
        <div className="text-center pt-4 mb-8">
          <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Mi cuenta</p>
          <h1 className="text-3xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Mis Entradas
          </h1>
          <p className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1.5">
            <Mail size={12} /> {user?.email}
          </p>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-16">
            <TicketIcon size={48} style={{ color: "#C9A84C", opacity: 0.3 }} className="mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              No tenés entradas confirmadas
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Cuando compres una entrada y el pago sea aprobado, aparecerá aquí con su código QR.
            </p>
            <Link to={createPageUrl("TicketSales")}>
              <button className="px-6 py-3 rounded-xl font-bold text-sm"
                style={{ background: "linear-gradient(135deg, #009EE3 0%, #00B7EA 100%)", color: "#fff" }}>
                Comprar entradas
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([key, group]) => {
              const first = group[0];
              return (
                <div key={key}>
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <Calendar size={14} style={{ color: "#C9A84C" }} />
                    <h2 className="text-white font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {first.event_title}
                    </h2>
                    {first.event_date && (
                      <span className="text-gray-500 text-xs capitalize ml-auto">
                        {format(new Date(first.event_date), "d MMM yyyy", { locale: es })}
                      </span>
                    )}
                  </div>
                  <div className="space-y-4">
                    {group.map((ticket, i) => (
                      <TicketCard key={ticket.id} ticket={ticket} index={i} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}