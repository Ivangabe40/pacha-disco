import { useState, useEffect } from "react";
import { QrCode, ExternalLink, Copy, Check } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function MenuQR() {
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const menuUrl = `${window.location.origin}/${createPageUrl("Menu")}`;

  useEffect(() => {
    const url = encodeURIComponent(menuUrl);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${url}&color=E8001D&bgcolor=070707&format=png&qzone=2`);
  }, [menuUrl]);

  const copyLink = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 rounded-2xl" style={{ background: "#0f0f0f", border: "1px solid #1e1e1e" }}>
      <div className="flex items-center gap-3 mb-5">
        <QrCode size={18} style={{ color: "#E8001D" }} />
        <h3 className="text-white font-bold">QR de la Carta</h3>
      </div>

      <div className="flex flex-col items-center gap-5">
        {qrUrl && (
          <div className="p-3 rounded-xl" style={{ background: "#070707", border: "1px solid #2a2a2a" }}>
            <img src={qrUrl} alt="QR Carta" className="w-48 h-48 rounded-lg" />
          </div>
        )}

        <p className="text-gray-500 text-xs text-center leading-relaxed">
          Mostrá este QR en el local para que los clientes accedan directamente a la carta de tragos.
        </p>

        <div className="flex flex-col gap-2 w-full">
          <button onClick={copyLink}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-bold transition-all"
            style={{ background: "#1a1a1a", color: copied ? "#22c55e" : "#888", border: "1px solid #2a2a2a" }}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "¡Copiado!" : "Copiar enlace"}
          </button>
          <a href={menuUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-bold"
            style={{ background: "rgba(232,0,29,0.15)", color: "#E8001D", border: "1px solid rgba(232,0,29,0.3)" }}>
            <ExternalLink size={14} /> Ver Carta
          </a>
        </div>
      </div>
    </div>
  );
}