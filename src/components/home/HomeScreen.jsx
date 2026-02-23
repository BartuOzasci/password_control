/* ─────────────────────────────────────────────
   Ana Ekran – Şifreler ve Belgeler kartları.
   ───────────────────────────────────────────── */

export default function HomeScreen({ onNavigate }) {
  const cards = [
    {
      key: "passwords",
      title: "ŞİFRELER",
      subtitle: "Kayıtlı şifrelerinizi yönetin",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
          />
        </svg>
      ),
      gradient: "from-primary to-indigo-700",
      glow: "shadow-primary/30",
    },
    {
      key: "documents",
      title: "BELGELER",
      subtitle: "Belgelerinize erişin",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10"
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
      ),
      gradient: "from-secondary to-cyan-700",
      glow: "shadow-secondary/30",
    },
  ];

  return (
    <div className="px-5 py-8 animate-fade-in">
      {/* Başlık */}
      <div className="text-center" style={{ marginBottom: 32 }}>
        <h2 className="text-2xl font-bold text-white">Ne yapmak istersiniz?</h2>
        <p className="text-slate-500 text-base" style={{ marginTop: 8 }}>
          Aşağıdan bir kategori seçin
        </p>
      </div>

      {/* Kartlar */}
      <div className="flex flex-col" style={{ gap: 40 }}>
        {cards.map((card, i) => (
          <button
            key={card.key}
            onClick={() => onNavigate(card.key)}
            className={`
              w-full flex items-center gap-5 p-6
              bg-gradient-to-r ${card.gradient}
              rounded-3xl shadow-xl ${card.glow}
              active:scale-[0.97] transition-all duration-200
              cursor-pointer text-left min-h-[100px]
            `}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {/* Icon */}
            <div className="w-18 h-18 flex items-center justify-center bg-white/15 backdrop-blur rounded-2xl text-white shrink-0">
              {card.icon}
            </div>

            {/* Text */}
            <div>
              <h3 className="text-2xl font-extrabold text-white tracking-wide">
                {card.title}
              </h3>
              <p className="text-white/70 text-base mt-1">{card.subtitle}</p>
            </div>

            {/* Arrow */}
            <div className="ml-auto text-white/40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Alt bilgi */}
      <div className="text-center" style={{ marginTop: 48 }}>
        <div className="inline-flex items-center gap-2 bg-dark-card border border-white/5 rounded-full px-4 py-2">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-sm text-slate-500">
            Tüm veriler cihazınızda şifreli saklanır
          </span>
        </div>
      </div>
    </div>
  );
}
