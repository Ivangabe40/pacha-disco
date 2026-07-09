import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import HeroEvent from "@/components/events/HeroEvent";
import EventCard from "@/components/events/EventCard";
import PromotionPopup from "@/components/promotions/PromotionPopup";
import { Calendar } from "lucide-react";
import UpcomingEventsBanner from "@/components/events/UpcomingEventsBanner";
import { checkEventReminders } from "@/hooks/useEventReminder";
import PastEventsCarousel from "@/components/events/PastEventsCarousel";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";
import HomeVideoSection from "@/components/HomeVideoSection";
import EscapeBarSection from "@/components/EscapeBarSection";
import NovedadBanner from "@/components/NovedadBanner";
import PullToRefresh from "@/components/PullToRefresh";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = useCallback(async () => {
    const data = await base44.entities.Event.list("-date");
    setEvents(data);
    setLoading(false);
    checkEventReminders(data);
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const upcoming = events.filter(e => new Date(e.date) >= new Date());
  const past = events.filter(e => new Date(e.date) < new Date());
  const featured = upcoming.find(e => e.is_featured) || upcoming[0];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#070707" }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-full animate-spin mx-auto mb-4"
          style={{ border: "2px solid #1a1a1a", borderTop: "2px solid #75AADB" }} />
        <p className="text-gray-600 text-xs tracking-widest uppercase">Cargando eventos</p>
      </div>
    </div>
  );

  const noUpcoming = upcoming.length === 0;

  return (
    <PullToRefresh onRefresh={loadEvents}>
    <div style={{
      background: "#070707",
      minHeight: "100vh"
    }}>
      <PromotionPopup />

      {/* BANNER NOVEDAD */}
      <NovedadBanner />

      {/* HERO — solo si hay próximos eventos */}
      {featured && <HeroEvent event={featured} />}

      {/* VIDEO SECTION — Lo que se viene (dinámico desde SiteConfig) */}
      <HomeVideoSection />

      {/* COUNTDOWN BANNERS — solo si hay próximos eventos */}
      {upcoming.length > 0 && <UpcomingEventsBanner events={upcoming} />}

      {noUpcoming ? (
        /* Sin próximos eventos: carrusel ocupa todo el espacio hero */
        past.length > 0 ? (
          <PastEventsCarousel events={past} />
        ) : (
          <div className="text-center py-24 md:py-40">
            <Calendar size={48} className="mx-auto mb-4" style={{ color: "#75AADB", opacity: 0.3 }} />
            <p className="text-gray-500 text-lg">Próximamente nuevos eventos</p>
            <p className="text-gray-700 text-sm mt-2 tracking-wider uppercase">Seguinos en redes para enterarte primero</p>
          </div>
        )
      ) : (
        /* Con próximos eventos: grilla + carrusel de pasados abajo */
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-24">
          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <div className="w-1 h-10 rounded-full" style={{ background: "linear-gradient(#75AADB, #4A8BC2)" }} />
            <div>
              <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "#75AADB" }}>Agenda</p>
              <h2 className="text-2xl md:text-4xl font-black text-white uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                Próximos Eventos
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {upcoming.map(event => <EventCard key={event.id} event={event} />)}
          </div>
          {past.length > 0 && (
            <div className="mt-12 md:mt-20">
              <div className="h-px w-full mb-4" style={{ background: "linear-gradient(90deg, transparent, rgba(116,172,223,0.15), transparent)" }} />
              <PastEventsCarousel events={past} />
            </div>
          )}
        </section>
      )}

      {/* GRACIAS POR ESTAR */}
      <section className="py-12 md:py-24 px-4" style={{ background: "#070707" }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "#75AADB" }}>Nuestro equipo</p>
          <h2 className="text-2xl md:text-5xl font-black text-white uppercase mb-8 md:mb-10"
            style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 0 40px rgba(116,172,223,0.3)" }}>
            ¡Gracias por estar!
          </h2>
          {/* Marco decorativo */}
          <div className="relative inline-block w-full">
            {/* Esquinas doradas */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 z-10" style={{ borderColor: "#C9A84C" }} />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 z-10" style={{ borderColor: "#C9A84C" }} />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 z-10" style={{ borderColor: "#C9A84C" }} />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 z-10" style={{ borderColor: "#C9A84C" }} />
            {/* Borde rojo interior */}
            <div className="absolute inset-3 z-10 pointer-events-none rounded-xl"
              style={{ border: "1px solid rgba(116,172,223,0.4)", boxShadow: "0 0 30px rgba(116,172,223,0.15) inset" }} />
            {/* Foto */}
            <div className="rounded-xl overflow-hidden"
              style={{ boxShadow: "0 0 60px rgba(116,172,223,0.25), 0 0 120px rgba(201,168,76,0.1)", border: "2px solid rgba(201,168,76,0.35)" }}>
              <img
                src="https://media.base44.com/images/public/69ad4033370fdc9f9fe8b117/1cf2e2e4d_IMG-20260614-WA00172.jpg"
                alt="El equipo de Pachá"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          <p className="mt-8 text-gray-400 text-sm md:text-base tracking-wide leading-relaxed">
            23 años compartiendo la noche con ustedes. Gracias a nuestro increíble equipo y a todos los que nos eligen cada semana. 🖤
          </p>
        </div>
      </section>

      {/* ESCAPE BAR */}
      <EscapeBarSection />

      {/* NEWSLETTER */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 pb-24 md:pb-16">
        <NewsletterSubscribe />
      </div>
    </div>
    </PullToRefresh>
  );
}