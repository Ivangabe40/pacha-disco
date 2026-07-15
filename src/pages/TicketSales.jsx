import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock, Minus, Plus, Music, Loader2, AlertCircle, ChevronDown, Ticket, User, Mail, Phone } from "lucide-react";

const MAX_QTY = 10;

export default function TicketSales() {
  const [params] = useSearchParams();
  const preselectEventId = params.get("event");

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({ buyer_name: "", buyer_email: "", buyer_phone: "" });
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    base44.entities.Event.list("-date").then(data => {
      const available = data.filter(e =>
        new Date(e.date) >= new Date() &&
        e.status === "activo" &&
        e.ticket_price && e.ticket_price > 0
      );
      setEvents(available);
      if (available.length > 0) {
        const preselected = preselectEventId && available.find(e => e.id === preselectEventId);
        setSelectedId(preselected ? preselected.id : available[0].id);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [preselectEventId]);

  const event = events.find(e => e.id === selectedId);
  const availableStock = event && event.capacity
    ? Math.max(0, event.capacity - (event.tickets_sold || 0))
    : null;
  const maxQty = Math.min(MAX_QTY, availableStock !== null ? availableStock : MAX_QTY);
  const total = event ? event.ticket_price * quantity : 0;

  const handleBuy = async () => {
    if (!event) return;
    if (!form.buyer_name.trim() || !form.buyer_email.trim()) {
      setError("Completá tu nombre y email para continuar");
      return;
    }
    setBuying(true);
    setError("");
    try {
      const res = await base44.functions.invoke("create-preference", {
        event_id: event.id,
        quantity: quantity,
        buyer_name: form.buyer_name,
        buyer_email: form.buyer_email,
        buyer_phone: form.buyer_phone,
      });
      if (res.data?.init_point) {
        window.location.href = res.data.init_point;
      } else {
        setError(res.data?.error || "No se pudo crear la preferencia de pago");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error al procesar la compra");
    } finally {
      setBuying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#070707" }}>
      <Loader2 size={32} className="animate-spin" style={{ color: "#C9A84C" }} />
    </div>
  );

  if (events.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ background: "#070707" }}>
      <Ticket size={48} style={{ color: "#C9A84C", opacity: 0.4 }} />
      <h2 className="text-2xl font-bold text-white mt-4" style={{ fontFamily: "'Playfair Display', serif" }}>
        No hay entradas disponibles
      </h2>
      <p className="text-gray-500 text-sm mt-2">Volvé pronto para las próximas fechas.</p>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "#070707" }}>
      {event && (event.background_url || event.flyer_url) && (
        <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
          <img
            src={event.background_url || event.flyer_url}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.4)" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #070707 0%, transparent 70%)" }} />
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 md:px-8 -mt-16 relative z-10 pb-16">
        {events.length > 1 && (
          <div className="mb-6">
            <label className="text-xs text-gray-400 uppercase tracking-widest block mb-2">Seleccionar evento</label>
            <div className="relative">
              <select
                value={selectedId || ""}
                onChange={e => { setSelectedId(e.target.value); setQuantity(1); }}
                className="w-full px-4 py-3 pr-10 rounded-xl text-white text-sm outline-none appearance-none cursor-pointer"
                style={{ background: "#111", border: "1px solid #333" }}
              >
                {events.map(e => (
                  <option key={e.id} value={e.id}>{e.title}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        )}

        <div className="rounded-2xl overflow-hidden" style={{ background: "#111", border: "1px solid #222", boxShadow: "0 10px 60px rgba(201,168,76,0.08)" }}>
          <div className="p-6 md:p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
              style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)" }}>
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#C9A84C" }}>Entrada Anticipada</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white uppercase mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}>
                <Calendar size={14} style={{ color: "#C9A84C" }} />
                <span className="text-sm text-gray-300 capitalize">
                  {format(new Date(event.date), "EEEE d 'de' MMMM", { locale: es })}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}>
                <Clock size={14} style={{ color: "#C9A84C" }} />
                <span className="text-sm text-gray-300">{format(new Date(event.date), "HH:mm")}hs</span>
              </div>
              {event.genres && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}>
                  <Music size={14} style={{ color: "#75AADB" }} />
                  <span className="text-sm text-gray-300">{event.genres}</span>
                </div>
              )}
            </div>

            {availableStock !== null && availableStock === 0 && (
              <div className="mb-6 p-3 rounded-lg text-sm font-semibold"
                style={{ background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.2)", color: "#ff5050" }}>
                Entradas agotadas para este evento.
              </div>
            )}

            {availableStock !== null && availableStock > 0 && availableStock <= 20 && (
              <div className="mb-6 p-3 rounded-lg text-sm"
                style={{ background: "rgba(255,100,100,0.08)", border: "1px solid rgba(255,100,100,0.2)", color: "#ff6b6b" }}>
                ¡Quedan solo {availableStock} entradas!
              </div>
            )}

            <div className="flex items-center justify-between p-4 rounded-xl mb-6"
              style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}>
              <span className="text-gray-400 text-sm">Precio por entrada</span>
              <span className="text-2xl font-bold" style={{ color: "#C9A84C" }}>
                ${event.ticket_price.toLocaleString()}
              </span>
            </div>

            {/* Selector de cantidad */}
            <div className="mb-6">
              <label className="text-xs text-gray-400 uppercase tracking-widest block mb-3">Cantidad de entradas</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
                  style={{
                    background: quantity <= 1 ? "#1a1a1a" : "#222",
                    border: "1px solid #333",
                    color: quantity <= 1 ? "#444" : "#fff",
                    cursor: quantity <= 1 ? "not-allowed" : "pointer"
                  }}
                >
                  <Minus size={18} />
                </button>
                <span className="text-3xl font-bold text-white w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                  disabled={quantity >= maxQty}
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
                  style={{
                    background: quantity >= maxQty ? "#1a1a1a" : "#222",
                    border: "1px solid #333",
                    color: quantity >= maxQty ? "#444" : "#fff",
                    cursor: quantity >= maxQty ? "not-allowed" : "pointer"
                  }}
                >
                  <Plus size={18} />
                </button>
                <span className="text-gray-600 text-xs ml-2">Máx. {maxQty}</span>
              </div>
            </div>

            {/* Datos del comprador */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest block mb-2">Nombre completo *</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    value={form.buyer_name}
                    onChange={e => setForm({ ...form, buyer_name: e.target.value })}
                    placeholder="Tu nombre y apellido"
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-white text-sm outline-none"
                    style={{ background: "#1a1a1a", border: "1px solid #333" }}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest block mb-2">Email *</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={form.buyer_email}
                    onChange={e => setForm({ ...form, buyer_email: e.target.value })}
                    placeholder="tu@email.com"
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-white text-sm outline-none"
                    style={{ background: "#1a1a1a", border: "1px solid #333" }}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest block mb-2">Teléfono (opcional)</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    value={form.buyer_phone}
                    onChange={e => setForm({ ...form, buyer_phone: e.target.value })}
                    placeholder="+54 11 ..."
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-white text-sm outline-none"
                    style={{ background: "#1a1a1a", border: "1px solid #333" }}
                  />
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between p-5 rounded-xl mb-6"
              style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.04))", border: "1px solid rgba(201,168,76,0.25)" }}>
              <div>
                <span className="text-gray-400 text-sm block">Total a pagar</span>
                <span className="text-gray-600 text-xs">{quantity} × ${event.ticket_price.toLocaleString()}</span>
              </div>
              <span className="text-4xl font-black" style={{ color: "#C9A84C", fontFamily: "'Playfair Display', serif" }}>
                ${total.toLocaleString()}
              </span>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg flex items-start gap-2"
                style={{ background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.2)" }}>
                <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleBuy}
              disabled={buying || maxQty === 0}
              className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5"
              style={{
                background: (buying || maxQty === 0) ? "#333" : "linear-gradient(135deg, #009EE3 0%, #00B7EA 100%)",
                boxShadow: buying ? "none" : "0 4px 24px rgba(0,158,227,0.35)",
                cursor: buying ? "not-allowed" : "pointer"
              }}
            >
              {buying ? (
                <><Loader2 size={18} className="animate-spin" /> Procesando...</>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.94 8.42c-.13-.26-.26-.52-.39-.78l-.52-1.04c-.13-.26-.39-.39-.65-.39s-.52.13-.65.39l-.52 1.04-.39.78c-.13.26 0 .52.26.65s.52 0 .65-.26l.13-.26h1.04l.13.26c.13.26.39.26.65.26.26-.13.39-.39.26-.65zM12 1C5.93 1 1 5.93 1 12s4.93 11 11 11 11-4.93 11-11S18.07 1 12 1zm0 20c-4.96 0-9-4.04-9-9s4.04-9 9-9 9 4.04 9 9-4.04 9-9 9zm4.55-9.45c-.39 0-.78.39-.78.78s.39.78.78.78.78-.39.78-.78-.39-.78-.78-.78zm-9.1 0c-.39 0-.78.39-.78.78s.39.78.78.78.78-.39.78-.78-.39-.78-.78-.78z"/>
                  </svg>
                  Comprar con Mercado Pago
                </>
              )}
            </button>

            <p className="text-center text-gray-600 text-xs mt-3">
              Pago seguro vía Mercado Pago Checkout Pro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}