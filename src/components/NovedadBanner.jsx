import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Sparkles, X } from "lucide-react";

export default function NovedadBanner() {
  const [novedad, setNovedad] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    base44.entities.NovedadBanner.filter({ is_active: true }, "-created_date", 1).then(data => {
      if (data.length > 0) setNovedad(data[0]);
    });
  }, []);

  if (!novedad || dismissed) return null;

  const Wrapper = novedad.link ? "a" : "div";
  const wrapperProps = novedad.link
    ? { href: novedad.link, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <section className="relative">
      {/* Dismiss button */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDismissed(true); }}
        className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-110"
        style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.15)" }}
      >
        <X size={14} className="text-white" />
      </button>

      <Wrapper {...wrapperProps} className="block relative overflow-hidden cursor-pointer group">
        {/* Label */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(232,0,29,0.9)", backdropFilter: "blur(8px)" }}>
          <Sparkles size={12} className="text-white" />
          <span className="text-white text-xs font-bold tracking-widest uppercase">Novedad</span>
        </div>

        {/* Image */}
        <img
          src={novedad.image_url}
          alt={novedad.title}
          className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          style={{ maxHeight: "400px" }}
        />

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6"
          style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.85))" }}>
          <h3 className="text-white text-lg md:text-2xl font-black uppercase"
            style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
            {novedad.title}
          </h3>
          {novedad.description && (
            <p className="text-gray-300 text-sm md:text-base mt-2 leading-relaxed line-clamp-2">{novedad.description}</p>
          )}
        </div>
      </Wrapper>
    </section>
  );
}