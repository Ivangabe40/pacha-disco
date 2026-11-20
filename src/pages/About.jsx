import { base44 } from '@/api/base44Client';
import { trackConversion } from "@/lib/adsConversion";

const LOGO_GOLD = "https://media.base44.com/images/public/69ad4033370fdc9f9fe8b117/dbb6d658e_pacha-logo-nuevo.png";

export default function About() {
  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      {/* Hero */}
      <div className="relative py-20 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(201,168,76,0.07) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <img src={LOGO_GOLD} alt="Pachá" className="h-44 w-44 mx-auto mb-8 rounded-full object-cover"
            style={{ filter: "drop-shadow(0 0 20px rgba(255,0,0,0.7)) drop-shadow(0 0 50px rgba(255,0,0,0.4))" }} />
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Nuestra Historia
          </h1>
          <div className="w-24 h-px mx-auto mb-8" style={{ background: "linear-gradient(to right, transparent, #C9A84C, transparent)" }}></div>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
            Pacha Disco es una discoteca independiente de Corral de Bustos, Córdoba. Un espacio de encuentro para compartir música, eventos y noches especiales.
          </p>
          <p className="text-gray-400 text-base leading-relaxed mb-4">
            La propuesta musical recorre distintos géneros, entre ellos reggaetón, electrónica, pop, cumbia y grandes clásicos. La programación se comunica a través de nuestros canales oficiales y de la sección Eventos.
          </p>
          <p className="text-gray-400 text-base leading-relaxed mb-4">
            Pacha Disco abre habitualmente los sábados y está dirigido a mayores de 25 años. Los artistas y DJs de cada fecha se anuncian en la información del evento correspondiente.
          </p>
          <p className="text-gray-400 text-base leading-relaxed">
            Además de su programación habitual, Escape Experience by Pacha presenta una propuesta para cumpleaños, graduaciones, aniversarios, eventos empresariales, fiestas privadas y celebraciones especiales. Las consultas y presupuestos se realizan por WhatsApp.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 pb-24">
        <div className="max-w-3xl mx-auto mb-16 text-center rounded-2xl p-8 md:p-10"
          style={{ background: "#111", border: "1px solid #222" }}>
          <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: "#C9A84C" }}>
            Nuestra trayectoria
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            23 años de historia
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Una historia construida en Corral de Bustos a través de la música, los encuentros y las noches compartidas.
            La programación actual se anuncia en la sección Eventos.
          </p>
        </div>

        {/* Map */}
        <div className="mb-10 rounded-2xl overflow-hidden" style={{ border: "1px solid #222" }}>
          <div className="px-6 pt-6 pb-4" style={{ background: "#111" }}>
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>¿Dónde estamos?</h2>
            <p className="text-gray-500 text-sm mt-1">Encontranos en Google Maps</p>
          </div>
          <div className="relative w-full" style={{ height: "250px" }}>
            <iframe
              title="Ubicación Pachá"
              src="https://www.google.com/maps?q=Av.+Italia+378,+Corral+de+Bustos,+C%C3%B3rdoba,+Argentina&hl=es&z=16&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) saturate(0.8)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="px-6 py-4 flex items-center justify-between" style={{ background: "#111" }}>
            <span className="text-gray-500 text-sm">Pacha Disco · Av. Italia 378 · Corral de Bustos</span>
            <a href="https://maps.app.goo.gl/outiaSZFTh14BhGK8" target="_blank" rel="noopener noreferrer"
              onClick={() => trackConversion("como_llegar")}
              className="text-xs font-semibold px-4 py-2 rounded-lg transition-all"
              style={{ background: "rgba(255,0,0,0.15)", border: "1px solid rgba(255,0,0,0.35)", color: "#FF0000" }}>
              Abrir en Maps →
            </a>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center p-6 md:p-10 rounded-2xl" style={{ background: "#111", border: "1px solid #222" }}>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Contacto</h2>
          <p className="text-gray-400 mb-6">Para consultas generales y presupuestos de Escape Experience:</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://www.instagram.com/pachaoficialok" target="_blank" rel="noopener noreferrer"
             className="px-8 py-3 rounded-xl font-semibold text-sm tracking-wider uppercase"
             style={{ border: "1px solid #C9A84C", color: "#C9A84C" }}>
             @pachaoficialok
            </a>
            <a href="https://wa.me/5493468546935" target="_blank" rel="noopener noreferrer"
            onClick={() => trackConversion("contacto")}
            className="px-8 py-3 rounded-xl font-semibold text-sm tracking-wider uppercase"
            style={{ border: "1px solid #25D366", color: "#25D366" }}>
            WhatsApp
            </a>
            <a href={base44.agents.getWhatsAppConnectURL('pacha_assistant')} target="_blank" rel="noopener noreferrer"
            className="px-8 py-3 rounded-xl font-semibold text-sm tracking-wider uppercase flex items-center gap-2 justify-center"
            style={{ background: "linear-gradient(135deg, #25D366, #128C7E)", color: "#fff" }}>
             💬 Asistente IA
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}