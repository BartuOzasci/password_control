/* ─────────────────────────────────────────────
   Şifreler Ekranı
   - Kayıtlı şifreleri listeler (başlık + gizli şifre)
   - "Göster" butonu ile şifreyi açar/kapar
   - "Şifre Ekle" modalı ile yeni şifre ekler
   - "Sil" butonu ile şifre siler
   - Veriler localStorage'da tutulur
   ───────────────────────────────────────────── */

import { useState, useEffect } from "react";
import { STORAGE_KEYS } from "../../config/constants";
import { getItem, setItem } from "../../utils/storage";
import defaultPasswords from "../../data/passwordsData";
import Button from "../common/Button";
import Modal from "../common/Modal";

export default function PasswordsScreen({ onActivity }) {
  const [passwords, setPasswords] = useState([]);
  const [visibleIds, setVisibleIds] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPass, setNewPass] = useState("");

  /* ── İlk yüklemede localStorage'dan oku ── */
  useEffect(() => {
    const saved = getItem(STORAGE_KEYS.PASSWORDS);
    if (saved && saved.length > 0) {
      setPasswords(saved);
    } else {
      setPasswords(defaultPasswords);
      setItem(STORAGE_KEYS.PASSWORDS, defaultPasswords);
    }
  }, []);

  /* ── Şifreleri kaydet ── */
  const save = (list) => {
    setPasswords(list);
    setItem(STORAGE_KEYS.PASSWORDS, list);
    onActivity?.(); // oturum süresini yenile
  };

  /* ── Göster / Gizle ── */
  const toggleVisible = (id) => {
    setVisibleIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* ── Yeni şifre ekle ── */
  const handleAdd = () => {
    if (!newTitle.trim() || !newPass.trim()) return;
    const item = {
      id: Date.now(),
      title: newTitle.trim(),
      password: newPass.trim(),
    };
    save([item, ...passwords]);
    setNewTitle("");
    setNewPass("");
    setModalOpen(false);
  };

  /* ── Şifre sil ── */
  const handleDelete = (id) => {
    save(passwords.filter((p) => p.id !== id));
  };

  return (
    <div className="px-4 py-5 animate-fade-in">
      {/* Başlık & Ekle butonu */}
      <div className="flex items-center justify-center mb-5">
        <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
          <span className="flex items-center gap-2">
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Şifre Ekle
          </span>
        </Button>
      </div>

      {/* Şifre Listesi */}
      {passwords.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto bg-dark-surface rounded-2xl flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-slate-600"
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
          </div>
          <p className="text-slate-500 text-sm">Henüz kayıtlı şifre yok</p>
          <p className="text-slate-600 text-xs mt-1">
            Yukarıdaki butona dokunarak ekleyin
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {passwords.map((item, index) => (
            <div
              key={item.id}
              className="bg-dark-card border border-white/5 rounded-2xl p-4 animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Başlık */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-8 h-8 flex items-center justify-center bg-primary/15 rounded-lg text-primary">
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
                        d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                      />
                    </svg>
                  </span>
                  {item.title}
                </h3>
              </div>

              {/* Şifre alanı */}
              <div className="bg-dark-surface/60 rounded-xl px-4 py-3 mb-3 font-mono text-sm text-slate-300 tracking-wider">
                {visibleIds.has(item.id)
                  ? item.password
                  : "•".repeat(item.password.length)}
              </div>

              {/* Butonlar */}
              <div className="flex items-center gap-2">
                <Button
                  variant={visibleIds.has(item.id) ? "ghost" : "secondary"}
                  size="sm"
                  onClick={() => toggleVisible(item.id)}
                  className="flex-1"
                >
                  {visibleIds.has(item.id) ? "Gizle" : "Göster"}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                >
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
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Şifre Ekle Modal ── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Yeni Şifre Ekle"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Başlık
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Örn: Instagram"
              className="w-full px-4 py-3 bg-dark-surface/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Şifre
            </label>
            <input
              type="text"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Şifrenizi girin"
              className="w-full px-4 py-3 bg-dark-surface/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
          </div>
          <Button variant="primary" className="w-full py-3" onClick={handleAdd}>
            Kaydet
          </Button>
        </div>
      </Modal>
    </div>
  );
}
