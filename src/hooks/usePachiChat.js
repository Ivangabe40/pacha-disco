import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";

const AGENT_NAME = "pacha_assistant";

export const PACHI_GREETING = "Hola, soy Pachi. ¿Qué querés saber de Pacha?";
export const PACHI_SUGGESTIONS = [
  "¿Cuánto sale la entrada?",
  "¿Qué hay este sábado?",
  "¿Dónde están?",
  "¿Hay alguna promo?",
];

export default function usePachiChat(autoStart = false) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(null); // 'start' | 'send' | null
  const [lastText, setLastText] = useState("");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const startedRef = useRef(false);

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
  }, [messages, busy, failed]);

  const startConversation = async () => {
    startedRef.current = true;
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

  useEffect(() => {
    if (autoStart && !startedRef.current) startConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  const sendMessage = async (text) => {
    const content = (text || "").trim();
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

  const retry = () => (failed === "start" ? startConversation() : sendMessage(lastText));

  return {
    conversation,
    messages,
    input,
    setInput,
    busy,
    failed,
    sendMessage,
    retry,
    scrollRef,
    inputRef,
  };
}