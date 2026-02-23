/* ─────────────────────────────────────────────
   Navbar – Kullanıcı karşılama ve çıkış butonu.
   ───────────────────────────────────────────── */

import { APP } from "../../config/constants";
import Button from "../common/Button";

export default function Navbar({ user, onLogout, onBack, showBack }) {
  return (
    <nav className="sticky top-0 z-40 bg-dark/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Sol: Geri / Logo */}
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          ) : (
            <img src={APP.logo} alt="" className="w-9 h-9 rounded-xl" />
          )}

          <div>
            <h1 className="text-base font-bold text-white leading-tight">
              Hoşgeldin, {user} 👋
            </h1>
            <p className="text-[11px] text-primary-light font-medium tracking-wide">
              {APP.tagline}
            </p>
          </div>
        </div>

        {/* Sağ: Çıkış */}
        <Button variant="ghost" size="sm" onClick={onLogout}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
            />
          </svg>
        </Button>
      </div>
    </nav>
  );
}
