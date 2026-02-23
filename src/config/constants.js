/* ─────────────────────────────────────────────
   Uygulama genelinde kullanılan sabitler.
   Tüm ortak değerler buradan dağıtılır.
   ───────────────────────────────────────────── */

/** Oturum süresi: 30 gün (ms cinsinden) */
export const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

/** LocalStorage anahtarları */
export const STORAGE_KEYS = {
  AUTH_USER: 'auth_user',
  AUTH_TIMESTAMP: 'auth_timestamp',
  PASSWORDS: 'user_passwords',
};

/** Uygulama bilgileri */
export const APP = {
  name: 'Güvenli Kasam',
  tagline: 'Bilgilerin bizimle güvende',
  logo: '/logo.png',
};
