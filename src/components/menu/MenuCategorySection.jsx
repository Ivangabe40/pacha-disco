import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function MenuCategorySection({ category, icon, items, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #1a1a1a" }}>
      {/* Header clicable */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-4 transition-all"
        style={{ background: open ? "#0f0f0f" : "#0a0a0a", textAlign: "left" }}>
        <span className="text-xl">{icon}</span>
        <h2 className="text-sm font-black text-white uppercase"
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "0.15em" }}>
          {category}
        </h2>
        <span className="text-gray-600 text-xs tabular-nums">{items.length}</span>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(255,0,0,0.4), transparent)" }} />
        <ChevronDown
          size={16}
          className="shrink-0 transition-transform duration-300"
          style={{ color: "#FF0000", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>

      {/* Contenido desplegable */}
      {open && (
        <div>
          {items.map((item, idx) => (
            <div key={item.id}
              className="flex items-center justify-between gap-3 py-3.5 px-4"
              style={{ borderTop: "1px solid #111", background: idx % 2 === 0 ? "#0d0d0d" : "#0a0a0a" }}>
              <div className="flex-1 min-w-0">
                <span className="text-white font-medium text-sm leading-tight">{item.name}</span>
                {item.description && <p className="text-gray-600 text-xs mt-0.5">{item.description}</p>}
              </div>
              <div className="shrink-0 text-sm font-black tabular-nums" style={{ color: "#C9A84C" }}>
                ${(item.price || 0).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}