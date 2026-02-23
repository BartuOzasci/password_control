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
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
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
        cursor-pointer select-none
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
