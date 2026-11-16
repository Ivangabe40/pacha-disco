import { Link } from "react-router-dom";
import { ChevronLeft, Wrench } from "lucide-react";

const LOGO_RED = "https://media.base44.com/images/public/69ad4033370fdc9f9fe8b117/54165d896_file_0000000090c081f4a8b9ff606c8a8ed8.png";

export default function Pachi() {
  return (
    <div className="flex flex-col" style={{ background: "#070707", color: "#F0EBE3", minHeight: "100dvh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');
      `}</style>

      <header
        className="shrink-0"
        style={{
          background: "rgba(7,7,7,0.98)",
          borderBottom: "1px solid rgba(255,0,0,0.25)",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, transparent, #FF0000 30%, #FF0000 70%, transparent)" }} />
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors shrink-0"
            aria-label="Volver al sitio"
          >
            <ChevronLeft size={22} />
          </Link>
          <img
            src={LOGO_RED}
            alt="Pachá"
            className="w-9 h-9 rounded-full object-cover shrink-0"
            style={{ filter: "drop-shadow(0 0 8px rgba(255,0,0,0.5))" }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-white text-base font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Pachi Bot
            </p>
            <p className="text-gray-500 text-[11px] tracking-widest uppercase" style={{ fontFamily: "'Oswald', sans-serif" }}>
              Asistente de Pachá Disco
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-5">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,0,0,0.08)", border: "1px solid rgba(255,0,0,0.3)" }}
        >
          <Wrench size={26} style={{ color: "#FF0000" }} />
        </div>

        <h1
          className="text-3xl font-bold leading-tight"
          style={{ fontFamily: "'Playfair Display', serif", color: "#fff" }}
        >
          Nos vemos pronto
        </h1>

        <p
          className="text-gray-400 text-sm tracking-[0.2em] uppercase"
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          Estamos en reparaciones
        </p>

        <Link
          to="/"
          className="mt-4 px-6 py-3 rounded-full text-xs font-bold tracking-[0.2em] uppercase text-white transition-transform active:scale-95"
          style={{ background: "linear-gradient(135deg, #FF0000, #CC0000)", fontFamily: "'Oswald', sans-serif" }}
        >
          Volver al inicio
        </Link>
      </main>
    </div>
  );
}