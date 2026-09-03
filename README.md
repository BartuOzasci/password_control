<div align="center">

<img src="public/logo.png" alt="Güvenli Kasam Logo" width="120" style="border-radius:24px;" />

# 🔐 Güvenli Kasam

**Şifreleriniz ve belgeleriniz her zaman yanınızda, güvende.**

![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)
![PWA](https://img.shields.io/badge/PWA-Ready-5a0fc8?style=flat-square&logo=pwa)
![Accessibility](https://img.shields.io/badge/Accessibility-AA-22c55e?style=flat-square&logo=accessibility)

</div>

---

## 📱 Uygulama Hakkında

**Güvenli Kasam**, şifrelerinizi ve belgelerinizi tek bir yerden güvenle yönetmenizi sağlayan mobil öncelikli (PWA) bir React uygulamasıdır. Telefonunuzun ana ekranına ekleyerek native uygulama deneyimi yaşayabilirsiniz. Arayüz; koyu tema, cam efektli (glassmorphism) yüzeyler ve akıcı mikro-animasyonlarla profesyonel bir görünüme sahiptir.

---

## ✨ Özellikler

- 🔒 **Güvenli Giriş** — Kullanıcı adı & şifre ile kimlik doğrulama, erişilebilir form etiketleri ve otomatik doldurma desteği
- 🕐 **Otomatik Oturum** — 30 gün boyunca tekrar giriş yapmaya gerek yok
- 🔑 **Şifre Yöneticisi** — Şifreleri ekle, görüntüle (••• maskesi), **silmeden düzenle**, panoya kopyala, sil
- ✏️ **Düzenlenebilir Kayıtlar** — Hem şifreler hem belgeler; kaydı silmeden başlık/sahip/kategori/şifre güncellenebilir
- 🗑️ **Güvenli Silme** — Yanlışlıkla silmeyi önlemek için iki adımlı onay ("Silinsin mi? Evet, Sil / Vazgeç")
- 🏷️ **Kategori İkon Sistemi** — Her belge türü (Kimlik, Araç, Sigorta, Sağlık, Eğitim, Askerlik, Resmi Evrak, Diğer) kendine özgü gradyanlı ikonla temsil edilir
- 🔔 **Anlık Geri Bildirim** — Kopyalama, ekleme, güncelleme ve silme işlemlerinde toast bildirimleri
- 📄 **Belge Merkezi** — Belgeleri görüntüle, indir, düzenle; Bartu/Bülent'e göre filtrele
- ♿ **Erişilebilirlik Odaklı** — Klavye ile tam gezinme, `aria-label`/`aria-live` etiketleri, odak (focus) halkaları, "İçeriğe geç" bağlantısı, azaltılmış hareket (reduced motion) desteği
- 📐 **Duyarlı (Responsive) Tasarım** — Mobilde tek sütun, tablet ve masaüstünde çok sütunlu grid düzenleri; tüm dokunma hedefleri 44px+ boyutunda
- 📲 **PWA / Ana Ekrana Ekle** — Safari/Chrome üzerinden ana ekrana eklenebilir
- 🌙 **Karanlık Tema** — Göz yormayan, gradyan aksanlı modern koyu arayüz
- 💾 **Yerel Depolama** — Tüm veriler cihazda, sunucuya gönderilmez

---

## 🚀 Kurulum & Çalıştırma

### Gereksinimler

- [Node.js](https://nodejs.org/) 18 veya üzeri (npm ile birlikte gelir)
- [VS Code](https://code.visualstudio.com/) (önerilir)

### VS Code ile Adım Adım Çalıştırma

1. Bu klasörü VS Code ile açın (`File → Open Folder…` → `password_control`)
2. VS Code içinde bir terminal açın (`Terminal → New Terminal` veya <kbd>Ctrl</kbd>+<kbd>ö</kbd>)
3. Bağımlılıkları yükleyin:

   ```bash
   npm install
   ```

4. Geliştirme sunucusunu başlatın:

   ```bash
   npm run dev
   ```

5. Terminalde çıkan `http://localhost:5173` bağlantısına <kbd>Ctrl</kbd> tuşuna basılı tutarak tıklayın (veya tarayıcınızda elle açın)

### Diğer komutlar

```bash
# Üretim (production) build al
npm run build

# Build çıktısını yerelde önizle
npm run preview

# Kod kalitesi kontrolü (ESLint)
npm run lint
```

---

## 📁 Proje Yapısı

```
password_control/
├── public/
│   ├── logo.png              ← Uygulama logosu (PWA ikonu dahil)
│   ├── manifest.json         ← PWA manifest
│   ├── sw.js                 ← Service Worker
│   └── publicdocuments/      ← Belge dosyaları (PDF/PNG)
└── src/
    ├── config/
    │   ├── constants.js          ← Uygulama geneli sabitler (tek kaynak)
    │   └── documentCategories.js ← Belge kategorileri (ikon + gradyan tanımları)
    ├── data/
    │   ├── users.js           ← Kullanıcı listesi
    │   ├── documentsData.js   ← Belge verileri (başlık, sahip, kategori, dosya)
    │   └── passwordsData.js   ← Varsayılan şifreler
    ├── utils/
    │   ├── storage.js         ← localStorage yardımcıları
    │   └── avatarColor.js     ← Şifre kartları için deterministik avatar rengi
    ├── hooks/
    │   ├── useAuth.js         ← Kimlik doğrulama hook'u
    │   └── useToast.js        ← Kısa bilgilendirme mesajları
    └── components/
        ├── common/            ← Button, Loading, Modal, Toast, CategoryIcon
        ├── layout/             ← Navbar
        ├── auth/               ← LoginScreen
        ├── home/               ← HomeScreen
        ├── passwords/          ← PasswordsScreen (ekle / düzenle / sil / kopyala)
        └── documents/          ← DocumentsScreen (ekle / düzenle / sil / filtrele)
```

---

## 📲 Mobilde Ana Ekrana Ekleme

### iOS (Safari)

1. Uygulamayı Safari'de aç
2. Alt menüden **Paylaş** butonuna dokun
3. **"Ana Ekrana Ekle"** seçeneğini seç
4. İsmi onayla → **Ekle**

### Android (Chrome)

1. Uygulamayı Chrome'da aç
2. Sağ üstten **⋮ Menü** → **"Ana Ekrana Ekle"**
3. Onayla → Ana ekranda uygulama ikonu görünür

---

## ⚙️ Kişiselleştirme

### Şifre düzenleme / silme

Şifreler ekranında her kartın altındaki kalem (✎) ikonu, kaydı **silmeden** başlık ve şifreyi değiştirmenizi sağlar. Çöp kutusu ikonuna basıldığında iki adımlı bir onay istenir; "Vazgeç" ile işlem her zaman iptal edilebilir.

### Yeni belge eklemek / düzenlemek

1. Belgeler ekranındaki **+** butonuna basarak başlık, sahip, kategori ve dosya seçin
2. Var olan bir belgeyi silmeden güncellemek için kartın üzerindeki kalem (✎) ikonuna basın
3. Belgeyi kalıcı olarak `public/publicdocuments/` klasörüne eklemek isterseniz dosyayı oraya koyup `src/data/documentsData.js` içine yeni bir satır ekleyin

### Yeni belge kategorisi eklemek

`src/config/documentCategories.js` dosyasına yeni bir `{ id, label, icon, gradient }` nesnesi ekleyin ve `src/components/common/CategoryIcon.jsx` içindeki `paths` nesnesine ilgili ikonu tanımlayın.

### Yeni kullanıcı eklemek

`src/data/users.js` dosyasına yeni `{ username, password }` nesnesi ekleyin.

### Oturum süresini değiştirmek

`src/config/constants.js` içindeki `SESSION_DURATION_MS` değerini güncelleyin.

---

## ♿ Erişilebilirlik Notları

- Tüm etkileşimli öğeler klavye ile (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Esc</kbd>) kullanılabilir
- İkon-only butonlarda ekran okuyucular için `aria-label` bulunur
- Pencereler (modal) `role="dialog"` ve odak yönetimi ile açılır, `Esc` ile kapanır
- Sistem düzeyinde "hareketi azalt" tercihi etkinse animasyonlar otomatik olarak kısılır
- Tüm dokunma hedefleri (buton, ikon) en az 44×44px boyutundadır

---

## 🛡️ Güvenlik Notu

Tüm veriler yalnızca **cihazın yerel depolama alanına (localStorage)** kaydedilir. Hiçbir veri dış sunucuya gönderilmez.

---

<div align="center">
  <sub>Made with ❤️ by Bartu Özaşcı</sub>
</div>
