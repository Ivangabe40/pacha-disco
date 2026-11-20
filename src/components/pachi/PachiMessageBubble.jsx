import ReactMarkdown from "react-markdown";

export default function PachiMessageBubble({ message }) {
  const isUser = message.role === "user";
  if (!isUser && !String(message.content || "").trim()) return null;
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed ${isUser ? "rounded-2xl rounded-br-md" : "rounded-2xl rounded-bl-md"}`}
        style={
          isUser
            ? { background: "linear-gradient(135deg, #FF0000, #CC0000)", color: "#fff" }
            : { background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", color: "#EDEDED" }
        }
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <div className="whitespace-pre-wrap break-words [&_p]:m-0">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}