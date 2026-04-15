import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Calendar, Clock, Music, Users, Ticket, ChevronLeft, Share2, Copy, Check } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import BuyTicketModal from "@/components/tickets/BuyTicketModal";

export default function EventDetail() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.href;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = event ? `🎉 *${event.title}* — ¡No te lo pierdas! Comprá tu entrada acá: ${shareUrl}` : shareUrl;
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
      base44.entities.Event.list().then((data) => {
        setEvent(data.find((e) => e.id === id) || null);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0A0A0A" }}>
      <div className="w-10 h-10 rounded-full border-2 border-t-yellow-500 border-gray-800 animate-spin"></div>
    </div>);


  if (!event) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0A0A0A" }}>
      <p className="text-gray-400">Evento no encontrado</p>
    </div>);


  const date = new Date(event.date);
  const isSoldOut = event.status === "agotado";
  const availableTickets = event.capacity ? event.capacity - (event.tickets_sold || 0) : null;

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      {/* Hero */}
      <div className="relative" style={{ minHeight: "60vh" }}>
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
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {event.title}
          </h1>
          {/* Share buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
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
        <div className="grid md:grid-cols-3 gap-8">
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
            <div className="grid grid-cols-2 gap-4">
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
              {availableTickets !== null &&
              <div className="p-4 rounded-xl" style={{ background: "#111", border: "1px solid #222" }}>
                  <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-1">
                    <Users size={12} style={{ color: "#C9A84C" }} /> Disponibles
                  </div>
                  <div className="font-semibold" style={{ color: availableTickets < 20 ? "#E8001D" : "#C9A84C" }}>
                    {availableTickets} entradas
                  </div>
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

            {/* Pricing */}
            <div className="p-6 rounded-2xl" style={{ background: "#111", border: "1px solid #333" }}>
              <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Entradas</h3>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {event.ticket_price &&
                <div className="flex-1 p-4 rounded-xl text-center" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.3)" }}>
                    <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">Anticipada</div>
                    <div className="text-3xl font-bold" style={{ color: "#C9A84C" }}>${event.ticket_price.toLocaleString()}</div>
                  </div>
                }
                {event.ticket_price_door &&
                <div className="flex-1 p-4 rounded-xl text-center" style={{ background: "#1a1a1a", border: "1px solid #333" }}>
                    <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">En Puerta</div>
                    <div className="text-3xl font-bold text-gray-400">${event.ticket_price_door.toLocaleString()}</div>
                  </div>
                }
              </div>

              {!isSoldOut && event.status !== "cancelado" ?
              <button onClick={() => setShowModal(true)}
              className="w-full py-4 rounded-xl font-bold tracking-wider uppercase text-lg flex items-center justify-center gap-3"
              style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#0A0A0A" }}>
                  <Ticket size={20} />
                  Comprar Entrada Anticipada
                </button> :

              <div className="w-full py-4 rounded-xl font-bold text-center text-gray-500 uppercase tracking-wider"
              style={{ background: "#1a1a1a", border: "1px solid #333" }}>
                  {event.status === "agotado" ? "Entradas Agotadas" : "Evento Cancelado"}
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      {showModal && <BuyTicketModal event={event} onClose={() => setShowModal(false)} />}
    </div>);

}