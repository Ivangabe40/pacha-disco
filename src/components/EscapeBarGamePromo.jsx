import { useState, useEffect } from "react";
import { Gamepad2, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";

const DEFAULTS = {
  game_title: "Juego Oficial de ESCAPE BAR",
  game_subtitle: "Versión Demo",
  game_image_url: "https://media.base44.com/images/public/69ad4033370fdc9f9fe8b117/1d508d84f_1783909062220.png",
  game_link: "https://escapegame.base44.app/",
};

export default function EscapeBarGamePromo() {
  const [config, setConfig] = useState(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    base44.entities.SiteConfig.list().then(data => {
      const map = {};
      data.forEach(item => { map[item.key] = item.value; });
      setConfig({
        game_title: map.game_title || DEFAULTS.game_title,
        game_subtitle: map.game_subtitle || DEFAULTS.game_subtitle,
        game_image_url: map.game_image_url || DEFAULTS.game_image_url,
        game_link: map.game_link || DEFAULTS.game_link,
      });
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  return (
    <a
      href={config.game_link}
      target="_blank"
      rel="noopener noreferrer"
      className="block group relative rounded-2xl overflow-hidden mb-10 md:mb-12"
      style={{ border: "2px solid rgba(201,168,76,0.4)", boxShadow: "0 0 40px rgba(201,168,76,0.15)" }}
    >
      <div className="relative">
        <img
          src={config.game_image_url}
          alt={config.game_title}
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
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ color: "#C9A84C" }}>{config.game_subtitle}</span>
          </div>
          <h3 className="text-lg md:text-xl font-black text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {config.game_title}
          </h3>
        </div>
      </div>
    </a>
  );
}