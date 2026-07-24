import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Calendar, Clock, Music, ChevronLeft, Share2, Copy, Check, Bell } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useEventReminder } from "@/hooks/useEventReminder";

export default function EventDetail() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { reminded, toggle: toggleReminder } = useEventReminder(event);

  const shareUrl = window.location.href;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = event ? `🎉 *${event.title}* — ¡No te lo pierdas! ${shareUrl}` : shareUrl;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareTwitter = () => {
    const text = event ? `🎉 ${event.title} — ¡No te lo pierdas! 🎶` : "";
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      base44.entities.Event.get(id).then((data) => {
        setEvent(data);
        setLoading(false);
      }).catch(() => {
        setEvent(null);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  // SEO: actualizar meta tags dinámicamente cuando carga el evento
  useEffect(() => {
    if (!event) return;

    const date = new Date(event.date);
    const dateStr = format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
    const pageTitle = `${event.title} — ${dateStr} | Pachá Night Club`;
    const djsStr = event.djs ? ` con ${event.djs}.` : "";
    const genresStr = event.genres ? ` Música: ${event.genres}.` : "";
    const metaDesc = `${event.title} en Pachá Night Club el ${dateStr}.${djsStr}${genresStr}`;

    // Title
    document.title = pageTitle;

    // Helpers
    const setMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    const setOG = (property, content) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute("property", property); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };

    setMeta("description", metaDesc);
    setOG("og:title", pageTitle);
    setOG("og:description", metaDesc);
    setOG("og:type", "event");
    setOG("og:url", window.location.href);
    if (event.flyer_url) setOG("og:image", event.flyer_url);

    // Cleanup: restaurar title original al salir
    return () => { document.title = "Pachá Night Club | Discoteca en Corral de Bustos, Córdoba"; };
  }, [event]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0A0A0A" }}>
      <div className="w-10 h-10 rounded-full border-2 border-t-yellow-500 border-gray-800 animate-spin"></div>
    </div>);


  if (!event) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0A0A0A" }}>
      <p className="text-gray-400">Evento no encontrado</p>
    </div>);


  const date = new Date(event.date);

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      {/* Hero */}
      <div className="relative" style={{ minHeight: "50vh" }}>
        {event.video_url ?
        <video src={event.video_url} className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "brightness(0.3)" }} autoPlay loop muted playsInline /> :
        event.flyer_url &&
        <img src={event.flyer_url} alt={event.title}
        className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.3)" }} />
        }
        <div className="mx-4 pr-4 pl-4 absolute inset-0" style={{ background: "linear-gradient(to top, #0A0A0A 20%, transparent 100%)" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pt-8 pb-16">
          <Link to={createPageUrl("Home")} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm">
            <ChevronLeft size={16} /> Volver a eventos
          </Link>
          <h1 className="text-3xl md:text-6xl font-bold text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {event.title}
          </h1>
          {/* Reminder button */}
          <div className="mt-6 mb-2">
            <button
              onClick={toggleReminder}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
              style={reminded
                ? { background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.5)", color: "#C9A84C" }
                : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#999" }
              }
            >
              {reminded ? <Bell size={15} fill="#C9A84C" /> : <Bell size={15} />}
              {reminded ? "Recordatorio activado" : "Recordarme"}
              {reminded && <span className="ml-1 w-2 h-2 rounded-full bg-yellow-500 animate-pulse inline-block" />}
            </button>
          </div>

          {/* Share buttons */}
          <div className="flex flex-wrap gap-2 md:gap-3 mt-2">
            <span className="flex items-center gap-1.5 text-gray-500 text-xs uppercase tracking-wider">
              <Share2 size={12} /> Compartir
            </span>
            <button onClick={shareWhatsApp}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all"
            style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.35)", color: "#25D366" }}>
              WhatsApp
            </button>
            <button onClick={shareTwitter}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#ccc" }}>
              X / Twitter
            </button>
            <button onClick={copyLink}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#ccc" }}>
              {copied ? <><Check size={12} /> ¡Copiado!</> : <><Copy size={12} /> Copiar link</>}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 pb-20 mt-6 md:mt-8">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Left: Flyer / Video */}
          <div className="md:col-span-1">
            {event.video_url ?
            <video src={event.video_url} className="w-full rounded-2xl shadow-2xl" autoPlay loop muted playsInline /> :
            event.flyer_url ?
            <img src={event.flyer_url} alt={event.title} className="w-full rounded-2xl shadow-2xl" /> :
            null}
          </div>

          {/* Right: Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Date/Time */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="p-4 rounded-xl" style={{ background: "#111", border: "1px solid #222" }}>
                <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-1">
                  <Calendar size={12} style={{ color: "#C9A84C" }} /> Fecha
                </div>
                <div className="text-white font-semibold capitalize">
                  {format(date, "EEEE d 'de' MMMM", { locale: es })}
                </div>
              </div>
              <div className="p-4 rounded-xl" style={{ background: "#111", border: "1px solid #222" }}>
                <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-1">
                  <Clock size={12} style={{ color: "#C9A84C" }} /> Hora
                </div>
                <div className="text-white font-semibold">{format(date, "HH:mm")}hs</div>
              </div>
              {event.genres &&
              <div className="p-4 rounded-xl" style={{ background: "#111", border: "1px solid #222" }}>
                  <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-1">
                    <Music size={12} style={{ color: "#C9A84C" }} /> Géneros
                  </div>
                  <div className="text-white font-semibold">{event.genres}</div>
                </div>
              }

            </div>

            {/* DJs */}
            {event.djs &&
            <div className="p-5 rounded-xl" style={{ background: "#111", border: "1px solid #222" }}>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Artistas / DJs</p>
                <p className="text-white font-medium text-lg">{event.djs}</p>
              </div>
            }

            {/* Description */}
            {event.description &&
            <div>
                <p className="text-gray-300 leading-relaxed">{event.description}</p>
              </div>
            }


          </div>
        </div>
      </div>

    </div>);

}