import {theme} from '../theme';
import {
  US_DC_WATER_DIRECT_BIL_L_2023,
  US_DC_WATER_FOOTPRINT_YEAR,
  US_DC_WATER_INDIRECT_BIL_L_2023,
} from './usDcWaterFootprint';
import {
  paritySlicesWithAngles,
  type ParitySlice,
  type ParitySliceAngles,
} from './trainInferParity';

export const dcWaterFootprintPieSlices: ParitySlice[] = [
  {
    id: 'direct',
    label: 'Directo en sitio',
    amount: US_DC_WATER_DIRECT_BIL_L_2023,
    fill: theme.cyan,
    kind: 'train',
  },
  {
    id: 'indirect',
    label: 'Indirecto vía electricidad',
    amount: US_DC_WATER_INDIRECT_BIL_L_2023,
    fill: theme.magenta,
    kind: 'infer',
  },
];

export function dcWaterFootprintPieWithAngles(): ParitySliceAngles[] {
  return paritySlicesWithAngles(dcWaterFootprintPieSlices);
}

export const DC_WATER_FOOTPRINT_TOTAL_BIL_L_2023 =
  US_DC_WATER_DIRECT_BIL_L_2023 + US_DC_WATER_INDIRECT_BIL_L_2023;

export function dcWaterFootprintSharePct(direct: boolean): number {
  const part = direct
    ? US_DC_WATER_DIRECT_BIL_L_2023
    : US_DC_WATER_INDIRECT_BIL_L_2023;
  return Math.round((part / DC_WATER_FOOTPRINT_TOTAL_BIL_L_2023) * 1000) / 10;
}

export const dcWaterFootprintPieYear = US_DC_WATER_FOOTPRINT_YEAR;
