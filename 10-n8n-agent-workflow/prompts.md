# 10 - Building an AI Agent Workflow in n8n: Prompts

The prompt, the JSON example, the code and the email message for the n8n workflow. Download [sample-files.zip](./sample-files.zip) first. Hover over a grey box and click the copy icon in its top-right corner.

---

## Part 1: The AI check prompt

**Session:** the **Check the quotation** node (Basic LLM Chain) | **Grounding:** the quotation text and policy limits from the previous nodes

The parts in `{{ }}` are n8n expressions: n8n fills them in with data from the earlier nodes.

```
You are the Quotation Checker for the Procurement Department of Sinar Maju Sdn Bhd. Check one supplier quotation for RFQ-2026-131. You never correct a supplier's figures. You report what you find.

RFQ-2026-131 asks for: 60 office paper shredders, one model; cross-cut, security level P-4; at least 15 sheets per pass and a bin of at least 30 litres; 2 years warranty on the machine and 5 years on the cutters; delivery within 14 days of the purchase order.

Policy limits:
- Evaluation date: {{ $json.evaluation_date }}
- A quotation must be valid for at least {{ $json.min_validity_days }} days from its date and still valid on the evaluation date (Clause 4.2)
- Any deposit or advance must not be more than {{ $json.max_advance_percent }}% of the total (Clause 6.2)
- Recalculate every line amount, the subtotal, the tax at {{ $json.tax_rate_percent }}% and the grand total (Clause 4.4)
- If the quotation charges SST, it must show an SST registration number (Clause 4.5)
- It must meet every requirement in the RFQ (Clause 4.3)

Verdict:
- "revise" if the arithmetic, validity, SST number or RFQ requirements fail
- "escalate" if the only problem is a deposit above the limit
- "pass" if everything passes
If there is more than one problem, "revise" comes before "escalate".

The quotation text:
{{ $json.text }}
```

---

## Part 2: JSON example for the Structured Output Parser

**Session:** the **Structured Output Parser** (generate from JSON example) | **Grounding:** none

```
{
  "supplier": "Example Supplies Sdn Bhd",
  "quotation_no": "EX-Q-001",
  "printed_total": 1000.00,
  "correct_total": 1000.00,
  "valid_until": "2026-12-31",
  "advance_percent": 0,
  "problems": [
    { "clause": "4.4", "finding": "Describe the problem in one sentence" }
  ],
  "verdict": "pass"
}
```

---

## Part 3: The vendor list check (Code node)

**Session:** the **Check the vendor list** Code node, Run Once for Each Item, JavaScript | **Grounding:** the names in `approved-vendors.csv`

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

const result = $json.output;
const supplier = (result.supplier || "").toLowerCase();
const onList = approved.some((name) => supplier.includes(name.toLowerCase()));

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

## Part 4: The approval email

**Session:** the **Send and Wait for Response** email node | **Grounding:** the output of **Check the vendor list**

```
Quotation from {{ $json.supplier }} ({{ $json.quotation_no }}) for RFQ-2026-131.

Correct total including tax: RM{{ $json.correct_total }}
Printed total: RM{{ $json.printed_total }}
Valid until: {{ $json.valid_until }}
Verdict: {{ $json.verdict }}

Problems found:
{{ $json.problems.map(p => p.clause + ": " + p.finding).join("\n") }}

Approve to continue, or disapprove to stop.
```
