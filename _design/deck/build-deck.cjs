// Trainer deck for AI for Workplace (Advanced).
//   cd _design/deck && npm install && npm run build
// Writes AI-for-Workplace-Advanced-Deck.pptx to the repository root. Deterministic.
//
// Same design as the Copilot Chat Basic deck: Microsoft-style layout (Segoe UI, white
// space, outline icons, white cards) in Asraf's brand, with the mesh-gradient backgrounds
// from make-backgrounds.py. The deck never shows a seeded problem or an answer: those stay
// in the module notes' boxes and the answer keys in _trainer/.
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const pptxgen = require("pptxgenjs");
const JSZip = require("jszip");
const React = require("react");
const RDS = require("react-dom/server");
const sharp = require("sharp");
const lu = require("react-icons/lu");

const REPO = path.resolve(__dirname, "../..");
const OUT = path.join(REPO, "AI-for-Workplace-Advanced-Deck.pptx");
const SITE = "asraf-js.github.io/AI-for-Workplace-Advanced";
const FIXED = new Date(Date.UTC(2026, 9, 9, 12, 0, 0));
const FIXED_ISO = "2026-10-09T12:00:00Z";

const THEME = {
  name: "AI for Workplace Advanced",
  headFontFace: "Segoe UI Semibold",
  bodyFontFace: "Segoe UI",
  colors: {
    dk1: "1A1A2E", lt1: "FFFFFF", dk2: "1E2761", lt2: "F5F5F5",
    accent1: "6B5DD3", accent2: "028090", accent3: "D83B01",
    accent4: "616161", accent5: "107C10", accent6: "D13438",
    hlink: "6B5DD3", folHlink: "1E2761",
  },
};
const HEX = THEME.colors;
const RULE = "E0E0E0";
const CYAN = "00EEFC"; // the accent in Asraf's logo, used on dark slides only

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.author = "Asraf Jaafar Sidik";
pres.title = "AI for Workplace (Advanced)";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const HEAD = THEME.headFontFace;

// ---------- icons (outline, single colour, no containers) ----------
async function icon(name, color) {
  const svg = RDS.renderToStaticMarkup(React.createElement(lu["Lu" + name], { color: "#" + color, size: "256", strokeWidth: 1.6 }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// ---------- layouts ----------
const BG = (n) => ({ path: path.join(__dirname, "bg", n + ".jpg") });
const LOGO = (v, x, y, d) => ({ image: { path: path.join(__dirname, "bg", `logo-${v}.png`), x, y, w: d, h: d, altText: "Asraf JS logo" } });
pres.defineSlideMaster({
  title: "Title",
  background: BG("title"),
  objects: [
    LOGO("light", 0.72, 0.5, 0.85),
    { placeholder: { options: { name: "kicker", type: "body", x: 0.8, y: 1.6, w: 11, h: 0.4, fontSize: 16, color: CYAN, margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 2.1, w: 11.5, h: 1.5, fontSize: 48, color: C.background1, valign: "top", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 0.8, y: 3.7, w: 10, h: 1.0, fontSize: 22, color: C.background2, valign: "top", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "meta", type: "body", x: 0.8, y: 6.2, w: 10.5, h: 0.4, fontSize: 14, color: C.background2, margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "Divider",
  background: BG("divider"),
  objects: [
    LOGO("light", 0.75, 6.55, 0.55),
    { placeholder: { options: { name: "num", type: "body", x: 0.8, y: 1.0, w: 4, h: 1.6, fontSize: 88, fontFace: "Segoe UI Light", color: CYAN, valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 2.85, w: 11.5, h: 1.2, fontSize: 40, color: C.background1, valign: "top", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 0.8, y: 4.3, w: 7.6, h: 1.6, fontSize: 18, color: C.background1, valign: "top", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: 12.1, y: 6.95, w: 0.6, h: 0.3, fontSize: 10, color: C.background1, align: "right" },
});
// Four content layouts, identical except for the background art.
const CONTENT_BG = ["content", "content-b", "content-c", "content-d"];
CONTENT_BG.forEach((bg, i) => pres.defineSlideMaster({
  title: i ? `Content ${i + 1}` : "Content",
  background: BG(bg),
  objects: [
    { placeholder: { options: { name: "kicker", type: "body", x: 0.6, y: 0.4, w: 12, h: 0.35, fontSize: 14, color: C.accent4, margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.75, w: 12.1, h: 0.85, fontSize: 32, color: C.text1, valign: "top", align: "left", margin: 0 }, text: "" } },
    LOGO("dark", 0.55, 6.83, 0.42),
    { text: { text: "AI for Workplace (Advanced)", options: { x: 1.05, y: 6.95, w: 6, h: 0.3, fontSize: 10, color: C.accent4, margin: 0 } } },
  ],
  slideNumber: { x: 12.1, y: 6.95, w: 0.6, h: 0.3, fontSize: 10, color: C.accent4, align: "right" },
}));
pres.defineSlideMaster({
  title: "Statement",
  background: BG("statement"),
  objects: [
    LOGO("dark", 0.75, 0.55, 0.6),
    { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 2.2, w: 11.2, h: 2.0, fontSize: 40, color: C.accent1, valign: "bottom", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 0.8, y: 4.45, w: 10.5, h: 1.0, fontSize: 20, color: C.accent4, valign: "top", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: 12.1, y: 6.95, w: 0.6, h: 0.3, fontSize: 10, color: C.accent4, align: "right" },
});

// ---------- helpers ----------
let section = null;
function slide(master) { return pres.addSlide({ masterName: master, sectionTitle: section }); }
function sec(title) { section = title; pres.addSection({ title }); }

let contentCount = 0;
function content(kicker, title, notes) {
  const i = contentCount++ % CONTENT_BG.length;
  const s = slide(i ? `Content ${i + 1}` : "Content");
  s.addText(kicker, { placeholder: "kicker" });
  s.addText(title, { placeholder: "title" });
  if (notes) s.addNotes(notes);
  return s;
}
function panel(s, x, y, w, h, fill = C.background1, name = "Panel") {
  const light = fill === C.background1 || fill === C.background2;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.1, fill: { color: light ? C.background1 : fill }, line: { type: "none" }, objectName: name,
    shadow: light ? { type: "outer", color: "1B2A4A", opacity: 0.12, blur: 14, offset: 3, angle: 90 } : undefined,
  });
}
function rule(s, x, y, w) { s.addShape(pres.shapes.LINE, { x, y, w, h: 0, line: { color: RULE, width: 1 }, objectName: "Divider line" }); }
function ico(s, data, x, y, d = 0.5) { s.addImage({ data, x, y, w: d, h: d, altText: "" }); }
function txt(s, text, o) { s.addText(text, Object.assign({ margin: 0, isTextBox: true, valign: "top" }, o)); }
function head(s, text, x, y, w, size = 20, color = C.text1) { txt(s, text, { x, y, w, h: 0.5, fontSize: size, fontFace: HEAD, color }); }

function steps(s, items, x, y, w, rowH, size = 16) {
  items.forEach((it, i) => {
    const [h, d] = Array.isArray(it) ? it : [it, null];
    const yy = y + i * rowH;
    txt(s, String(i + 1), { x, y: yy, w: 0.45, h: rowH, fontSize: size + 4, fontFace: HEAD, color: C.accent1 });
    txt(s, d ? [
      { text: h, options: { fontFace: HEAD, color: C.text1, breakLine: true } },
      { text: d, options: { color: C.accent4 } },
    ] : h, { x: x + 0.5, y: yy + 0.04, w: w - 0.5, h: rowH, fontSize: size, color: C.text1 });
  });
}
function divider(num, title, stage, time, result, notes) {
  const s = slide("Divider");
  s.addText(num, { placeholder: "num" });
  s.addText([{ text: title, options: { fontSize: title.length > 40 ? 30 : 40 } }], { placeholder: "title" });
  s.addText([
    { text: `${stage}  |  ${time}`, options: { fontFace: HEAD, breakLine: true } },
    { text: " ", options: { fontSize: 8, breakLine: true } },
    { text: "Your result: " + result },
  ], { placeholder: "body" });
  if (notes) s.addNotes(notes);
}
function statement(title, sub, notes) {
  const s = slide("Statement");
  s.addText(title, { placeholder: "title" });
  if (sub) s.addText(sub, { placeholder: "body" });
  if (notes) s.addNotes(notes);
}
function columns(s, items, y, opts = {}) {
  const n = items.length, gap = 0.4, w = (12.1 - gap * (n - 1)) / n;
  items.forEach(([ic, h, d], i) => {
    const x = 0.6 + i * (w + gap);
    ico(s, ic, x, y, 0.55);
    txt(s, h, { x, y: y + 0.8, w, h: 0.85, fontSize: opts.size || 20, fontFace: HEAD, color: C.text1 });
    txt(s, d, { x, y: y + 1.7, w: w - 0.1, h: opts.textH || 1.6, fontSize: opts.body || 16, color: C.text1 });
  });
}
function twoPanels(s, left, right, I) {
  [[left, 0.6], [right, 6.75]].forEach(([[ic, h, lines], x]) => {
    panel(s, x, 1.95, 5.95, 4.55, C.background2, h);
    ico(s, ic, x + 0.4, 2.3, 0.55);
    head(s, h, x + 0.4, 3.0, 5.2, 22);
    txt(s, lines.map((l, i) => ({ text: l, options: { bullet: true, breakLine: i < lines.length - 1 } })),
      { x: x + 0.4, y: 3.65, w: 5.2, h: 2.7, fontSize: 16, color: C.text1, paraSpaceAfter: 6 });
  });
}
function flow(s, items, y) {
  const n = items.length, gap = 0.18, w = (12.1 - gap * (n - 1)) / n;
  items.forEach(([ic, h, d], i) => {
    const x = 0.6 + i * (w + gap);
    panel(s, x, y, w, 2.7, C.background2, h);
    ico(s, ic, x + 0.22, y + 0.25, 0.45);
    txt(s, h, { x: x + 0.22, y: y + 0.85, w: w - 0.4, h: 0.75, fontSize: 15, fontFace: HEAD, color: C.text1 });
    txt(s, d, { x: x + 0.22, y: y + 1.6, w: w - 0.4, h: 1.0, fontSize: 12, color: C.accent4 });
  });
}
function yourTurn(mod, title, items, checkpoint, notes, I) {
  const s = content(`Your turn  |  Module ${mod}`, title, notes);
  const rowH = Math.min(0.62, 4.6 / items.length);
  items.forEach(([ref, t], i) => {
    const y = 1.95 + i * rowH;
    txt(s, ref, { x: 0.6, y, w: 0.8, h: rowH, fontSize: 16, fontFace: HEAD, color: C.accent1 });
    txt(s, t, { x: 1.45, y, w: 6.4, h: rowH, fontSize: 16, color: C.text1 });
  });
  panel(s, 8.3, 1.95, 4.43, 4.55, C.background2, "Checkpoint panel");
  ico(s, I.clip, 8.65, 2.3, 0.5);
  head(s, "Checkpoint", 8.65, 2.95, 3.8, 20);
  txt(s, checkpoint, { x: 8.65, y: 3.5, w: 3.75, h: 1.9, fontSize: 16, color: C.text1 });
  rule(s, 8.65, 5.45, 3.75);
  txt(s, [
    { text: "Prompts: ", options: { fontFace: HEAD, color: C.text1 } },
    { text: `copy them from the Module ${mod} prompts page`, options: { color: C.accent4 } },
  ], { x: 8.65, y: 5.6, w: 3.75, h: 0.75, fontSize: 14 });
  return s;
}
function table(s, rows, colW, y = 1.95, size = 15) {
  const hdr = (t) => ({ text: t, options: { fontFace: HEAD, color: C.text1, border: [{ type: "none" }, { type: "none" }, { type: "solid", pt: 2, color: HEX.dk1 }, { type: "none" }] } });
  const cell = (t, o = {}) => ({ text: t, options: Object.assign({ border: [{ type: "none" }, { type: "none" }, { type: "solid", pt: 1, color: RULE }, { type: "none" }] }, o) });
  const body = rows.map((r, i) => i === 0 ? r.map(hdr) : r.map((t, j) => cell(t, j === 0 ? { fontFace: HEAD } : {})));
  s.addTable(body, { x: 0.6, y, w: 12.1, colW, fontSize: size, color: C.text1, rowH: 0.58, valign: "middle", margin: [0.06, 0.1, 0.06, 0] });
}

// ---------- deterministic output and theme colours ----------
async function finalise(file) {
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const out = new JSZip();
  for (const name of Object.keys(zip.files).sort()) {
    const entry = zip.files[name];
    if (entry.dir) continue;
    let data = await entry.async("nodebuffer");
    let t = null;
    if (name === "docProps/core.xml") {
      t = data.toString("utf8").replace(/(<dcterms:created[^>]*>)[^<]*/, `$1${FIXED_ISO}`).replace(/(<dcterms:modified[^>]*>)[^<]*/, `$1${FIXED_ISO}`);
    } else if (name === "ppt/presentation.xml") {
      t = data.toString("utf8").replace(/(<p14:section name="([^"]*)" id=")\{[^}]*\}/g, (_, pre, n) => {
        const h = crypto.createHash("md5").update(n).digest("hex");
        return `${pre}{${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}}`;
      });
    } else if (/^ppt\/theme\/theme\d+\.xml$/.test(name)) {
      const c = THEME.colors;
      const scheme = `<a:clrScheme name="${THEME.name}">` + ["dk1", "lt1", "dk2", "lt2", "accent1", "accent2", "accent3", "accent4", "accent5", "accent6", "hlink", "folHlink"]
        .map((k) => `<a:${k}><a:srgbClr val="${c[k]}"/></a:${k}>`).join("") + "</a:clrScheme>";
      t = data.toString("utf8").replace(/<a:clrScheme[\s\S]*?<\/a:clrScheme>/, scheme).replace(/(<a:theme[^>]*name=")[^"]*"/, `$1${THEME.name}"`);
    } else if (/^ppt\/(slides|slideLayouts)\/[^/]+\.xml$/.test(name)) {
      t = data.toString("utf8").replace(/<p:ph\s+idx="\d+"\s+type="title"/g, '<p:ph type="title"');
    }
    if (t !== null) data = Buffer.from(t);
    out.file(name, data, { date: FIXED, createFolders: false });
  }
  fs.writeFileSync(file, await out.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}

(async () => {
  const B = HEX.accent1;
  const names = {
    shield: "ShieldCheck", file: "FileText", mail: "Mail", calc: "Calculator", book: "BookOpen", pdf: "FileDown",
    zip: "FolderArchive", list: "ListChecks", users: "Users", bot: "Bot", pen: "PenLine", bulb: "Lightbulb",
    search: "Search", cal: "Calendar", copy: "Copy", clip: "ClipboardCheck", laptop: "Laptop", note: "Notebook",
    msg: "MessageSquare", workflow: "Workflow", plug: "Plug", db: "Database", scale: "Scale", table: "Table",
    braces: "Braces", deck: "Presentation", target: "Target", gauge: "Gauge", split: "Split", eye: "Eye",
    usercheck: "UserCheck", chart: "ChartColumn", layers: "Layers", brain: "Brain", zap: "Zap", scan: "ScanSearch",
    link: "Link", sheet: "FileSpreadsheet", route: "Route", hand: "Hand", repeat: "Repeat", settings: "Settings",
  };
  const I = {};
  for (const [k, n] of Object.entries(names)) I[k] = await icon(n, B);
  I.warn = await icon("TriangleAlert", HEX.accent3);
  I.lock = await icon("Lock", HEX.accent3);
  I.building = await icon("Building2", "FFFFFF");

  // =================== WELCOME ===================
  sec("Welcome");
  {
    const s = slide("Title");
    s.addText("Two-day advanced course", { placeholder: "kicker" });
    s.addText("AI for Workplace (Advanced)", { placeholder: "title" });
    s.addText("Custom assistants, grounding, templates, evaluation, agent workflows and AI governance", { placeholder: "body" });
    s.addText("Asraf Jaafar Sidik  |  Microsoft Certified Trainer  |  Copilot, ChatGPT, Claude and Gemini", { placeholder: "meta" });
    s.addNotes("Welcome everyone and introduce yourself. This is the follow-on to AI for Workplace (Beginner): everyone here already writes prompts. These two days are about building things with AI that you can trust and hand to colleagues.\n\nAsk the room: which AI tool does your company give you? Note the mix. Every lab works in Copilot, ChatGPT, Claude or Gemini.");
  }
  {
    const s = content("Your two days", "One assistant, built on Day 1 and improved on Day 2",
      "Read the scenario out. Sinar Maju is fictional, and so is every supplier, person and figure in the files.\n\nThe thread: on Day 1 they build a Quotation Checker and test it. On Day 2 they connect it, rebuild it as an n8n workflow with human approval, attack it, and write the rules for using it. The capstone applies everything to a new process.");
    panel(s, 0.6, 1.95, 6.6, 4.55, C.text2, "Scenario panel");
    ico(s, I.building, 1.0, 2.35, 0.6);
    txt(s, [
      { text: "You're a procurement executive at Sinar Maju Sdn Bhd, an office supplies distributor in Petaling Jaya.", options: { fontFace: HEAD, breakLine: true } },
      { text: " ", options: { fontSize: 10, breakLine: true } },
      { text: "Quotations arrive every week. Each one must be checked against the Procurement Policy before anyone can approve it. You're going to build an AI Quotation Checker, prove it works, and make it safe to use." },
    ], { x: 1.0, y: 3.2, w: 5.8, h: 3.0, fontSize: 18, color: C.background1 });
    [["13", "modules over two days"], ["1", "Quotation Checker you keep improving"], ["4", "AI tools: Copilot, ChatGPT, Claude, Gemini"]].forEach(([big, small], i) => {
      const y = 1.95 + i * 1.55;
      txt(s, big, { x: 7.8, y, w: 4.9, h: 0.8, fontSize: 40, fontFace: "Segoe UI Light", color: C.accent1 });
      txt(s, small, { x: 7.8, y: y + 0.8, w: 4.9, h: 0.4, fontSize: 16, color: C.accent4 });
      if (i < 2) rule(s, 7.8, y + 1.38, 4.9);
    });
  }
  {
    const s = content("The course at a glance", "Thirteen modules, one stage each",
      "Day 1 builds and tests: from how models behave, through the Quotation Checker, to scoring it. Day 2 connects and secures: agents, RAG, the n8n workflow, security, governance, and the capstone.\n\nThe stage names match the program flow banner on the course site.");
    const stages = [
      ["Understand", "How LLMs behave"], ["Instruct", "Context and structured output"], ["Build", "The Quotation Checker"],
      ["Ground", "Answers from your sources"], ["Analyse", "Purchase history"], ["Format", "Word and PowerPoint templates"],
      ["Measure", "Score the Checker"], ["Connect", "Agents, connectors, MCP"], ["Diagnose", "A wrong citation"],
      ["Automate", "n8n workflow, human approval"], ["Attack", "Hidden instructions"], ["Govern", "Rules and a register"], ["Pitch", "Capstone"],
    ];
    stages.forEach(([name, desc], i) => {
      const col = i % 7, row = Math.floor(i / 7);
      const x = 0.6 + col * 1.75, y = 1.95 + row * 2.35;
      rule(s, x, y, 1.55);
      txt(s, String(i + 1).padStart(2, "0"), { x, y: y + 0.15, w: 1.55, h: 0.6, fontSize: 26, fontFace: "Segoe UI Light", color: i < 7 ? C.accent1 : C.accent2 });
      head(s, name, x, y + 0.8, 1.6, 16);
      txt(s, desc, { x, y: y + 1.25, w: 1.55, h: 0.9, fontSize: 12, color: C.accent4 });
    });
  }
  {
    const s = content("The plan", "Day 1 builds and tests. Day 2 connects and secures.",
      "Times are the module estimates from the notes. Add breaks and lunch to suit the venue.\n\nProtect Module 03 (70 minutes) on Day 1, and Modules 10 and 13 (90 minutes each) on Day 2. Those are the ones that run long.");
    const d1 = [["01", "How LLMs behave", "40"], ["02", "Context and structured output", "50"], ["03", "Custom assistants", "70"], ["04", "Grounded research", "55"], ["05", "Data analysis", "55"], ["06", "Templates", "60"], ["07", "Evaluating output", "45"]];
    const d2 = [["08", "Agents, connectors, MCP", "45"], ["09", "RAG fundamentals", "50"], ["10", "n8n workflow", "90"], ["11", "AI security", "45"], ["12", "AI governance", "45"], ["13", "Capstone", "90"]];
    [[d1, "Day 1", 0.6], [d2, "Day 2", 6.85]].forEach(([rows, label, x]) => {
      head(s, label, x, 1.9, 5.9, 20);
      rows.forEach(([n, t, m], i) => {
        const y = 2.5 + i * 0.6;
        rule(s, x, y, 5.88);
        txt(s, n, { x, y: y + 0.1, w: 0.6, h: 0.45, fontSize: 15, fontFace: HEAD, color: C.accent1 });
        txt(s, t, { x: x + 0.65, y: y + 0.1, w: 4.0, h: 0.45, fontSize: 15, color: C.text1 });
        txt(s, m + " min", { x: x + 4.6, y: y + 0.1, w: 1.28, h: 0.45, fontSize: 14, color: C.accent4, align: "right" });
      });
      rule(s, x, 2.5 + rows.length * 0.6, 5.88);
    });
  }
  {
    const s = content("Your AI tool", "Use the tool your company gives you",
      "Every lab is written as a task, not a tool. Each module's Product Notes table and the product cards on the site show the clicks for each tool.\n\nCheck which tool each person will use, and pair people on the same tool where you can. Personal ChatGPT plans can't build GPTs any more: the Quotation Checker is a Project there. Gemini personal accounts use skills, because Gems on personal accounts end in November 2026.");
    columns(s, [
      [I.shield, "Copilot", "Copilot Chat (Basic) or M365 Copilot (Premium). Check the green shield"],
      [I.msg, "ChatGPT", "Free, Plus or Business. The Checker lives in a Project"],
      [I.note, "Claude", "Free, Pro or Team. The Checker lives in a Project"],
      [I.search, "Gemini", "Personal or Workspace. A skill or a Gem, plus Gemini Notebook"],
    ], 2.2, { textH: 2.0 });
  }
  {
    const s = content("Course site", "Everything is on one site",
      "Write the address on the whiteboard. No GitHub account is needed.\n\nStress copying prompts from the Prompts pages with the copy icon: the PDF can add line breaks in the middle of a prompt. Sample files download as one ZIP per module.");
    txt(s, SITE, { x: 0.6, y: 1.9, w: 12.1, h: 0.7, fontSize: 26, fontFace: HEAD, color: C.accent1 });
    columns(s, [
      [I.book, "Notes", "Steps for every module, with a What should you see? box to check your work"],
      [I.copy, "Prompts", "Every prompt you type, with a copy button on each box"],
      [I.layers, "Product cards", "How to do each lab in Copilot, ChatGPT, Claude or Gemini"],
      [I.zip, "Sample files", "Fictional quotations, policy, data and templates, one ZIP per module"],
    ], 3.1);
  }
  {
    const s = content("Ground rules", "Four rules for both days",
      "These protect the participants and their companies. Repeat rule 1 whenever someone is about to upload a file.\n\nTraining emails in Module 10 always start with [AIW TRAINING] and go only to yourself.");
    columns(s, [
      [I.file, "Fictional files only", "Use the sample files. Never upload real company or personal data to practise."],
      [I.lock, "Check your data setting", "Personal plans can train on your chats. The product cards show how to turn it off."],
      [I.mail, "Email only yourself", "Every training subject starts with [AIW TRAINING]."],
      [I.calc, "Check, don't trust", "Every lab has a check you do yourself. That's the point."],
    ], 2.2, { textH: 2.0 });
  }

  // =================== DAY 1 ===================
  sec("01 How LLMs behave");
  divider("01", "How Large Language Models Really Behave", "Stage: Understand", "40 minutes",
    "two analyses of the same quotation, from a fast model and a reasoning model, and a note on how they differ.",
    "Start with what's going on inside the tool. This explains most of what goes right and wrong for the rest of the course.");
  {
    const s = content("Module 01", "It predicts text. It doesn't look things up.",
      "Keep this light: no maths. The point is that a total printed in a quotation is just more text to the model unless it's asked to calculate.\n\nFast versus reasoning: reasoning models work through steps before answering. They catch more in checking tasks, but they can still miss things.");
    columns(s, [
      [I.brain, "Prediction", "It writes one small piece of text at a time, picking a likely next piece"],
      [I.repeat, "Answers vary", "The same prompt can give a different answer each time"],
      [I.zap, "Fast or reasoning", "Reasoning models work in steps first: slower, but they catch more"],
      [I.calc, "What to check", "Arithmetic, dates, and details that aren't in the source"],
    ], 2.2, { textH: 2.0 });
  }
  yourTurn("01", "One quotation, two kinds of model", [
    ["1.1", "Ask the same question twice"],
    ["1.2", "Check the quotation with a fast model"],
    ["1.3", "Check it again with a reasoning model"],
    ["1.4", "Discuss what each one noticed"],
  ], "You've written down the grand total each model gave, and checked one line yourself with a calculator.",
  "About 30 minutes. Sample files: Module 01 ZIP (the RFQ and one quotation).\n\nDon't tell them what to look for. The debrief question is: did the fast model check the figures, or repeat the ones printed on the page? The expected result is in the Module 01 box and the chair answer key.", I);

  sec("02 Context engineering");
  divider("02", "Context Engineering and Structured Output", "Stage: Instruct", "50 minutes",
    "a requirements checklist, a blank comparison table and a JSON version, all from the chair RFQ.",
    "Context engineering is putting the right things in front of the model, and nothing that gets in the way.");
  {
    const s = content("Module 02", "GCSE, one level up",
      "Recap GCSE from the Beginner course. The new part is boundaries: tell the model to use only the source, and what to do when the source doesn't answer.\n\nContext is everything the model sees: the prompt, files, earlier messages, custom instructions and memory. A long chat full of other tasks confuses it.");
    table(s, [
      ["", "What it means", "At this level, add"],
      ["Goal", "What you want done", "One job per prompt"],
      ["Context", "Who it's for and why", "Your role and the audience"],
      ["Source", "What to use", "\"Use only the attached RFQ\""],
      ["Expectations", "Format, length, tone", "The exact columns or JSON fields"],
    ], [2.2, 4.6, 5.3]);
  }
  {
    const s = content("Module 02", "Chain short prompts. Ask for the format you need.",
      "Chaining: check each step before the next depends on it. One big prompt makes mistakes hard to find.\n\nJSON matters on Day 2: the n8n workflow needs the AI's answer as fields, not a paragraph.");
    twoPanels(s,
      [I.link, "A prompt chain", ["Step 1: extract the requirements", "Step 2: turn them into a comparison table", "Step 3: give them as JSON", "Check each result before the next step"]],
      [I.braces, "Structured output", ["Markdown tables for people: they paste cleanly into Word and Excel", "JSON for software: named fields another system can read", "Ask for exact field names, and \"only the JSON\""]], I);
  }
  yourTurn("02", "A three-step chain on the chair RFQ", [
    ["2.1", "Extract the requirements"],
    ["2.2", "Turn them into a comparison table"],
    ["2.3", "Turn them into JSON"],
    ["2.4", "Compare with one big prompt"],
  ], "Every row of your checklist quotes the RFQ, and the JSON has the field names you asked for.",
  "About 40 minutes. Uses the RFQ from Module 01's ZIP.\n\nThere's no single right answer here: outputs vary. Check that rows can be quoted from the RFQ, and that steps 1 to 3 ran in the same chat.", I);

  sec("03 Custom assistants");
  divider("03", "Building Custom AI Assistants", "Stage: Build", "70 minutes",
    "a working Quotation Checker, its report on each chair quotation, and a recommendation you've checked yourself.",
    "The centre of Day 1. The Quotation Checker built here is reused in Modules 07, 10 and 11, so make sure everyone saves it.");
  {
    const s = content("Module 03", "Same idea, four names",
      "Make sure each person knows where their tool keeps a custom assistant before they start. The product cards have the clicks.\n\nCopilot Basic agents can't hold files, and Gemini skills hold plain text only: those participants upload the policy and vendor list in each chat.");
    table(s, [
      ["Tool", "What it's called", "Can it keep files?"],
      ["Copilot", "Agent (Agent Builder)", "Premium only. On Basic, upload in each chat"],
      ["ChatGPT", "Project (personal) or GPT (Business)", "Yes"],
      ["Claude", "Project", "Yes"],
      ["Gemini", "Skill (personal) or Gem (Workspace)", "Gems yes. Skills: plain text only"],
    ], [2.4, 4.8, 4.9]);
  }
  {
    const s = content("Module 03", "Good instructions have five parts",
      "Walk through the Checker instructions on the Module 03 prompts page and point out each part.\n\nThey deliberately leave out any rule about instructions hidden inside documents. Don't add it: participants break the Checker in Module 11 and add it then.");
    columns(s, [
      [I.usercheck, "Role", "Who it is, and who it works for"],
      [I.target, "Task", "What it does, and what it never does"],
      [I.list, "Steps", "The checks, in order, with the clause for each"],
      [I.table, "Format", "The same layout every time"],
      [I.scale, "Rules", "What to do when it isn't sure"],
    ], 2.2, { size: 19 });
  }
  yourTurn("03", "Build and test the Quotation Checker", [
    ["3.1", "Create the assistant and paste the instructions"],
    ["3.2", "Give it the policy and the vendor list"],
    ["3.3", "Check one quotation at a time, in new chats"],
    ["3.4", "Compare the three quotations as printed"],
    ["3.5", "Recommend a supplier, and check it yourself"],
  ], "Each quotation has a verdict and a clause, and you've checked one line of arithmetic with a calculator.",
  "About 55 minutes. Sample files: Module 03 ZIP.\n\nDon't reveal the problems in the three quotations. The expected results are in the Module 03 boxes and the chair answer key. If someone's Checker skips checks, have them reply: Run all seven checks in your instructions.", I);

  sec("04 Grounded research");
  divider("04", "Grounded Research and Source-Based Answers", "Stage: Ground", "55 minutes",
    "a policy notebook, five answers with checked citations, and one question it rightly can't answer.",
    "Gemini Notebook (formerly NotebookLM) works best for this lab, because each citation shows the exact quote. Copilot Notebooks and Projects also work.");
  {
    const s = content("Module 04", "Check a citation in thirty seconds",
      "The habit: ask for the clause number and the exact sentence every time. Then checking is quick.\n\nA good tool says \"that's not in the sources\". 4.4 tests this with a question the policy doesn't cover.");
    steps(s, [
      ["Ask for the clause and the exact sentence", "Start every question with \"Answer only from the sources\""],
      ["Open the source at that clause", "Click the citation, or search the PDF"],
      ["Compare the sentence with the answer", "Same meaning? Right clause?"],
      ["Mark it right or wrong", "A quote you can't find in the PDF is wrong"],
    ], 0.6, 1.95, 12, 1.1, 18);
  }
  yourTurn("04", "Build a policy notebook you can check", [
    ["4.1", "Set up the notebook with the policy and vendor list"],
    ["4.2", "Ask the five policy questions"],
    ["4.3", "Check every citation"],
    ["4.4", "Ask something the policy doesn't cover"],
  ], "Each answer is marked right or wrong after you've read the clause in the PDF.",
  "About 45 minutes. Sample files: Module 04 ZIP.\n\nThe expected answers are in the Module 04 boxes. If someone's tool invents a rule for the overseas-supplier question, that's the teaching moment: ask it to quote the clause.", I);

  sec("05 Data analysis");
  divider("05", "Advanced Data Analysis with AI", "Stage: Analyse", "55 minutes",
    "a cleaned view of the purchase history, a spend summary checked in Excel, and findings for the Finance Director.",
    "21 months of purchase orders. The lesson is clean first, define the measure, and check one figure yourself.");
  {
    const s = content("Module 05", "Clean, define, check",
      "Tools that run code (ChatGPT, Claude, Gemini, Copilot's Analyst) are far more reliable for sums than tools that read the file as text.\n\nThe Excel PivotTable check in 5.3 shows why cleaning matters: one supplier's total comes out higher in Excel. Let them find out why.");
    flow(s, [
      [I.scan, "Look first", "Rows, columns, dates and what each column means"],
      [I.eye, "Find the problems", "Duplicates, blanks, spellings, cancelled orders"],
      [I.target, "Define the measure", "Which column, what to leave out"],
      [I.chart, "Analyse", "Summaries, patterns, a chart"],
      [I.calc, "Check one figure", "A PivotTable in Excel"],
    ], 2.1);
  }
  yourTurn("05", "Analyse the purchase history", [
    ["5.1", "First look at the data"],
    ["5.2", "Find the data problems"],
    ["5.3", "Summarise the spend, then check it in Excel"],
    ["5.4", "Look for patterns"],
    ["5.5", "Make one chart"],
  ], "Your spend total matches the cleaned figure, and every finding has PO numbers you've looked up.",
  "About 45 minutes. Sample files: Module 05 ZIP (xlsx and csv).\n\nDon't name the patterns in advance. The expected findings are in the Module 05 boxes and the purchase history answer key.", I);

  sec("06 Templates");
  divider("06", "Controlling Output with Word and PowerPoint Templates", "Stage: Format", "60 minutes",
    "an approval memo on the company template, a four-slide deck, and a comparison of the good and bad templates.",
    "The two deck templates look almost the same. The difference is underneath, and it shows when AI fills them.");
  {
    const s = content("Module 06", "The template matters as much as the prompt",
      "Have everyone open both decks and try Home > Layout, Outline View and Check Accessibility before they use any AI. The bad deck has no real titles and only a blank layout.\n\n_design/templates/README.md lists every difference, for your reference.");
    twoPanels(s,
      [I.deck, "A well-built template", ["Named layouts in the slide master", "Placeholders for titles and content", "Theme fonts and colours", "Word styles: Title, Heading 1, Normal"]],
      [I.warn, "A badly built one", ["Every slide on a blank layout", "Titles as loose text boxes", "Fonts and colours typed in by hand", "AI copies what it sees, and drifts"]], I);
  }
  yourTurn("06", "Fill the templates", [
    ["6.1", "Look under the hood of both decks"],
    ["6.2", "Look at the memo's styles"],
    ["6.3", "Fill the memo"],
    ["6.4", "Make the deck from the good template"],
    ["6.5", "Do it again with the bad template"],
  ], "Your memo keeps the template's headings and has no grey placeholders left. You can name one difference between the two decks.",
  "About 50 minutes. Sample files: Module 06 ZIP. Needs desktop Word and PowerPoint.\n\nCopilot Chat (Basic) has no Copilot in the Office apps: those participants draft in chat and paste with Keep Text Only.", I);

  sec("07 Evaluating output");
  divider("07", "Evaluating AI Output", "Stage: Measure", "45 minutes",
    "a scoresheet for your Checker on ten test cases, a score out of 20, and better instructions.",
    "Three good reports aren't evidence. Ten cases with known answers are.");
  {
    const s = content("Module 07", "Two kinds of mistake",
      "Ask which mistake costs Sinar Maju more. Usually the false negative: a bad quotation gets through. But false positives teach people to ignore the Checker.\n\nThe test set includes traps of both kinds. Don't say which cases.");
    twoPanels(s,
      [I.warn, "False negative", ["Passes a quotation that should fail", "A bad quotation gets through", "Usually the costly one"]],
      [I.hand, "False positive", ["Fails a quotation that should pass", "Wastes time with the supplier", "Teaches people to ignore the Checker"]], I);
  }
  {
    const s = content("Module 07", "Test, score, change one thing, test again",
      "One point for the verdict, one for the clause: \"Fail\" for the wrong reason is luck.\n\nAfter any change, re-run all ten cases. A fix for one case can break another. That's regression testing.");
    steps(s, [
      ["Fix the test set first", "Cases with known answers, before the AI sees them"],
      ["Score the verdict and the reason", "1 point each, 20 in all"],
      ["Change one thing", "One rule in the instructions"],
      ["Re-run every case", "Did anything that was right go wrong?"],
    ], 0.6, 1.95, 12, 1.1, 18);
  }
  yourTurn("07", "Score your Quotation Checker", [
    ["7.1", "Set up your scoresheet"],
    ["7.2", "Run the ten cases, each in a new chat"],
    ["7.3", "Score the Checker"],
    ["7.4", "Improve one thing and test again"],
  ], "All ten rows are filled in and scored before anyone opens the answers.",
  "About 35 minutes. Sample files: Module 07 ZIP. Pairs can split the cases: 01 to 05 and 06 to 10.\n\nThe expected verdicts are in the Module 07 box and the test-case answer key. Remind them to keep the improved instructions for Modules 10 and 11.", I);

  {
    const s = content("End of Day 1", "What you built today",
      "Recap the day around the Quotation Checker. Ask each person for their Checker's score, and the one rule they changed.\n\nTell them to keep their assistant and their improved instructions: Day 2 starts from them.");
    const done = [[I.brain, "How models behave", "and what to check"], [I.bot, "A Quotation Checker", "with instructions you wrote"], [I.book, "A policy notebook", "with citations you checked"],
      [I.chart, "A spend analysis", "checked in Excel"], [I.deck, "A memo and a deck", "from company templates"], [I.gauge, "A score out of 20", "and one improvement you proved"]];
    done.forEach(([ic, h, d], i) => {
      const y = 1.95 + i * 0.75;
      ico(s, ic, 0.6, y + 0.1, 0.42);
      txt(s, h, { x: 1.3, y, w: 5.6, h: 0.6, fontSize: 19, fontFace: HEAD, color: C.text1, valign: "middle" });
      txt(s, d, { x: 7.0, y, w: 5.7, h: 0.6, fontSize: 17, color: C.accent4, valign: "middle" });
      rule(s, 0.6, y + 0.68, 12.1);
    });
  }

  // =================== DAY 2 ===================
  sec("Day 2");
  statement("Day 2: from assistant to workflow",
    "Connect it, automate it with a person's approval, attack it, govern it, then do it all again in the capstone.",
    "Welcome back. Ask: did anyone use their Checker or notebook since yesterday? Remind them which AI tool they're using and that their Checker instructions are on the Module 03 prompts page if they lost them.\n\nCheck everyone has the n8n access details you sent before Day 2.");

  sec("08 Agents and MCP");
  divider("08", "AI Agents, Connectors and MCP", "Stage: Connect", "45 minutes",
    "a systems map of the quotation process: each step, its system, read or write, and where a person approves.",
    "An agent acts, through connectors. Before building one, map exactly what it would touch.");
  {
    const s = content("Module 08", "An agent is an assistant that acts",
      "MCP: a common standard for connecting AI tools to other systems, a bit like USB-C. A system offers an MCP server; any tool that supports MCP can use it.\n\nRead versus write is the key distinction. Reading the vendor list is low risk; emailing a purchase order isn't.");
    columns(s, [
      [I.bot, "Assistant", "Answers and drafts from what you give it"],
      [I.workflow, "Agent", "Also acts: searches, updates, sends, using tools"],
      [I.plug, "Connector", "Links the AI to Outlook, Drive, SharePoint and more"],
      [I.link, "MCP", "A common standard for connectors, like USB-C for AI"],
    ], 2.2, { textH: 2.0 });
  }
  statement("Agents read and draft. People approve.",
    "Anything that leaves the company or commits money waits for a person.",
    "This is the rule of thumb for the whole of Day 2. Module 10's workflow is built on it.");
  yourTurn("08", "Map the quotation process", [
    ["8.1", "Describe the process today"],
    ["8.2", "Mark read, write and approval"],
    ["8.3", "Name the connectors"],
    ["8.4", "Spot the riskiest connector"],
  ], "Every step that sends something outside the company, or commits money, has a person's approval in front of it.",
  "About 35 minutes. No files.\n\nThe Module 08 box shows an example map. Maps will differ: judge the reasoning, especially the approvals.", I);

  sec("09 RAG");
  divider("09", "Retrieval-Augmented Generation (RAG) Fundamentals", "Stage: Diagnose", "50 minutes",
    "a plain-words diagnosis of a wrong citation, and a notebook fixed to answer from the current policy only.",
    "Someone adds an old copy of the policy to the notebook. What happens to the answers?");
  {
    const s = content("Module 09", "RAG in four steps",
      "Keep it plain: chunks, a meaning index, retrieval by meaning, answer from the chunks.\n\nThe key insight: retrieval matches meaning, not date or version. A chunk from page 2 doesn't carry page 1's SUPERSEDED stamp with it.");
    flow(s, [
      [I.split, "1. Split", "Each document is cut into small chunks"],
      [I.db, "2. Index", "Each chunk is stored by its meaning"],
      [I.search, "3. Retrieve", "Your question finds the closest chunks"],
      [I.msg, "4. Answer", "The model answers from those chunks, and cites them"],
    ], 2.1);
  }
  statement("Wrong citations usually start in the sources",
    "Keep superseded documents out, or label every page with its version.",
    "Fix A (telling the tool which version wins) helps. Fix B (removing the old file) is the one you can trust in six months.");
  yourTurn("09", "Find and fix a wrong citation", [
    ["9.1", "Add both policy versions to a notebook"],
    ["9.2", "Ask the four questions"],
    ["9.3", "Find the wrong citations"],
    ["9.4", "Diagnose why"],
    ["9.5", "Fix it two ways"],
  ], "You can say which RAG step let the old clause in, and why the page didn't warn the AI.",
  "About 40 minutes. Sample files: Module 09 ZIP (both policy versions).\n\nResults vary from run to run. The expected right and wrong answers are in the Module 09 box and the policy answer key.", I);

  sec("10 n8n workflow");
  divider("10", "Building an AI Agent Workflow in n8n", "Stage: Automate", "90 minutes",
    "a working n8n workflow that checks a quotation, routes it, and waits for your approval by email.",
    "The longest lab. Check before class that the starter imports into your trial account and that everyone has a working AI credential.");
  {
    const s = content("Module 10", "The workflow you'll build",
      "The first three nodes come in the starter file. Participants build the AI check, the vendor rule, the Switch and the approval.\n\nThe Code node checks the vendor list with a rule, not AI: a lookup is right every time.");
    flow(s, [
      [I.file, "Upload", "A form takes the quotation PDF"],
      [I.scan, "Read", "The PDF becomes text"],
      [I.settings, "Limits", "Policy limits added"],
      [I.brain, "AI check", "Returns JSON with a verdict"],
      [I.list, "Vendor rule", "Not on the list: reject"],
      [I.route, "Route", "Four routes by verdict"],
      [I.usercheck, "Approve", "A person clicks Approve"],
    ], 2.1);
  }
  statement("AI for judgement. Rules for facts. People for decisions.",
    "The split that makes a workflow safe to use.",
    "Come back to this line in the Module 10 debrief and again in the capstone.");
  yourTurn("10", "Build the quotation workflow", [
    ["10.1", "Import the starter workflow"],
    ["10.2", "Test the first three nodes"],
    ["10.3", "Add the AI check"],
    ["10.4", "Check the supplier with a rule"],
    ["10.5", "Route by verdict"],
    ["10.6", "Ask a person to approve"],
    ["10.7", "Run all four quotations"],
  ], "Each of the four quotations takes a different route, and nothing is approved until you click Approve.",
  "About 80 minutes. Sample files: Module 10 ZIP. Emails go only to yourself, with [AIW TRAINING] in the subject.\n\nCommon snags: the binary field name in Read the PDF text, Require Specific Output Format left off, and verdicts in the wrong case for the Switch. The expected routes are in the Module 10 box and the n8n answer key.", I);

  sec("11 AI security");
  divider("11", "AI Security for Practitioners", "Stage: Attack", "45 minutes",
    "a quotation with a hidden instruction, a record of how your Checker handled it, and better instructions.",
    "Participants attack their own Checker. Remind them: only test tools you own or have been asked to test.");
  {
    const s = content("Module 11", "Prompt injection: the document talks to the AI",
      "Indirect prompt injection: instructions hidden in content the AI reads, such as files, emails or web pages. White 1-point text is invisible to a person and plain text to the AI.\n\nThe four risks are from the OWASP Top 10 for LLM Applications (2025), in everyday terms.");
    columns(s, [
      [I.warn, "Prompt injection", "Hidden text tells the AI to change what it does"],
      [I.lock, "Data disclosure", "Data goes into a tool it shouldn't"],
      [I.zap, "Excessive agency", "An agent allowed to do too much on its own"],
      [I.eye, "Misinformation", "A confident wrong answer that nobody checks"],
    ], 2.2, { textH: 2.0 });
  }
  yourTurn("11", "Break your Checker, then defend it", [
    ["11.1", "Make the poisoned quotation in Word"],
    ["11.2", "Attack your Checker"],
    ["11.3", "Add the defence and re-test"],
    ["11.4", "Swap attacks with a partner"],
    ["11.5", "Sort data by which AI tool it may go into"],
  ], "After your fix, the poisoned quotation gets the right verdict and the hidden instruction is reported, and the original case still passes its re-test.",
  "About 40 minutes. Needs Word and the Module 07 files.\n\nCheckers react differently: some obey, some ignore it silently, some report it. Collect a few results across tools for the debrief. The expected behaviour is in the Module 11 boxes.", I);

  sec("12 AI governance");
  divider("12", "AI Governance in the Malaysian Context", "Stage: Govern", "45 minutes",
    "one page of AI rules for the Procurement Department, and a use-case register with risk ratings.",
    "This module explains rules for training, not legal advice. Before each class, check the status of the AI Governance Bill.");
  {
    const s = content("Module 12", "Malaysia's AI landscape",
      "PDPA amendments: in force from 1 June 2025 (Data Protection Officer, breach notification, data portability).\n\nAIGE: MOSTI, September 2024, voluntary.\n\nAI Governance Bill: public consultation by the National AI Office in July 2026, a risk-based draft. Not law as of October 2026: check before class.");
    columns(s, [
      [I.lock, "PDPA 2010 and the 2024 amendments", "Personal data in AI tools. A DPO, breach notification and data portability from 1 June 2025"],
      [I.scale, "National AI principles (AIGE)", "Seven voluntary principles from MOSTI, September 2024"],
      [I.file, "AI Governance Bill", "A proposed, risk-based law. Consulted on in July 2026. Not law yet"],
    ], 2.2, { size: 18, textH: 2.2 });
  }
  {
    const s = content("Module 12", "Seven national AI principles",
      "From the National Guidelines on AI Governance and Ethics (MOSTI, 2024). In 12.4 participants map their rules to these and look for gaps.");
    const p = ["Fairness", "Reliability, safety and control", "Privacy and security", "Inclusiveness", "Transparency", "Accountability", "Pursuit of human benefit and happiness"];
    p.forEach((t, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = 0.6 + col * 6.15, y = 1.95 + row * 1.15;
      rule(s, x, y, 5.9);
      txt(s, String(i + 1), { x, y: y + 0.2, w: 0.6, h: 0.7, fontSize: 26, fontFace: "Segoe UI Light", color: C.accent1 });
      txt(s, t, { x: x + 0.7, y: y + 0.25, w: 5.1, h: 0.7, fontSize: 19, fontFace: HEAD, color: C.text1 });
    });
  }
  yourTurn("12", "Rules and a register for your department", [
    ["12.1", "List the department's AI uses"],
    ["12.2", "Rate the risk"],
    ["12.3", "Write the department's AI rules"],
    ["12.4", "Check them against the national principles"],
  ], "Every use case has a risk rating with a reason, a human check and an owner. Every rule is something a person can actually do.",
  "About 35 minutes. No files.\n\nRisk ratings are judgement: the reason matters more than the label. The Module 12 box shows one defensible set. Delete any law or deadline the AI invents.", I);

  sec("13 Capstone");
  divider("13", "Capstone Project", "Stage: Pitch", "90 minutes",
    "an AI Workflow Canvas for a new Sinar Maju process, tested on its data, and a five-minute pitch.",
    "Teams of three or four. Step back: let them use the notes from both days. Hints only if a team is stuck.");
  {
    const s = content("Module 13", "Pick one of three briefs",
      "Each brief has its own sample data, with the tricky cases built in. Don't reveal them: teams find them in 13.3.\n\nTwo teams can pick the same brief. Their designs will differ.");
    columns(s, [
      [I.sheet, "A: Invoice matching", "Finance matches each invoice to its purchase order and goods received note"],
      [I.mail, "B: Stock enquiries", "Sales answers customer emails about stock, prices and delivery"],
      [I.chart, "C: Monthly spend report", "Procurement reports spend against budget to the Finance Director"],
    ], 2.2, { size: 19, textH: 2.0 });
  }
  {
    const s = content("Module 13", "Five minutes to pitch, scored out of 24",
      "Timing: 5 minutes pitch, 3 minutes questions per team. Other teams score with the rubric on the Module 13 page.\n\nTeams that test their design on the data usually score well on Risks and Testing.");
    table(s, [
      ["Criterion", "Strong looks like"],
      ["Problem and value", "Clear problem and users, with time or errors saved worked out"],
      ["Workflow design", "Every step marked AI, rule or person, with a clear trigger"],
      ["Human approval", "A person approves before anything leaves the company or money moves"],
      ["Risks and controls", "Hidden instructions and personal data handled, tricky cases covered"],
      ["Testing", "Test cases from the data, and a score to beat"],
      ["Pitch", "Clear, on time, answers questions with the design"],
    ], [3.4, 8.7], 1.9, 14);
  }
  yourTurn("13", "Design and pitch an AI workflow", [
    ["13.1", "Pick your brief"],
    ["13.2", "Understand the process"],
    ["13.3", "Test the data"],
    ["13.4", "Design the workflow on the canvas"],
    ["13.5", "Pitch and score"],
  ], "Your canvas marks every step as AI, rule or person, and your design handles the tricky cases in the data.",
  "About 55 minutes before pitches, then 35 minutes of pitches. Sample files: Module 13 ZIP, including the canvas.\n\nThe cases each brief's data contains are in the Module 13 boxes and the capstone answer key.", I);

  // =================== CLOSE ===================
  sec("Close");
  {
    const s = content("Wrap-up", "Five habits to take back to work",
      "Ask each person which habit they'll use first, and on what task.\n\nRecap the thread: one Quotation Checker, built, tested, grounded, automated with approval, attacked and governed.");
    const habits = [
      [I.target, "Give the AI bounded context", "the goal, the source, and the format"],
      [I.gauge, "Test before you trust", "cases with known answers, and a score"],
      [I.book, "Ground it in your sources", "and check the citation"],
      [I.usercheck, "Keep a person in front of actions", "AI for judgement, rules for facts, people for decisions"],
      [I.lock, "Decide the data before you paste", "which tool, which data, who checks"],
    ];
    habits.forEach(([ic, h, d], i) => {
      const y = 1.95 + i * 0.9;
      ico(s, ic, 0.6, y + 0.12, 0.45);
      txt(s, h, { x: 1.35, y, w: 5.6, h: 0.7, fontSize: 20, fontFace: HEAD, color: C.text1, valign: "middle" });
      txt(s, d, { x: 7.0, y, w: 5.7, h: 0.7, fontSize: 17, color: C.accent4, valign: "middle" });
      rule(s, 0.6, y + 0.8, 12.1);
    });
  }
  {
    const s = slide("Title");
    s.addText("Thank you", { placeholder: "kicker" });
    s.addText("Keep building, keep checking", { placeholder: "title" });
    s.addText("Notes, prompts, product cards, the course book and the sample files stay online after the course.", { placeholder: "body" });
    s.addText(SITE, { placeholder: "meta" });
    s.addNotes("Point them to the product cards for their own tool, and to the capstone canvas for designing their next workflow at work.\n\nAfter the course, questions go to the training coordinator who arranged the class.");
  }

  await pres.writeFile({ fileName: OUT });
  await finalise(OUT);
  console.log("Wrote", path.relative(REPO, OUT));
})();
