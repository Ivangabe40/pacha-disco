import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

const LOGO = "https://media.base44.com/images/public/69ad4033370fdc9f9fe8b117/6ecd577f7_file_00000000d89c820e8ae4cce82ce72506.png";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [authError, setAuthError] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open && !conversation) {
      setAuthError(false);
      base44.agents.createConversation({
        agent_name: "pacha_assistant",
        metadata: { name: "Chat Pachá" }
      }).then(conv => {
        setConversation(conv);
        setMessages(conv.messages || []);
      }).catch(() => {
        setAuthError(true);
      });
    }
  }, [open]);

  useEffect(() => {
    if (!conversation) return;
    const unsub = base44.agents.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages || []);
      setLoading(false);
    });
    return unsub;
  }, [conversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading || !conversation) return;
    const text = input.trim();
    setInput("");
    setLoading(true);
    await base44.agents.addMessage(conversation, { role: "user", content: text });
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const visibleMessages = messages.filter(m => m.role === "user" || m.role === "assistant");

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed right-4 z-50 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 md:bottom-6"
        style={{
          background: "linear-gradient(135deg,#FF0000,#FF6666)",
          boxShadow: "0 4px 28px rgba(255,0,0,0.6)",
          border: "2px solid rgba(255,255,255,0.15)",
          bottom: "calc(56px + env(safe-area-inset-bottom, 0px) + 12px)"
        }}>
        {open ? <X size={22} className="text-white" /> : (
          <svg width="34" height="34" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Antena */}
            <line x1="32" y1="8" x2="32" y2="18" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="32" cy="6" r="3" fill="white"/>
            {/* Cabeza */}
            <rect x="12" y="18" width="40" height="28" rx="8" fill="white" fillOpacity="0.95"/>
            {/* Ojos */}
            <circle cx="23" cy="30" r="4.5" fill="#FF0000"/>
            <circle cx="41" cy="30" r="4.5" fill="#FF0000"/>
            <circle cx="24.5" cy="28.5" r="1.5" fill="white"/>
            <circle cx="42.5" cy="28.5" r="1.5" fill="white"/>
            {/* Boca */}
            <rect x="22" y="38" width="20" height="4" rx="2" fill="#FF0000" fillOpacity="0.7"/>
            {/* Cuerpo */}
            <rect x="20" y="48" width="24" height="10" rx="5" fill="white" fillOpacity="0.4"/>
          </svg>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed right-4 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:bottom-28"
          style={{
            height: "520px",
            background: "#0f0f0f",
            border: "1px solid rgba(255,0,0,0.25)",
            bottom: "calc(56px + env(safe-area-inset-bottom, 0px) + 68px)"
          }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 shrink-0"
            style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1a1a" }}>
            <img src={LOGO} alt="Pachá" className="h-9 w-auto object-contain" />
            <div className="flex-1">
              <p className="text-white text-sm font-semibold leading-none">Asistente Pachá</p>
              <p className="text-xs mt-0.5" style={{ color: "#00c864" }}>● Disponible 24/7</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: "none" }}>
            {authError && (
              <div className="text-center py-8 px-4">
                <Bot size={32} className="mx-auto mb-3" style={{ color: "#FF0000", opacity: 0.5 }} />
                <p className="text-gray-300 text-sm font-semibold mb-1">¡Hola! Soy el asistente de Pachá.</p>
                <p className="text-gray-500 text-xs mb-4">Para chatear conmigo necesitás iniciar sesión, o podés contactarnos directamente por WhatsApp.</p>
                <a
                  href="https://wa.me/5493468536935"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-semibold"
                  style={{ background: "#25D366" }}>
                  💬 Escribinos por WhatsApp
                </a>
              </div>
            )}
            {!authError && visibleMessages.length === 0 && !loading && (
              <div className="text-center py-8">
                <Bot size={32} className="mx-auto mb-3" style={{ color: "#FF0000", opacity: 0.5 }} />
                <p className="text-gray-400 text-sm">¡Hola! Soy el asistente de Pachá.</p>
                <p className="text-gray-600 text-xs mt-1">Preguntame sobre eventos, la carta, promos o cómo llegar 🎶</p>
              </div>
            )}
            {visibleMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "text-white"
                    : "text-gray-200"
                }`}
                  style={msg.role === "user"
                    ? { background: "linear-gradient(135deg,#FF0000,#FF6666)" }
                    : { background: "#1a1a1a", border: "1px solid #252525" }}>
                  {msg.role === "assistant"
                    ? <ReactMarkdown className="prose prose-invert prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">{msg.content}</ReactMarkdown>
                    : msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-2xl" style={{ background: "#1a1a1a", border: "1px solid #252525" }}>
                  <Loader2 size={14} className="animate-spin text-gray-500" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          {!authError && (
            <div className="px-3 py-3 shrink-0" style={{ borderTop: "1px solid #1a1a1a", background: "#0a0a0a" }}>
              <div className="flex gap-2 items-end">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Escribí tu consulta..."
                  rows={1}
                  className="flex-1 bg-transparent text-white text-sm resize-none outline-none placeholder-gray-600 py-2 px-3 rounded-xl"
                  style={{ border: "1px solid #2a2a2a", maxHeight: "80px" }}
                />
                <button onClick={send} disabled={!input.trim() || loading}
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all"
                  style={{ background: input.trim() && !loading ? "#FF0000" : "#1a1a1a" }}>
                  <Send size={14} className="text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}