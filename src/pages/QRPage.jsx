import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Download, ExternalLink } from "lucide-react";

const APP_URL = "https://pachadisco.base44.app/";
const LOGO_RED = "https://media.base44.com/images/public/69ad4033370fdc9f9fe8b117/7c4e34300_1783489304034.png";

export default function QRPage() {
  const [qrDataUrl, setQrDataUrl] = useState(null);

  useEffect(() => {
    QRCode.toDataURL(APP_URL, {
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
    link.download = "pacha-qr.png";
    link.click();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "#070707" }}>
      <div className="max-w-sm w-full text-center">
        {/* Logo */}
        <img src={LOGO_RED} alt="Pachá" className="h-14 w-auto object-contain mx-auto mb-6"
          style={{ filter: "drop-shadow(0 0 12px rgba(116,172,223,0.5))" }} />

        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "#75AADB" }}>
          Escaneá para entrar
        </p>
        <h1 className="text-2xl font-black text-white uppercase mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
          Pachá Night Club
        </h1>

        {/* QR */}
        <div className="relative inline-block p-5 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #0f0f0f, #1a1010)",
            border: "1px solid rgba(116,172,223,0.25)",
            boxShadow: "0 0 50px rgba(116,172,223,0.15)",
          }}>
          {qrDataUrl ? (
            <div className="relative">
              <img src={qrDataUrl} alt="QR Pachá" className="w-64 h-64 object-contain rounded-lg" />
              {/* Logo overlay center */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="rounded-lg overflow-hidden" style={{ background: "#F0EBE3", padding: 6 }}>
                  <img src={LOGO_RED} alt="Pachá" className="h-12 w-auto object-contain" />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-64 h-64 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full animate-spin"
                style={{ border: "2px solid #1a1a1a", borderTop: "2px solid #75AADB" }} />
            </div>
          )}
        </div>

        <p className="text-gray-500 text-sm mt-5 mb-6">{APP_URL}</p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button onClick={handleDownload}
            className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
            style={{
              background: "linear-gradient(135deg, #75AADB 0%, #ff1a35 50%, #75AADB 100%)",
              color: "#fff",
            }}>
            <Download size={16} /> Descargar QR
          </button>
          <a href={APP_URL} target="_blank" rel="noopener noreferrer"
            className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
            style={{
              background: "transparent",
              color: "#C9A84C",
              border: "1px solid rgba(201,168,76,0.4)",
            }}>
            <ExternalLink size={16} /> Abrir sitio
          </a>
        </div>
      </div>
    </div>
  );
}