import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import EventCard from "@/components/events/EventCard";
import PastEventsCarousel from "@/components/events/PastEventsCarousel";
import { Calendar } from "lucide-react";
import PullToRefresh from "@/components/PullToRefresh";
import { getEventPhase } from "@/lib/eventDisplay";

export default function Eventos() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = useCallback(async () => {
    try {
      const data = await base44.entities.Event.list("-date");
      setEvents(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const upcoming = events.filter(e => ["proximo", "vigente"].includes(getEventPhase(e)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = events.filter(e => ["finalizado", "cancelado"].includes(getEventPhase(e)));

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#070707" }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-full animate-spin mx-auto mb-4"
          style={{ border: "2px solid #1a1a1a", borderTop: "2px solid #FF0000" }} />
        <p className="text-gray-600 text-xs tracking-widest uppercase">Cargando eventos</p>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#070707", minHeight: "100vh" }}>
      <PullToRefresh onRefresh={loadEvents}>
        <div style={{ background: "#070707" }}>
          {/* Header */}
          <section className="max-w-7xl mx-auto px-4 md:px-8 pt-10 md:pt-16 pb-6 md:pb-10">
            <div className="flex items-center gap-4">
              <div className="w-1 h-10 rounded-full" style={{ background: "linear-gradient(#FF0000, #CC0000)" }} />
              <div>
                <p className="text-xs tracking-widest uppercase mb-0.5 font-condensed" style={{ color: "#FF0000" }}>Agenda</p>
                <h1 className="text-2xl md:text-5xl font-black text-white uppercase"
                  style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 0 40px rgba(255,0,0,0.25)" }}>
                  Eventos
                </h1>
              </div>
            </div>
            <p className="text-gray-500 text-sm md:text-base mt-4 max-w-xl leading-relaxed">
              Toda la agenda de Pachá en un solo lugar.
            </p>
          </section>

          {upcoming.length === 0 ? (
            <div className="text-center py-12 md:py-20">
              <Calendar size={48} className="mx-auto mb-4" style={{ color: "#FF0000", opacity: 0.3 }} />
              <p className="text-gray-500 text-lg">Próximamente nuevos eventos</p>
              <p className="text-gray-700 text-sm mt-2 tracking-wider uppercase">Seguinos en redes para enterarte primero</p>
            </div>
          ) : (
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {upcoming.map(event => <EventCard key={event.id} event={event} />)}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
              <div className="h-px w-full mb-6 md:mb-8" style={{ background: "linear-gradient(90deg, transparent, rgba(255,0,0,0.15), transparent)" }} />
              <PastEventsCarousel events={past} />
            </section>
          )}

        </div>
      </PullToRefresh>
    </div>
  );
}