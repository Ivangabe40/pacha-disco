import { useState, useEffect, useRef } from "react";
import { X, Volume2, VolumeX } from "lucide-react";

const STORAGE_KEY = "pacha_intro_visto";
const VIDEO_URL = "https://base44.app/api/apps/69ad4033370fdc9f9fe8b117/files/mp/public/69ad4033370fdc9f9fe8b117/7f61d1a69_pacha_intro.mp4";

function yaVisto() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function marcarVisto() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // sin almacenamiento disponible: se muestra igual en cada carga
  }
}

export default function IntroVideoOverlay() {
  const [visible, setVisible] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    if (yaVisto()) return;
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  const cerrar = () => {
    marcarVisto();
    setVisible(false);
  };

  const alternarSonido = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !muted;
    video.muted = next;
    if (!next) video.play().catch(() => {});
    setMuted(next);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "#000" }}>
      <video
        ref={videoRef}
        src={VIDEO_URL}
        autoPlay
        muted={muted}
        playsInline
        preload="auto"
        onEnded={cerrar}
        className="w-full h-full"
        style={{ objectFit: "contain" }}
      />

      <button
        onClick={cerrar}
        aria-label="Saltar video"
        className="absolute top-4 right-4 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase text-white"
        style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(8px)", top: "calc(1rem + env(safe-area-inset-top, 0px))" }}
      >
        Saltar
        <X size={14} />
      </button>

      <button
        onClick={alternarSonido}
        aria-label={muted ? "Activar sonido" : "Silenciar"}
        className="absolute flex items-center justify-center w-11 h-11 rounded-full text-white"
        style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))", left: "50%", transform: "translateX(-50%)", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)" }}
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </div>
  );
}