/* ─────────────────────────────────────────────
   Başlığa göre deterministik gradyan üretir.
   Şifre kartlarındaki harf rozetleri için kullanılır.
   ───────────────────────────────────────────── */

const PALETTE = [
  "from-indigo-500 to-blue-600",
  "from-sky-500 to-cyan-600",
  "from-violet-500 to-purple-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-fuchsia-500 to-rose-600",
  "from-blue-500 to-indigo-700",
];

export const getAvatarGradient = (text = "") => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
};

export const getInitial = (text = "") =>
  text.trim().charAt(0).toUpperCase() || "?";
