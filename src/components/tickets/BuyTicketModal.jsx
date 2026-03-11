import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { X, Ticket, User, Mail, Phone, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function BuyTicketModal({ event, onClose }) {
  const [step, setStep] = useState(1); // 1: tipo, 2: datos, 3: confirmado
  const [ticketType, setTicketType] = useState("anticipada");
  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({ buyer_name: "", buyer_email: "", buyer_phone: "" });
  const [loading, setLoading] = useState(false);
  const [ticketCode, setTicketCode] = useState("");

  const price = ticketType === "anticipada" ? event.ticket_price : null;
  const total = price ? price * qty : 0;

  const handleBuy = async () => {
    setLoading(true);
    const code = "PCH-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const ticket = await base44.entities.Ticket.create({
      event_id: event.id,
      event_title: event.title,
      event_date: event.date,
      buyer_name: form.buyer_name,
      buyer_email: form.buyer_email,
      buyer_phone: form.buyer_phone,
      quantity: qty,
      ticket_type: ticketType,
      total_amount: total,
      status: ticketType === "reserva" ? "pendiente" : "confirmado",
      ticket_code: code,
    });
    // Update tickets_sold
    await base44.entities.Event.update(event.id, {
      tickets_sold: (event.tickets_sold || 0) + qty
    });
    setTicketCode(code);
    setLoading(false);
    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: "rgba(0,0,0,0.85)" }}>
      <div className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden max-h-[92vh] overflow-y-auto" style={{ background: "#111", border: "1px solid #333" }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "#222" }}>
          <div>
            <h2 className="font-bold text-xl text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              {step === 3 ? "¡Entrada Confirmada!" : "Comprar Entrada"}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">{event.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* STEP 1: Tipo y cantidad */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest block mb-3">Tipo de entrada</label>
                <div className="grid grid-cols-2 gap-3">
                  {["anticipada", "reserva"].map(t => (
                    <button key={t} onClick={() => setTicketType(t)}
                      className="p-4 rounded-xl border-2 text-center transition-all"
                      style={ticketType === t
                        ? { borderColor: "#C9A84C", background: "rgba(201,168,76,0.1)" }
                        : { borderColor: "#333", background: "#1a1a1a" }}>
                      <div className="font-semibold text-white capitalize">{t}</div>
                      {t === "anticipada" && event.ticket_price && (
                        <div className="text-sm mt-1" style={{ color: "#C9A84C" }}>${event.ticket_price.toLocaleString()}</div>
                      )}
                      {t === "reserva" && (
                        <div className="text-xs text-gray-500 mt-1">Pago en puerta</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest block mb-3">Cantidad</label>
                <div className="flex items-center gap-4">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 rounded-full border flex items-center justify-center text-white font-bold text-lg"
                    style={{ borderColor: "#444", background: "#1a1a1a" }}>−</button>
                  <span className="text-2xl font-bold text-white w-8 text-center">{qty}</span>
                  <button onClick={() => setQty(Math.min(10, qty + 1))}
                    className="w-10 h-10 rounded-full border flex items-center justify-center text-white font-bold text-lg"
                    style={{ borderColor: "#C9A84C", background: "rgba(201,168,76,0.1)" }}>+</button>
                </div>
              </div>

              {ticketType === "anticipada" && price && (
                <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "#1a1a1a" }}>
                  <span className="text-gray-400">Total</span>
                  <span className="text-2xl font-bold" style={{ color: "#C9A84C" }}>${total.toLocaleString()}</span>
                </div>
              )}

              <button onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl font-semibold tracking-wider uppercase"
                style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#0A0A0A" }}>
                Continuar
              </button>
            </div>
          )}

          {/* STEP 2: Datos personales */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest block mb-2">Nombre completo *</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input value={form.buyer_name} onChange={e => setForm({ ...form, buyer_name: e.target.value })}
                    placeholder="Tu nombre"
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-white text-sm outline-none"
                    style={{ background: "#1a1a1a", border: "1px solid #333" }} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest block mb-2">Email *</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input value={form.buyer_email} onChange={e => setForm({ ...form, buyer_email: e.target.value })}
                    placeholder="tu@email.com" type="email"
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-white text-sm outline-none"
                    style={{ background: "#1a1a1a", border: "1px solid #333" }} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest block mb-2">Teléfono</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input value={form.buyer_phone} onChange={e => setForm({ ...form, buyer_phone: e.target.value })}
                    placeholder="+54 11 ..."
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-white text-sm outline-none"
                    style={{ background: "#1a1a1a", border: "1px solid #333" }} />
                </div>
              </div>

              <div className="p-4 rounded-xl text-sm" style={{ background: "#1a1a1a" }}>
                <div className="flex justify-between text-gray-400 mb-1">
                  <span>{event.title}</span>
                  <span>{qty}x</span>
                </div>
                <div className="flex justify-between font-bold text-white">
                  <span>Tipo: {ticketType}</span>
                  {ticketType === "anticipada" && <span style={{ color: "#C9A84C" }}>${total.toLocaleString()}</span>}
                  {ticketType === "reserva" && <span className="text-gray-400">Pago en puerta</span>}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl text-gray-400 font-medium"
                  style={{ border: "1px solid #333" }}>Volver</button>
                <button onClick={handleBuy}
                  disabled={!form.buyer_name || !form.buyer_email || loading}
                  className="flex-2 flex-grow py-3 rounded-xl font-semibold tracking-wider uppercase flex items-center justify-center gap-2"
                  style={(!form.buyer_name || !form.buyer_email)
                    ? { background: "#333", color: "#666", cursor: "not-allowed" }
                    : { background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#0A0A0A" }}>
                  {loading ? "Procesando..." : <><Ticket size={14} /> Confirmar</>}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Confirmación */}
          {step === 3 && (
            <div className="text-center space-y-5">
              <div className="flex justify-center">
                <CheckCircle size={64} style={{ color: "#C9A84C" }} />
              </div>
              <div>
                <p className="text-gray-400 mb-1 text-sm">Tu código de entrada</p>
                <div className="text-3xl font-bold tracking-widest py-3 px-6 rounded-xl inline-block"
                  style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#0A0A0A", fontFamily: "monospace" }}>
                  {ticketCode}
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Guardá este código. Te lo pedirán en la entrada. También enviamos los detalles a <strong className="text-white">{form.buyer_email}</strong>
              </p>
              {ticketType === "reserva" && (
                <div className="p-4 rounded-xl text-sm text-yellow-400" style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)" }}>
                  Reserva confirmada. Recordá abonar en puerta: ${event.ticket_price_door?.toLocaleString() || "precio en puerta"}
                </div>
              )}
              <button onClick={onClose}
                className="w-full py-3 rounded-xl font-semibold tracking-wider uppercase"
                style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#0A0A0A" }}>
                ¡Hasta pronto!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}