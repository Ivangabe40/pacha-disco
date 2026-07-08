import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Crown, Calendar, Users, MapPin, MessageSquare, CheckCircle2, Phone, Mail, ChevronRight } from "lucide-react";

const SECTORS = [
  {
    id: "Mesa VIP Planta Baja",
    label: "Mesa VIP Planta Baja",
    desc: "Vista directa a la pista. Capacidad hasta 8 personas.",
    icon: "🍾",
    color: "rgba(116,172,223,0.15)",
    border: "rgba(116,172,223,0.4)"
  },
  {
    id: "Mesa VIP Planta Alta",
    label: "Mesa VIP Planta Alta",
    desc: "Vista panorámica del salón. Hasta 10 personas.",
    icon: "👑",
    color: "rgba(201,168,76,0.12)",
    border: "rgba(201,168,76,0.4)"
  },
  {
    id: "Sector Privado",
    label: "Sector Privado",
    desc: "Espacio reservado con acceso exclusivo. Hasta 20 personas.",
    icon: "🔒",
    color: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.15)"
  },
  {
    id: "Barra Exclusiva",
    label: "Barra Exclusiva",
    desc: "Atención personalizada en barra privada. Hasta 6 personas.",
    icon: "🥂",
    color: "rgba(116,172,223,0.08)",
    border: "rgba(116,172,223,0.25)"
  },
  {
    id: "Reservado Premium",
    label: "Reservado Premium",
    desc: "La experiencia más exclusiva del boliche. Hasta 30 personas.",
    icon: "⭐",
    color: "rgba(201,168,76,0.12)",
    border: "rgba(201,168,76,0.4)"
  }
];

const INITIAL = {
  name: "", phone: "", email: "", event_date: "", sector: "", guests: "", message: ""
};

export default function VIPReservations() {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.event_date || !form.sector || !form.guests) {
      setError("Por favor completá todos los campos obligatorios.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await base44.entities.VIPReservation.create({ ...form, guests: Number(form.guests), status: "pendiente" });
      setSuccess(true);
    } catch {
      setError("Ocurrió un error al enviar la solicitud. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#070707" }}>
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(116,172,223,0.1)", border: "1px solid rgba(116,172,223,0.3)" }}>
            <CheckCircle2 size={40} style={{ color: "#75AADB" }} />
          </div>
          <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            ¡Reserva Enviada!
          </h2>
          <p className="text-gray-400 mb-2">Tu solicitud fue recibida. Nuestro equipo te contactará dentro de las próximas 24 hs para confirmar.</p>
          <p className="text-gray-600 text-sm mb-8">¿Consultas urgentes? Escribinos por WhatsApp.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/5493468546935" target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl text-white font-bold text-sm"
              style={{ background: "#25D366" }}>
              💬 WhatsApp
            </a>
            <button onClick={() => { setSuccess(false); setForm(INITIAL); }}
              className="px-6 py-3 rounded-xl text-white font-bold text-sm btn-red">
              Nueva reserva
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#070707", minHeight: "100vh" }}>
      {/* Hero */}
      <div className="relative py-16 md:py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(116,172,223,0.12) 0%, transparent 70%)"
        }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-12" style={{ background: "rgba(201,168,76,0.5)" }} />
            <Crown size={18} style={{ color: "#C9A84C" }} />
            <div className="h-px w-12" style={{ background: "rgba(201,168,76,0.5)" }} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase mb-4"
            style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 0 40px rgba(116,172,223,0.3)" }}>
            Reservas <span style={{ color: "#75AADB" }}>VIP</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Viví la noche en Pachá como nunca antes. Elegí tu sector, fecha y nosotros nos encargamos del resto.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-10">

          {/* Sector Selector */}
          <div>
            <h2 className="text-white text-xl font-bold mb-1 tracking-wide uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
              Elegí tu sector
            </h2>
            <p className="text-gray-600 text-sm mb-5">Seleccioná el espacio que mejor se adapte a tu grupo.</p>
            <div className="space-y-3">
              {SECTORS.map(s => (
                <button key={s.id} type="button"
                  onClick={() => set("sector", s.id)}
                  className="w-full text-left px-4 py-4 rounded-xl transition-all duration-200 flex items-center gap-4"
                  style={{
                    background: form.sector === s.id ? s.color : "rgba(255,255,255,0.02)",
                    border: `1px solid ${form.sector === s.id ? s.border : "rgba(255,255,255,0.06)"}`,
                    transform: form.sector === s.id ? "scale(1.01)" : "scale(1)"
                  }}>
                  <span className="text-2xl">{s.icon}</span>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{s.label}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{s.desc}</p>
                  </div>
                  {form.sector === s.id && <ChevronRight size={16} style={{ color: "#75AADB" }} />}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="text-white text-xl font-bold mb-1 tracking-wide uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
              Tus datos
            </h2>
            <p className="text-gray-600 text-sm mb-5">Completá el formulario y te contactamos para confirmar.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest mb-1.5 block">Nombre completo *</label>
                <input value={form.name} onChange={e => set("name", e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none placeholder-gray-700 transition-all"
                  style={{ background: "#0f0f0f", border: "1px solid #2a2a2a" }}
                  onFocus={e => e.target.style.borderColor = "#75AADB"}
                  onBlur={e => e.target.style.borderColor = "#2a2a2a"}
                />
              </div>

              {/* Phone + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <Phone size={10} /> Teléfono *
                  </label>
                  <input value={form.phone} onChange={e => set("phone", e.target.value)}
                    placeholder="+54 9..."
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none placeholder-gray-700 transition-all"
                    style={{ background: "#0f0f0f", border: "1px solid #2a2a2a" }}
                    onFocus={e => e.target.style.borderColor = "#75AADB"}
                    onBlur={e => e.target.style.borderColor = "#2a2a2a"}
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <Mail size={10} /> Email
                  </label>
                  <input value={form.email} onChange={e => set("email", e.target.value)}
                    placeholder="tu@email.com" type="email"
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none placeholder-gray-700 transition-all"
                    style={{ background: "#0f0f0f", border: "1px solid #2a2a2a" }}
                    onFocus={e => e.target.style.borderColor = "#75AADB"}
                    onBlur={e => e.target.style.borderColor = "#2a2a2a"}
                  />
                </div>
              </div>

              {/* Date + Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <Calendar size={10} /> Fecha del evento *
                  </label>
                  <input value={form.event_date} onChange={e => set("event_date", e.target.value)}
                    type="date" min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
                    style={{ background: "#0f0f0f", border: "1px solid #2a2a2a", colorScheme: "dark" }}
                    onFocus={e => e.target.style.borderColor = "#75AADB"}
                    onBlur={e => e.target.style.borderColor = "#2a2a2a"}
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <Users size={10} /> Personas *
                  </label>
                  <input value={form.guests} onChange={e => set("guests", e.target.value)}
                    type="number" min="1" max="30" placeholder="Ej: 6"
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none placeholder-gray-700 transition-all"
                    style={{ background: "#0f0f0f", border: "1px solid #2a2a2a" }}
                    onFocus={e => e.target.style.borderColor = "#75AADB"}
                    onBlur={e => e.target.style.borderColor = "#2a2a2a"}
                  />
                </div>
              </div>

              {/* Sector display */}
              {form.sector && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
                  style={{ background: "rgba(116,172,223,0.08)", border: "1px solid rgba(116,172,223,0.2)" }}>
                  <MapPin size={13} style={{ color: "#75AADB" }} />
                  <span className="text-gray-300 text-sm">{form.sector}</span>
                </div>
              )}

              {/* Message */}
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <MessageSquare size={10} /> Pedidos especiales
                </label>
                <textarea value={form.message} onChange={e => set("message", e.target.value)}
                  placeholder="Cumpleaños, decoración, botella especial..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none placeholder-gray-700 resize-none transition-all"
                  style={{ background: "#0f0f0f", border: "1px solid #2a2a2a" }}
                  onFocus={e => e.target.style.borderColor = "#75AADB"}
                  onBlur={e => e.target.style.borderColor = "#2a2a2a"}
                />
              </div>

              {error && (
                <p className="text-sky-400 text-xs px-1">{error}</p>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl text-white font-black tracking-widest uppercase text-sm transition-all btn-red disabled:opacity-50"
                style={{ letterSpacing: "0.15em" }}>
                {loading ? "Enviando..." : "Solicitar Reserva VIP"}
              </button>

              <p className="text-gray-700 text-xs text-center">
                Al enviar aceptás que nuestro equipo te contacte para confirmar la reserva.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}