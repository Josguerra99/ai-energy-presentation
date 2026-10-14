/**
 * Electricidad mundial de centros de datos (TWh).
 * Anclas IEA: 415 TWh (2024); 485 TWh (2025, Key Questions on Energy and AI 2026);
 * ~945 TWh (2030, caso base). ~12 %/año desde 2017 (Energy and AI 2025).
 * 2017 e intermedios 2019–2023: tendencia 12 %/año hacia 485 en 2025 (485 / 1,12^n).
 */
export type GlobalDcEnergyPoint = {
  year: number;
  twh: number;
  label?: boolean;
  /** Solo 2030: proyección; 2025 es la estimación IEA más reciente (línea sólida). */
  projected?: boolean;
};

/** Estimación IEA alineada con ~12 % anual desde 2017 hasta 485 TWh en 2025. */
export const GLOBAL_DC_TWH_2017_EST = Math.round(485 / 1.12 ** 8);

export const globalDcEnergyTrend: GlobalDcEnergyPoint[] = [
  {year: 2017, twh: GLOBAL_DC_TWH_2017_EST, label: true},
  {year: 2019, twh: Math.round(GLOBAL_DC_TWH_2017_EST * 1.12 ** 2)},
  {year: 2021, twh: Math.round(GLOBAL_DC_TWH_2017_EST * 1.12 ** 4)},
  {year: 2023, twh: Math.round(GLOBAL_DC_TWH_2017_EST * 1.12 ** 6)},
  {year: 2024, twh: 415},
  {year: 2025, twh: 485, label: true},
  {year: 2030, twh: 945, label: true, projected: true},
];

export const GLOBAL_DC_TWH_2025 = 485;
export const GLOBAL_DC_CAGR_2017_PCT = 12;
export const GLOBAL_DC_GROWTH_FACTOR_2017_2025 =
  GLOBAL_DC_TWH_2025 / GLOBAL_DC_TWH_2017_EST;
/** Aumento relativo 2017→2025: (485/196 − 1) ≈ +147 %. */
export const GLOBAL_DC_GROWTH_PCT_2017_2025 = Math.round(
  (GLOBAL_DC_GROWTH_FACTOR_2017_2025 - 1) * 100,
);

export const GLOBAL_DC_SHARE_2030_PCT = 3;

export const GLOBAL_DC_YEAR_MIN = 2017;
export const GLOBAL_DC_YEAR_MAX = 2030;
export const GLOBAL_DC_TWH_MAX = 1000;

/** Tramo punteado: proyección IEA 2025→2030. */
export const GLOBAL_DC_FORECAST_FROM_YEAR = 2025;
