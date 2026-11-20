import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Instagram, MessageCircle, Mail, MapPin, Loader2 } from "lucide-react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      await base44.functions.invoke("sendContactMessage", {
        name: form.name,
        email: form.email,
        message: form.message,
      });
      setSent(true);
    } catch {
      setError("Ocurrió un error al enviar. Intentá nuevamente.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen py-12 md:py-20 px-4" style={{ background: "#070707", color: "#F0EBE3" }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "#FF0000" }}>
          Contacto
        </h1>
        <p className="text-gray-400 mb-10 text-lg">
          ¿Tenés consultas o querés contactarnos? Escribinos.
        </p>

        <div className="flex flex-col gap-4 mb-10">
          <a href="mailto:contacto@pachadisco.com.ar" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
            <Mail size={18} className="text-red-500" /> contacto@pachadisco.com.ar
          </a>
          <a href="https://wa.me/5493468546935" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
            <MessageCircle size={18} className="text-green-500" /> WhatsApp: +54 9 3468 546935
          </a>
          <a href="https://www.instagram.com/pachaoficialok" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
            <Instagram size={18} className="text-pink-500" /> @pachaoficialok
          </a>
          <a href="https://maps.app.goo.gl/outiaSZFTh14BhGK8" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
            <MapPin size={18} className="text-yellow-500" /> Ver ubicación en Google Maps
          </a>
        </div>

        <div className="rounded-xl p-8" style={{ background: "#0f0f0f", border: "1px solid #1e1e1e" }}>
          {sent ? (
            <div className="text-center py-8">
              <p className="text-2xl font-bold text-green-400 mb-2">¡Mensaje enviado!</p>
              <p className="text-gray-400">Nos pondremos en contacto a la brevedad.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                required
                placeholder="Tu nombre"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="rounded-lg px-4 py-3 text-sm outline-none"
                style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#F0EBE3" }}
              />
              <input
                required
                type="email"
                placeholder="Tu email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="rounded-lg px-4 py-3 text-sm outline-none"
                style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#F0EBE3" }}
              />
              <textarea
                required
                placeholder="Tu mensaje"
                rows={5}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="rounded-lg px-4 py-3 text-sm outline-none resize-none"
                style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#F0EBE3" }}
              />
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <button type="submit" disabled={sending} className="btn-red py-3 rounded-lg text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2"
                style={{ opacity: sending ? 0.7 : 1 }}>
                {sending ? <><Loader2 size={15} className="animate-spin" /> Enviando...</> : "Enviar mensaje"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}