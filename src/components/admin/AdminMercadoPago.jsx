import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Check, ExternalLink, CreditCard } from "lucide-react";

export default function AdminMercadoPago() {
  const [config, setConfig] = useState(null);
  const [link, setLink] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    base44.entities.SiteConfig.filter({ key: "mp_link" }).then(data => {
      if (data.length > 0) {
        setConfig(data[0]);
        setLink(data[0].value);
      }
    });
  }, []);

  const save = async () => {
    if (!link.trim()) return;
    setSaving(true);
    if (config) {
      await base44.entities.SiteConfig.update(config.id, { key: "mp_link", value: link.trim() });
    } else {
      const created = await base44.entities.SiteConfig.create({ key: "mp_link", value: link.trim() });
      setConfig(created);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(0,158,227,0.15)", border: "1px solid rgba(0,158,227,0.3)" }}>
          <CreditCard size={18} style={{ color: "#009ee3" }} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>MercadoPago</h2>
          <p className="text-gray-500 text-xs">Link de pago global para entradas anticipadas</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl space-y-5" style={{ background: "#111", border: "1px solid #222" }}>
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Link de pago de MercadoPago</label>
          <input
            value={link}
            onChange={e => setLink(e.target.value)}
            placeholder="https://mpago.la/..."
            className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
            style={{ background: "#1a1a1a", border: "1px solid #333" }}
          />
          <p className="text-gray-600 text-xs mt-2">
            Creá tu link en <a href="https://www.mercadopago.com.ar/tools/create" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#009ee3" }}>MercadoPago → Cobrar → Link de pago</a>. El sistema abre el link con el monto calculado automáticamente.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={save} disabled={saving || !link.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all"
            style={{ background: saved ? "#22c55e" : "#009ee3", opacity: !link.trim() ? 0.5 : 1 }}>
            <Check size={15} />
            {saving ? "Guardando..." : saved ? "¡Guardado!" : "Guardar link"}
          </button>
          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors">
              <ExternalLink size={13} /> Probar link
            </a>
          )}
        </div>
      </div>

      <div className="mt-4 p-4 rounded-xl text-xs text-gray-500 space-y-1" style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}>
        <p className="font-semibold text-gray-400">¿Cómo funciona?</p>
        <p>1. El usuario elige evento, cantidad de entradas y completa sus datos.</p>
        <p>2. El sistema registra el pedido y abre tu link de MercadoPago.</p>
        <p>3. El cliente paga en MP y recibe su código de entrada por email.</p>
      </div>
    </div>
  );
}