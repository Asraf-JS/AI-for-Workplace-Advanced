# 07 - Evaluating AI Output

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

## 7.1 Lab: Score the Quotation Checker on ten test cases

_Steps to be added._

<!-- Move each box below to sit after the step it checks once the steps are written. Figures come from the answer keys in _trainer/: if a figure changes, rebuild the sample files and update these boxes in the same pull request. -->

<details markdown="1">
<summary>Show the answers</summary>

| Case | Supplier | Expected | Clause | Why |
|---|---|---|---|---|
| 01 | Kertas Lestari | Pass | | Meets the RFQ, figures correct |
| 02 | Pualam Paper | Fail | 4.4 | Subtotal printed as RM17,820.00; the lines add up to RM17,280.00 |
| 03 | Tintaria | Pass | | The 5% discount is correct. Flagging it is a false positive |
| 04 | Dakwat Seroja | Fail | 5.1 | Not on the Approved Vendor List |
| 05 | Imbas Teraju | Fail | 4.2 | Expired on 5 November 2026 |
| 06 | Kodbar Nusa | Pass | | The cradle is a separate line, still like-for-like |
| 07 | Bersih Kemboja | Fail | 4.5 | Charges SST with no SST registration number |
| 08 | Kilau Embun | Pass | | 30% advance is exactly at the limit. Flagging it is a false positive |
| 09 | Rakmas | Fail | 4.3 | 250 kg per level; the RFQ asks for 300 kg |
| 10 | Rangka Waja | Fail | 4.2 and 6.2 | Valid only 14 days (expired 30 October 2026) and asks for a 50% deposit |

Four pass, six fail. Score 1 point for each right verdict and 1 for each right clause, out of 20. Case 10 needs both problems for both points.

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
