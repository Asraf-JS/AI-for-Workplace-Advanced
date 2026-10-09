# 05 - Advanced Data Analysis with AI: Prompts

Prompts for analysing Sinar Maju's purchase history. Upload `purchase-history.xlsx` from [sample-files.zip](./sample-files.zip) before Part 1. Hover over a grey box and click the copy icon in its top-right corner.

> **Session guide:** every part runs in the **same chat**, the one you uploaded the file to.

---

## Part 1: First look

**Session:** new chat | **Grounding:** uploaded file (`purchase-history.xlsx`)

```
This is Sinar Maju Sdn Bhd's purchase order export, January 2025 to September 2026. Read both sheets. Tell me how many rows and columns there are, the date range, and what each column means. Don't analyse anything yet.
```

---

## Part 2: Data problems

**Session:** same chat | **Grounding:** uploaded file

```
Before any analysis, check the data quality. Look for: rows that are exact duplicates, rows with a blank Department, the same supplier spelled in different ways, and cancelled orders. For each problem, tell me how many rows and list the PO numbers. Don't change anything yet.
```

If it finds no duplicates:

```
Compare complete rows, all 17 columns, not only the PO number.
```

---

## Part 3: Spend summary

**Session:** same chat | **Grounding:** uploaded file

```
Now clean the data: count each duplicated row once, group suppliers by Vendor ID, and leave out cancelled orders. Using Total (RM), give me: the number of unique purchase orders, total spend, spend in 2025, spend from January to September 2026, the top five suppliers by spend, and spend by category with each category's share. Show the method you used.
```

---

## Part 4: Patterns

**Session:** same chat | **Grounding:** uploaded file

```
Look for anything the Finance Director should know about. In particular:
1. Any supplier whose monthly spend changed sharply. When did it change, and by how much?
2. Orders from the same department to the same supplier within 30 days that are each below RM5,000 but add up to RM5,000 or more.
3. Orders of RM5,000 or more (Total) with fewer than 3 quotations and no Contract Ref.
4. Orders of RM5,000 or more approved only by a department head, not the Head of Procurement.
5. Any seasonal pattern in paper purchases.
For each finding, list the PO numbers and the figures.
```

If a finding has no PO numbers:

```
List the PO numbers behind that finding.
```

---

## Part 5: A chart

**Session:** same chat | **Grounding:** uploaded file

```
Make a column chart of monthly spend with Kilat Merbok Express (V014), January 2025 to September 2026. Title it with what the chart shows, and label the axes.
```
