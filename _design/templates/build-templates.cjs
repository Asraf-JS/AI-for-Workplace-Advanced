// Builds the Module 06 templates for the fictional company Sinar Maju Sdn Bhd.
//   cd _design/templates && npm install && npm run build
//
// Writes to 06-output-templates/sample-files/:
//   sinar-maju-deck.pptx      well built: theme colours and fonts, named layouts, placeholders
//   sinar-maju-deck-bad.pptx  the same slides built badly, as a teaching contrast
//   sinar-maju-memo.docx      approval memo with Word styles, a details table and placeholders
// and 06-output-templates/sample-files.zip.
//
// The two decks look alike on screen on purpose. The difference is underneath, and it shows
// when an AI tool (or a person) tries to add a slide or change the look.
// Builds are deterministic: dates and zip timestamps are fixed.

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const pptxgen = require("pptxgenjs");
const JSZip = require("jszip");
const d = require("docx");

const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "06-output-templates", "sample-files");
const FIXED = new Date(Date.UTC(2026, 9, 9, 12, 0, 0));
const FIXED_ISO = "2026-10-09T12:00:00Z";
const COMPANY = "Sinar Maju Sdn Bhd";

const THEME = {
  name: "Sinar Maju",
  headFontFace: "Calibri",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "1F2937", lt1: "FFFFFF", dk2: "7C2D12", lt2: "F3F4F6",
    accent1: "B45309", accent2: "0F766E", accent3: "D97706",
    accent4: "6B7280", accent5: "92400E", accent6: "0E7490",
    hlink: "B45309", folHlink: "7C2D12",
  },
};
const HEX = THEME.colors;
const W = 13.333, H = 7.5, M = 0.6;

// ---------------------------------------------------------------------------
// Shared helpers

async function normalise(input, { theme } = {}) {
  // Fix dates and zip timestamps (including the workbook inside a chart), write the theme
  // colours (pptxgenjs can't), and give title placeholders the standard index 0 so every
  // tool, python-pptx included, recognises them as slide titles.
  const zip = await JSZip.loadAsync(input);
  const out = new JSZip();
  for (const name of Object.keys(zip.files).sort()) {
    const entry = zip.files[name];
    if (entry.dir) continue;
    let data = await entry.async("nodebuffer");
    if (name === "docProps/core.xml") {
      data = Buffer.from(data.toString("utf8")
        .replace(/(<dcterms:created[^>]*>)[^<]*/, `$1${FIXED_ISO}`)
        .replace(/(<dcterms:modified[^>]*>)[^<]*/, `$1${FIXED_ISO}`));
    }
    if (name.endsWith(".xlsx")) data = await normalise(data);
    if (name === "ppt/presentation.xml") {  // pptxgenjs gives sections random ids; derive them from the name
      data = Buffer.from(data.toString("utf8").replace(/(<p14:section name="([^"]*)" id=")\{[^}]*\}/g, (_, pre, n) => {
        const h = crypto.createHash("md5").update(n).digest("hex");
        return `${pre}{${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}}`;
      }));
    }
    if (/^ppt\/(slides|slideLayouts)\/[^/]+\.xml$/.test(name)) {
      data = Buffer.from(data.toString("utf8").replace(/<p:ph\s+idx="\d+"\s+type="title"/g, '<p:ph type="title"'));
    }
    if (theme && /^ppt\/theme\/theme\d+\.xml$/.test(name)) {
      const c = theme.colors;
      const scheme = `<a:clrScheme name="${theme.name}">` +
        ["dk1", "lt1", "dk2", "lt2", "accent1", "accent2", "accent3", "accent4", "accent5", "accent6", "hlink", "folHlink"]
          .map((t) => `<a:${t}><a:srgbClr val="${c[t]}"/></a:${t}>`).join("") + `</a:clrScheme>`;
      data = Buffer.from(data.toString("utf8")
        .replace(/<a:clrScheme[\s\S]*?<\/a:clrScheme>/, scheme)
        .replace(/(<a:theme[^>]*name=")[^"]*"/, `$1${theme.name}"`));
    }
    out.file(name, data, { date: FIXED, createFolders: false });
  }
  return out.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}

async function finalise(file, opts) {
  fs.writeFileSync(file, await normalise(fs.readFileSync(file), opts));
}

// ---------------------------------------------------------------------------
// Well-built deck

async function buildGoodDeck(file) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.author = COMPANY;
  pres.company = COMPANY;
  pres.title = "Sinar Maju presentation template";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;

  // The logo mark: a rounded amber square with "SM", on every layout
  const mark = (x, y, s, fill, text) => ({
    text: { text: "SM", options: { x, y, w: s, h: s, shape: pres.ShapeType.roundRect, rectRadius: s * 0.22,
      fill: { color: fill }, align: "center", valign: "middle", bold: true, fontSize: Math.round(s * 28),
      color: text, margin: 0 } },
  });
  // Motif: a small stack of boxes (Sinar Maju is a distributor), drawn as rounded squares
  const boxes = (x, y, s, fill, alphas) => alphas.map((t, i) => ({
    rect: { x: x + (i % 3) * (s + 0.12), y: y + Math.floor(i / 3) * (s + 0.12), w: s, h: s,
      fill: { color: fill, transparency: t }, line: { type: "none" }, rectRadius: 0.08 },
  }));
  const footer = [
    mark(M, H - 0.66, 0.36, HEX.accent1, "FFFFFF"),
    { text: { text: `${COMPANY}  |  Internal`, options: { x: M + 0.5, y: H - 0.66, w: 6, h: 0.36, fontSize: 10,
      color: HEX.accent4, valign: "middle", margin: 0 } } },
  ];
  const slideNumber = { x: W - M - 0.8, y: H - 0.66, w: 0.8, h: 0.36, fontSize: 10, color: HEX.accent4, align: "right" };
  const title = (opts = {}) => ({ placeholder: { options: { name: "title", type: "title", align: "left", x: M, y: 0.45, w: W - 2 * M, h: 0.95,
    fontSize: 34, bold: true, color: C.text1, valign: "bottom", margin: 0, ...opts }, text: "Slide title" } });
  const body = (name, x, y, w, h, text, opts = {}) => ({ placeholder: { options: { name, type: "body", x, y, w, h,
    fontSize: 18, color: C.text1, valign: "top", margin: 0, paraSpaceAfter: 6, ...opts }, text } });

  pres.defineSlideMaster({
    title: "SM Title", background: { color: HEX.dk1 },
    objects: [
      mark(M, 0.6, 0.8, HEX.accent1, "FFFFFF"),
      ...boxes(W - M - 3.2, 1.6, 0.95, HEX.accent1, [0, 30, 60, 30, 0, 30, 60, 30, 0]),
      { placeholder: { options: { name: "title", type: "title", align: "left", x: M, y: 2.5, w: 8.4, h: 1.7, fontSize: 44, bold: true,
        color: C.background1, valign: "bottom", margin: 0 }, text: "Presentation title" } },
      body("subtitle", M, 4.35, 8.4, 0.9, "Subtitle", { fontSize: 20, color: "D1D5DB" }),
      body("date", M, 5.6, 8.4, 0.5, "Date | Presenter", { fontSize: 14, color: HEX.accent3 }),
    ],
  });
  pres.defineSlideMaster({
    title: "SM Section", background: { color: HEX.accent1 },
    objects: [
      ...boxes(W - M - 2.1, 2.3, 0.6, "FFFFFF", [70, 50, 70, 50, 30, 50, 70, 50, 70]),
      { placeholder: { options: { name: "title", type: "title", align: "left", x: M, y: 2.6, w: 9.5, h: 1.3, fontSize: 40, bold: true,
        color: C.background1, valign: "bottom", margin: 0 }, text: "Section title" } },
      body("subtitle", M, 4.05, 9.5, 0.8, "What this section covers", { fontSize: 20, color: "FDE68A" }),
      mark(M, H - 0.66, 0.36, "FFFFFF", HEX.accent1),
    ],
  });
  pres.defineSlideMaster({
    title: "SM Content", background: { color: HEX.lt1 }, slideNumber,
    objects: [...footer, title(), body("body", M, 1.65, W - 2 * M, 4.9, "Text")],
  });
  pres.defineSlideMaster({
    title: "SM Two Content", background: { color: HEX.lt1 }, slideNumber,
    objects: [...footer, title(), body("left", M, 1.65, 5.85, 4.9, "Text"), body("right", M + 6.28, 1.65, 5.85, 4.9, "Text")],
  });
  pres.defineSlideMaster({
    title: "SM Comparison", background: { color: HEX.lt1 }, slideNumber,
    objects: [...footer, title(),
      body("leftHead", M, 1.65, 5.85, 0.55, "Heading", { fontSize: 20, bold: true, color: C.accent1, valign: "middle" }),
      body("left", M, 2.3, 5.85, 4.25, "Text"),
      body("rightHead", M + 6.28, 1.65, 5.85, 0.55, "Heading", { fontSize: 20, bold: true, color: C.accent1, valign: "middle" }),
      body("right", M + 6.28, 2.3, 5.85, 4.25, "Text")],
  });
  pres.defineSlideMaster({
    title: "SM Title Only", background: { color: HEX.lt1 }, slideNumber, objects: [...footer, title()],
  });
  pres.defineSlideMaster({
    title: "SM Chart", background: { color: HEX.lt1 }, slideNumber,
    objects: [...footer, title(),
      { placeholder: { options: { name: "chart", type: "chart", x: M, y: 1.65, w: 8.1, h: 4.9, color: C.text1 }, text: "" } },
      body("takeaway", M + 8.5, 1.65, W - 2 * M - 8.5, 4.9, "Key takeaway", { fontSize: 16 })],
  });
  pres.defineSlideMaster({
    title: "SM Closing", background: { color: HEX.dk1 },
    objects: [
      mark(M, 0.6, 0.8, HEX.accent1, "FFFFFF"),
      ...boxes(W - M - 3.2, 1.6, 0.95, HEX.accent1, [60, 30, 0, 30, 0, 30, 0, 30, 60]),
      { placeholder: { options: { name: "title", type: "title", align: "left", x: M, y: 2.5, w: 8.4, h: 1.3, fontSize: 40, bold: true,
        color: C.background1, valign: "bottom", margin: 0 }, text: "Closing title" } },
      body("body", M, 4.0, 8.4, 2.4, "Text", { color: "D1D5DB" }),
    ],
  });

  const bullets = (items) => items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1 } }));

  pres.addSection({ title: "Opening" });
  let s = pres.addSlide({ masterName: "SM Title", sectionTitle: "Opening" });
  s.addText("Presentation title", { placeholder: "title" });
  s.addText("Subtitle: what you are asking for, in one line", { placeholder: "subtitle" });
  s.addText("Date  |  Presenter name, department", { placeholder: "date" });
  s.addNotes("Layout: SM Title. Use it once, for the first slide.");

  pres.addSection({ title: "Body" });
  s = pres.addSlide({ masterName: "SM Section", sectionTitle: "Body" });
  s.addText("Section title", { placeholder: "title" });
  s.addText("One line on what this section covers", { placeholder: "subtitle" });
  s.addNotes("Layout: SM Section. Use it to start each part of a longer deck.");

  s = pres.addSlide({ masterName: "SM Content", sectionTitle: "Body" });
  s.addText("Write the slide title as the message, in one sentence", { placeholder: "title" });
  s.addText(bullets([
    "Up to five bullets of supporting points",
    "Keep each bullet to one line where you can",
    "Put detail in the speaker notes, not on the slide",
  ]), { placeholder: "body" });
  s.addNotes("Layout: SM Content. The default layout for a message with supporting points.");

  s = pres.addSlide({ masterName: "SM Two Content", sectionTitle: "Body" });
  s.addText("Two related points side by side", { placeholder: "title" });
  s.addText(bullets(["Left column: the first point", "Its supporting detail"]), { placeholder: "left" });
  s.addText(bullets(["Right column: the second point", "Its supporting detail"]), { placeholder: "right" });
  s.addNotes("Layout: SM Two Content. Use it for two parallel points, such as a problem and its fix.");

  s = pres.addSlide({ masterName: "SM Comparison", sectionTitle: "Body" });
  s.addText("Option A against option B", { placeholder: "title" });
  s.addText("Option A", { placeholder: "leftHead" });
  s.addText(bullets(["What it costs", "What you get", "The main risk"]), { placeholder: "left" });
  s.addText("Option B", { placeholder: "rightHead" });
  s.addText(bullets(["What it costs", "What you get", "The main risk"]), { placeholder: "right" });
  s.addNotes("Layout: SM Comparison. Use it to compare two options under matching headings.");

  s = pres.addSlide({ masterName: "SM Title Only", sectionTitle: "Body" });
  s.addText("Use a table when the reader needs to compare figures", { placeholder: "title" });
  const th = (t) => ({ text: t, options: { bold: true, color: HEX.lt1, fill: { color: HEX.accent1 } } });
  const td = (t, opts = {}) => ({ text: t, options: opts });
  s.addTable([
    [th("Item"), th("Option A"), th("Option B"), th("Option C")],
    [td("Price"), td("RM0.00"), td("RM0.00"), td("RM0.00")],
    [td("Delivery"), td("0 days"), td("0 days"), td("0 days")],
    [td("Warranty"), td("0 years"), td("0 years"), td("0 years")],
    [td("Meets the requirement?"), td("Yes or no"), td("Yes or no"), td("Yes or no")],
  ], { x: M, y: 1.75, w: W - 2 * M, colW: [3.5, 2.71, 2.71, 3.213], fontSize: 16, color: HEX.dk1,
    border: { type: "solid", pt: 0.75, color: "D1D5DB" }, rowH: 0.55, valign: "middle", objectName: "Comparison table" });
  s.addNotes("Layout: SM Title Only, with a native table. Replace the sample rows; keep the header row style.");

  s = pres.addSlide({ masterName: "SM Chart", sectionTitle: "Body" });
  s.addText("Write the chart title as what the chart shows", { placeholder: "title" });
  s.addChart(pres.ChartType.bar, [{ name: "Value", labels: ["Q1", "Q2", "Q3", "Q4"], values: [40, 55, 48, 70] }], {
    placeholder: "chart", barDir: "col", chartColors: [HEX.accent1], showValue: true, dataLabelPosition: "outEnd",
    dataLabelFontFace: "+mn-lt", dataLabelFontSize: 12, dataLabelColor: HEX.dk1,
    catAxisLabelFontFace: "+mn-lt", catAxisLabelColor: HEX.accent4, catAxisLabelFontSize: 12,
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" }, showLegend: false,
  });
  s.addText(bullets(["One or two sentences on what the reader should take from the chart"]), { placeholder: "takeaway" });
  s.addNotes("Layout: SM Chart. Use a native chart so the figures stay editable.");

  pres.addSection({ title: "Close" });
  s = pres.addSlide({ masterName: "SM Closing", sectionTitle: "Close" });
  s.addText("Decision needed", { placeholder: "title" });
  s.addText(bullets(["What you are asking the approver to decide", "By when, and what happens next"]), { placeholder: "body" });
  s.addNotes("Layout: SM Closing. End with the decision or next step you need.");

  await pres.writeFile({ fileName: file });
  await finalise(file, { theme: THEME });
}

// ---------------------------------------------------------------------------
// Badly built deck: same slides, built the wrong way on purpose.
// Every slide uses the blank layout. Titles are loose text boxes (so no slide has a real title),
// sizes and positions drift, fonts are mixed, colours are typed in by hand, the footer and
// page numbers are typed on each slide (one is wrong), bullets are typed characters, the
// table is a grid of text boxes and the chart is drawn with rectangles. The theme is left as default.

async function buildBadDeck(file) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.author = COMPANY;
  pres.title = "Sinar Maju presentation";

  const box = (s, text, o) => s.addText(text, { isTextBox: true, margin: 0.05, ...o });
  const logo = (s, x, y, size, fill, color) => {
    s.addShape(pres.ShapeType.roundRect, { x, y, w: size, h: size, fill: { color: fill }, line: { type: "none" }, rectRadius: size * 0.22 });
    box(s, "SM", { x, y, w: size, h: size, align: "center", valign: "middle", bold: true, fontSize: Math.round(size * 28), color, fontFace: "Arial" });
  };
  const foot = (s, n, dx = 0) => {
    logo(s, M + dx, H - 0.66, 0.36, "B45309", "FFFFFF");
    box(s, `Sinar Maju Sdn Bhd  |  Internal`, { x: M + 0.5 + dx, y: H - 0.66, w: 6, h: 0.36, fontSize: 10, color: "808080", fontFace: "Arial" });
    box(s, String(n), { x: W - M - 0.8, y: H - 0.66, w: 0.8, h: 0.36, fontSize: 10, color: "808080", align: "right", fontFace: "Arial" });
  };
  const typedBullets = (items) => items.map((t) => `•  ${t}`).join("\n");
  const stack = (s, x, y, size, fill, alphas) => alphas.forEach((t, i) => s.addShape(pres.ShapeType.roundRect, {
    x: x + (i % 3) * (size + 0.12), y: y + Math.floor(i / 3) * (size + 0.12), w: size, h: size,
    fill: { color: fill, transparency: t }, line: { type: "none" }, rectRadius: 0.08 }));

  let s = pres.addSlide();
  s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: "1F2937" }, line: { type: "none" } });
  logo(s, M, 0.6, 0.8, "B45309", "FFFFFF");
  stack(s, W - M - 3.2, 1.6, 0.95, "B45309", [0, 30, 60, 30, 0, 30, 60, 30, 0]);
  box(s, "Presentation title", { x: M, y: 2.5, w: 8.4, h: 1.7, fontSize: 44, bold: true, color: "FFFFFF", valign: "bottom", fontFace: "Arial" });
  box(s, "Subtitle: what you are asking for, in one line", { x: M, y: 4.35, w: 8.4, h: 0.9, fontSize: 20, color: "D1D5DB", valign: "top", fontFace: "Arial" });
  box(s, "Date  |  Presenter name, department", { x: M, y: 5.6, w: 8.4, h: 0.5, fontSize: 14, color: "D97706", fontFace: "Arial" });

  s = pres.addSlide();
  s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: "C2410C" }, line: { type: "none" } });
  stack(s, W - M - 2.1, 2.3, 0.6, "FFFFFF", [70, 50, 70, 50, 30, 50, 70, 50, 70]);
  box(s, "Section title", { x: M, y: 2.7, w: 9.5, h: 1.2, fontSize: 40, bold: true, color: "FFFFFF", valign: "bottom", fontFace: "Century Gothic" });
  box(s, "One line on what this section covers", { x: M, y: 4.05, w: 9.5, h: 0.8, fontSize: 20, color: "FDE68A", fontFace: "Century Gothic" });

  s = pres.addSlide();
  box(s, "Write the slide title as the message, in one sentence", { x: M, y: 0.45, w: W - 2 * M, h: 0.95, fontSize: 34, bold: true, color: "1F2937", valign: "bottom", fontFace: "Calibri" });
  box(s, typedBullets(["Up to five bullets of supporting points", "Keep each bullet to one line where you can",
    "Put detail in the speaker notes, not on the slide"]), { x: M, y: 1.65, w: W - 2 * M, h: 4.9, fontSize: 18, color: "1F2937", valign: "top", fontFace: "Calibri" });
  foot(s, 3);

  s = pres.addSlide();
  box(s, "Two related points side by side", { x: M + 0.1, y: 0.55, w: W - 2 * M, h: 0.9, fontSize: 32, bold: true, color: "111827", valign: "bottom", fontFace: "Arial" });
  box(s, typedBullets(["Left column: the first point", "Its supporting detail"]), { x: M, y: 1.75, w: 5.85, h: 4.6, fontSize: 18, color: "1F2937", valign: "top", fontFace: "Arial" });
  box(s, typedBullets(["Right column: the second point", "Its supporting detail"]), { x: M + 6.4, y: 1.7, w: 5.7, h: 4.6, fontSize: 17, color: "1F2937", valign: "top", fontFace: "Calibri" });
  foot(s, 4, 0.05);

  s = pres.addSlide();
  box(s, "Option A against option B", { x: M, y: 0.4, w: W - 2 * M, h: 0.95, fontSize: 36, bold: true, color: "1F2937", valign: "bottom", fontFace: "Times New Roman" });
  box(s, "Option A", { x: M, y: 1.65, w: 5.85, h: 0.55, fontSize: 20, bold: true, color: "B45309", fontFace: "Calibri" });
  box(s, typedBullets(["What it costs", "What you get", "The main risk"]), { x: M, y: 2.3, w: 5.85, h: 4.2, fontSize: 18, color: "1F2937", valign: "top", fontFace: "Calibri" });
  box(s, "Option B", { x: M + 6.28, y: 1.65, w: 5.85, h: 0.55, fontSize: 20, bold: true, color: "D97706", fontFace: "Calibri" });
  box(s, typedBullets(["What it costs", "What you get", "The main risk"]), { x: M + 6.28, y: 2.3, w: 5.85, h: 4.2, fontSize: 18, color: "1F2937", valign: "top", fontFace: "Calibri" });
  foot(s, 4);

  s = pres.addSlide();
  box(s, "Use a table when the reader needs to compare figures", { x: M, y: 0.45, w: W - 2 * M, h: 0.95, fontSize: 34, bold: true, color: "1F2937", valign: "bottom", fontFace: "Calibri" });
  const rows = [["Item", "Option A", "Option B", "Option C"], ["Price", "RM0.00", "RM0.00", "RM0.00"],
    ["Delivery", "0 days", "0 days", "0 days"], ["Warranty", "0 years", "0 years", "0 years"],
    ["Meets the requirement?", "Yes or no", "Yes or no", "Yes or no"]];
  const colX = [M, M + 3.5, M + 6.21, M + 8.92], colW = [3.5, 2.71, 2.71, 3.213];
  rows.forEach((r, ri) => r.forEach((t, ci) => box(s, t, {
    x: colX[ci], y: 1.75 + ri * 0.55, w: colW[ci], h: 0.55, fontSize: 16, valign: "middle", fontFace: "Calibri",
    bold: ri === 0, color: ri === 0 ? "FFFFFF" : "1F2937", fill: ri === 0 ? { color: "B45309" } : undefined,
    line: { color: "D1D5DB", width: 0.75 } })));
  foot(s, 6);

  s = pres.addSlide();
  box(s, "Write the chart title as what the chart shows", { x: M, y: 0.45, w: W - 2 * M, h: 0.95, fontSize: 34, bold: true, color: "1F2937", valign: "bottom", fontFace: "Calibri" });
  [40, 55, 48, 70].forEach((v, i) => {
    const h = v / 70 * 3.6, x = M + 0.6 + i * 1.9, y = 1.95 + 3.6 - h;
    s.addShape(pres.ShapeType.rect, { x, y, w: 1.2, h, fill: { color: "B45309" }, line: { type: "none" } });
    box(s, String(v), { x, y: y - 0.4, w: 1.2, h: 0.35, align: "center", fontSize: 12, color: "1F2937", fontFace: "Calibri" });
    box(s, `Q${i + 1}`, { x, y: 5.65, w: 1.2, h: 0.35, align: "center", fontSize: 12, color: "6B7280", fontFace: "Calibri" });
  });
  box(s, typedBullets(["One or two sentences on what the reader should take from the chart"]), { x: M + 8.5, y: 1.65, w: W - 2 * M - 8.5, h: 4.9, fontSize: 16, color: "1F2937", valign: "top", fontFace: "Calibri" });
  foot(s, 7);

  s = pres.addSlide();
  s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: "1F2937" }, line: { type: "none" } });
  logo(s, M + 0.05, 0.62, 0.78, "B45309", "FFFFFF");
  stack(s, W - M - 3.2, 1.6, 0.95, "B45309", [60, 30, 0, 30, 0, 30, 0, 30, 60]);
  box(s, "Decision needed", { x: M, y: 2.5, w: 8.4, h: 1.3, fontSize: 40, bold: true, color: "FFFFFF", valign: "bottom", fontFace: "Arial" });
  box(s, typedBullets(["What you are asking the approver to decide", "By when, and what happens next"]), { x: M, y: 4.0, w: 8.4, h: 2.4, fontSize: 18, color: "D1D5DB", valign: "top", fontFace: "Arial" });

  await pres.writeFile({ fileName: file });
  await finalise(file);
}

// ---------------------------------------------------------------------------
// Approval memo template

async function buildMemo(file) {
  const AMBER = HEX.accent1, GREY = "6B7280", RULE = "D1D5DB";
  const CONTENT = 9412; // A4 width 11906 less 1247 margins each side
  const border = { style: d.BorderStyle.SINGLE, size: 4, color: RULE };
  const borders = { top: border, bottom: border, left: border, right: border };
  const ph = (t) => new d.TextRun({ text: t, style: "Placeholder" });
  const cell = (children, w, opts = {}) => new d.TableCell({
    width: { size: w, type: d.WidthType.DXA }, borders, margins: { top: 50, bottom: 50, left: 110, right: 110 },
    children: children instanceof d.Paragraph ? [children] : [new d.Paragraph({ children: [children] })], ...opts });
  const label = (t, w) => cell(new d.TextRun({ text: t, bold: true }), w,
    { shading: { fill: "F3F4F6", type: d.ShadingType.CLEAR, color: "auto" } });
  const head = (t, w) => cell(new d.TextRun({ text: t, bold: true, color: "FFFFFF" }), w,
    { shading: { fill: AMBER, type: d.ShadingType.CLEAR, color: "auto" } });
  const h1 = (t) => new d.Paragraph({ heading: d.HeadingLevel.HEADING_1, children: [new d.TextRun(t)] });
  const para = (...runs) => new d.Paragraph({ children: runs });

  const details = [["To", "[Approver's name and title]"], ["From", "[Your name, Procurement Executive]"],
    ["CC", "[Head of Procurement]"], ["Date", "[Date]"], ["Subject", "[Approval to purchase: item and quantity]"],
    ["Reference", "[RFQ number]"]];
  const detailTable = new d.Table({
    width: { size: CONTENT, type: d.WidthType.DXA }, columnWidths: [1900, CONTENT - 1900],
    rows: details.map(([a, b]) => new d.TableRow({ children: [label(a, 1900), cell(ph(b), CONTENT - 1900)] })),
  });

  const qCols = [2300, 1500, 1300, 1400, 1500, CONTENT - 8000];
  const qTable = new d.Table({
    width: { size: CONTENT, type: d.WidthType.DXA }, columnWidths: qCols,
    rows: [
      new d.TableRow({ tableHeader: true, children: ["Supplier", "Quotation No.", "Date", "Valid until", "Total incl. tax (RM)", "Meets the RFQ?"]
        .map((t, i) => head(t, qCols[i])) }),
      ...[1, 2, 3].map((n) => new d.TableRow({ children: [`[Supplier ${n}]`, "[No.]", "[Date]", "[Date]", "[0.00]", "[Yes or no]"]
        .map((t, i) => cell(new d.Paragraph({ alignment: i === 4 ? d.AlignmentType.RIGHT : d.AlignmentType.LEFT, children: [ph(t)] }), qCols[i])) })),
    ],
  });

  const aCols = [2400, 2800, 2412, 1800];
  const approvalTable = new d.Table({
    width: { size: CONTENT, type: d.WidthType.DXA }, columnWidths: aCols,
    rows: [
      new d.TableRow({ tableHeader: true, children: ["Role", "Name", "Signature", "Date"].map((t, i) => head(t, aCols[i])) }),
      ...[["Prepared by", "[Your name]"], ["Reviewed by", "[Head of Procurement]"], ["Approved by", "[Approver under Clause 3.1]"]]
        .map(([r, n]) => new d.TableRow({ height: { value: 520, rule: d.HeightRule.ATLEAST },
          children: [label(r, aCols[0]), cell(ph(n), aCols[1]), cell(new d.TextRun(""), aCols[2]), cell(new d.TextRun(""), aCols[3])] })),
    ],
  });

  const doc = new d.Document({
    creator: COMPANY, title: "Approval memo template", description: "Fictional training material",
    styles: {
      default: { document: { run: { font: "Calibri", size: 22, color: "1F2937" }, paragraph: { spacing: { after: 120, line: 276 } } } },
      paragraphStyles: [
        { id: "Title", name: "Title", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 40, bold: true, color: AMBER }, paragraph: { spacing: { before: 0, after: 160 } } },
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 26, bold: true, color: AMBER }, paragraph: { spacing: { before: 220, after: 80 }, outlineLevel: 0, keepNext: true } },
        { id: "Header", name: "header", basedOn: "Normal", run: { size: 16, color: GREY }, paragraph: { spacing: { after: 0 } } },
        { id: "Footer", name: "footer", basedOn: "Normal", run: { size: 16, color: GREY }, paragraph: { spacing: { after: 0 } } },
      ],
      characterStyles: [
        { id: "Placeholder", name: "Placeholder Text", basedOn: "DefaultParagraphFont", run: { italics: true, color: GREY } },
      ],
    },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1500, bottom: 1200, left: 1247, right: 1247, header: 600, footer: 560 } } },
      headers: { default: new d.Header({ children: [
        new d.Paragraph({ style: "Header", tabStops: [{ type: d.TabStopType.RIGHT, position: CONTENT }], children: [
          new d.TextRun({ text: "SINAR MAJU SDN BHD", bold: true, size: 26, color: AMBER }),
          new d.TextRun({ children: [new d.Tab(), "Internal memo"] })] }),
        new d.Paragraph({ style: "Header", border: { bottom: { style: d.BorderStyle.SINGLE, size: 8, color: AMBER, space: 4 } },
          children: [new d.TextRun("Lot 9, Jalan Kemajuan Niaga 3, Seksyen 13, 46200 Petaling Jaya, Selangor")] }),
      ] }) },
      footers: { default: new d.Footer({ children: [
        new d.Paragraph({ style: "Footer", tabStops: [{ type: d.TabStopType.RIGHT, position: CONTENT }], children: [
          new d.TextRun("Sinar Maju Sdn Bhd  |  Internal. Fictional training material."),
          new d.TextRun({ children: [new d.Tab(), "Page ", d.PageNumber.CURRENT, " of ", d.PageNumber.TOTAL_PAGES] }),
        ] }),
      ] }) },
      children: [
        new d.Paragraph({ heading: d.HeadingLevel.TITLE, children: [new d.TextRun("Approval Memo")] }),
        detailTable,
        h1("1. Purpose"),
        para(ph("[One or two sentences: what you are asking the approver to approve, and the total amount including tax.]")),
        h1("2. Background"),
        para(ph("[Why the purchase is needed, the RFQ issued, and the suppliers approached.]")),
        h1("3. Quotations Received"),
        qTable,
        new d.Paragraph({ spacing: { before: 80 }, children: [ph("[Note any quotation that is expired, incomplete or not like-for-like.]")] }),
        h1("4. Evaluation"),
        para(ph("[How the quotations compare like-for-like: price, specification, warranty, payment terms and delivery. "
          + "Name any problem found and the Procurement Policy clause it breaks.]")),
        h1("5. Recommendation"),
        para(ph("[The recommended supplier, the total amount including tax, and the reasons.]")),
        h1("6. Approval Required"),
        para(ph("[The approval needed under Procurement Policy Clause 3.1, based on the total including tax.]")),
        new d.Paragraph({ spacing: { before: 60, after: 60 }, children: [] }),
        approvalTable,
      ],
    }],
  });
  fs.writeFileSync(file, await d.Packer.toBuffer(doc));
  await finalise(file);
}

// ---------------------------------------------------------------------------

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const files = ["sinar-maju-deck.pptx", "sinar-maju-deck-bad.pptx", "sinar-maju-memo.docx"];
  await buildGoodDeck(path.join(OUT, files[0]));
  await buildBadDeck(path.join(OUT, files[1]));
  await buildMemo(path.join(OUT, files[2]));

  const zip = new JSZip();
  for (const f of files) zip.file(f, fs.readFileSync(path.join(OUT, f)), { date: FIXED });
  fs.writeFileSync(path.join(OUT, "..", "sample-files.zip"), await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
  for (const f of files) console.log(`Wrote 06-output-templates/sample-files/${f}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
