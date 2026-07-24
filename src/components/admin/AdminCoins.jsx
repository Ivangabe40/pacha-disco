import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Coins, Plus, Minus, Search, Trophy, RefreshCw } from "lucide-react";

const LEVELS = [
  { name: "Invitado", min: 0, max: 99, color: "#888", icon: "🎫" },
  { name: "Regular", min: 100, max: 299, color: "#8888FF", icon: "⭐" },
  { name: "VIP", min: 300, max: 699, color: "#C9A84C", icon: "👑" },
  { name: "Platinum", min: 700, max: 1499, color: "#E8E8FF", icon: "💎" },
  { name: "Pachá Elite", min: 1500, max: Infinity, color: "#FF0000", icon: "🔴" },
];

function getLevel(coins) {
  return LEVELS.find(l => coins >= l.min && coins <= l.max) || LEVELS[0];
}

export default function AdminCoins() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [adjusting, setAdjusting] = useState(null);
  const [amount, setAmount] = useState(50);
  const [reason, setReason] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    setLoading(true);
    base44.entities.PachaCoins.list("-coins").then(d => { setProfiles(d); }).catch(() => {}).finally(() => setLoading(false));
  };

  const handleAdjust = async (profile, delta) => {
    const newCoins = Math.max(0, profile.coins + delta);
    const newTotal = delta > 0 ? (profile.total_earned || 0) + delta : (profile.total_earned || 0);
    try {
      await base44.entities.PachaCoins.update(profile.id, {
        coins: newCoins,
        total_earned: newTotal,
        notes: reason || profile.notes,
      });
      setProfiles(prev => prev.map(p => p.id === profile.id ? { ...p, coins: newCoins, total_earned: newTotal } : p));
    } catch {
      /* silent */
    } finally {
      setAdjusting(null);
      setReason("");
    }
  };

  const handleCreate = async () => {
    if (!newEmail.trim()) return;
    setCreating(true);
    try {
      const rec = await base44.entities.PachaCoins.create({
        user_email: newEmail.trim(),
        user_name: newName.trim() || newEmail.trim(),
        coins: 0,
        total_earned: 0,
        tickets_count: 0,
      });
      setProfiles(prev => [rec, ...prev]);
      setNewEmail(""); setNewName(""); setShowCreate(false);
    } catch {
      /* silent */
    } finally {
      setCreating(false);
    }
  };

  const filtered = profiles.filter(p =>
    p.user_email?.toLowerCase().includes(search.toLowerCase()) ||
    p.user_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Pachá Coins</h2>
          <p className="text-gray-500 text-sm mt-0.5">{profiles.length} usuarios registrados</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 rounded-lg text-gray-500 hover:text-white transition-colors"
            style={{ background: "#111", border: "1px solid #222" }}>
            <RefreshCw size={16} />
          </button>
          <button onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all"
            style={{ background: "#FF0000" }}>
            <Plus size={14} /> Agregar usuario
          </button>
        </div>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="rounded-xl p-4 space-y-3" style={{ background: "#111", border: "1px solid #333" }}>
          <p className="text-white text-sm font-bold">Nuevo perfil de coins</p>
          <div className="grid grid-cols-2 gap-3">
            <input value={newEmail} onChange={e => setNewEmail(e.target.value)}
              placeholder="Email del usuario"
              className="px-3 py-2.5 rounded-lg text-sm text-white outline-none"
              style={{ background: "#0d0d0d", border: "1px solid #333" }} />
            <input value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="Nombre (opcional)"
              className="px-3 py-2.5 rounded-lg text-sm text-white outline-none"
              style={{ background: "#0d0d0d", border: "1px solid #333" }} />
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} disabled={creating || !newEmail.trim()}
              className="px-4 py-2 rounded-lg text-sm font-bold text-white"
              style={{ background: creating ? "#333" : "#FF0000" }}>
              {creating ? "Creando..." : "Crear"}
            </button>
            <button onClick={() => setShowCreate(false)}
              className="px-4 py-2 rounded-lg text-sm text-gray-400"
              style={{ background: "#0d0d0d" }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por email o nombre..."
          className="pl-9 pr-4 py-2.5 rounded-xl text-white text-sm outline-none w-full"
          style={{ background: "#111", border: "1px solid #333" }} />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-t-yellow-500 border-gray-800 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-600">No hay perfiles aún</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(p => {
            const level = getLevel(p.coins);
            const isAdjusting = adjusting === p.id;
            return (
              <div key={p.id} className="rounded-xl p-4" style={{ background: "#111", border: "1px solid #1e1e1e" }}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl">{level.icon}</span>
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{p.user_name || p.user_email}</p>
                      <p className="text-gray-500 text-xs truncate">{p.user_email}</p>
                      <span className="text-xs font-bold" style={{ color: level.color }}>{level.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-lg font-black" style={{ color: "#C9A84C" }}>{(p.coins || 0).toLocaleString()}</p>
                      <p className="text-xs text-gray-600">🪙 coins</p>
                    </div>
                    <button onClick={() => setAdjusting(isAdjusting ? null : p.id)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ background: isAdjusting ? "rgba(255,0,0,0.1)" : "#1a1a1a", color: isAdjusting ? "#FF0000" : "#666" }}>
                      <Coins size={15} />
                    </button>
                  </div>
                </div>

                {isAdjusting && (
                  <div className="mt-4 pt-4 border-t space-y-3" style={{ borderColor: "#222" }}>
                    <div className="flex items-center gap-3">
                      <label className="text-xs text-gray-500 shrink-0">Cantidad:</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(Number(e.target.value))}
                        min={1}
                        className="w-24 px-2 py-1.5 rounded-lg text-sm text-white text-center outline-none"
                        style={{ background: "#0d0d0d", border: "1px solid #333" }}
                      />
                      <input value={reason} onChange={e => setReason(e.target.value)}
                        placeholder="Motivo (opcional)"
                        className="flex-1 px-3 py-1.5 rounded-lg text-sm text-white outline-none"
                        style={{ background: "#0d0d0d", border: "1px solid #333" }} />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleAdjust(p, amount)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white flex-1"
                        style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e" }}>
                        <Plus size={13} /> Sumar {amount} coins
                      </button>
                      <button onClick={() => handleAdjust(p, -amount)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold flex-1"
                        style={{ background: "rgba(255,0,0,0.1)", border: "1px solid rgba(255,0,0,0.2)", color: "#FF0000" }}>
                        <Minus size={13} /> Restar {amount} coins
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}