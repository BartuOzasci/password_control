/* ─────────────────────────────────────────────
   Ortak Modal bileşeni.
   Şifre/belge ekleme-düzenleme pop-up'ları için kullanılır.
   Erişilebilirlik: role=dialog, ESC ile kapama,
   açılışta ilk alana odaklanma, body scroll kilidi.
   ───────────────────────────────────────────── */

import { useEffect, useId, useRef } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  const panelRef = useRef(null);
  const titleId = useId();

  /* ESC ile kapat + body scroll kilitle + ilk alana odaklan */
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";

    const focusTimer = setTimeout(() => {
      const focusable = panelRef.current?.querySelector(
        "input, textarea, select, button",
      );
      focusable?.focus();
    }, 50);

    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
      clearTimeout(focusTimer);
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
          background: "rgba(6, 10, 20, 0.72)",
          backdropFilter: "blur(6px)",
        }}
      />

      {/* Content */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "460px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#141b2e",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "26px",
          padding: "28px",
          zIndex: 1,
          boxShadow: "0 24px 60px -12px rgba(0,0,0,0.6)",
        }}
        className="animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 id={titleId} className="text-xl font-bold text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Kapat"
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
