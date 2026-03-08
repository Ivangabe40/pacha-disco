import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calendar, Clock, Music, Ticket } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function EventCard({ event }) {
  const date = new Date(event.date);
  const isSoldOut = event.status === "agotado";
  const isCancelled = event.status === "cancelado";

  return (
    <div className="event-card rounded-xl overflow-hidden group cursor-pointer"
      style={{ background: "#111", border: "1px solid #222" }}>
      {/* Flyer */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {event.flyer_url ? (
          <img src={event.flyer_url} alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)" }}>
            <Music size={48} style={{ color: "#C9A84C", opacity: 0.4 }} />
          </div>
        )}
        {/* Status badge */}
        {(isSoldOut || isCancelled) && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-xl tracking-widest uppercase px-4 py-2 border-2 border-white">
              {isSoldOut ? "AGOTADO" : "CANCELADO"}
            </span>
          </div>
        )}
        {event.is_featured && !isSoldOut && !isCancelled && (
          <div className="absolute top-3 left-3 px-3 py-1 text-xs font-bold tracking-widest uppercase rounded"
            style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#0A0A0A" }}>
            Destacado
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          {event.title}
        </h3>
        <div className="flex flex-col gap-1 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar size={13} style={{ color: "#C9A84C" }} />
            <span>{format(date, "EEEE d 'de' MMMM", { locale: es })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock size={13} style={{ color: "#C9A84C" }} />
            <span>{format(date, "HH:mm")}hs</span>
          </div>
          {event.genres && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Music size={13} style={{ color: "#C9A84C" }} />
              <span>{event.genres}</span>
            </div>
          )}
        </div>

        {event.ticket_price && (
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Anticipada</span>
              <div className="font-bold text-lg" style={{ color: "#C9A84C" }}>
                ${event.ticket_price.toLocaleString()}
              </div>
            </div>
            {event.ticket_price_door && (
              <div className="text-right">
                <span className="text-xs text-gray-500 uppercase tracking-wider">En puerta</span>
                <div className="font-semibold text-sm text-gray-400">
                  ${event.ticket_price_door.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        )}

        <Link to={createPageUrl(`EventDetail?id=${event.id}`)}>
          <button
            disabled={isSoldOut || isCancelled}
            className="w-full py-2.5 rounded text-sm font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
            style={isSoldOut || isCancelled
              ? { background: "#222", color: "#555", cursor: "not-allowed" }
              : { background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#0A0A0A" }
            }>
            <Ticket size={14} />
            {isSoldOut ? "Agotado" : isCancelled ? "Cancelado" : "Ver Evento"}
          </button>
        </Link>
      </div>
    </div>
  );
}