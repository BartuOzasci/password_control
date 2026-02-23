/* ─────────────────────────────────────────────
   Belgeler Ekranı
   - documentsData'dan belgeleri kart şeklinde listeler
   - Her kartta: resim, başlık, Göster & İndir butonları
   - Göster: PDF'i yeni sekmede açar
   - İndir: PDF'i indirir
   ───────────────────────────────────────────── */

import documentsData from "../../data/documentsData";
import Button from "../common/Button";

export default function DocumentsScreen() {
  /* PDF'i yeni sekmede aç */
  const handleView = (filePath) => {
    window.open(filePath, "_blank");
  };

  /* PDF'i indir */
  const handleDownload = (filePath, title) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="px-4 py-5 animate-fade-in">
      {/* Başlık */}
      <div className="text-center mb-5">
        <h2 className="text-lg font-bold text-white">Belgelerim</h2>
        <p className="text-slate-500 text-xs mt-1">
          Belgeleri görüntüleyin veya indirin
        </p>
      </div>

      {documentsData.length === 0 ? (
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
          <p className="text-slate-500 text-sm">Henüz belge eklenmemiş</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {documentsData.map((doc, index) => (
            <div
              key={doc.id}
              className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Resim */}
              <div className="aspect-[4/3] bg-dark-surface flex items-center justify-center overflow-hidden">
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

              {/* İçerik */}
              <div className="p-3">
                <h3 className="text-sm font-bold text-white truncate mb-3">
                  {doc.title}
                </h3>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => handleView(doc.file)}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3.5 h-3.5"
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
                    className="w-full text-xs"
                    onClick={() => handleDownload(doc.file, doc.title)}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3.5 h-3.5"
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
    </div>
  );
}
