import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Select oscuro del panel de administración.
 * Reemplaza el <select> nativo, que en WebView de Android abre un diálogo
 * del sistema con estilos inconsistentes.
 */
export default function AdminSelect({
  value,
  onValueChange,
  options = [],
  placeholder = "Seleccionar",
  className = "",
  style = {},
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={`h-auto w-full px-4 py-3 rounded-lg text-sm text-white focus:ring-0 focus:ring-offset-0 ${className}`}
        style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", ...style }}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="z-[70]" style={{ background: "#111", border: "1px solid #2a2a2a" }}>
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="text-sm text-white py-3 min-h-[44px] focus:bg-[#1f1f1f] focus:text-white"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}