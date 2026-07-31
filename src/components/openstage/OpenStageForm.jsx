import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Check, Loader2, AlertCircle } from "lucide-react";

const inputCls = "w-full px-4 py-2.5 rounded-lg text-sm text-white outline-none transition-colors";
const inputStyle = { background: "#0d0d0d", border: "1px solid #2a2a2a" };

export default function OpenStageForm({ onSuccess }) {
  const [form, setForm] = useState({
    contact_name: "",
    artistic_name: "",
    email: "",
    whatsapp: "",
    city: "",
    province: "",
    musical_genre: "",
    additional_info: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.contact_name.trim()) e.contact_name = "Requerido";
    if (!form.artistic_name.trim()) e.artistic_name = "Requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email inválido";
    if (!form.whatsapp.trim()) e.whatsapp = "Requerido";
    if (!form.city.trim()) e.city = "Requerido";
    if (!form.province.trim()) e.province = "Requerido";
    if (!form.musical_genre.trim()) e.musical_genre = "Requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await base44.entities.ArtistApplication.create({
        contact_name: form.contact_name.trim(),
        artistic_name: form.artistic_name.trim(),
        email: form.email.trim(),
        whatsapp: form.whatsapp.trim(),
        city: form.city.trim(),
        province: form.province.trim(),
        musical_genre: form.musical_genre.trim(),
        additional_info: form.additional_info.trim() || undefined,
        status: "nueva",
      });
      try {
        await base44.integrations.Core.SendEmail({
          to: form.email.trim(),
          subject: "¡Recibimos tu propuesta! — Escape Open Stage",
          from_name: "Pachá Night Club",
          body: `Hola ${form.contact_name}!\n\nGracias por querer formar parte de Escape Open Stage.\n\nNuestro equipo revisará tu propuesta. Si encontramos una fecha compatible, nos comunicaremos por los datos proporcionados.\n\n---\nPachá Night Club · Escape Bar`,
        });
      } catch { /* email failure shouldn't block success */ }
      onSuccess();
    } catch {
      alert("Error al enviar la postulación. Intentá nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl p-5 md:p-8" style={{ background: "#0d0d0d", border: "1px solid #2a2a2a" }}>
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1.5">
              Nombre y apellido <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input value={form.contact_name} onChange={e => set("contact_name", e.target.value)} className={inputCls} style={inputStyle} placeholder="Juan Pérez" />
            {errors.contact_name && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#ef4444" }}><AlertCircle size={11} />{errors.contact_name}</p>}
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1.5">
              Nombre artístico / proyecto <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input value={form.artistic_name} onChange={e => set("artistic_name", e.target.value)} className={inputCls} style={inputStyle} placeholder="Ej: Los Sonidos" />
            {errors.artistic_name && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#ef4444" }}><AlertCircle size={11} />{errors.artistic_name}</p>}
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1.5">
              Email <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} className={inputCls} style={inputStyle} placeholder="email@ejemplo.com" />
            {errors.email && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#ef4444" }}><AlertCircle size={11} />{errors.email}</p>}
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1.5">
              WhatsApp <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)} className={inputCls} style={inputStyle} placeholder="+54 9 3468 546935" />
            {errors.whatsapp && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#ef4444" }}><AlertCircle size={11} />{errors.whatsapp}</p>}
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1.5">
              Ciudad <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input value={form.city} onChange={e => set("city", e.target.value)} className={inputCls} style={inputStyle} placeholder="Corral de Bustos" />
            {errors.city && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#ef4444" }}><AlertCircle size={11} />{errors.city}</p>}
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1.5">
              Provincia <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input value={form.province} onChange={e => set("province", e.target.value)} className={inputCls} style={inputStyle} placeholder="Córdoba" />
            {errors.province && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#ef4444" }}><AlertCircle size={11} />{errors.province}</p>}
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1.5">
            Género o estilo musical <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input value={form.musical_genre} onChange={e => set("musical_genre", e.target.value)} className={inputCls} style={inputStyle} placeholder="Ej: Indie, Rock, Electrónica..." />
          {errors.musical_genre && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#ef4444" }}><AlertCircle size={11} />{errors.musical_genre}</p>}
        </div>

        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1.5">
            Nota / Mensaje
          </label>
          <textarea value={form.additional_info} onChange={e => set("additional_info", e.target.value)} rows={4} className={inputCls + " resize-none"} style={inputStyle} maxLength={3000} placeholder="Contanos sobre tu proyecto, experiencia, links a tu música, disponibilidad, etc." />
        </div>

        <button onClick={handleSubmit} disabled={submitting}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all"
          style={{ background: submitting ? "#333" : "linear-gradient(135deg, #FF0000, #CC0000)" }}>
          {submitting ? <><Loader2 size={16} className="animate-spin" /> Enviando...</> : <><Check size={16} /> ENVIAR POSTULACIÓN</>}
        </button>
      </div>
    </div>
  );
}