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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badge flotante */}
        <div className="absolute top-3 right-3 md:top-4 md:right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", border: "1px solid rgba(201,168,76,0.4)" }}>
          <Gamepad2 size={13} style={{ color: "#C9A84C" }} />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#C9A84C" }}>Jugar</span>
          <ExternalLink size={11} style={{ color: "#888" }} />
        </div>
      </div>
    </a>
  );
}