/* ─────────────────────────────────────────────
   Kimlik doğrulama hook'u.
   Otomatik giriş, oturum süresi kontrolü,
   giriş ve çıkış işlemlerini yönetir.
   ───────────────────────────────────────────── */

import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS, SESSION_DURATION_MS } from '../config/constants';
import { getItem, setItem, removeItem } from '../utils/storage';
import users from '../data/users';

const useAuth = () => {
  const [user, setUser] = useState(null);          // Oturum açmış kullanıcı
  const [checking, setChecking] = useState(true);  // Otomatik giriş kontrolü

  /* ── Uygulama açılışında oturum kontrolü ── */
  useEffect(() => {
    const savedUser = getItem(STORAGE_KEYS.AUTH_USER);
    const savedTime = getItem(STORAGE_KEYS.AUTH_TIMESTAMP);

    if (savedUser && savedTime) {
      const elapsed = Date.now() - savedTime;
      if (elapsed < SESSION_DURATION_MS) {
        setUser(savedUser);
      } else {
        // Süre doldu → temizle
        removeItem(STORAGE_KEYS.AUTH_USER);
        removeItem(STORAGE_KEYS.AUTH_TIMESTAMP);
      }
    }

    // Kısa bir gecikme ile "yükleniyor" hissi ver
    setTimeout(() => setChecking(false), 1200);
  }, []);

  /* ── Giriş ── */
  const login = useCallback((username, password) => {
    const found = users.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      setItem(STORAGE_KEYS.AUTH_USER, found.username);
      setItem(STORAGE_KEYS.AUTH_TIMESTAMP, Date.now());
      setUser(found.username);
      return { success: true };
    }
    return { success: false, message: 'Kullanıcı adı veya şifre hatalı!' };
  }, []);

  /* ── Çıkış ── */
  const logout = useCallback(() => {
    removeItem(STORAGE_KEYS.AUTH_USER);
    removeItem(STORAGE_KEYS.AUTH_TIMESTAMP);
    setUser(null);
  }, []);

  /* ── Oturumu yenile (her veri girişinde) ── */
  const refreshSession = useCallback(() => {
    setItem(STORAGE_KEYS.AUTH_TIMESTAMP, Date.now());
  }, []);

  return { user, checking, login, logout, refreshSession };
};

export default useAuth;
