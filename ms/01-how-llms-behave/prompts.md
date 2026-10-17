# 01 - Cara Model Bahasa Besar Sebenarnya Berfungsi: Prompt

Prompt untuk membandingkan dua jenis model pada sebut harga yang sama. Halakan tetikus ke atas kotak kelabu dan klik ikon salin di penjuru kanan atasnya.

---

## Bahagian 1: Soalan yang sama dua kali

**Sesi:** new chat, dua kali | **Sumber:** tiada

```
Tulis satu baris subjek e-mel untuk meminta pembekal menghantar sebut harga yang telah disemak semula. Beri saya baris subjek itu sahaja.
```

---

## Bahagian 2: Quick response

**Sesi:** new chat, Quick response (fast model) | **Sumber:** fail yang dimuat naik (`rfq-2026-118.pdf`, `quotation-duduk-selesa.pdf`)

```
Saya bekerja di bahagian perolehan Sinar Maju Sdn Bhd. Saya telah memuat naik permintaan sebut harga kami (RFQ-2026-118) dan sebut harga daripada seorang pembekal. Ringkaskan sebut harga itu dalam lima poin: pembekal, grand total, tempoh sah, jaminan dan terma pembayaran. Kemudian beritahu saya dalam satu ayat sama ada sebut harga itu memenuhi RFQ.
```

---

## Bahagian 3: Think deeper

**Sesi:** new chat, Think deeper (reasoning model) | **Sumber:** fail yang dimuat naik (dua fail yang sama)

Hantar prompt Bahagian 2 dahulu, kemudian:

```
Sekarang semak aritmetiknya. Kira semula setiap amaun baris sebagai kuantiti x harga seunit, kemudian subjumlah, cukai dan grand total. Tunjukkan jalan kira dalam jadual dan bandingkan setiap angka dengan angka yang tercetak dalam sebut harga.
```

Jika model kata semua angka betul:

```
Kira semula baris 1, langkah demi langkah: berapakah 120 x 365.00? Bandingkan jawapannya dengan amaun yang tercetak pada baris 1.
```
