/* ─────────────────────────────────────────────
   Belgeler Ekranı
   - documentsData'dan belgeleri kart şeklinde listeler
   - Bartu / Bülent filtreleme
   - Uygulama içinden belge ekleme (başlık, sahip, resim seçimi)
   - Uygulama içinden belge silme
   - Her kartta: resim, başlık, Göster & İndir butonları
   ───────────────────────────────────────────── */

import { useState, useRef } from "react";
import initialDocumentsData from "../../data/documentsData";
import { getItem, setItem } from "../../utils/storage";
import Button from "../common/Button";
import Modal from "../common/Modal";

/* localStorage anahtarları */
const STORAGE_KEY = "custom_documents";
const DELETED_KEY = "deleted_document_ids";

/* Seçilebilir resimler */
const IMAGE_OPTIONS = [
  { label: "Belge", src: "/publicimg/belge.png" },
  { label: "Araç", src: "/publicimg/araba.png" },
  { label: "Sağlık", src: "/publicimg/sağlık.png" },
];

/* Sahip seçenekleri */
const OWNERS = ["Bartu", "Bülent"];

/* Filtre seçenekleri */
const FILTERS = ["Tümü", "Bartu", "Bülent"];

export default function DocumentsScreen() {
  /* State */
  const [filter, setFilter] = useState("Tümü");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newOwner, setNewOwner] = useState("Bartu");
  const [newImage, setNewImage] = useState(IMAGE_OPTIONS[0].src);
  const [newFileData, setNewFileData] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const fileInputRef = useRef(null);

  /* localStorage'dan eklenen/silinen belgeleri oku */
  const [customDocs, setCustomDocs] = useState(() => {
    return getItem(STORAGE_KEY) || [];
  });
  const [deletedIds, setDeletedIds] = useState(() => {
    return getItem(DELETED_KEY) || [];
  });

  /* Tüm belgeler: varsayılan (silinmemiş) + kullanıcı eklenen */
  const allDocuments = [
    ...initialDocumentsData.filter((d) => !deletedIds.includes(d.id)),
    ...customDocs,
  ];

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

  /* PDF'i yeni sekmede aç */
  const handleView = (filePath) => {
    if (!filePath) return;
    if (filePath.startsWith("data:")) {
      const blob = dataUrlToBlob(filePath);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } else {
      window.open(filePath, "_blank");
    }
  };

  /* PDF'i indir */
  const handleDownload = (filePath, title) => {
    if (!filePath) return;
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
      reader.onload = () => {
        setNewFileData(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /* Belge ekleme modalını sıfırla ve aç */
  const openAddModal = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setNewTitle("");
    setNewOwner("Bartu");
    setNewImage(IMAGE_OPTIONS[0].src);
    setNewFileData(null);
    setNewFileName("");
    setTimeout(() => setShowAddModal(true), 300);
  };

  /* Belge sil */
  const handleDelete = (doc) => {
    if (doc.isCustom) {
      const updated = customDocs.filter((d) => d.id !== doc.id);
      setCustomDocs(updated);
      setItem(STORAGE_KEY, updated);
    } else {
      const updated = [...deletedIds, doc.id];
      setDeletedIds(updated);
      setItem(DELETED_KEY, updated);
    }
  };

  /* Yeni belge kaydet */
  const handleAddDocument = () => {
    if (!newTitle.trim()) return;

    const newDoc = {
      id: Date.now(),
      title: newTitle.trim(),
      owner: newOwner,
      image: newImage,
      file: newFileData || "",
      isCustom: true,
    };

    const updatedDocs = [...customDocs, newDoc];
    setCustomDocs(updatedDocs);
    setItem(STORAGE_KEY, updatedDocs);

    setShowAddModal(false);
  };

  return (
    <div className="px-5 py-6 animate-fade-in">
      {/* Başlık */}
      <div className="text-center" style={{ marginBottom: 20 }}>
        <h2 className="text-2xl font-bold text-white">Belgelerim</h2>
        <p className="text-slate-500 text-sm mt-2">
          Belgeleri görüntüleyin veya indirin
        </p>
      </div>

      {/* Filtre + Ekle butonu */}
      <div className="flex items-center justify-between mb-6">
        {/* Filtre sekmeleri */}
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
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
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white hover:bg-primary-dark transition-all duration-200 cursor-pointer shadow-lg shadow-primary/20"
          title="Belge Ekle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
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
        <div className="grid grid-cols-2" style={{ gap: 12 }}>
          {filteredDocuments.map((doc, index) => (
            <div
              key={doc.id}
              className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Sahip etiketi */}
              <div className="relative">
                <div className="h-28 bg-dark-surface flex items-center justify-center overflow-hidden">
                  <img
                    src={doc.image}
                    alt={doc.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    className="hidden w-full h-full items-center justify-center"
                    style={{ display: "none" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-12 h-12 text-slate-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    </svg>
                  </div>
                </div>
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
              <div className="p-3">
                <div className="flex items-start justify-between gap-1 mb-3">
                  <h3 className="text-xs font-bold text-white truncate flex-1">
                    {doc.title}
                  </h3>
                  {/* Sil butonu */}
                  <button
                    onClick={() => handleDelete(doc)}
                    className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-lg bg-dark-surface hover:bg-danger/20 text-slate-500 hover:text-danger transition-all duration-200 cursor-pointer"
                    title="Belgeyi Sil"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3"
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
                  </button>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
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
                    className="flex-1"
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Belge Ekleme Modalı ── */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Yeni Belge Ekle"
      >
        <div className="space-y-5">
          {/* Başlık */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Belge Başlığı
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Örn: Ehliyet Belgesi"
              className="w-full bg-dark-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition"
            />
          </div>

          {/* Sahip seçimi */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Kime Ait?
            </label>
            <div className="flex gap-3">
              {OWNERS.map((owner) => (
                <button
                  key={owner}
                  onClick={() => setNewOwner(owner)}
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

          {/* Resim seçimi */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Kapak Görseli
            </label>
            <div className="flex gap-3">
              {IMAGE_OPTIONS.map((img) => (
                <button
                  key={img.src}
                  onClick={() => setNewImage(img.src)}
                  className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-all duration-200 select-none ${
                    newImage === img.src
                      ? "bg-primary/20 border-2 border-primary"
                      : "bg-dark-surface border-2 border-transparent hover:border-white/10"
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.label}
                    className="w-10 h-10 object-contain rounded-lg"
                  />
                  <span className="text-xs text-slate-300 font-medium">
                    {img.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Dosya seçimi */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Belge Dosyası (PDF)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
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
            onClick={handleAddDocument}
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
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Belge Ekle
            </span>
          </Button>
        </div>
      </Modal>
    </div>
  );
}
