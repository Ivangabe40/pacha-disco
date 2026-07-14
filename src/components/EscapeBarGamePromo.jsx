import { Gamepad2, ExternalLink } from "lucide-react";

const GAME_IMAGE = "https://media.base44.com/images/public/69ad4033370fdc9f9fe8b117/1d508d84f_1783909062220.png";
const GAME_URL = "https://escapegame.base44.app/";

export default function EscapeBarGamePromo() {
  return (
    <a
      href={GAME_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block group relative rounded-2xl overflow-hidden mb-10 md:mb-12"
      style={{ border: "2px solid rgba(201,168,76,0.4)", boxShadow: "0 0 40px rgba(201,168,76,0.15)" }}
    >
      {/* Imagen del juego */}
      <div className="relative">
        <img
          src={GAME_IMAGE}
          alt="Escape Bar - El Juego Oficial"
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Badge flotante */}
        <div className="absolute top-3 right-3 md:top-4 md:right-4 flex items-center gap-1 px-2.5 py-1 rounded-full"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", border: "1px solid rgba(201,168,76,0.4)" }}>
          <Gamepad2 size={10} style={{ color: "#C9A84C" }} />
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#C9A84C" }}>Jugar</span>
          <ExternalLink size={9} style={{ color: "#888" }} />
        </div>

        {/* Título sobre la imagen */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
          <div className="flex items-center gap-2 mb-1">
            <Gamepad2 size={11} style={{ color: "#C9A84C" }} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ color: "#C9A84C" }}>Versión Demo</span>
          </div>
          <h3 className="text-lg md:text-xl font-black text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Juego Oficial de ESCAPE BAR
          </h3>
        </div>
      </div>
    </a>
  );
}