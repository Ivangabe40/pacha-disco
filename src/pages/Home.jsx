import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import HeroEvent from "@/components/events/HeroEvent";
import EventCard from "@/components/events/EventCard";
import PromotionPopup from "@/components/promotions/PromotionPopup";
import { Calendar, ArrowRight } from "lucide-react";
import UpcomingEventsBanner from "@/components/events/UpcomingEventsBanner";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { checkEventReminders } from "@/hooks/useEventReminder";
import PastEventsCarousel from "@/components/events/PastEventsCarousel";
import { getEventPhase } from "@/lib/eventDisplay";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";
import HomeVideoSection from "@/components/HomeVideoSection";
import NovedadBanner from "@/components/NovedadBanner";
import OperationInfo from "@/components/OperationInfo";
import PullToRefresh from "@/components/PullToRefresh";
import GoogleReviewInvite from "@/components/GoogleReviewInvite";
import InstagramFollow from "@/components/InstagramFollow";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = useCallback(async () => {
    try {
      const data = await base44.entities.Event.list("-date");
      setEvents(data);
      checkEventReminders(data);
    } catch {
      // silent fail — loading will be cleared in finally
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const upcoming = events.filter(e => ["proximo", "vigente"].includes(getEventPhase(e)));
  const past = events.filter(e => ["finalizado", "cancelado"].includes(getEventPhase(e)));
  const featured = upcoming.find(e => e.is_featured) || upcoming[0];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#070707" }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-full animate-spin mx-auto mb-4"
          style={{ border: "2px solid #1a1a1a", borderTop: "2px solid #FF0000" }} />
        <p className="text-gray-600 text-xs tracking-widest uppercase">Cargando eventos</p>
      </div>
    </div>
  );

  const noUpcoming = upcoming.length === 0;

  return (
    <div style={{ background: "#070707" }}>
      <PromotionPopup />
      <PullToRefresh onRefresh={loadEvents}>
        <div style={{ background: "#070707", minHeight: "100vh" }}>
          {/* BANNER NOVEDAD */}
          <NovedadBanner />

          {/* HERO — solo si hay próximos eventos */}
          {featured && <HeroEvent event={featured} />}

          {/* OPERACIÓN ACTUAL — información permanente */}
          <OperationInfo />

          {/* VIDEO SECTION — Lo que se viene (dinámico desde SiteConfig) */}
          <HomeVideoSection />

          {/* COUNTDOWN BANNERS — solo si hay próximos eventos */}
          {upcoming.length > 0 && <UpcomingEventsBanner events={upcoming} />}

          {/* CTA: ver todos los eventos */}
          {upcoming.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 text-center">
              <Link to={createPageUrl("Eventos")}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs md:text-sm font-black tracking-widest uppercase transition-all group"
                style={{ border: "1px solid rgba(255,0,0,0.5)", color: "#fff", background: "rgba(255,0,0,0.06)" }}>
                Ver todos los eventos
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </section>
          )}

          {/* CARRUSEL DE PASADOS */}
          {noUpcoming && past.length === 0 ? (
            <div className="text-center py-24 md:py-40">
              <Calendar size={48} className="mx-auto mb-4" style={{ color: "#FF0000", opacity: 0.3 }} />
              <p className="text-gray-500 text-lg">Próximamente nuevos eventos</p>
              <p className="text-gray-700 text-sm mt-2 tracking-wider uppercase">Seguinos en redes para enterarte primero</p>
            </div>
          ) : past.length > 0 ? (
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
              <div className="h-px w-full mb-6 md:mb-8" style={{ background: "linear-gradient(90deg, transparent, rgba(255,0,0,0.15), transparent)" }} />
              <PastEventsCarousel events={past} />
            </section>
          ) : null}

          {/* GRACIAS POR ESTAR */}
          <section className="py-12 md:py-24 px-4" style={{ background: "#070707" }}>
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-xs tracking-widest uppercase mb-3 font-condensed" style={{ color: "#FF0000" }}>Nuestro equipo</p>
              <h2 className="text-2xl md:text-5xl font-black text-white uppercase mb-8 md:mb-10"
                style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 0 40px rgba(255,0,0,0.3)" }}>
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
                  style={{ border: "1px solid rgba(255,0,0,0.4)", boxShadow: "0 0 30px rgba(255,0,0,0.15) inset" }} />
                {/* Foto */}
                <div className="rounded-xl overflow-hidden"
                  style={{ boxShadow: "0 0 60px rgba(255,0,0,0.25), 0 0 120px rgba(201,168,76,0.1)", border: "2px solid rgba(201,168,76,0.35)" }}>
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

          {/* INSTAGRAM — SEGUINOS */}
          <InstagramFollow />

          {/* GOOGLE REVIEW INVITE */}
          <GoogleReviewInvite />

          {/* NEWSLETTER */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 pb-24 md:pb-16">
            <NewsletterSubscribe />
          </div>
        </div>
      </PullToRefresh>
    </div>
  );
}