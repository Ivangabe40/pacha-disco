import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function PastEventsCarousel({ events }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i) => emblaApi && emblaApi.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const syncSelection = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());
    syncSelection();
    emblaApi.on("select", syncSelection);
    return () => { emblaApi.off("select", syncSelection); };
  }, [emblaApi]);

  if (!events || events.length === 0) return null;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <section className="py-4 md:py-8 px-0 md:px-4" style={{ background: "#070707" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <div className="flex items-center gap-4">
            <div className="w-1 h-10 rounded-full" style={{ background: "linear-gradient(#555, #222)" }} />
            <div>
              <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "#888" }}>Historia</p>
              <h2 className="text-2xl md:text-4xl font-black text-white uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                Ediciones <span style={{ color: "#FF0000" }}>Anteriores</span>
              </h2>
            </div>
          </div>

          {/* Arrow controls */}
          <div className="hidden sm:flex items-center gap-3">
            <button onClick={scrollPrev}
              className="w-10 h-10 flex items-center justify-center rounded-full transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,0,0,0.6)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}>
              <ChevronLeft size={18} className="text-gray-400" />
            </button>
            <button onClick={scrollNext}
              className="w-10 h-10 flex items-center justify-center rounded-full transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,0,0,0.6)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {events.map((event) => (
              <div key={event.id}
                className="flex-none w-[80vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] xl:w-[18vw]"
                style={{ minWidth: 0 }}>
                <Link to={`/EventDetail?id=${event.id}`}>
                  <div className="relative rounded-xl overflow-hidden group cursor-pointer"
                    style={{ border: "1px solid #1e1e1e" }}>
                    <div className="relative aspect-[3/4]" style={{ background: "#0b0b0b" }}>
                    {event.flyer_url ? (
                      <img src={event.flyer_url} alt={event.title} loading="lazy" decoding="async"
                        className="w-full h-full object-contain"
                        />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #111 0%, #1a1a1a 100%)" }}>
                        <Calendar size={32} className="text-gray-700" />
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="hidden"
                      style={{
                        background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)"
                      }} />

                    {/* Hover red glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "linear-gradient(135deg, rgba(255,0,0,0.08) 0%, transparent 60%)" }} />

                    </div>

                    {/* Texto separado del flyer para no tapar cartelería */}
                    <div className="p-4 min-h-[108px]" style={{ background: "#101010" }}>
                      {event.genres && (
                        <p className="text-xs tracking-widest uppercase mb-1.5 font-medium"
                          style={{ color: "#FF0000" }}>
                          {event.genres.split(",")[0].trim()}
                        </p>
                      )}
                      <h3 className="text-white font-bold text-sm leading-tight mb-2 line-clamp-2"
                        style={{ fontFamily: "'Playfair Display', serif" }}>
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={10} className="text-gray-500" />
                        <p className="text-gray-500 text-xs">{formatDate(event.date)}</p>
                      </div>
                      {event.djs && (
                        <p className="text-gray-600 text-xs mt-1 truncate">{event.djs}</p>
                      )}
                    </div>

                    {/* Corner tag */}
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-xs font-bold tracking-widest uppercase"
                      style={{ background: "rgba(0,0,0,0.7)", color: "#555", border: "1px solid #222" }}>
                      Pasado
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        {scrollSnaps.length > 8 ? (
          <div className="text-center text-xs text-gray-500 mt-4" aria-live="polite">
            Edición {selectedIndex + 1} de {scrollSnaps.length}
          </div>
        ) : scrollSnaps.length > 1 ? (
          <div className="flex justify-center gap-2 mt-5">
            {scrollSnaps.map((_, i) => (
              <button key={i} onClick={() => scrollTo(i)}
                aria-label={`Ir a la edición ${i + 1}`}
                aria-current={i === selectedIndex ? "true" : undefined}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === selectedIndex ? "24px" : "6px",
                  height: "6px",
                  background: i === selectedIndex ? "#FF0000" : "#2a2a2a"
                }} />
            ))}
          </div>
        ) : null}

        {/* Mobile arrows */}
        <div className="flex sm:hidden justify-center gap-4 mt-6">
          <button onClick={scrollPrev}
            className="w-10 h-10 flex items-center justify-center rounded-full"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <ChevronLeft size={18} className="text-gray-400" />
          </button>
          <button onClick={scrollNext}
            className="w-10 h-10 flex items-center justify-center rounded-full"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>
      </div>
    </section>
  );
}