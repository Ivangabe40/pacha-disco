import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { X } from "lucide-react";

export default function PromotionPopup() {
  const [promo, setPromo] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    base44.entities.Promotion.filter({ is_active: true }, "-created_date", 1).then(data => {
      if (data.length > 0) {
        setPromo(data[0]);
        setVisible(true);
      }
    });
  }, []);

  if (!visible || !promo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
      onClick={() => setVisible(false)}>
      <div className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ border: "1px solid rgba(116,172,223,0.3)", background: "#0f0f0f", width: "min(360px, 90vw)", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
        onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button onClick={() => setVisible(false)}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all"
          style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <X size={14} className="text-white" />
        </button>

        {/* Video o imagen */}
        {promo.video_url ? (
          <div style={{ flex: "1 1 auto", minHeight: 0, overflow: "hidden" }}>
            <video src={promo.video_url} autoPlay muted loop playsInline
              className="w-full h-full object-cover" style={{ maxHeight: "75vh" }} />
          </div>
        ) : promo.image_url && (
          <div style={{ flex: "1 1 auto", minHeight: 0, overflow: "hidden" }}>
            <img src={promo.image_url} alt={promo.title}
              className="w-full object-cover object-center" style={{ maxHeight: "75vh", display: "block" }} />
          </div>
        )}

        {/* Content */}
        {(promo.description || promo.button_url) && (
          <div className="p-5">
            {promo.description && (
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">{promo.description}</p>
            )}
            {promo.button_url && (
              <a href={promo.button_url} target="_blank" rel="noopener noreferrer"
                className="block w-full text-center py-3 rounded-xl font-bold text-sm tracking-widest uppercase transition-all"
                style={{ background: "linear-gradient(135deg,#75AADB,#92C8F0)", color: "#fff" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                {promo.button_label || "Ver más"}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}