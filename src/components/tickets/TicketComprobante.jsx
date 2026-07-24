import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const LOGO = "https://media.base44.com/images/public/69ad4033370fdc9f9fe8b117/6ecd577f7_file_00000000d89c820e8ae4cce82ce72506.png";

export default function TicketComprobante({ ticket, onClose }) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const comprobanteRef = useRef();

  useEffect(() => {
    QRCode.toDataURL(ticket.ticket_code, {
      width: 256,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    }).then(setQrDataUrl);
  }, [ticket.ticket_code]);

  const handleDownloadPDF = async () => {
    const el = comprobanteRef.current;
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#111111", useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width / 2, canvas.height / 2] });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save(`entrada-${ticket.ticket_code}.pdf`);
  };

  const eventDate = ticket.event_date
    ? format(new Date(ticket.event_date), "EEEE d 'de' MMMM yyyy · HH:mm", { locale: es })
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.92)" }}>
      <div className="w-full max-w-sm">
        {/* Botones de acción */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: "#FF0000" }}>
            <Download size={15} /> Descargar PDF
          </button>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-2">
            <X size={20} />
          </button>
        </div>

        {/* Comprobante visual */}
        <div ref={comprobanteRef} className="rounded-2xl overflow-hidden" style={{ background: "#111", border: "1px solid #2a2a2a" }}>
          {/* Header rojo */}
          <div className="px-6 py-5 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #FF0000 0%, #9B0013 100%)" }}>
            <img src={LOGO} alt="Pachá" className="h-12 object-contain rounded-full" />
            <div className="text-right">
              <p className="text-white/70 text-xs uppercase tracking-wider">Entrada</p>
              <p className="text-white font-bold text-sm capitalize">{ticket.ticket_type}</p>
            </div>
          </div>

          {/* Línea dentada */}
          <div className="flex items-center" style={{ margin: "0 -1px" }}>
            <div className="w-4 h-4 rounded-full -ml-2 flex-shrink-0" style={{ background: "#0a0a0a", border: "1px solid #2a2a2a" }} />
            <div className="flex-1 border-t border-dashed" style={{ borderColor: "#2a2a2a" }} />
            <div className="w-4 h-4 rounded-full -mr-2 flex-shrink-0" style={{ background: "#0a0a0a", border: "1px solid #2a2a2a" }} />
          </div>

          {/* Info evento */}
          <div className="px-6 py-5 space-y-4">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Evento</p>
              <p className="text-white font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>{ticket.event_title}</p>
              {eventDate && <p className="text-gray-400 text-sm mt-1 capitalize">{eventDate}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Titular</p>
                <p className="text-white text-sm font-medium">{ticket.buyer_name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Cantidad</p>
                <p className="text-white text-sm font-medium">{ticket.quantity} {ticket.quantity > 1 ? "entradas" : "entrada"}</p>
              </div>
              {ticket.total_amount > 0 && (
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total abonado</p>
                  <p className="font-bold text-sm" style={{ color: "#C9A84C" }}>${ticket.total_amount.toLocaleString()}</p>
                </div>
              )}
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Estado</p>
                <span className="text-xs px-2 py-1 rounded-full font-semibold"
                  style={ticket.status === "confirmado" || ticket.status === "usado"
                    ? { background: "rgba(34,197,94,0.15)", color: "#22c55e" }
                    : { background: "rgba(201,168,76,0.15)", color: "#C9A84C" }}>
                  {ticket.status === "confirmado" ? "✓ Confirmado" : ticket.status === "usado" ? "✓ Usado" : "Pendiente pago"}
                </span>
              </div>
            </div>
          </div>

          {/* Línea dentada */}
          <div className="flex items-center" style={{ margin: "0 -1px" }}>
            <div className="w-4 h-4 rounded-full -ml-2 flex-shrink-0" style={{ background: "#0a0a0a", border: "1px solid #2a2a2a" }} />
            <div className="flex-1 border-t border-dashed" style={{ borderColor: "#2a2a2a" }} />
            <div className="w-4 h-4 rounded-full -mr-2 flex-shrink-0" style={{ background: "#0a0a0a", border: "1px solid #2a2a2a" }} />
          </div>

          {/* QR */}
          <div className="px-6 py-6 flex flex-col items-center gap-3">
            {qrDataUrl && (
              <div className="p-3 rounded-xl bg-white">
                <img src={qrDataUrl} alt="QR" className="w-36 h-36" />
              </div>
            )}
            <div className="text-center">
              <p className="text-white font-bold font-mono tracking-widest text-lg">{ticket.ticket_code}</p>
              <p className="text-gray-600 text-xs mt-1">Presentá este código en la entrada</p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 text-center" style={{ background: "#0d0d0d", borderTop: "1px solid #1a1a1a" }}>
            <p className="text-gray-600 text-xs">Pachá Night Club · Solo para mayores de edad</p>
          </div>
        </div>
      </div>
    </div>
  );
}