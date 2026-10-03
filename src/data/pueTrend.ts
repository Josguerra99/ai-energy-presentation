import {theme} from '../theme';

/**
 * PUE medio anual — Uptime Institute Global Data Center Survey (Figure 2).
 *
 * Serie verificada contra:
 * - Global DC Survey 2024 PDF (promedio 1.56; histórico desde 2.50 en 2007)
 * - Global DC Survey 2025 PDF (promedio 1.54)
 * - Global DC Survey 2026 PDF (promedio 1.52; años etiquetados en Figure 2)
 * - Statista (serie Uptime 2007–2025) como cruce
 * - Survey 2018 / blog Uptime (2.5 → 1.98 → 1.65 → 1.58)
 *
 * Nota: Uptime no publica un valor para cada año 2008–2010 / 2012–2013 / 2015–2017;
 * la gráfica usa solo años con dato en la serie oficial.
 */
export type PuePoint = {
  year: number;
  pue: number;
  /** Mostrar etiqueta numérica sobre el punto (evita solapes en la meseta). */
  label?: boolean;
};

export const pueTrend: PuePoint[] = [
  {year: 2007, pue: 2.5, label: true},
  {year: 2011, pue: 1.98, label: true},
  {year: 2014, pue: 1.65, label: true},
  {year: 2018, pue: 1.58, label: true},
  {year: 2019, pue: 1.67, label: true},
  {year: 2020, pue: 1.59},
  {year: 2021, pue: 1.57},
  {year: 2022, pue: 1.55},
  {year: 2023, pue: 1.58},
  {year: 2024, pue: 1.56, label: true},
  {year: 2025, pue: 1.54},
  {year: 2026, pue: 1.52, label: true},
];

export const PUE_THEORETICAL_MIN = 1.0;
export const PUE_2007 = 2.5;
export const PUE_2024 = 1.56;
export const PUE_2026 = 1.52;

export const pueChartColors = {
  line: theme.cyan,
  point: theme.magenta,
  axis: theme.black,
  theoretical: theme.grey,
} as const;
