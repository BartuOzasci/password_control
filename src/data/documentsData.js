/* ─────────────────────────────────────────────
   Belgeler verisi.
   Her belge için:
     - id       : benzersiz numara
     - title    : kart başlığı
     - owner    : belge sahibi
     - category : documentCategories.js içindeki kategori id'si
     - file     : documents/ klasöründeki dosya yolu

   Yeni belge eklemek için diziye nesne ekleyin,
   dosyayı /publicdocuments/ klasörüne koyun.
   ───────────────────────────────────────────── */

const documentsData = [
  {
    id: 1,
    title: "Bartu Adli Sicil Kaydı",
    owner: "Bartu",
    category: "resmi",
    file: "/publicdocuments/bartu_adlisicil.pdf",
  },
  {
    id: 2,
    title: "Bartu Askerlik Durum Belgesi",
    owner: "Bartu",
    category: "asker",
    file: "/publicdocuments/bartu_asker.pdf",
  },
  {
    id: 3,
    title: "Bartu Ehliyet Belgesi",
    owner: "Bartu",
    category: "arac",
    file: "/publicdocuments/bartu_ehliyet.pdf",
  },
  {
    id: 4,
    title: "Bartu İkamet Belgesi",
    owner: "Bartu",
    category: "kimlik",
    file: "/publicdocuments/bartu_ikamet.pdf",
  },
  {
    id: 5,
    title: "Bartu Araç Kasko Belgesi",
    owner: "Bartu",
    category: "sigorta",
    file: "/publicdocuments/bartu_kasko.png",
  },
  {
    id: 6,
    title: "Bartu Kimlik Belgesi",
    owner: "Bartu",
    category: "kimlik",
    file: "/publicdocuments/bartu_kimlik.pdf",
  },
  {
    id: 7,
    title: "Bartu Mezuniyet Belgesi",
    owner: "Bartu",
    category: "egitim",
    file: "/publicdocuments/bartu_mezuniyet.pdf",
  },
  {
    id: 8,
    title: "Bartu Monster Garanti Belgesi",
    owner: "Bartu",
    category: "diger",
    file: "/publicdocuments/bartu_monster.pdf",
  },
  {
    id: 9,
    title: "Bartu Nüfus Kayıt Belgesi",
    owner: "Bartu",
    category: "kimlik",
    file: "/publicdocuments/bartu_nüfus.pdf",
  },
  {
    id: 10,
    title: "Bartu Sağlık Belgesi",
    owner: "Bartu",
    category: "saglik",
    file: "/publicdocuments/bartu_sağlık.pdf",
  },
  {
    id: 11,
    title: "Bartu Araç Trafik Sigortası",
    owner: "Bartu",
    category: "sigorta",
    file: "/publicdocuments/bartu_trafik.png",
  },
  {
    id: 12,
    title: "Bartu Yangın Sigortası",
    owner: "Bartu",
    category: "sigorta",
    file: "/publicdocuments/bartu_yangın.png",
  },
  {
    id: 13,
    title: "Bülent Sağlık Sigortası Poliçesi",
    owner: "Bülent",
    category: "sigorta",
    file: "/publicdocuments/bülent_sağlık.pdf",
  },
];

export default documentsData;
