import { Star } from "lucide-react";

const REVIEW_URL = "https://g.page/r/CTXcpwPqVavhEBI/review";

export default function GoogleReviewInvite() {
  const handleEnter = (e) => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"; };
  const handleLeave = (e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; };

  return (
    <section className="py-6 md:py-8 px-4" style={{ background: "#070707" }}>
      <div className="max-w-2xl mx-auto text-center">
        <a
          href={REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex flex-col items-center gap-3 px-6 py-5 rounded-2xl transition-all"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                size={16}
                fill="#C9A84C"
                className="text-[#C9A84C] transition-transform group-hover:scale-110"
                style={{ transitionDelay: `${i * 40}ms` }}
              />
            ))}
          </div>
          <div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              A Pachá le encantaría recibir tus comentarios.
            </p>
            <p className="text-xs uppercase tracking-widest mt-1.5 font-condensed" style={{ color: "#C9A84C" }}>
              Publica una opinión en nuestro perfil
            </p>
          </div>
        </a>
      </div>
    </section>
  );
}