# 09 - Retrieval-Augmented Generation (RAG) Fundamentals: Prompts

Prompts for finding and fixing a wrong citation. Add both PDFs from [sample-files.zip](./sample-files.zip) to one notebook first. Hover over a grey box and click the copy icon in its top-right corner.

> **Session guide:** every part runs in the **same notebook** (or Project).

---

## Part 1: Four questions

**Session:** new notebook with both policy versions | **Grounding:** sources

```
Answer from the sources, with the clause number and the version of the policy you used. What is the most we can pay in advance before the Finance Director has to approve it?
```

```
How long must a supplier's quotation be valid for? Give the clause and the policy version.
```

```
Who has to approve a purchase of RM80,000 including tax? Give the clause and the policy version.
```

```
Does a quotation have to show the supplier's SST registration number? Give the clause and the policy version.
```

If an answer doesn't name a version:

```
Which version of the policy did that come from? Check the page header.
```

---

## Part 2: Diagnose

**Session:** same notebook | **Grounding:** sources

```
For your answer about advance payments, list every passage you retrieved from the sources, with the document name, page and clause for each. Then explain why a passage from Version 2.1 could look relevant to the question.
```

---

## Part 3: Fix A, tell the tool which version wins

**Session:** same notebook | **Grounding:** sources

```
From now on, use only the Procurement Policy Version 3.0, effective 1 July 2026. Version 2.1 is superseded: ignore it unless I ask about it by name. Now answer again: what is the most we can pay in advance before the Finance Director has to approve it?
```

For Fix B, remove `procurement-policy-v2.1.pdf` from the sources and ask the Part 1 questions again.
