import { Instagram } from "lucide-react";

export default function InstagramFollow() {
  return (
    <section className="px-4 md:px-8 py-6 md:py-10" style={{ background: "#070707" }}>
      <a
        href="https://www.instagram.com/pachaoficialok"
        target="_blank"
        rel="noopener noreferrer"
        className="block max-w-3xl mx-auto text-center rounded-2xl px-6 py-7 md:py-9 transition-transform hover:scale-[1.02]"
        style={{
          background: "linear-gradient(135deg, #FF0000 0%, #8B0000 55%, #1a0000 100%)",
          border: "2px solid rgba(255,255,255,0.15)",
          boxShadow: "0 0 50px rgba(255,0,0,0.4)"
        }}>
        <div className="flex items-center justify-center gap-3 mb-2">
          <Instagram size={30} className="text-white" />
          <span className="text-white font-condensed font-black text-3xl md:text-5xl tracking-wide"
            style={{ textShadow: "0 0 20px rgba(255,255,255,0.5)" }}>
            ¡SEGUINOS!
          </span>
        </div>
        <p className="text-white/90 font-condensed text-sm md:text-base tracking-[0.25em] uppercase">
          @pachaoficialok
        </p>
        <p className="text-white/70 text-xs mt-2 tracking-wide">
          Enterate primero de los eventos, sorteos y toda la noche
        </p>
      </a>
    </section>
  );
}