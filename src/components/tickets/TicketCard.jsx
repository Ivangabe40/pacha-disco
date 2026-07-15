import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Ticket as TicketIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function TicketCard({ ticket, index }) {
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    QRCode.toDataURL(ticket.ticket_code, {
      width: 200,
      margin: 1,
      color: { dark: "#000000", light: "#ffffff" },
    }).then(setQrDataUrl);
  }, [ticket.ticket_code]);

  const eventDate = ticket.event_date
    ? format(new Date(ticket.event_date), "EEEE d 'de' MMMM yyyy · HH:mm", { locale: es })
    : "";

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#111", border: "1px solid #2a2a2a" }}>
      <div className="px-5 py-4 flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, #75AADB 0%, #4A8BC2 100%)" }}>
        <div className="flex items-center gap-2">
          <TicketIcon size={18} className="text-white" />
          <span className="text-white font-bold text-sm">Entrada #{index + 1}</span>
        </div>
        <span className="text-white/80 text-xs uppercase tracking-wider">Confirmada</span>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Evento</p>
          <p className="text-white font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
            {ticket.event_title}
          </p>
          {eventDate && <p className="text-gray-400 text-sm mt-1 capitalize">{eventDate}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Titular</p>
            <p className="text-white text-sm font-medium">{ticket.buyer_name}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Tipo</p>
            <p className="text-white text-sm font-medium capitalize">{ticket.ticket_type}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 pt-2">
          {qrDataUrl && (
            <div className="p-3 rounded-xl bg-white">
              <img src={qrDataUrl} alt="QR" className="w-32 h-32" />
            </div>
          )}
          <div className="text-center">
            <p className="text-white font-bold font-mono tracking-widest text-base">{ticket.ticket_code}</p>
            <p className="text-gray-600 text-xs mt-1">Presentá este código en la entrada</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 text-center" style={{ background: "#0d0d0d", borderTop: "1px solid #1a1a1a" }}>
        <p className="text-gray-600 text-xs">Pachá Night Club · Solo para mayores de edad</p>
      </div>
    </div>
  );
}