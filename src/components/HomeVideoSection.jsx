import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function HomeVideoSection() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      base44.entities.SiteConfig.filter({ key: "home_video_url" }),
      base44.entities.SiteConfig.filter({ key: "show_home_video" }),
    ]).then(([video, toggle]) => {
      const enabled = toggle.length === 0 || toggle[0].value !== "false";
      if (enabled && video.length > 0 && video[0].value) setVideoUrl(video[0].value);
    }).catch(() => {}).finally(() => setLoaded(true));
  }, []);

  if (!loaded || !videoUrl) return null;

  return (
    <section className="relative w-full" style={{ background: "#070707" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <div className="w-1 h-10 rounded-full" style={{ background: "linear-gradient(#FF0000, #CC0000)" }} />
          <div>
            <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "#FF0000" }}>Próximamente</p>
            <h2 className="text-2xl md:text-4xl font-black text-white uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
              Lo que se viene
            </h2>
          </div>
        </div>
        <div className="relative rounded-xl overflow-hidden w-full"
          style={{ border: "1px solid rgba(255,0,0,0.25)", boxShadow: "0 0 60px rgba(255,0,0,0.12)" }}>
          <video
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full block"
            style={{ maxHeight: "min(56vw, 500px)", objectFit: "cover", width: "100%" }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(7,7,7,0.8), transparent)" }} />
        </div>
      </div>
    </section>
  );
}