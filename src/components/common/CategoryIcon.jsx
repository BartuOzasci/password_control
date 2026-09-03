/* ─────────────────────────────────────────────
   CategoryIcon – belge kategorisine göre gradyanlı
   rozet + ikon render eder. documentCategories.js
   içindeki `icon` adına göre uygun SVG çizilir.
   ───────────────────────────────────────────── */

import { getCategory } from "../../config/documentCategories";

const paths = {
  "id-card": (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <circle cx="8.5" cy="12" r="2" />
      <path strokeLinecap="round" d="M13.5 10.5h5M13.5 13.5h3.5" />
    </>
  ),
  "steering-wheel": (
    <>
      <circle cx="12" cy="12" r="8.25" />
      <circle cx="12" cy="12" r="2" />
      <path strokeLinecap="round" d="M12 5.25V9M6.3 15.8l3.4-2m8 2-3.4-2" />
    </>
  ),
  "shield-check": (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.75 5.25 6v5.5c0 4.2 2.85 7.35 6.75 8.75 3.9-1.4 6.75-4.55 6.75-8.75V6L12 3.75Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
    </>
  ),
  "heart-pulse": (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 20.25S3.75 15.75 3.75 9.75a4.5 4.5 0 0 1 8.25-2.5 4.5 4.5 0 0 1 8.25 2.5c0 .86-.16 1.65-.44 2.4h-3.4l-1.6-2.9-2.1 5.4-1.4-2.5H6.9"
    />
  ),
  "graduation-cap": (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m3 9 9-4.5 9 4.5-9 4.5L3 9Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11v4.2c0 1 2.2 2.3 5 2.3s5-1.3 5-2.3V11" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 9v5.25" />
    </>
  ),
  medal: (
    <>
      <circle cx="12" cy="15" r="5.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.5 10.5-3-6.75m8 6.75 3-6.75m-9 2.25h6.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.3 15.3 12 17l3-3" />
    </>
  ),
  scale: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M7 21h10M12 6 5.5 9.5 12 13m0-7 6.5 3.5L12 13" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.5 2 13.5c0 1.4 1.5 2.25 3 2.25s3-.85 3-2.25L6.25 9.5M20.25 9.5 18.5 13.5c0 1.4 1.5 2.25 3 2.25s3-.85 3-2.25l-1.75-4" />
    </>
  ),
  folder: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 7.5A1.5 1.5 0 0 1 5.25 6h4.19c.4 0 .78.16 1.06.44l1.5 1.5c.28.28.66.44 1.06.44h5.69a1.5 1.5 0 0 1 1.5 1.5v7.62a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V7.5Z"
    />
  ),
};

export default function CategoryIcon({
  categoryId,
  size = "md",
  className = "",
}) {
  const category = getCategory(categoryId);
  const sizes = {
    sm: "w-9 h-9",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  };
  const iconSizes = {
    sm: "w-4.5 h-4.5",
    md: "w-7 h-7",
    lg: "w-10 h-10",
  };

  return (
    <div
      role="img"
      aria-label={`${category.label} kategorisi`}
      className={`flex items-center justify-center rounded-2xl bg-gradient-to-br ${category.gradient} text-white shrink-0 ${sizes[size]} ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={iconSizes[size]}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.6}
      >
        {paths[category.icon] || paths.folder}
      </svg>
    </div>
  );
}
