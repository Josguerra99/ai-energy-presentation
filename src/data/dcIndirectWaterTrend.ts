/**
 * Huella hídrica indirecta (mil millones de litros) — EE. UU., centros de datos.
 *
 * LBNL-2001637 publica el total indirecto de 2023 (~800 mil M L, Fig. 5.10) y la
 * electricidad DC por año (Fig. 5.5 / ES-1). No hay tabla año a año de agua indirecta.
 *
 * Serie intermedia: proporcional a TWh del mismo informe, calibrada a 2023:
 *   bil_L ≈ TWh × (800 / 176)
 * (equivalente a ~4,55 L/kWh de media si se interpretara como intensidad constante).
 * La intensidad real varía por mix regional y año; ver limitaciones §5 / Fig. 5.10.
 */
import {
  LBNL_US_DC_ENERGY_TWH,
  LBNL_US_DC_INDIRECT_WATER_BIL_L_2023,
} from './lbnlUsDc2024';

export type DcIndirectWaterPoint = {
  year: number;
  billionLiters: number;
  twh: number;
  label?: boolean;
  /** true = anclado al texto del informe (2023). */
  publishedAnchor?: boolean;
};

const INDIRECT_BIL_L_PER_TWH =
  LBNL_US_DC_INDIRECT_WATER_BIL_L_2023 / LBNL_US_DC_ENERGY_TWH[2023];

function bilLFromTwh(twh: number): number {
  return Math.round(twh * INDIRECT_BIL_L_PER_TWH);
}

export const dcIndirectWaterTrend: DcIndirectWaterPoint[] = [
  {
    year: 2014,
    twh: LBNL_US_DC_ENERGY_TWH[2014],
    billionLiters: bilLFromTwh(LBNL_US_DC_ENERGY_TWH[2014]),
    label: true,
  },
  {
    year: 2016,
    twh: LBNL_US_DC_ENERGY_TWH[2016],
    billionLiters: bilLFromTwh(LBNL_US_DC_ENERGY_TWH[2016]),
  },
  {
    year: 2018,
    twh: LBNL_US_DC_ENERGY_TWH[2018],
    billionLiters: bilLFromTwh(LBNL_US_DC_ENERGY_TWH[2018]),
    label: true,
  },
  {
    year: 2023,
    twh: LBNL_US_DC_ENERGY_TWH[2023],
    billionLiters: LBNL_US_DC_INDIRECT_WATER_BIL_L_2023,
    label: true,
    publishedAnchor: true,
  },
];

export const DC_INDIRECT_WATER_YEAR_MIN = 2014;
export const DC_INDIRECT_WATER_YEAR_MAX = 2023;
export const DC_INDIRECT_WATER_BIL_L_MAX = 850;
