import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useState, useEffect } from "react";
import { Menu, X, Instagram, Facebook, MessageCircle, MapPin, ChevronLeft } from "lucide-react";
import MobileBottomBar from "@/components/MobileBottomBar";
import { useImageOptimization } from "@/hooks/useImageOptimization";

const ROOT_ROUTES = new Set(["/", "/Home", "/Eventos", "/Artists", "/Gallery", "/Menu", "/About", "/PrivateEvents", "/VIPReservations", "/Contact", "/Admin", "/configuracion", "/gestor-menu", "/TicketSales", "/MisEntradas", "/MisCuenta", "/QR", "/payment/success", "/payment/pending", "/payment/failure"]);

const LOGO_RED = "https://media.base44.com/images/public/69ad4033370fdc9f9fe8b117/6ecd577f7_file_00000000d89c820e8ae4cce82ce72506.png";

const navLinks = [
{ label: "Inicio", page: "Home" },
{ label: "Eventos", page: "Eventos" },
{ label: "Galería", page: "Gallery" },
{ label: "Carta", page: "Menu" },
{ label: "Nosotros", page: "About" },
{ label: "Eventos Privados", page: "PrivateEvents" }];


export default function Layout({ children, currentPageName }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isSubRoute = !ROOT_ROUTES.has(location.pathname);

  useImageOptimization([location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" suppressHydrationWarning style={{ background: "#070707", color: "#F0EBE3" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;500;600&display=swap');
        body { font-family: 'Inter', sans-serif; background: #070707; }
        h1,h2,h3,h4,h5 { font-family: 'Playfair Display', serif; }
        .nav-link { transition: color 0.2s, text-shadow 0.2s; color: #888; letter-spacing: 0.1em; font-family: 'Oswald', sans-serif; }
        .font-condensed { font-family: 'Oswald', sans-serif; }
        .nav-link:hover { color: #fff; }
        .nav-link.active { color: #FF0000; text-shadow: 0 0 12px rgba(255,0,0,0.6); }
      `}</style>

      {/* NAVBAR — Desktop full / Mobile logo-only or back header */}
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          position: "sticky",
          zIndex: 50,
          background: scrolled ? "rgba(7,7,7,0.98)" : "rgba(7,7,7,0.7)",
          borderBottom: scrolled ? "1px solid rgba(255,0,0,0.2)" : "1px solid rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          paddingTop: "env(safe-area-inset-top, 0px)"
        }}>
        {/* Red top line */}
        <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, transparent, #FF0000 30%, #FF0000 70%, transparent)" }} />

        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-14 md:h-16">
          {/* Mobile: back button on sub-routes, logo otherwise */}
          {isSubRoute ?
          <button
            onClick={() => window.history.back()}
            className="md:hidden flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
            style={{ userSelect: "none" }}>
            
              <ChevronLeft size={20} />
              <span className="text-sm font-medium">Volver</span>
            </button> :

          <Link to={createPageUrl("Home")} className="md:hidden flex items-center">
              <img src={LOGO_RED} alt="Pachá" className="h-10 w-auto object-contain"
            style={{ filter: "drop-shadow(0 0 10px rgba(255,0,0,0.5))" }} />
            </Link>
          }

          {/* Desktop Logo */}
          <Link to={createPageUrl("Home")} className="hidden md:flex items-center">
            <img src={LOGO_RED} alt="Pachá" className="h-12 w-auto object-contain"
            style={{ filter: "drop-shadow(0 0 12px rgba(255,0,0,0.5))" }} />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) =>
            <Link
              key={l.page}
              to={createPageUrl(l.page)}
              className={`nav-link text-xs font-semibold tracking-widest uppercase pb-0.5 ${currentPageName === l.page ? "active" : ""}`}>
                {l.label}
              </Link>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block" />

          {/* Mobile hamburger (only on root routes) */}
          {!isSubRoute &&
          <button className="md:hidden text-gray-400 hover:text-white transition-colors p-1" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          }
        </div>

        {/* Mobile full menu */}
        {menuOpen && !isSubRoute &&
        <div className="md:hidden px-4 py-6 flex flex-col gap-4"
        style={{ background: "#0d0d0d", borderTop: "1px solid rgba(255,0,0,0.15)" }}>
            {navLinks.map((l) =>
          <Link
            key={l.page}
            to={createPageUrl(l.page)}
            onClick={() => setMenuOpen(false)}
            className={`text-sm font-semibold tracking-widest uppercase py-2 ${currentPageName === l.page ? "text-red-500" : "text-gray-400"}`}>
                {l.label}
              </Link>
          )}

          </div>
        }
      </nav>

      {/* PAGE CONTENT — add bottom padding on mobile for the bottom bar */}
      <main className="flex-1" style={{ paddingBottom: "calc(56px + env(safe-area-inset-bottom, 0px))", position: "relative", zIndex: 1 }}>
        <style>{`@media(min-width:768px){main{padding-bottom:0!important}}`}</style>
        {children}
      </main>

      <MobileBottomBar />

      {/* FOOTER */}
      <footer className="py-10 md:py-14 px-4" style={{ background: "#050505", borderTop: "1px solid rgba(255,0,0,0.15)", position: "relative", zIndex: 1 }}>
        <div className="max-w-7xl mx-auto">
          {/* Red divider */}
          <div className="h-px w-full mb-8 md:mb-10" style={{ background: "linear-gradient(90deg, transparent, rgba(255,0,0,0.4), transparent)" }} />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="flex flex-col items-center md:items-start gap-2">
              <img src={LOGO_RED} alt="Pachá" className="h-14 w-auto object-contain"
              style={{ filter: "drop-shadow(0 0 10px rgba(255,0,0,0.4))" }} />
              <p className="text-gray-600 text-xs tracking-widest uppercase">Pachá Night Club · Exclusivo Mayores de 25</p>
              <a href="https://maps.app.goo.gl/outiaSZFTh14BhGK8" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-400 text-xs transition-colors mt-1">
                <MapPin size={11} /> Ver en Google Maps
              </a>
            </div>

            <div className="flex items-center gap-5">
              <a href="https://www.instagram.com/pachaoficialok" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="w-9 h-9 flex items-center justify-center rounded-full transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(255,0,0,0.5)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}>
                <Instagram size={15} className="text-gray-500" />
              </a>
              <a href="#" aria-label="Facebook"
              className="w-9 h-9 flex items-center justify-center rounded-full transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(255,0,0,0.5)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}>
                <Facebook size={15} className="text-gray-500" />
              </a>
              <a href="https://wa.me/5493468546935" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
              className="w-9 h-9 flex items-center justify-center rounded-full transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(37,211,102,0.5)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}>
                <MessageCircle size={15} className="text-gray-500" />
              </a>
              







              
              <a href="https://www.tiktok.com/@pachaoficialok" target="_blank" rel="noopener noreferrer" aria-label="TikTok"
              className="w-9 h-9 flex items-center justify-center rounded-full transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(255,0,0,0.5)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-gray-500">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
                </svg>
              </a>
              





              
            </div>

            <div className="text-center md:text-right">
              <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-1">
                <Link to={createPageUrl("About")} className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Sobre Nosotros</Link>
                <Link to={createPageUrl("MisEntradas")} className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Mis Entradas</Link>
                <Link to={createPageUrl("Contact")} className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Contacto</Link>
                <Link to={createPageUrl("Admin")} className="text-gray-700 hover:text-gray-500 text-xs transition-colors">Panel Admin</Link>
              </div>
              <div className="flex items-center gap-2 mt-1">
                
                <span className="text-gray-600 text-xs">Desarrollado por Pacha Apps. 2026</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>);

}