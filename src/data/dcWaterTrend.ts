/**
 * Consumo directo de agua en sitio — EE. UU. (mil millones de litros = billion liters).
 * LBNL-2001637 (2024), Figure 5.9 — modelo bottom-up (área histórica 2014–2023).
 *
 * Totales anuales: extraídos del PDF (scripts/extract-lbnl-fig59.py → fig59-extract.json).
 * Anclas 2014 y 2023 calibradas al texto del informe (21,2 y 66 mil M L).
 */
export type DcWaterPoint = {
  year: number;
  billionLiters: number;
  label?: boolean;
  /** true = cifra citada explícitamente en el texto del informe. */
  publishedAnchor?: boolean;
};

export const dcWaterTrend: DcWaterPoint[] = [
  {year: 2014, billionLiters: 21.2, label: true, publishedAnchor: true},
  {year: 2015, billionLiters: 21.5, publishedAnchor: false},
  {year: 2016, billionLiters: 21.8, publishedAnchor: false},
  {year: 2017, billionLiters: 22.7, publishedAnchor: false},
  {year: 2018, billionLiters: 23.6, label: true, publishedAnchor: false},
  {year: 2019, billionLiters: 25.9, publishedAnchor: false},
  {year: 2020, billionLiters: 28.2, publishedAnchor: false},
  {year: 2021, billionLiters: 41.1, publishedAnchor: false},
  {year: 2022, billionLiters: 54.0, publishedAnchor: false},
  {year: 2023, billionLiters: 66, label: true, publishedAnchor: true},
];

export const DC_WATER_YEAR_MIN = 2014;
export const DC_WATER_YEAR_MAX = 2023;
export const DC_WATER_BIL_L_MAX = 75;
