import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { X } from "lucide-react";
import { safeExternalUrl } from "@/lib/safeUrl";

export default function PromotionPopup() {
  const [promo, setPromo] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("pacha_promo_seen")) return;
    base44.entities.Promotion.filter({ is_active: true }, "-created_date", 1).then(data => {
      if (data.length > 0) {
        setPromo(data[0]);
        setVisible(true);
      }
    }).catch(() => {});
  }, []);

  const close = () => {
    setVisible(false);
    sessionStorage.setItem("pacha_promo_seen", "1");
  };

  if (!visible || !promo) return null;

  const isVideo = !!promo.video_url;
  const hasImage = !!promo.image_url;
  const safeButtonUrl = safeExternalUrl(promo.button_url);
  const hasContent = promo.description || safeButtonUrl;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
      onClick={close}>
      <div className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{
          border: "1px solid rgba(255,0,0,0.3)",
          background: "#0f0f0f",
          width: "min(330px, 88vw)",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button onClick={close}
          className="absolute top-2.5 right-2.5 z-10 w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-90"
          style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.15)" }}>
          <X size={16} className="text-white" />
        </button>

        {/* Media */}
        {isVideo ? (
          <div style={{ flex: "1 1 auto", minHeight: 0, overflow: "hidden", maxHeight: hasContent ? "52vh" : "70vh" }}>
            <video src={promo.video_url} autoPlay muted loop playsInline
              className="w-full h-full object-cover" />
          </div>
        ) : hasImage && (
          <div style={{ flex: "1 1 auto", minHeight: 0, overflow: "hidden", maxHeight: hasContent ? "52vh" : "70vh" }}>
            <img src={promo.image_url} alt={promo.title || "Promoción"}
              className="w-full h-full object-cover object-center" style={{ display: "block" }} />
          </div>
        )}

        {/* Content */}
        {hasContent && (
          <div className="px-5 py-4 shrink-0">
            {promo.title && (
              <h3 className="text-white font-bold text-sm mb-1.5" style={{ fontFamily: "'Playfair Display', serif" }}>{promo.title}</h3>
            )}
            {promo.description && (
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">{promo.description}</p>
            )}
            {safeButtonUrl && (
              <a href={safeButtonUrl} target="_blank" rel="noopener noreferrer" onClick={close}
                className="block w-full text-center py-2.5 rounded-xl font-bold text-xs tracking-widest uppercase transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg,#FF0000,#FF6666)", color: "#fff" }}>
                {promo.button_label || "Ver más"}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}