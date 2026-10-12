import {Circle, Layout, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {
  DEEPSEEK_CHAT_IN_PER_M,
  DEEPSEEK_CHAT_OUT_PER_M,
  DEEPSEEK_TRAIN_USD,
  formatCompactUsd,
  OPENROUTER_FOUR_WEEK_INFER_USD,
  deepSeekChatUsdPerRequest,
  OPENROUTER_INFER_USD_PER_WEEK,
  OPENROUTER_INFER_USD_PER_YEAR_EXTRAP,
  deepSeekTrainVsInferPieWithAngles,
} from '../data/deepSeekTrainVsInfer';
import {formatParityAmount} from '../data/trainInferParity';
import {DeepSeekPixelLogo} from './DeepSeekPixelLogo';
import {LlamaBrandLogo} from './LlamaBrandLogo';
import {TrainInferParityPieChart} from './TrainInferParityPieChart';
import {theme} from '../theme';

/** CapEx de mercado ~2024 (GPU + nodo + red; orden de magnitud, no factura). */
const CAPEX_USD_PER_GPU = 50_000;
/** Convención del informe DeepSeek-V3 (alquiler / tarifa de referencia). */
const RENTAL_REF_USD_PER_GPU_H = 2;

export type TrainingModelFact = {
  label: string;
  value: string;
  costHighlight?: 'run' | 'capex';
};

export type TrainingModelProfile = {
  slideId: string;
  title: string;
  lead: string;
  /** Encabezado del panel de hechos (p. ej. estimaciones vs model card). */
  factsPanelTitle?: string;
  facts: readonly TrainingModelFact[];
  footnote: string;
  footerIds: readonly string[];
  brand?: 'deepseek' | 'llama';
  brandSubtitle?: string;
};

function capexClusterLabel(gpus: number): string {
  const usd = gpus * CAPEX_USD_PER_GPU;
  const m = usd / 1_000_000;
  const mLabel =
    m >= 100 ? `~${Math.round(m)}` : `~${m.toFixed(0)}`;
  return `USD ${mLabel} M · ${gpus.toLocaleString('es')} × ~50k USD/GPU (est.)`;
}

function rentalRunCostLabel(gpuHours: number): string {
  const usd = (gpuHours * RENTAL_REF_USD_PER_GPU_H) / 1_000_000;
  return `USD ~${usd.toFixed(1).replace('.', ',')} M · ${RENTAL_REF_USD_PER_GPU_H} USD/GPU·h (convención DeepSeek)`;
}

/** GPU-h ÷ GPUs ≈ horas de reloj si el cluster estuvo lleno todo el tiempo. */
function wallClockLabel(gpuHours: number, gpus: number): string {
  const hours = Math.round(gpuHours / gpus);
  const days = Math.round(hours / 24);
  return `~${hours.toLocaleString('es')} h en reloj (~${days} días)`;
}

/** Orden: más datos publicados primero. */
export const TRAINING_MODEL_PROFILES: readonly TrainingModelProfile[] = [
  {
    slideId: 'ia-train-deepseek-v3',
    title: 'DeepSeek-V3',
    lead: 'Informe técnico · datos que publicaron los autores',
    facts: [
      {
        label: 'Parámetros',
        value: '671 B total (MoE) · 37 B activos por token',
      },
      {
        label: 'Datos (pretraining)',
        value: '14.8 billones de tokens',
      },
      {
        label: 'GPUs',
        value: '2 048 × NVIDIA H800',
      },
      {
        label: 'GPU·h totales',
        value: '2 788 000 (H800 · todo el entrenamiento)',
      },
      {
        label: 'Tiempo en reloj (aprox.)',
        value: `${wallClockLabel(2_788_000, 2048)} · 2 048 GPUs`,
      },
      {
        label: 'Costo de entrenar (paper)',
        value:
          'USD 5,576 M — 2 788 000 GPU·h × 2 USD/GPU·h (tarifa asumida)',
        costHighlight: 'run',
      },
      {
        label: 'CapEx del cluster (~est.)',
        value: capexClusterLabel(2048),
        costHighlight: 'capex',
      },
    ],
    footnote:
      '5,576 M = solo entrenamiento oficial (sin I+D ni ablations). No incluye comprar el cluster.\nCapEx ~100 M = orden de magnitud mercado 2024. Los 2 USD/GPU·h los fija el paper (alquiler); encajan ~1,5–1,7 USD/GPU·h TCO interno H100 (Meta) y < nube (~5+ USD/h), pero no se deducen del CapEx sin supuestos.',
    footerIds: ['deepSeekV3Paper', 'h100CapexPerGpuEst', 'metaH100ClusterTco'],
    brand: 'deepseek',
  },
  {
    slideId: 'ia-train-llama31-405b',
    title: 'Llama 3.1 405B',
    lead: 'Model card Meta · julio 2024',
    facts: [
      {label: 'Parámetros', value: '405 B (denso: todos activos en cada paso)'},
      {label: 'Datos (familia 3.1)', value: '15 billones+ de tokens'},
      {label: 'GPUs', value: 'Hasta 16 000 × H100-80GB'},
      {
        label: 'GPU-horas',
        value: '30 840 000 H100-h (solo el modelo 405B)',
      },
      {
        label: 'Tiempo en reloj (aprox.)',
        value: `${wallClockLabel(30_840_000, 16_000)} · pico 16 000 GPUs`,
      },
      {
        label: 'Costo de entrenar (~est.)',
        value: `${rentalRunCostLabel(30_840_000)} · Meta no publica USD`,
        costHighlight: 'run',
      },
      {
        label: 'CapEx cluster pico (~est.)',
        value: capexClusterLabel(16_000),
        costHighlight: 'capex',
      },
    ],
    footnote:
      'Entrenamiento ~62 M = misma convención 2 USD/GPU·h que DeepSeek (ilustrativo). CapEx ~800 M = pico 16k H100 × ~50k USD/GPU; Meta posee infra, no es cheque único por entrenamiento.\nFamilia 3.1: 39,3 M GPU-h. Emisiones 405B: 8 930 t CO₂e.',
    footerIds: [
      'llama31Card',
      'metaLlamaBlog',
      'deepSeekV3Paper',
      'h100CapexPerGpuEst',
      'metaH100ClusterTco',
    ],
    brand: 'llama',
    brandSubtitle: '3.1 · 405B',
  },
] as const;

const LIST_W = 780;
const LIST_ITEM_H = 58;
/** Paneles en fila (dos columnas). */
const LIST_W_NARROW = 620;
const LIST_PAIR_X = 320;

function FactsPanel({
  facts,
  panelTitle = 'Datos publicados',
  nodeKeyPrefix = 'facts',
  listW = LIST_W,
  listItemH = LIST_ITEM_H,
  runHighlightRef,
  capexHighlightRef,
  x,
  y,
}: {
  facts: readonly TrainingModelFact[];
  panelTitle?: string;
  /** Keys únicos en toda la escena MC (varias diapositivas en un recalculate). */
  nodeKeyPrefix?: string;
  listW?: number;
  listItemH?: number;
  runHighlightRef?: Reference<Rect>;
  capexHighlightRef?: Reference<Rect>;
  x: number;
  y: number;
}) {
  const padTop = 36;
  const padBottom = 28;
  const listH = padTop + facts.length * listItemH + padBottom;

  return (
    <Layout layout={false} x={x} y={y}>
      <Rect width={listW} height={listH} fill={theme.black} x={5} y={5} />
      <Rect
        width={listW}
        height={listH}
        fill={theme.white}
        stroke={theme.black}
        lineWidth={theme.border}
      />
      <Txt
        text={panelTitle}
        fontFamily={theme.pixelFont}
        fontSize={26}
        fill={theme.black}
        y={-listH / 2 + 22}
      />
      {facts.map((fact, i) => {
        const lineY = -listH / 2 + padTop + 24 + i * listItemH;
        const rowHighlightRef =
          fact.costHighlight === 'run'
            ? runHighlightRef
            : fact.costHighlight === 'capex'
              ? capexHighlightRef
              : undefined;
        return (
          <Layout key={`${nodeKeyPrefix}-${i}-${fact.label}`} layout={false} y={lineY}>
            {rowHighlightRef ? (
              <Rect
                ref={rowHighlightRef}
                width={listW - 40}
                height={listItemH - 4}
                fill={theme.cyan}
                opacity={0}
                y={16}
              />
            ) : null}
            <Txt
              text={`▸  ${fact.label}`}
              fontFamily={theme.bodyFont}
              fontSize={20}
              fontWeight={700}
              fill={theme.black}
              textAlign="left"
              offsetX={-1}
              x={-listW / 2 + 28}
            />
            <Txt
              text={fact.value}
              fontFamily={theme.bodyFont}
              fontSize={20}
              fontWeight={500}
              fill={theme.grey}
              textAlign="left"
              offsetX={-1}
              x={-listW / 2 + 28}
              y={26}
              width={listW - 56}
              lineHeight={26}
            />
          </Layout>
        );
      })}
    </Layout>
  );
}

function TrainingFactsList(
  props: Omit<Parameters<typeof FactsPanel>[0], 'listW' | 'listItemH'>,
) {
  return <FactsPanel {...props} />;
}

/** Tarifas API tier Standard ($/1M tokens). Fuentes: SOURCES.md § precios prompt. */
const PROMPT_USD_TOP_PER_MTOK = {
  'DeepSeek chat (API oficial)': {
    in: DEEPSEEK_CHAT_IN_PER_M,
    out: DEEPSEEK_CHAT_OUT_PER_M,
  },
  'Llama 3.3 70B (API hosted)': {in: 0.22, out: 0.5},
} as const;

const PROMPT_USD_REST_PER_MTOK = {
  'Gemini 2.5 Flash': {in: 0.3, out: 2.5},
  'GPT-5.4 mini': {in: 0.75, out: 4.5},
  'GPT-5.4': {in: 2.5, out: 15},
  'Claude Sonnet 4.6': {in: 3, out: 15},
} as const;

const PROMPT_EXAMPLE_TOKENS = 1000;

function usdPromptAmount(usd: number): string {
  return usd >= 0.01 ? `$${usd.toFixed(2)}` : `$${usd.toFixed(4)}`;
}

function costFor1kIn1kOut(inPerM: number, outPerM: number): number {
  const k = PROMPT_EXAMPLE_TOKENS / 1_000_000;
  return k * inPerM + k * outPerM;
}

function promptUsdFacts(
  table: Record<string, {in: number; out: number}>,
): TrainingModelFact[] {
  return Object.entries(table).map(([model, rates]) => {
    const perChat = costFor1kIn1kOut(rates.in, rates.out);
    return {
      label: model,
      value: `${usdPromptAmount(perChat)} / chat · ${usdPromptAmount(perChat * 100)} ×100 prompts`,
    };
  });
}

const PROMPT_FACTS: readonly TrainingModelFact[] = [
  ...promptUsdFacts(PROMPT_USD_TOP_PER_MTOK),
  ...promptUsdFacts(PROMPT_USD_REST_PER_MTOK),
];

const TRAIN_SCALE_FACTS: readonly TrainingModelFact[] = [
  {label: 'Cuándo', value: 'Antes de que el modelo sirva a usuarios'},
  {label: 'Cuántas veces', value: 'Pocas — a menudo una vez por versión'},
  {label: 'Escala', value: 'Mucho cómpute junto · semanas, miles de GPUs'},
  {label: 'Tipo de costo', value: 'Hardware, energía, tiempo de cluster'},
];

const INFERENCE_SCALE_FACTS: readonly TrainingModelFact[] = [
  {label: 'Cuándo', value: 'Cada prompt, chat o consulta en producción'},
  {label: 'Cuántas veces', value: 'Millones → miles de millones de veces'},
  {label: 'Por uso', value: 'Pequeño frente a entrenar (un chat, una llamada)'},
  {label: 'Tipo de costo', value: 'Suma de muchos usos · tarifa API o energía'},
];

const COST_HIGHLIGHT_OPACITY = 0.42;

/** Opacidad del resaltado run / CapEx (pasos tras el slide inicial). */
export {COST_HIGHLIGHT_OPACITY};

/** Un modelo por slide — solo datos publicados. */
export function LlmTrainingModelSlide({
  profile,
  runHighlightRef,
  capexHighlightRef,
}: {
  profile: TrainingModelProfile;
  runHighlightRef?: Reference<Rect>;
  capexHighlightRef?: Reference<Rect>;
}) {
  const withLogo = profile.brand != null;
  const listX = withLogo ? 120 : 0;
  const listY = 20;
  const footY = profile.facts.length > 6 ? 360 : 320;

  return (
    <Layout layout={false} width={'100%'} height={'100%'}>
      <Txt
        text={`A escala industrial: entrenar · ${profile.title}`}
        fontFamily={theme.pixelFont}
        fontSize={46}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-360}
      />
      <Txt
        text={profile.lead}
        fontFamily={theme.bodyFont}
        fontSize={26}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-290}
      />

      {profile.brand === 'deepseek' ? (
        <DeepSeekPixelLogo x={-420} y={listY} />
      ) : null}
      {profile.brand === 'llama' ? (
        <LlamaBrandLogo
          x={-420}
          y={listY}
          subtitle={profile.brandSubtitle ?? profile.title}
        />
      ) : null}
      <TrainingFactsList
        facts={profile.facts}
        panelTitle={profile.factsPanelTitle}
        nodeKeyPrefix={profile.slideId}
        runHighlightRef={runHighlightRef}
        capexHighlightRef={capexHighlightRef}
        x={listX}
        y={listY}
      />

      <Txt
        text={profile.footnote}
        fontFamily={theme.bodyFont}
        fontSize={18}
        fill={theme.grey}
        textAlign="center"
        lineHeight={28}
        x={0}
        y={footY}
        width={1200}
      />
    </Layout>
  );
}

/** Entrenamiento vs inferencia — mismo estilo de listas que costes de entrenamiento. */
export function LlmCostCompareScaleSlide() {
  const listY = 20;
  return (
    <Layout layout={false} width={'100%'} height={'100%'}>
      <Txt
        text="Dos tipos de costo"
        fontFamily={theme.pixelFont}
        fontSize={46}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-360}
      />
      <Txt
        text="Misma idea de TCO: un gasto grande pocas veces vs muchos gastos pequeños"
        fontFamily={theme.bodyFont}
        fontSize={24}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-290}
        width={1100}
      />
      <FactsPanel
        facts={TRAIN_SCALE_FACTS}
        panelTitle="Entrenamiento"
        nodeKeyPrefix="cost-cmp-train"
        listW={LIST_W_NARROW}
        x={-LIST_PAIR_X}
        y={listY}
      />
      <FactsPanel
        facts={INFERENCE_SCALE_FACTS}
        panelTitle="Inferencia"
        nodeKeyPrefix="cost-cmp-infer"
        listW={LIST_W_NARROW}
        x={LIST_PAIR_X}
        y={listY}
      />
      <Txt
        text="Siguientes slides: cifras publicadas por modelo"
        fontFamily={theme.bodyFont}
        fontSize={18}
        fill={theme.grey}
        textAlign="center"
        lineHeight={28}
        x={0}
        y={320}
        width={1200}
      />
    </Layout>
  );
}

/** Costo por prompt — layout alineado con slides de entrenamiento industrial. */
export function LlmPromptCostSlide() {
  const listY = 20;
  return (
    <Layout layout={false} width={'100%'} height={'100%'}>
      <Txt
        text="A escala industrial: inferir · ¿cuánto cuesta un prompt?"
        fontFamily={theme.pixelFont}
        fontSize={46}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-360}
      />
      <Txt
        text="API Standard · 1 000 tokens in + 1 000 out (sin cache, tools ni grounding)"
        fontFamily={theme.bodyFont}
        fontSize={26}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-290}
      />
      <FactsPanel
        facts={PROMPT_FACTS}
        panelTitle="Tarifas por prompt (1k in + 1k out)"
        nodeKeyPrefix="prompt-api"
        listW={LIST_W}
        listItemH={48}
        x={0}
        y={listY}
      />
      <Txt
        text={
          'Gemini puede cobrar tokens de razonamiento en la salida.\nLos precios cambian; revisar documentación del proveedor antes de grabar.'
        }
        fontFamily={theme.bodyFont}
        fontSize={18}
        fill={theme.grey}
        textAlign="center"
        lineHeight={28}
        x={0}
        y={320}
        width={1200}
      />
    </Layout>
  );
}

const DEEPSEEK_CHAT_USD = deepSeekChatUsdPerRequest();

const trainVsInferPieSlices = deepSeekTrainVsInferPieWithAngles();

/** DeepSeek — gasto en entrenar vs gasto en chats (dato 4 sem + extrap.). */
export function LlmDeepSeekTrainVsInferSlide({
  pieSliceRefs,
}: {
  pieSliceRefs: Reference<Circle>[];
}) {
  return (
    <Layout layout={false} width={'100%'} height={'100%'}>
      <Txt
        text="DeepSeek-V3: gasto en entrenar vs gasto en chats"
        fontFamily={theme.pixelFont}
        fontSize={42}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-360}
      />
      <Txt
        text="Train publicado (paper) · chats = 97,5 M req en 4 sem (OpenRouter) × tarifa API"
        fontFamily={theme.bodyFont}
        fontSize={23}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-290}
        width={1100}
      />
      <Layout layout={false} x={0} y={30}>
        <TrainInferParityPieChart
          keyPrefix="ds-train-infer"
          unit="USD"
          slices={trainVsInferPieSlices}
          sliceRefs={pieSliceRefs}
          trainDetail={`Gasté ${formatParityAmount(DEEPSEEK_TRAIN_USD, 'USD')} · una vez`}
          inferAmountDetail={`~${formatCompactUsd(OPENROUTER_INFER_USD_PER_YEAR_EXTRAP)} · 1 año al ritmo medido`}
          inferVolumeDetail={`4 sem: ${formatCompactUsd(OPENROUTER_FOUR_WEEK_INFER_USD)} · ~${formatCompactUsd(OPENROUTER_INFER_USD_PER_WEEK)}/sem`}
          totalCaption="USD · áreas ∝ cifras del pie (train 1× vs chats 1 año est.)"
        />
      </Layout>
      <Txt
        text={
          '1 año y 1 sem son extrapolación del tramo de 4 sem (NIST CAISI / OpenRouter). No incluye cache ni prompts distintos de 1k+1k.'
        }
        fontFamily={theme.bodyFont}
        fontSize={17}
        fill={theme.grey}
        textAlign="center"
        lineHeight={26}
        x={0}
        y={340}
        width={1050}
      />
    </Layout>
  );
}
