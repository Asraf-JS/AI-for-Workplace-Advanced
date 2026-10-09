"""Builds the fictional lab data and the trainer answer keys.

    python3 _design/sample-files/build-sample-files.py

Writes:
  01-how-llms-behave/sample-files/       one chair quotation and its RFQ
  03-custom-assistants/sample-files/     chair RFQ, three quotations, policy, approved vendor list
  04-grounded-research/sample-files/     policy, approved vendor list
  05-data-analysis/sample-files/         purchase history (.xlsx and .csv)
  07-evaluating-output/sample-files/     five open RFQs, ten test quotations, policy, approved vendor list
  09-rag-fundamentals/sample-files/      current policy (v3.0) and the superseded policy (v2.1)
  each of those folders' sample-files.zip
  _trainer/*.md (git ignores this folder)

Every figure lives in this file, so the files and the answer keys always agree.
The seeded problems are deliberate. Read the answer keys before changing a number.
All companies and people are fictional. The names were checked against a web search
in October 2026 and no matching business was found.
"""

import csv
import io
import math
import random
import re
import zipfile
from collections import defaultdict
from datetime import date, datetime, timedelta
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from reportlab import rl_config
from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (CondPageBreak, Flowable, KeepTogether, PageBreak, Paragraph,
                                SimpleDocTemplate, Spacer, Table, TableStyle)

ROOT = Path(__file__).resolve().parents[2]
rl_config.invariant = 1  # no build timestamps, so a rebuild only changes files whose content changed
FIXED_TIME = (2026, 10, 9, 12, 0, 0)
TAX_RATE = 0.08
CLASS_DATE = date(2026, 11, 10)  # the evaluation date used in the labs and the answer keys
FOOTER = ("FICTIONAL TRAINING MATERIAL for the AI for Workplace (Advanced) course. All companies, people,",
          "addresses, phone numbers and registration numbers are made up. The tax rate is for training only.")

CLIENT_NAME = "Sinar Maju Sdn Bhd"
CLIENT = [
    CLIENT_NAME,
    "Registration No. 201001018845 (902211-X)",
    "Lot 9, Jalan Kemajuan Niaga 3, Seksyen 13",
    "46200 Petaling Jaya, Selangor",
    "Attn: Procurement Department",
]
HEAD_OF_PROCUREMENT = "Rozita binti Mohd Ariff"
FINANCE_DIRECTOR = "Hafiz bin Kamarudin"
SM_ACCENT = colors.HexColor("#b45309")


def rm(x):
    return f"{x:,.2f}"


def d(dt):
    return f"{dt.day} {dt:%B %Y}"


def r2(x):
    return round(x + 1e-9, 2)


# ---------------------------------------------------------------------------
# Number to words, for the "Ringgit Malaysia" line
ONES = "Zero One Two Three Four Five Six Seven Eight Nine Ten Eleven Twelve Thirteen Fourteen Fifteen Sixteen Seventeen Eighteen Nineteen".split()
TENS = "_ _ Twenty Thirty Forty Fifty Sixty Seventy Eighty Ninety".split()


def words_below_1000(n):
    out = []
    if n >= 100:
        out.append(f"{ONES[n // 100]} Hundred")
        n %= 100
        if n:
            out.append("and")
    if n >= 20:
        out.append(TENS[n // 10] + (f"-{ONES[n % 10]}" if n % 10 else ""))
    elif n or not out:
        out.append(ONES[n])
    return " ".join(out)


def ringgit_words(x):
    whole = int(round(x, 2))
    sen = round((x - whole) * 100)
    parts = []
    if whole >= 1000:
        parts.append(f"{words_below_1000(whole // 1000)} Thousand")
        whole %= 1000
    if whole:
        parts.append(words_below_1000(whole))
    text = "Ringgit Malaysia " + " ".join(parts)
    if sen:
        text += f" and Sen {words_below_1000(sen)}"
    return text + " Only"


# ---------------------------------------------------------------------------
# Drawing helpers

class Signature(Flowable):
    """A signature scribble, the signer's details and a round company stamp."""

    def __init__(self, company, name, title, accent, opening="Yours faithfully,"):
        super().__init__()
        self.company, self.name, self.title, self.accent, self.opening = company, name, title, accent, opening
        self.width, self.height = 170 * mm, 38 * mm

    def draw(self):
        c = self.canv
        c.setFont("Helvetica", 9)
        c.drawString(0, 34 * mm, self.opening)
        c.setFont("Helvetica-Bold", 9)
        c.drawString(0, 29 * mm, f"For {self.company}")
        c.setStrokeColor(colors.HexColor("#1f3a93"))
        c.setLineWidth(1.1)
        p = c.beginPath()
        seed = sum(map(ord, self.name)) % 7
        p.moveTo(4 * mm, 17 * mm)
        for i in range(1, 40):
            t = i / 39
            x = 4 * mm + t * 42 * mm
            y = 17 * mm + math.sin(t * (9 + seed)) * 3.2 * mm * (1 - t * 0.5) + t * 2 * mm
            p.lineTo(x, y)
        c.drawPath(p)
        c.setStrokeColor(colors.black)
        c.setLineWidth(0.5)
        c.line(0, 12 * mm, 60 * mm, 12 * mm)
        c.setFont("Helvetica-Bold", 9)
        c.drawString(0, 8 * mm, self.name)
        c.setFont("Helvetica", 8.5)
        c.drawString(0, 4 * mm, self.title)
        # stamp
        cx, cy, r = 92 * mm, 20 * mm, 14 * mm
        c.setStrokeColor(self.accent)
        c.setFillColor(self.accent)
        c.setLineWidth(1.4)
        c.circle(cx, cy, r)
        c.setLineWidth(0.6)
        c.circle(cx, cy, r - 2.2 * mm)
        upper = self.company.upper()
        suffix = "SDN BHD" if upper.endswith(" SDN BHD") else ""
        words = upper.replace(" SDN BHD", "").split()
        lines = [" ".join(words[: (len(words) + 1) // 2]), " ".join(words[(len(words) + 1) // 2:]), suffix]
        for i, line in enumerate(l for l in lines if l):
            size = 6.2
            while c.stringWidth(line, "Helvetica-Bold", size) > 2 * (r - 4 * mm) and size > 4:
                size -= 0.2
            c.setFont("Helvetica-Bold", size)
            c.drawCentredString(cx, cy + (3 - i * 3.2) * mm, line)
        c.setFont("Helvetica", 5)
        c.drawCentredString(cx, cy - 7.5 * mm, "AUTHORISED")


def styles(accent):
    base = dict(fontName="Helvetica", fontSize=9, leading=12)
    return {
        "body": ParagraphStyle("body", **base),
        "small": ParagraphStyle("small", fontName="Helvetica", fontSize=8, leading=10.5),
        "bold": ParagraphStyle("bold", fontName="Helvetica-Bold", fontSize=9, leading=12),
        "right": ParagraphStyle("right", alignment=TA_RIGHT, **base),
        "title": ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=17, leading=21, textColor=accent),
        "h": ParagraphStyle("h", fontName="Helvetica-Bold", fontSize=10.5, leading=13.5, textColor=accent,
                            spaceBefore=7, spaceAfter=3),
        "h2": ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=9.5, leading=12.5, spaceBefore=4, spaceAfter=2),
        "clause": ParagraphStyle("clause", leftIndent=9 * mm, firstLineIndent=-9 * mm, spaceAfter=3, **base),
        "cell": ParagraphStyle("cell", fontName="Helvetica", fontSize=8.5, leading=11),
        "cellb": ParagraphStyle("cellb", fontName="Helvetica-Bold", fontSize=8.5, leading=11),
        "bullet": ParagraphStyle("bullet", leftIndent=12, bulletIndent=3, **base),
    }


def footer(c, w):
    c.setFillColor(colors.HexColor("#666666"))
    c.setFont("Helvetica-Oblique", 6.8)
    c.drawCentredString(w / 2, 11 * mm, FOOTER[0])
    c.drawCentredString(w / 2, 8 * mm, FOOTER[1])


def vendor_frame(vendor):
    accent = colors.HexColor(vendor["accent"])

    def draw(c, doc):
        w, h = A4
        c.saveState()
        style = vendor["letterhead"]
        if style == "band":
            c.setFillColor(accent)
            c.rect(0, h - 34 * mm, w, 34 * mm, stroke=0, fill=1)
            text_col = colors.white
        else:
            text_col = colors.black
        lx, ly = 18 * mm, h - 27 * mm
        if style == "band":
            c.setFillColor(colors.white)
            c.roundRect(lx, ly, 18 * mm, 18 * mm, 3 * mm, stroke=0, fill=1)
            c.setFillColor(accent)
        else:
            c.setFillColor(accent)
            if style == "round":
                c.circle(lx + 9 * mm, ly + 9 * mm, 9 * mm, stroke=0, fill=1)
            else:
                c.roundRect(lx, ly, 18 * mm, 18 * mm, 3 * mm, stroke=0, fill=1)
            c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 13)
        c.drawCentredString(lx + 9 * mm, ly + 6.6 * mm, vendor["initials"])
        c.setFillColor(text_col if style == "band" else accent)
        c.setFont("Helvetica-Bold", 15)
        c.drawString(42 * mm, h - 14 * mm, vendor["name"])
        c.setFillColor(text_col)
        c.setFont("Helvetica", 7.8)
        reg = f"Registration No. {vendor['reg']}"
        if vendor.get("sst"):
            reg += f"     SST Reg. No. {vendor['sst']}"
        c.drawString(42 * mm, h - 19 * mm, reg)
        c.drawString(42 * mm, h - 23 * mm, vendor["address"])
        c.drawString(42 * mm, h - 27 * mm, f"Tel: {vendor['tel']}   Email: {vendor['email']}")
        if style != "band":
            c.setStrokeColor(accent)
            c.setLineWidth(1.6)
            c.line(18 * mm, h - 33 * mm, w - 18 * mm, h - 33 * mm)
        footer(c, w)
        c.setFont("Helvetica", 7)
        c.drawRightString(w - 18 * mm, 15 * mm, f"Page {doc.page}")
        c.restoreState()

    return draw


def sm_frame(left_line, right_lines, superseded=False):
    """Sinar Maju letterhead for RFQs, the policy and the vendor list."""

    def draw(c, doc):
        w, h = A4
        c.saveState()
        c.setFillColor(SM_ACCENT)
        c.roundRect(18 * mm, h - 26 * mm, 13 * mm, 13 * mm, 2.5 * mm, stroke=0, fill=1)
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 10)
        c.drawCentredString(24.5 * mm, h - 21.2 * mm, "SM")
        c.setFillColor(SM_ACCENT)
        c.setFont("Helvetica-Bold", 13)
        c.drawString(35 * mm, h - 18 * mm, CLIENT_NAME)
        c.setFillColor(colors.black)
        c.setFont("Helvetica", 8)
        c.drawString(35 * mm, h - 23 * mm, left_line)
        for i, line in enumerate(right_lines):
            c.drawRightString(w - 18 * mm, h - 18 * mm - i * 5 * mm, line)
        c.setStrokeColor(SM_ACCENT)
        c.setLineWidth(1.2)
        c.line(18 * mm, h - 29 * mm, w - 18 * mm, h - 29 * mm)
        if superseded and doc.page == 1:
            c.setStrokeColor(colors.HexColor("#b91c1c"))
            c.setFillColor(colors.HexColor("#b91c1c"))
            c.setLineWidth(1.6)
            c.roundRect(w - 76 * mm, h - 48 * mm, 58 * mm, 14 * mm, 2 * mm, stroke=1, fill=0)
            c.setFont("Helvetica-Bold", 11)
            c.drawCentredString(w - 47 * mm, h - 40 * mm, "SUPERSEDED")
            c.setFont("Helvetica", 7)
            c.drawCentredString(w - 47 * mm, h - 45 * mm, "Replaced by Version 3.0 on 1 July 2026")
        footer(c, w)
        c.setFont("Helvetica", 7)
        c.setFillColor(colors.HexColor("#666666"))
        c.drawRightString(w - 18 * mm, 15 * mm, f"Page {doc.page}")
        c.drawString(18 * mm, 15 * mm, "Internal. For Sinar Maju staff and registered suppliers.")
        c.restoreState()

    return draw


def grid_table(rows, widths, s, head_bg="#fde7c7"):
    t = Table([[Paragraph(str(c), s["cellb" if i == 0 else "cell"]) for c in r] for i, r in enumerate(rows)],
              colWidths=widths, repeatRows=1)
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(head_bg)),
                           ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#999999")),
                           ("VALIGN", (0, 0), (-1, -1), "TOP")]))
    return t


# ---------------------------------------------------------------------------
# Quotations

def quote_figures(v):
    """True and printed figures. Seeded errors live in v['printed']."""
    lines = [r2(q * p) for _, q, _, p in v["items"]]
    gross = r2(sum(lines))
    disc = r2(gross * v["discount"][1]) if v.get("discount") else 0.0
    sub = r2(gross - disc)
    tax = r2(sub * TAX_RATE)
    grand = r2(sub + tax)

    pr = v.get("printed", {})
    p_lines = [pr.get("lines", {}).get(i, a) for i, a in enumerate(lines)]
    p_gross = r2(sum(p_lines))
    p_disc = r2(p_gross * v["discount"][1]) if v.get("discount") else 0.0
    p_sub = pr.get("subtotal", r2(p_gross - p_disc))
    p_tax = r2(p_sub * TAX_RATE)
    p_grand = r2(p_sub + p_tax)
    return dict(lines=lines, gross=gross, disc=disc, sub=sub, tax=tax, grand=grand,
                p_lines=p_lines, p_gross=p_gross, p_disc=p_disc, p_sub=p_sub, p_tax=p_tax, p_grand=p_grand)


def build_quotation(v, out_dir):
    accent = colors.HexColor(v["accent"])
    s = styles(accent)
    path = out_dir / v["file"]
    doc = SimpleDocTemplate(str(path), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm,
                            topMargin=40 * mm, bottomMargin=22 * mm,
                            title=f"Quotation {v['quote_no']}", author=v["name"],
                            subject="Fictional training material")
    f = quote_figures(v)
    story = [Paragraph("QUOTATION", s["title"]), Spacer(1, 4 * mm)]

    to_block = Paragraph("<b>To:</b><br/>" + "<br/>".join(CLIENT), s["body"])
    meta_rows = [
        ["Quotation No.", v["quote_no"]],
        ["Date", d(v["date"])],
        ["Valid until", d(v["valid_until"])],
        ["Your reference", v["your_ref"]],
        ["Contact", v["contact"]],
    ]
    meta = Table([[Paragraph(f"<b>{a}</b>", s["cell"]), Paragraph(b, s["cell"])] for a, b in meta_rows],
                 colWidths=[28 * mm, 52 * mm])
    meta.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.6, accent),
        ("INNERGRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#cccccc")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f3f3f3")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    head = Table([[to_block, meta]], colWidths=[94 * mm, 80 * mm])
    head.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (0, 0), 0)]))
    story += [head, Spacer(1, 5 * mm)]
    story += [Paragraph(f"<b>Subject: {v['subject']}</b>", s["body"]), Spacer(1, 2 * mm),
              Paragraph(v["opening"], s["body"]), Spacer(1, 4 * mm)]

    rows = [[Paragraph(f"<b>{h}</b>", s["cell"]) for h in ["No.", "Description", "Qty", "Unit", "Unit price (RM)", "Amount (RM)"]]]
    for i, (desc, qty, unit, price) in enumerate(v["items"]):
        rows.append([str(i + 1), Paragraph(desc, s["cell"]), f"{qty:,}", unit, rm(price), rm(f["p_lines"][i])])
    n = len(rows)
    tail = []
    if v.get("discount"):
        tail += [["", "", "", "", "Gross amount", rm(f["p_gross"])],
                 ["", "", "", "", v["discount"][0], f"({rm(f['p_disc'])})"]]
    tail += [["", "", "", "", "Subtotal", rm(f["p_sub"])],
             ["", "", "", "", f"Tax (SST) @ {int(TAX_RATE * 100)}%", rm(f["p_tax"])],
             ["", "", "", "", "Grand total", rm(f["p_grand"])]]
    rows += tail
    t = Table(rows, colWidths=[11 * mm, 77 * mm, 14 * mm, 14 * mm, 28 * mm, 30 * mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), accent),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONT", (0, 1), (-1, -1), "Helvetica", 8.5),
        ("ALIGN", (2, 1), (-1, -1), "RIGHT"),
        ("ALIGN", (0, 1), (0, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, n - 1), 0.4, colors.HexColor("#bbbbbb")),
        ("LINEABOVE", (4, n), (-1, n), 0.6, colors.black),
        ("FONT", (4, n), (4, -1), "Helvetica-Bold", 8.5),
        ("FONT", (4, -1), (-1, -1), "Helvetica-Bold", 9),
        ("LINEABOVE", (4, -1), (-1, -1), 0.8, colors.black),
        ("LINEBELOW", (4, -1), (-1, -1), 1.2, colors.black),
        ("BACKGROUND", (4, -1), (-1, -1), colors.HexColor("#f3f3f3")),
    ]))
    story += [t, Spacer(1, 2 * mm), Paragraph(f"<i>{ringgit_words(f['p_grand'])}</i>", s["small"]), Spacer(1, 4 * mm)]

    story.append(Paragraph("Terms and conditions", s["h"]))
    terms = [[Paragraph(f"<b>{a}</b>", s["cell"]), Paragraph(b, s["cell"])] for a, b in v["terms"]]
    tt = Table(terms, colWidths=[34 * mm, 140 * mm])
    tt.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (0, -1), 0),
                            ("BOTTOMPADDING", (0, 0), (-1, -1), 2), ("TOPPADDING", (0, 0), (-1, -1), 2)]))
    story += [tt, Spacer(1, 3 * mm)]
    if v.get("closing"):
        story += [Paragraph(v["closing"], s["body"]), Spacer(1, 4 * mm)]
    story.append(KeepTogether([Spacer(1, 2 * mm), Signature(v["name"], v["signer"], v["signer_title"], accent)]))
    doc.build(story, onFirstPage=vendor_frame(v), onLaterPages=vendor_frame(v))
    return path, f


PRICES_TERM = "Prices are in Ringgit Malaysia. Tax is shown separately above."

# ---------------------------------------------------------------------------
# Main scenario: RFQ-2026-118, 120 ergonomic chairs for resale (Modules 01, 03, later 10)

CHAIR_RFQ = dict(
    no="RFQ-2026-118", issued=date(2026, 10, 12), closing=date(2026, 10, 26),
    title="Ergonomic mesh office chairs for resale (120 units)",
    intro=("Sinar Maju invites you to quote for the supply of ergonomic mesh office chairs, which we will "
           "resell to our corporate customers under the supplier's brand."),
    requirements=[
        ("Quantity", "120 units, one model"),
        ("Backrest", "Breathable mesh, with adjustable lumbar support"),
        ("Seat", "Height adjustable, with a Class 4 gas lift"),
        ("Armrests", "3D adjustable (height, width and pivot)"),
        ("Warranty", "5 years on the frame, mechanism and gas lift"),
        ("Delivery", "Within 21 days of the purchase order, to our Petaling Jaya warehouse"),
        ("Packaging", "Individually boxed for resale"),
    ],
)

CHAIR_TERMS = "Delivered to Sinar Maju warehouse, Seksyen 13, Petaling Jaya."

CHAIR_VENDORS = [
    dict(
        key="A", vid="V005", file="quotation-duduk-selesa.pdf", name="Duduk Selesa Furnishings Sdn Bhd", initials="DS",
        reg="201401031277 (1107734-H)", sst="B16-1809-32004418", accent="#0f766e", letterhead="rule",
        address="No. 14, Jalan Industri Batu Caves 1/3, Taman Perindustrian Batu Caves, 68100 Batu Caves, Selangor",
        tel="03-6187 2240", email="sales@dudukselesa.example",
        quote_no="DSF/QT/26/1043", date=date(2026, 10, 21), valid_until=date(2026, 12, 20),
        your_ref="RFQ-2026-118", contact="Lim Siew Peng, 012-776 3018",
        subject="Supply of 120 units of ergonomic mesh office chairs",
        opening="Thank you for your RFQ. We are pleased to quote as follows.",
        items=[
            ("Selesa ErgoMesh 500 chair. Breathable mesh backrest with adjustable lumbar support, "
             "height-adjustable seat with Class 4 gas lift, 3D adjustable armrests, synchronous tilt "
             "mechanism, nylon base. Individually boxed.", 120, "unit", 365.00),
            ("Delivery to Petaling Jaya warehouse", 1, "lot", 300.00),
        ],
        printed=dict(lines={0: 42800.00}),  # 120 x 365.00 is 43,800.00; the line is RM1,000 short
        terms=[
            ("Validity", "60 days from the date of this quotation."),
            ("Payment", "30 days from date of invoice."),
            ("Delivery", "14 to 18 days from receipt of purchase order."),
            ("Warranty", "5 years on frame, mechanism and gas lift. 2 years on mesh and upholstery."),
            ("Prices", PRICES_TERM),
        ],
        closing="We look forward to your purchase order.",
        signer="Lim Siew Peng", signer_title="Key Account Manager",
    ),
    dict(
        key="B", vid="V006", file="quotation-kerusi-nadira.pdf", name="Kerusi Nadira Trading", initials="KN",
        reg="202003114562 (JM0891245-T)", sst="J31-2004-32011907", accent="#7c2d12", letterhead="band",
        address="No. 8, Jalan Perniagaan Setia 2, Taman Perniagaan Setia, 81100 Johor Bahru, Johor",
        tel="07-338 1946", email="quote@kerusinadira.example",
        quote_no="KNT-2610-077", date=date(2026, 10, 22), valid_until=date(2026, 12, 6),
        your_ref="RFQ-2026-118", contact="Mohd Azlan bin Yusof, 019-712 6604",
        subject="Quotation: ergonomic mesh chairs (120 units)",
        opening="We refer to your RFQ and are pleased to offer our most competitive price.",
        items=[
            ("Nadira AirFlex chair. Mesh backrest with adjustable lumbar support, height-adjustable "
             "seat with Class 4 gas lift, 3D adjustable armrests, tilt lock. Individually boxed.", 120, "unit", 335.00),
            ("Delivery to Petaling Jaya (complimentary)", 1, "lot", 0.00),
        ],
        terms=[
            ("Validity", "45 days from the date of this quotation."),
            ("Payment", "30 days from date of invoice."),
            ("Delivery", "Within 21 days of purchase order."),
            ("Warranty", "3 years on frame. 1 year on mechanism and gas lift."),
            ("Prices", PRICES_TERM),
        ],
        closing="Thank you for the opportunity to quote.",
        signer="Mohd Azlan bin Yusof", signer_title="Sales Director",
    ),
    dict(
        key="C", vid="V007", file="quotation-ergoluma.pdf", name="Ergoluma Seating Sdn Bhd", initials="EL",
        reg="201801027715 (1287702-A)", sst="B10-1811-32008831", accent="#4338ca", letterhead="round",
        address="Lot 22, Jalan Hiliran 1/7, Kawasan Perindustrian Shah Alam, 40000 Shah Alam, Selangor",
        tel="03-5519 0472", email="sales@ergoluma.example",
        quote_no="ELS/Q/2026/0388", date=date(2026, 10, 23), valid_until=date(2026, 11, 22),
        your_ref="RFQ-2026-118", contact="Priya Ramasamy, 016-224 9150",
        subject="Ergonomic mesh office chairs for resale",
        opening="Further to your RFQ, please find our quotation below.",
        items=[
            ("Ergoluma Vista Mesh chair. Mesh backrest with adjustable lumbar support, height-adjustable "
             "seat with Class 4 gas lift, 3D adjustable armrests, seat slider, aluminium base. "
             "Individually boxed.", 120, "unit", 372.00),
            ("Delivery to Petaling Jaya warehouse", 1, "lot", 250.00),
        ],
        terms=[
            ("Validity", "30 days from the date of this quotation."),
            ("Payment", "50% deposit with purchase order. Balance 30 days from date of invoice."),
            ("Delivery", "Within 21 days of receipt of deposit."),
            ("Warranty", "5 years on frame, mechanism and gas lift."),
            ("Prices", PRICES_TERM),
        ],
        closing="Our deposit terms let us reserve production capacity for your order.",
        signer="Priya Ramasamy", signer_title="Business Development Manager",
    ),
]

# ---------------------------------------------------------------------------
# Module 07: five open RFQs and ten test quotations with known verdicts

OPEN_RFQS = [
    dict(no="RFQ-2026-121", title="A4 copier paper for resale",
         requirements=[("Item", "A4 copier paper, 80 gsm, 500 sheets a ream, any brand"),
                       ("Quantity", "1,500 reams"), ("Delivery", "Within 14 days of the purchase order")]),
    dict(no="RFQ-2026-122", title="Toner cartridges for resale",
         requirements=[("Item", "LaserPro 26X black toner cartridge, original (not compatible or remanufactured)"),
                       ("Quantity", "200 units"), ("Delivery", "Within 10 days of the purchase order")]),
    dict(no="RFQ-2026-123", title="Warehouse barcode scanners",
         requirements=[("Item", "Handheld 2D barcode scanner, wireless, with charging cradle"),
                       ("Quantity", "12 units"), ("Warranty", "At least 2 years"),
                       ("Delivery", "Within 21 days of the purchase order")]),
    dict(no="RFQ-2026-124", title="Office cleaning services, Petaling Jaya head office",
         requirements=[("Scope", "Daily cleaning of the head office (about 1,200 square metres), Monday to Friday, "
                                 "two cleaners, 8 am to 5 pm, cleaning supplies included"),
                       ("Term", "12 months from 1 January 2027"), ("Price", "Monthly fee")]),
    dict(no="RFQ-2026-125", title="Boltless steel shelving for the warehouse",
         requirements=[("Item", "Boltless steel shelving bay, 2.0 m high, 5 levels"),
                       ("Load", "At least 300 kg per level"), ("Quantity", "40 bays"),
                       ("Installation", "Delivery and installation included"),
                       ("Delivery", "Within 21 days of the purchase order")]),
]
OPEN_RFQ_ISSUED, OPEN_RFQ_CLOSING = date(2026, 10, 5), date(2026, 10, 19)

STD_TERMS = lambda validity, delivery, warranty=None, payment="30 days from date of invoice.": [
    t for t in [("Validity", validity), ("Payment", payment), ("Delivery", delivery),
                ("Warranty", warranty) if warranty else None, ("Prices", PRICES_TERM)] if t]

TEST_CASES = [
    dict(case=1, rfq="RFQ-2026-121", expect="Pass", clause="",
         why="Clean. Meets the requirement, arithmetic correct, valid, on the AVL.",
         v=dict(vid="V001", file="case-01-kertas-lestari.pdf", name="Kertas Lestari Sdn Bhd", initials="KL",
                reg="201201009933 (987421-D)", sst="B16-1808-32000781", accent="#166534", letterhead="rule",
                address="No. 5, Jalan Pelabur 23/1, Seksyen 23, 40300 Shah Alam, Selangor",
                tel="03-5541 3307", email="sales@kertaslestari.example",
                quote_no="KL-Q-26-2214", date=date(2026, 10, 13), valid_until=date(2026, 12, 12),
                your_ref="RFQ-2026-121", contact="Ong Mei Ling, 012-205 4471",
                subject="A4 copier paper, 1,500 reams", opening="We are pleased to quote as follows.",
                items=[("Lestari Copy A4 copier paper, 80 gsm, 500 sheets a ream", 1500, "ream", 11.80)],
                terms=STD_TERMS("60 days from the date of this quotation.", "7 days from purchase order. Free delivery to Petaling Jaya."),
                signer="Ong Mei Ling", signer_title="Sales Executive")),
    dict(case=2, rfq="RFQ-2026-121", expect="Fail", clause="4.4",
         why="Arithmetic error: the subtotal is printed as RM17,820.00, but the lines add up to RM17,280.00. "
             "Tax and grand total are overstated as a result.",
         v=dict(vid="V002", file="case-02-pualam-paper.pdf", name="Pualam Paper Merchants Sdn Bhd", initials="PP",
                reg="200901024408 (868715-U)", sst="W10-1808-32002345", accent="#1e3a8a", letterhead="band",
                address="No. 31, Jalan Kuchai Maju 8, Kuchai Entrepreneurs Park, 58200 Kuala Lumpur",
                tel="03-7983 1162", email="orders@pualampaper.example",
                quote_no="PPM/26/Q/0917", date=date(2026, 10, 14), valid_until=date(2026, 11, 28),
                your_ref="RFQ-2026-121", contact="Rajesh Kumar, 017-390 2258",
                subject="Quotation for A4 copier paper", opening="Please find our quotation below.",
                items=[("Pualam Premium A4 copier paper, 80 gsm, 500 sheets a ream", 1500, "ream", 11.40),
                       ("Delivery to Petaling Jaya", 1, "lot", 180.00)],
                printed=dict(subtotal=17820.00),
                terms=STD_TERMS("45 days from the date of this quotation.", "10 days from purchase order."),
                signer="Rajesh Kumar", signer_title="Sales Manager")),
    dict(case=3, rfq="RFQ-2026-122", expect="Pass", clause="",
         why="Clean. The 5% volume discount is applied correctly. A checker that flags the discount line is a false positive.",
         v=dict(vid="V003", file="case-03-tintaria.pdf", name="Tintaria Imaging Supplies Sdn Bhd", initials="TI",
                reg="201601040125 (1209037-M)", sst="B16-1809-32006652", accent="#9d174d", letterhead="round",
                address="No. 12, Jalan TPP 5/1, Taman Perindustrian Puchong, 47100 Puchong, Selangor",
                tel="03-8061 5528", email="sales@tintaria.example",
                quote_no="TIS-QT-26-0611", date=date(2026, 10, 15), valid_until=date(2026, 12, 14),
                your_ref="RFQ-2026-122", contact="Chan Wai Kit, 016-338 7790",
                subject="LaserPro 26X toner cartridges, 200 units", opening="Thank you for your RFQ.",
                items=[("LaserPro 26X black toner cartridge, original, sealed retail box", 200, "unit", 238.00)],
                discount=("Less volume discount 5%", 0.05),
                terms=STD_TERMS("60 days from the date of this quotation.", "5 working days from purchase order.",
                                "Manufacturer's warranty until the cartridge's printed expiry date."),
                signer="Chan Wai Kit", signer_title="Account Manager")),
    dict(case=4, rfq="RFQ-2026-122", expect="Fail", clause="5.1",
         why="Supplier is not on the Approved Vendor List. Cheapest of the two toner quotes, which makes it tempting.",
         v=dict(vid=None, file="case-04-dakwat-seroja.pdf", name="Dakwat Seroja Enterprise", initials="DS",
                reg="202203087716 (003391856-W)", sst="B16-2206-32014420", accent="#0369a1", letterhead="rule",
                address="No. 47, Jalan Wawasan 2/3, Bandar Baru Ampang, 68000 Ampang, Selangor",
                tel="03-4292 6618", email="dakwatseroja@mail.example",
                quote_no="DSE-0458", date=date(2026, 10, 16), valid_until=date(2026, 12, 15),
                your_ref="RFQ-2026-122", contact="Siti Hajar binti Osman, 011-2398 4410",
                subject="Toner cartridges", opening="We are pleased to quote our best price.",
                items=[("LaserPro 26X black toner cartridge, original", 200, "unit", 229.00)],
                terms=STD_TERMS("60 days from the date of this quotation.", "7 days from purchase order."),
                signer="Siti Hajar binti Osman", signer_title="Owner")),
    dict(case=5, rfq="RFQ-2026-123", expect="Fail", clause="4.2",
         why="Expired: valid until 5 November 2026, before the evaluation date of 10 November 2026.",
         v=dict(vid="V008", file="case-05-imbas-teraju.pdf", name="Imbas Teraju Systems Sdn Bhd", initials="IT",
                reg="201501036620 (1162278-P)", sst="W10-1808-32004960", accent="#0e7490", letterhead="band",
                address="Unit 8-2, Jalan PJU 5/9, Kota Damansara, 47810 Petaling Jaya, Selangor",
                tel="03-6142 7735", email="sales@imbasteraju.example",
                quote_no="ITS/QT/2026/351", date=date(2026, 10, 6), valid_until=date(2026, 11, 5),
                your_ref="RFQ-2026-123", contact="Nurul Izzah binti Rahman, 013-447 2286",
                subject="Handheld 2D barcode scanners", opening="We are pleased to submit our quotation.",
                items=[("Teraju S2 handheld 2D barcode scanner, wireless (Bluetooth), with charging cradle", 12, "unit", 1450.00)],
                terms=STD_TERMS("30 days from the date of this quotation.", "14 days from purchase order.",
                                "2 years, return to base."),
                signer="Nurul Izzah binti Rahman", signer_title="Solutions Consultant")),
    dict(case=6, rfq="RFQ-2026-123", expect="Pass", clause="",
         why="Clean. The charging cradle is a separate line, which is still like-for-like.",
         v=dict(vid="V009", file="case-06-kodbar-nusa.pdf", name="Kodbar Nusa Technology Sdn Bhd", initials="KN",
                reg="201901017340 (1328845-V)", sst="B16-1907-32009176", accent="#7e22ce", letterhead="rule",
                address="No. 3, Jalan Utarid U5/14, Seksyen U5, 40150 Shah Alam, Selangor",
                tel="03-7845 2201", email="sales@kodbarnusa.example",
                quote_no="KNT-Q-2610-112", date=date(2026, 10, 17), valid_until=date(2026, 12, 16),
                your_ref="RFQ-2026-123", contact="Benjamin Yap, 012-689 3304",
                subject="Wireless 2D barcode scanners (12 units)", opening="Thank you for inviting us to quote.",
                items=[("Nusa ScanPro 2D handheld barcode scanner, wireless", 12, "unit", 1520.00),
                       ("Charging cradle for ScanPro 2D", 12, "unit", 95.00),
                       ("Delivery and setup (complimentary)", 1, "lot", 0.00)],
                terms=STD_TERMS("60 days from the date of this quotation.", "10 days from purchase order.",
                                "3 years, advance replacement."),
                signer="Benjamin Yap", signer_title="Sales Manager")),
    dict(case=7, rfq="RFQ-2026-124", expect="Fail", clause="4.5",
         why="Charges tax (SST) but shows no SST registration number anywhere on the quotation.",
         v=dict(vid="V011", file="case-07-bersih-kemboja.pdf", name="Bersih Kemboja Services Sdn Bhd", initials="BK",
                reg="201301028894 (1059127-K)", sst=None, accent="#15803d", letterhead="round",
                address="No. 19, Jalan SS 2/61, SS 2, 47300 Petaling Jaya, Selangor",
                tel="03-7865 3390", email="admin@bersihkemboja.example",
                quote_no="BKS/2026/Q-208", date=date(2026, 10, 15), valid_until=date(2026, 12, 31),
                your_ref="RFQ-2026-124", contact="Kavitha Subramaniam, 012-901 4475",
                subject="Office cleaning services, 12 months", opening="We are pleased to propose our cleaning services.",
                items=[("Daily office cleaning, Monday to Friday, two cleaners, 8 am to 5 pm, cleaning supplies "
                        "included. Monthly fee, January to December 2027.", 12, "month", 3850.00)],
                terms=STD_TERMS("Until 31 December 2026.", "Service starts 1 January 2027.",
                                payment="Monthly in arrears, 30 days from date of invoice."),
                signer="Kavitha Subramaniam", signer_title="Operations Manager")),
    dict(case=8, rfq="RFQ-2026-124", expect="Pass", clause="",
         why="Clean. The 30% advance is exactly at the limit in Clause 6.2, which allows up to 30%. "
             "A checker that flags it is a false positive.",
         v=dict(vid="V010", file="case-08-kilau-embun.pdf", name="Kilau Embun Facility Services Sdn Bhd", initials="KE",
                reg="201101015562 (944180-T)", sst="W10-1808-32003318", accent="#b45309", letterhead="band",
                address="No. 2, Jalan 51A/225A, Seksyen 51A, 46100 Petaling Jaya, Selangor",
                tel="03-7956 1184", email="contracts@kilauembun.example",
                quote_no="KEF-Q-26-0733", date=date(2026, 10, 16), valid_until=date(2026, 12, 15),
                your_ref="RFQ-2026-124", contact="Faizal bin Ismail, 019-334 8812",
                subject="Cleaning services for Sinar Maju head office", opening="Thank you for your RFQ.",
                items=[("Daily office cleaning, Monday to Friday, two cleaners, 8 am to 5 pm, cleaning supplies "
                        "included. Monthly fee, January to December 2027.", 12, "month", 3780.00)],
                terms=STD_TERMS("60 days from the date of this quotation.", "Service starts 1 January 2027.",
                                payment="30% of the contract value in advance on signing. Balance in monthly "
                                        "instalments, 30 days from date of invoice."),
                signer="Faizal bin Ismail", signer_title="Contracts Manager")),
    dict(case=9, rfq="RFQ-2026-125", expect="Fail", clause="4.3",
         why="Not like-for-like: 250 kg per level against the required 300 kg.",
         v=dict(vid="V012", file="case-09-rakmas.pdf", name="Rakmas Storage Solutions Sdn Bhd", initials="RS",
                reg="201701042218 (1255903-X)", sst="B16-1801-32007744", accent="#334155", letterhead="rule",
                address="Lot 1088, Jalan Kapar, Batu 5, 42100 Klang, Selangor",
                tel="03-3291 6645", email="sales@rakmas.example",
                quote_no="RSS-26-Q-0490", date=date(2026, 10, 14), valid_until=date(2026, 12, 13),
                your_ref="RFQ-2026-125", contact="Gary Teoh, 012-280 5519",
                subject="Boltless steel shelving, 40 bays", opening="We are pleased to quote as follows.",
                items=[("Boltless steel shelving bay, 2.0 m (H) x 1.5 m (W) x 0.6 m (D), 5 levels, "
                        "250 kg per level", 40, "bay", 640.00),
                       ("Delivery and installation", 1, "lot", 1200.00)],
                terms=STD_TERMS("60 days from the date of this quotation.", "14 days from purchase order.",
                                "1 year on workmanship."),
                signer="Gary Teoh", signer_title="Project Sales Manager")),
    dict(case=10, rfq="RFQ-2026-125", expect="Fail", clause="4.2, 6.2",
         why="Two problems: valid for only 14 days (until 30 October 2026, so expired by 10 November and "
             "below the 30-day minimum), and asks for a 50% deposit (limit is 30%).",
         v=dict(vid="V013", file="case-10-rangka-waja.pdf", name="Rangka Waja Ironworks Sdn Bhd", initials="RW",
                reg="200801033571 (833642-W)", sst="B16-1808-32001609", accent="#991b1b", letterhead="band",
                address="No. 6, Jalan Perindustrian Bukit Minyak 7, 14100 Simpang Ampat, Pulau Pinang",
                tel="04-508 3317", email="sales@rangkawaja.example",
                quote_no="RWI/Q/26/1127", date=date(2026, 10, 16), valid_until=date(2026, 10, 30),
                your_ref="RFQ-2026-125", contact="Tan Kok Wai, 012-477 6031",
                subject="Warehouse shelving (40 bays)", opening="Please find our competitive offer below.",
                items=[("Boltless steel shelving bay, 2.0 m (H) x 1.5 m (W) x 0.6 m (D), 5 levels, "
                        "350 kg per level", 40, "bay", 615.00),
                       ("Delivery and installation, Petaling Jaya", 1, "lot", 1500.00)],
                terms=STD_TERMS("14 days from the date of this quotation.", "21 days from receipt of deposit.",
                                "2 years on workmanship.",
                                payment="50% deposit with purchase order. Balance on completion of installation."),
                signer="Tan Kok Wai", signer_title="General Manager")),
]


# ---------------------------------------------------------------------------
# Sinar Maju documents: RFQs, procurement policy, approved vendor list

def build_rfq_doc(path, rfqs, issued, closing, title):
    s = styles(SM_ACCENT)
    doc = SimpleDocTemplate(str(path), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm,
                            topMargin=36 * mm, bottomMargin=22 * mm, title=title,
                            author=CLIENT_NAME, subject="Fictional training material")
    story = [Paragraph(title, s["title"]), Spacer(1, 2 * mm),
             Paragraph(f"Issued {d(issued)}. Closing date for quotations: <b>{d(closing)}</b>.", s["body"]),
             Spacer(1, 2 * mm)]
    for i, r in enumerate(rfqs):
        block = [Paragraph(f"{r['no']}: {r['title']}", s["h"])]
        if r.get("intro"):
            block += [Paragraph(r["intro"], s["body"]), Spacer(1, 2 * mm)]
        block.append(grid_table([["Requirement", "Detail"]] + [list(x) for x in r["requirements"]],
                                [36 * mm, 138 * mm], s))
        story += [KeepTogether(block), Spacer(1, 3 * mm)]
    story.append(Paragraph("What your quotation must include", s["h"]))
    for item in [
        "Your registered company name, SSM registration number and, if you charge SST, your SST registration number",
        "A quotation number, the date of issue and a validity period of at least 30 days",
        "Quantity, unit price and amount for each line, the subtotal, tax as a separate line, and the grand total",
        "Payment terms, delivery lead time and warranty (or, for services, the scope and term)",
        "The name and signature of an authorised person",
    ]:
        story.append(Paragraph(item, s["bullet"], bulletText="•"))
    story += [Spacer(1, 3 * mm),
              Paragraph("Quotations are evaluated under the Sinar Maju Procurement Policy. Please email your "
                        "quotation, quoting the RFQ number, to procurement@sinarmaju.example.", s["body"]),
              Spacer(1, 6 * mm),
              KeepTogether([Signature(CLIENT_NAME, "Daniel Wong Kah Leong", "Senior Procurement Executive",
                                      SM_ACCENT, opening="Yours sincerely,")])]
    frame = sm_frame("Procurement Department", ["Request for Quotation", f"Issued {d(issued)}"])
    doc.build(story, onFirstPage=frame, onLaterPages=frame)
    return path


POLICY_VERSIONS = {
    "3.0": dict(
        file="procurement-policy-v3.0.pdf", effective=date(2026, 7, 1), approved="Board of Directors, 18 June 2026",
        fd_limit=50000, validity_days=30, advance_pct=30, sst_clause=True, split_review=True,
        review="June 2027", superseded=False),
    "2.1": dict(
        file="procurement-policy-v2.1.pdf", effective=date(2024, 3, 1), approved="Board of Directors, 22 February 2024",
        fd_limit=100000, validity_days=14, advance_pct=50, sst_clause=False, split_review=False,
        review="February 2026", superseded=True),
}


def policy_clauses(p):
    fd = f"RM{p['fd_limit']:,}"
    sections = []
    sections.append(("1. Purpose and scope", [
        ("1.1", "This policy sets out how Sinar Maju Sdn Bhd (\"the Company\") buys goods and services: stock "
                "bought for resale to customers, and operating purchases for the Company's own use."),
        ("1.2", "It applies to every department and every purchase paid with Company funds, except petty cash "
                "claims below RM500, which are covered by the Petty Cash Guideline."),
    ]))
    sections.append(("2. Definitions", [
        ("2.1", "<b>Purchase value</b> means the total amount payable, including tax, for the whole requirement."),
        ("2.2", "<b>Requirement</b> means all goods or services of the same kind that a department needs within "
                "a 30-day period."),
        ("2.3", "<b>Evaluation date</b> means the date on which quotations are compared and a supplier is recommended."),
        ("2.4", "<b>Approved Vendor List (AVL)</b> means the list of suppliers registered under Section 5, "
                "kept by the Procurement Department."),
    ]))
    sections.append(("3. Approval limits", [
        ("3.1", "The number of quotations and the approval needed depend on the purchase value:"),
        ("TABLE", [
            ["Purchase value (including tax)", "Quotations required", "Approval"],
            ["Below RM5,000", "One written quotation", "Head of Department (HOD)"],
            [f"RM5,000 to {fd}", "Three written quotations and a comparison", "HOD and Head of Procurement"],
            [f"Above {fd} up to RM250,000", "Three written quotations, a comparison and a justification memo",
             "Finance Director"],
            ["Above RM250,000", "Open tender", "Board Tender Committee"],
        ]),
        ("3.2", "If fewer than the required number of quotations can be obtained, the comparison must explain "
                "why and list the suppliers approached."),
        ("3.3", "Monthly charges under a contract already approved under this policy (for example courier or "
                "cleaning services) do not need new quotations for each monthly purchase order. Renewing or "
                "extending the contract does."),
    ]))
    q = [
        ("4.1", "A quotation must be in writing, on the supplier's letterhead, and show the supplier's registered "
                "name and SSM registration number, a quotation number, the date of issue, and the name and "
                "signature of an authorised person."),
        ("4.2", f"A quotation must be valid for at least {p['validity_days']} days from its date of issue, and must "
                "still be valid on the evaluation date. An expired quotation must be revalidated by the supplier "
                "in writing before it can be used."),
        ("4.3", "Quotations must be compared like-for-like. A quotation that does not meet every requirement in "
                "the RFQ (specification, quantity, warranty, service scope or delivery) is non-compliant. Ask the "
                "supplier for a revised quotation or exclude it from the comparison."),
        ("4.4", "Check every line amount, discount, subtotal, tax amount and grand total. An arithmetic error must "
                "be corrected by the supplier in a revised quotation. Do not correct a supplier's figures yourself."),
    ]
    if p["sst_clause"]:
        q.append(("4.5", "If a supplier charges SST, its quotation must show its SST registration number. A "
                         "quotation that charges SST without it is non-compliant."))
        q.append(("4.6", "The lowest price is not automatically selected. Delivery, warranty, payment terms and "
                         "previous performance may justify a higher price, provided the comparison explains why."))
    else:
        q.append(("4.5", "The lowest price is not automatically selected. Delivery, warranty, payment terms and "
                         "previous performance may justify a higher price, provided the comparison explains why."))
    sections.append(("4. Quotations", q))
    sections.append(("5. Suppliers", [
        ("5.1", "Only suppliers on the AVL may be used. A quotation from a supplier that is not on the AVL cannot "
                "be accepted until the supplier is registered under Clause 5.2."),
        ("5.2", "To register, a supplier submits the Supplier Registration Form, its SSM company profile and bank "
                "details. Registration takes about ten working days."),
        ("5.3", "The Procurement Department reviews the AVL every year and removes suppliers with poor delivery "
                "or quality records."),
    ]))
    sections.append(("6. Payment terms", [
        ("6.1", "Standard payment terms are 30 days from the date of invoice, after the goods are received or the "
                "service is performed."),
        ("6.2", f"An advance payment or deposit must not be more than {p['advance_pct']}% of the purchase value. A "
                f"higher advance needs the Finance Director's written approval before the purchase order is issued."),
    ]))
    split = [("7.1", "Do not split a requirement into smaller purchase orders to stay under a limit in Clause 3.1.")]
    if p["split_review"]:
        split.append(("7.2", "The Procurement Department reviews purchase orders every month. Two or more purchase "
                             "orders to the same supplier from the same department within 30 days, whose combined "
                             "value crosses a limit in Clause 3.1, are treated as one requirement and reported to "
                             "the Finance Director."))
    sections.append(("7. Splitting purchases", split))
    sections.append(("8. Conflict of interest", [
        ("8.1", "Staff involved in a purchase must declare any personal or family link to a supplier before "
                "quotations are evaluated, and must not take part in that evaluation."),
        ("8.2", "Staff must not accept gifts or hospitality worth more than RM100 from a supplier."),
    ]))
    sections.append(("9. Records", [
        ("9.1", "Keep the RFQ, quotations, comparison, approval and purchase order together in the procurement "
                "system for seven years."),
    ]))
    return sections


def build_policy(version, out_dir):
    p = POLICY_VERSIONS[version]
    s = styles(SM_ACCENT)
    path = out_dir / p["file"]
    doc = SimpleDocTemplate(str(path), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm,
                            topMargin=36 * mm, bottomMargin=22 * mm, title=f"Procurement Policy, Version {version}",
                            author=CLIENT_NAME, subject="Fictional training material")
    story = [Paragraph("Procurement Policy", s["title"]), Spacer(1, 1 * mm),
             Paragraph(f"Version {version}, effective {d(p['effective'])}", s["bold"]), Spacer(1, 3 * mm)]
    if p["superseded"]:
        story += [Spacer(1, 6 * mm)]
    for heading, clauses in policy_clauses(p):
        block = [Paragraph(heading, s["h"])]
        for no, text in clauses:
            if no == "TABLE":
                block += [grid_table(text, [52 * mm, 72 * mm, 50 * mm], s), Spacer(1, 2.5 * mm)]
            else:
                block.append(Paragraph(f"{no}  {text}", s["clause"]))
        story.append(KeepTogether(block))
    if version == "3.0":
        story += [CondPageBreak(70 * mm), Paragraph("Appendix: what changed from Version 2.1", s["h"]),
                  grid_table([
                      ["Clause", "Version 2.1", "Version 3.0"],
                      ["3.1", "Finance Director approves purchases above RM100,000",
                       "Finance Director approves purchases above RM50,000"],
                      ["4.2", "Quotations valid for at least 14 days", "Quotations valid for at least 30 days"],
                      ["4.5", "Lowest price clause (now 4.6). No SST clause", "SST registration number required if SST is charged (new)"],
                      ["6.2", "Advance payment up to 50%", "Advance payment up to 30%"],
                      ["7.2", "No monthly review", "Monthly review of split purchases (new)"],
                  ], [18 * mm, 78 * mm, 78 * mm], s)]
    story += [Spacer(1, 6 * mm)]
    ctl = [["Document control", ""],
           ["Policy owner", f"Procurement Department ({HEAD_OF_PROCUREMENT}, Head of Procurement)"],
           ["Approved by", p["approved"]],
           ["Next review", p["review"]],
           ["Questions", "procurement@sinarmaju.example, ext. 118"]]
    ct = Table([[Paragraph(a, s["cellb"]), Paragraph(b, s["cell"])] for a, b in ctl], colWidths=[40 * mm, 134 * mm])
    ct.setStyle(TableStyle([("SPAN", (0, 0), (-1, 0)), ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#fde7c7")),
                            ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#999999"))]))
    story.append(KeepTogether([ct]))
    frame = sm_frame("Procurement Policy", [f"Document SM-PRO-001, Version {version}", f"Effective {d(p['effective'])}"],
                     superseded=p["superseded"])
    doc.build(story, onFirstPage=frame, onLaterPages=frame)
    return path


# Approved Vendor List. Dakwat Seroja Enterprise (case 04) is deliberately absent.
VENDORS = {
    "V001": ("Kertas Lestari Sdn Bhd", "Stock: Paper", date(2027, 3, 31)),
    "V002": ("Pualam Paper Merchants Sdn Bhd", "Stock: Paper", date(2027, 6, 30)),
    "V003": ("Tintaria Imaging Supplies Sdn Bhd", "Stock: Toner and Ink", date(2027, 1, 31)),
    "V004": ("Alat Tulis Cendana Sdn Bhd", "Stock: Stationery", date(2027, 4, 30)),
    "V005": ("Duduk Selesa Furnishings Sdn Bhd", "Stock: Furniture", date(2027, 2, 28)),
    "V006": ("Kerusi Nadira Trading", "Stock: Furniture", date(2027, 5, 31)),
    "V007": ("Ergoluma Seating Sdn Bhd", "Stock: Furniture", date(2027, 3, 31)),
    "V008": ("Imbas Teraju Systems Sdn Bhd", "IT Equipment", date(2027, 6, 30)),
    "V009": ("Kodbar Nusa Technology Sdn Bhd", "IT Equipment", date(2027, 8, 31)),
    "V010": ("Kilau Embun Facility Services Sdn Bhd", "Facilities and Cleaning", date(2027, 1, 31)),
    "V011": ("Bersih Kemboja Services Sdn Bhd", "Facilities and Cleaning", date(2027, 4, 30)),
    "V012": ("Rakmas Storage Solutions Sdn Bhd", "Warehouse Equipment", date(2027, 7, 31)),
    "V013": ("Rangka Waja Ironworks Sdn Bhd", "Warehouse Equipment", date(2027, 2, 28)),
    "V014": ("Kilat Merbok Express Sdn Bhd", "Logistics and Courier", date(2027, 6, 30)),
    "V015": ("Cetak Pelangi Kenanga Sdn Bhd", "Marketing and Printing", date(2027, 5, 31)),
}


def build_avl(out_dir):
    s = styles(SM_ACCENT)
    path = out_dir / "approved-vendor-list.pdf"
    doc = SimpleDocTemplate(str(path), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm,
                            topMargin=36 * mm, bottomMargin=22 * mm, title="Approved Vendor List",
                            author=CLIENT_NAME, subject="Fictional training material")
    rows = [["Vendor ID", "Supplier", "Category", "Approved until"]]
    rows += [[vid, n, c, d(u)] for vid, (n, c, u) in VENDORS.items()]
    story = [Paragraph("Approved Vendor List (AVL)", s["title"]), Spacer(1, 2 * mm),
             Paragraph("Only the suppliers below may be used (Procurement Policy, Clause 5.1). To add a supplier, "
                       "follow the registration steps in Clause 5.2.", s["body"]), Spacer(1, 3 * mm),
             grid_table(rows, [20 * mm, 72 * mm, 50 * mm, 32 * mm], s)]
    frame = sm_frame("Procurement Department", ["Approved Vendor List", "Updated 1 October 2026"])
    doc.build(story, onFirstPage=frame, onLaterPages=frame)
    return path


# ---------------------------------------------------------------------------
# Module 05: purchase history, 1 January 2025 to 30 September 2026

HODS = {
    "Procurement": HEAD_OF_PROCUREMENT, "Warehouse": "Ganesh a/l Muniandy", "Sales": "Joanne Lee Pei Shan",
    "Finance": FINANCE_DIRECTOR, "IT": "Tan Boon Hock", "Admin": "Salmah binti Idris", "Marketing": "Farah Nadiah binti Zulkifli",
}
REQUESTERS = {
    "Procurement": ["Daniel Wong Kah Leong", "Aina Sofea binti Rashid"], "Warehouse": ["Muthu a/l Krishnan", "Zulhilmi bin Hashim"],
    "Sales": ["Kenneth Ho", "Nur Syafiqah binti Azmi"], "Finance": ["Lee Hui Min"], "IT": ["Arif bin Mansor"],
    "Admin": ["Norhayati binti Salleh"], "Marketing": ["Chloe Tan Xin Yi"],
}
HISTORY_START, HISTORY_END = date(2025, 1, 1), date(2026, 9, 30)
COLUMNS = ["PO No.", "PO Date", "Department", "Requested By", "Vendor ID", "Vendor Name", "Category",
           "Description", "Qty", "Unit Price (RM)", "Amount (RM)", "Tax (RM)", "Total (RM)",
           "Quotations", "Contract Ref", "Approved By", "Status"]

# Recurring stock purchases by the Procurement Department (always RM5,000 or more, three quotations)
STOCK_STREAMS = [
    ("V001", "A4 copier paper, 80 gsm (ream)", (700, 1500), (10.80, 11.90), 21, True),
    ("V002", "A4 copier paper, 80 gsm (ream)", (600, 1300), (11.00, 12.20), 28, True),
    ("V002", "A3 copier paper, 80 gsm (ream)", (250, 500), (22.50, 24.80), 60, True),
    ("V003", "LaserPro 26X black toner cartridge", (40, 120), (226.00, 245.00), 24, False),
    ("V003", "LaserPro 85A black toner cartridge", (50, 140), (168.00, 182.00), 33, False),
    ("V004", "Ballpoint pens, box of 50", (180, 380), (27.50, 31.00), 30, True),
    ("V004", "Lever arch files, carton of 50", (40, 90), (118.00, 132.00), 45, True),
    ("V005", "Ergonomic mesh chair", (40, 90), (352.00, 371.00), 55, False),
    ("V006", "Ergonomic mesh chair", (40, 80), (328.00, 345.00), 70, False),
    ("V007", "Executive office desk 1.6 m", (20, 40), (540.00, 610.00), 75, False),
]
# Operating purchases (below RM5,000, one quotation, HOD approval)
OPERATING_STREAMS = [
    ("Admin", "V004", "Office stationery for head office", (1, 1), (320.00, 880.00)),
    ("Sales", "V004", "Sales team stationery", (1, 1), (180.00, 460.00)),
    ("Finance", "V002", "Continuous computer forms, box", (4, 12), (78.00, 86.00)),
    ("Warehouse", "V012", "Pallet trolley", (2, 6), (455.00, 610.00)),
    ("Warehouse", "V013", "Shelving spare parts and beams", (1, 1), (650.00, 2400.00)),
    ("IT", "V008", "Handheld barcode scanner", (1, 2), (1420.00, 1560.00)),
    ("IT", "V009", "Thermal label printer", (1, 2), (1780.00, 2100.00)),
    ("Marketing", "V015", "Brochures and banners", (1, 1), (850.00, 3900.00)),
    ("Sales", "V015", "Name cards, box of 200", (4, 15), (38.00, 45.00)),
    ("Admin", "V011", "Cleaning supplies", (1, 1), (380.00, 1150.00)),
    ("Admin", "V005", "Replacement office chair", (2, 5), (360.00, 375.00)),
]
# Occasional larger operating purchases (three quotations, Head of Procurement)
LARGE_OPERATING = [
    (date(2025, 2, 17), "IT", "V009", "Business laptop", 8, 3350.00),
    (date(2025, 6, 9), "Warehouse", "V013", "Selective pallet racking, 12 bays", 12, 1480.00),
    (date(2025, 9, 22), "Marketing", "V015", "Product catalogue 2025/26, 2,500 copies", 2500, 3.95),
    (date(2026, 1, 12), "IT", "V008", "Mobile computer with scanner", 6, 2890.00),
    (date(2026, 4, 6), "Admin", "V010", "Deep cleaning and carpet shampoo, head office", 1, 6200.00),
    (date(2026, 7, 20), "Warehouse", "V012", "Steel mezzanine platform, phase 1", 1, 38500.00),
]
CONTRACTS = [
    ("Warehouse", "V014", "Courier charges, monthly statement", "CT-2025-004"),
    ("Admin", "V010", "Office cleaning services, monthly fee", "CT-2025-002"),
]
# Seeded findings
SPLITS = [
    ("Admin", "V005", [(date(2026, 3, 3), "Ergonomic chairs for meeting room", 12, 375.00),
                       (date(2026, 3, 5), "Meeting table 2.4 m", 1, 4550.00),
                       (date(2026, 3, 9), "Visitor chairs and side tables", 1, 4420.00)]),
    ("IT", "V009", [(date(2026, 8, 18), "Wireless barcode scanner", 4, 1150.00),
                    (date(2026, 8, 19), "Thermal label printer", 2, 2275.00)]),
]
BREACHES = [
    dict(date=date(2025, 11, 3), dept="Warehouse", vid="V012", desc="Heavy-duty pallet racking, 8 bays", qty=8,
         price=1000.00, quotes=2, approver=HEAD_OF_PROCUREMENT),
    dict(date=date(2026, 5, 12), dept="Marketing", vid="V015", desc="Product catalogue 2026/27, 3,000 copies",
         qty=3000, price=3.83, quotes=1, approver=HODS["Marketing"]),
]
NAME_VARIANTS = {"V001": ["KERTAS LESTARI SDN BHD", "Kertas Lestari Sdn. Bhd."]}


def months(start, end):
    y, m = start.year, start.month
    while date(y, m, 1) <= end:
        yield y, m
        y, m = (y + 1, 1) if m == 12 else (y, m + 1)


def approver_for(dept, total):
    return HODS[dept] if total < 5000 else HEAD_OF_PROCUREMENT if total <= POLICY_VERSIONS["3.0"]["fd_limit"] else FINANCE_DIRECTOR


def make_row(dt, dept, vid, desc, qty, price, quotes, contract="", approver=None, seed=None, rng=None):
    amount = r2(qty * price)
    tax = r2(amount * TAX_RATE)
    total = r2(amount + tax)
    category = VENDORS[vid][1]
    if dept != "Procurement" and category.startswith("Stock:"):  # bought for own use, not for resale
        category = "Office Furniture" if category.endswith("Furniture") else "Office Supplies"
    return dict(date=dt, dept=dept, requester=rng.choice(REQUESTERS[dept]), vid=vid, vendor=VENDORS[vid][0],
                category=category, desc=desc, qty=qty, price=price, amount=amount, tax=tax, total=total,
                quotes=quotes, contract=contract, approver=approver or approver_for(dept, total),
                status="Received", seed=seed)


def build_history():
    rng = random.Random(20261009)
    rows = []

    for vid, desc, (qlo, qhi), (plo, phi), gap, seasonal in STOCK_STREAMS:
        dt = HISTORY_START + timedelta(days=rng.randint(0, gap))
        while dt <= HISTORY_END:
            qty = rng.randint(qlo, qhi)
            if seasonal and dt.month in (11, 12, 1):
                qty = int(qty * 1.6)
            qty = int(round(qty, -1)) if qty >= 100 else qty
            price = r2(rng.uniform(plo, phi))
            rows.append(make_row(dt, "Procurement", vid, desc, qty, price, rng.choice([3, 3, 3, 4]), rng=rng))
            dt += timedelta(days=gap + rng.randint(-5, 6))

    seeded_pairs = {(dept, vid) for dept, vid, _ in SPLITS}
    split_dates = {(dept, vid): [x[0] for x in items] for dept, vid, items in SPLITS}
    for dept, vid, desc, (qlo, qhi), (plo, phi) in OPERATING_STREAMS:
        dt = HISTORY_START + timedelta(days=rng.randint(5, 40))
        while dt <= HISTORY_END:
            near_seed = (dept, vid) in seeded_pairs and any(abs((dt - s).days) <= 31 for s in split_dates[(dept, vid)])
            if not near_seed:
                qty = rng.randint(qlo, qhi)
                price = r2(rng.uniform(plo, phi))
                if qty * price * (1 + TAX_RATE) >= 4999:
                    qty = max(1, int(4600 / (price * (1 + TAX_RATE))))
                rows.append(make_row(dt, dept, vid, desc, qty, price, 1, rng=rng))
            dt += timedelta(days=rng.randint(35, 80))

    for dt, dept, vid, desc, qty, price in LARGE_OPERATING:
        rows.append(make_row(dt, dept, vid, desc, qty, price, 3, rng=rng))

    for y, m in months(HISTORY_START, HISTORY_END):
        dt = date(y, m, 28 if m != 2 else 27)
        for dept, vid, desc, ref in CONTRACTS:
            if vid == "V014":
                fee = rng.uniform(6400, 7600) if (y, m) >= (2026, 5) else rng.uniform(1900, 2500)
            else:
                fee = 3650.00 if y == 2025 else 3720.00
            rows.append(make_row(dt, dept, vid, f"{desc}, {date(y, m, 1):%B %Y}", 1, r2(fee), 0, contract=ref, rng=rng))

    for dept, vid, items in SPLITS:
        for dt, desc, qty, price in items:
            rows.append(make_row(dt, dept, vid, desc, qty, price, 1, approver=HODS[dept], seed="split", rng=rng))
    for b in BREACHES:
        rows.append(make_row(b["date"], b["dept"], b["vid"], b["desc"], b["qty"], b["price"], b["quotes"],
                             approver=b["approver"], seed="breach", rng=rng))

    rows.sort(key=lambda r: (r["date"], r["vid"], r["desc"]))
    per_year = defaultdict(int)
    for r in rows:
        per_year[r["date"].year] += 1
        r["po"] = f"PO-{r['date'].year}-{per_year[r['date'].year]:04d}"

    # Data problems, chosen from ordinary rows so they never hide a seeded finding
    plain = [r for r in rows if not r["seed"] and not r["contract"]]
    for r in rng.sample([r for r in plain if r["date"] < date(2026, 9, 1)], 8):
        r["status"] = "Cancelled"
        r["seed"] = "cancelled"
    for r in rows:
        if r["date"] >= date(2026, 9, 15) and not r["seed"]:
            r["status"] = "Open"
    for r in rng.sample([r for r in plain if r["dept"] != "Procurement" and not r["seed"]], 6):
        r["dept_blank"] = True
        r["seed"] = "blank-dept"
    v001 = [r for r in rows if r["vid"] == "V001"]
    for i, r in enumerate(v001):
        if i % 4 == 2:
            r["vendor"] = NAME_VARIANTS["V001"][(i // 4) % 2]
            r["variant"] = True
    dup_src = rng.sample([r for r in plain if r["status"] == "Received" and not r["seed"]], 4)
    out = []
    for r in rows:
        out.append(r)
        if r in dup_src:
            out.append(dict(r, duplicate=True))
    return out


def history_cells(r):
    return [r["po"], r["date"], "" if r.get("dept_blank") else r["dept"], r["requester"], r["vid"], r["vendor"],
            r["category"], r["desc"], r["qty"], r["price"], r["amount"], r["tax"], r["total"], r["quotes"],
            r["contract"], r["approver"], r["status"]]


def fixed_zip_copy(path):
    """Rewrite a zip-based file (xlsx) with fixed timestamps so rebuilds are byte-identical."""
    src = zipfile.ZipFile(path)
    items = [(i.filename, src.read(i.filename)) for i in src.infolist()]
    src.close()
    stamp = datetime(*FIXED_TIME).strftime("%Y-%m-%dT%H:%M:%SZ").encode()
    items = [(n, re.sub(rb"(<dcterms:modified[^>]*>)[^<]*", rb"\g<1>" + stamp, b) if n == "docProps/core.xml" else b)
             for n, b in items]
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        for name, data in items:
            info = zipfile.ZipInfo(name, date_time=FIXED_TIME)
            info.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(info, data)


def write_history(rows, out_dir):
    xlsx = out_dir / "purchase-history.xlsx"
    wb = Workbook()
    ws = wb.active
    ws.title = "Purchase Orders"
    ws.append(COLUMNS)
    for r in rows:
        ws.append(history_cells(r))
    head_fill = PatternFill("solid", fgColor="B45309")
    for c in ws[1]:
        c.font = Font(bold=True, color="FFFFFF")
        c.fill = head_fill
        c.alignment = Alignment(vertical="center", wrap_text=True)
    widths = [14, 12, 13, 24, 10, 36, 24, 44, 8, 14, 14, 11, 14, 11, 13, 26, 11]
    for i, w in enumerate(widths):
        ws.column_dimensions[chr(65 + i)].width = w
    for row in ws.iter_rows(min_row=2):
        row[1].number_format = "d mmm yyyy"
        for c in row[9:13]:
            c.number_format = "#,##0.00"
    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:Q{len(rows) + 1}"

    info = wb.create_sheet("About this file")
    for line in [
        ["Sinar Maju Sdn Bhd: purchase orders, 1 January 2025 to 30 September 2026"],
        ["Exported from the procurement system for the AI for Workplace (Advanced) course, Module 05."],
        [],
        ["FICTIONAL TRAINING DATA. All companies, people and figures are made up."],
        ["The tax rate is for training only."],
        [],
        ["Column", "Meaning"],
        ["Amount (RM)", "Qty x Unit Price, before tax"],
        ["Total (RM)", "Amount plus tax. Policy limits use this figure."],
        ["Quotations", "Number of written quotations received before the PO was issued"],
        ["Contract Ref", "Filled in for monthly charges under an approved contract (Policy Clause 3.3)"],
        ["Status", "Received, Open or Cancelled"],
    ]:
        info.append(line)
    info["A1"].font = Font(bold=True, size=13)
    info["A4"].font = Font(bold=True)
    info["A7"].font = info["B7"].font = Font(bold=True)
    info.column_dimensions["A"].width = 16
    info.column_dimensions["B"].width = 80
    wb.properties.creator = CLIENT_NAME
    wb.properties.created = wb.properties.modified = datetime(*FIXED_TIME)
    wb.save(xlsx)
    fixed_zip_copy(xlsx)

    csv_path = out_dir / "purchase-history.csv"
    buf = io.StringIO()
    w = csv.writer(buf, lineterminator="\n")
    w.writerow(COLUMNS)
    for r in rows:
        cells = history_cells(r)
        cells[1] = cells[1].isoformat()
        for i in (9, 10, 11, 12):
            cells[i] = f"{cells[i]:.2f}"
        w.writerow(cells)
    csv_path.write_text(buf.getvalue(), encoding="utf-8-sig")
    return xlsx, csv_path


def find_splits(clean):
    """Clause 7.2: same department and vendor within 30 days, each below RM5,000, combined RM5,000 or more."""
    small = [r for r in clean if r["total"] < 5000 and not r["contract"]]
    groups = defaultdict(list)
    for r in small:
        groups[(r["dept"], r["vid"])].append(r)
    found = []
    for key, rs in groups.items():
        rs.sort(key=lambda r: r["date"])
        i = 0
        while i < len(rs):
            j = i
            while j + 1 < len(rs) and (rs[j + 1]["date"] - rs[i]["date"]).days <= 30:
                j += 1
            cluster = rs[i:j + 1]
            if len(cluster) > 1 and sum(r["total"] for r in cluster) >= 5000:
                found.append(cluster)
                i = j + 1
            else:
                i += 1
    return found


# ---------------------------------------------------------------------------
# Answer keys

def md_table(rows):
    out = ["| " + " | ".join(rows[0]) + " |", "|" + "---|" * len(rows[0])]
    out += ["| " + " | ".join(str(c) for c in r) + " |" for r in rows[1:]]
    return "\n".join(out)


def chair_key(results):
    lines = ["# Answer key: chair quotations (RFQ-2026-118)", "",
             "Trainer only. Never commit this file. Used in Modules 01, 03 and 10.", "",
             f"Evaluation date: {d(CLASS_DATE)}. Policy: Version 3.0.", "",
             md_table([["Vendor", "Printed total (RM)", "Correct total (RM)", "Valid until", "Problem", "Clause"]] + [
                 [v["name"], rm(f["p_grand"]), rm(f["grand"]), d(v["valid_until"]), v["problem"], v["clause"]]
                 for v, f in results]),
             "", "## The seeded problems", ""]
    a, fa = results[0]
    lines += [
        f"- **Duduk Selesa (A):** line 1 is printed as RM{rm(fa['p_lines'][0])} but 120 x RM365.00 is "
        f"RM{rm(fa['lines'][0])}. Subtotal, tax and grand total all carry the error, so the printed total "
        f"(RM{rm(fa['p_grand'])}) is RM{rm(fa['grand'] - fa['p_grand'])} lower than the correct total "
        f"(RM{rm(fa['grand'])}). The words line matches the wrong figure, so it looks consistent.",
        "- **Kerusi Nadira (B):** cheapest, but the warranty is 3 years on the frame and 1 year on the mechanism and "
        "gas lift. The RFQ asks for 5 years on all three, so it's not like-for-like (4.3).",
        "- **Ergoluma (C):** asks for a 50% deposit. Clause 6.2 allows up to 30% without the Finance Director's "
        "written approval. Everything else complies.",
        "", "## Expected recommendation", "",
        f"Recommend Duduk Selesa, subject to a revised quotation that corrects the arithmetic (4.4): correct total "
        f"RM{rm(fa['grand'])}. It meets every requirement, has the best warranty terms with standard payment, and "
        f"is valid until {d(a['valid_until'])}. At RM{rm(fa['grand'])} the purchase falls in the RM5,000 to "
        f"RM50,000 band (3.1): three quotations and a comparison, approved by the HOD and the Head of Procurement.",
        "", "Watch for: a model that picks Kerusi Nadira on price, a model that accepts the printed total for "
        "Duduk Selesa, and a model that corrects the figure itself without saying a revised quotation is needed.",
        "", "## Module 01 (one quotation, two model types)", "",
        "Participants get only the Duduk Selesa quotation and the RFQ. A fast model usually reports the printed "
        f"total of RM{rm(fa['p_grand'])} without checking it. A reasoning model is more likely to recompute "
        "120 x 365.00 and find the RM1,000 gap. Either may miss it, which is the point of the discussion.",
    ]
    return "\n".join(lines) + "\n"


def cases_key(results):
    rows = [["Case", "File", "RFQ", "Expected", "Clause", "Printed total (RM)", "Correct total (RM)", "Why"]]
    for c, f in results:
        rows.append([f"{c['case']:02d}", c["v"]["file"], c["rfq"], c["expect"], c["clause"] or "",
                     rm(f["p_grand"]), rm(f["grand"]), c["why"]])
    passes = [f"{c['case']:02d}" for c, _ in results if c["expect"] == "Pass"]
    return "\n".join([
        "# Answer key: Quotation Checker test cases (Module 07)", "",
        "Trainer only. Never commit this file.", "",
        f"Evaluation date: {d(CLASS_DATE)}. Policy: Version 3.0. Each quotation answers one RFQ in `open-rfqs.pdf`.", "",
        md_table(rows), "",
        f"**{len(passes)} pass ({', '.join(passes)}), {len(results) - len(passes)} fail.** Cases 03 and 08 are "
        "false-positive traps (a correct discount, and an advance exactly at the 30% limit). Case 10 has two "
        "problems: full marks only if the Checker finds both.", "",
        "Suggested scoring: 1 point for the right verdict, 1 point for citing the right clause. Maximum 20.",
    ]) + "\n"


def history_key(rows):
    clean = [r for r in rows if not r.get("duplicate")]
    spend_rows = [r for r in clean if r["status"] != "Cancelled"]
    total = r2(sum(r["total"] for r in spend_rows))
    by_cat = defaultdict(float)
    by_vendor = defaultdict(float)
    by_year = defaultdict(float)
    for r in spend_rows:
        by_cat[r["category"]] += r["total"]
        by_vendor[r["vid"]] += r["total"]
        by_year[r["date"].year] += r["total"]
    courier = [r for r in spend_rows if r["vid"] == "V014"]
    before = [r["total"] for r in courier if r["date"] < date(2026, 5, 1)]
    after = [r["total"] for r in courier if r["date"] >= date(2026, 5, 1)]
    paper = [r for r in spend_rows if r["category"] == "Stock: Paper" and "A4" in r["desc"]]
    peak = defaultdict(int)
    for r in paper:
        peak["peak" if r["date"].month in (11, 12, 1) else "other"] += r["qty"]
    peak_months = sum(1 for y, m in months(HISTORY_START, HISTORY_END) if m in (11, 12, 1))
    other_months = sum(1 for _ in months(HISTORY_START, HISTORY_END)) - peak_months

    splits = find_splits([r for r in clean if r["status"] != "Cancelled" and r["dept"]])
    seeded = sorted(r["po"] for r in clean if r["seed"] == "split")
    found = sorted(r["po"] for c in splits for r in c)
    assert found == seeded, f"split detector found {found}, expected {seeded}"
    breaches = [r for r in clean if r["status"] != "Cancelled" and r["total"] >= 5000 and r["quotes"] < 3
                and not r["contract"]]
    assert sorted(r["po"] for r in breaches) == sorted(r["po"] for r in clean if r["seed"] == "breach")
    wrong_approver = [r for r in clean if r["total"] >= 5000 and r["approver"] not in (HEAD_OF_PROCUREMENT, FINANCE_DIRECTOR)]
    dups = [r for r in rows if r.get("duplicate")]
    blanks = [r for r in clean if r.get("dept_blank")]
    variants = [r for r in clean if r.get("variant")]
    cancelled = [r for r in clean if r["status"] == "Cancelled"]

    L = ["# Answer key: purchase history (Module 05)", "", "Trainer only. Never commit this file.", "",
         f"File: `purchase-history.xlsx` (and `.csv`), {len(rows)} rows including {len(dups)} duplicates. "
         f"Period {d(HISTORY_START)} to {d(HISTORY_END)}.", "",
         "All spend figures below use **Total (RM)**, exclude cancelled POs and count each duplicated PO once.", "",
         "## Headline figures", "",
         md_table([["Measure", "Value"],
                   ["Purchase orders (unique)", len(clean)],
                   ["Cancelled", len(cancelled)],
                   ["Total spend", f"RM{rm(total)}"],
                   ["Spend in 2025", f"RM{rm(by_year[2025])}"],
                   ["Spend Jan to Sep 2026", f"RM{rm(by_year[2026])}"]]),
         "", "## Spend by category", "",
         md_table([["Category", "Spend (RM)", "Share"]] + [
             [c, rm(v), f"{v / total:.1%}"] for c, v in sorted(by_cat.items(), key=lambda x: -x[1])]),
         "", "## Top five suppliers", "",
         md_table([["Vendor ID", "Supplier", "Spend (RM)"]] + [
             [vid, VENDORS[vid][0], rm(v)] for vid, v in sorted(by_vendor.items(), key=lambda x: -x[1])[:5]]),
         "", "Grouping by Vendor Name instead of Vendor ID splits Kertas Lestari three ways (see data problems).",
         "", "## Seeded findings", "",
         "### 1. Courier spend jumped in May 2026", "",
         f"Kilat Merbok Express (V014), contract CT-2025-004: average RM{rm(sum(before) / len(before))} a month "
         f"from January 2025 to April 2026, then RM{rm(sum(after) / len(after))} a month from May to September 2026 "
         f"(about {sum(after) / len(after) / (sum(before) / len(before)):.1f} times). These are contract charges, "
         "so no quotations are needed (3.3), but the jump is worth asking about.",
         "", "### 2. Split purchases (Clause 7.1 and 7.2)", ""]
    for c in splits:
        L.append(f"- {c[0]['dept']}, {c[0]['vendor']}: " + ", ".join(
            f"{r['po']} ({d(r['date'])}, RM{rm(r['total'])})" for r in c) +
                 f". Combined RM{rm(sum(r['total'] for r in c))}, one quotation each, approved by the HOD.")
    L += ["", "### 3. Purchases without enough quotations (Clause 3.1)", ""]
    for r in breaches:
        L.append(f"- {r['po']}, {d(r['date'])}, {r['dept']}, {r['vendor']}: RM{rm(r['total'])} with "
                 f"{r['quotes']} quotation{'s' if r['quotes'] != 1 else ''}. Three were required.")
    L += ["", "### 4. Approved at the wrong level", ""]
    for r in wrong_approver:
        L.append(f"- {r['po']}: RM{rm(r['total'])} approved by {r['approver']} alone. Needed the HOD and the Head of Procurement.")
    L += ["", "### 5. Seasonal paper demand", "",
          f"A4 paper bought in November, December and January averages {peak['peak'] / peak_months:,.0f} reams a "
          f"month, against {peak['other'] / other_months:,.0f} in other months (back-to-school stock).",
          "", "## Data problems to clean first", "",
          f"- **Duplicates:** {len(dups)} rows repeat the row above exactly: " + ", ".join(r["po"] for r in dups) + ".",
          f"- **Blank department:** {len(blanks)} rows: " + ", ".join(r["po"] for r in blanks) + ".",
          f"- **Supplier name variants:** {len(variants)} Kertas Lestari rows are spelled "
          f"\"{NAME_VARIANTS['V001'][0]}\" or \"{NAME_VARIANTS['V001'][1]}\". Vendor ID V001 is consistent.",
          f"- **Cancelled POs:** {len(cancelled)} rows with Status Cancelled should be left out of spend.",
          "- **Open POs:** September 2026 orders after the 14th are still Open. They count as committed spend.",
          ]
    return "\n".join(L) + "\n", total


def policy_key():
    return "\n".join([
        "# Answer key: policy questions and the superseded version (Modules 04 and 09)", "",
        "Trainer only. Never commit this file.", "",
        "Module 04 uses only Version 3.0. Module 09 adds Version 2.1 to the same source set, so a retrieval "
        "system can pull an out-of-date clause. Version 2.1 says SUPERSEDED only on its first page; every "
        "later page looks current.", "",
        md_table([
            ["Question", "Correct answer (v3.0)", "Wrong answer if v2.1 is cited", "Clause"],
            ["Maximum advance payment without Finance Director approval?", "30% of the purchase value", "50%", "6.2"],
            ["Minimum quotation validity?", "30 days from issue, and still valid on the evaluation date", "14 days", "4.2"],
            ["Who approves a RM80,000 purchase?", "Finance Director (above RM50,000)",
             "HOD and Head of Procurement (v2.1 limit was RM100,000)", "3.1"],
            ["Must a quotation show an SST number?", "Yes, if SST is charged", "Not mentioned (clause 4.5 in "
             "v2.1 is about lowest price)", "4.5"],
            ["Is there a monthly split-purchase review?", "Yes, 30-day rule reported to the Finance Director",
             "No clause 7.2", "7.2"],
        ]), "",
        "Clause numbers match between versions for 3.1, 4.2 and 6.2, which is what makes a wrong citation look "
        "right. Clause 4.5 changes meaning between versions. The v3.0 appendix lists every change.",
    ]) + "\n"


# ---------------------------------------------------------------------------

def zip_folder(folder, zip_path):
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(p for p in folder.iterdir() if p.suffix in (".pdf", ".xlsx", ".csv")):
            info = zipfile.ZipInfo(f.name, date_time=FIXED_TIME)
            info.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(info, f.read_bytes())


def main():
    folders = {k: ROOT / k / "sample-files" for k in
               ("01-how-llms-behave", "03-custom-assistants", "04-grounded-research",
                "05-data-analysis", "07-evaluating-output", "09-rag-fundamentals")}
    trainer = ROOT / "_trainer"
    for p in list(folders.values()) + [trainer]:
        p.mkdir(parents=True, exist_ok=True)
    m01, m03, m04, m05, m07, m09 = folders.values()

    # Chair purchase
    problems = {"A": ("Line 1 amount wrong, total understated", "4.4"),
                "B": ("Warranty shorter than the RFQ asks", "4.3"),
                "C": ("50% deposit", "6.2")}
    chair_rfq = dict(CHAIR_RFQ, requirements=CHAIR_RFQ["requirements"])
    for folder in (m01, m03):
        build_rfq_doc(folder / "rfq-2026-118.pdf", [chair_rfq], CHAIR_RFQ["issued"], CHAIR_RFQ["closing"],
                      "Request for Quotation RFQ-2026-118")
    chairs = []
    for v in CHAIR_VENDORS:
        v["problem"], v["clause"] = problems[v["key"]]
        _, f = build_quotation(v, m03)
        chairs.append((v, f))
    build_quotation(CHAIR_VENDORS[0], m01)
    for folder in (m03, m04, m07, m09):
        build_policy("3.0", folder)
    build_policy("2.1", m09)
    for folder in (m03, m04, m07):
        build_avl(folder)

    # Module 07 test cases
    build_rfq_doc(m07 / "open-rfqs.pdf", OPEN_RFQS, OPEN_RFQ_ISSUED, OPEN_RFQ_CLOSING, "Open Requests for Quotation")
    cases = [(c, build_quotation(c["v"], m07)[1]) for c in TEST_CASES]

    # Module 05 purchase history
    history = build_history()
    write_history(history, m05)

    for folder in folders.values():
        zip_folder(folder, folder.parent / "sample-files.zip")

    (trainer / "answer-key-chair-quotations.md").write_text(chair_key(chairs))
    (trainer / "answer-key-checker-test-cases.md").write_text(cases_key(cases))
    hist_md, total = history_key(history)
    (trainer / "answer-key-purchase-history.md").write_text(hist_md)
    (trainer / "answer-key-policy-versions.md").write_text(policy_key())

    for v, f in chairs:
        flag = "" if f["p_grand"] == f["grand"] else f"  (printed {rm(f['p_grand'])})"
        print(f"chair {v['key']} {v['name']}: total {rm(f['grand'])}{flag}")
    for c, f in cases:
        flag = "" if f["p_grand"] == f["grand"] else f"  (printed {rm(f['p_grand'])})"
        print(f"case {c['case']:02d} {c['expect']}: total {rm(f['grand'])}{flag}")
    print(f"purchase history: {len(history)} rows, spend RM{rm(total)}")


if __name__ == "__main__":
    main()
