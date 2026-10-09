# 01 - How Large Language Models Really Behave: Prompts

Prompts for comparing two kinds of model on the same quotation. Hover over a grey box and click the copy icon in its top-right corner.

---

## Part 1: The same question twice

**Session:** new chat, twice | **Grounding:** none

```
Write a one-line email subject asking a supplier to send a revised quotation. Give me only the subject line.
```

---

## Part 2: Fast model

**Session:** new chat, fast model | **Grounding:** uploaded files (`rfq-2026-118.pdf`, `quotation-duduk-selesa.pdf`)

```
I work in procurement at Sinar Maju Sdn Bhd. I've uploaded our request for quotation (RFQ-2026-118) and one supplier's quotation. Summarise the quotation in five bullets: supplier, grand total, validity, warranty and payment terms. Then tell me in one sentence whether it meets the RFQ.
```

---

## Part 3: Reasoning model

**Session:** new chat, reasoning model | **Grounding:** uploaded files (the same two)

Send the Part 2 prompt first, then:

```
Now check the arithmetic. Recalculate every line amount as quantity x unit price, then the subtotal, the tax and the grand total. Show your working in a table and compare each figure with the one printed in the quotation.
```

If the model says everything adds up:

```
Work out line 1 again, step by step: what is 120 x 365.00? Compare it with the amount printed on line 1.
```
