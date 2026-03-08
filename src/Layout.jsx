import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useState } from "react";
import { Menu, X, Instagram, Facebook, Music2 } from "lucide-react";

const LOGO_GOLD = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_69abf6aff758a16386edeb04/71fcb4c4f_IMG-20260121-WA0030.jpg";
const LOGO_RED = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_69abf6aff758a16386edeb04/0e73ec46b_IMG-20260121-WA0031.jpg";

const navLinks = [
  { label: "Eventos", page: "Home" },
  { label: "DJs & Artistas", page: "Artists" },
  { label: "Galería", page: "Gallery" },
  { label: "Nosotros", page: "About" },
];

export default function Layout({ children, currentPageName }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = currentPageName === "Admin";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0A0A0A", color: "#F5F0E8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');
        body { font-family: 'Inter', sans-serif; background: #0A0A0A; }
        h1,h2,h3,h4,h5 { font-family: 'Playfair Display', serif; }
        .nav-link { transition: color 0.2s; }
        .nav-link:hover { color: #C9A84C; }
        .nav-link.active { color: #C9A84C; border-bottom: 1px solid #C9A84C; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ background: "rgba(10,10,10,0.97)", borderBottom: "1px solid #1a1a1a", backdropFilter: "blur(10px)" }}
        className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={createPageUrl("Home")} className="flex items-center gap-2">
            <img src={LOGO_RED} alt="Pachá" className="h-10 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <Link
                key={l.page}
                to={createPageUrl(l.page)}
                className={`nav-link text-sm font-medium tracking-widest uppercase pb-1 ${currentPageName === l.page ? "active" : "text-gray-400"}`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to={createPageUrl("Home")}
              className="btn-gold px-5 py-2 rounded text-sm font-semibold tracking-wider uppercase"
              style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#0A0A0A" }}
            >
              Entradas
            </Link>
          </div>

          {/* Mobile menu btn */}
          <button className="md:hidden text-gray-300" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: "#111" }} className="md:hidden border-t border-gray-800 px-4 py-6 flex flex-col gap-5">
            {navLinks.map(l => (
              <Link key={l.page} to={createPageUrl(l.page)}
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 text-base font-medium tracking-widest uppercase">
                {l.label}
              </Link>
            ))}
            <Link to={createPageUrl("Home")} onClick={() => setMenuOpen(false)}
              className="text-center py-3 rounded font-semibold tracking-wider uppercase mt-2"
              style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#0A0A0A" }}>
              Comprar Entradas
            </Link>
          </div>
        )}
      </nav>

      {/* PAGE CONTENT */}
      <main className="flex-1">
        {children}
      </main>

      {/* FOOTER */}
      <footer style={{ background: "#080808", borderTop: "1px solid #1a1a1a" }} className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start gap-3">
              <img src={LOGO_RED} alt="Pachá" className="h-12 w-auto object-contain" />
              <p className="text-gray-500 text-sm">Club Premium · Multigenero</p>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-500 hover:text-yellow-400 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-500 hover:text-yellow-400 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-500 hover:text-yellow-400 transition-colors"><Music2 size={20} /></a>
            </div>
            <div className="text-center md:text-right">
              <Link to={createPageUrl("Admin")} className="text-gray-700 hover:text-gray-500 text-xs">Panel Admin</Link>
              <p className="text-gray-700 text-xs mt-1">© 2026 Pachá. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}