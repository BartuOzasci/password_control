/* ─────────────────────────────────────────────
   Toast – kısa ömürlü bilgilendirme mesajı.
   "Kopyalandı" gibi geri bildirimler için kullanılır.
   ───────────────────────────────────────────── */

export default function Toast({ message, show }) {
  if (!show) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-[10000] animate-toast-in"
      style={{ transform: "translateX(-50%)" }}
    >
      <div className="flex items-center gap-2 bg-dark-surface/95 glass-panel text-white text-sm font-semibold px-5 py-3 rounded-full shadow-2xl border border-white/10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-success shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
        {message}
      </div>
    </div>
  );
}
