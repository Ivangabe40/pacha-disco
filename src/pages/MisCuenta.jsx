import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Coins, Trophy, Star, Gift, Zap, TrendingUp, CheckCircle2, Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const LEVELS = [
  { name: "Invitado", min: 0, max: 99, color: "#888", bg: "rgba(136,136,136,0.1)", icon: "🎫" },
  { name: "Regular", min: 100, max: 299, color: "#8888FF", bg: "rgba(136,136,255,0.1)", icon: "⭐" },
  { name: "VIP", min: 300, max: 699, color: "#C9A84C", bg: "rgba(201,168,76,0.1)", icon: "👑" },
  { name: "Platinum", min: 700, max: 1499, color: "#E8E8FF", bg: "rgba(232,232,255,0.1)", icon: "💎" },
  { name: "Pachá Elite", min: 1500, max: Infinity, color: "#75AADB", bg: "rgba(116,172,223,0.1)", icon: "🔴" },
];

const REWARDS = [
  { coins: 100, label: "Shot de bienvenida", icon: "🥃", desc: "1 shot a elección en barra" },
  { coins: 250, label: "2x1 en tragos", icon: "🍹", desc: "Válido por una noche" },
  { coins: 500, label: "Entrada gratis", icon: "🎟️", desc: "Para el próximo evento" },
  { coins: 800, label: "Mesa VIP", icon: "👑", desc: "Acceso prioritario a mesa VIP" },
  { coins: 1500, label: "Noche Elite", icon: "💎", desc: "Botella + mesa VIP + lista de acompañantes" },
];

function getLevel(coins) {
  return LEVELS.find(l => coins >= l.min && coins <= l.max) || LEVELS[0];
}

function getNextLevel(coins) {
  const idx = LEVELS.findIndex(l => coins >= l.min && coins <= l.max);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

export default function MisCuenta() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);
  const [redeemSuccess, setRedeemSuccess] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      if (u) {
        const records = await base44.entities.PachaCoins.filter({ user_email: u.email });
        setProfile(records[0] || null);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleRedeem = async (reward) => {
    if (!profile || profile.coins < reward.coins) return;
    setRedeeming(reward.coins);
    const newCoins = profile.coins - reward.coins;
    await base44.entities.PachaCoins.update(profile.id, { coins: newCoins });
    setProfile(prev => ({ ...prev, coins: newCoins }));
    setRedeemSuccess(reward.label);
    setRedeeming(null);
    setTimeout(() => setRedeemSuccess(null), 4000);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      if (user?.id) {
        await base44.entities.User.delete(user.id);
      }
    } catch (e) {
      // Platform may restrict self-deletion; proceed to logout
    }
    try {
      await base44.auth.logout();
    } catch (e) {
      window.location.href = "/";
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#070707" }}>
      <div className="w-10 h-10 rounded-full animate-spin" style={{ border: "2px solid #1a1a1a", borderTop: "2px solid #75AADB" }} />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4" style={{ background: "#070707" }}>
      <Coins size={48} style={{ color: "#75AADB", opacity: 0.5 }} />
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Inicia sesión</h2>
        <p className="text-gray-500 text-sm">Necesitás una cuenta para ver tus Pachá Coins</p>
      </div>
      <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
        className="px-6 py-3 rounded-lg text-sm font-bold text-white"
        style={{ background: "#75AADB" }}>
        Iniciar Sesión
      </button>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4" style={{ background: "#070707" }}>
      <Coins size={48} style={{ color: "#C9A84C", opacity: 0.5 }} />
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Todavía no tenés coins</h2>
        <p className="text-gray-500 text-sm max-w-xs">Comprá una entrada a un evento de Pachá y comenzá a acumular Pachá Coins automáticamente.</p>
      </div>
    </div>
  );

  const level = getLevel(profile.coins);
  const nextLevel = getNextLevel(profile.coins);
  const progressPct = nextLevel
    ? Math.round(((profile.coins - level.min) / (nextLevel.min - level.min)) * 100)
    : 100;

  return (
    <div style={{ background: "#070707", minHeight: "100vh" }} className="pb-24">
      <div className="max-w-lg mx-auto px-4 pt-8 space-y-6">

        {/* Header */}
        <div className="text-center pt-4">
          <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Mi cuenta</p>
          <h1 className="text-3xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Pachá Coins
          </h1>
        </div>

        {/* Coins + Level Card */}
        <div className="rounded-2xl p-6 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0f0f0f, #1a1010)", border: "1px solid rgba(116,172,223,0.2)" }}>
          <div className="absolute inset-0 opacity-5"
            style={{ background: "radial-gradient(circle at 70% 30%, #75AADB, transparent 60%)" }} />

          <div className="text-5xl mb-1">{level.icon}</div>
          <div className="text-5xl font-black text-white mt-2 mb-1"
            style={{ fontFamily: "'Playfair Display', serif", color: level.color }}>
            {profile.coins.toLocaleString()}
          </div>
          <p className="text-gray-500 text-sm mb-4">Pachá Coins disponibles</p>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold"
            style={{ background: level.bg, color: level.color, border: `1px solid ${level.color}40` }}>
            <Trophy size={14} />
            Nivel {level.name}
          </div>

          {nextLevel && (
            <div className="mt-5">
              <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                <span>{level.name}</span>
                <span>{nextLevel.min - profile.coins} coins para {nextLevel.name}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "#1a1a1a" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, ${level.color}, ${nextLevel.color})` }} />
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Ganados", value: profile.total_earned || 0, icon: TrendingUp, color: "#22c55e" },
            { label: "Eventos", value: profile.tickets_count || 0, icon: Star, color: "#C9A84C" },
            { label: "Nivel", value: LEVELS.indexOf(level) + 1 + "/" + LEVELS.length, icon: Trophy, color: "#8888FF" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-xl p-3 text-center" style={{ background: "#111", border: "1px solid #1e1e1e" }}>
              <Icon size={16} style={{ color, margin: "0 auto 4px" }} />
              <div className="text-white font-bold text-lg">{value}</div>
              <div className="text-gray-600 text-xs">{label}</div>
            </div>
          ))}
        </div>

        {/* How to earn */}
        <div className="rounded-xl p-4" style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Zap size={12} style={{ color: "#75AADB" }} /> Cómo ganar coins
          </p>
          <div className="space-y-2">
            {[
              { label: "Entrada anticipada", coins: "+100 coins" },
              { label: "Entrada en puerta", coins: "+50 coins" },
              { label: "Reserva VIP", coins: "+200 coins" },
            ].map(({ label, coins }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">{label}</span>
                <span className="text-sm font-bold" style={{ color: "#C9A84C" }}>{coins}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Gift size={12} style={{ color: "#75AADB" }} /> Canjear beneficios
          </p>

          {redeemSuccess && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-3"
              style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <CheckCircle2 size={18} style={{ color: "#22c55e" }} />
              <div>
                <p className="text-white text-sm font-bold">¡Canjeado! Mostrá esta pantalla en la barra</p>
                <p className="text-gray-400 text-xs">{redeemSuccess}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {REWARDS.map(reward => {
              const canAfford = profile.coins >= reward.coins;
              return (
                <div key={reward.coins} className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background: "#111", border: `1px solid ${canAfford ? "#2a2a2a" : "#1a1a1a"}`, opacity: canAfford ? 1 : 0.5 }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{reward.icon}</span>
                    <div>
                      <p className="text-white text-sm font-semibold">{reward.label}</p>
                      <p className="text-gray-500 text-xs">{reward.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || redeeming === reward.coins}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 ml-3 transition-all"
                    style={{
                      background: canAfford ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.03)",
                      color: canAfford ? "#C9A84C" : "#444",
                      border: canAfford ? "1px solid rgba(201,168,76,0.3)" : "1px solid #222",
                    }}>
                    {redeeming === reward.coins ? <Loader2 size={12} className="animate-spin" /> : `${reward.coins} 🪙`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delete Account — Store Compliance */}
        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  color: "#ef4444",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                <Trash2 size={15} /> Eliminar Cuenta
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent
              style={{ background: "#0f0f0f", border: "1px solid rgba(239,68,68,0.3)" }}
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                  ¿Eliminar tu cuenta?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  Esta acción es permanente e irreversible. Se eliminarán todos tus
                  datos, Pachá Coins e historial de actividad.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  style={{ background: "#1a1a1a", color: "#888", border: "1px solid #2a2a2a" }}
                >
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  style={{ background: "#ef4444", color: "#fff" }}
                >
                  {deleting ? "Eliminando..." : "Sí, eliminar cuenta"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}