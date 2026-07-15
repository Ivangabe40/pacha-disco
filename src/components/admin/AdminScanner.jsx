import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Html5Qrcode } from "html5-qrcode";
import { CheckCircle, XCircle, ScanLine, RefreshCw, User, Calendar, Hash } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AdminScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null); // { ticket, status: "valid"|"used"|"not_found" }
  const [loading, setLoading] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);

  const stopScanner = async () => {
    if (html5QrRef.current) {
      try { await html5QrRef.current.stop(); } catch {}
      html5QrRef.current = null;
    }
    setScanning(false);
  };

  const startScanner = async () => {
    setResult(null);
    setScanning(true);
    await new Promise(r => setTimeout(r, 100));
    const html5Qr = new Html5Qrcode("qr-scanner-div");
    html5QrRef.current = html5Qr;
    try {
      await html5Qr.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (code) => {
          await stopScanner();
          await validateCode(code);
        },
        () => {}
      );
    } catch (err) {
      setScanning(false);
    }
  };

  useEffect(() => () => { stopScanner(); }, []);

  const validateCode = async (code) => {
    setLoading(true);
    setResult(null);
    try {
      const tickets = await base44.entities.Ticket.filter({ ticket_code: code });
      if (tickets.length === 0) {
        setResult({ status: "not_found", code });
        return;
      }
      const ticket = tickets[0];
      if (ticket.status === "usado") {
        setResult({ status: "used", ticket });
      } else {
        await base44.entities.Ticket.update(ticket.id, { status: "usado" });
        setResult({ status: "valid", ticket: { ...ticket, status: "usado" } });
      }
    } catch {
      setResult({ status: "not_found", code });
    } finally {
      setLoading(false);
    }
  };

  const handleManual = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      validateCode(manualCode.trim().toUpperCase());
      setManualCode("");
    }
  };

  const reset = () => {
    setResult(null);
    setManualCode("");
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(116,172,223,0.15)", border: "1px solid rgba(116,172,223,0.3)" }}>
          <ScanLine size={18} style={{ color: "#75AADB" }} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Escáner de Entradas</h2>
          <p className="text-gray-500 text-xs">Escaneá el QR en la puerta para validar</p>
        </div>
      </div>

      {/* Resultado */}
      {result && (
        <div className="rounded-2xl overflow-hidden" style={{
          border: `1px solid ${result.status === "valid" ? "#22c55e" : result.status === "used" ? "#f59e0b" : "#75AADB"}`,
          background: result.status === "valid" ? "rgba(34,197,94,0.05)" : result.status === "used" ? "rgba(245,158,11,0.05)" : "rgba(116,172,223,0.05)"
        }}>
          <div className="p-5 flex items-start gap-4">
            {result.status === "valid" && <CheckCircle size={40} className="flex-shrink-0 mt-1" style={{ color: "#22c55e" }} />}
            {result.status === "used" && <XCircle size={40} className="flex-shrink-0 mt-1" style={{ color: "#f59e0b" }} />}
            {result.status === "not_found" && <XCircle size={40} className="flex-shrink-0 mt-1" style={{ color: "#75AADB" }} />}

            <div className="flex-1">
              {result.status === "valid" && (
                <>
                  <p className="font-bold text-green-400 text-lg">✓ ENTRADA VÁLIDA</p>
                  <p className="text-gray-400 text-xs mb-3">Acceso habilitado. Ticket marcado como usado.</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-white">
                      <User size={13} className="text-gray-500" /> {result.ticket.buyer_name}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Calendar size={13} className="text-gray-500" /> {result.ticket.event_title}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Hash size={13} className="text-gray-500" /> {result.ticket.ticket_code} · {result.ticket.quantity} {result.ticket.quantity > 1 ? "entradas" : "entrada"}
                    </div>
                    <span className="inline-block text-xs px-2 py-1 rounded-full font-semibold capitalize"
                      style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C" }}>
                      {result.ticket.ticket_type}
                    </span>
                  </div>
                </>
              )}
              {result.status === "used" && (
                <>
                  <p className="font-bold text-yellow-400 text-lg">⚠ ENTRADA YA USADA</p>
                  <p className="text-gray-400 text-xs mb-3">Esta entrada ya fue escaneada anteriormente.</p>
                  <div className="space-y-1">
                    <p className="text-sm text-white">{result.ticket.buyer_name}</p>
                    <p className="text-sm text-gray-400">{result.ticket.event_title}</p>
                    <p className="text-sm text-gray-500 font-mono">{result.ticket.ticket_code}</p>
                  </div>
                </>
              )}
              {result.status === "not_found" && (
                <>
                  <p className="font-bold text-red-400 text-lg">✗ CÓDIGO INVÁLIDO</p>
                  <p className="text-gray-400 text-xs">No se encontró ninguna entrada con el código:</p>
                  <p className="text-white font-mono mt-1">{result.code}</p>
                </>
              )}
            </div>
          </div>
          <div className="px-5 pb-4">
            <button onClick={reset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: "#1a1a1a", border: "1px solid #333" }}>
              <RefreshCw size={13} /> Escanear otra
            </button>
          </div>
        </div>
      )}

      {/* Cámara */}
      {!result && (
        <div className="rounded-2xl overflow-hidden" style={{ background: "#111", border: "1px solid #222" }}>
          {scanning ? (
            <div>
              <div id="qr-scanner-div" className="w-full" />
              <div className="p-4 text-center">
                <button onClick={stopScanner} className="text-gray-500 hover:text-white text-sm transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(116,172,223,0.1)", border: "2px dashed rgba(116,172,223,0.3)" }}>
                <ScanLine size={36} style={{ color: "#75AADB" }} />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold mb-1">Escáner QR</p>
                <p className="text-gray-500 text-sm">Usá la cámara del móvil para escanear el QR de la entrada</p>
              </div>
              <button onClick={startScanner}
                className="px-8 py-3 rounded-xl font-bold text-white text-sm"
                style={{ background: "linear-gradient(135deg, #75AADB 0%, #ff1a35 100%)" }}>
                Abrir Cámara
              </button>
            </div>
          )}
        </div>
      )}

      {/* Ingreso manual */}
      {!result && !scanning && (
        <div className="rounded-2xl p-5 space-y-3" style={{ background: "#111", border: "1px solid #222" }}>
          <p className="text-gray-400 text-sm font-medium">O ingresá el código manualmente</p>
          <form onSubmit={handleManual} className="flex gap-2">
            <input
              value={manualCode}
              onChange={e => setManualCode(e.target.value.toUpperCase())}
              placeholder="PCH-XXXXXX"
              className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-mono outline-none"
              style={{ background: "#1a1a1a", border: "1px solid #333" }}
            />
            <button type="submit" disabled={loading || !manualCode.trim()}
              className="px-4 py-2.5 rounded-xl text-white text-sm font-bold"
              style={{ background: "#75AADB", opacity: !manualCode.trim() ? 0.5 : 1 }}>
              {loading ? "..." : "Validar"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}