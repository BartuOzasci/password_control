/* ─────────────────────────────────────────────
   App – Uygulama kökü.
   Sayfa yönlendirme, auth durumu ve
   ekranlar arası geçişi yönetir.
   ───────────────────────────────────────────── */

import { useState } from "react";
import useAuth from "./hooks/useAuth";
import Loading from "./components/common/Loading";
import LoginScreen from "./components/auth/LoginScreen";
import Navbar from "./components/layout/Navbar";
import HomeScreen from "./components/home/HomeScreen";
import PasswordsScreen from "./components/passwords/PasswordsScreen";
import DocumentsScreen from "./components/documents/DocumentsScreen";

export default function App() {
  const { user, checking, login, logout, refreshSession } = useAuth();
  const [screen, setScreen] = useState("home");
  const [transitioning, setTransitioning] = useState(false);

  /* ── Yüklenme kontrolü ── */
  if (checking) return <Loading />;

  /* ── Giriş yapılmamışsa login ekranı ── */
  if (!user) return <LoginScreen onLogin={login} />;

  /* ── Sayfa geçişi ── */
  const navigateTo = (target) => {
    setTransitioning(true);
    setTimeout(() => {
      setScreen(target);
      setTransitioning(false);
    }, 400);
  };

  const goHome = () => navigateTo("home");

  const renderScreen = () => {
    if (transitioning) {
      return (
        <div
          className="flex items-center justify-center py-32"
          role="status"
          aria-live="polite"
        >
          <span className="sr-only">Yükleniyor…</span>
          <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin-slow" />
        </div>
      );
    }
    switch (screen) {
      case "passwords":
        return <PasswordsScreen onActivity={refreshSession} />;
      case "documents":
        return <DocumentsScreen />;
      default:
        return <HomeScreen onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-dark flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[10001] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-xl"
      >
        İçeriğe geç
      </a>
      <Navbar
        user={user}
        onLogout={logout}
        onBack={goHome}
        showBack={screen !== "home"}
      />
      <main id="main-content" className="flex-1 pb-6 max-w-4xl w-full mx-auto">
        {renderScreen()}
      </main>
    </div>
  );
}
