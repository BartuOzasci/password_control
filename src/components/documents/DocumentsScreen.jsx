/* ─────────────────────────────────────────────
   Belgeler Ekranı
   - documentsData'dan belgeleri kart şeklinde listeler
   - Bartu / Bülent filtreleme
   - Uygulama içinden belge ekleme (başlık, sahip, kategori, dosya)
   - Belgeleri silmeden düzenleme (başlık, sahip, kategori, dosya)
   - Uygulama içinden belge silme (iki adımlı onay)
   - Her kartta: kategori rozeti, başlık, Göster & İndir butonları
   ───────────────────────────────────────────── */

import { useState, useRef } from "react";
import initialDocumentsData from "../../data/documentsData";
import documentCategories, { getCategory } from "../../config/documentCategories";
import { getItem, setItem } from "../../utils/storage";
import Button from "../common/Button";
import Modal from "../common/Modal";
import CategoryIcon from "../common/CategoryIcon";
import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

/* localStorage anahtarları */
const STORAGE_KEY = "custom_documents";
const DELETED_KEY = "deleted_document_ids";
const OVERRIDES_KEY = "document_overrides";

/* Sahip seçenekleri */
const OWNERS = ["Bartu", "Bülent"];

/* Filtre seçenekleri */
const FILTERS = ["Tümü", "Bartu", "Bülent"];

export default function DocumentsScreen() {
  /* State */
  const [filter, setFilter] = useState("Tümü");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editingDoc, setEditingDoc] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const [newTitle, setNewTitle] = useState("");
  const [newOwner, setNewOwner] = useState("Bartu");
  const [newCategory, setNewCategory] = useState(documentCategories[0].id);
  const [newFileData, setNewFileData] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const fileInputRef = useRef(null);

  const { message, show, notify } = useToast();

  /* localStorage'dan eklenen / silinen / düzenlenen belgeleri oku */
  const [customDocs, setCustomDocs] = useState(() => getItem(STORAGE_KEY) || []);
  const [deletedIds, setDeletedIds] = useState(() => getItem(DELETED_KEY) || []);
  const [overrides, setOverrides] = useState(() => getItem(OVERRIDES_KEY) || {});

  /* Varsayılan belgelere yapılan düzenlemeleri uygula */
  const defaultDocs = initialDocumentsData
    .filter((d) => !deletedIds.includes(d.id))
    .map((d) => ({ ...d, ...(overrides[d.id] || {}) }));

  const customDocsWithOverrides = customDocs.map((d) => ({
    ...d,
    ...(overrides[d.id] || {}),
  }));

  /* Tüm belgeler: varsayılan (silinmemiş, düzenlenmiş) + kullanıcı eklenen */
  const allDocuments = [...defaultDocs, ...customDocsWithOverrides];

  /* Filtrelenmiş belgeler */
  const filteredDocuments =
    filter === "Tümü"
      ? allDocuments
      : allDocuments.filter((doc) => doc.owner === filter);

  /* data URL'yi blob URL'ye çevir */
  const dataUrlToBlob = (dataUrl) => {
    const parts = dataUrl.split(",");
    const mime = parts[0].match(/:(.*?);/)[1];
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  };

  /* Dosyayı yeni sekmede aç */
  const handleView = (filePath) => {
    if (!filePath) {
      notify("Bu belge için dosya yüklenmemiş");
      return;
    }
    if (filePath.startsWith("data:")) {
      const blob = dataUrlToBlob(filePath);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } else {
      window.open(filePath, "_blank");
    }
  };

  /* Dosyayı indir */
  const handleDownload = (filePath, title) => {
    if (!filePath) {
      notify("Bu belge için dosya yüklenmemiş");
      return;
    }
    let href = filePath;
    if (filePath.startsWith("data:")) {
      const blob = dataUrlToBlob(filePath);
      href = URL.createObjectURL(blob);
    }
    const link = document.createElement("a");
    link.href = href;
    link.download = title || "belge";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (filePath.startsWith("data:")) {
      URL.revokeObjectURL(href);
    }
  };

  /* Dosya seçildiğinde base64'e çevir */
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => setNewFileData(reader.result);
      reader.readAsDataURL(file);
    }
  };

  /* Belge ekleme modalını sıfırla ve aç */
  const openAddModal = () => {
    setModalMode("add");
    setEditingDoc(null);
    setNewTitle("");
    setNewOwner("Bartu");
    setNewCategory(documentCategories[0].id);
    setNewFileData(null);
    setNewFileName("");
    setShowModal(true);
  };

  /* Belge düzenleme modalını mevcut değerlerle aç (silmeden değiştirme) */
  const openEditModal = (doc) => {
    setModalMode("edit");
    setEditingDoc(doc);
    setNewTitle(doc.title);
    setNewOwner(doc.owner);
    setNewCategory(doc.category || "diger");
    setNewFileData(null);
    setNewFileName("");
    setShowModal(true);
  };

  /* Belge sil (iki adımlı onaydan sonra) */
  const confirmDelete = (doc) => {
    if (doc.isCustom) {
      const updated = customDocs.filter((d) => d.id !== doc.id);
      setCustomDocs(updated);
      setItem(STORAGE_KEY, updated);
    } else {
      const updated = [...deletedIds, doc.id];
      setDeletedIds(updated);
      setItem(DELETED_KEY, updated);
    }
    setPendingDeleteId(null);
    notify("Belge silindi");
  };

  /* Ekle / Güncelle kaydı */
  const handleSubmit = () => {
    if (!newTitle.trim()) return;

    if (modalMode === "edit" && editingDoc) {
      const patch = {
        title: newTitle.trim(),
        owner: newOwner,
        category: newCategory,
      };
      if (newFileData) patch.file = newFileData;

      if (editingDoc.isCustom) {
        const updated = customDocs.map((d) =>
          d.id === editingDoc.id ? { ...d, ...patch } : d,
        );
        setCustomDocs(updated);
        setItem(STORAGE_KEY, updated);
      } else {
        const updatedOverrides = {
          ...overrides,
          [editingDoc.id]: { ...overrides[editingDoc.id], ...patch },
        };
        setOverrides(updatedOverrides);
        setItem(OVERRIDES_KEY, updatedOverrides);
      }
      notify("Belge güncellendi ✓");
    } else {
      const newDoc = {
        id: Date.now(),
        title: newTitle.trim(),
        owner: newOwner,
        category: newCategory,
        file: newFileData || "",
        isCustom: true,
      };
      const updatedDocs = [...customDocs, newDoc];
      setCustomDocs(updatedDocs);
      setItem(STORAGE_KEY, updatedDocs);
      notify("Belge eklendi ✓");
    }

    setShowModal(false);
    setEditingDoc(null);
  };

  return (
    <div className="px-5 py-6 animate-fade-in">
      {/* Başlık */}
      <div className="text-center" style={{ marginBottom: 20 }}>
        <h2 className="text-2xl font-bold text-white">Belgelerim</h2>
        <p className="text-slate-500 text-sm mt-2">
          Belgeleri görüntüleyin, düzenleyin veya indirin
        </p>
      </div>

      {/* Filtre + Ekle butonu */}
      <div className="flex items-center justify-between mb-6 gap-3">
        {/* Filtre sekmeleri */}
        <div className="flex gap-2 flex-wrap" role="group" aria-label="Sahibe göre filtrele">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer select-none ${
                filter === f
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-dark-surface text-slate-400 hover:bg-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Belge Ekle butonu */}
        <button
          onClick={openAddModal}
          aria-label="Yeni belge ekle"
          className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl bg-primary text-white hover:bg-primary-dark transition-all duration-200 cursor-pointer shadow-lg shadow-primary/20 active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>

      {filteredDocuments.length === 0 ? (
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
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </div>
          <p className="text-slate-500 text-sm">
            {filter === "Tümü"
              ? "Henüz belge eklenmemiş"
              : `${filter} için belge bulunamadı`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredDocuments.map((doc, index) => {
            const category = getCategory(doc.category);
            const isPendingDelete = pendingDeleteId === doc.id;

            return (
              <div
                key={doc.id}
                className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden animate-slide-up hover:border-white/10 transition-colors flex flex-col"
                style={{ animationDelay: `${Math.min(index, 10) * 0.06}s` }}
              >
                {/* Kategori banner */}
                <div className="h-24 relative overflow-hidden flex items-center justify-center bg-dark-surface/60">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-15`}
                    aria-hidden="true"
                  />
                  <CategoryIcon categoryId={doc.category} size="lg" />
                  {/* Sahip badge */}
                  <span
                    className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold shadow-lg ${
                      doc.owner === "Bartu"
                        ? "bg-primary text-white"
                        : "bg-secondary text-white"
                    }`}
                  >
                    {doc.owner}
                  </span>
                </div>

                {/* İçerik */}
                <div className="p-3 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-1 mb-3">
                    <h3 className="text-xs font-bold text-white line-clamp-2 flex-1" title={doc.title}>
                      {doc.title}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditModal(doc)}
                        aria-label={`${doc.title} belgesini düzenle`}
                        className="w-6 h-6 flex items-center justify-center rounded-lg bg-dark-surface hover:bg-primary/20 text-slate-500 hover:text-primary-light transition-all duration-200 cursor-pointer"
                        title="Düzenle"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3"
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
                        onClick={() => setPendingDeleteId(doc.id)}
                        aria-label={`${doc.title} belgesini sil`}
                        className="w-6 h-6 flex items-center justify-center rounded-lg bg-dark-surface hover:bg-danger/20 text-slate-500 hover:text-danger transition-all duration-200 cursor-pointer"
                        title="Belgeyi Sil"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3"
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
                  </div>

                  {!isPendingDelete ? (
                    <div className="flex flex-col gap-2 mt-auto">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleView(doc.file)}
                      >
                        <span className="flex items-center justify-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
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
                          Göster
                        </span>
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleDownload(doc.file, doc.title)}
                      >
                        <span className="flex items-center justify-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                            />
                          </svg>
                          İndir
                        </span>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 mt-auto animate-fade-in">
                      <p className="text-xs text-danger font-semibold text-center">
                        Silinsin mi?
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="danger"
                          size="sm"
                          className="flex-1"
                          onClick={() => confirmDelete(doc)}
                        >
                          Evet
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1"
                          onClick={() => setPendingDeleteId(null)}
                        >
                          Vazgeç
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Belge Ekle / Düzenle Modalı ── */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === "edit" ? "Belgeyi Düzenle" : "Yeni Belge Ekle"}
      >
        <div className="space-y-5">
          {/* Başlık */}
          <div>
            <label htmlFor="doc-title" className="block text-sm font-medium text-slate-400 mb-2">
              Belge Başlığı
            </label>
            <input
              id="doc-title"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Örn: Ehliyet Belgesi"
              className="w-full bg-dark-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition"
            />
          </div>

          {/* Sahip seçimi */}
          <div>
            <span className="block text-sm font-medium text-slate-400 mb-2">
              Kime Ait?
            </span>
            <div className="flex gap-3" role="group" aria-label="Belge sahibi">
              {OWNERS.map((owner) => (
                <button
                  key={owner}
                  type="button"
                  onClick={() => setNewOwner(owner)}
                  aria-pressed={newOwner === owner}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer select-none ${
                    newOwner === owner
                      ? owner === "Bartu"
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "bg-secondary text-white shadow-lg shadow-secondary/20"
                      : "bg-dark-surface text-slate-400 hover:bg-white/10 border border-white/5"
                  }`}
                >
                  {owner}
                </button>
              ))}
            </div>
          </div>

          {/* Kategori seçimi */}
          <div>
            <span className="block text-sm font-medium text-slate-400 mb-2">
              Kategori
            </span>
            <div className="grid grid-cols-4 gap-2" role="group" aria-label="Belge kategorisi">
              {documentCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setNewCategory(cat.id)}
                  aria-pressed={newCategory === cat.id}
                  title={cat.label}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl cursor-pointer transition-all duration-200 select-none ${
                    newCategory === cat.id
                      ? "bg-primary/20 border-2 border-primary"
                      : "bg-dark-surface border-2 border-transparent hover:border-white/10"
                  }`}
                >
                  <CategoryIcon categoryId={cat.id} size="sm" />
                  <span className="text-[10px] text-slate-300 font-medium leading-none text-center">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Dosya seçimi */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Belge Dosyası {modalMode === "edit" && "(değiştirmek isterseniz seçin)"}
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 rounded-xl bg-dark-surface border border-white/10 text-sm text-slate-400 hover:bg-white/5 transition cursor-pointer flex items-center justify-center gap-2"
            >
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
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                />
              </svg>
              {newFileName || "Dosya Seç"}
            </button>
          </div>

          {/* Kaydet butonu */}
          <Button
            variant="primary"
            size="md"
            className="w-full mt-2"
            onClick={handleSubmit}
            disabled={!newTitle.trim()}
          >
            <span className="flex items-center justify-center gap-2">
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
              {modalMode === "edit" ? "Değişiklikleri Kaydet" : "Belge Ekle"}
            </span>
          </Button>
        </div>
      </Modal>

      <Toast message={message} show={show} />
    </div>
  );
}
