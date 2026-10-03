import {theme} from '../theme';

/**
 * TCO = Hardware + Infraestructura + Energía + Refrigeración + Red + Operación + Mantenimiento
 * (ilustrativo ~5 años; servidor de compra $5,000)
 *
 * CAPEX: Hardware, Infraestructura, Refrigeración, Red
 * OPEX:  Energía, Operación, Mantenimiento
 */
export type TcoKind = 'capex' | 'opex';

export type TcoSlice = {
  id: string;
  label: string;
  dollars: number;
  fill: string;
  kind: TcoKind;
};

export const tcoSlices: TcoSlice[] = [
  {id: 'hardware', label: 'Hardware', dollars: 5_000, fill: theme.pie[0], kind: 'capex'},
  {id: 'infra', label: 'Infraestructura', dollars: 2_700, fill: theme.pie[4], kind: 'capex'},
  {id: 'energy', label: 'Energía', dollars: 4_300, fill: theme.pie[1], kind: 'opex'},
  {id: 'cooling', label: 'Refrigeración', dollars: 1_700, fill: theme.pie[2], kind: 'capex'},
  {id: 'network', label: 'Red', dollars: 1_150, fill: theme.pie[3], kind: 'capex'},
  {id: 'ops', label: 'Operación', dollars: 1_400, fill: theme.pie[5], kind: 'opex'},
  {id: 'maint', label: 'Mantenimiento', dollars: 800, fill: theme.pie[6], kind: 'opex'},
];

export const TCO_TOTAL_USD = tcoSlices.reduce((sum, s) => sum + s.dollars, 0);

export type TcoSliceAngles = TcoSlice & {
  startAngle: number;
  endAngle: number;
};

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

/** Ángulos en grados; partimos desde arriba (-90°). Orden del array = orden del pie. */
export function tcoSlicesWithAngles(): TcoSliceAngles[] {
  let cursor = -90;
  return tcoSlices.map(slice => {
    const sweep = (slice.dollars / TCO_TOTAL_USD) * 360;
    const startAngle = cursor;
    cursor += sweep;
    return {...slice, startAngle, endAngle: cursor};
  });
}
