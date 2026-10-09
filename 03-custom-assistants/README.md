# 03 - Building Custom AI Assistants

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

## 3.1 Lab: Procurement Quotation Checker

_Steps to be added._

<!-- Move each box below to sit after the step it checks once the steps are written. Figures come from the answer keys in _trainer/: if a figure changes, rebuild the sample files and update these boxes in the same pull request. -->

<details markdown="1">
<summary>What should you see?</summary>

Figures as printed in each quotation:

| | Duduk Selesa | Kerusi Nadira | Ergoluma |
|---|---|---|---|
| Quotation No. | DSF/QT/26/1043 | KNT-2610-077 | ELS/Q/2026/0388 |
| Date | 21 October 2026 | 22 October 2026 | 23 October 2026 |
| Valid until | 20 December 2026 | 6 December 2026 | 22 November 2026 |
| Unit price | RM365.00 | RM335.00 | RM372.00 |
| Delivery | RM300.00 | Complimentary | RM250.00 |
| Subtotal | RM43,100.00 | RM40,200.00 | RM44,890.00 |
| Tax (SST) 8% | RM3,448.00 | RM3,216.00 | RM3,591.20 |
| Grand total | RM46,548.00 | RM43,416.00 | RM48,481.20 |
| Warranty | 5 years frame, mechanism and gas lift | 3 years frame, 1 year mechanism and gas lift | 5 years frame, mechanism and gas lift |
| Payment | 30 days | 30 days | 50% deposit, balance 30 days |
| Delivery lead time | 14 to 18 days | Within 21 days | Within 21 days of deposit |

Duduk Selesa's total must show **RM46,548.00**, the printed figure. If your Checker shows RM47,628.00 without saying why, it has quietly corrected the supplier's figure.

</details>

<details markdown="1">
<summary>Show the answers</summary>

| Supplier | Problem | Clause | What happens next |
|---|---|---|---|
| Duduk Selesa | Line 1 printed as RM42,800.00, but 120 x RM365.00 is RM43,800.00. Correct grand total RM47,628.00, not RM46,548.00 | 4.4 | Ask for a revised quotation. Don't correct it yourself |
| Kerusi Nadira | Warranty is 3 years on the frame and 1 year on the mechanism and gas lift; the RFQ asks for 5 years on all three | 4.3 | Non-compliant. Ask for a revised quotation or exclude it |
| Ergoluma | 50% deposit; the limit is 30% | 6.2 | Needs the Finance Director's written approval, or ask for standard terms |

Recommended: **Duduk Selesa**, once it sends a revised quotation at RM47,628.00. That falls in the RM5,000 to RM50,000 band (3.1): three quotations and a comparison, approved by the HOD and the Head of Procurement.

Kerusi Nadira is cheapest, which is why a Checker that ranks on price alone gets this wrong.

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
