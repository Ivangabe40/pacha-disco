import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calendar, Music, Zap, Ticket } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function HeroEvent({ event }) {
  if (!event) return null;
  const date = new Date(event.date);

  return (
    <div className="relative w-full overflow-hidden scanlines" style={{ minHeight: "100vh" }}>
      {/* Background video or image */}
      {event.video_url ? (
        <video
          src={event.video_url}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.3) saturate(1.2)" }}
          autoPlay loop muted playsInline
        />
      ) : event.flyer_url ? (
        <img
          src={event.flyer_url}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.25) saturate(1.2)" }}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, #1a0005 0%, #070707 70%)" }} />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #070707 0%, rgba(7,7,7,0.6) 50%, rgba(7,7,7,0.2) 100%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 80%, rgba(232,0,29,0.12) 0%, transparent 60%)" }} />

      {/* Red top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, transparent, #E8001D 30%, #E8001D 70%, transparent)" }} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-end h-full pb-16 md:pb-24" style={{ minHeight: "100vh" }}>
        <div className="max-w-3xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(232,0,29,0.15)", border: "1px solid rgba(232,0,29,0.4)" }}>
            <Zap size={12} fill="#E8001D" style={{ color: "#E8001D" }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#E8001D" }}>
              Próximo Evento
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-6 leading-none uppercase tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 0 60px rgba(232,0,29,0.3)" }}>
            {event.title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <Calendar size={14} style={{ color: "#E8001D" }} />
              <span className="text-sm text-gray-300 capitalize">
                {format(date, "EEEE d 'de' MMMM", { locale: es })}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <span className="text-sm text-gray-300">{format(date, "HH:mm")}hs</span>
            </div>
            {event.genres && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <Music size={14} style={{ color: "#C9A84C" }} />
                <span className="text-sm text-gray-300">{event.genres}</span>
              </div>
            )}
          </div>

          {/* DJs */}
          {event.djs && (
            <p className="text-gray-500 mb-8 text-base">
              Con: <span className="text-white font-semibold text-lg">{event.djs}</span>
            </p>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 items-center">
            <Link to={createPageUrl(`EventDetail?id=${event.id}`)}>
              <button className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold tracking-wider uppercase transition-all hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)",
                  color: "#0A0A0A",
                  boxShadow: "0 4px 24px rgba(201,168,76,0.35)",
                  letterSpacing: "0.1em"
                }}>
                <Ticket size={18} />
                COMPRAR ENTRADA
              </button>
            </Link>
            {event.ticket_price && (
              <div className="px-5 py-4 rounded-2xl text-sm font-semibold flex items-center gap-2"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#aaa" }}>
                Desde <span style={{ color: "#C9A84C", fontWeight: 700 }}>${event.ticket_price.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: "linear-gradient(to top, #070707, transparent)" }} />
    </div>
  );
}