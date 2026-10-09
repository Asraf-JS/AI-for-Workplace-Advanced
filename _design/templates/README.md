# Module 06 Templates

`build-templates.cjs` builds the three Sinar Maju templates into `06-output-templates/sample-files/` and zips them.

```
cd _design/templates
npm install
npm run build
```

The build is deterministic: a rebuild gives byte-identical files.

## What makes the good deck good, and the bad deck bad

The two decks look alike on screen. The difference is underneath, and it shows when an AI tool or a person adds a slide or changes the look.

| | `sinar-maju-deck.pptx` | `sinar-maju-deck-bad.pptx` |
|---|---|---|
| Layouts | Eight named layouts (SM Title, SM Section, SM Content, SM Two Content, SM Comparison, SM Title Only, SM Chart, SM Closing) | Every slide on the blank layout |
| Titles | Real title placeholders, so every slide has a title | Loose text boxes, so no slide has a title (the Accessibility Checker flags all eight) |
| Fonts and colours | Theme fonts and theme colours | Typed in by hand, and they drift: Arial, Calibri, Century Gothic and Times New Roman, three shades of amber |
| Positions | Set by the layout | Titles and columns shift a little from slide to slide |
| Footer and slide number | On the layouts, numbered automatically | Typed on each slide; slide 5 says 4 |
| Bullets | Real bullets | Typed bullet characters |
| Table and chart | A native table and a native chart | A grid of text boxes, and bars drawn as rectangles |
| Speaker notes | Each slide says which layout it uses and when to use it | None |

The memo uses Word styles (Title, Heading 1, a Placeholder Text character style), a details table, a quotations table and an approval table. Every placeholder is grey italic in square brackets.
