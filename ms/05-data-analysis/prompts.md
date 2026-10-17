# 05 - Analisis Data Lanjutan dengan AI: Prompt

Prompt untuk menganalisis sejarah pembelian Sinar Maju. Muat naik `purchase-history.xlsx` daripada [sample-files.zip](../../05-data-analysis/sample-files.zip) sebelum Bahagian 1. Halakan tetikus ke atas kotak kelabu dan klik ikon salin di penjuru kanan atasnya.

> **Panduan sesi:** setiap bahagian dijalankan dalam **chat yang sama**, iaitu chat tempat anda memuat naik fail itu.

---

## Bahagian 1: Tinjauan pertama

**Sesi:** new chat | **Sumber:** fail yang dimuat naik (`purchase-history.xlsx`)

```
Ini ialah eksport pesanan belian Sinar Maju Sdn Bhd, Januari 2025 hingga September 2026. Baca kedua-dua sheet. Beritahu saya berapa banyak baris dan lajur yang ada, julat tarikhnya, dan maksud setiap lajur. Jangan analisis apa-apa lagi.
```

---

## Bahagian 2: Masalah data

**Sesi:** chat yang sama | **Sumber:** fail yang dimuat naik

```
Sebelum apa-apa analisis, semak kualiti data. Cari: baris yang merupakan pendua tepat, baris dengan Department kosong, pembekal yang sama dieja dengan cara berbeza, dan pesanan yang dibatalkan. Bagi setiap masalah, beritahu saya berapa banyak baris dan senaraikan nombor PO. Jangan ubah apa-apa lagi.
```

Jika ia tidak menemui sebarang pendua:

```
Bandingkan baris lengkap, kesemua 17 lajur, bukan nombor PO sahaja.
```

---

## Bahagian 3: Ringkasan perbelanjaan

**Sesi:** chat yang sama | **Sumber:** fail yang dimuat naik

```
Sekarang bersihkan data: kira setiap baris pendua sekali sahaja, kumpulkan pembekal mengikut Vendor ID, dan kecualikan pesanan yang dibatalkan. Dengan menggunakan Total (RM), beri saya: bilangan pesanan belian unik, jumlah perbelanjaan, perbelanjaan pada 2025, perbelanjaan dari Januari hingga September 2026, lima pembekal teratas mengikut perbelanjaan, dan perbelanjaan mengikut kategori bersama bahagian setiap kategori. Tunjukkan kaedah yang anda gunakan.
```

---

## Bahagian 4: Corak

**Sesi:** chat yang sama | **Sumber:** fail yang dimuat naik

```
Cari apa-apa yang patut diketahui oleh Pengarah Kewangan. Khususnya:
1. Mana-mana pembekal yang purata perbelanjaan bulanannya berubah dengan mendadak dan kekal pada paras baharu itu. Bilakah ia berubah, dan sebanyak mana?
2. Pesanan daripada jabatan yang sama kepada pembekal yang sama dalam tempoh 30 hari yang setiap satunya bawah RM5,000, tiada Contract Ref, dan berjumlah RM5,000 atau lebih.
3. Pesanan bernilai RM5,000 atau lebih (Total) dengan kurang daripada 3 sebut harga dan tiada Contract Ref.
4. Pesanan bernilai RM5,000 hingga RM50,000 yang diluluskan oleh sesiapa selain Ketua Perolehan, Rozita binti Mohd Ariff (sheet About this file menyenaraikan siapa yang memegang jawatan apa).
5. Apa-apa corak bermusim dalam pembelian kertas.
Bagi setiap dapatan, senaraikan nombor PO dan angkanya.
```

Jika sesuatu dapatan tiada nombor PO:

```
Senaraikan nombor PO di sebalik dapatan itu.
```

---

## Bahagian 5: Carta

**Sesi:** chat yang sama | **Sumber:** fail yang dimuat naik

```
Buat carta lajur bagi perbelanjaan bulanan dengan Kilat Merbok Express (V014), Januari 2025 hingga September 2026. Beri tajuk yang menyatakan apa yang ditunjukkan oleh carta itu, dan labelkan paksinya.
```
