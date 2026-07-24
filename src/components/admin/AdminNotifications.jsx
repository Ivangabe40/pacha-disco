import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Bell, Send, Users, Zap, PartyPopper, Tag, CheckCircle2, Loader2, ChevronDown } from "lucide-react";

const TEMPLATES = [
  {
    id: "lista",
    label: "🎟️ Apertura de Lista",
    icon: "🎟️",
    subject: "¡La lista está abierta! — Pachá Night Club",
    body: "¡Buenas noticias! La lista para el próximo evento en Pachá ya está disponible. Aprovechá el precio anticipado y asegurá tu lugar antes de que se agote.\n\n🔗 Compra tu entrada en: [LINK_ENTRADAS]\n\nNos vemos en la pista,\nEl equipo de Pachá 🔴",
  },
  {
    id: "evento",
    label: "🎉 Evento Especial",
    icon: "🎉",
    subject: "Evento especial en Pachá — ¡No te lo pierdas!",
    body: "Esta noche es especial en Pachá. Tenemos preparado algo único para vos y tus amigos.\n\n🎵 [DESCRIPCIÓN DEL EVENTO]\n📅 [FECHA Y HORA]\n\n¡Sumate a la fiesta!\nEl equipo de Pachá 🔴",
  },
  {
    id: "promo",
    label: "⚡ Promo Relámpago",
    icon: "⚡",
    subject: "⚡ Promo relámpago por tiempo limitado — Pachá",
    body: "¡OFERTA FLASH! Solo por las próximas horas tenemos una promoción exclusiva para vos:\n\n🔥 [DESCRIPCIÓN DE LA PROMO]\n⏰ Válida hasta: [HORARIO LÍMITE]\n\nNo dejes pasar esta oportunidad.\nEl equipo de Pachá 🔴",
  },
  {
    id: "custom",
    label: "✏️ Mensaje Personalizado",
    icon: "✏️",
    subject: "",
    body: "",
  },
];

export default function AdminNotifications() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [subject, setSubject] = useState(TEMPLATES[0].subject);
  const [body, setBody] = useState(TEMPLATES[0].body);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    base44.entities.NewsletterSubscriber.filter({ is_active: true })
      .then(data => {
        setSubscribers(data);
      }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSelectTemplate = (tpl) => {
    setSelectedTemplate(tpl);
    setSubject(tpl.subject);
    setBody(tpl.body);
    setShowTemplates(false);
    setSent(false);
  };

  const handleSend = async () => {
    if (!subject.trim() || !body.trim() || subscribers.length === 0) return;
    setSending(true);
    setSent(false);
    try {
      let count = 0;
      for (const sub of subscribers) {
        await base44.integrations.Core.SendEmail({
          to: sub.email,
          subject: subject,
          body: body.replace(/\n/g, "<br>"),
          from_name: "Pachá Night Club",
        });
        count++;
      }
      setSentCount(count);
      setSent(true);
    } catch {
      /* silent */
    } finally {
      setSending(false);
    }
  };

  const activeCount = subscribers.length;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(255,0,0,0.12)", border: "1px solid rgba(255,0,0,0.3)" }}>
          <Bell size={18} style={{ color: "#FF0000" }} />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
            Notificaciones
          </h2>
          <p className="text-gray-500 text-xs">Enviá alertas por email a todos los suscriptores</p>
        </div>
      </div>

      {/* Stat */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{ background: "#111", border: "1px solid #222" }}>
        <Users size={16} style={{ color: "#C9A84C" }} />
        <span className="text-sm text-gray-300">
          {loading ? "Cargando..." : (
            <><span className="font-bold text-white">{activeCount}</span> suscriptores activos recibirán esta notificación</>
          )}
        </span>
      </div>

      {/* Template Selector */}
      <div>
        <label className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2 block">Tipo de Notificación</label>
        <div className="relative">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm text-white font-medium transition-all"
            style={{ background: "#111", border: "1px solid #333" }}>
            <span>{selectedTemplate.label}</span>
            <ChevronDown size={14} style={{ color: "#666", transform: showTemplates ? "rotate(180deg)" : "none", transition: "0.2s" }} />
          </button>
          {showTemplates && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-10"
              style={{ background: "#111", border: "1px solid #333" }}>
              {TEMPLATES.map(tpl => (
                <button key={tpl.id} onClick={() => handleSelectTemplate(tpl)}
                  className="w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-white/5"
                  style={{ color: selectedTemplate.id === tpl.id ? "#FF0000" : "#aaa", borderBottom: "1px solid #1a1a1a" }}>
                  {tpl.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2 block">Asunto del Email</label>
        <input
          value={subject}
          onChange={e => { setSubject(e.target.value); setSent(false); }}
          placeholder="Ej: ¡La lista está abierta! — Pachá"
          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
          style={{ background: "#111", border: "1px solid #333" }}
        />
      </div>

      {/* Body */}
      <div>
        <label className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2 block">Cuerpo del Mensaje</label>
        <textarea
          value={body}
          onChange={e => { setBody(e.target.value); setSent(false); }}
          rows={7}
          placeholder="Escribí el mensaje aquí..."
          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none resize-none transition-all"
          style={{ background: "#111", border: "1px solid #333" }}
        />
        <p className="text-gray-700 text-xs mt-1">Reemplazá los textos entre [CORCHETES] antes de enviar.</p>
      </div>

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={sending || !subject.trim() || !body.trim() || activeCount === 0}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm tracking-wider uppercase transition-all"
        style={{
          background: sending || !subject.trim() || !body.trim() ? "#1a1a1a" : "linear-gradient(135deg, #FF0000, #ff1a35)",
          color: sending || !subject.trim() || !body.trim() ? "#444" : "#fff",
          cursor: sending ? "not-allowed" : "pointer",
        }}>
        {sending ? (
          <><Loader2 size={16} className="animate-spin" /> Enviando a {activeCount} suscriptores...</>
        ) : (
          <><Send size={16} /> Enviar Notificación ({activeCount})</>
        )}
      </button>

      {/* Success */}
      {sent && (
        <div className="flex items-center gap-3 px-4 py-4 rounded-xl"
          style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
          <CheckCircle2 size={20} style={{ color: "#22c55e" }} />
          <div>
            <p className="text-white font-bold text-sm">¡Notificación enviada!</p>
            <p className="text-gray-400 text-xs mt-0.5">{sentCount} emails enviados exitosamente.</p>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="rounded-xl p-4 space-y-2" style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Casos de Uso</p>
        {[
          { icon: Zap, label: "Promo relámpago", desc: "Descuento o combo solo por las próximas 2 hs" },
          { icon: PartyPopper, label: "Apertura de lista", desc: "Avisá cuando se habilitan entradas anticipadas" },
          { icon: Tag, label: "Evento especial", desc: "DJ invitado, temática o noche temática" },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="flex items-start gap-2.5">
            <Icon size={14} style={{ color: "#FF0000", marginTop: 2 }} />
            <div>
              <span className="text-gray-300 text-xs font-semibold">{label}: </span>
              <span className="text-gray-600 text-xs">{desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}