import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calendar, Clock, Music } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function EventCard({ event }) {
  const date = new Date(event.date);
  const isSoldOut = event.status === "agotado";
  const isCancelled = event.status === "cancelado";
  const isActive = !isSoldOut && !isCancelled;

  return (
    <div className="event-card rounded-xl overflow-hidden group cursor-pointer flex flex-col">
      {/* Flyer / Video */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {event.video_url ? (
          <video
            src={event.video_url}
            className="w-full h-full object-cover"
            autoPlay loop muted playsInline
          />
        ) : event.flyer_url ? (
          <img
            src={event.flyer_url}
            alt={event.title}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3"
            style={{ background: "linear-gradient(135deg, #1a0005 0%, #0d0d0d 100%)" }}>
            <Music size={40} style={{ color: "#FF0000", opacity: 0.4 }} />
            <span className="text-gray-600 text-xs tracking-widest uppercase">Sin flyer</span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "linear-gradient(to top, rgba(255,0,0,0.4) 0%, transparent 60%)" }} />

        {/* Status overlay */}
        {(isSoldOut || isCancelled) && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.7)" }}>
            <span className="font-black text-xl tracking-widest uppercase px-5 py-2.5"
              style={{
                border: `2px solid ${isSoldOut ? "#FF0000" : "#555"}`,
                color: isSoldOut ? "#FF0000" : "#777",
                textShadow: isSoldOut ? "0 0 20px rgba(255,0,0,0.8)" : "none"
              }}>
              {isSoldOut ? "AGOTADO" : "CANCELADO"}
            </span>
          </div>
        )}

        {/* Featured badge */}
        {event.is_featured && isActive && (
          <div className="absolute top-3 left-3 px-3 py-1 text-xs font-black tracking-widest uppercase rounded-full"
            style={{ background: "#FF0000", color: "#fff", boxShadow: "0 0 15px rgba(255,0,0,0.6)" }}>
            ★ DESTACADO
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 md:p-4 flex flex-col flex-1" style={{ background: "#0f0f0f" }}>
        <h3 className="font-bold text-sm md:text-base mb-2 text-white leading-tight uppercase tracking-wide"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          {event.title}
        </h3>

        <div className="flex flex-col gap-1.5 mb-4 flex-1">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={11} style={{ color: "#FF0000" }} />
            <span className="capitalize">{format(date, "EEE d 'de' MMM", { locale: es })}</span>
            <span className="text-gray-700">·</span>
            <Clock size={11} style={{ color: "#FF0000" }} />
            <span>{format(date, "HH:mm")}hs</span>
          </div>
          {event.genres && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Music size={11} style={{ color: "#C9A84C" }} />
              <span>{event.genres}</span>
            </div>
          )}
        </div>

        <Link to={createPageUrl(`EventDetail?id=${event.id}`)} className="block">
          <button
            disabled={!isActive}
            className="w-full py-2.5 md:py-3 rounded-lg text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
            style={isActive
              ? { background: "linear-gradient(135deg, #FF0000, #FF6666)", color: "#fff", boxShadow: "0 4px 20px rgba(255,0,0,0.3)" }
              : { background: "#1a1a1a", color: "#444", cursor: "not-allowed" }
            }>
            {isSoldOut ? "Agotado" : isCancelled ? "Cancelado" : "Ver Evento"}
          </button>
        </Link>
      </div>
    </div>
  );
}