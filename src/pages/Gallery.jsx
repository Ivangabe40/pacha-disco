import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Camera, ExternalLink, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut", delay: i * 0.08 }
  })
};

export default function Gallery() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.GalleryAlbum.list("-created_date").then(data => {
      setAlbums(data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>

      {/* Header */}
      <motion.div
        className="relative py-20 md:py-28 px-4 text-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(201,168,76,0.07) 0%, transparent 70%)" }} />
        <div className="relative z-10">
          <motion.p
            className="text-xs uppercase tracking-[0.4em] mb-3"
            style={{ color: "#C9A84C" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Nuestras
          </motion.p>
          <motion.h1
            className="text-4xl md:text-7xl font-bold text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Galería
          </motion.h1>
          <motion.div
            className="w-24 h-px mx-auto mt-6"
            style={{ background: "linear-gradient(to right, transparent, #C9A84C, transparent)" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          />
          <motion.p
            className="text-gray-500 text-sm mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Revivé cada noche. Accedé a las fotos de cada sábado.
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-28">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 rounded-full border-2 border-t-yellow-500 border-gray-800 animate-spin" />
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-24">
            <Camera size={48} className="mx-auto mb-4 opacity-20" style={{ color: "#C9A84C" }} />
            <p className="text-gray-500">Próximamente fotos de nuestros eventos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
            {albums.map((album, i) => (
              <motion.a
                key={album.id}
                href={album.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl overflow-hidden"
                style={{ background: "#111", border: "1px solid #222", boxShadow: "0 6px 30px rgba(0,0,0,0.5)" }}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(232,0,29,0.45)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#222"}
              >
                {/* Cover */}
                <div className="relative overflow-hidden" style={{ aspectRatio: "16/9", background: "#0f0f0f" }}>
                  {album.cover_url ? (
                    <img
                      src={album.cover_url}
                      alt={album.title}
                      className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-108"
                      style={{ transition: "transform 0.6s ease" }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={40} style={{ color: "#2a2a2a" }} />
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-350"
                    style={{ background: "rgba(232,0,29,0.13)", backdropFilter: "blur(1px)" }}
                  >
                    <motion.div
                      className="w-13 h-13 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(232,0,29,0.92)", width: 52, height: 52 }}
                      initial={{ scale: 0.7, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                    >
                      <ExternalLink size={18} className="text-white" />
                    </motion.div>
                  </div>
                </div>

                {/* Title bar */}
                <div className="px-5 py-4 flex items-center justify-between gap-3">
                  <p className="text-white font-semibold text-sm leading-snug">{album.title}</p>
                  <ExternalLink size={13} className="text-gray-600 group-hover:text-red-500 transition-colors shrink-0" />
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}