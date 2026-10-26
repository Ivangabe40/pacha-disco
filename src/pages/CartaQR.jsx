import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Download, ExternalLink } from "lucide-react";

const CARTA_URL = "https://pachadisco.base44.app/Menu";
const LOGO_RED = "https://media.base44.com/images/public/69ad4033370fdc9f9fe8b117/54165d896_file_0000000090c081f4a8b9ff606c8a8ed8.png";

export default function CartaQR() {
  const [qrDataUrl, setQrDataUrl] = useState(null);

  useEffect(() => {
    QRCode.toDataURL(CARTA_URL, {
      width: 600,
      margin: 2,
      color: { dark: "#070707", light: "#F0EBE3" },
      errorCorrectionLevel: "H",
    }).then(setQrDataUrl);
  }, []);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = "pacha-qr-carta.png";
    link.click();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "#070707" }}>
      <div className="max-w-sm w-full text-center">
        {/* Logo */}
        <img src={LOGO_RED} alt="Pachá" className="h-16 w-16 rounded-full object-cover mx-auto mb-6"
          style={{ filter: "drop-shadow(0 0 12px rgba(255,0,0,0.5))" }} />

        <p className="text-xs tracking-widest uppercase mb-1 font-condensed" style={{ color: "#FF0000" }}>
          Escaneá para ver la carta
        </p>
        <h1 className="text-2xl font-black text-white uppercase mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
          Carta de Tragos
        </h1>

        {/* QR */}
        <div className="relative inline-block p-5 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #0f0f0f, #1a1010)",
            border: "1px solid rgba(255,0,0,0.25)",
            boxShadow: "0 0 50px rgba(255,0,0,0.15)",
          }}>
          {qrDataUrl ? (
            <div className="relative">
              <img src={qrDataUrl} alt="QR Carta Pachá" className="w-64 h-64 object-contain rounded-lg" />
              {/* Logo overlay center */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="rounded-full overflow-hidden" style={{ background: "#F0EBE3", padding: 5 }}>
                  <img src={LOGO_RED} alt="Pachá" className="h-11 w-11 rounded-full object-cover" />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-64 h-64 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full animate-spin"
                style={{ border: "2px solid #1a1a1a", borderTop: "2px solid #FF0000" }} />
            </div>
          )}
        </div>

        <p className="text-gray-500 text-sm mt-5 mb-6 break-all">{CARTA_URL}</p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button onClick={handleDownload}
            className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
            style={{
              background: "linear-gradient(135deg, #FF0000 0%, #ff1a35 50%, #FF0000 100%)",
              color: "#fff",
            }}>
            <Download size={16} /> Descargar QR
          </button>
          <a href={CARTA_URL} target="_blank" rel="noopener noreferrer"
            className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
            style={{
              background: "transparent",
              color: "#C9A84C",
              border: "1px solid rgba(201,168,76,0.4)",
            }}>
            <ExternalLink size={16} /> Ver la carta
          </a>
        </div>
      </div>
    </div>
  );
}