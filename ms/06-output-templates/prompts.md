# 06 - Mengawal Output dengan Templat Word dan PowerPoint: Prompt

Prompt untuk mengisi template memo dan deck Sinar Maju. Muat turun [sample-files.zip](../../06-output-templates/sample-files.zip) dahulu. Halakan tetikus ke atas kotak kelabu dan klik ikon salin di penjuru kanan atasnya.

---

## Bahagian 1: Isi memo

**Sesi:** new chat | **Sumber:** fail yang dimuat naik (`sinar-maju-memo.docx`)

Ganti `[nama anda]` dengan nama anda sendiri sebelum anda menghantarnya.

```
Isikan template memo kelulusan yang dilampirkan untuk pembelian ini. Kekalkan template itu tepat seperti asalnya: tajuk, jadual, styles dan layout yang sama. Ganti setiap placeholder dalam kurungan siku, dan jangan tambah apa-apa di luar bahagian template.

Fakta:
- Kepada: Rozita binti Mohd Ariff, Ketua Perolehan. Daripada: [nama anda], Eksekutif Perolehan. Tarikh: 10 November 2026.
- Pembelian: 120 kerusi pejabat jaring ergonomik untuk dijual semula, RFQ-2026-118.
- Duduk Selesa Furnishings Sdn Bhd, DSF/QT/26/1043, 21 Oktober 2026, sah sehingga 20 Disember 2026. Jumlah tercetak RM46,548.00, tetapi baris 1 sepatutnya RM43,800.00 (120 x RM365.00), jadi jumlah yang betul ialah RM47,628.00 (Klausa 4.4). Selain itu memenuhi RFQ.
- Kerusi Nadira Trading, KNT-2610-077, 22 Oktober 2026, sah sehingga 6 Disember 2026, RM43,416.00. Jaminan 3 tahun pada rangka dan 1 tahun pada mekanisme dan gas lift; RFQ meminta 5 tahun bagi ketiga-tiganya (Klausa 4.3).
- Ergoluma Seating Sdn Bhd, ELS/Q/2026/0388, 23 Oktober 2026, sah sehingga 22 November 2026, RM48,481.20. Meminta deposit 50%; hadnya 30% (Klausa 6.2).
- Cadangan: Duduk Selesa, tertakluk kepada sebut harga yang disemak semula pada RM47,628.00.
- Kelulusan: jalur RM5,000 hingga RM50,000 di bawah Klausa 3.1, jadi Ketua Jabatan (HOD) dan Ketua Perolehan meluluskan. Bagi stok untuk dijual semula, HOD Perolehan ialah Ketua Perolehan, jadi Rozita binti Mohd Ariff menyemak dan meluluskan. SK: Hafiz bin Kamarudin, Pengarah Kewangan, untuk makluman.

Beri saya memo yang siap sebagai fail Word yang boleh saya muat turun.
```

Jika masih ada placeholder:

```
Senaraikan setiap placeholder yang anda tidak ganti, kemudian gantikannya.
```

---

## Bahagian 2: Deck daripada template yang baik

**Sesi:** new chat | **Sumber:** fail yang dimuat naik (`sinar-maju-deck.pptx`)

```
Cipta deck kelulusan empat slaid menggunakan template yang dilampirkan dan layoutnya. Kekalkan fon, warna dan footer template, dan jangan tambah apa-apa milik anda sendiri.
Slaid 1 (SM Title): "Kelulusan: 120 Kerusi Ergonomik untuk Dijual Semula", subtajuk "Cadangan RFQ-2026-118", tarikh 10 November 2026.
Slaid 2 (SM Title Only, dengan jadual): perbandingan tiga sebut harga: pembekal, jumlah yang betul (RM), jaminan, terma pembayaran, verdict.
Slaid 3 (SM Content): cadangan, Duduk Selesa pada RM47,628.00 selepas sebut harga yang disemak semula, dalam tidak lebih daripada empat poin.
Slaid 4 (SM Closing): keputusan yang diperlukan daripada Ketua Perolehan, dan tarikh akhirnya.
Fakta untuk slaid 2:
- Duduk Selesa Furnishings: jumlah yang betul RM47,628.00 (tercetak RM46,548.00); jaminan 5 tahun pada rangka, mekanisme dan gas lift; pembayaran 30 hari dari invois; verdict REVISE (aritmetik, Klausa 4.4).
- Kerusi Nadira Trading: RM43,416.00; jaminan 3 tahun pada rangka, 1 tahun pada mekanisme dan gas lift; pembayaran 30 hari dari invois; verdict REVISE (jaminan tidak memenuhi RFQ, Klausa 4.3).
- Ergoluma Seating: RM48,481.20; jaminan 5 tahun pada rangka, mekanisme dan gas lift; deposit 50% bersama pesanan belian; verdict ESCALATE (deposit melebihi 30%, Klausa 6.2).
Keputusan diperlukan sebelum 17 November 2026.
Buang slaid contoh template. Beri saya deck yang siap sebagai fail PowerPoint.
```

---

## Bahagian 3: Deck yang sama daripada template yang buruk

**Sesi:** new chat | **Sumber:** fail yang dimuat naik (`sinar-maju-deck-bad.pptx`)

Hantar prompt Bahagian 2 sekali lagi, tanpa sebarang perubahan.
