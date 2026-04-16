import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import HeroEvent from "@/components/events/HeroEvent";
import EventCard from "@/components/events/EventCard";
import PromotionPopup from "@/components/promotions/PromotionPopup";
import { Calendar } from "lucide-react";
import UpcomingEventsBanner from "@/components/events/UpcomingEventsBanner";
import { checkEventReminders } from "@/hooks/useEventReminder";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Event.list("-date").then(data => {
      setEvents(data);
      setLoading(false);
      checkEventReminders(data);
    });
  }, []);

  const upcoming = events.filter(e => new Date(e.date) >= new Date());
  const past = events.filter(e => new Date(e.date) < new Date());
  const featured = upcoming.find(e => e.is_featured) || upcoming[0];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#070707" }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-full animate-spin mx-auto mb-4"
          style={{ border: "2px solid #1a1a1a", borderTop: "2px solid #E8001D" }} />
        <p className="text-gray-600 text-xs tracking-widest uppercase">Cargando eventos</p>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#070707", minHeight: "100vh" }}>
      <PromotionPopup />
      {/* HERO */}
      {featured && <HeroEvent event={featured} />}

      {/* COUNTDOWN BANNERS */}
      {upcoming.length > 0 && <UpcomingEventsBanner events={upcoming} />}

      {/* UPCOMING EVENTS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-1 h-10 rounded-full" style={{ background: "linear-gradient(#E8001D, #9B0013)" }} />
          <div>
            <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "#E8001D" }}>Agenda</p>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
              Próximos Eventos
            </h2>
          </div>
        </div>

        {upcoming.length === 0 ? (
          <div className="text-center py-24">
            <Calendar size={48} className="mx-auto mb-4" style={{ color: "#E8001D", opacity: 0.3 }} />
            <p className="text-gray-500 text-lg">Próximamente nuevos eventos</p>
            <p className="text-gray-700 text-sm mt-2 tracking-wider uppercase">Seguinos en redes para enterarte primero</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {upcoming.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </section>

      {/* PAST EVENTS */}
      {past.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
          <div className="h-px w-full mb-10" style={{ background: "linear-gradient(90deg, transparent, rgba(232,0,29,0.2), transparent)" }} />
          <div className="flex items-center gap-4 mb-8">
            <div className="w-1 h-8 rounded-full" style={{ background: "#2a2a2a" }} />
            <h2 className="text-xl font-bold text-gray-600 uppercase tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ediciones Anteriores
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {past.slice(0, 6).map(event => (
              <div key={event.id} className="relative aspect-[3/4] rounded-lg overflow-hidden group"
                style={{ border: "1px solid #1a1a1a" }}>
                {event.flyer_url ? (
                  <img src={event.flyer_url} alt={event.title}
                    className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-700 text-center p-2"
                    style={{ background: "#111" }}>{event.title}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}