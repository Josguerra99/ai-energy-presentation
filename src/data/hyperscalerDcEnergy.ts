/**
 * Electricidad en data centers (TWh), MWh corporativos ÷ 1 000 000.
 *
 * Google: 2020–2024 — 2025 Environmental Report; 2025 — 2026 Environmental Report /
 *   FY2025 assurance schedule (42 415 800 MWh data centers).
 *
 * Meta: 2010–2016 — Sustainability Data Disclosure (Data center operations/total, MWh);
 * 2017–2024 — 2025 Environmental Data Index («Data centers total»; sin fila 2025 aún).
 */
export type HyperscalerEnergyPoint = {
  year: number;
  twh: number;
  label?: boolean;
};

function mwhToTwh(mwh: number): number {
  return Math.round((mwh / 1_000_000) * 100) / 100;
}

/** Google — MWh de data centers (tabla / assurance; desde 2020). */
export const googleDcEnergyTrend: HyperscalerEnergyPoint[] = [
  {year: 2020, twh: mwhToTwh(14_408_000), label: true},
  {year: 2021, twh: mwhToTwh(17_432_000)},
  {year: 2022, twh: mwhToTwh(20_634_000)},
  {year: 2023, twh: mwhToTwh(24_037_000)},
  {year: 2024, twh: mwhToTwh(30_825_600)},
  {year: 2025, twh: mwhToTwh(42_415_800), label: true},
];

/** Meta no publica total DC calendario 2025 en el Environmental Data Index (último: 2024). */
export const META_DC_LATEST_PUBLISHED_YEAR = 2024;

/** Meta disclosures — total electricidad en data centers. */
export const metaDcEnergyTrend: HyperscalerEnergyPoint[] = [
  {year: 2010, twh: mwhToTwh(509_000), label: true},
  {year: 2011, twh: mwhToTwh(516_000)},
  {year: 2012, twh: mwhToTwh(680_000)},
  {year: 2013, twh: mwhToTwh(793_000)},
  {year: 2014, twh: mwhToTwh(999_000)},
  {year: 2015, twh: mwhToTwh(1_260_000)},
  {year: 2016, twh: mwhToTwh(1_756_000)},
  {year: 2017, twh: mwhToTwh(2_360_000)},
  {year: 2018, twh: mwhToTwh(3_245_000)},
  {year: 2019, twh: mwhToTwh(4_918_000)},
  {year: 2020, twh: mwhToTwh(6_966_000)},
  {year: 2021, twh: mwhToTwh(9_117_122)},
  {year: 2022, twh: mwhToTwh(11_167_416)},
  {year: 2023, twh: mwhToTwh(14_975_435)},
  {year: 2024, twh: mwhToTwh(18_061_781), label: true},
];

export const GOOGLE_DC_YEAR_MIN = 2020;
export const GOOGLE_DC_YEAR_MAX = 2025;
export const GOOGLE_DC_TWH_MAX = 45;

export const META_DC_YEAR_MIN = 2010;
export const META_DC_YEAR_MAX = 2024;
export const META_DC_TWH_MAX = 20;

/**
 * Año de inflexión: a partir de aquí la CAGR hacia 2024 (~34 %/año) supera
 * la de 2010–2016 (~23 %/año); coincide con escala «hyperscale» en disclosures recientes.
 */
export const META_DC_ACCELERATION_YEAR = 2017;

export function twhAtYear(
  trend: HyperscalerEnergyPoint[],
  year: number,
): number {
  const p = trend.find(x => x.year === year);
  if (!p) {
    throw new Error(`No hay dato para el año ${year}`);
  }
  return p.twh;
}

export function growthSinceYear(
  trend: HyperscalerEnergyPoint[],
  fromYear: number,
): {fromTwh: number; toTwh: number; toYear: number; pct: number; factor: number} {
  const fromTwh = twhAtYear(trend, fromYear);
  const last = trend[trend.length - 1];
  const pct = Math.round((last.twh / fromTwh - 1) * 100);
  const factor = Math.round((last.twh / fromTwh) * 10) / 10;
  return {
    fromTwh,
    toTwh: last.twh,
    toYear: last.year,
    pct,
    factor,
  };
}

export const metaGrowthSinceAcceleration = growthSinceYear(
  metaDcEnergyTrend,
  META_DC_ACCELERATION_YEAR,
);

export function hyperscalerGrowthPct(
  trend: HyperscalerEnergyPoint[],
): number {
  const first = trend[0].twh;
  const last = trend[trend.length - 1].twh;
  return Math.round((last / first - 1) * 100);
}

export function hyperscalerGrowthFactor(
  trend: HyperscalerEnergyPoint[],
): number {
  const first = trend[0].twh;
  const last = trend[trend.length - 1].twh;
  return Math.round((last / first) * 10) / 10;
}

/** Etiquetas en eje X cuando hay muchos años (evita solapamiento). */
export function showCompanyYearTick(
  year: number,
  yearMin: number,
  yearMax: number,
  highlightYears: readonly number[] = [],
): boolean {
  if (highlightYears.includes(year)) return true;
  const span = yearMax - yearMin;
  if (span <= 5) return true;
  if (year === yearMin || year === yearMax) return true;
  if (span >= 10 && year % 5 === 0) return true;
  return false;
}
