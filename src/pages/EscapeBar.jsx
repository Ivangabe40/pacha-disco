import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Instagram, MessageCircle, Globe, CalendarDays, Tag } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import PullToRefresh from "@/components/PullToRefresh";
import EscapeBarGamePromo from "@/components/EscapeBarGamePromo";

export default function EscapeBar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = useCallback(async () => {
    const data = await base44.entities.EscapeBarEvent.list("-date");
    setEvents(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const featured = events.find((e) => e.is_featured) || events[0];
  const rest = events.filter((e) => e.id !== featured?.id);

  return (
    <PullToRefresh onRefresh={loadEvents}>
    <div style={{ background: "#070707", minHeight: "100vh" }}>

      {/* HERO HEADER */}
      <div className="relative overflow-hidden py-16 md:py-20 px-4 text-center"
      style={{ background: "linear-gradient(180deg, #0d0a04 0%, #070707 100%)" }}>
        {/* Gold radial glow */}
        <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center top, rgba(201,168,76,0.12) 0%, transparent 65%)" }} />
        {/* Gold top line */}
        <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #C9A84C 30%, #E8C97A 50%, #C9A84C 70%, transparent)" }} />

        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.4em] mb-6" style={{ color: "#C9A84C" }}>
            Una nueva experiencia
          </p>



          <p className="text-sm md:text-base leading-relaxed max-w-lg mx-auto" style={{ color: "#888" }}>
            Nuevo espacio / Bar Lounge · carta de tragos · vinos · cervezas · música
          </p>

          {/* Gold divider */}
          <div className="flex items-center gap-4 max-w-xs mx-auto mt-8">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, #C9A84C)" }} />
            <span style={{ color: "#C9A84C" }}>✦</span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, #C9A84C, transparent)" }} />
          </div>
        </div>
      </div>

      {/* JUEGO OFICIAL */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-4 mb-4">
        <EscapeBarGamePromo />
      </div>

      {/* EVENTS SECTION */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="flex items-center gap-4 mb-8 md:mb-12">
          <div className="w-1 h-10 rounded-full" style={{ background: "linear-gradient(#C9A84C, #9A6F20)" }} />
          <div>
            <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "#C9A84C" }}>Cada viernes</p>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
              Novedades & Eventos
            </h2>
          </div>
        </div>

        {loading ?
        <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full animate-spin"
          style={{ border: "2px solid #1a1a1a", borderTop: "2px solid #C9A84C" }} />
          </div> :
        events.length === 0 ?
        <div className="text-center py-20">
            <CalendarDays size={48} className="mx-auto mb-4 opacity-20" style={{ color: "#C9A84C" }} />
            <p className="text-gray-500">Próximamente novedades de Escape Bar</p>
          </div> :

        <div className="space-y-6">
            {/* Featured card */}
            {featured &&
          <div className="rounded-2xl overflow-hidden relative"
          style={{ background: "#0f0f0f", border: "1px solid rgba(201,168,76,0.35)" }}>
                {featured.is_featured &&
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest"
            style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#050303" }}>
                    Destacado
                  </div>
            }
                <div className="flex flex-col md:flex-row">
                  {featured.photo_url &&
              <div className="md:w-1/2 aspect-video md:min-h-64 overflow-hidden">
                      <img src={featured.photo_url} alt={featured.title}
                className="w-full h-full object-cover" />
                    </div>
              }
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <CalendarDays size={14} style={{ color: "#C9A84C" }} />
                      <span className="text-xs uppercase tracking-widest" style={{ color: "#C9A84C" }}>
                        Viernes {format(new Date(featured.date + "T12:00:00"), "d 'de' MMMM", { locale: es })}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                      {featured.title}
                    </h3>
                    {featured.promo &&
                <div className="flex items-center gap-2 mb-3">
                        <Tag size={13} style={{ color: "#75AADB" }} />
                        <span className="text-sm font-bold" style={{ color: "#E8C97A" }}>{featured.promo}</span>
                      </div>
                }
                    {featured.description &&
                <p className="text-gray-400 text-sm leading-relaxed">{featured.description}</p>
                }
                  </div>
                </div>
              </div>
          }

            {/* Rest grid */}
            {rest.length > 0 &&
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
                {rest.map((ev) =>
            <div key={ev.id} className="rounded-xl overflow-hidden group transition-all duration-300 hover:-translate-y-1"
            style={{ background: "#0f0f0f", border: "1px solid #1e1e1e" }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1e1e1e"}>
                    {ev.photo_url &&
              <div className="aspect-video overflow-hidden">
                        <img src={ev.photo_url} alt={ev.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
              }
                    <div className="p-5">
                      <div className="flex items-center gap-1.5 mb-2">
                        <CalendarDays size={12} style={{ color: "#C9A84C" }} />
                        <span className="text-xs uppercase tracking-widest" style={{ color: "#C9A84C" }}>
                          Viernes {format(new Date(ev.date + "T12:00:00"), "d MMM", { locale: es })}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {ev.title}
                      </h3>
                      {ev.promo &&
                <div className="flex items-center gap-1.5 mb-2">
                          <Tag size={11} style={{ color: "#75AADB" }} />
                          <span className="text-xs font-semibold" style={{ color: "#E8C97A" }}>{ev.promo}</span>
                        </div>
                }
                      {ev.description &&
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">{ev.description}</p>
                }
                    </div>
                  </div>
            )}
              </div>
          }
          </div>
        }
      </section>

      {/* CONTACT FOOTER */}
      <div className="py-10 md:py-12 px-4" style={{ borderTop: "1px solid #111" }}>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <a href="https://www.instagram.com/pachaoficialok" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70" style={{ color: "#888" }}>
            <Instagram size={16} style={{ color: "#C9A84C" }} /> @pachaoficialok
          </a>
          <div className="h-4 w-px" style={{ background: "#222" }} />
          <a href="https://wa.me/5493468546935" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70" style={{ color: "#888" }}>
            <MessageCircle size={16} style={{ color: "#C9A84C" }} /> 3468-546935
          </a>
          <div className="h-4 w-px" style={{ background: "#222" }} />
          <a href="http://www.pachadisco.com.ar" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70" style={{ color: "#888" }}>
            <Globe size={16} style={{ color: "#C9A84C" }} /> www.pachadisco.com.ar
          </a>
        </div>
      </div>
    </div>
    </PullToRefresh>
  );
}