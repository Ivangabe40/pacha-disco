import { Image as ImageIcon } from "lucide-react";

/**
 * Muestra la medida exacta recomendada para una imagen/video en formularios de admin.
 * @param {string} size - Ej: "1080×1350"
 * @param {string} ratio - Ej: "4:5"
 * @param {string} [note] - Nota adicional opcional
 */
export default function ImageSizeHint({ size, ratio, note }) {
  return (
    <p className="text-xs text-gray-600 mt-1.5 flex items-center gap-1.5">
      <ImageIcon size={11} className="shrink-0" style={{ color: "#C9A84C" }} />
      <span>Medida recomendada: <strong className="text-gray-400">{size}px</strong> ({ratio}){note ? ` · ${note}` : ""}</span>
    </p>
  );
}