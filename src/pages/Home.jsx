import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import HeroEvent from "@/components/events/HeroEvent";
import EventCard from "@/components/events/EventCard";
import PromotionPopup from "@/components/promotions/PromotionPopup";
import { Calendar } from "lucide-react";
import UpcomingEventsBanner from "@/components/events/UpcomingEventsBanner";
import { checkEventReminders } from "@/hooks/useEventReminder";
import PastEventsCarousel from "@/components/events/PastEventsCarousel";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";

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

  const noUpcoming = upcoming.length === 0;

  return (
    <div style={{ background: "#070707", minHeight: "100vh" }}>
      <PromotionPopup />

      {/* HERO — solo si hay próximos eventos */}
      {featured && <HeroEvent event={featured} />}

      {/* VIDEO SECTION — Lo que se viene */}
      <section className="relative w-full" style={{ background: "#070707" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-1 h-10 rounded-full" style={{ background: "linear-gradient(#E8001D, #9B0013)" }} />
            <div>
              <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "#E8001D" }}>Próximamente</p>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                Lo que se viene
              </h2>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden w-full"
            style={{ border: "1px solid rgba(232,0,29,0.25)", boxShadow: "0 0 60px rgba(232,0,29,0.12)" }}>
            <video
              src="https://media.base44.com/videos/public/69ad4033370fdc9f9fe8b117/e6c849908_LiveMusic_20260505_191740_0000.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full"
              style={{ display: "block", maxHeight: "80vh", objectFit: "cover" }}
            />
            {/* Red glow overlay bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(7,7,7,0.8), transparent)" }} />
          </div>
        </div>
      </section>

      {/* COUNTDOWN BANNERS — solo si hay próximos eventos */}
      {upcoming.length > 0 && <UpcomingEventsBanner events={upcoming} />}

      {noUpcoming ? (
        /* Sin próximos eventos: carrusel ocupa todo el espacio hero */
        past.length > 0 ? (
          <PastEventsCarousel events={past} />
        ) : (
          <div className="text-center py-40">
            <Calendar size={48} className="mx-auto mb-4" style={{ color: "#E8001D", opacity: 0.3 }} />
            <p className="text-gray-500 text-lg">Próximamente nuevos eventos</p>
            <p className="text-gray-700 text-sm mt-2 tracking-wider uppercase">Seguinos en redes para enterarte primero</p>
          </div>
        )
      ) : (
        /* Con próximos eventos: grilla + carrusel de pasados abajo */
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {upcoming.map(event => <EventCard key={event.id} event={event} />)}
          </div>
          {past.length > 0 && (
            <div className="mt-20">
              <div className="h-px w-full mb-4" style={{ background: "linear-gradient(90deg, transparent, rgba(232,0,29,0.15), transparent)" }} />
              <PastEventsCarousel events={past} />
            </div>
          )}
        </section>
      )}

      {/* NEWSLETTER */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <NewsletterSubscribe />
      </div>
    </div>
  );
}