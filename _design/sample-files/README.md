# Sample Files (Data Pack)

The source for the course's lab data. All of it is synthetic, made up for the fictional company **Sinar Maju Sdn Bhd**, an office supplies distributor in Petaling Jaya. Every company, person, address, figure and registration number is fictional, and email addresses use `.example` domains.

> **Important:** this data must never be replaced with real company data in class.

## Build

```
pip install reportlab openpyxl
python3 _design/sample-files/build-sample-files.py
```

The build is deterministic: a rebuild only changes files whose content changed. Every figure lives in `build-sample-files.py`, so the files and the answer keys always agree.

## What it writes

| Module | Files |
|---|---|
| 01 | `rfq-2026-118.pdf` and one chair quotation |
| 03 | `rfq-2026-118.pdf`, three chair quotations, `procurement-policy-v3.0.pdf`, `approved-vendor-list.pdf` |
| 04 | `procurement-policy-v3.0.pdf`, `approved-vendor-list.pdf` |
| 05 | `purchase-history.xlsx` and `purchase-history.csv` (January 2025 to September 2026) |
| 07 | `open-rfqs.pdf`, ten test quotations, `procurement-policy-v3.0.pdf`, `approved-vendor-list.pdf` |
| 09 | `procurement-policy-v3.0.pdf` and the superseded `procurement-policy-v2.1.pdf` |

Each module also gets a `sample-files.zip` of its folder. Four answer keys go to `_trainer/`, which git ignores.

## Changing the data

- The evaluation date is `CLASS_DATE` (10 November 2026). Quotation validity is judged against it, so if you move it, check every "Valid until" date and rebuild.
- The seeded problems are deliberate. Read the answer keys before changing a number, and update any **What should you see?** boxes in the module notes in the same pull request.
- The company names were checked with a web search in October 2026 and no matching business was found. A web search can't see the full SSM register, so check any new name on SSM before you add it.
