# 08 - AI Agents, Connectors dan MCP: Prompt

Prompt untuk memetakan proses sebut harga Sinar Maju kepada sistem yang diperlukan oleh agent. Halakan tetikus ke atas kotak kelabu dan klik ikon salin di penjuru kanan atasnya.

> **Panduan sesi:** setiap bahagian dijalankan dalam **chat yang sama**.

---

## Bahagian 1: Proses hari ini

**Sesi:** new chat | **Sumber:** tiada

```
Beginilah cara Jabatan Perolehan Sinar Maju mengendalikan sebut harga hari ini:
1. Pembekal menghantar sebut harga sebagai PDF melalui e-mel ke peti mel perolehan (procurement@sinarmaju.example).
2. Seorang eksekutif perolehan menyimpan setiap PDF ke dalam folder RFQ itu dalam shared drive.
3. Mereka menyemak sama ada pembekal itu ada dalam Approved Vendor List dalam sistem perolehan.
4. Mereka menyemak sebut harga itu berdasarkan Polisi Perolehan dan RFQ, dan mencatat masalah dalam spreadsheet perbandingan.
5. Jika sebut harga ada masalah, mereka menghantar e-mel kepada pembekal untuk meminta sebut harga yang disemak semula.
6. Mereka menulis memo kelulusan dan menghantarnya kepada Ketua Perolehan, yang meluluskan atau menolaknya.
7. Setelah diluluskan, mereka mencipta pesanan belian dalam sistem perolehan dan menghantarnya melalui e-mel kepada pembekal.

Tukarkan ini kepada jadual Markdown dengan satu baris bagi setiap langkah dan lajur ini: Langkah, Siapa yang melakukannya hari ini, Sistem, Data yang digunakan.
```

---

## Bahagian 2: Baca, tulis dan kelulusan

**Sesi:** chat yang sama | **Sumber:** tiada

```
Tambah empat lajur pada jadual: Bolehkah agent melakukan ini? (Ya, Sebahagian atau Tidak), Baca atau tulis?, Apa yang boleh tersilap jika agent melakukannya dengan salah?, Mesti seseorang meluluskan dahulu? (Ya atau Tidak). Bagi mana-mana langkah yang menghantar sesuatu ke luar syarikat, atau melibatkan komitmen wang, jawapan dalam lajur terakhir mesti Ya.
```

---

## Bahagian 3: Connector

**Sesi:** chat yang sama | **Sumber:** tiada

```
Tambah lajur terakhir, Connector yang diperlukan. Bagi setiap langkah, namakan jenis connector yang diperlukan oleh agent (contohnya "peti mel: baca", "shared drive: tulis", "sistem perolehan: baca melalui MCP server"). Kemudian senaraikan, di bawah jadual, setiap connector yang diperlukan oleh agent, dan sama ada ia memerlukan akses baca, akses tulis atau kedua-duanya.
```

Jika setiap langkah ditandakan selamat untuk agent sendirian:

```
Langkah mana yang menghantar sesuatu ke luar syarikat atau melibatkan komitmen wang? Tandakan langkah itu sebagai memerlukan kelulusan seseorang.
```
