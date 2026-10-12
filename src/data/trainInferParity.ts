import {theme} from '../theme';
import {formatUsd} from './tcoSlices';

/** DeepSeek-V3 informe — coste run (USD). */
export const DEEPSEEK_V3_TRAIN_USD = 5_576_000;

export type ParityUnit = 'kWh' | 'USD';

export type ParitySlice = {
  id: string;
  label: string;
  amount: number;
  fill: string;
  kind: 'train' | 'infer';
};

export type ParitySliceAngles = ParitySlice & {
  startAngle: number;
  endAngle: number;
};

export function formatParityAmount(amount: number, unit: ParityUnit): string {
  if (unit === 'USD') {
    if (amount >= 1_000_000) {
      return `USD ${(amount / 1_000_000).toFixed(3).replace('.', ',')} M`;
    }
    return formatUsd(amount);
  }
  if (amount >= 1_000) {
    return `${amount.toLocaleString('en-US')} kWh`;
  }
  return `${amount} kWh`;
}

export function paritySlicesWithAngles(
  slices: ParitySlice[],
): ParitySliceAngles[] {
  const total = slices.reduce((s, x) => s + x.amount, 0);
  let cursor = -90;
  return slices.map(slice => {
    const sweep = (slice.amount / total) * 360;
    const startAngle = cursor;
    cursor += sweep;
    return {...slice, startAngle, endAngle: cursor};
  });
}
