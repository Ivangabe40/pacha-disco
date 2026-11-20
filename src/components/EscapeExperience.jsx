import { MessageCircle, MapPin, CalendarCheck } from "lucide-react";
import PrivateEventRequestForm from "@/components/PrivateEventRequestForm";
import { trackConversion } from "@/lib/adsConversion";

const FLYER = "https://base44.app/api/apps/69ad4033370fdc9f9fe8b117/files/mp/public/69ad4033370fdc9f9fe8b117/2f1d73910_escape-experience.jpg";
const WHATSAPP = "https://wa.me/5493468546935?text=Hola!%20Quiero%20consultar%20por%20Escape%20Experience";

const CELEBRACIONES = [
  "🎂 Cumpleaños",
  "🎓 Graduaciones",
  "🥂 Aniversarios",
  "🏢 Eventos empresariales",
  "🎉 Fiestas privadas y celebraciones especiales.",
];

export default function EscapeExperience() {
  return (
    <section className="px-4 py-12 md:py-20" style={{ background: "linear-gradient(180deg, #070707 0%, #0b0906 50%, #070707 100%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase font-condensed" style={{ color: "#C9A84C" }}>
            Hay momentos que merecen un lugar especial
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* FLYER */}
          <div className="mx-auto w-full md:max-w-sm">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(201,168,76,0.45)",
                boxShadow: "0 0 60px rgba(201,168,76,0.12), 0 0 120px rgba(255,69,0,0.08)",
              }}>
              <img src={FLYER} alt="Escape Experience by Pachá" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            </div>
          </div>

          {/* TEXTO */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-black uppercase leading-none mb-2 gold-text"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Escape Experience
            </h2>
            <p className="text-[11px] md:text-sm tracking-[0.35em] uppercase font-condensed mb-6" style={{ color: "#B79A55" }}>
              By Pachá
            </p>

            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4">
              Llega <span style={{ color: "#E8C97A" }}>ESCAPE EXPERIENCE · BY PACHA</span>. Un nuevo espacio para crear
              celebraciones únicas, compartir momentos inolvidables y disfrutar cada encuentro a tu manera.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-6 text-left">
              {CELEBRACIONES.map((c) => (
                <li key={c} className="text-gray-300 text-sm md:text-[15px] leading-snug">{c}</li>
              ))}
            </ul>

            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
              Un lugar exclusivo, propuestas personalizadas y todo lo necesario para hacer de cada ocasión una
              experiencia diferente.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ border: "1px solid rgba(201,168,76,0.4)", background: "rgba(201,168,76,0.06)" }}>
              <CalendarCheck size={14} style={{ color: "#C9A84C" }} />
              <span className="text-[11px] md:text-xs tracking-widest uppercase font-condensed" style={{ color: "#E8C97A" }}>
                Consultá disponibilidad de fechas
              </span>
            </div>

            <div className="mb-6">
              <PrivateEventRequestForm />
            </div>

            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              onClick={() => trackConversion("contacto")}
              className="flex sm:inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-4 rounded-full text-xs md:text-sm font-black tracking-widest uppercase transition-transform hover:-translate-y-0.5"
              style={{ border: "2px solid #D4AF37", color: "#F5E7C0", background: "rgba(0,0,0,0.6)" }}>
              <MessageCircle size={16} style={{ color: "#D4AF37" }} />
              Presupuestos por WhatsApp · 3468 546935
            </a>

            <p className="flex items-center justify-center md:justify-start gap-1.5 text-gray-500 text-[11px] md:text-xs mt-5 tracking-wider">
              <MapPin size={12} style={{ color: "#C9A84C" }} />
              Italia 378 · Corral de Bustos, Córdoba
            </p>

            <p className="text-gray-600 text-[10px] md:text-xs tracking-[0.25em] uppercase mt-6 font-condensed">
              Escape Experience · By Pachá
            </p>
            <p className="text-gray-500 text-xs md:text-sm italic mt-1">
              Tu celebración. Tu momento. Tu experiencia.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}