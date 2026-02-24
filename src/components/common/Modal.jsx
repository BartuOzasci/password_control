/* ─────────────────────────────────────────────
   Ortak Modal bileşeni.
   Şifre ekleme vb. pop-up'lar için kullanılır.
   ───────────────────────────────────────────── */

import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  /* ESC ile kapat */
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content */}
      <div
        className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto bg-dark-card border border-white/10 rounded-3xl p-7 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition text-slate-400 cursor-pointer text-lg"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
