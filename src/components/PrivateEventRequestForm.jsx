import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, CheckCircle2, Send } from "lucide-react";

const EVENT_TYPES = [
  "Cumpleaños",
  "Graduación",
  "Aniversario",
  "Evento empresarial",
  "Fiesta privada",
  "Otro",
];

const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(201,168,76,0.25)",
  color: "#F0EBE3",
};

export default function PrivateEventRequestForm() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", event_type: "", date: "", guests: "", message: "", company: "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await base44.functions.invoke("createPrivateEventRequest", {
        ...form,
        guests: form.guests === "" ? undefined : Number(form.guests),
      });
      if (res.data?.ok) {
        setStatus("success");
        return;
      }
      setError(res.data?.error || "No pudimos enviar la solicitud.");
      setStatus("error");
    } catch {
      setError("No pudimos enviar la solicitud. Probá de nuevo o escribinos por WhatsApp.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl p-5 md:p-6 text-left"
        style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.35)" }}>
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 size={18} style={{ color: "#C9A84C" }} />
          <p className="text-white font-semibold text-sm">Recibimos tu solicitud</p>
        </div>
        <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
          El equipo de Pachá se va a contactar con vos para conversar los detalles.
          Esto no es una reserva confirmada: la disponibilidad se confirma en esa conversación.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl p-4 md:p-6 text-left space-y-3"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.28)" }}>
      <p className="text-[11px] md:text-xs tracking-[0.25em] uppercase font-condensed" style={{ color: "#E8C97A" }}>
        Consultá tu fecha
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        <input required value={form.name} onChange={set("name")} placeholder="Nombre y apellido"
          maxLength={80} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
        <input required type="email" value={form.email} onChange={set("email")} placeholder="Email"
          maxLength={120} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
        <input value={form.phone} onChange={set("phone")} placeholder="Teléfono (opcional)"
          maxLength={30} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
        <select value={form.event_type} onChange={set("event_type")}
          className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle}>
          <option value="">Tipo de evento</option>
          {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input type="date" value={form.date} onChange={set("date")}
          className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
        <input type="number" min="1" max="2000" value={form.guests} onChange={set("guests")}
          placeholder="Invitados estimados" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
      </div>

      <textarea value={form.message} onChange={set("message")} rows={3} maxLength={2000}
        placeholder="Contanos qué tenés en mente"
        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none" style={inputStyle} />

      {/* Honeypot antispam: oculto para personas */}
      <input tabIndex={-1} autoComplete="off" value={form.company} onChange={set("company")}
        name="company" aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />

      {error && <p className="text-xs" style={{ color: "#FF6B6B" }}>{error}</p>}

      <button type="submit" disabled={status === "loading"}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-black tracking-widest uppercase transition-transform hover:-translate-y-0.5"
        style={{ background: "linear-gradient(135deg, #D4AF37, #B08D2E)", color: "#0A0A0A" }}>
        {status === "loading" ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        Enviar solicitud
      </button>

      <p className="text-gray-600 text-[11px] leading-relaxed">
        Enviar la solicitud no confirma la fecha ni el presupuesto.
      </p>
    </form>
  );
}