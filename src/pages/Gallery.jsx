import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Camera, ExternalLink, ImageIcon } from "lucide-react";

export default function Gallery() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.GalleryAlbum.list("-created_date").then(data => {
      setAlbums(data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      {/* Header */}
      <div className="relative py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(201,168,76,0.05) 0%, transparent 70%)" }} />
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.4em] mb-3" style={{ color: "#C9A84C" }}>Nuestras</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Galería
          </h1>
          <div className="w-24 h-px mx-auto mt-6" style={{ background: "linear-gradient(to right, transparent, #C9A84C, transparent)" }}></div>
          <p className="text-gray-500 text-sm mt-4">Revivé cada noche. Accedé a las fotos de cada sábado.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 pb-20">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-2 border-t-yellow-500 border-gray-800 animate-spin"></div>
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-20">
            <Camera size={48} className="mx-auto mb-4 opacity-20" style={{ color: "#C9A84C" }} />
            <p className="text-gray-500">Próximamente fotos de nuestros eventos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {albums.map(album => (
              <a key={album.id} href={album.link} target="_blank" rel="noopener noreferrer"
                className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ background: "#111", border: "1px solid #222", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(232,0,29,0.4)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#222"}>
                {/* Cover */}
                <div className="relative overflow-hidden" style={{ aspectRatio: "16/9", background: "#0f0f0f" }}>
                  {album.cover_url ? (
                    <img src={album.cover_url} alt={album.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={40} style={{ color: "#2a2a2a" }} />
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "rgba(232,0,29,0.15)" }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(232,0,29,0.9)" }}>
                      <ExternalLink size={18} className="text-white" />
                    </div>
                  </div>
                </div>
                {/* Title */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <p className="text-white font-semibold text-sm">{album.title}</p>
                  <ExternalLink size={13} className="text-gray-600 group-hover:text-red-500 transition-colors shrink-0 ml-2" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}