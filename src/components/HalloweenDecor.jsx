import { motion } from "framer-motion";

const DECOR = [
  { emoji: "🦇", style: { top: "52px", left: "5%" }, size: 22, duration: 6, delay: 0 },
  { emoji: "🦇", style: { top: "120px", right: "7%" }, size: 16, duration: 7, delay: 1.2 },
  { emoji: "🦇", style: { top: "34px", right: "34%" }, size: 13, duration: 8, delay: 2.1 },
  { emoji: "🎃", style: { top: "230px", left: "4%" }, size: 20, duration: 9, delay: 0.6 },
  { emoji: "🕷️", style: { top: "300px", right: "5%" }, size: 16, duration: 10, delay: 1.8 },
];

export default function HalloweenDecor() {
  return (
    <div className="absolute inset-x-0 top-0 pointer-events-none z-30" aria-hidden="true">
      {/* Línea de acento naranja */}
      <div className="h-[3px] w-full"
        style={{ background: "linear-gradient(90deg, transparent, #FF7518 25%, #7B2D8E 50%, #FF7518 75%, transparent)" }} />

      {/* Detalles flotantes sutiles */}
      {DECOR.map((d, i) => (
        <motion.span
          key={i}
          className="absolute select-none"
          style={{ ...d.style, fontSize: d.size, opacity: 0.55 }}
          animate={{ y: [0, -7, 0], rotate: [-4, 4, -4] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}>
          {d.emoji}
        </motion.span>
      ))}
    </div>
  );
}