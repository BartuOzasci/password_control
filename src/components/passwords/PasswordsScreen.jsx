/* ─────────────────────────────────────────────
   Şifreler Ekranı
   - Kayıtlı şifreleri listeler (başlık + gizli şifre)
   - "Göster" butonu ile şifreyi açar/kapar
   - "Şifre Ekle / Düzenle" modalı ile ekleme ve
     silmeden güncelleme yapılabilir
   - "Sil" butonu iki adımlı onay ister
   - Veriler localStorage'da tutulur
   ───────────────────────────────────────────── */

import { useState } from "react";
import { STORAGE_KEYS } from "../../config/constants";
import { getItem, setItem } from "../../utils/storage";
import { getAvatarGradient, getInitial } from "../../utils/avatarColor";
import defaultPasswords from "../../data/passwordsData";
import Button from "../common/Button";
import Modal from "../common/Modal";
import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

export default function PasswordsScreen({ onActivity }) {
  /* ── İlk yüklemede localStorage'dan oku (yan etkisiz lazy init) ── */
  const [passwords, setPasswords] = useState(() => {
    const saved = getItem(STORAGE_KEYS.PASSWORDS);
    if (saved && saved.length > 0) return saved;
    setItem(STORAGE_KEYS.PASSWORDS, defaultPasswords);
    return defaultPasswords;
  });
  const [visibleIds, setVisibleIds] = useState(new Set());
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newPass, setNewPass] = useState("");

  const { message, show, notify } = useToast();

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

  /* ── Ekleme modalını aç ── */
  const openAddModal = () => {
    setEditingId(null);
    setNewTitle("");
    setNewPass("");
    setModalOpen(true);
  };

  /* ── Düzenleme modalını aç (silmeden değiştirme) ── */
  const openEditModal = (item) => {
    setEditingId(item.id);
    setNewTitle(item.title);
    setNewPass(item.password);
    setModalOpen(true);
  };

  /* ── Ekle / Güncelle kaydı ── */
  const handleSubmit = () => {
    if (!newTitle.trim() || !newPass.trim()) return;

    if (editingId) {
      save(
        passwords.map((p) =>
          p.id === editingId
            ? { ...p, title: newTitle.trim(), password: newPass.trim() }
            : p,
        ),
      );
      notify("Şifre güncellendi ✓");
    } else {
      const item = {
        id: Date.now(),
        title: newTitle.trim(),
        password: newPass.trim(),
      };
      save([item, ...passwords]);
      notify("Şifre eklendi ✓");
    }

    setModalOpen(false);
    setEditingId(null);
    setNewTitle("");
    setNewPass("");
  };

  /* ── Şifre sil (iki adımlı onay) ── */
  const confirmDelete = (id) => {
    save(passwords.filter((p) => p.id !== id));
    setPendingDeleteId(null);
    notify("Şifre silindi");
  };

  /* ── Panoya kopyala ── */
  const handleCopy = (password) => {
    navigator.clipboard.writeText(password);
    notify("Panoya kopyalandı ✓");
  };

  return (
    <div className="px-5 py-6 animate-fade-in">
      {/* Başlık & Ekle butonu */}
      <div
        className="flex flex-col items-center gap-2"
        style={{ marginTop: 24, marginBottom: 32 }}
      >
        <Button variant="primary" size="lg" onClick={openAddModal}>
          <span className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
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
        {passwords.length > 0 && (
          <p className="text-slate-500 text-sm">
            {passwords.length} şifre kayıtlı
          </p>
        )}
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
              aria-hidden="true"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {passwords.map((item, index) => {
            const isVisible = visibleIds.has(item.id);
            const isPendingDelete = pendingDeleteId === item.id;

            return (
              <div
                key={item.id}
                className="bg-dark-card border border-white/5 rounded-2xl p-5 animate-slide-up hover:border-white/10 transition-colors"
                style={{ animationDelay: `${Math.min(index, 8) * 0.05}s` }}
              >
                {/* Başlık */}
                <div className="flex items-center gap-3 mb-3">
                  <span
                    aria-hidden="true"
                    className={`w-10 h-10 flex items-center justify-center bg-gradient-to-br ${getAvatarGradient(
                      item.title,
                    )} rounded-xl text-white font-bold text-sm shrink-0`}
                  >
                    {getInitial(item.title)}
                  </span>
                  <h3 className="text-base font-bold text-white break-words">
                    {item.title}
                  </h3>
                </div>

                {/* Şifre alanı */}
                <div className="flex items-center justify-between gap-3 bg-dark-surface/60 rounded-xl px-5 py-4 mb-4">
                  <span className="font-mono text-base text-slate-300 tracking-wider break-all">
                    {isVisible ? item.password : "•".repeat(Math.min(item.password.length, 20))}
                  </span>
                  <span className="sr-only" aria-live="polite">
                    {isVisible ? "Şifre görünür" : "Şifre gizli"}
                  </span>
                </div>

                {!isPendingDelete ? (
                  /* Butonlar */
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant={isVisible ? "ghost" : "secondary"}
                      size="sm"
                      onClick={() => toggleVisible(item.id)}
                      aria-pressed={isVisible}
                      className="flex-1 min-w-[100px]"
                    >
                      {isVisible ? "Gizle" : "Göster"}
                    </Button>

                    {isVisible && (
                      <button
                        onClick={() => handleCopy(item.password)}
                        aria-label={`${item.title} şifresini kopyala`}
                        className="w-11 h-11 flex items-center justify-center rounded-lg bg-success/15 hover:bg-success/25 text-success transition cursor-pointer active:scale-95"
                        title="Kopyala"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                          />
                        </svg>
                      </button>
                    )}

                    <button
                      onClick={() => openEditModal(item)}
                      aria-label={`${item.title} şifresini düzenle`}
                      className="w-11 h-11 flex items-center justify-center rounded-lg bg-primary/15 hover:bg-primary/25 text-primary-light transition cursor-pointer active:scale-95"
                      title="Düzenle"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={() => setPendingDeleteId(item.id)}
                      aria-label={`${item.title} şifresini sil`}
                      className="w-11 h-11 flex items-center justify-center rounded-lg bg-danger/15 hover:bg-danger/25 text-danger transition cursor-pointer active:scale-95"
                      title="Sil"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  /* Silme onayı */
                  <div className="flex items-center gap-2 animate-fade-in" role="alertdialog" aria-label="Silme onayı">
                    <span className="text-sm text-danger font-semibold flex-1">
                      Silinsin mi?
                    </span>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => confirmDelete(item.id)}
                    >
                      Evet, Sil
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPendingDeleteId(null)}
                    >
                      Vazgeç
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Şifre Ekle / Düzenle Modal ── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Şifreyi Düzenle" : "Yeni Şifre Ekle"}
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div>
            <label
              htmlFor="pw-title"
              className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider"
            >
              Başlık
            </label>
            <input
              id="pw-title"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Örn: Instagram"
              className="w-full px-5 py-4 text-base bg-dark-surface/60 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition min-h-[52px]"
            />
          </div>
          <div>
            <label
              htmlFor="pw-value"
              className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider"
            >
              Şifre
            </label>
            <input
              id="pw-value"
              type="text"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Şifrenizi girin"
              className="w-full px-5 py-4 text-base bg-dark-surface/60 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition min-h-[52px]"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full py-4 text-lg min-h-[56px]"
            disabled={!newTitle.trim() || !newPass.trim()}
          >
            {editingId ? "Güncelle" : "Kaydet"}
          </Button>
        </form>
      </Modal>

      <Toast message={message} show={show} />
    </div>
  );
}
