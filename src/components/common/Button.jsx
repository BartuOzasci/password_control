/* ─────────────────────────────────────────────
   Ortak Button bileşeni.
   variant: 'primary' | 'secondary' | 'danger' | 'ghost'
   ───────────────────────────────────────────── */

const variants = {
  primary:
    "bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20",
  secondary:
    "bg-secondary hover:bg-secondary-dark text-white shadow-lg shadow-secondary/20",
  danger: "bg-danger hover:bg-red-600 text-white",
  ghost: "bg-transparent hover:bg-white/10 text-slate-300",
  success: "bg-success hover:bg-green-600 text-white",
};

const sizes = {
  sm: "px-4 py-2.5 text-sm rounded-xl min-h-[44px]",
  md: "px-6 py-3.5 text-base rounded-xl min-h-[48px]",
  lg: "px-8 py-4 text-lg rounded-2xl min-h-[52px]",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <button
      className={`
        font-semibold transition-all duration-200 active:scale-95
        cursor-pointer select-none inline-flex items-center justify-center
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
