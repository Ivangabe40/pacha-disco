import { Instagram, MessageCircle, Globe } from "lucide-react";

const FLYER_URL = "https://media.base44.com/images/public/69ad4033370fdc9f9fe8b117/794866eb3_file_000000003018720eb0c7273b79476914.png";

const features = [
  { icon: "🍹", label: "Carta de Tragos" },
  { icon: "🍷", label: "Vinos" },
  { icon: "🍺", label: "Cervezas" },
  { icon: "🎵", label: "Música" },
];

export default function EscapeBarSection() {
  return (
    <section className="relative overflow-hidden py-20 px-4" style={{ background: "#050303" }}>
      {/* Background image blurred */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${FLYER_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          filter: "blur(40px) saturate(1.5)",
        }}
      />

      {/* Gold top border */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #C9A84C 30%, #E8C97A 50%, #C9A84C 70%, transparent)" }} />

      <div className="relative max-w-5xl mx-auto">
        {/* Eyebrow */}
        <p className="text-center text-xs uppercase tracking-[0.4em] mb-3"
          style={{ color: "#C9A84C", fontFamily: "'Inter', sans-serif" }}>
          Una nueva experiencia
        </p>

        {/* Main logo text */}
        <div className="text-center mb-2">
          <h2
            className="text-5xl md:text-7xl font-black uppercase leading-none"
            style={{
              fontFamily: "'Playfair Display', serif",
              background: "linear-gradient(135deg, #C9A84C 0%, #F5E6A3 40%, #E8C97A 60%, #9A6F20 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "none",
              filter: "drop-shadow(0 0 30px rgba(201,168,76,0.4))",
            }}>
            Escape Bar
          </h2>
          <p className="text-lg md:text-xl tracking-[0.35em] uppercase mt-1"
            style={{ color: "#E8C97A", fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
            by Pachá
          </p>
        </div>

        {/* Script "lanzamiento" */}
        <p className="text-center text-4xl md:text-5xl my-4"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 400,
            color: "#fff",
            textShadow: "0 2px 20px rgba(255,255,255,0.15)",
          }}>
          lanzamiento
        </p>

        {/* Date box */}
        <div className="max-w-xs mx-auto my-8 text-center px-8 py-6 relative"
          style={{ border: "1px solid rgba(201,168,76,0.4)", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)" }}>
          {/* Corner accents */}
          <span className="absolute top-0 left-0 w-3 h-3 border-t border-l" style={{ borderColor: "#C9A84C" }} />
          <span className="absolute top-0 right-0 w-3 h-3 border-t border-r" style={{ borderColor: "#C9A84C" }} />
          <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l" style={{ borderColor: "#C9A84C" }} />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style={{ borderColor: "#C9A84C" }} />

          <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{ color: "#C9A84C" }}>Próximo Viernes</p>

          {/* Gold divider */}
          <div className="flex items-center gap-2 justify-center mb-2">
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, #C9A84C)" }} />
            <span className="text-4xl font-black" style={{ color: "#E8C97A", fontFamily: "'Playfair Display', serif" }}>
              19/06
            </span>
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, #C9A84C, transparent)" }} />
          </div>

          <p className="text-xs uppercase tracking-[0.25em] font-bold mb-1" style={{ color: "#fff" }}>
            Primera ronda de tragos 2x1
          </p>
          <p className="text-sm font-black uppercase tracking-widest mb-3" style={{ color: "#E8001D" }}>
            Toda la noche.
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "#aaa" }}>
            Te esperamos a partir de las 23:00<br />para brindar y pasarla increíble.
          </p>
        </div>

        {/* Features row */}
        <div className="flex justify-center gap-6 md:gap-12 my-8">
          {features.map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{icon}</span>
              <div className="h-px w-px my-0.5" />
              <p className="text-xs uppercase tracking-widest text-center leading-tight"
                style={{ color: "#C9A84C", maxWidth: "60px" }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8 max-w-lg mx-auto">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3))" }} />
          <span className="text-yellow-700 text-lg">✦</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(201,168,76,0.3), transparent)" }} />
        </div>

        {/* Tagline */}
        <p className="text-center text-2xl md:text-3xl font-black uppercase tracking-widest"
          style={{ color: "#E8C97A", fontFamily: "'Playfair Display', serif",
            textShadow: "0 0 30px rgba(201,168,76,0.3)" }}>
          Nuevo Espacio / Bar Lounge
        </p>

        {/* Contact row */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
          <a href="https://www.instagram.com/pachaoficialok" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: "#aaa" }}>
            <Instagram size={16} style={{ color: "#C9A84C" }} />
            @pachaoficialok
          </a>
          <div className="h-4 w-px" style={{ background: "#333" }} />
          <a href="https://wa.me/5493468546935" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: "#aaa" }}>
            <MessageCircle size={16} style={{ color: "#C9A84C" }} />
            3468-546935
          </a>
          <div className="h-4 w-px" style={{ background: "#333" }} />
          <a href="http://www.pachadisco.com.ar" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: "#aaa" }}>
            <Globe size={16} style={{ color: "#C9A84C" }} />
            www.pachadisco.com.ar
          </a>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <a href="https://wa.me/5493468546935?text=Hola!%20Me%20interesa%20el%20lanzamiento%20de%20Escape%20Bar"
            target="_blank" rel="noopener noreferrer">
            <button className="px-10 py-4 rounded-lg text-sm font-black tracking-widest uppercase transition-all hover:-translate-y-1"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #E8C97A, #C9A84C)",
                color: "#050303",
                boxShadow: "0 4px 30px rgba(201,168,76,0.4)",
              }}>
              ¡Quiero ir al lanzamiento!
            </button>
          </a>
        </div>
      </div>

      {/* Gold bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #C9A84C 30%, #E8C97A 50%, #C9A84C 70%, transparent)" }} />
    </section>
  );
}