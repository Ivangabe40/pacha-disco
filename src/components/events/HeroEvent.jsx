import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calendar, Music, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function HeroEvent({ event }) {
  if (!event) return null;
  const date = new Date(event.date);

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: "75vh" }}>
      {/* Background */}
      {event.flyer_url ? (
        <img src={event.flyer_url} alt={event.title}
          className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.35)" }} />
      ) : (
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a0a0a 0%, #0a0a1a 100%)" }} />
      )}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0A0A0A 0%, rgba(10,10,10,0.3) 60%, transparent 100%)" }} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-end h-full pb-16 pt-32">
        <div className="max-w-2xl">
          <div className="inline-block px-3 py-1 rounded text-xs font-bold tracking-widest uppercase mb-4"
            style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#0A0A0A" }}>
            Próximo Evento
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar size={16} style={{ color: "#C9A84C" }} />
              <span className="capitalize">{format(date, "EEEE d 'de' MMMM · HH:mm'hs'", { locale: es })}</span>
            </div>
            {event.genres && (
              <div className="flex items-center gap-2 text-gray-300">
                <Music size={16} style={{ color: "#C9A84C" }} />
                <span>{event.genres}</span>
              </div>
            )}
          </div>
          {event.djs && (
            <p className="text-gray-400 mb-6 text-sm">Con: <span className="text-white font-medium">{event.djs}</span></p>
          )}
          <div className="flex flex-wrap gap-3">
            <Link to={createPageUrl(`EventDetail?id=${event.id}`)}>
              <button className="px-8 py-3 rounded text-sm font-bold tracking-wider uppercase flex items-center gap-2"
                style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#0A0A0A" }}>
                Comprar Entrada
                <ChevronRight size={16} />
              </button>
            </Link>
            {event.ticket_price && (
              <div className="px-6 py-3 rounded text-sm font-semibold flex items-center gap-2"
                style={{ border: "1px solid rgba(201,168,76,0.4)", color: "#C9A84C", background: "rgba(201,168,76,0.05)" }}>
                Anticipada ${event.ticket_price.toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}