import { useState } from "react";
import { PartyPopper, Briefcase, Music, Star, Users, ChevronDown, ChevronUp, Send, CheckCircle } from "lucide-react";
import BottomSheetPicker from "@/components/BottomSheetPicker";

const eventTypes = [
  {
    icon: PartyPopper,
    title: "Cumpleaños",
    description: "Celebrá tu cumpleaños en uno de los espacios más exclusivos de la ciudad. Decoración personalizada, menú especial y ambiente único.",
    features: ["Decoración temática", "Torta y brindis", "Sector VIP reservado", "DJ personalizado"]
  },
  {
    icon: Briefcase,
    title: "Eventos Corporativos",
    description: "Lanzamientos de producto, cenas de empresa, team buildings y celebraciones corporativas con el estilo y la infraestructura que tu marca merece.",
    features: ["Equipo audiovisual", "Catering a medida", "Coordinador exclusivo", "Capacidad hasta 500 personas"]
  },
  {
    icon: Music,
    title: "Fiestas Privadas",
    description: "¿Querés organizar tu propia fiesta con acceso exclusivo al venue? Nosotros nos encargamos de todo para que vos y tus invitados vivan una noche inolvidable.",
    features: ["Acceso exclusivo al venue", "Sistema de sonido profesional", "Iluminación programable", "Barra de tragos personalizada"]
  },
  {
    icon: Star,
    title: "Despedidas de Soltero/a",
    description: "La noche previa al gran día tiene que ser épica. Diseñamos experiencias únicas para despedidas que se recuerdan.",
    features: ["Paquetes especiales", "Atención VIP al festejado/a", "Fotos y recuerdos", "Sorpresas incluidas"]
  },
  {
    icon: Users,
    title: "Reuniones Sociales",
    description: "Desde reencuentros de amigos hasta celebraciones familiares. Nuestros espacios se adaptan a todo tipo de reuniones íntimas o multitudinarias.",
    features: ["Ambientes privatizados", "Menú flexible", "Acceso controlado", "Estacionamiento"]
  }
];

export default function PrivateEvents() {
  const [openCard, setOpenCard] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", eventType: "", date: "", guests: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [showEventTypePicker, setShowEventTypePicker] = useState(false);

  const eventTypeOptions = eventTypes.map(ev => ({ value: ev.title, label: ev.title }));

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    const { base44 } = await import("@/api/base44Client");
    await Promise.all([
      base44.entities.PrivateEventRequest.create({
        name: form.name,
        email: form.email,
        phone: form.phone,
        event_type: form.eventType,
        date: form.date,
        guests: form.guests ? Number(form.guests) : undefined,
        message: form.message,
        status: "pendiente"
      }),
      base44.integrations.Core.SendEmail({
        to: "contacto@pachadisco.com.ar",
        subject: `Consulta Evento Privado - ${form.eventType || "Sin especificar"}`,
        body: `Nombre: ${form.name}\nEmail: ${form.email}\nTeléfono: ${form.phone}\nTipo de evento: ${form.eventType}\nFecha tentativa: ${form.date}\nCantidad de invitados: ${form.guests}\n\nMensaje:\n${form.message}`
      })
    ]);
    setSent(true);
    setSending(false);
  };

  return (
    <div className="min-h-screen" style={{ background: "#070707", color: "#F0EBE3" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;500;600&display=swap'); body{font-family:'Inter',sans-serif;} h1,h2,h3,h4{font-family:'Playfair Display',serif;}`}</style>

      {/* Hero */}
      <div className="relative py-20 md:py-28 px-4 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(232,0,29,0.12) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#E8001D" }}>Pachá · Espacios Exclusivos</p>
          <h1 className="text-4xl md:text-6xl font-black mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Eventos <span style={{ color: "#E8001D" }}>Privados</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            Convertí Pachá en el escenario de tu próxima celebración. Nuestro equipo se encarga de cada detalle para que vivas una experiencia única e irrepetible.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px max-w-5xl mx-auto mb-16" style={{ background: "linear-gradient(90deg, transparent, rgba(232,0,29,0.4), transparent)" }} />

      {/* Event Types */}
      <div className="max-w-5xl mx-auto px-4 mb-24">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>
          ¿Qué tipo de evento tenés en mente?
        </h2>
        <div className="grid gap-4">
          {eventTypes.map((ev, i) => {
            const Icon = ev.icon;
            const isOpen = openCard === i;
            return (
              <div
                key={i}
                className="rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
                style={{
                  background: "#0f0f0f",
                  border: isOpen ? "1px solid rgba(232,0,29,0.5)" : "1px solid #1e1e1e",
                  boxShadow: isOpen ? "0 4px 30px rgba(232,0,29,0.1)" : "none"
                }}
                onClick={() => setOpenCard(isOpen ? null : i)}
              >
                <div className="flex items-center justify-between px-4 md:px-6 py-4 md:py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(232,0,29,0.12)" }}>
                      <Icon size={20} style={{ color: "#E8001D" }} />
                    </div>
                    <h3 className="text-lg font-bold">{ev.title}</h3>
                  </div>
                  {isOpen ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
                </div>
                {isOpen && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-400 mb-4 leading-relaxed">{ev.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {ev.features.map((f, j) => (
                        <span key={j} className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(232,0,29,0.1)", color: "#E8001D", border: "1px solid rgba(232,0,29,0.2)" }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-2xl mx-auto px-4 pb-24">
        <div className="h-px mb-16" style={{ background: "linear-gradient(90deg, transparent, rgba(232,0,29,0.3), transparent)" }} />
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Consultá tu Evento
        </h2>
        <p className="text-gray-500 text-center mb-10 text-sm">Completá el formulario y nos comunicamos en menos de 24hs.</p>

        {sent ? (
          <div className="text-center py-16">
            <CheckCircle size={48} className="mx-auto mb-4" style={{ color: "#E8001D" }} />
            <h3 className="text-xl font-bold mb-2">¡Consulta enviada!</h3>
            <p className="text-gray-500">Nos ponemos en contacto a la brevedad.</p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 tracking-wider uppercase">Nombre completo *</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                  style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", color: "#F0EBE3" }}
                  onFocus={e => e.target.style.borderColor = "rgba(232,0,29,0.5)"}
                  onBlur={e => e.target.style.borderColor = "#1e1e1e"}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 tracking-wider uppercase">Email *</label>
                <input
                  required type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                  style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", color: "#F0EBE3" }}
                  onFocus={e => e.target.style.borderColor = "rgba(232,0,29,0.5)"}
                  onBlur={e => e.target.style.borderColor = "#1e1e1e"}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 tracking-wider uppercase">Teléfono</label>
                <input
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+54 9 ..."
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                  style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", color: "#F0EBE3" }}
                  onFocus={e => e.target.style.borderColor = "rgba(232,0,29,0.5)"}
                  onBlur={e => e.target.style.borderColor = "#1e1e1e"}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 tracking-wider uppercase">Tipo de evento</label>
                <button
                  type="button"
                  onClick={() => setShowEventTypePicker(true)}
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all text-left flex items-center justify-between"
                  style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", color: form.eventType ? "#F0EBE3" : "#555" }}
                >
                  <span>{form.eventType || "Seleccioná..."}</span>
                  <ChevronDown size={14} style={{ color: "#555" }} />
                </button>
                <BottomSheetPicker
                  open={showEventTypePicker}
                  onClose={() => setShowEventTypePicker(false)}
                  title="Tipo de evento"
                  options={eventTypeOptions}
                  value={form.eventType}
                  onChange={val => setForm({ ...form, eventType: val })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 tracking-wider uppercase">Fecha tentativa</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                  style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", color: "#F0EBE3", colorScheme: "dark" }}
                  onFocus={e => e.target.style.borderColor = "rgba(232,0,29,0.5)"}
                  onBlur={e => e.target.style.borderColor = "#1e1e1e"}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 tracking-wider uppercase">Cantidad de invitados</label>
                <input
                  type="number" min="1"
                  value={form.guests}
                  onChange={e => setForm({ ...form, guests: e.target.value })}
                  placeholder="Ej: 150"
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                  style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", color: "#F0EBE3" }}
                  onFocus={e => e.target.style.borderColor = "rgba(232,0,29,0.5)"}
                  onBlur={e => e.target.style.borderColor = "#1e1e1e"}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 tracking-wider uppercase">Contanos más sobre tu evento</label>
              <textarea
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="Describí qué tenés en mente, requerimientos especiales, etc."
                rows={4}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all resize-none"
                style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", color: "#F0EBE3" }}
                onFocus={e => e.target.style.borderColor = "rgba(232,0,29,0.5)"}
                onBlur={e => e.target.style.borderColor = "#1e1e1e"}
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full py-4 rounded-lg font-black tracking-widest uppercase text-sm flex items-center justify-center gap-2 transition-all"
              style={{ background: "linear-gradient(135deg, #E8001D, #ff1a35)", color: "#fff", opacity: sending ? 0.7 : 1 }}
            >
              <Send size={16} />
              {sending ? "Enviando..." : "Enviar Consulta"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}