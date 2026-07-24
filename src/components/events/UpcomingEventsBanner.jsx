import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronRight } from "lucide-react";
import CountdownTimer from "./CountdownTimer";

export default function UpcomingEventsBanner({ events }) {
  // Show up to 3 upcoming events
  const list = events.slice(0, 3);
  if (list.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 pb-4">
      <div className="space-y-4">
        {list.map((event, i) =>
        <Link key={event.id} to={`/EventDetail?id=${event.id}`}
        className="group flex flex-row items-center gap-3 md:gap-8 p-4 md:p-6 rounded-2xl transition-all duration-300"
        style={{
          background: i === 0 ? "rgba(255,0,0,0.07)" : "#0f0f0f",
          border: `1px solid ${i === 0 ? "rgba(255,0,0,0.35)" : "#1a1a1a"}`
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(255,0,0,0.5)"}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = i === 0 ? "rgba(255,0,0,0.35)" : "#1a1a1a"}>

            {/* Flyer thumbnail */}
            {event.flyer_url &&
            <img src={event.flyer_url} alt={event.title}
            className="w-16 md:w-20 h-16 md:h-20 object-cover rounded-xl shrink-0" />
            }

            {/* Info */}
            <div className="flex-1 min-w-0">
              {i === 0 &&
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-1"
            style={{ background: "rgba(255,0,0,0.2)", color: "#FF0000" }}>Próximo</span>
            }
              <h3 className="text-white font-bold text-sm md:text-xl leading-tight truncate"
            style={{ fontFamily: "'Playfair Display', serif" }}>{event.title}</h3>
              <p className="text-gray-500 text-xs md:text-sm mt-0.5 capitalize truncate md:truncate-none">
                {format(new Date(event.date), "EEEE d 'de' MMMM · HH:mm 'hs'", { locale: es })}
              </p>
            </div>

            {/* Countdown */}
            <div className="shrink-0 hidden md:block">
              <CountdownTimer targetDate={event.date} />
            </div>

            {/* CTA */}
            <div className="shrink-0">
              <div className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold text-white transition-all"
            style={{ background: "linear-gradient(135deg,#FF0000,#CC0000)" }}>
                <span className="hidden md:inline">Ver Evento</span> <ChevronRight size={14} />
              </div>
            </div>
          </Link>
        )}
      </div>
    </section>);

}