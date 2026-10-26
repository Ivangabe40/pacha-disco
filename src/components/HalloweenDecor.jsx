import { motion } from "framer-motion";

const DECOR = [
  { e: "🦇", s: { top: "48px", left: "3%" }, size: 34, dur: 6, delay: 0 },
  { e: "🦇", s: { top: "92px", right: "5%" }, size: 26, dur: 7, delay: 1.1 },
  { e: "🦇", s: { top: "150px", right: "34%" }, size: 18, dur: 8, delay: 2.2 },
  { e: "🎃", s: { top: "235px", left: "2%" }, size: 32, dur: 9, delay: 0.4 },
  { e: "🕸️", s: { top: "18%", right: "1%" }, size: 46, dur: 14, delay: 0.8 },
  { e: "👻", s: { top: "30%", left: "3%" }, size: 30, dur: 9, delay: 1.6 },
  { e: "🕷️", s: { top: "40%", right: "4%" }, size: 26, dur: 10, delay: 0.9 },
  { e: "🦇", s: { top: "50%", left: "4%" }, size: 24, dur: 7, delay: 2.4 },
  { e: "🎃", s: { top: "62%", right: "3%" }, size: 30, dur: 11, delay: 1.3 },
  { e: "🕸️", s: { top: "72%", left: "1%" }, size: 40, dur: 15, delay: 0.2 },
  { e: "🦇", s: { top: "82%", right: "5%" }, size: 26, dur: 8, delay: 1.9 },
  { e: "🍬", s: { top: "90%", left: "5%" }, size: 22, dur: 12, delay: 0.6 },
  { e: "🎃", s: { top: "96%", right: "8%" }, size: 24, dur: 13, delay: 2.6 },
];

const GLOWS = [
  { top: "-80px", left: "50%", color: "255,117,24", opacity: 0.28 },
  { top: "38%", left: "-15%", color: "123,45,142", opacity: 0.22 },
  { top: "68%", left: "60%", color: "255,117,24", opacity: 0.18 },
];

export default function HalloweenDecor() {
  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden" aria-hidden="true">
      {/* Línea de acento naranja / violeta */}
      <div className="absolute inset-x-0 top-0 h-[4px]"
        style={{ background: "linear-gradient(90deg, transparent, #FF7518 25%, #7B2D8E 50%, #FF7518 75%, transparent)" }} />

      {/* Resplandores cálidos */}
      {GLOWS.map((g, i) => (
        <motion.div
          key={`glow-${i}`}
          className="absolute w-[420px] h-[420px] rounded-full -translate-x-1/2"
          style={{
            top: g.top,
            left: g.left,
            background: `radial-gradient(circle, rgba(${g.color},${g.opacity}) 0%, transparent 65%)`,
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, delay: i * 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Detalles flotantes */}
      {DECOR.map((d, i) => (
        <motion.span
          key={i}
          className="absolute select-none"
          style={{
            ...d.s,
            fontSize: d.size,
            opacity: 0.9,
            filter: "drop-shadow(0 0 10px rgba(255,117,24,0.45))",
          }}
          animate={{ y: [0, -9, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}>
          {d.e}
        </motion.span>
      ))}
    </div>
  );
}