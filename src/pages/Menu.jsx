import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Wine, Star, Download } from "lucide-react";

const LOGO_RED = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_69abf6aff758a16386edeb04/0e73ec46b_IMG-20260121-WA0031.jpg";

const CATEGORY_ORDER = [
  "Sin Alcohol", "Vodkas", "Vermuts", "Cervezas", "Gin",
  "Clásicos", "Whiskies", "Bottle Service", "Espumosos", "Sugerencias Verano"
];

const CATEGORY_ICONS = {
  "Sin Alcohol": "🥤",
  "Vodkas": "🍹",
  "Vermuts": "🍊",
  "Cervezas": "🍺",
  "Gin": "🌿",
  "Clásicos": "🍸",
  "Whiskies": "🥃",
  "Bottle Service": "🍾",
  "Espumosos": "🥂",
  "Sugerencias Verano": "☀️",
};

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    const menuUrl = encodeURIComponent(window.location.href.split("?")[0]);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${menuUrl}&color=E8001D&bgcolor=070707&format=png&qzone=2`);
  }, []);

  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = "qr-carta-pacha.png";
    link.target = "_blank";
    link.click();
  };

  useEffect(() => {
    base44.entities.MenuItem.list("sort_order").then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const available = items.filter(i => i.is_available !== false);
  const categories = CATEGORY_ORDER.filter(cat => available.some(i => i.category === cat));
  const featured = available.filter(i => i.is_featured);

  const filtered = activeCategory === "all"
    ? available
    : available.filter(i => i.category === activeCategory);

  const grouped = categories.reduce((acc, cat) => {
    const catItems = filtered.filter(i => i.category === cat);
    if (catItems.length > 0) acc[cat] = catItems;
    return acc;
  }, {});

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#070707" }}>
      <div className="w-10 h-10 rounded-full animate-spin"
        style={{ border: "2px solid #1a1a1a", borderTop: "2px solid #E8001D" }} />
    </div>
  );

  return (
    <div style={{ background: "#070707", minHeight: "100vh" }}>
      {/* Header */}
      <div className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(232,0,29,0.08) 0%, transparent 70%)" }} />
        <div className="h-0.5 w-full absolute top-0 left-0" style={{ background: "linear-gradient(90deg, transparent, #E8001D 30%, #E8001D 70%, transparent)" }} />
        <div className="relative z-10">
          <img src={LOGO_RED} alt="Pachá" className="h-16 w-auto mx-auto mb-5 object-contain"
            style={{ filter: "drop-shadow(0 0 20px rgba(232,0,29,0.6))" }} />
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "#E8001D" }}>Pachá Night Club</p>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Carta de Tragos
          </h1>
          <p className="text-gray-500 text-sm mt-3 tracking-wider">Exclusivo · Mayores de edad</p>
        </div>
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="max-w-2xl mx-auto px-4 mb-10">
          <div className="flex items-center gap-3 mb-5 justify-center">
            <Star size={14} fill="#E8001D" style={{ color: "#E8001D" }} />
            <span className="text-xs tracking-widest uppercase font-bold" style={{ color: "#E8001D" }}>Destacados</span>
            <Star size={14} fill="#E8001D" style={{ color: "#E8001D" }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {featured.map(item => (
              <div key={item.id} className="p-4 rounded-xl flex items-center justify-between gap-3"
                style={{ background: "linear-gradient(135deg, rgba(232,0,29,0.08), rgba(0,0,0,0.4))", border: "1px solid rgba(232,0,29,0.3)" }}>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white font-bold text-sm">{item.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "#E8001D", color: "#fff" }}>★</span>
                  </div>
                  {item.description && <p className="text-gray-500 text-xs">{item.description}</p>}
                </div>
                <div className="text-lg font-black shrink-0" style={{ color: "#E8001D" }}>${item.price.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Category Filter */}
      <div className="max-w-2xl mx-auto px-4 mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategory("all")}
            className="shrink-0 px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all"
            style={activeCategory === "all"
              ? { background: "#E8001D", color: "#fff" }
              : { background: "#1a1a1a", color: "#666", border: "1px solid #2a2a2a" }}>
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="shrink-0 px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all"
              style={activeCategory === cat
                ? { background: "#E8001D", color: "#fff" }
                : { background: "#1a1a1a", color: "#666", border: "1px solid #2a2a2a" }}>
              {CATEGORY_ICONS[cat]} {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-2xl mx-auto px-4 pb-20 space-y-10">
        {Object.entries(grouped).map(([category, catItems]) => (
          <div key={category}>
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xl">{CATEGORY_ICONS[category]}</span>
              <h2 className="text-base font-black text-white uppercase tracking-widest"
                style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "0.15em" }}>
                {category}
              </h2>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(232,0,29,0.4), transparent)" }} />
            </div>

            {/* Items */}
            <div className="space-y-1">
              {catItems.map((item, idx) => (
                <div key={item.id}
                  className="flex items-baseline justify-between gap-3 py-3 px-1"
                  style={{ borderBottom: idx < catItems.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div className="flex-1 min-w-0">
                    <span className="text-white font-medium text-sm leading-tight">{item.name}</span>
                    {item.description && <p className="text-gray-600 text-xs mt-0.5 leading-snug">{item.description}</p>}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex-1 border-b border-dotted border-gray-800 min-w-8" style={{ height: "1px", alignSelf: "center" }} />
                    <span className="text-sm font-bold tabular-nums" style={{ color: "#C9A84C" }}>
                      ${item.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(grouped).length === 0 && (
          <div className="text-center py-20 text-gray-600">
            <Wine size={40} className="mx-auto mb-3 opacity-30" />
            <p>No hay productos disponibles</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-6 px-4" style={{ borderTop: "1px solid #111" }}>
        <p className="text-gray-700 text-xs tracking-widest uppercase">Pachá Night Club · Exclusivo Mayores</p>
      </div>
    </div>
  );
}