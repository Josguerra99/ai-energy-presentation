import {
  DEEPSEEK_V3_TRAIN_USD,
  paritySlicesWithAngles,
  type ParitySlice,
} from './trainInferParity';
import {formatUsd} from './tcoSlices';
import {theme} from '../theme';

/** api.deepseek.com deepseek-chat — cache miss + output ($/MTok). */
export const DEEPSEEK_CHAT_IN_PER_M = 0.28;
export const DEEPSEEK_CHAT_OUT_PER_M = 0.42;
export const PROMPT_TOKENS_IN_OUT = 1000;

export function deepSeekChatUsdPerRequest(): number {
  const k = PROMPT_TOKENS_IN_OUT / 1_000_000;
  return k * DEEPSEEK_CHAT_IN_PER_M + k * DEEPSEEK_CHAT_OUT_PER_M;
}

/**
 * OpenRouter vía NIST CAISI (2025): 97,5 M peticiones API en 4 semanas tras V3.1.
 * Es un marketplace tercero, no el total de api.deepseek.com.
 */
export const OPENROUTER_V31_FOUR_WEEK_REQUESTS = 97_500_000;

export function inferListUsdForRequests(requests: number): number {
  return requests * deepSeekChatUsdPerRequest();
}

export const DEEPSEEK_TRAIN_USD = DEEPSEEK_V3_TRAIN_USD;

export const OPENROUTER_FOUR_WEEK_INFER_USD = inferListUsdForRequests(
  OPENROUTER_V31_FOUR_WEEK_REQUESTS,
);

/** Tramo publicado ÷ 4 semanas. */
export const OPENROUTER_INFER_USD_PER_WEEK =
  OPENROUTER_FOUR_WEEK_INFER_USD / 4;

/** Extrapolación lineal del ritmo OpenRouter (4 sem → 52 sem). No es dato DeepSeek. */
export const OPENROUTER_INFER_USD_PER_YEAR_EXTRAP =
  OPENROUTER_FOUR_WEEK_INFER_USD * (52 / 4);

/**
 * Pie: USD reales — train (1×) vs chats 1 año al ritmo medido (4 sem OpenRouter).
 * Leyenda también cita 4 sem y 1 sem (dato + extrap.).
 */
export function deepSeekTrainVsInferPieSlices(): ParitySlice[] {
  return [
    {
      id: 'train',
      label: 'Entrenamiento (1×)',
      amount: DEEPSEEK_TRAIN_USD,
      fill: theme.pie[0],
      kind: 'train',
    },
    {
      id: 'infer',
      label: 'Chats API (1 año est.)',
      amount: OPENROUTER_INFER_USD_PER_YEAR_EXTRAP,
      fill: theme.pie[3],
      kind: 'infer',
    },
  ];
}

export function deepSeekTrainVsInferPieWithAngles() {
  return paritySlicesWithAngles(deepSeekTrainVsInferPieSlices());
}

export function formatCompactUsd(usd: number): string {
  if (usd >= 1_000_000) {
    return `USD ${(usd / 1_000_000).toFixed(3).replace('.', ',')} M`;
  }
  if (usd >= 10_000) {
    return `USD ${Math.round(usd / 1000)} k`;
  }
  return formatUsd(usd);
}
