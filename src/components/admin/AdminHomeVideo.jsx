import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Upload, Trash2, Video } from "lucide-react";

const CONFIG_KEY = "home_video_url";

export default function AdminHomeVideo() {
  const [videoUrl, setVideoUrl] = useState("");
  const [configId, setConfigId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    base44.entities.SiteConfig.filter({ key: CONFIG_KEY }).then(data => {
      if (data.length > 0) {
        setVideoUrl(data[0].value);
        setConfigId(data[0].id);
      }
    });
  }, []);

  const handleUpload = async (file) => {
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setVideoUrl(file_url);
    await save(file_url);
    setUploading(false);
  };

  const save = async (url) => {
    if (configId) {
      await base44.entities.SiteConfig.update(configId, { key: CONFIG_KEY, value: url });
    } else {
      const created = await base44.entities.SiteConfig.create({ key: CONFIG_KEY, value: url, description: "Video principal de la sección Lo que se viene en el Home" });
      setConfigId(created.id);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleRemove = async () => {
    if (!window.confirm("¿Quitar el video del Home?")) return;
    if (configId) await base44.entities.SiteConfig.update(configId, { key: CONFIG_KEY, value: "" });
    setVideoUrl("");
  };

  return (
    <div className="p-6 rounded-2xl" style={{ background: "#111", border: "1px solid #333" }}>
      <div className="flex items-center gap-3 mb-5">
        <Video size={18} style={{ color: "#E8001D" }} />
        <h3 className="text-white font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
          Video "Lo que se viene" — Home
        </h3>
      </div>

      {videoUrl ? (
        <div className="mb-5">
          <video
            src={videoUrl}
            controls
            muted
            className="w-full rounded-xl"
            style={{ maxHeight: "280px", objectFit: "cover", border: "1px solid rgba(232,0,29,0.2)" }}
          />
          <p className="text-xs text-gray-500 mt-2 truncate">{videoUrl}</p>
        </div>
      ) : (
        <div className="mb-5 flex items-center justify-center rounded-xl py-12"
          style={{ border: "1px dashed #333", background: "#0d0d0d" }}>
          <p className="text-gray-600 text-sm">No hay video cargado actualmente</p>
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <label className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "rgba(232,0,29,0.12)", border: "1px solid rgba(232,0,29,0.4)", color: "#E8001D" }}>
          <Upload size={14} />
          {uploading ? "Subiendo..." : videoUrl ? "Cambiar video" : "Subir video"}
          <input type="file" accept="video/*" className="hidden"
            onChange={e => e.target.files[0] && handleUpload(e.target.files[0])} />
        </label>

        {videoUrl && (
          <button onClick={handleRemove}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ border: "1px solid #444", color: "#888" }}>
            <Trash2 size={14} /> Quitar video
          </button>
        )}

        {saved && <span className="text-green-400 text-sm self-center">✓ Guardado</span>}
      </div>
    </div>
  );
}