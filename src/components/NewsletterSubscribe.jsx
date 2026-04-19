import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    // Verificar si ya está suscrito
    const existing = await base44.entities.NewsletterSubscriber.filter({ email });
    if (existing.length > 0) {
      setStatus("success");
      return;
    }

    await base44.entities.NewsletterSubscriber.create({
      email,
      name: name || undefined,
      is_active: true
    });
    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 py-3">
        <CheckCircle2 size={20} className="text-green-400 shrink-0" />
        <p className="text-sm text-green-400 font-medium">¡Suscripción confirmada! Te avisaremos de los próximos eventos.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Mail size={14} className="text-red-500" />
        <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">Recibí novedades</span>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Tu nombre (opcional)"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-lg text-gray-200 placeholder-gray-600 outline-none focus:ring-1 focus:ring-red-500"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        />
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="flex-1 min-w-0 px-3 py-2 text-xs rounded-lg text-gray-200 placeholder-gray-600 outline-none focus:ring-1 focus:ring-red-500"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-4 py-2 rounded-lg text-xs font-bold text-white shrink-0 transition-all"
            style={{ background: "linear-gradient(135deg, #E8001D, #ff1a35)" }}
          >
            {status === "loading" ? <Loader2 size={13} className="animate-spin" /> : "Suscribir"}
          </button>
        </div>
      </form>
    </div>
  );
}