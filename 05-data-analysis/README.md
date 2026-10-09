# 05 - Advanced Data Analysis with AI

_One short paragraph on where this module sits in the course, to be added._

> **Prompts:** every prompt you need is in the steps, with a Copy button. The [prompts page](./prompts.md) has them all on one page too.

**Day:** 1

**Estimated time:** _TBA_

**Your result:** _To be added_

---

## What You Will Learn

_To be added_

---

## Before You Begin

_To be added_

---

## Topics

_To be added_

---

## 5.1 Lab: Purchase history analysis

_Steps to be added._

<!-- Move each box below to sit after the step it checks once the steps are written. Figures come from the answer keys in _trainer/: if a figure changes, rebuild the sample files and update these boxes in the same pull request. -->

<details markdown="1">
<summary>What should you see?</summary>

Before you analyse, the file needs cleaning:

- **Duplicates:** 4 rows repeat the row above exactly: PO-2025-0040, PO-2025-0192, PO-2026-0077 and PO-2026-0138.
- **Blank department:** 6 rows: PO-2025-0035, PO-2025-0153, PO-2026-0029, PO-2026-0075, PO-2026-0089 and PO-2026-0092.
- **Supplier name variants:** 7 Kertas Lestari rows are spelled "KERTAS LESTARI SDN BHD" or "Kertas Lestari Sdn. Bhd.". The Vendor ID (V001) is the same, so group by Vendor ID.
- **Cancelled orders:** 8 rows. Leave them out of spend.

</details>

<details markdown="1">
<summary>What should you see?</summary>

Using **Total (RM)**, without cancelled orders, counting each duplicate once:

| Measure | Value |
|---|---|
| Purchase orders (unique) | 350 |
| Total spend | RM3,281,457.86 |
| Spend in 2025 | RM1,930,291.38 |
| Spend January to September 2026 | RM1,351,166.48 |

| Top suppliers | Spend |
|---|---|
| Tintaria Imaging Supplies (V003) | RM966,183.56 |
| Kertas Lestari (V001) | RM459,896.83 |
| Pualam Paper Merchants (V002) | RM404,697.46 |
| Duduk Selesa Furnishings (V005) | RM335,418.16 |
| Alat Tulis Cendana (V004) | RM330,183.52 |

The biggest category is Stock: Toner and Ink (RM966,183.56, 29.4%), then Stock: Paper (RM857,246.33, 26.1%).

</details>

<details markdown="1">
<summary>Show the answers</summary>

- **Courier spend jumped in May 2026.** Kilat Merbok Express averaged RM2,388.10 a month until April 2026, then RM7,792.98 a month from May (about 3.3 times). It's under a contract, so no new quotations were needed (3.3), but it's worth asking why.
- **Split purchases.** Admin bought from Duduk Selesa three times in a week (PO-2026-0028, PO-2026-0032 and PO-2026-0036, RM14,547.60 together). IT bought from Kodbar Nusa on 18 and 19 August 2026 (PO-2026-0125 and PO-2026-0126, RM9,882.00 together). Each order was just under RM5,000 with one quotation (7.1 and 7.2).
- **Too few quotations.** PO-2025-0167 (RM8,640.00, 2 quotations) and PO-2026-0071 (RM12,409.20, 1 quotation). Both needed three (3.1).
- **Wrong approver.** PO-2026-0071 was approved by the Marketing HOD alone. It also needed the Head of Procurement.
- **Seasonal paper.** A4 paper orders in November, December and January average 4,720 reams a month, against 2,471 in other months.

</details>

---

## Product Notes

| Copilot Chat (Basic) | M365 Copilot (Premium) | ChatGPT | Claude | Gemini |
|---|---|---|---|---|
| _TBA_ | _TBA_ | _TBA_ | _TBA_ | _TBA_ |

---

## Independent Practice

_To be added_

---

## Troubleshooting

| Symptom | What to check |
|---|---|
| _TBA_ | _TBA_ |

---

## Lesson Summary

_To be added_
