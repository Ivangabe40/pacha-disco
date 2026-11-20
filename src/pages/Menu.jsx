import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import MenuCategorySection from "@/components/menu/MenuCategorySection";
import { Wine, Star, Tag, ExternalLink, Sparkles } from "lucide-react";
import { safeExternalUrl, safeMediaUrl } from "@/lib/safeUrl";

const CATEGORY_ORDER = [
  "Sin Alcohol", "Vodkas", "Vermuts", "Cervezas", "Gin",
  "Clásicos", "Whiskies", "Bottle Service", "Espumosos"
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
};

const TAB_MENU = "menu";
const TAB_PROMOS = "promos";

function PromoButton({ promo }) {
  const url = safeExternalUrl(promo.button_url);
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all"
      style={{ background: "rgba(255,0,0,0.12)", color: "#FF0000", border: "1px solid rgba(255,0,0,0.3)" }}>
      {promo.button_label || "Ver más"} <ExternalLink size={11} />
    </a>
  );
}

export default function Menu() {
  const [items, setItems] = useState([]);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(TAB_MENU);

  useEffect(() => {
    Promise.all([
      base44.entities.MenuItem.list("sort_order"),
      base44.entities.Promotion.filter({ is_active: true })
    ]).then(([menuData, promoData]) => {
      setItems(menuData);
      setPromos(promoData);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const available = items.filter(i => i.is_available !== false);
  const categories = CATEGORY_ORDER.filter(cat => available.some(i => i.category === cat));
  const featured = available.filter(i => i.is_featured);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#070707" }}>
      <div className="w-10 h-10 rounded-full animate-spin"
        style={{ border: "2px solid #1a1a1a", borderTop: "2px solid #FF0000" }} />
    </div>
  );

  return (
    <div style={{ background: "#070707", minHeight: "100vh" }}>
      {/* Header */}
      <div className="relative py-12 px-4 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(255,0,0,0.08) 0%, transparent 70%)" }} />
        <div className="h-0.5 w-full absolute top-0 left-0" style={{ background: "linear-gradient(90deg, transparent, #FF0000 30%, #FF0000 70%, transparent)" }} />
        <div className="relative z-10">
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "#FF0000" }}>Pachá Night Club</p>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Carta & Promociones
          </h1>
          <p className="text-gray-500 text-sm mt-2 tracking-wider">Exclusivo · Mayores de edad</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-4 mb-6">
        <div className="flex rounded-xl overflow-hidden" style={{ background: "#111", border: "1px solid #222" }}>
          <button
            onClick={() => setActiveTab(TAB_MENU)}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold tracking-wider uppercase transition-all"
            style={activeTab === TAB_MENU
              ? { background: "#FF0000", color: "#fff" }
              : { color: "#666" }}>
            <Wine size={15} /> Carta
          </button>
          <button
            onClick={() => setActiveTab(TAB_PROMOS)}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold tracking-wider uppercase transition-all relative"
            style={activeTab === TAB_PROMOS
              ? { background: "#FF0000", color: "#fff" }
              : { color: "#666" }}>
            <Tag size={15} /> Promociones
            {promos.length > 0 && (
              <span className="absolute top-2 right-4 w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#FF0000", display: activeTab === TAB_PROMOS ? "none" : "block" }} />
            )}
          </button>
        </div>
      </div>

      {/* ─── CARTA TAB ─── */}
      {activeTab === TAB_MENU && (
        <>
          {/* Featured */}
          {featured.length > 0 && (
            <section className="max-w-2xl mx-auto px-4 mb-8">
              <div className="flex items-center gap-3 mb-4 justify-center">
                <Star size={13} fill="#FF0000" style={{ color: "#FF0000" }} />
                <span className="text-xs tracking-widest uppercase font-bold" style={{ color: "#FF0000" }}>Destacados</span>
                <Star size={13} fill="#FF0000" style={{ color: "#FF0000" }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {featured.map(item => (
                  <div key={item.id} className="p-4 rounded-xl flex items-center justify-between gap-3"
                    style={{ background: "linear-gradient(135deg, rgba(255,0,0,0.08), rgba(0,0,0,0.4))", border: "1px solid rgba(255,0,0,0.3)" }}>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white font-bold text-sm">{item.name}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "#FF0000", color: "#fff" }}>★</span>
                      </div>
                      {item.description && <p className="text-gray-500 text-xs">{item.description}</p>}
                    </div>
                    <div className="text-lg font-black shrink-0" style={{ color: "#FF0000" }}>${(item.price || 0).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Categorías desplegables */}
          <div className="max-w-2xl mx-auto px-4 pb-20 space-y-4">
            {categories.map((cat, idx) => (
              <MenuCategorySection
                key={cat}
                category={cat}
                icon={CATEGORY_ICONS[cat]}
                items={available.filter(i => i.category === cat)}
                defaultOpen={idx === 0}
              />
            ))}

            {categories.length === 0 && (
              <div className="text-center py-20 text-gray-600">
                <Wine size={40} className="mx-auto mb-3 opacity-30" />
                <p>No hay productos disponibles</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ─── PROMOCIONES TAB ─── */}
      {activeTab === TAB_PROMOS && (
        <div className="max-w-2xl mx-auto px-4 pb-20">
          {promos.length === 0 ? (
            <div className="text-center py-24">
              <Sparkles size={40} className="mx-auto mb-3 opacity-20" style={{ color: "#FF0000" }} />
              <p className="text-gray-600 text-sm">No hay promociones activas en este momento.</p>
              <p className="text-gray-700 text-xs mt-1">¡Seguinos en Instagram para no perderte las novedades!</p>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              {promos.map(promo => (
                <div key={promo.id} className="rounded-2xl overflow-hidden"
                  style={{ background: "#0f0f0f", border: "1px solid rgba(255,0,0,0.2)" }}>
                  {safeMediaUrl(promo.image_url) && (
                    <div className="w-full aspect-video relative overflow-hidden">
                      <img src={safeMediaUrl(promo.image_url)} alt={promo.title}
                        className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
                      <div className="absolute top-3 left-3">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full tracking-wider uppercase"
                          style={{ background: "#FF0000", color: "#fff" }}>
                          🔥 Vigente
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="px-4 py-4 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-base leading-tight mb-1"
                        style={{ fontFamily: "'Playfair Display', serif" }}>
                        {promo.title}
                      </h3>
                      {promo.description && (
                        <p className="text-gray-400 text-sm leading-relaxed">{promo.description}</p>
                      )}
                    </div>
                    <PromoButton promo={promo} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="text-center py-6 px-4" style={{ borderTop: "1px solid #111" }}>
        <p className="text-gray-700 text-xs tracking-widest uppercase">Pachá Night Club · Exclusivo Mayores</p>
      </div>
    </div>
  );
}