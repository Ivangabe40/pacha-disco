import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ShieldOff, Settings, Save, Check, Instagram, Facebook, MessageCircle, Palette, Building2, Loader2 } from "lucide-react";

const CONFIG_DEFAULTS = {
  club_name: "",
  social_instagram: "",
  social_facebook: "",
  social_tiktok: "",
  social_whatsapp: "",
  show_home_video: "true",
  show_escape_bar: "true",
  show_newsletter: "true",
};

export default function Configuracion() {
  const [configMap, setConfigMap] = useState({});
  const [form, setForm] = useState(CONFIG_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setAuthLoading(false);
    }).catch(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    if (user?.role !== "admin") return;
    base44.entities.SiteConfig.list().then(data => {
      const map = {};
      data.forEach(item => { map[item.key] = item; });
      setConfigMap(map);
      const values = { ...CONFIG_DEFAULTS };
      Object.keys(CONFIG_DEFAULTS).forEach(key => {
        if (map[key]) values[key] = map[key].value;
      });
      setForm(values);
      setLoading(false);
    });
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    for (const key of Object.keys(form)) {
      const existing = configMap[key];
      const value = form[key];
      if (existing && existing.value === value) continue;
      if (existing) {
        await base44.entities.SiteConfig.update(existing.id, { key, value });
      } else {
        const created = await base44.entities.SiteConfig.create({ key, value });
        configMap[key] = created;
      }
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#070707" }}>
      <div className="w-10 h-10 rounded-full animate-spin" style={{ border: "2px solid #1a1a1a", borderTop: "2px solid #75AADB" }} />
    </div>
  );

  if (!user || user.role !== "admin") return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4" style={{ background: "#070707" }}>
      <ShieldOff size={48} style={{ color: "#75AADB", opacity: 0.6 }} />
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Acceso Restringido</h2>
        <p className="text-gray-500 text-sm">Esta sección es solo para administradores.</p>
      </div>
      <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
        className="px-6 py-3 rounded-lg text-sm font-bold text-white" style={{ background: "#75AADB" }}>
        Iniciar Sesión
      </button>
    </div>
  );

  const inputStyle = { background: "#1a1a1a", border: "1px solid #333" };

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(116,170,219,0.15)", border: "1px solid rgba(116,170,219,0.3)" }}>
            <Settings size={18} style={{ color: "#75AADB" }} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Configuración del Sitio</h1>
            <p className="text-gray-500 text-xs">Ajustes generales, redes sociales y preferencias visuales</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-gray-600" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Club Info */}
            <Section icon={Building2} title="Información del Club" color="#75AADB">
              <Field label="Nombre del Club">
                <input value={form.club_name} onChange={e => setForm({ ...form, club_name: e.target.value })}
                  placeholder="Pachá Night Club"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none" style={inputStyle} />
              </Field>
            </Section>

            {/* Social Media */}
            <Section icon={Instagram} title="Redes Sociales" color="#C9A84C">
              <Field label="Instagram" icon={Instagram}>
                <input value={form.social_instagram} onChange={e => setForm({ ...form, social_instagram: e.target.value })}
                  placeholder="https://instagram.com/pachaoficialok"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none" style={inputStyle} />
              </Field>
              <Field label="Facebook" icon={Facebook}>
                <input value={form.social_facebook} onChange={e => setForm({ ...form, social_facebook: e.target.value })}
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none" style={inputStyle} />
              </Field>
              <Field label="TikTok" icon={MessageCircle}>
                <input value={form.social_tiktok} onChange={e => setForm({ ...form, social_tiktok: e.target.value })}
                  placeholder="https://tiktok.com/@..."
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none" style={inputStyle} />
              </Field>
              <Field label="WhatsApp (número con código de país)" icon={MessageCircle}>
                <input value={form.social_whatsapp} onChange={e => setForm({ ...form, social_whatsapp: e.target.value })}
                  placeholder="5493468546935"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none" style={inputStyle} />
              </Field>
            </Section>

            {/* Visual Preferences */}
            <Section icon={Palette} title="Preferencias Visuales" color="#75AADB">
              <Toggle label="Mostrar video en la página de inicio" description="Sección de video promocional"
                value={form.show_home_video === "true"}
                onChange={v => setForm({ ...form, show_home_video: v ? "true" : "false" })} />
              <Toggle label="Mostrar sección Escape Bar" description="Vista previa del bar en el inicio"
                value={form.show_escape_bar === "true"}
                onChange={v => setForm({ ...form, show_escape_bar: v ? "true" : "false" })} />
              <Toggle label="Mostrar formulario de newsletter" description="Suscripción al boletín"
                value={form.show_newsletter === "true"}
                onChange={v => setForm({ ...form, show_newsletter: v ? "true" : "false" })} />
            </Section>

            {/* Save button */}
            <div className="flex justify-end pt-2">
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold transition-all"
                style={{ background: saved ? "#22c55e" : "#75AADB", opacity: saving ? 0.7 : 1 }}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : <Save size={16} />}
                {saving ? "Guardando..." : saved ? "¡Guardado!" : "Guardar cambios"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, color, children }) {
  return (
    <div className="rounded-2xl p-5 md:p-6" style={{ background: "#111", border: "1px solid #222" }}>
      <div className="flex items-center gap-2.5 mb-5">
        <Icon size={18} style={{ color }} />
        <h2 className="text-white font-bold text-base" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />}
        <div className={Icon ? "pl-9" : ""}>{children}</div>
      </div>
    </div>
  );
}

function Toggle({ label, description, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <p className="text-sm text-white font-medium">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button onClick={() => onChange(!value)}
        className="w-11 h-6 rounded-full transition-all relative shrink-0"
        style={{ background: value ? "#75AADB" : "#2a2a2a" }}>
        <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all"
          style={{ transform: value ? "translateX(20px)" : "translateX(0)" }} />
      </button>
    </div>
  );
}