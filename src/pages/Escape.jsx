import { MessageCircle, MapPin, CalendarCheck } from "lucide-react";
import { trackConversion } from "@/lib/adsConversion";

const FLYER = "https://base44.app/api/apps/69ad4033370fdc9f9fe8b117/files/mp/public/69ad4033370fdc9f9fe8b117/2f1d73910_escape-experience.jpg";
const WHATSAPP = "https://wa.me/5493468546935?text=Hola!%20Quiero%20consultar%20por%20Escape%20Experience";

const CELEBRACIONES = [
  "🎂 Cumpleaños",
  "🎓 Graduaciones",
  "🥂 Aniversarios",
  "🏢 Eventos empresariales",
  "🎉 Fiestas privadas y celebraciones especiales",
];

const PILARES = [
  "Un lugar exclusivo",
  "Propuestas personalizadas",
  "Todo lo necesario para tu ocasión",
];

export default function Escape() {
  return (
    <div style={{ background: "#070707" }}>
      {/* HERO */}
      <section
        className="relative px-4 pt-10 pb-14 md:pt-16 md:pb-20"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(201,168,76,0.14), transparent 60%), linear-gradient(180deg, #070707 0%, #0b0906 100%)" }}
      >
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-[10px] md:text-xs tracking-[0.3em] uppercase font-condensed mb-6 md:mb-10" style={{ color: "#C9A84C" }}>
            Hay momentos que merecen un lugar especial
          </p>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* FLYER */}
            <div className="mx-auto w-full max-w-[280px] md:max-w-sm">
              <div
                className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden"
                style={{
                  border: "1px solid rgba(201,168,76,0.45)",
                  boxShadow: "0 0 60px rgba(201,168,76,0.14), 0 0 120px rgba(255,69,0,0.08)",
                }}
              >
                <img src={FLYER} alt="Escape Experience by Pachá" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>

            {/* TEXTO */}
            <div className="text-center md:text-left">
              <h1
                className="text-4xl md:text-6xl font-black uppercase leading-none mb-2"
                style={{ fontFamily: "'Playfair Display', serif", color: "#E8C97A", textShadow: "0 0 40px rgba(201,168,76,0.35)" }}
              >
                Escape Experience
              </h1>
              <p className="text-[11px] md:text-sm tracking-[0.35em] uppercase font-condensed mb-6" style={{ color: "#B79A55" }}>
                By Pachá
              </p>

              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
                Llega <span style={{ color: "#E8C97A" }}>ESCAPE EXPERIENCE · BY PACHA</span>. Un nuevo espacio para crear
                celebraciones únicas, compartir momentos inolvidables y disfrutar cada encuentro a tu manera.
              </p>

              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{ border: "1px solid rgba(201,168,76,0.4)", background: "rgba(201,168,76,0.06)" }}
              >
                <CalendarCheck size={14} style={{ color: "#C9A84C" }} />
                <span className="text-[11px] md:text-xs tracking-widest uppercase font-condensed" style={{ color: "#E8C97A" }}>
                  Consultá disponibilidad de fechas
                </span>
              </div>

              <div>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackConversion("contacto")}
                  className="flex sm:inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-4 rounded-full text-xs md:text-sm font-black tracking-widest uppercase transition-transform hover:-translate-y-0.5"
                  style={{ border: "2px solid #D4AF37", color: "#F5E7C0", background: "rgba(0,0,0,0.6)" }}
                >
                  <MessageCircle size={16} style={{ color: "#D4AF37" }} />
                  Presupuestos por WhatsApp · 3468 546935
                </a>
              </div>

              <p className="flex items-center justify-center md:justify-start gap-1.5 text-gray-500 text-[11px] md:text-xs mt-5 tracking-wider">
                <MapPin size={12} style={{ color: "#C9A84C" }} />
                Italia 378 · Corral de Bustos, Córdoba
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QUÉ PODÉS CELEBRAR */}
      <section className="px-4 py-12 md:py-16" style={{ borderTop: "1px solid rgba(201,168,76,0.15)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase font-condensed mb-2" style={{ color: "#C9A84C" }}>
              Ocasiones
            </p>
            <h2 className="text-2xl md:text-4xl font-black uppercase text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              ¿Qué podés celebrar?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CELEBRACIONES.map((c) => (
              <div
                key={c}
                className="px-4 py-4 rounded-xl text-sm md:text-[15px] text-gray-200 leading-snug"
                style={{ background: "#0d0b08", border: "1px solid rgba(201,168,76,0.18)" }}
              >
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LA EXPERIENCIA */}
      <section className="px-4 pb-16 md:pb-20">
        <div
          className="max-w-3xl mx-auto rounded-2xl px-5 py-10 md:px-10 md:py-12 text-center"
          style={{ background: "linear-gradient(180deg, #0d0b08, #070707)", border: "1px solid rgba(201,168,76,0.25)" }}
        >
          <h2 className="text-2xl md:text-4xl font-black uppercase mb-5" style={{ fontFamily: "'Playfair Display', serif", color: "#E8C97A" }}>
            La experiencia
          </h2>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
            Un lugar exclusivo, propuestas personalizadas y todo lo necesario para hacer de cada ocasión una
            experiencia diferente.
          </p>

          <ul className="grid gap-2 text-left mb-8">
            {PILARES.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-gray-300 text-sm md:text-[15px]">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#C9A84C" }} />
                {p}
              </li>
            ))}
          </ul>

          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackConversion("contacto")}
            className="flex sm:inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-4 rounded-full text-xs md:text-sm font-black tracking-widest uppercase transition-transform hover:-translate-y-0.5"
            style={{ border: "2px solid #D4AF37", color: "#F5E7C0", background: "rgba(0,0,0,0.6)" }}
          >
            <MessageCircle size={16} style={{ color: "#D4AF37" }} />
            Consultar por mi celebración
          </a>

          <p className="text-gray-600 text-[10px] md:text-xs tracking-[0.25em] uppercase mt-8 font-condensed">
            Escape Experience · By Pachá
          </p>
          <p className="text-gray-500 text-xs md:text-sm italic mt-1">
            Tu celebración. Tu momento. Tu experiencia.
          </p>
        </div>
      </section>
    </div>
  );
}