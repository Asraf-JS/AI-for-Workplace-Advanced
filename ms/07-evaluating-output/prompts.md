# 07 - Menilai Output AI: Prompt

Prompt untuk menguji Quotation Checker anda pada sepuluh kes. Muat turun [sample-files.zip](../../07-evaluating-output/sample-files.zip) dahulu. Halakan tetikus ke atas kotak kelabu dan klik ikon salin di penjuru kanan atasnya.

---

## Bahagian 1: Jalankan satu kes ujian

**Sesi:** new chat dengan Quotation Checker anda, satu bagi setiap kes | **Sumber:** `open-rfqs.pdf` dan satu fail kes (serta polisi dan senarai vendor jika assistant anda tiada fail)

```
Semak sebut harga ini berdasarkan RFQ yang sepadan dalam open-rfqs.pdf. Nombor RFQ ada pada "Your reference" dalam sebut harga.
```

---

## Bahagian 2: Peraturan yang mungkin anda tambah pada instructions

> **Amaran:** peraturan ini mendedahkan sebahagian jawapan. Beri markah kepada kesemua sepuluh kes (7.3) sebelum anda membacanya.

**Sesi:** paste ke dalam instructions Quotation Checker anda, satu pada satu masa | **Sumber:** tiada

Bagi baris diskaun yang ditandakan sebagai ralat:

```
Baris diskaun dibenarkan. Kira semula subjumlah selepas diskaun sebelum anda menilai aritmetik.
```

Bagi bayaran pendahuluan tepat 30% yang ditandakan sebagai terlalu tinggi:

```
Bayaran pendahuluan tepat 30% adalah dalam had. Hanya yang melebihi 30% gagal Klausa 6.2.
```

Bagi nombor SST yang tiada tetapi tidak ditandakan:

```
Jika sebut harga ada baris cukai atau SST, cari nombor pendaftaran SST pada kepala surat dan footer. Jika tiada, Klausa 4.5 gagal.
```
