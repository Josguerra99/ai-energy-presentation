"""Extract Figure 5.9 historical totals from LBNL-2001637 PDF."""
from __future__ import annotations

import json
from pathlib import Path

import pymupdf

PDF = Path(__file__).resolve().parents[1] / "tmp-lbnl-2001637.pdf"
OUT = Path(__file__).resolve().parents[1] / "scripts" / "fig59-extract.json"
CROP_PNG = Path(__file__).resolve().parents[1] / "scripts" / "fig59-crop.png"

FIG_PAGE = 55
Y_MAX_BIL_L = 250.0
ANCHOR = {2014: 21.2, 2023: 66.0}
# x-position of labeled ticks on Fig. 5.9 (historical area only)
YEAR_T: dict[int, float] = {
    2014: 0.20,
    2016: 0.30,
    2018: 0.40,
    2020: 0.55,
    2022: 0.90,
    2023: 1.00,
}


def is_segment(r: int, g: int, b: int) -> bool:
    if r > 245 and g > 245 and b > 245:
        return False
    if r < 40 and g < 40 and b < 40:
        return False
    if abs(r - g) < 15 and abs(g - b) < 15 and r > 170:
        return False
    return True


def extract_historical(page: pymupdf.Page) -> list[dict]:
    zoom = 6
    mat = pymupdf.Matrix(zoom, zoom)
    pr = page.rect
    clip = pymupdf.Rect(
        pr.x0 + pr.width * 0.08,
        pr.y0 + pr.height * 0.54,
        pr.x0 + pr.width * 0.58,
        pr.y0 + pr.height * 0.87,
    )
    pix = page.get_pixmap(matrix=mat, clip=clip, alpha=False)
    pix.save(CROP_PNG)
    w, h = pix.width, pix.height
    samples = pix.samples

    def pixel(x: int, y: int) -> tuple[int, int, int]:
        i = (y * w + x) * 3
        return samples[i], samples[i + 1], samples[i + 2]

    x_lo = int(w * 0.06)
    x_hi = int(w * 0.96)
    y_top = int(h * 0.36)
    y_bot = int(h * 0.90)
    plot_h = y_bot - y_top

    def stack_top(cx: int) -> int:
        for y in range(y_top, y_bot):
            hits = sum(
                1
                for x in range(cx - 2, cx + 3)
                if is_segment(*pixel(x, y))
            )
            if hits >= 4:
                return y
        return y_bot

    def raw_at_t(t: float) -> float:
        cx = int(x_lo + t * (x_hi - x_lo))
        top_y = stack_top(cx)
        return (y_bot - top_y) / plot_h * Y_MAX_BIL_L

    knot_years = sorted(YEAR_T)
    raw_knots = {y: raw_at_t(YEAR_T[y]) for y in knot_years}
    r0, r9 = raw_knots[2014], raw_knots[2023]
    scale = (ANCHOR[2023] - ANCHOR[2014]) / (r9 - r0)

    def bil_from_raw(raw: float) -> float:
        return round(ANCHOR[2014] + (raw - r0) * scale, 1)

    knot_bil = {y: bil_from_raw(raw_knots[y]) for y in knot_years}
    knot_bil[2014] = ANCHOR[2014]
    knot_bil[2023] = ANCHOR[2023]

    def interpolate_year(year: int) -> float:
        if year in knot_bil:
            return knot_bil[year]
        for y0, y1 in zip(knot_years, knot_years[1:]):
            if y0 <= year <= y1:
                f = (year - y0) / (y1 - y0)
                return round(knot_bil[y0] + f * (knot_bil[y1] - knot_bil[y0]), 1)
        raise ValueError(year)

    out: list[dict] = []
    for year in range(2014, 2024):
        out.append(
            {
                "year": year,
                "billionLiters": interpolate_year(year),
                "publishedAnchor": year in ANCHOR,
                "source": "LBNL-2001637 Fig. 5.9 historical stacked-area total (PDF extract)",
            }
        )
    return out


def main() -> None:
    doc = pymupdf.open(PDF)
    totals = extract_historical(doc[FIG_PAGE])
    payload = {"page": FIG_PAGE, "calibrated": totals, "anchors": ANCHOR, "yearT": YEAR_T}
    OUT.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(json.dumps(totals, indent=2))
    print("Wrote", OUT, CROP_PNG)


if __name__ == "__main__":
    main()
