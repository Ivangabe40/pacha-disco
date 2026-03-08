import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Camera, X } from "lucide-react";

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    base44.entities.GalleryPhoto.list("-created_date").then(data => {
      setPhotos(data);
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-2 border-t-yellow-500 border-gray-800 animate-spin"></div>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20">
            <Camera size={48} className="mx-auto mb-4 opacity-20" style={{ color: "#C9A84C" }} />
            <p className="text-gray-500">Próximamente fotos de nuestros eventos</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {photos.map(photo => (
              <div key={photo.id} onClick={() => setSelected(photo)}
                className="break-inside-avoid rounded-lg overflow-hidden cursor-pointer group relative">
                <img src={photo.photo_url} alt={photo.caption || "Pachá"}
                  className="w-full transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}>
                  {photo.caption && <p className="text-white text-xs">{photo.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.95)" }}
          onClick={() => setSelected(null)}>
          <button className="absolute top-4 right-4 text-white hover:text-gray-300">
            <X size={28} />
          </button>
          <img src={selected.photo_url} alt={selected.caption}
            className="max-w-full max-h-screen rounded-xl object-contain"
            onClick={e => e.stopPropagation()} />
          {selected.caption && (
            <div className="absolute bottom-8 text-center text-gray-300 text-sm">{selected.caption}</div>
          )}
        </div>
      )}
    </div>
  );
}