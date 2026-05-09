import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";

/**
 * Mobile-friendly bottom sheet picker.
 * Props:
 *   open: boolean
 *   onClose: () => void
 *   options: Array<{ value: string, label: string, icon?: string, desc?: string }>
 *   value: string
 *   onChange: (value: string) => void
 *   title: string
 */
export default function BottomSheetPicker({ open, onClose, options, value, onChange, title }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          />
          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl overflow-hidden"
            style={{
              background: "#111",
              border: "1px solid #333",
              paddingBottom: "env(safe-area-inset-bottom, 16px)",
              maxHeight: "80vh",
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: "#333" }} />
            </div>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3">
              <h3 className="text-white font-bold text-base" style={{ fontFamily: "'Playfair Display', serif" }}>
                {title}
              </h3>
              <button onClick={onClose} style={{ color: "#555" }}>
                <X size={20} />
              </button>
            </div>
            {/* Options */}
            <div className="overflow-y-auto px-4 pb-4 space-y-2" style={{ maxHeight: "60vh" }}>
              {options.map((opt) => {
                const isSelected = value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { onChange(opt.value); onClose(); }}
                    className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left transition-all"
                    style={{
                      background: isSelected ? "rgba(232,0,29,0.12)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${isSelected ? "rgba(232,0,29,0.4)" : "rgba(255,255,255,0.07)"}`,
                      userSelect: "none",
                      WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    {opt.icon && <span className="text-xl">{opt.icon}</span>}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm">{opt.label}</p>
                      {opt.desc && <p className="text-gray-500 text-xs mt-0.5 truncate">{opt.desc}</p>}
                    </div>
                    {isSelected && <Check size={16} style={{ color: "#E8001D" }} />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}