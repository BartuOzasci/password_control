/* ─────────────────────────────────────────────
   Belgeler verisi.
   Her belge için:
     - id       : benzersiz numara
     - title    : kart başlığı
     - image    : img/ klasöründeki görsel yolu
     - file     : documents/ klasöründeki PDF yolu
   
   Yeni belge eklemek için diziye nesne ekleyin,
   görseli /img/ klasörüne, PDF'i /documents/ klasörüne koyun.
   ───────────────────────────────────────────── */

const documentsData = [
  {
    id: 1,
    title: 'Örnek Belge 1',
    image: '/img/belge1.png',
    file: '/documents/belge1.pdf',
  },
  {
    id: 2,
    title: 'Örnek Belge 2',
    image: '/img/belge2.png',
    file: '/documents/belge2.pdf',
  },
];

export default documentsData;
