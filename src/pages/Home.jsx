import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import HeroEvent from "@/components/events/HeroEvent";
import EventCard from "@/components/events/EventCard";
import { Calendar } from "lucide-react";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Event.list("-date").then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const upcoming = events.filter(e => new Date(e.date) >= new Date());
  const past = events.filter(e => new Date(e.date) < new Date());
  const featured = upcoming.find(e => e.is_featured) || upcoming[0];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0A0A0A" }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-t-yellow-500 border-gray-800 animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 text-sm tracking-widest uppercase">Cargando eventos</p>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      {/* HERO */}
      {featured && <HeroEvent event={featured} />}

      {/* UPCOMING EVENTS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-1 h-8 rounded" style={{ background: "linear-gradient(#C9A84C, #E8C97A)" }}></div>
          <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Próximos Eventos
          </h2>
        </div>

        {upcoming.length === 0 ? (
          <div className="text-center py-20">
            <Calendar size={48} className="mx-auto mb-4 opacity-20" style={{ color: "#C9A84C" }} />
            <p className="text-gray-500 text-lg">Próximamente nuevos eventos</p>
            <p className="text-gray-600 text-sm mt-2">Seguinos en redes para enterarte primero</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {upcoming.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </section>

      {/* PAST EVENTS */}
      {past.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 rounded" style={{ background: "#333" }}></div>
            <h2 className="text-2xl font-bold text-gray-600" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ediciones Anteriores
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {past.slice(0, 6).map(event => (
              <div key={event.id} className="relative aspect-[3/4] rounded-lg overflow-hidden opacity-50 hover:opacity-70 transition-opacity">
                {event.flyer_url ? (
                  <img src={event.flyer_url} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-600 text-center p-2"
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