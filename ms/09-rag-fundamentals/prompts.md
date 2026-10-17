# 09 - Asas Retrieval-Augmented Generation (RAG): Prompt

Prompt untuk mencari dan membetulkan citation yang salah. Tambah kedua-dua PDF daripada [sample-files.zip](../../09-rag-fundamentals/sample-files.zip) ke dalam satu notebook dahulu. Halakan tetikus ke atas kotak kelabu dan klik ikon salin di penjuru kanan atasnya.

> **Panduan sesi:** setiap bahagian dijalankan dalam **notebook yang sama** (atau Project).

---

## Bahagian 1: Empat soalan

**Sesi:** notebook baharu dengan kedua-dua versi polisi | **Sumber:** sumber notebook

```
Jawab daripada sumber, dengan nombor klausa dan versi polisi yang anda gunakan. Berapakah jumlah maksimum yang boleh kami bayar secara pendahuluan sebelum Pengarah Kewangan perlu meluluskannya?
```

```
Berapa lama sebut harga pembekal mesti sah? Beri klausa dan versi polisi.
```

```
Siapa yang perlu meluluskan pembelian bernilai RM80,000 termasuk cukai? Beri klausa dan versi polisi.
```

```
Adakah sebut harga perlu menunjukkan nombor pendaftaran SST pembekal? Beri klausa dan versi polisi.
```

Jika jawapan tidak menyebut versi:

```
Daripada versi polisi mana jawapan itu? Semak pengepala halaman.
```

---

## Bahagian 2: Diagnosis

**Sesi:** notebook yang sama | **Sumber:** sumber notebook

```
Bagi jawapan anda tentang bayaran pendahuluan, tunjukkan petikan daripada sumber yang menjadi asas jawapan itu, dengan nama dokumen, halaman dan klausa bagi setiap satu. Kemudian terangkan mengapa petikan daripada Version 2.1 boleh kelihatan relevan dengan soalan itu.
```

---

## Bahagian 3: Cara A, beritahu alat itu versi mana yang diguna pakai

**Sesi:** notebook yang sama | **Sumber:** sumber notebook

```
Mulai sekarang, guna Polisi Perolehan Version 3.0 sahaja, berkuat kuasa 1 Julai 2026. Version 2.1 telah dibatalkan (superseded): abaikannya kecuali saya bertanya tentangnya dengan menyebut namanya. Sekarang jawab semula: berapakah jumlah maksimum yang boleh kami bayar secara pendahuluan sebelum Pengarah Kewangan perlu meluluskannya?
```

Untuk Cara B, buang `procurement-policy-v2.1.pdf` daripada sumber dan tanya soalan Bahagian 1 sekali lagi.
