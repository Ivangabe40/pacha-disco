import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { uploadPublicFile } from "@/lib/uploadFile";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import ImageSizeHint from "./ImageSizeHint";

const emptyArtist = { name: "", genre: "", bio: "", photo_url: "", instagram: "", soundcloud: "", is_resident: false };

export default function AdminArtists() {
  const [artists, setArtists] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyArtist);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => base44.entities.Artist.list("name").then(d => { setArtists(d); }).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(emptyArtist); setEditing(null); setShowForm(true); };
  const openEdit = (a) => { setForm({ name: a.name || "", genre: a.genre || "", bio: a.bio || "", photo_url: a.photo_url || "", instagram: a.instagram || "", soundcloud: a.soundcloud || "", is_resident: a.is_resident || false }); setEditing(a); setShowForm(true); };

  const handlePhoto = async (file) => {
    setUploading(true);
    try {
      const file_url = await uploadPublicFile(file);
      setForm(f => ({ ...f, photo_url: file_url }));
    } catch { alert("Error al subir la foto"); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    try {
      if (editing) await base44.entities.Artist.update(editing.id, form);
      else await base44.entities.Artist.create(form);
      setShowForm(false);
      load();
    } catch { alert("Error al guardar el artista"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este artista?")) return;
    try { await base44.entities.Artist.delete(id); load(); }
    catch { alert("Error al eliminar el artista"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Artistas & DJs</h2>
        <button onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#0A0A0A" }}>
          <Plus size={16} /> Nuevo Artista
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-4 sm:p-6 rounded-2xl" style={{ background: "#111", border: "1px solid #333" }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">{editing ? "Editar Artista" : "Nuevo Artista"}</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Nombre *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                style={{ background: "#1a1a1a", border: "1px solid #333" }} placeholder="DJ Name" />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Género</label>
              <input value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                style={{ background: "#1a1a1a", border: "1px solid #333" }} placeholder="Electrónica, Reggaeton..." />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Instagram</label>
              <input value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                style={{ background: "#1a1a1a", border: "1px solid #333" }} placeholder="@handle" />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">SoundCloud URL</label>
              <input value={form.soundcloud} onChange={e => setForm({ ...form, soundcloud: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                style={{ background: "#1a1a1a", border: "1px solid #333" }} placeholder="https://soundcloud.com/..." />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Biografía</label>
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                rows={3} className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none resize-none"
                style={{ background: "#1a1a1a", border: "1px solid #333" }} />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Foto</label>
              <ImageSizeHint size="500×500" ratio="1:1" note="formato cuadrado" />
              <div className="flex items-start gap-4">
                <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                  style={{ border: "1px solid #C9A84C", color: "#C9A84C" }}>
                  <Upload size={14} /> {uploading ? "Subiendo..." : "Subir foto"}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files[0] && handlePhoto(e.target.files[0])} />
                </label>
                {form.photo_url && (
                  <div className="relative">
                    <img src={form.photo_url} alt="foto" className="h-16 w-16 rounded-full object-cover" />
                    <button onClick={() => setForm({ ...form, photo_url: "" })}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center">
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="resident" checked={form.is_resident} onChange={e => setForm({ ...form, is_resident: e.target.checked })} className="w-4 h-4" />
              <label htmlFor="resident" className="text-sm text-gray-300">DJ Residente</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-gray-400 text-sm" style={{ border: "1px solid #333" }}>Cancelar</button>
            <button onClick={handleSave} disabled={!form.name}
              className="px-6 py-2 rounded-xl text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#0A0A0A" }}>
              {editing ? "Guardar" : "Crear"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 rounded-full border-2 border-t-yellow-500 border-gray-800 animate-spin"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {artists.map(artist => (
            <div key={artist.id} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "#111", border: "1px solid #222" }}>
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0" style={{ background: "#1a1a1a" }}>
                {artist.photo_url ? <img src={artist.photo_url} alt={artist.name} className="w-full h-full object-cover" /> :
                  <div className="w-full h-full flex items-center justify-center text-lg font-bold" style={{ color: "#C9A84C" }}>{artist.name[0]}</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold truncate">{artist.name}</div>
                <div className="text-xs text-gray-500">{artist.genre || "—"} {artist.is_resident && "· Residente"}</div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(artist)} className="p-2 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(artist.id)} className="p-2 rounded hover:bg-red-900/30 text-gray-600 hover:text-red-300 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          {artists.length === 0 && <div className="col-span-full text-center py-12 text-gray-600">No hay artistas aún</div>}
        </div>
      )}
    </div>
  );
}