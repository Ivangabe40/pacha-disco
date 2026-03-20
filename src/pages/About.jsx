const LOGO_GOLD = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_69abf6aff758a16386edeb04/71fcb4c4f_IMG-20260121-WA0030.jpg";

export default function About() {
  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      {/* Hero */}
      <div className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(201,168,76,0.07) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <img src={LOGO_GOLD} alt="Pachá" className="h-20 mx-auto mb-8 object-contain" />
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Nuestra Historia
          </h1>
          <div className="w-24 h-px mx-auto mb-8" style={{ background: "linear-gradient(to right, transparent, #C9A84C, transparent)" }}></div>
          <p className="text-gray-300 text-lg leading-relaxed">
            Pachá es más que un club. Es una experiencia. Desde sus puertas hasta la pista, cada detalle está diseñado para crear noches que no se olvidan.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 pb-24">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Club Premium
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Un espacio de encuentro para los amantes de la buena música. Multigenero, sin fronteras, donde conviven el reggaeton, la electrónica, el pop y los clásicos.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Nuestro equipo de sound system de última generación y una iluminación de espectáculo crean el ambiente perfecto para que la noche se viva al máximo.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { label: "Capacidad", value: "500+ personas" },
              { label: "Sistema de sonido", value: "D&B Audiotechnik" },
              { label: "DJs residentes", value: "Roster exclusivo" },
              { label: "Dress code", value: "Elegante informal" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: "#111", border: "1px solid #222" }}>
                <span className="text-gray-500 text-sm uppercase tracking-wider">{item.label}</span>
                <span className="text-white font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="text-center p-10 rounded-2xl" style={{ background: "#111", border: "1px solid #222" }}>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Contacto</h2>
          <p className="text-gray-400 mb-6">Para reservas VIP, eventos privados o prensa:</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:damianrodriguez432@gmail.com"
             className="px-8 py-3 rounded-xl font-semibold text-sm tracking-wider uppercase"
             style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#0A0A0A" }}>
             damianrodriguez432@gmail.com
            </a>
            <a href="https://www.instagram.com/pachaoficialok" target="_blank" rel="noopener noreferrer"
              className="px-8 py-3 rounded-xl font-semibold text-sm tracking-wider uppercase"
              style={{ border: "1px solid #C9A84C", color: "#C9A84C" }}>
              @pacha.oficial
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}