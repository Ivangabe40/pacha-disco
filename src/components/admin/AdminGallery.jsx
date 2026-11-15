import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Trash2, Upload } from "lucide-react";
import ImageSizeHint from "./ImageSizeHint";

export default function AdminGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [eventName, setEventName] = useState("");

  const load = () => base44.entities.GalleryPhoto.list("-created_date").then(d => { setPhotos(d); }).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleUpload = async (files) => {
    setUploading(true);
    try {
      for (const file of files) {
        const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
        await base44.entities.GalleryPhoto.create({
          photo_url: file_url,
          caption,
          event_name: eventName,
          date: new Date().toISOString().slice(0, 10),
        });
      }
      setCaption("");
      setEventName("");
      load();
    } catch {
      /* silent */
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta foto?")) return;
    await base44.entities.GalleryPhoto.delete(id);
    load();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Galería de Fotos</h2>

      {/* Upload area */}
      <div className="mb-8 p-4 sm:p-6 rounded-2xl" style={{ background: "#111", border: "1px solid #333" }}>
        <h3 className="text-white font-semibold mb-4">Subir fotos</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Descripción (opcional)</label>
            <input value={caption} onChange={e => setCaption(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
              style={{ background: "#1a1a1a", border: "1px solid #333" }} placeholder="Descripción de las fotos" />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Evento (opcional)</label>
            <input value={eventName} onChange={e => setEventName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
              style={{ background: "#1a1a1a", border: "1px solid #333" }} placeholder="Nombre del evento" />
          </div>
        </div>
        <label className="cursor-pointer flex items-center justify-center gap-3 py-8 rounded-xl border-2 border-dashed transition-colors"
          style={{ borderColor: "#333", color: "#666" }}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); handleUpload([...e.dataTransfer.files]); }}>
          <Upload size={24} style={{ color: "#C9A84C" }} />
          <div>
            <span className="text-white font-medium">{uploading ? "Subiendo..." : "Arrastrá fotos aquí o hacé clic"}</span>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP · Múltiples archivos permitidos</p>
          </div>
          <input type="file" accept="image/*" multiple className="hidden"
            onChange={e => e.target.files?.length && handleUpload([...e.target.files])} />
        </label>
        <ImageSizeHint size="1080×1080" ratio="1:1" note="formato cuadrado" />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 rounded-full border-2 border-t-yellow-500 border-gray-800 animate-spin"></div></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {photos.map(photo => (
            <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-square">
              <img src={photo.photo_url} alt={photo.caption} className="w-full h-full object-cover" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2"
                style={{ background: "rgba(0,0,0,0.5)" }}>
                <button onClick={() => handleDelete(photo.id)}
                  className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity truncate"
                  style={{ background: "rgba(0,0,0,0.7)" }}>{photo.caption}</div>
              )}
            </div>
          ))}
          {photos.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-600">No hay fotos aún</div>
          )}
        </div>
      )}
    </div>
  );
}