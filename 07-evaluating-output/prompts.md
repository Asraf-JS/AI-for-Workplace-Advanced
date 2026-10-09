# 07 - Evaluating AI Output: Prompts

Prompts for testing your Quotation Checker on ten cases. Download [sample-files.zip](./sample-files.zip) first. Hover over a grey box and click the copy icon in its top-right corner.

---

## Part 1: Run a test case

**Session:** new chat with your Quotation Checker, one per case | **Grounding:** `open-rfqs.pdf` and one case file (plus the policy and vendor list if your assistant has no files)

```
Check this quotation against the matching RFQ in open-rfqs.pdf. The RFQ number is in the quotation's "Your reference".
```

---

## Part 2: Rules you might add to the instructions

> **Warning:** these rules give away some of the answers. Score all ten cases (7.3) before you read them.

**Session:** paste into your Quotation Checker's instructions, one at a time | **Grounding:** none

For a discount line flagged as an error:

```
A discount line is allowed. Recalculate the subtotal after the discount before you judge the arithmetic.
```

For an advance of exactly 30% flagged as too high:

```
An advance of exactly 30% is within the limit. Only more than 30% fails Clause 6.2.
```

For a missing SST number that wasn't flagged:

```
If a quotation has a tax or SST line, look for an SST registration number in the letterhead and the footer. If there isn't one, Clause 4.5 fails.
```
