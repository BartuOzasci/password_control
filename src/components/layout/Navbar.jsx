/* ─────────────────────────────────────────────
   Navbar – Kullanıcı karşılama ve çıkış butonu.
   ───────────────────────────────────────────── */

import { APP } from "../../config/constants";
import { getAvatarGradient, getInitial } from "../../utils/avatarColor";

export default function Navbar({ user, onLogout, onBack, showBack }) {
  return (
    <nav className="sticky top-0 z-40 bg-dark/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-5 py-4">
        {/* Sol: Geri / Logo */}
        <div className="flex items-center gap-3 min-w-0">
          {showBack ? (
            <button
              onClick={onBack}
              aria-label="Ana ekrana dön"
              className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          ) : (
            <img
              src={APP.logo}
              alt=""
              className="w-11 h-11 rounded-xl shrink-0"
            />
          )}

          <div className="min-w-0">
            <h1 className="text-lg font-bold text-white leading-tight truncate">
              Hoşgeldin, {user} 👋
            </h1>
            <p className="text-xs text-primary-light font-medium tracking-wide truncate">
              {APP.tagline}
            </p>
          </div>
        </div>

        {/* Sağ: Kullanıcı rozeti + Çıkış */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div
            aria-hidden="true"
            className={`hidden sm:flex w-10 h-10 items-center justify-center rounded-xl bg-gradient-to-br ${getAvatarGradient(
              user || "",
            )} text-white font-bold text-sm`}
          >
            {getInitial(user || "")}
          </div>
          <button
            onClick={onLogout}
            aria-label="Oturumu kapat"
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-danger/15 hover:text-danger transition cursor-pointer active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
