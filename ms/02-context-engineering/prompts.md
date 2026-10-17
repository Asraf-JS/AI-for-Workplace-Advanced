# 02 - Context Engineering dan Structured Output: Prompt

Prompt chain tiga langkah pada RFQ kerusi Sinar Maju. Muat naik `rfq-2026-118.pdf` daripada [fail sampel Modul 01](../../01-how-llms-behave/sample-files.zip) sebelum Bahagian 1. Halakan tetikus ke atas kotak kelabu dan klik ikon salin di penjuru kanan atasnya.

> **Panduan sesi:** Bahagian 1 hingga 3 dijalankan dalam **chat yang sama**. Bahagian 4 dijalankan dalam new chat.

---

## Bahagian 1: Keluarkan keperluan

**Sesi:** new chat | **Sumber:** fail yang dimuat naik (`rfq-2026-118.pdf`)

```
Goal: senaraikan setiap keperluan dalam permintaan sebut harga yang dilampirkan (RFQ-2026-118) supaya saya boleh menyemak sebut harga pembekal berdasarkannya.
Context: Saya eksekutif perolehan di Sinar Maju Sdn Bhd, sebuah pengedar bekalan pejabat. Kami akan menerima beberapa sebut harga untuk RFQ ini.
Source: guna RFQ yang dilampirkan sahaja. Jika sesuatu tidak dinyatakan dalam RFQ, jangan tambah.
Expectations: jadual Markdown dengan tiga lajur: Keperluan, Ayat tepat daripada RFQ, Cara menyemaknya dalam sebut harga. Masukkan juga keperluan tentang apa yang mesti ada dalam sebut harga, bukan keperluan produk sahaja.
```

Jika ada baris yang tiada dalam RFQ:

```
Buang mana-mana baris yang tidak boleh anda petik daripada RFQ.
```

---

## Bahagian 2: Jadual perbandingan

**Sesi:** chat yang sama | **Sumber:** fail yang dimuat naik

```
Guna jadual keperluan di atas sahaja, buat jadual perbandingan kosong dalam Markdown untuk tiga sebut harga pembekal. Satu baris bagi setiap keperluan. Lajur: Keperluan, Pembekal A, Pembekal B, Pembekal C, Memenuhi RFQ? Biarkan sel pembekal kosong. Tambah baris di bahagian bawah untuk Grand total (RM), Sah sehingga dan Terma pembayaran.
```

---

## Bahagian 3: Keperluan yang sama dalam bentuk JSON

**Sesi:** chat yang sama | **Sumber:** fail yang dimuat naik

```
Sekarang beri saya keperluan yang sama dalam bentuk JSON, supaya sistem lain boleh membacanya. Guna senarai objek, setiap satu dengan field ini: "id" (R1, R2 dan seterusnya), "requirement", "rfq_wording" dan "how_to_check". Beri JSON sahaja, tanpa penerangan sebelum atau selepasnya.
```

Jika ada teks di sekeliling JSON:

```
Beri JSON sahaja.
```

---

## Bahagian 4: Satu prompt besar, sebagai perbandingan

**Sesi:** new chat | **Sumber:** fail yang dimuat naik (`rfq-2026-118.pdf`)

```
Baca RFQ yang dilampirkan, senaraikan semua keperluan, buat jadual perbandingan kosong untuk tiga pembekal, dan beri saya keperluan itu dalam bentuk JSON.
```
