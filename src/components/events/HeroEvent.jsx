import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calendar, Music, Zap } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getDisplayDate } from "@/lib/eventDisplay";

export default function HeroEvent({ event }) {
  if (!event) return null;
  const date = getDisplayDate(event);

  return (
    <div className="relative w-full overflow-hidden scanlines md:min-h-screen" style={{ background: "#070707" }}>
      {/* Background video or image */}
      {/* Mobile: in-flow so it sets container height (no empty gaps) | Desktop: absolute fill */}
      {event.video_url ? (
        <video
          src={event.video_url}
          className="w-full h-auto block object-contain md:absolute md:inset-0 md:h-full md:object-cover"
          style={{ filter: "brightness(0.3) saturate(1.2)" }}
          autoPlay loop muted playsInline
        />
      ) : (event.background_url || event.flyer_url) ? (
        <img
          src={event.background_url || event.flyer_url}
          alt={event.title}
          className="w-full h-auto block object-contain md:absolute md:inset-0 md:h-full md:object-cover"
          style={{ filter: "brightness(0.25) saturate(1.2)" }}
        />
      ) : (
        <div className="w-full md:absolute md:inset-0" style={{ background: "radial-gradient(ellipse at center, #1a0005 0%, #070707 70%)", minHeight: "60vh" }} />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, #070707 0%, rgba(7,7,7,0.6) 50%, rgba(7,7,7,0.2) 100%)" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 20% 80%, rgba(255,0,0,0.12) 0%, transparent 60%)" }} />

      {/* Red top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 z-10" style={{ background: "linear-gradient(90deg, transparent, #FF0000 30%, #FF0000 70%, transparent)" }} />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-8 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(255,0,0,0.15)", border: "1px solid rgba(255,0,0,0.4)" }}>
              <Zap size={12} fill="#FF0000" style={{ color: "#FF0000" }} />
              <span className="text-xs font-bold tracking-widest uppercase font-condensed" style={{ color: "#FF0000" }}>
                Próximo Evento
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl md:text-8xl font-black text-white mb-4 md:mb-6 leading-none uppercase tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 0 60px rgba(255,0,0,0.3)" }}>
              {event.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-8">
              <div className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-full"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <Calendar size={14} style={{ color: "#FF0000" }} />
                <span className="text-xs md:text-sm text-gray-300 capitalize font-condensed">
                  {format(date, "EEEE d 'de' MMMM", { locale: es })}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-full"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span className="text-xs md:text-sm text-gray-300 font-condensed">{format(date, "HH:mm")}hs</span>
              </div>
              {event.genres && (
                <div className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-full"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Music size={14} style={{ color: "#C9A84C" }} />
                  <span className="text-xs md:text-sm text-gray-300 font-condensed">{event.genres}</span>
                </div>
              )}
            </div>

            {/* DJs */}
            {event.djs && (
              <p className="text-gray-500 mb-6 md:mb-8 text-sm md:text-base">
                Con: <span className="text-white font-semibold text-base md:text-lg">{event.djs}</span>
              </p>
            )}

            {/* CTA */}
            <div className="flex flex-wrap gap-4 items-center">
              <Link to={createPageUrl(`EventDetail?id=${event.id}`)}>
                <button className="flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold tracking-wider uppercase transition-all hover:-translate-y-0.5 text-sm md:text-base font-condensed"
                  style={{
                    background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)",
                    color: "#0A0A0A",
                    boxShadow: "0 4px 24px rgba(201,168,76,0.35)",
                    letterSpacing: "0.1em"
                  }}>
                  VER EVENTO
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: "linear-gradient(to top, #070707, transparent)" }} />
    </div>
  );
}