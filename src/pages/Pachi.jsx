import { Link } from "react-router-dom";
import { ChevronLeft, Send, RotateCcw } from "lucide-react";
import PachiMessageBubble from "@/components/pachi/PachiMessageBubble";
import usePachiChat, { PACHI_GREETING, PACHI_SUGGESTIONS } from "@/hooks/usePachiChat";

const LOGO_RED = "https://media.base44.com/images/public/69ad4033370fdc9f9fe8b117/54165d896_file_0000000090c081f4a8b9ff606c8a8ed8.png";

export default function Pachi() {
  const { conversation, messages, input, setInput, busy, failed, sendMessage, retry, scrollRef, inputRef } =
    usePachiChat(true);

  const showMessages = messages.length > 0 ? messages : [{ role: "assistant", content: PACHI_GREETING }];
  const showSuggestions = messages.length === 0;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh]" style={{ background: "#070707", color: "#F0EBE3" }}>
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
          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.7)" }} />
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-3.5 py-4 flex flex-col gap-3">
        {showMessages.map((m, i) => <PachiMessageBubble key={i} message={m} />)}

        {busy && !failed && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-md"
              style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)" }}>
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        )}

        {failed && (
          <div className="flex flex-col items-start gap-2">
            <p className="text-xs text-red-400 px-3.5 py-2.5 rounded-2xl"
              style={{ background: "rgba(255,0,0,0.08)", border: "1px solid rgba(255,0,0,0.25)" }}>
              {failed === "start" ? "No se pudo conectar con Pachi." : "No se pudo enviar el mensaje."}
            </p>
            <button
              onClick={retry}
              className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-gray-300 hover:text-white transition-colors">
              <RotateCcw size={13} /> Reintentar
            </button>
          </div>
        )}
      </div>

      {showSuggestions && !failed && (
        <div className="flex flex-wrap gap-2 px-3.5 pb-2 shrink-0">
          {PACHI_SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => sendMessage(s)} disabled={busy || !conversation}
              className="text-xs text-gray-300 px-3 py-1.5 rounded-full transition-colors disabled:opacity-40 hover:text-white"
              style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)" }}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 px-3 py-3 shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribí tu consulta…"
          disabled={busy || !conversation}
          className="flex-1 px-4 py-3 rounded-full text-base text-white placeholder-gray-500 outline-none disabled:opacity-50"
          style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.1)" }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={busy || !input.trim() || !conversation}
          aria-label="Enviar"
          className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full transition-all active:scale-90 disabled:opacity-40"
          style={{ background: "linear-gradient(135deg, #FF0000, #CC0000)" }}>
          <Send size={17} className="text-white" />
        </button>
      </div>
    </div>
  );
}