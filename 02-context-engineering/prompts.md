# 02 - Context Engineering and Structured Output: Prompts

A three-step prompt chain on Sinar Maju's chair RFQ. Upload `rfq-2026-118.pdf` from [Module 01's sample files](../01-how-llms-behave/sample-files.zip) before Part 1. Hover over a grey box and click the copy icon in its top-right corner.

> **Session guide:** Parts 1 to 3 run in the **same chat**. Part 4 runs in a new chat.

---

## Part 1: Extract the requirements

**Session:** new chat | **Grounding:** uploaded file (`rfq-2026-118.pdf`)

```
Goal: list every requirement in the attached request for quotation (RFQ-2026-118) so I can check supplier quotations against it.
Context: I'm a procurement executive at Sinar Maju Sdn Bhd, an office supplies distributor. We'll receive several quotations for this RFQ.
Source: use only the attached RFQ. If something isn't stated in it, don't add it.
Expectations: a Markdown table with three columns: Requirement, Exact wording from the RFQ, How to check it in a quotation. Include the requirements for what a quotation must contain, not only the product.
```

If a row isn't in the RFQ:

```
Remove any row you can't quote from the RFQ.
```

---

## Part 2: The comparison table

**Session:** same chat | **Grounding:** uploaded file

```
Using only the requirements table above, make a blank comparison table in Markdown for three supplier quotations. One row per requirement. Columns: Requirement, Supplier A, Supplier B, Supplier C, Meets the RFQ? Leave the supplier cells empty. Add rows at the bottom for Grand total (RM), Valid until and Payment terms.
```

---

## Part 3: The same requirements as JSON

**Session:** same chat | **Grounding:** uploaded file

```
Now give me the same requirements as JSON, so another system can read them. Use a list of objects, each with these fields: "id" (R1, R2 and so on), "requirement", "rfq_wording" and "how_to_check". Return only the JSON, with no explanation before or after it.
```

If there's text around the JSON:

```
Return only the JSON.
```

---

## Part 4: One big prompt, for comparison

**Session:** new chat | **Grounding:** uploaded file (`rfq-2026-118.pdf`)

```
Read the attached RFQ, list all the requirements, make a blank comparison table for three suppliers, and give me the requirements as JSON.
```
