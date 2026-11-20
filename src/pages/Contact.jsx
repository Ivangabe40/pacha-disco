import { Instagram, MessageCircle, Mail, MapPin } from "lucide-react";
import { trackConversion } from "@/lib/adsConversion";

export default function Contact() {
  return (
    <div className="min-h-screen py-12 md:py-20 px-4" style={{ background: "#070707", color: "#F0EBE3" }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "#FF0000" }}>
          Contacto
        </h1>
        <p className="text-gray-400 mb-10 text-lg">
          ¿Tenés consultas o querés contactarnos? Escribinos.
        </p>

        <div className="flex flex-col gap-4">
          <a href="mailto:contacto@pachadisco.com.ar" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
            <Mail size={18} className="text-red-500" /> contacto@pachadisco.com.ar
          </a>
          <a href="https://wa.me/5493468546935" target="_blank" rel="noopener noreferrer"
            onClick={() => trackConversion("contacto")}
            className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
            <MessageCircle size={18} className="text-green-500" /> WhatsApp: +54 9 3468 546935
          </a>
          <a href="https://www.instagram.com/pachaoficialok" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
            <Instagram size={18} className="text-pink-500" /> @pachaoficialok
          </a>
          <a href="https://maps.app.goo.gl/outiaSZFTh14BhGK8" target="_blank" rel="noopener noreferrer"
            onClick={() => trackConversion("como_llegar")}
            className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
            <MapPin size={18} className="text-yellow-500" /> Ver ubicación en Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}