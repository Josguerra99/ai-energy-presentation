import {theme} from '../theme';

/**
 * TCO ilustrativo ~5 años · servidor de compra ~USD 5 000 (1U / torre, uso 24/7).
 *
 * - Hardware: compra inicial (una vez).
 * - Resto CAPEX: reparto amortizado ~5 años (rack, red).
 * - OPEX: suma de 5 años (no mensual): energía, horas IT ocasionales, repuestos.
 *
 * Energía (5 a): ~400 W medio · 8 760 h/a · ~USD 0,14/kWh · factor ~1,35
 * (electricidad + parte de climatización del cuarto) → ~USD 660/a → ~USD 3 300.
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
  {
    id: 'infra',
    label: 'Infraestructura',
    dollars: 1_200,
    fill: theme.pie[4],
    kind: 'capex',
  },
  {id: 'energy', label: 'Energía', dollars: 3_300, fill: theme.pie[1], kind: 'opex'},
  {id: 'network', label: 'Red', dollars: 600, fill: theme.pie[3], kind: 'capex'},
  {
    id: 'ops',
    label: 'Operación (horas IT)',
    dollars: 2_500,
    fill: theme.pie[5],
    kind: 'opex',
  },
  {
    id: 'maint',
    label: 'Repuestos / piezas',
    dollars: 1_000,
    fill: theme.pie[6],
    kind: 'opex',
  },
];

export const TCO_TOTAL_USD = tcoSlices.reduce((sum, s) => sum + s.dollars, 0);

export type TcoSliceAngles = TcoSlice & {
  startAngle: number;
  endAngle: number;
};

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

/** Etiqueta leyenda: deja claro compra vs acumulado 5 años. */
export function tcoLegendAmount(slice: TcoSlice): string {
  if (slice.id === 'hardware') {
    return `${formatUsd(slice.dollars)} · compra`;
  }
  return `${formatUsd(slice.dollars)} · ~5 años`;
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
