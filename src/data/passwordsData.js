/* ─────────────────────────────────────────────
   Varsayılan şifreler verisi.
   Uygulama ilk açıldığında localStorage boşsa
   bu veriler yüklenir.
   
   Yeni şifre eklemek için diziye nesne ekleyin:
     { id, title, password }
   ───────────────────────────────────────────── */

const defaultPasswords = [
  { id: 1, title: 'E-posta Hesabı', password: 'ornek123' },
  { id: 2, title: 'Wi-Fi Şifresi', password: 'wifi_pass_456' },
];

export default defaultPasswords;
