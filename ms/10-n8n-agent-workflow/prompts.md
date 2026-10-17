# 10 - Membina AI Agent Workflow dalam n8n: Prompt

Prompt, contoh JSON, kod dan mesej e-mel untuk workflow n8n. Muat turun [sample-files.zip](../../10-n8n-agent-workflow/sample-files.zip) dahulu. Halakan tetikus ke atas kotak kelabu dan klik ikon salin di penjuru kanan atasnya.

---

## Bahagian 1: Prompt semakan AI

**Sesi:** node **Check the quotation** (Basic LLM Chain) | **Sumber:** teks sebut harga dan had polisi daripada node sebelumnya

Bahagian dalam `{{ }}` ialah n8n expression: n8n mengisinya dengan data daripada node sebelumnya.

```
Anda ialah Quotation Checker untuk Jabatan Perolehan Sinar Maju Sdn Bhd. Semak satu sebut harga pembekal bagi RFQ-2026-131. Anda tidak sekali-kali membetulkan angka pembekal. Anda hanya melaporkan apa yang anda temui.

RFQ-2026-131 meminta: 60 mesin pencarik kertas pejabat, satu model; potongan silang (cross-cut), tahap keselamatan P-4; sekurang-kurangnya 15 helai bagi setiap kali dan tong sekurang-kurangnya 30 liter; jaminan 2 tahun pada mesin dan 5 tahun pada pemotong; penghantaran dalam 14 hari dari pesanan belian.

Had polisi:
- Tarikh penilaian: {{ $json.evaluation_date }}
- Sebut harga mesti sah sekurang-kurangnya {{ $json.min_validity_days }} hari dari tarikhnya dan masih sah pada tarikh penilaian (Klausa 4.2)
- Apa-apa deposit atau bayaran pendahuluan tidak boleh melebihi {{ $json.max_advance_percent }}% daripada jumlah (Klausa 6.2)
- Kira semula setiap amaun baris, subjumlah, cukai pada {{ $json.tax_rate_percent }}% dan grand total (Klausa 4.4)
- Jika sebut harga mengenakan SST, ia mesti menunjukkan nombor pendaftaran SST (Klausa 4.5)
- Ia mesti memenuhi setiap keperluan dalam RFQ (Klausa 4.3)

Verdict:
- "revise" jika aritmetik, tempoh sah, nombor SST atau keperluan RFQ gagal
- "escalate" jika satu-satunya masalah ialah deposit melebihi had
- "pass" jika semuanya lulus
Jika ada lebih daripada satu masalah, "revise" didahulukan sebelum "escalate".

Teks sebut harga:
{{ $json.text }}
```

---

## Bahagian 2: Contoh JSON untuk Structured Output Parser

**Sesi:** **Structured Output Parser** (generate from JSON example) | **Sumber:** tiada

```
{
  "supplier": "Example Supplies Sdn Bhd",
  "quotation_no": "EX-Q-001",
  "printed_total": 1000.00,
  "correct_total": 1000.00,
  "valid_until": "2026-12-31",
  "advance_percent": 0,
  "problems": [
    { "clause": "4.4", "finding": "Terangkan masalah dalam satu ayat" }
  ],
  "verdict": "pass"
}
```

---

## Bahagian 3: Semakan senarai vendor (node Code)

**Sesi:** node Code **Check the vendor list**, Run Once for Each Item, JavaScript | **Sumber:** nama-nama dalam `approved-vendors.csv`

```
// Sinar Maju's Approved Vendor List (from approved-vendors.csv)
const approved = [
  "Kertas Lestari Sdn Bhd",
  "Pualam Paper Merchants Sdn Bhd",
  "Tintaria Imaging Supplies Sdn Bhd",
  "Alat Tulis Cendana Sdn Bhd",
  "Duduk Selesa Furnishings Sdn Bhd",
  "Kerusi Nadira Trading",
  "Ergoluma Seating Sdn Bhd",
  "Imbas Teraju Systems Sdn Bhd",
  "Kodbar Nusa Technology Sdn Bhd",
  "Kilau Embun Facility Services Sdn Bhd",
  "Bersih Kemboja Services Sdn Bhd",
  "Rakmas Storage Solutions Sdn Bhd",
  "Rangka Waja Ironworks Sdn Bhd",
  "Kilat Merbok Express Sdn Bhd",
  "Cetak Pelangi Kenanga Sdn Bhd",
];

// Compare names exactly, ignoring case, dots and spaces ("Sdn. Bhd." = "Sdn Bhd")
const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const result = $json.output;
const supplier = norm(result.supplier);
const onList = approved.some((name) => norm(name) === supplier);

// Not on the list means reject, whatever the AI said (Clause 5.1)
return {
  json: {
    ...result,
    on_avl: onList,
    verdict: onList ? result.verdict : "reject",
  },
};
```

---

## Bahagian 4: E-mel kelulusan

**Sesi:** node e-mel **Send and Wait for Response** | **Sumber:** output **Check the vendor list**

```
Sebut harga daripada {{ $json.supplier }} ({{ $json.quotation_no }}) bagi RFQ-2026-131.

Jumlah betul termasuk cukai: RM{{ $json.correct_total }}
Jumlah tercetak: RM{{ $json.printed_total }}
Sah sehingga: {{ $json.valid_until }}
Verdict: {{ $json.verdict }}

Masalah yang ditemui:
{{ $json.problems.map(p => p.clause + ": " + p.finding).join("\n") }}

Klik Approve untuk meneruskan, atau Disapprove untuk menghentikannya.
```

---

## Bahagian 5: E-mel Revise dan Reject

**Sesi:** node e-mel **Send a message** biasa pada output **Revise** dan **Reject** | **Sumber:** output **Check the vendor list**

```
Sebut harga daripada {{ $json.supplier }} ({{ $json.quotation_no }}) bagi RFQ-2026-131.
Verdict: {{ $json.verdict }}
Jumlah betul termasuk cukai: RM{{ $json.correct_total }}
Dalam Approved Vendor List: {{ $json.on_avl }}

Masalah yang ditemui:
{{ $json.problems.map(p => p.clause + ": " + p.finding).join("\n") }}

Tiada tindakan diambil. Seseorang akan memutuskan apa yang perlu diberitahu kepada pembekal.
```
