import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Instagram, MessageCircle, Globe, CalendarDays, Tag, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function EscapeBarSection() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    base44.entities.EscapeBarEvent.list("-date").then((data) => {
      setEvents(data.filter((e) => !e.is_hidden));
    });
  }, []);

  const featured = events.find((e) => e.is_featured) || events[0];
  const previews = events.filter((e) => e.id !== featured?.id).slice(0, 3);

  return (
    <section className="relative overflow-hidden py-16 px-4" style={{ background: "#050303" }}>
      {/* Gold borders */}
      <div className="absolute top-0 left-0 right-0 h-px"
      style={{ background: "linear-gradient(90deg, transparent, #C9A84C 30%, #E8C97A 50%, #C9A84C 70%, transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-px"
      style={{ background: "linear-gradient(90deg, transparent, #C9A84C 30%, #E8C97A 50%, #C9A84C 70%, transparent)" }} />

      <div className="relative max-w-5xl mx-auto">
        {/* Header with video */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          {/* Video */}
          






          
          <div className="text-center md:text-left">
            <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: "#C9A84C" }}>Una nueva experiencia</p>
            <h2 className="text-4xl md:text-5xl font-black uppercase leading-none mb-2"
            style={{
              fontFamily: "'Playfair Display', serif",
              background: "linear-gradient(135deg, #C9A84C 0%, #F5E6A3 40%, #E8C97A 60%, #9A6F20 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 20px rgba(201,168,76,0.3))"
            }}>
              Escape Bar
            </h2>
            <p className="text-base tracking-[0.35em] uppercase" style={{ color: "#E8C97A", fontWeight: 300 }}>
              Nuevo Espacio / Bar Lounge
            </p>
            <p className="text-sm mt-2" style={{ color: "#666" }}>
              carta de tragos · vinos · cervezas · música · cada viernes
            </p>
          </div>
        </div>

        {/* Events content */}
        {events.length > 0 &&
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 rounded-full" style={{ background: "linear-gradient(#C9A84C, #9A6F20)" }} />
              <p className="text-sm uppercase tracking-widest font-bold" style={{ color: "#C9A84C" }}>Próximos viernes</p>
            </div>

            {/* Featured */}
            {featured &&
          <div className="rounded-2xl overflow-hidden"
          style={{ background: "#0f0f0f", border: "1px solid rgba(201,168,76,0.35)" }}>
                <div className="flex flex-col md:flex-row">
                  {featured.photo_url &&
              <div className="md:w-2/5 aspect-video md:aspect-auto overflow-hidden">
                      <img src={featured.photo_url} alt={featured.title} className="w-full h-full object-cover" />
                    </div>
              }
                  <div className="flex-1 p-6 flex flex-col justify-center">
                    {featured.is_featured &&
                <span className="inline-block text-xs px-2 py-0.5 rounded font-bold mb-3 self-start"
                style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#050303" }}>
                        ⭐ Destacado
                      </span>
                }
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarDays size={13} style={{ color: "#C9A84C" }} />
                      <span className="text-xs uppercase tracking-widest" style={{ color: "#C9A84C" }}>
                        {(() => {try {return format(new Date(featured.date + "T12:00:00"), "EEEE d 'de' MMMM", { locale: es });} catch {return featured.date;}})()}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {featured.title}
                    </h3>
                    {featured.promo &&
                <div className="flex items-center gap-1.5 mb-2">
                        <Tag size={12} style={{ color: "#E8001D" }} />
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

            {/* Preview cards */}
            {previews.length > 0 &&
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                {previews.map((ev) =>
            <div key={ev.id} className="rounded-xl overflow-hidden"
            style={{ background: "#0f0f0f", border: "1px solid #1e1e1e" }}>
                    {ev.photo_url &&
              <div className="aspect-video overflow-hidden">
                        <img src={ev.photo_url} alt={ev.title} className="w-full h-full object-cover" />
                      </div>
              }
                    <div className="p-4">
                      <p className="text-xs mb-1 uppercase tracking-widest" style={{ color: "#C9A84C" }}>
                        {(() => {try {return format(new Date(ev.date + "T12:00:00"), "d MMM", { locale: es });} catch {return ev.date;}})()}
                      </p>
                      <h4 className="text-white font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>{ev.title}</h4>
                      {ev.promo && <p className="text-xs mt-1" style={{ color: "#E8C97A" }}>🏷 {ev.promo}</p>}
                    </div>
                  </div>
            )}
              </div>
          }
          </div>
        }

        {/* Ver más CTA */}
        <div className="text-center mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/EscapeBar">
            <button className="px-8 py-3 rounded-lg text-sm font-black tracking-widest uppercase transition-all hover:-translate-y-1"
            style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A, #C9A84C)", color: "#050303", boxShadow: "0 4px 20px rgba(201,168,76,0.3)" }}>
              Ver todos los viernes <ChevronRight size={14} className="inline ml-1" />
            </button>
          </Link>
          <a href="https://wa.me/5493468546935?text=Hola!%20Me%20interesa%20Escape%20Bar" target="_blank" rel="noopener noreferrer">
            <button className="px-8 py-3 rounded-lg text-sm font-bold tracking-widest uppercase transition-all hover:-translate-y-1"
            style={{ background: "transparent", border: "1px solid rgba(201,168,76,0.4)", color: "#C9A84C" }}>
              <MessageCircle size={14} className="inline mr-1" /> Consultar
            </button>
          </a>
        </div>
      </div>
    </section>);

}