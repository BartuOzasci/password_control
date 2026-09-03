/* ─────────────────────────────────────────────
   Belge kategorileri.
   Her kategori; ikon adı, renk grade'i ve etiket
   içerir. documentsData.js ve DocumentsScreen
   bu listeden kategori seçer / render eder.
   ───────────────────────────────────────────── */

const documentCategories = [
  {
    id: "kimlik",
    label: "Kimlik",
    icon: "id-card",
    gradient: "from-indigo-500 to-blue-700",
  },
  {
    id: "arac",
    label: "Araç",
    icon: "steering-wheel",
    gradient: "from-sky-500 to-cyan-700",
  },
  {
    id: "sigorta",
    label: "Sigorta",
    icon: "shield-check",
    gradient: "from-violet-500 to-purple-700",
  },
  {
    id: "saglik",
    label: "Sağlık",
    icon: "heart-pulse",
    gradient: "from-rose-500 to-pink-700",
  },
  {
    id: "egitim",
    label: "Eğitim",
    icon: "graduation-cap",
    gradient: "from-amber-500 to-orange-700",
  },
  {
    id: "asker",
    label: "Askerlik",
    icon: "medal",
    gradient: "from-emerald-500 to-teal-700",
  },
  {
    id: "resmi",
    label: "Resmi Evrak",
    icon: "scale",
    gradient: "from-slate-500 to-slate-700",
  },
  {
    id: "diger",
    label: "Diğer",
    icon: "folder",
    gradient: "from-fuchsia-500 to-rose-700",
  },
];

export const getCategory = (id) =>
  documentCategories.find((c) => c.id === id) ||
  documentCategories[documentCategories.length - 1];

export default documentCategories;
