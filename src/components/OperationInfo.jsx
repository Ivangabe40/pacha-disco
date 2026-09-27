import { Calendar, Clock, Ticket, ShieldCheck, CreditCard, MessageCircle } from "lucide-react";

// Información PERMANENTE de operación de Pacha Disco.
// Fuente de verdad única; Pachi Bot consulta lo mismo vía SiteConfig.
export const WHATSAPP_URL = "https://wa.me/5493468546935";

const items = [
  { icon: Calendar, title: "Sábados", sub: "De 01:30 a 06:30 hs" },
  { icon: Ticket, title: "Entrada general $8.000", sub: "Venta únicamente en puerta" },
  { icon: ShieldCheck, title: "Mayores de 25 años", sub: "Mismo precio mujeres y hombres" },
  { icon: CreditCard, title: "Efectivo y transferencia", sub: "Corral de Bustos, Córdoba" },
];

export default function OperationInfo() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="rounded-2xl p-5 md:p-8"
        style={{ background: "#0f0f0f", border: "1px solid rgba(255,0,0,0.25)" }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-5 md:mb-7">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full" style={{ background: "linear-gradient(#FF0000, #CC0000)" }} />
            <div>
              <p className="text-xs tracking-widest uppercase font-condensed" style={{ color: "#FF0000" }}>
                Operación actual
              </p>
              <p className="text-white text-sm md:text-base font-semibold"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                Pacha Disco · Corral de Bustos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <Clock size={12} />
            <span className="text-xs tracking-wider uppercase font-condensed">23 años de historia</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {items.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="rounded-xl p-3 md:p-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <Icon size={16} style={{ color: "#C9A84C" }} className="mb-2" />
              <p className="text-white text-xs md:text-sm font-semibold leading-tight">{title}</p>
              <p className="text-gray-500 text-xs mt-1 font-condensed tracking-wide">{sub}</p>
            </div>
          ))}
        </div>

        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
          className="mt-5 md:mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black tracking-widest uppercase transition-all"
          style={{ background: "linear-gradient(135deg, #FF0000, #FF6666)", color: "#fff" }}>
          <MessageCircle size={14} />
          Consultas por WhatsApp
        </a>
      </div>
    </section>
  );
}