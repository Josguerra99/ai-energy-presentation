/**
 * Crecimiento agua directa — LBNL Fig. 5.9 (LBNL-2001637), 2014→2023.
 */
import {LBNL_US_DC_DIRECT_WATER_BIL_L} from './lbnlUsDc2024';
import {dcWaterTrend} from './dcWaterTrend';

export const DC_WATER_DIRECT_GROWTH_PCT =
  ((LBNL_US_DC_DIRECT_WATER_BIL_L[2023] - LBNL_US_DC_DIRECT_WATER_BIL_L[2014]) /
    LBNL_US_DC_DIRECT_WATER_BIL_L[2014]) *
  100;

export const DC_WATER_DIRECT_GROWTH_FACTOR =
  LBNL_US_DC_DIRECT_WATER_BIL_L[2023] / LBNL_US_DC_DIRECT_WATER_BIL_L[2014];

/** Inicio del tramo empinado en Fig. 5.9 (modelo LBNL). */
export const DC_WATER_DIRECT_ACCELERATION_YEAR = 2020;

function bilAtYear(year: number): number {
  const p = dcWaterTrend.find(x => x.year === year);
  if (!p) {
    throw new Error(`dcWaterTrend: no hay dato para ${year}`);
  }
  return p.billionLiters;
}

export const dcWaterDirectGrowthSinceAcceleration = (() => {
  const fromBilL = bilAtYear(DC_WATER_DIRECT_ACCELERATION_YEAR);
  const last = dcWaterTrend[dcWaterTrend.length - 1];
  const toBilL = last.billionLiters;
  const pct = Math.round((toBilL / fromBilL - 1) * 100);
  const factor = Math.round((toBilL / fromBilL) * 10) / 10;
  return {
    fromBilL,
    toBilL,
    toYear: last.year,
    pct,
    factor,
  };
})();
