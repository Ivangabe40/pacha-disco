import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Mic, Music, Users, Headphones, Sparkles, Disc3, Radio, Volume2, ChevronRight, CheckCircle2, Instagram, ArrowRight } from "lucide-react";
import OpenStageForm from "@/components/openstage/OpenStageForm";

const HERO_IMG = "https://media.base44.com/images/public/69ad4033370fdc9f9fe8b117/e19167309_file_000000007dd0720eaf818bd4d5f39d02.png";

const ARTIST_CARDS = [
  { icon: Mic, label: "Solistas" },
  { icon: Music, label: "Bandas y grupos" },
  { icon: Users, label: "Dúos" },
  { icon: Disc3, label: "Cantantes" },
  { icon: Headphones, label: "DJs" },
  { icon: Sparkles, label: "Productores" },
  { icon: Volume2, label: "Instrumentistas" },
  { icon: Radio, label: "Proyectos acústicos" },
  { icon: Headphones, label: "Música electrónica" },
  { icon: Music, label: "Otros formatos" },
];

const STEPS = [
  { num: 1, title: "Completá el formulario", desc: "Contanos sobre tu proyecto, música y equipo." },
  { num: 2, title: "Compartinos tu música y redes", desc: "Links a Spotify, YouTube, Instagram y más." },
  { num: 3, title: "Nuestro equipo evalúa la propuesta", desc: "Revisamos estilo, necesidades y disponibilidad." },
  { num: 4, title: "Si tu proyecto es seleccionado, nos comunicamos", desc: "Coordinamos una fecha para tu presentación." },
];

export default function OpenStage() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Escape Open Stage | Tocá en Escape Bar by Pacha";
    const metaDesc = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (metaDesc) metaDesc.setAttribute("content", "Convocatoria abierta para músicos, bandas, DJs y artistas emergentes. Postulate para presentar tu proyecto los viernes en Escape Bar by Pacha.");
    if (ogTitle) ogTitle.setAttribute("content", "Escape Open Stage | Tocá en Escape Bar by Pacha");
    if (ogDesc) ogDesc.setAttribute("content", "Convocatoria abierta para músicos, bandas, DJs y artistas emergentes. Postulate para presentar tu proyecto los viernes en Escape Bar by Pacha.");
    if (ogImage) ogImage.setAttribute("content", HERO_IMG);
    return () => {
      document.title = "Pachá Night Club | Discoteca en Corral de Bustos, Córdoba";
      if (metaDesc) metaDesc.setAttribute("content", "Pachá es la discoteca más exclusiva de Corral de Bustos. Eventos, fiestas privadas, cumpleaños y entradas anticipadas. Solo para mayores de 18 años.");
      if (ogTitle) ogTitle.setAttribute("content", "Pachá Night Club | Discoteca en Corral de Bustos, Córdoba");
      if (ogDesc) ogDesc.setAttribute("content", "La discoteca más exclusiva de Corral de Bustos. Eventos, fiestas privadas, cumpleaños y entradas anticipadas. Solo para mayores de 18.");
      if (ogImage) ogImage.setAttribute("content", "https://media.base44.com/images/public/69ad4033370fdc9f9fe8b117/7c4e34300_1783489304034.png");
    };
  }, []);

  const scrollToForm = () => {
    setShowForm(true);
    setSubmitted(false);
    setTimeout(() => document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div style={{ background: "#070707", minHeight: "100vh" }}>
      {/* HERO */}
      <div className="relative overflow-hidden" style={{ minHeight: "70vh" }}>
        <img src={HERO_IMG} alt="Escape Open Stage" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(7,7,7,0.5) 0%, rgba(7,7,7,0.7) 60%, #070707 100%)" }} />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20 md:py-28" style={{ minHeight: "70vh" }}>
          <p className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: "#C9A84C" }}>Escape Bar by Pacha</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-3 uppercase" style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 4px 30px rgba(0,0,0,0.8)" }}>
            Escape<br />Open Stage
          </h1>
          <p className="text-lg md:text-2xl mb-6" style={{ color: "#E8C97A", fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
            Tu música. Nuestro escenario.
          </p>
          <p className="text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-8" style={{ color: "#bbb" }}>
            Escape Bar by Pacha abre su escenario a nuevos talentos. Si sos solista, formás parte de una banda, producís tu propia música o tenés un proyecto artístico que querés mostrar, queremos conocerte.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={scrollToForm}
              className="flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-black tracking-wider uppercase transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #75AADB, #4A8BC2)", color: "#fff", boxShadow: "0 4px 30px rgba(116,172,223,0.4)" }}>
              <Mic size={16} /> Postular mi proyecto
            </button>
            <a href="#info" className="flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-bold tracking-wider uppercase transition-all"
              style={{ background: "transparent", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.5)" }}>
              Conocer la convocatoria
            </a>
          </div>
        </div>
      </div>

      {/* FORM / CONFIRMATION */}
      {showForm && (
        <section id="formulario" className="max-w-3xl mx-auto px-4 py-12 md:py-16">
          {submitted ? (
            <div className="text-center py-12 rounded-2xl p-8" style={{ background: "#0d0d0d", border: "1px solid rgba(34,197,94,0.3)" }}>
              <CheckCircle2 size={64} className="mx-auto mb-6" style={{ color: "#22c55e" }} />
              <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>¡Recibimos tu propuesta!</h2>
              <p className="text-gray-400 leading-relaxed max-w-md mx-auto mb-8">
                Gracias por querer formar parte de Escape Open Stage.
                <br /><br />
                Nuestro equipo revisará tu material, necesidades técnicas y disponibilidad. Si encontramos una fecha o formato compatible con tu proyecto, nos comunicaremos por los datos proporcionados.
                <br /><br />
                Mientras tanto, seguí las redes de Pachá Disco y Escape Bar para conocer las próximas novedades.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="https://www.instagram.com/pachaoficialok" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #E1306C, #F77737)", color: "#fff" }}>
                  <Instagram size={16} /> Ver Instagram
                </a>
                <Link to={createPageUrl("EscapeBar")}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-colors"
                  style={{ background: "#1a1a1a", color: "#C9A84C", border: "1px solid #2a2a2a" }}>
                  Volver a Escape Bar <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Formulario de postulación</h2>
                <p className="text-sm text-gray-500">Completá todos los campos para que podamos evaluar tu proyecto.</p>
              </div>
              <OpenStageForm onSuccess={() => setSubmitted(true)} />
            </>
          )}
        </section>
      )}

      {/* BLOQUE 1 — Presentación */}
      <section id="info" className="max-w-4xl mx-auto px-4 py-12 md:py-20 text-center">
        <p className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: "#75AADB" }}>La convocatoria</p>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
          Escape Open Stage
        </h2>
        <div className="flex items-center gap-4 max-w-xs mx-auto mb-8">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, #C9A84C)" }} />
          <span style={{ color: "#C9A84C" }}>✦</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, #C9A84C, transparent)" }} />
        </div>
        <div className="space-y-4 text-gray-400 leading-relaxed max-w-2xl mx-auto">
          <p>En Escape Bar creemos que los nuevos talentos necesitan espacios reales para ser escuchados.</p>
          <p>Todos los viernes abrimos la posibilidad de que artistas emergentes puedan compartir su música, conectar con nuevas personas y vivir la experiencia de presentarse en Pacha Disco.</p>
          <p>No importa si recién estás comenzando o ya tenés experiencia. Queremos conocer tu propuesta.</p>
        </div>
        <button onClick={scrollToForm}
          className="mt-8 flex items-center gap-2 mx-auto px-8 py-3.5 rounded-lg text-sm font-black tracking-wider uppercase transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, #75AADB, #4A8BC2)", color: "#fff" }}>
          Quiero participar <ChevronRight size={16} />
        </button>
      </section>

      {/* BLOQUE 2 — ¿Quiénes pueden postularse? */}
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.4em] mb-3" style={{ color: "#C9A84C" }}>Abierto a todos</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>¿Quiénes pueden postularse?</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 mb-8">
          {ARTIST_CARDS.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className="!flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all hover:-translate-y-1"
                style={{ background: "#0f0f0f", border: "1px solid #1e1e1e" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#1e1e1e"}>
                <Icon size={24} style={{ color: "#C9A84C" }} />
                <span className="text-xs text-gray-300 font-medium">{a.label}</span>
              </div>
            );
          })}
        </div>
        <p className="text-sm text-gray-500 text-center max-w-2xl mx-auto leading-relaxed">
          La postulación está abierta a diferentes géneros y formatos. Cada propuesta será evaluada según su estilo, necesidades técnicas, disponibilidad y compatibilidad con la programación de Escape Bar.
        </p>
      </section>

      {/* BLOQUE 3 — ¿Cómo funciona? */}
      <section className="py-12 md:py-16 px-4" style={{ background: "linear-gradient(180deg, #070707 0%, #0d0a04 100%)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.4em] mb-3" style={{ color: "#75AADB" }}>Paso a paso</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>¿Cómo funciona?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative p-5 rounded-xl" style={{ background: "#0f0f0f", border: "1px solid #1e1e1e" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-black mb-3"
                  style={{ background: "linear-gradient(135deg, #75AADB, #4A8BC2)", color: "#fff" }}>
                  {s.num}
                </div>
                <h3 className="text-white font-bold text-sm mb-2">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-px" style={{ background: "#2a2a2a" }} />
                )}
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl text-center" style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)" }}>
            <p className="text-sm text-gray-400">
              <strong style={{ color: "#C9A84C" }}>Aclaración:</strong> Completar el formulario no garantiza una presentación ni una contratación. Las propuestas serán evaluadas por el equipo de producción de Pacha Disco.
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      {!showForm && (
        <section className="py-16 md:py-24 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: `url(${HERO_IMG}) center/cover`, opacity: 0.15 }} />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
              ¿Listo para subir al escenario?
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">Postulate ahora y sé parte de las noches de los viernes en Escape Bar.</p>
            <button onClick={scrollToForm}
              className="flex items-center gap-2 mx-auto px-10 py-4 rounded-lg text-base font-black tracking-wider uppercase transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #75AADB, #4A8BC2)", color: "#fff", boxShadow: "0 4px 40px rgba(116,172,223,0.4)" }}>
              <Mic size={18} /> Postular mi proyecto
            </button>
          </div>
        </section>
      )}
    </div>
  );
}