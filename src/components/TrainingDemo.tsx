import {Layout, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {theme} from '../theme';

/** Secuencia real del corpus (teacher forcing). */
export const TRAIN_TOKENS = [
  'El',
  'cielo',
  'es',
  'de',
  'color',
  'azul',
] as const;

export const TRAIN_SENTENCE = 'El cielo es de color azul';

/**
 * Cada paso: ventana con los primeros `context` tokens reales,
 * el modelo adivina el siguiente; si falla, se ajustan pesos un poco
 * y se sigue con el token REAL (no con la predicción).
 */
export const TRAIN_STEPS: {
  context: number;
  guess: string;
  ok: boolean;
  target: string;
  weights: [string, string, string, string] | null;
}[] = [
  {
    context: 1,
    guess: 'gato',
    ok: false,
    target: 'cielo',
    weights: ['0.45', '-1.5', '0.12', '2.1'],
  },
  {
    context: 2,
    guess: 'es',
    ok: true,
    target: 'es',
    weights: null,
  },
  {
    context: 3,
    guess: 'muy',
    ok: false,
    target: 'de',
    weights: ['0.52', '-1.2', '0.20', '1.95'],
  },
  {
    context: 4,
    guess: 'color',
    ok: true,
    target: 'color',
    weights: null,
  },
  {
    context: 5,
    guess: 'rojo',
    ok: false,
    target: 'azul',
    weights: ['0.61', '-0.9', '0.33', '1.8'],
  },
];

/** Frases extra del MISMO fragmento (montajes rápidos sin pausas). */
export type TrainFastRun = {
  sentence: string;
  tokens: [string, string, string, string, string, string];
  /** Prefijo en la misma línea, antes de la frase. */
  before: string;
  /** Índice de línea en TRAIN_LINES (0-based). */
  phraseLine: number;
  steps: {
    context: number;
    guess: string;
    ok: boolean;
    target: string;
    weights: [string, string, string, string] | null;
  }[];
};

export const TRAIN_FAST_RUNS: TrainFastRun[] = [
  {
    sentence: 'Los pájaros cantaban en el parque',
    tokens: ['Los', 'pájaros', 'cantaban', 'en', 'el', 'parque'],
    before: 'Era una mañana clara en el pueblo. ',
    phraseLine: 0,
    steps: [
      {context: 1, guess: 'niños', ok: false, target: 'pájaros', weights: ['0.48', '-1.4', '0.15', '2.0']},
      {context: 2, guess: 'cantaban', ok: true, target: 'cantaban', weights: null},
      {context: 3, guess: 'por', ok: false, target: 'en', weights: ['0.55', '-1.1', '0.22', '1.9']},
      {context: 4, guess: 'el', ok: true, target: 'el', weights: null},
      {context: 5, guess: 'río', ok: false, target: 'parque', weights: ['0.63', '-0.85', '0.35', '1.75']},
    ],
  },
  {
    sentence: 'miraban las nubes pasar sin prisa',
    tokens: ['miraban', 'las', 'nubes', 'pasar', 'sin', 'prisa'],
    before: '',
    phraseLine: 2,
    steps: [
      {context: 1, guess: 'los', ok: false, target: 'las', weights: ['0.50', '-1.3', '0.18', '1.95']},
      {context: 2, guess: 'nubes', ok: true, target: 'nubes', weights: null},
      {context: 3, guess: 'volar', ok: false, target: 'pasar', weights: ['0.57', '-1.05', '0.25', '1.85']},
      {context: 4, guess: 'sin', ok: true, target: 'sin', weights: null},
      {context: 5, guess: 'ruido', ok: false, target: 'prisa', weights: ['0.66', '-0.8', '0.38', '1.7']},
    ],
  },
  {
    sentence: 'el viento movía los árboles junto',
    tokens: ['el', 'viento', 'movía', 'los', 'árboles', 'junto'],
    before: 'miraban las nubes pasar sin prisa, mientras ',
    phraseLine: 2,
    steps: [
      {context: 1, guess: 'sol', ok: false, target: 'viento', weights: ['0.51', '-1.25', '0.19', '1.92']},
      {context: 2, guess: 'movía', ok: true, target: 'movía', weights: null},
      {context: 3, guess: 'las', ok: false, target: 'los', weights: ['0.58', '-1.0', '0.26', '1.82']},
      {context: 4, guess: 'árboles', ok: true, target: 'árboles', weights: null},
      {context: 5, guess: 'cerca', ok: false, target: 'junto', weights: ['0.67', '-0.78', '0.39', '1.68']},
    ],
  },
];

export function trainHighlightLayout(
  before: string,
  sentence: string,
  phraseLine = TRAIN_PHRASE_LINE,
) {
  const beforeW = Math.round(before.length * 12.2) - (before.length ? 16 : 0);
  const highlightW = Math.round(sentence.length * 12.0);
  const phraseLineY = TRAIN_FIRST_LINE_Y + phraseLine * TRAIN_LINE_H;
  return {
    beforeW,
    highlightW,
    phraseLeft: TRAIN_TEXT_LEFT + beforeW,
    phraseCenterX: TRAIN_TEXT_LEFT + beforeW + highlightW / 2,
    phraseLineY,
    sourceY: TRAIN_CORPUS_Y + phraseLineY,
  };
}

export function trainSourceXAt(index: number, phraseCenterX: number): number {
  const n = 6;
  const w = 48;
  const gap = 4;
  const total = n * w + (n - 1) * gap;
  const start = phraseCenterX - total / 2 + w / 2;
  return start + index * (w + gap);
}
export const TRAIN_TOKEN_W = 130;
export const TRAIN_TOKEN_H = 64;
export const TRAIN_TOKEN_GAP = 12;
/** Fila de tokens (debajo del corpus). */
export const TRAIN_TOKEN_Y = 20;
export const TRAIN_MODEL_X = 0;
export const TRAIN_MODEL_Y = 175;
/** Debajo del modelo, dentro del área clip (~±400). */
export const TRAIN_SPAWN_Y = TRAIN_MODEL_Y + 115;

/** Título (blando para no pegar al clip superior ~±414). */
export const TRAIN_TITLE_Y = -340;

/** Corpus: casi todo el ancho útil de la diapositiva. */
export const TRAIN_CORPUS_Y = -175;
export const TRAIN_CORPUS_W = 1320;
export const TRAIN_CORPUS_H = 240;
export const TRAIN_PAD = 36;
export const TRAIN_TEXT_LEFT = -(TRAIN_CORPUS_W / 2) + TRAIN_PAD;
export const TRAIN_TEXT_SIZE = 26;
export const TRAIN_LINE_H = 36;

/**
 * Líneas largas para llenar el ancho (~1600px útiles).
 * La frase objetivo va DENTRO de la línea 1 (texto único).
 */
export const TRAIN_LINES = [
  'Era una mañana clara en el pueblo. Los pájaros cantaban en el parque cerca del río, y el aire',
  'olía a tierra mojada. En una página del diario decía: El cielo es de color azul. Después los niños',
  'miraban las nubes pasar sin prisa, mientras el viento movía los árboles junto al lago. Nadie',
  'quería volver a casa todavía aquella mañana de primavera.',
] as const;

export const TRAIN_PHRASE_LINE = 1;
export const TRAIN_LINE_BEFORE_PHRASE =
  'olía a tierra mojada. En una página del diario decía: ';

/** ~12.2px/char a 26px Space Grotesk; BEFORE un poco menos (arranca en la E). */
export const TRAIN_BEFORE_W =
  Math.round(TRAIN_LINE_BEFORE_PHRASE.length * 12.2) - 16;
export const TRAIN_HIGHLIGHT_W = Math.round(TRAIN_SENTENCE.length * 12.0);
export const TRAIN_HIGHLIGHT_H = 34;

export const TRAIN_FIRST_LINE_Y = -48;
export const TRAIN_PHRASE_LINE_Y =
  TRAIN_FIRST_LINE_Y + TRAIN_PHRASE_LINE * TRAIN_LINE_H;
export const TRAIN_PHRASE_LEFT = TRAIN_TEXT_LEFT + TRAIN_BEFORE_W;
export const TRAIN_SOURCE_Y = TRAIN_CORPUS_Y + TRAIN_PHRASE_LINE_Y;
export const TRAIN_PHRASE_CENTER_X = TRAIN_PHRASE_LEFT + TRAIN_HIGHLIGHT_W / 2;

export function trainTokenX(index: number): number {
  const n = TRAIN_TOKENS.length;
  const total = n * TRAIN_TOKEN_W + (n - 1) * TRAIN_TOKEN_GAP;
  const start = -total / 2 + TRAIN_TOKEN_W / 2;
  return start + index * (TRAIN_TOKEN_W + TRAIN_TOKEN_GAP);
}

export function trainSourceX(index: number): number {
  const n = TRAIN_TOKENS.length;
  const w = 48;
  const gap = 4;
  const total = n * w + (n - 1) * gap;
  const start = TRAIN_PHRASE_CENTER_X - total / 2 + w / 2;
  return start + index * (w + gap);
}

type TrainingDemoProps = {
  titleRef: Reference<Txt>;
  corpusRef: Reference<Layout>;
  highlightRef: Reference<Rect>;
  lineRefs: Reference<Txt>[];
  tokenRefs: Reference<Layout>[];
  tokenFillRefs: Reference<Rect>[];
  tokenTxtRefs: Reference<Txt>[];
  /** Clones que vuelan al modelo; los tokens reales se quedan. */
  cloneRefs: Reference<Layout>[];
  cloneFillRefs: Reference<Rect>[];
  cloneTxtRefs: Reference<Txt>[];
  blankRef: Reference<Layout>;
  modelRef: Reference<Layout>;
  paramRefs: Reference<Txt>[];
  predictRef: Reference<Layout>;
  predictFillRef: Reference<Rect>;
  predictTxtRef: Reference<Txt>;
  targetRef: Reference<Txt>;
  statusRef: Reference<Txt>;
  punchRef: Reference<Txt>;
};

/**
 * Entrenamiento ventana a ventana: corpus → highlight → tokens salen del texto →
 * predicción desde el modelo → compara → ajusta → siguiente ventana.
 */
export function TrainingDemo({
  titleRef,
  corpusRef,
  highlightRef,
  lineRefs,
  tokenRefs,
  tokenFillRefs,
  tokenTxtRefs,
  cloneRefs,
  cloneFillRefs,
  cloneTxtRefs,
  blankRef,
  modelRef,
  paramRefs,
  predictRef,
  predictFillRef,
  predictTxtRef,
  targetRef,
  statusRef,
  punchRef,
}: TrainingDemoProps) {
  return (
    <Layout layout={false} width={'100%'} height={'100%'}>
      <Txt
        ref={titleRef}
        text="Entrenamiento: ventana a ventana"
        fontFamily={theme.pixelFont}
        fontSize={44}
        fill={theme.black}
        textAlign="center"
        width={1600}
        x={0}
        y={TRAIN_TITLE_Y}
      />

      {/* Corpus: párrafo ancho; highlight = solo Rect detrás */}
      <Layout ref={corpusRef} layout={false} x={0} y={TRAIN_CORPUS_Y} opacity={0}>
        <Rect
          width={TRAIN_CORPUS_W}
          height={TRAIN_CORPUS_H}
          fill={theme.black}
          x={6}
          y={6}
        />
        <Rect
          width={TRAIN_CORPUS_W}
          height={TRAIN_CORPUS_H}
          fill={theme.white}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          text="DATOS (fragmento de un libro)"
          fontFamily={theme.pixelFont}
          fontSize={22}
          fill={theme.grey}
          offsetX={-1}
          x={TRAIN_TEXT_LEFT}
          y={-(TRAIN_CORPUS_H / 2) + 28}
        />

        <Rect
          ref={highlightRef}
          width={0}
          height={TRAIN_HIGHLIGHT_H}
          fill={theme.cyan}
          offsetX={-1}
          x={TRAIN_PHRASE_LEFT}
          y={TRAIN_PHRASE_LINE_Y}
          opacity={0.85}
          radius={4}
        />

        {TRAIN_LINES.map((line, i) => (
          <Txt
            key={`line-${i}`}
            ref={lineRefs[i]}
            text={line}
            fontFamily={theme.bodyFont}
            fontSize={TRAIN_TEXT_SIZE}
            fontWeight={500}
            fill={theme.black}
            offsetX={-1}
            x={TRAIN_TEXT_LEFT}
            y={TRAIN_FIRST_LINE_Y + i * TRAIN_LINE_H}
          />
        ))}
      </Layout>

      {/* Tokens: nacen sobre el highlight y vuelan a la fila */}
      {TRAIN_TOKENS.map((word, i) => (
        <Layout
          key={`tok-${i}`}
          ref={tokenRefs[i]}
          layout={false}
          x={trainSourceX(i)}
          y={TRAIN_SOURCE_Y}
          opacity={0}
          scale={0.55}
        >
          <Rect
            width={TRAIN_TOKEN_W}
            height={TRAIN_TOKEN_H}
            fill={theme.black}
            x={4}
            y={4}
          />
          <Rect
            ref={tokenFillRefs[i]}
            width={TRAIN_TOKEN_W}
            height={TRAIN_TOKEN_H}
            fill={theme.white}
            stroke={theme.black}
            lineWidth={theme.border}
          />
          <Txt
            ref={tokenTxtRefs[i]}
            text={word}
            fontFamily={theme.bodyFont}
            fontSize={26}
            fontWeight={700}
            fill={theme.black}
          />
        </Layout>
      ))}

      {/* Clones: copia visual que entra al modelo; los tokens reales no se mueven */}
      {TRAIN_TOKENS.map((word, i) => (
        <Layout
          key={`clone-${i}`}
          ref={cloneRefs[i]}
          layout={false}
          x={trainTokenX(i)}
          y={TRAIN_TOKEN_Y}
          opacity={0}
          scale={1}
          zIndex={20}
        >
          <Rect
            width={TRAIN_TOKEN_W}
            height={TRAIN_TOKEN_H}
            fill={theme.black}
            x={4}
            y={4}
          />
          <Rect
            ref={cloneFillRefs[i]}
            width={TRAIN_TOKEN_W}
            height={TRAIN_TOKEN_H}
            fill={theme.white}
            stroke={theme.black}
            lineWidth={theme.border}
          />
          <Txt
            ref={cloneTxtRefs[i]}
            text={word}
            fontFamily={theme.bodyFont}
            fontSize={26}
            fontWeight={700}
            fill={theme.black}
          />
        </Layout>
      ))}

      {/* Casilla ? */}
      <Layout
        ref={blankRef}
        layout={false}
        x={trainTokenX(1)}
        y={TRAIN_TOKEN_Y}
        opacity={0}
        scale={0.85}
      >
        <Rect
          width={TRAIN_TOKEN_W}
          height={TRAIN_TOKEN_H}
          fill={theme.black}
          x={4}
          y={4}
        />
        <Rect
          width={TRAIN_TOKEN_W}
          height={TRAIN_TOKEN_H}
          fill={theme.yellow}
          stroke={theme.black}
          lineWidth={theme.border}
          lineDash={[10, 8]}
        />
        <Txt
          text="?"
          fontFamily={theme.pixelFont}
          fontSize={42}
          fill={theme.grey}
        />
      </Layout>

      {/* Modelo */}
      <Layout
        ref={modelRef}
        layout={false}
        x={TRAIN_MODEL_X}
        y={TRAIN_MODEL_Y}
        opacity={0}
        scale={0.9}
      >
        <Rect width={480} height={140} fill={theme.black} x={6} y={6} />
        <Rect
          width={480}
          height={140}
          fill={theme.black}
          stroke={theme.cyan}
          lineWidth={5}
        />
        <Txt
          text="MODELO"
          fontFamily={theme.pixelFont}
          fontSize={30}
          fill={theme.cyan}
          y={-38}
        />
        <Txt
          text="parámetros (pesos)"
          fontFamily={theme.bodyFont}
          fontSize={16}
          fill={theme.grey}
          y={-8}
        />
        <Layout layout={false} y={28}>
          {['0.42', '-1.7', '0.08', '2.3'].map((n, i) => (
            <Txt
              key={`p-${i}`}
              ref={paramRefs[i]}
              text={n}
              fontFamily={theme.bodyFont}
              fontSize={24}
              fontWeight={700}
              fill={theme.white}
              x={-140 + i * 95}
            />
          ))}
        </Layout>
      </Layout>

      {/* Predicción: siempre spawnea debajo del modelo */}
      <Layout
        ref={predictRef}
        layout={false}
        x={TRAIN_MODEL_X}
        y={TRAIN_SPAWN_Y}
        opacity={0}
        scale={0.55}
      >
        <Rect
          width={TRAIN_TOKEN_W}
          height={TRAIN_TOKEN_H}
          fill={theme.black}
          x={4}
          y={4}
        />
        <Rect
          ref={predictFillRef}
          width={TRAIN_TOKEN_W}
          height={TRAIN_TOKEN_H}
          fill={theme.magenta}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          ref={predictTxtRef}
          text="?"
          fontFamily={theme.bodyFont}
          fontSize={26}
          fontWeight={700}
          fill={theme.black}
        />
      </Layout>

      <Txt
        ref={targetRef}
        text=""
        fontFamily={theme.bodyFont}
        fontSize={20}
        fontWeight={700}
        fill={theme.black}
        x={0}
        y={TRAIN_TOKEN_Y + 55}
        opacity={0}
      />

      <Txt
        ref={statusRef}
        text=""
        fontFamily={theme.pixelFont}
        fontSize={26}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={340}
        opacity={0}
      />

      <Txt
        ref={punchRef}
        text="Una pasada → ajusta un poco → siguiente ventana. Billones de veces."
        fontFamily={theme.pixelFont}
        fontSize={28}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={340}
        opacity={0}
      />
    </Layout>
  );
}
