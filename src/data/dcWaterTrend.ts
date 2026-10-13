/**
 * Consumo directo de agua en sitio — centros de datos EE. UU. (mil millones de litros).
 * LBNL 2024 United States Data Center Energy Usage Report (citado en revisión Lei et al. / DOE).
 */
export type DcWaterPoint = {
  year: number;
  billionLiters: number;
  label?: boolean;
};

export const dcWaterTrend: DcWaterPoint[] = [
  {year: 2014, billionLiters: 21.2, label: true},
  {year: 2023, billionLiters: 66, label: true},
];

export const DC_WATER_YEAR_MIN = 2014;
export const DC_WATER_YEAR_MAX = 2023;
export const DC_WATER_BIL_L_MAX = 75;
