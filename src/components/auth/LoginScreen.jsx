/* ─────────────────────────────────────────────
   Login Ekranı – modern, mobil öncelikli tasarım.
   ───────────────────────────────────────────── */

import { useState } from "react";
import { APP } from "../../config/constants";
import Button from "../common/Button";

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);
    /* Giriş animasyonu için küçük bir gecikme */
    setTimeout(() => {
      const result = onLogin(username.trim(), password);
      if (!result.success) {
        setError(result.message);
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-dark px-6 overflow-y-auto py-10">
      {/* ── Arka plan gradient efektleri ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md animate-fade-in m-auto">
        {/* ── Logo & Başlık ── */}
        <div className="flex flex-col items-center mb-10">
          <img
            src={APP.logo}
            alt=""
            className="w-24 h-24 rounded-3xl shadow-2xl shadow-primary/30 mb-5"
          />
          <h1 className="text-2xl font-extrabold text-white tracking-tight text-center">
            {APP.name}
          </h1>
          <p className="text-slate-400 text-sm mt-1 text-center">{APP.tagline}</p>
        </div>

        {/* ── Form ── */}
        <form
          onSubmit={handleSubmit}
          noValidate
          aria-describedby={error ? "login-error" : undefined}
          className="bg-dark-card/80 backdrop-blur-xl border border-white/10 rounded-3xl p-7"
        >
          {/* Kullanıcı Adı */}
          <div style={{ marginBottom: 28 }}>
            <label
              htmlFor="login-username"
              className="block text-sm font-semibold text-slate-400 uppercase tracking-wider"
              style={{ marginBottom: 10 }}
            >
              Kullanıcı Adı
            </label>
            <div className="flex items-center gap-3 bg-dark-surface/60 border border-white/10 rounded-2xl px-5 min-h-[52px] focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition">
              <span className="text-slate-500 shrink-0" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </span>
              <input
                id="login-username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Kullanıcı adınız"
                className="flex-1 py-4 text-base bg-transparent text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Şifre */}
          <div style={{ marginBottom: 28 }}>
            <label
              htmlFor="login-password"
              className="block text-sm font-semibold text-slate-400 uppercase tracking-wider"
              style={{ marginBottom: 10 }}
            >
              Şifre
            </label>
            <div className="flex items-center gap-3 bg-dark-surface/60 border border-white/10 rounded-2xl px-5 min-h-[52px] focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition">
              <span className="text-slate-500 shrink-0" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              </span>
              <input
                id="login-password"
                name="password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifreniz"
                className="flex-1 py-4 text-base bg-transparent text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? "Şifreyi gizle" : "Şifreyi göster"}
                aria-pressed={showPass}
                className="text-slate-500 hover:text-slate-300 transition cursor-pointer shrink-0 p-1"
              >
                {showPass ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Hata mesajı */}
          {error && (
            <div
              id="login-error"
              role="alert"
              className="flex items-center gap-2 bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 animate-fade-in"
              style={{ marginBottom: 20 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
              {error}
            </div>
          )}

          {/* Giriş Butonu */}
          <Button
            type="submit"
            className="w-full py-4 text-lg min-h-[56px]"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                Giriş yapılıyor…
              </span>
            ) : (
              "Giriş Yap"
            )}
          </Button>
        </form>

        {/* Alt bilgi */}
        <p
          className="text-center text-slate-600 text-xs"
          style={{ marginTop: 48 }}
        >
          🔒 Verileriniz cihazınızda güvenle saklanır
        </p>
      </div>
    </div>
  );
}
