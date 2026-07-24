import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { ChevronLeft, ChevronRight, Check, Upload, Loader2, AlertCircle } from "lucide-react";

const HERO_IMG = "https://media.base44.com/images/public/69ad4033370fdc9f9fe8b117/38f0b41f7_generated_image.png";

const STEPS = [
  { id: 0, label: "Contacto" },
  { id: 1, label: "Proyecto" },
  { id: 2, label: "Material" },
  { id: 3, label: "Técnico" },
  { id: 4, label: "Disponibilidad" },
  { id: 5, label: "Difusión" },
  { id: 6, label: "Motivación" },
  { id: 7, label: "Condiciones" },
];

const PROJECT_TYPES = ["solista", "duo", "banda", "dj", "productor", "instrumentista", "otro"];
const REPERTOIRE_TYPES = [
  { value: "propia", label: "Música propia" },
  { value: "covers", label: "Covers" },
  { value: "ambas", label: "Ambas" },
];
const YES_NO_OPTIONS = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
  { value: "parcialmente", label: "Parcialmente" },
  { value: "asesoramiento", label: "Necesito asesoramiento" },
];
const ARTIST_CARDS = [
  { icon: "🎤", label: "Solistas" },
  { icon: "🎸", label: "Bandas y grupos" },
  { icon: "👥", label: "Dúos" },
  { icon: "🎙️", label: "Cantantes" },
  { icon: "🎧", label: "DJs" },
  { icon: "🎹", label: "Productores" },
  { icon: "🎻", label: "Instrumentistas" },
  { icon: "🪕", label: "Proyectos acústicos" },
  { icon: "⚡", label: "Música electrónica" },
  { icon: "🎵", label: "Otros formatos" },
];

const EMPTY = {
  contact_name: "", artistic_name: "", email: "", whatsapp: "", city: "", province: "",
  contact_age: "", instagram_user: "", project_type: "solista", member_count: 1, members: "",
  musical_genre: "", secondary_genres: "", repertoire_type: "propia", project_description: "",
  formation_year: "", live_experience: "", performance_duration: "", song_count: "", content_language: "",
  is_all_ages: true, explicit_content: false,
  instagram_url: "", spotify_url: "", youtube_url: "", soundcloud_url: "", tiktok_url: "",
  website_url: "", live_video_url: "", drive_folder_url: "", profile_images: "", press_kit_file: "", technical_rider_file: "",
  owns_instruments: "", owns_microphones: "", owns_amplifiers: "", owns_console: "", owns_controller: "",
  has_sound_engineer: "", needs_technical_assistance: "",
  required_microphones: "", required_audio_inputs: "", connection_type: "", stage_space: "",
  setup_time: "", soundcheck_time: "", technical_requirements: "",
  available_dates: "", available_time: "", has_transport: false, date_restrictions: "",
  confirmation_notice: "", available_soundcheck: false, promotional_availability: false,
  social_followers: "", estimated_audience: "", willing_to_promote: false, can_generate_content: false,
  authorizes_media_use: false, promotion_plan: "",
  motivation: "", project_differential: "", expected_experience: "", additional_info: "",
  accepted_terms_truthful: false, accepted_no_guarantee: false, accepted_contact: false,
  accepted_material_use: false, accepted_members_auth: false, accepted_bases: false,
};

function Field({ label, required, children, error }) {
  return (
    <div>
      <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1.5">
        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      {children}
      {error && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#ef4444" }}><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

const inputCls = "w-full px-4 py-2.5 rounded-lg text-sm text-white outline-none transition-colors";
const inputStyle = { background: "#0d0d0d", border: "1px solid #2a2a2a" };

export default function OpenStageForm({ onSuccess }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const uploadFile = async (key, file) => {
    setUploading(key);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      set(key, file_url);
    } catch { alert("Error al subir el archivo"); }
    finally { setUploading(null); }
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.contact_name.trim()) e.contact_name = "Requerido";
      if (!form.artistic_name.trim()) e.artistic_name = "Requerido";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email inválido";
      if (!form.whatsapp.trim()) e.whatsapp = "Requerido";
      if (!form.city.trim()) e.city = "Requerido";
      if (!form.province.trim()) e.province = "Requerido";
    }
    if (s === 1) {
      if (!form.musical_genre.trim()) e.musical_genre = "Requerido";
    }
    if (s === 2) {
      const hasLink = form.instagram_url || form.spotify_url || form.youtube_url ||
        form.soundcloud_url || form.tiktok_url || form.website_url || form.live_video_url || form.drive_folder_url;
      if (!hasLink) e.link = "Proporcioná al menos un enlace donde podamos escuchar/ver tu música";
    }
    if (s === 7) {
      if (!form.accepted_terms_truthful) e.accepted_terms_truthful = "Debés aceptar";
      if (!form.accepted_no_guarantee) e.accepted_no_guarantee = "Debés aceptar";
      if (!form.accepted_contact) e.accepted_contact = "Debés aceptar";
      if (!form.accepted_material_use) e.accepted_material_use = "Debés aceptar";
      if (!form.accepted_members_auth) e.accepted_members_auth = "Debés aceptar";
      if (!form.accepted_bases) e.accepted_bases = "Debés aceptar";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep(step)) setStep(s => Math.min(s + 1, STEPS.length - 1)); };
  const back = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!validateStep(7)) return;
    setSubmitting(true);
    try {
      const data = { ...form, status: "nueva" };
      await base44.entities.ArtistApplication.create(data);
      // Send confirmation email
      try {
        await base44.integrations.Core.SendEmail({
          to: form.email,
          subject: "¡Recibimos tu propuesta! — Escape Open Stage",
          from_name: "Pachá Night Club",
          body: `Hola ${form.contact_name}!\n\nGracias por querer formar parte de Escape Open Stage.\n\nNuestro equipo revisará tu material, necesidades técnicas y disponibilidad. Si encontramos una fecha o formato compatible con tu proyecto, nos comunicaremos por los datos proporcionados.\n\nMientras tanto, seguí las redes de Pachá Disco y Escape Bar para conocer las próximas novedades.\n\n---\nPachá Night Club · Escape Bar`,
        });
      } catch { /* email failure shouldn't block success */ }
      onSuccess();
    } catch { alert("Error al enviar la postulación. Intentá nuevamente."); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="rounded-2xl p-5 md:p-8" style={{ background: "#0d0d0d", border: "1px solid #2a2a2a" }}>
      {/* Progress bar */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto scrollbar-hide">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: i < step ? "rgba(34,197,94,0.15)" : i === step ? "#FF0000" : "#1a1a1a",
                  color: i < step ? "#22c55e" : i === step ? "#fff" : "#555",
                  border: i === step ? "1px solid #FF0000" : "1px solid #2a2a2a",
                }}>
                {i < step ? <Check size={13} /> : i + 1}
              </div>
              <span className="text-xs hidden md:inline" style={{ color: i === step ? "#FF0000" : "#555" }}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div className="w-4 md:w-8 h-px mx-1" style={{ background: i < step ? "rgba(34,197,94,0.3)" : "#1a1a1a" }} />}
          </div>
        ))}
      </div>

      {/* Step 0: Contacto */}
      {step === 0 && (
        <div className="space-y-4">
          <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Datos de contacto</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Nombre y apellido" required error={errors.contact_name}>
              <input value={form.contact_name} onChange={e => set("contact_name", e.target.value)} className={inputCls} style={inputStyle} placeholder="Juan Pérez" />
            </Field>
            <Field label="Nombre artístico / proyecto" required error={errors.artistic_name}>
              <input value={form.artistic_name} onChange={e => set("artistic_name", e.target.value)} className={inputCls} style={inputStyle} placeholder="Ej: Los Sonidos" />
            </Field>
            <Field label="Correo electrónico" required error={errors.email}>
              <input type="email" value={form.email} onChange={e => set("email", e.target.value)} className={inputCls} style={inputStyle} placeholder="email@ejemplo.com" />
            </Field>
            <Field label="WhatsApp" required error={errors.whatsapp}>
              <input value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)} className={inputCls} style={inputStyle} placeholder="+54 9 3468 546935" />
            </Field>
            <Field label="Ciudad o localidad" required error={errors.city}>
              <input value={form.city} onChange={e => set("city", e.target.value)} className={inputCls} style={inputStyle} />
            </Field>
            <Field label="Provincia" required error={errors.province}>
              <input value={form.province} onChange={e => set("province", e.target.value)} className={inputCls} style={inputStyle} />
            </Field>
            <Field label="Edad del responsable">
              <input type="number" value={form.contact_age} onChange={e => set("contact_age", e.target.value ? Number(e.target.value) : "")} className={inputCls} style={inputStyle} />
            </Field>
            <Field label="Usuario de Instagram">
              <input value={form.instagram_user} onChange={e => set("instagram_user", e.target.value)} className={inputCls} style={inputStyle} placeholder="@usuario" />
            </Field>
          </div>
        </div>
      )}

      {/* Step 1: Proyecto */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Información del proyecto</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Tipo de proyecto">
              <select value={form.project_type} onChange={e => set("project_type", e.target.value)} className={inputCls} style={inputStyle}>
                {PROJECT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </Field>
            <Field label="Cantidad de integrantes">
              <input type="number" min={1} value={form.member_count} onChange={e => set("member_count", e.target.value ? Number(e.target.value) : 1)} className={inputCls} style={inputStyle} />
            </Field>
            <Field label="Nombre de los integrantes">
              <textarea value={form.members} onChange={e => set("members", e.target.value)} rows={2} className={inputCls + " resize-none"} style={inputStyle} placeholder="Un nombre por línea" />
            </Field>
            <Field label="Género o estilo musical principal" required error={errors.musical_genre}>
              <input value={form.musical_genre} onChange={e => set("musical_genre", e.target.value)} className={inputCls} style={inputStyle} placeholder="Ej: Indie, Rock, Electrónica..." />
            </Field>
            <Field label="Géneros secundarios">
              <input value={form.secondary_genres} onChange={e => set("secondary_genres", e.target.value)} className={inputCls} style={inputStyle} />
            </Field>
            <Field label="¿Interpretan música propia, covers o ambas?">
              <select value={form.repertoire_type} onChange={e => set("repertoire_type", e.target.value)} className={inputCls} style={inputStyle}>
                {REPERTOIRE_TYPES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </Field>
            <Field label="Año de formación o inicio">
              <input type="number" value={form.formation_year} onChange={e => set("formation_year", e.target.value ? Number(e.target.value) : "")} className={inputCls} style={inputStyle} placeholder="2020" />
            </Field>
            <Field label="Duración aproximada de la presentación">
              <input value={form.performance_duration} onChange={e => set("performance_duration", e.target.value)} className={inputCls} style={inputStyle} placeholder="Ej: 45 minutos" />
            </Field>
            <Field label="Cantidad estimada de canciones o temas">
              <input type="number" value={form.song_count} onChange={e => set("song_count", e.target.value ? Number(e.target.value) : "")} className={inputCls} style={inputStyle} />
            </Field>
            <Field label="Idioma principal de las canciones">
              <input value={form.content_language} onChange={e => set("content_language", e.target.value)} className={inputCls} style={inputStyle} placeholder="Español" />
            </Field>
          </div>
          <Field label="Breve descripción del proyecto">
            <textarea value={form.project_description} onChange={e => set("project_description", e.target.value)} rows={3} className={inputCls + " resize-none"} style={inputStyle} maxLength={3000} />
          </Field>
          <Field label="Experiencia previa en presentaciones en vivo">
            <textarea value={form.live_experience} onChange={e => set("live_experience", e.target.value)} rows={2} className={inputCls + " resize-none"} style={inputStyle} maxLength={2000} />
          </Field>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_all_ages} onChange={e => set("is_all_ages", e.target.checked)} className="w-4 h-4 accent-red-500" />
              <span className="text-sm text-gray-300">Apto para todo público</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.explicit_content} onChange={e => set("explicit_content", e.target.checked)} className="w-4 h-4 accent-red-500" />
              <span className="text-sm text-gray-300">Incluye contenido explícito</span>
            </label>
          </div>
        </div>
      )}

      {/* Step 2: Material */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Material artístico</h3>
          <p className="text-xs text-gray-500 mb-4">Es obligatorio proporcionar al menos un enlace donde podamos escuchar o ver tu presentación.</p>
          {errors.link && <p className="text-xs flex items-center gap-1" style={{ color: "#ef4444" }}><AlertCircle size={11} />{errors.link}</p>}
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Enlace a Instagram"><input value={form.instagram_url} onChange={e => set("instagram_url", e.target.value)} className={inputCls} style={inputStyle} placeholder="https://instagram.com/..." /></Field>
            <Field label="Enlace a Spotify"><input value={form.spotify_url} onChange={e => set("spotify_url", e.target.value)} className={inputCls} style={inputStyle} placeholder="https://open.spotify.com/..." /></Field>
            <Field label="Enlace a YouTube"><input value={form.youtube_url} onChange={e => set("youtube_url", e.target.value)} className={inputCls} style={inputStyle} placeholder="https://youtube.com/..." /></Field>
            <Field label="Enlace a SoundCloud"><input value={form.soundcloud_url} onChange={e => set("soundcloud_url", e.target.value)} className={inputCls} style={inputStyle} placeholder="https://soundcloud.com/..." /></Field>
            <Field label="Enlace a TikTok"><input value={form.tiktok_url} onChange={e => set("tiktok_url", e.target.value)} className={inputCls} style={inputStyle} placeholder="https://tiktok.com/..." /></Field>
            <Field label="Enlace a página web"><input value={form.website_url} onChange={e => set("website_url", e.target.value)} className={inputCls} style={inputStyle} placeholder="https://..." /></Field>
            <Field label="Enlace a presentación en vivo"><input value={form.live_video_url} onChange={e => set("live_video_url", e.target.value)} className={inputCls} style={inputStyle} placeholder="https://..." /></Field>
            <Field label="Enlace a carpeta de Google Drive"><input value={form.drive_folder_url} onChange={e => set("drive_folder_url", e.target.value)} className={inputCls} style={inputStyle} placeholder="https://drive.google.com/..." /></Field>
          </div>
          <div className="grid md:grid-cols-3 gap-4 pt-2">
            <Field label="Fotografías del proyecto">
              <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer text-sm" style={{ background: "#0d0d0d", border: "1px dashed #444", color: "#888" }}>
                {uploading === "profile_images" ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                {form.profile_images ? "Subido ✓" : "Subir fotos"}
                <input type="file" accept="image/*" multiple className="hidden" onChange={async (e) => {
                  const files = Array.from(e.target.files);
                  if (!files.length) return;
                  setUploading("profile_images");
                  try {
                    const urls = await Promise.all(files.map(f => base44.integrations.Core.UploadFile({ file: f })));
                    set("profile_images", urls.map(u => u.file_url).join(", "));
                  } catch { alert("Error al subir fotos"); }
                  finally { setUploading(null); }
                }} />
              </label>
            </Field>
            <Field label="Dossier / Press kit (opcional)">
              <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer text-sm" style={{ background: "#0d0d0d", border: "1px dashed #444", color: "#888" }}>
                {uploading === "press_kit_file" ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                {form.press_kit_file ? "Subido ✓" : "Subir archivo"}
                <input type="file" className="hidden" onChange={e => e.target.files[0] && uploadFile("press_kit_file", e.target.files[0])} />
              </label>
            </Field>
            <Field label="Rider técnico (opcional)">
              <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer text-sm" style={{ background: "#0d0d0d", border: "1px dashed #444", color: "#888" }}>
                {uploading === "technical_rider_file" ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                {form.technical_rider_file ? "Subido ✓" : "Subir archivo"}
                <input type="file" className="hidden" onChange={e => e.target.files[0] && uploadFile("technical_rider_file", e.target.files[0])} />
              </label>
            </Field>
          </div>
        </div>
      )}

      {/* Step 3: Técnico */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Información técnica</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { k: "owns_instruments", l: "¿Cuentan con instrumentos propios?" },
              { k: "owns_microphones", l: "¿Cuentan con micrófonos?" },
              { k: "owns_amplifiers", l: "¿Cuentan con amplificadores?" },
              { k: "owns_console", l: "¿Cuentan con consola propia?" },
              { k: "owns_controller", l: "¿Cuentan con computadora o controladora?" },
              { k: "has_sound_engineer", l: "¿Cuentan con operador de sonido?" },
              { k: "needs_technical_assistance", l: "¿Necesitan asistencia técnica del espacio?" },
            ].map(({ k, l }) => (
              <Field key={k} label={l}>
                <select value={form[k]} onChange={e => set(k, e.target.value)} className={inputCls} style={inputStyle}>
                  <option value="">Seleccionar...</option>
                  {YES_NO_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Cantidad de micrófonos necesarios"><input type="number" value={form.required_microphones} onChange={e => set("required_microphones", e.target.value ? Number(e.target.value) : "")} className={inputCls} style={inputStyle} /></Field>
            <Field label="Cantidad de entradas de audio necesarias"><input type="number" value={form.required_audio_inputs} onChange={e => set("required_audio_inputs", e.target.value ? Number(e.target.value) : "")} className={inputCls} style={inputStyle} /></Field>
            <Field label="Tipo de conexiones utilizadas"><input value={form.connection_type} onChange={e => set("connection_type", e.target.value)} className={inputCls} style={inputStyle} placeholder="Ej: XLR, Jack, RCA..." /></Field>
            <Field label="Espacio aproximado en escenario"><input value={form.stage_space} onChange={e => set("stage_space", e.target.value)} className={inputCls} style={inputStyle} placeholder="Ej: 3x4 metros" /></Field>
            <Field label="Tiempo estimado de armado"><input value={form.setup_time} onChange={e => set("setup_time", e.target.value)} className={inputCls} style={inputStyle} placeholder="Ej: 30 minutos" /></Field>
            <Field label="Tiempo estimado de prueba de sonido"><input value={form.soundcheck_time} onChange={e => set("soundcheck_time", e.target.value)} className={inputCls} style={inputStyle} placeholder="Ej: 20 minutos" /></Field>
          </div>
          <Field label="Descripción de necesidades técnicas especiales">
            <textarea value={form.technical_requirements} onChange={e => set("technical_requirements", e.target.value)} rows={3} className={inputCls + " resize-none"} style={inputStyle} maxLength={3000} />
          </Field>
        </div>
      )}

      {/* Step 4: Disponibilidad */}
      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Disponibilidad</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Viernes disponibles"><input value={form.available_dates} onChange={e => set("available_dates", e.target.value)} className={inputCls} style={inputStyle} placeholder="Ej: Todos los viernes / 5, 12, 19 de Julio" /></Field>
            <Field label="Horario aproximado disponible"><input value={form.available_time} onChange={e => set("available_time", e.target.value)} className={inputCls} style={inputStyle} placeholder="Ej: 21:00 a 02:00" /></Field>
            <Field label="¿Restricciones de fechas?"><input value={form.date_restrictions} onChange={e => set("date_restrictions", e.target.value)} className={inputCls} style={inputStyle} /></Field>
            <Field label="¿Con cuánta anticipación necesitan confirmar?"><input value={form.confirmation_notice} onChange={e => set("confirmation_notice", e.target.value)} className={inputCls} style={inputStyle} placeholder="Ej: 2 semanas" /></Field>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.has_transport} onChange={e => set("has_transport", e.target.checked)} className="w-4 h-4 accent-red-500" />
              <span className="text-sm text-gray-300">¿Pueden trasladarse al establecimiento por sus propios medios?</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.available_soundcheck} onChange={e => set("available_soundcheck", e.target.checked)} className="w-4 h-4 accent-red-500" />
              <span className="text-sm text-gray-300">¿Disponibles para realizar prueba de sonido previa?</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.promotional_availability} onChange={e => set("promotional_availability", e.target.checked)} className="w-4 h-4 accent-red-500" />
              <span className="text-sm text-gray-300">¿Disponibles para participar en acciones promocionales?</span>
            </label>
          </div>
        </div>
      )}

      {/* Step 5: Difusión */}
      {step === 5 && (
        <div className="space-y-4">
          <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Difusión y convocatoria</h3>
          <p className="text-xs text-gray-500 mb-4">La cantidad de seguidores no es un criterio excluyente.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Cantidad aproximada de seguidores en redes"><input value={form.social_followers} onChange={e => set("social_followers", e.target.value)} className={inputCls} style={inputStyle} placeholder="Ej: 500-1000" /></Field>
            <Field label="Promedio estimado de público que podría acompañar"><input type="number" value={form.estimated_audience} onChange={e => set("estimated_audience", e.target.value ? Number(e.target.value) : "")} className={inputCls} style={inputStyle} /></Field>
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.willing_to_promote} onChange={e => set("willing_to_promote", e.target.checked)} className="w-4 h-4 accent-red-500" />
              <span className="text-sm text-gray-300">¿Dispuestos a promocionar la fecha en sus redes?</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.can_generate_content} onChange={e => set("can_generate_content", e.target.checked)} className="w-4 h-4 accent-red-500" />
              <span className="text-sm text-gray-300">¿Pueden generar contenido previo al evento?</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.authorizes_media_use} onChange={e => set("authorizes_media_use", e.target.checked)} className="w-4 h-4 accent-red-500" />
              <span className="text-sm text-gray-300">¿Autorizan a Pacha Disco a utilizar imágenes y fragmentos audiovisuales de la presentación para difusión?</span>
            </label>
          </div>
          <Field label="Breve explicación de cómo promocionarían su participación">
            <textarea value={form.promotion_plan} onChange={e => set("promotion_plan", e.target.value)} rows={3} className={inputCls + " resize-none"} style={inputStyle} maxLength={2000} />
          </Field>
        </div>
      )}

      {/* Step 6: Motivación */}
      {step === 6 && (
        <div className="space-y-4">
          <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Motivación</h3>
          <Field label="¿Por qué te gustaría presentarte en Escape Bar?">
            <textarea value={form.motivation} onChange={e => set("motivation", e.target.value)} rows={3} className={inputCls + " resize-none"} style={inputStyle} maxLength={3000} />
          </Field>
          <Field label="¿Qué diferencia a tu propuesta musical?">
            <textarea value={form.project_differential} onChange={e => set("project_differential", e.target.value)} rows={3} className={inputCls + " resize-none"} style={inputStyle} maxLength={2000} />
          </Field>
          <Field label="¿Qué experiencia te gustaría generar en el público?">
            <textarea value={form.expected_experience} onChange={e => set("expected_experience", e.target.value)} rows={3} className={inputCls + " resize-none"} style={inputStyle} maxLength={2000} />
          </Field>
          <Field label="¿Hay algo más que debamos conocer sobre el proyecto?">
            <textarea value={form.additional_info} onChange={e => set("additional_info", e.target.value)} rows={3} className={inputCls + " resize-none"} style={inputStyle} maxLength={3000} />
          </Field>
        </div>
      )}

      {/* Step 7: Condiciones */}
      {step === 7 && (
        <div className="space-y-4">
          <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Condiciones y aceptación</h3>
          <p className="text-xs text-gray-500 mb-2">Todas las casillas son obligatorias para enviar la postulación.</p>
          <div className="space-y-3">
            {[
              { k: "accepted_terms_truthful", l: "Confirmo que la información proporcionada es verdadera." },
              { k: "accepted_no_guarantee", l: "Comprendo que completar el formulario no garantiza una fecha." },
              { k: "accepted_contact", l: "Autorizo al equipo de Pacha Disco a contactarme mediante correo electrónico o WhatsApp." },
              { k: "accepted_material_use", l: "Acepto que el material enviado sea utilizado únicamente para evaluar la propuesta." },
              { k: "accepted_members_auth", l: "Declaro tener autorización de los integrantes del proyecto para realizar esta postulación." },
              { k: "accepted_bases", l: "He leído y acepto las bases de la convocatoria." },
            ].map(({ k, l }) => (
              <label key={k} className="flex items-start gap-3 cursor-pointer p-3 rounded-lg" style={{ background: form[k] ? "rgba(34,197,94,0.05)" : "transparent", border: `1px solid ${errors[k] ? "#ef4444" : "#2a2a2a"}` }}>
                <input type="checkbox" checked={form[k]} onChange={e => set(k, e.target.checked)} className="w-4 h-4 mt-0.5 accent-red-500 shrink-0" />
                <span className="text-sm text-gray-300">{l}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: "1px solid #1a1a1a" }}>
        <button onClick={back} disabled={step === 0}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors disabled:opacity-30"
          style={{ border: "1px solid #2a2a2a" }}>
          <ChevronLeft size={16} /> Atrás
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={next}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-all"
            style={{ background: "#FF0000" }}>
            Continuar <ChevronRight size={16} />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-all"
            style={{ background: submitting ? "#333" : "linear-gradient(135deg, #FF0000, #CC0000)" }}>
            {submitting ? <><Loader2 size={16} className="animate-spin" /> Enviando...</> : <><Check size={16} /> ENVIAR POSTULACIÓN</>}
          </button>
        )}
      </div>
    </div>
  );
}