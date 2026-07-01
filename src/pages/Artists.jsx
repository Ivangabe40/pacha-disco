import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Instagram, Music, Star } from "lucide-react";

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Artist.list("name").then(data => {
      setArtists(data);
      setLoading(false);
    });
  }, []);

  const residents = artists.filter(a => a.is_resident);
  const guests = artists.filter(a => !a.is_resident);

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      {/* Header */}
      <div className="relative py-16 md:py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(201,168,76,0.05) 0%, transparent 70%)" }} />
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.4em] mb-3" style={{ color: "#C9A84C" }}>Nuestros</p>
          <h1 className="text-4xl md:text-7xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            DJs & Artistas
          </h1>
          <div className="w-24 h-px mx-auto mt-6" style={{ background: "linear-gradient(to right, transparent, #C9A84C, transparent)" }}></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-2 border-t-yellow-500 border-gray-800 animate-spin"></div>
          </div>
        ) : artists.length === 0 ? (
          <div className="text-center py-20">
            <Music size={48} className="mx-auto mb-4 opacity-20" style={{ color: "#C9A84C" }} />
            <p className="text-gray-500">Próximamente artistas</p>
          </div>
        ) : (
          <>
            {residents.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <Star size={16} style={{ color: "#C9A84C" }} />
                  <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Residentes</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {residents.map(artist => <ArtistCard key={artist.id} artist={artist} />)}
                </div>
              </section>
            )}
            {guests.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1 h-6 rounded" style={{ background: "#C9A84C" }}></div>
                  <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Artistas Invitados</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {guests.map(artist => <ArtistCard key={artist.id} artist={artist} />)}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ArtistCard({ artist }) {
  return (
    <div className="group rounded-2xl overflow-hidden" style={{ background: "#111", border: "1px solid #222" }}>
      <div className="relative aspect-square overflow-hidden">
        {artist.photo_url ? (
          <img src={artist.photo_url} alt={artist.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl font-bold"
            style={{ background: "linear-gradient(135deg, #1a1a1a, #0d0d0d)", color: "#C9A84C" }}>
            {artist.name[0]}
          </div>
        )}
        {artist.is_resident && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#0A0A0A" }}>
            Residente
          </div>
        )}
      </div>
      <div className="p-3 md:p-4">
        <h3 className="font-bold text-white text-sm md:text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>{artist.name}</h3>
        {artist.genre && <p className="text-sm mt-0.5" style={{ color: "#C9A84C" }}>{artist.genre}</p>}
        {artist.bio && <p className="text-gray-400 text-xs mt-2 leading-relaxed line-clamp-3">{artist.bio}</p>}
        {artist.instagram && (
          <a href={`https://instagram.com/${artist.instagram.replace("@", "")}`} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-pink-400 transition-colors mt-3">
            <Instagram size={12} /> @{artist.instagram.replace("@", "")}
          </a>
        )}
      </div>
    </div>
  );
}