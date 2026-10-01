import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { X, Send, Bot, RotateCcw } from "lucide-react";
import PachiMessageBubble from "./PachiMessageBubble";

const AGENT_NAME = "pacha_assistant";
const GREETING = "Hola, soy Pachi. ¿Qué querés saber de Pacha?";
const SUGGESTIONS = ["¿Cuánto sale la entrada?", "¿Qué hay este sábado?", "¿Dónde están?", "¿Hay alguna promo?"];
const HIDDEN_PREFIXES = ["/Admin", "/configuracion", "/gestor-menu", "/QR", "/MisCuenta"];

export default function PachiChatWidget() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(null); // 'start' | 'send' | null
  const [lastText, setLastText] = useState("");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const isHidden = HIDDEN_PREFIXES.some((p) => location.pathname.startsWith(p));

  useEffect(() => {
    if (!conversation?.id) return;
    const unsubscribe = base44.agents.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages);
      const last = data.messages[data.messages.length - 1];
      if (last && last.role === "assistant") {
        setBusy(false);
        setFailed(null);
      }
    });
    return unsubscribe;
  }, [conversation?.id]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy, open, failed]);

  const startConversation = async () => {
    setBusy(true);
    setFailed(null);
    try {
      const conv = await base44.agents.createConversation({ agent_name: AGENT_NAME });
      setConversation(conv);
    } catch {
      setFailed("start");
    }
    setBusy(false);
  };

  const handleOpen = () => {
    setOpen(true);
    if (!conversation && !failed) startConversation();
  };

  const sendMessage = async (text) => {
    const content = text.trim();
    if (!content || busy || !conversation) return;
    setLastText(content);
    setInput("");
    setBusy(true);
    setFailed(null);
    try {
      await base44.agents.addMessage(conversation, { role: "user", content });
    } catch {
      setBusy(false);
      setFailed("send");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (isHidden) return null;

  const showMessages = messages.length > 0 ? messages : [{ role: "assistant", content: GREETING }];
  const showSuggestions = messages.length === 0;

  return (
    <>
      {/* Botón flotante */}
      {!open && (
        <button
          onClick={handleOpen}
          aria-label="Abrir chat de Pachi Bot"
          className="fixed z-50 flex items-center gap-2 pl-3.5 pr-4 py-3 rounded-full transition-all active:scale-95 hover:scale-105 bottom-[calc(68px_+_env(safe-area-inset-bottom,0px))] right-4 md:bottom-6 md:right-6"
          style={{ background: "linear-gradient(135deg, #FF0000, #CC0000)", boxShadow: "0 4px 24px rgba(255,0,0,0.5)" }}
        >
          <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "#FF0000" }} />
          <Bot size={18} className="text-white relative" />
          <span className="text-white text-xs font-bold tracking-widest uppercase font-condensed relative">Pachi Bot</span>
        </button>
      )}

      {/* Panel de conversación */}
      {open && (
        <div
          className="fixed z-[70] flex flex-col rounded-2xl overflow-hidden shadow-2xl left-3 right-3 bottom-[calc(68px_+_env(safe-area-inset-bottom,0px))] h-[min(560px,72vh)] md:left-auto md:right-6 md:bottom-6 md:w-[380px]"
          style={{ background: "#0d0d0d", border: "1px solid rgba(255,0,0,0.3)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{ background: "#0f0f0f", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.7)" }} />
              <div>
                <p className="text-white text-sm font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Pachi Bot</p>
                <p className="text-gray-500 text-xs font-condensed tracking-wide">Asistente de Pacha Disco</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Cerrar chat"
              className="p-1.5 text-gray-500 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Mensajes */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3.5 py-4 flex flex-col gap-3">
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
                  onClick={() => (failed === "start" ? startConversation() : sendMessage(lastText))}
                  className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase font-condensed text-gray-300 hover:text-white transition-colors">
                  <RotateCcw size={13} /> Reintentar
                </button>
              </div>
            )}
          </div>

          {/* Sugerencias */}
          {showSuggestions && !failed && (
            <div className="flex flex-wrap gap-2 px-3.5 pb-2 shrink-0">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => sendMessage(s)} disabled={busy || !conversation}
                  className="text-xs text-gray-300 px-3 py-1.5 rounded-full transition-colors disabled:opacity-40 hover:text-white"
                  style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)" }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-3 shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribí tu consulta…"
              disabled={busy || !conversation}
              className="flex-1 px-4 py-2.5 rounded-full text-sm text-white placeholder-gray-500 outline-none disabled:opacity-50"
              style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.1)" }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={busy || !input.trim() || !conversation}
              aria-label="Enviar"
              className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full transition-all active:scale-90 disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #FF0000, #CC0000)" }}>
              <Send size={16} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}