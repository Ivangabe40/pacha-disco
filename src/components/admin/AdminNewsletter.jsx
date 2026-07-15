import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Mail, Send, Users, Trash2, Loader2, CheckCircle2 } from "lucide-react";

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.NewsletterSubscriber.filter({ is_active: true });
      setSubscribers(data);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await base44.entities.NewsletterSubscriber.update(id, { is_active: false });
    setSubscribers(prev => prev.filter(s => s.id !== id));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!subject || !body || subscribers.length === 0) return;
    setSending(true);
    try {
      await Promise.all(
        subscribers.map(s =>
          base44.integrations.Core.SendEmail({
            from_name: "Pachá Night Club",
            to: s.email,
            subject,
            body: s.name ? `Hola ${s.name}!\n\n${body}\n\n---\nPachá Night Club` : `${body}\n\n---\nPachá Night Club`
          })
        )
      );
      setSent(true);
      setSubject("");
      setBody("");
      setTimeout(() => setSent(false), 4000);
    } catch {
      /* silent */
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl p-5 flex items-center gap-4" style={{ background: "#111", border: "1px solid #222" }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(116,172,223,0.15)" }}>
            <Users size={20} className="text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{subscribers.length}</p>
            <p className="text-xs text-gray-500">Suscriptores activos</p>
          </div>
        </div>
        <div className="rounded-xl p-5 flex items-center gap-4" style={{ background: "#111", border: "1px solid #222" }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(116,172,223,0.15)" }}>
            <Mail size={20} className="text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{subscribers.filter(s => s.email).length}</p>
            <p className="text-xs text-gray-500">Emails registrados</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Redactar y enviar */}
        <div className="rounded-xl p-6" style={{ background: "#111", border: "1px solid #222" }}>
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Send size={16} className="text-red-500" />
            Enviar Email Masivo
          </h3>

          {subscribers.length === 0 && !loading && (
            <p className="text-gray-500 text-sm mb-4">No hay suscriptores activos aún.</p>
          )}

          {sent && (
            <div className="flex items-center gap-2 mb-4 p-3 rounded-lg" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <CheckCircle2 size={16} className="text-green-400" />
              <span className="text-green-400 text-sm">¡Enviado a {subscribers.length} suscriptores!</span>
            </div>
          )}

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Asunto</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="ej: ¡Nuevo evento este sábado!"
                required
                className="w-full px-3 py-2.5 rounded-lg text-sm text-gray-200 placeholder-gray-600 outline-none focus:ring-1 focus:ring-red-500"
                style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Mensaje</label>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Redactá el mensaje para tus suscriptores..."
                required
                rows={6}
                className="w-full px-3 py-2.5 rounded-lg text-sm text-gray-200 placeholder-gray-600 outline-none focus:ring-1 focus:ring-red-500 resize-none"
                style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
              />
            </div>
            <button
              type="submit"
              disabled={sending || subscribers.length === 0}
              className="w-full py-3 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #75AADB, #ff1a35)" }}
            >
              {sending ? (
                <><Loader2 size={16} className="animate-spin" /> Enviando...</>
              ) : (
                <><Send size={16} /> Enviar a {subscribers.length} suscriptores</>
              )}
            </button>
          </form>
        </div>

        {/* Lista de suscriptores */}
        <div className="rounded-xl p-6" style={{ background: "#111", border: "1px solid #222" }}>
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Users size={16} className="text-red-500" />
            Lista de Suscriptores
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={24} className="animate-spin text-red-500" />
            </div>
          ) : subscribers.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-10">Sin suscriptores aún</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {subscribers.map(s => (
                <div
                  key={s.id}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                  style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
                >
                  <div className="min-w-0">
                    {s.name && <p className="text-xs font-medium text-gray-300 truncate">{s.name}</p>}
                    <p className="text-xs text-gray-500 truncate">{s.email}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="ml-2 p-1.5 rounded hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-colors shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}