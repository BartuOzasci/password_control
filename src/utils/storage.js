/* ─────────────────────────────────────────────
   LocalStorage yardımcı fonksiyonları.
   ───────────────────────────────────────────── */

/**
 * localStorage'a JSON kaydeder.
 * @param {string} key
 * @param {*} value
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage setItem error:", e);
  }
};

/**
 * localStorage'dan JSON okur.
 * @param {string} key
 * @returns {*}
 */
export const getItem = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Storage getItem error:", e);
    return null;
  }
};

/**
 * localStorage'dan anahtar siler.
 * @param {string} key
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error("Storage removeItem error:", e);
  }
};
