# 04 - Grounded Research and Source-Based Answers

Your Quotation Checker quotes the procurement policy. But when a colleague asks "how much deposit can we pay?", can you trust the answer, and can you show where it came from? In this module you set up a policy notebook that answers only from Sinar Maju's own documents, and you check every citation it gives.

> **Prompts:** every prompt you need is in the steps, with a Copy button. The [prompts page](./prompts.md) has them all on one page too.

**Day:** 1

**Estimated time:** 55 minutes

**Your result:** A policy notebook that answers from the Procurement Policy, five checked answers with their clause numbers, and one question it correctly says it can't answer.

---

## What You Will Learn

- Explain the difference between an answer from the model's memory and one grounded in your sources
- Set up a source-grounded notebook in your AI tool
- Check a citation quickly, and spot one that doesn't support the answer
- Ask questions in a way that makes answers easy to check
- Recognise a good "I can't find that in the sources" answer

---

## Before You Begin

Download **[sample-files.zip](./sample-files.zip)** and extract it. It holds `procurement-policy-v3.0.pdf` and `approved-vendor-list.pdf`.

This lab works best in **Gemini Notebook** (formerly NotebookLM), which is free with a Google account and links each citation to the exact quote. Copilot Notebooks and ChatGPT or Claude Projects also work. See the Product Notes below.

---

## Topics

**Grounded and ungrounded answers.** Ask a general chat "what's a typical deposit for office furniture?" and the model answers from what it learned in training: plausible, but nobody's policy. A grounded answer comes from documents you supply, and points back to them.

**Source-grounded tools.** A notebook (Gemini Notebook, Copilot Notebooks) or a Project keeps your sources together and answers from them. Some tools stick strictly to the sources; others mix in general knowledge unless you tell them not to.

**Citations are claims too.** A citation number shows where the tool says the answer came from. It can still point to the wrong clause, or to a clause that says something slightly different. Checking takes seconds if you ask for the clause number and the exact sentence.

**"I don't know" is a good answer.** When the sources don't cover a question, the right answer is to say so. An assistant that always has an answer is guessing some of the time.

---

## 4.1 Set Up the Policy Notebook

1. Open your notebook tool and create a new notebook (or Project) called `Sinar Maju procurement policy`.
2. Add `procurement-policy-v3.0.pdf` and `approved-vendor-list.pdf` as sources.
3. Ask:

   ```
   In three bullets, what do these sources cover? Name each document and its version or date.
   ```

4. Check that both documents are named, and that the policy is shown as Version 3.0.

---

## 4.2 Ask Five Policy Questions

Send each question on its own, and keep a note of each answer and its clause number.

```
Answer only from the sources. For each answer, give the clause number and quote the exact sentence it comes from. What is the most we can pay in advance before the Finance Director has to approve it?
```

```
How long must a supplier's quotation be valid for?
```

```
Who has to approve a purchase of RM80,000 including tax?
```

```
Does a quotation have to show the supplier's SST registration number?
```

```
What happens if one department places several small orders with the same supplier in the same month?
```

> **Tip:** the first question sets the pattern (answer only from the sources, give the clause, quote the sentence). If later answers drop the quote, say `Quote the exact sentence for that too.`

---

## 4.3 Check Every Citation

1. For each answer, open the policy PDF and find the clause it names.
2. Read the quoted sentence in the PDF. Does it say the same thing as the answer?
3. Mark each answer **Correct**, **Wrong clause** or **Doesn't support the answer**.

<details markdown="1">
<summary>What should you see?</summary>

Every answer should cite the clause it comes from.

| Question | Answer | Clause |
|---|---|---|
| What's the most you can pay in advance without extra approval? | 30% of the purchase value. More needs the Finance Director's written approval first | 6.2 |
| How long must a quotation be valid? | At least 30 days from issue, and still valid on the evaluation date | 4.2 |
| Who approves a RM80,000 purchase? | The Finance Director (above RM50,000) | 3.1 |
| Must a quotation show an SST number? | Yes, if the supplier charges SST | 4.5 |
| What happens to several small orders to the same supplier? | Orders from one department to one supplier within 30 days that together cross a limit are treated as one purchase and reported to the Finance Director | 7.2 |

If an answer has no clause number, or the clause says something different when you open it, that's the citation check failing.

</details>

---

## 4.4 Ask Something the Policy Doesn't Cover

Send:

```
Answer only from the sources. What is our policy on buying from suppliers outside Malaysia?
```

<details markdown="1">
<summary>What should you see?</summary>

A good answer says the sources don't cover buying from overseas suppliers, and may point you to the Procurement Department (the policy lists procurement@sinarmaju.example). Neither the policy nor the vendor list mentions it.

If the tool gives you rules about overseas suppliers, it's answering from general knowledge, not your sources. Ask: `Quote the clause that says that.` It won't be able to.

</details>

---

## Product Notes

| Copilot Chat (Basic) | M365 Copilot (Premium) | ChatGPT | Claude | Gemini |
|---|---|---|---|---|
| **Notebooks** > new notebook > **Add references** > **Upload files**. Citations show as small labels with a **Sources** button | Same as Basic. **Researcher** can also search your organisation's files, with sources | A **Project** with the two PDFs. Ask for the clause and quote every time, because Projects also use general knowledge | A **Project** with the two PDFs in its knowledge. Ask for the clause and quote | **Gemini Notebook** (formerly NotebookLM): add both PDFs as sources. Click a citation number to see the quote |

---

## Independent Practice

Find a public document you use at work, such as a published policy or a product manual (nothing confidential). Add it to a notebook and ask three questions you already know the answers to. Check each citation. How many were exactly right?

---

## Troubleshooting

| Symptom | What to check |
|---|---|
| Answers have no clause numbers | Start each question with "Answer only from the sources" and ask for the clause and quote |
| The quote isn't in the PDF | The tool made it up or paraphrased. Mark it wrong, and ask it to find the exact sentence |
| The notebook says it can't read the PDF | Remove the source and add it again. If that fails, copy the PDF's text into a text source |
| Answers mention rules you can't find in the policy | The tool is mixing in general knowledge. Use a source-only tool such as Gemini Notebook, or ask it to say "not in the sources" when it can't quote one |

---

## Lesson Summary

Grounding the AI in your own documents gives answers you can trace. But a citation is only useful if someone checks it, and checking is fast when you ask for the clause and the exact sentence every time. A tool that says "that's not in the sources" is working properly.

**Check yourself:** An answer cites Clause 6.2, but the quoted sentence isn't in the PDF. What do you do with that answer?
