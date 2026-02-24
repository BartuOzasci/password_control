/* ─────────────────────────────────────────────
   Ortak Modal bileşeni.
   Şifre ekleme vb. pop-up'lar için kullanılır.
   ───────────────────────────────────────────── */

import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  /* ESC ile kapat + body scroll kilitle */
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    if (isOpen) {
      document.addEventListener("keydown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "448px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#1e293b",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "24px",
          padding: "28px",
          zIndex: 1,
        }}
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
