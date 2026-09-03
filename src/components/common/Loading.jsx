/* ─────────────────────────────────────────────
   Yükleniyor bileşeni.
   Uygulama açılışı ve sayfa geçişlerinde kullanılır.
   ───────────────────────────────────────────── */

import { APP } from "../../config/constants";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark"
    >
      {/* Logo */}
      <img
        src={APP.logo}
        alt=""
        className="w-20 h-20 mb-6 rounded-2xl animate-pulse-glow"
      />

      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin-slow mb-4" />

      {/* Text */}
      <p className="text-slate-400 text-sm tracking-wide">Yükleniyor…</p>
    </div>
  );
}
