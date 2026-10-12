import {Layout, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {theme} from '../theme';

/** Prompt inicial. */
export const INF_SEED = ['Un', 'LLM', 'es'] as const;

/**
 * Continuación token a token (inferencia / next-token).
 * Frase completa: “Un LLM es un modelo de inteligencia artificial…”
 */
export const INF_GEN = [
  'un',
  'modelo',
  'de',
  'inteligencia',
  'artificial',
  'entrenado',
  'con',
  'grandes',
  'cantidades',
  'de',
  'texto',
  'y',
  'otros',
  'datos',
  'para',
  'aprender',
  'patrones',
  'del',
  'lenguaje',
  'y',
  'generar',
  'o',
  'interpretar',
  'contenido.',
] as const;

export const INF_SEED_TEXT = INF_SEED.join(' ');
export const INF_ALL_TOKENS = [...INF_SEED, ...INF_GEN] as const;
export const INF_TOKEN_COUNT = INF_ALL_TOKENS.length;

export const INF_CELL_W = 132;
export const INF_CELL_H = 54;
export const INF_CELL_GAP = 10;
export const INF_COLS = 10;
export const INF_CLONE_MAX = 12;

export const INF_TOKEN_W = INF_CELL_W;
export const INF_TOKEN_H = INF_CELL_H;
export const INF_MODEL_X = 0;
export const INF_MODEL_Y = 230;
export const INF_SPAWN_Y = INF_MODEL_Y + 95;
export const INF_PHRASE_Y = -180;
export const INF_INPUT_Y = 55;
export const INF_INPUT_W = 1100;
export const INF_INPUT_H = 88;
export const INF_SEND_W = 160;
export const INF_SEND_H = 88;
export const INF_COMPOSER_GAP = 20;
const INF_COMPOSER_W = INF_INPUT_W + INF_COMPOSER_GAP + INF_SEND_W;
export const INF_INPUT_X = -INF_COMPOSER_W / 2 + INF_INPUT_W / 2;
export const INF_SEND_X = INF_COMPOSER_W / 2 - INF_SEND_W / 2;
export const INF_CHAR_W = 17;

/** Pesos finales (ya entrenados). */
export const INF_FINAL_WEIGHTS = ['0.61', '-0.9', '0.33', '1.8'] as const;

/** Posición absoluta de la celda i. */
export function infCellAbs(i: number): {x: number; y: number} {
  const col = i % INF_COLS;
  const row = Math.floor(i / INF_COLS);
  const rowW = INF_COLS * (INF_CELL_W + INF_CELL_GAP) - INF_CELL_GAP;
  const rows = Math.ceil(INF_TOKEN_COUNT / INF_COLS);
  const stackH = rows * (INF_CELL_H + INF_CELL_GAP) - INF_CELL_GAP;
  return {
    x: -rowW / 2 + INF_CELL_W / 2 + col * (INF_CELL_W + INF_CELL_GAP),
    y:
      INF_PHRASE_Y -
      stackH / 2 +
      INF_CELL_H / 2 +
      row * (INF_CELL_H + INF_CELL_GAP),
  };
}

type InferenceDemoProps = {
  titleRef: Reference<Txt>;
  inputBarRef: Reference<Layout>;
  typedRef: Reference<Txt>;
  typeCursorRef: Reference<Rect>;
  sendBtnRef: Reference<Layout>;
  sendFillRef: Reference<Rect>;
  tokenRefs: Reference<Layout>[];
  tokenFillRefs: Reference<Rect>[];
  tokenTxtRefs: Reference<Txt>[];
  cloneRefs: Reference<Layout>[];
  cloneFillRefs: Reference<Rect>[];
  cloneTxtRefs: Reference<Txt>[];
  modelRef: Reference<Layout>;
  paramRefs: Reference<Txt>[];
  predictRef: Reference<Layout>;
  predictFillRef: Reference<Rect>;
  predictTxtRef: Reference<Txt>;
  statusRef: Reference<Txt>;
  punchRef: Reference<Txt>;
};

/**
 * Inferencia: escribe → envía → tokens como celdas → contexto entra → sale token.
 */
export function InferenceDemo({
  titleRef,
  inputBarRef,
  typedRef,
  typeCursorRef,
  sendBtnRef,
  sendFillRef,
  tokenRefs,
  tokenFillRefs,
  tokenTxtRefs,
  cloneRefs,
  cloneFillRefs,
  cloneTxtRefs,
  modelRef,
  paramRefs,
  predictRef,
  predictFillRef,
  predictTxtRef,
  statusRef,
  punchRef,
}: InferenceDemoProps) {
  return (
    <Layout layout={false} width={'100%'} height={'100%'}>
      <Txt
        ref={titleRef}
        text="Inferencia: detrás de un prompt"
        fontFamily={theme.pixelFont}
        fontSize={56}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-380}
      />

      {/* Tokens sueltos (sin contenedor) */}
      {INF_ALL_TOKENS.map((word, i) => {
        const {x, y} = infCellAbs(i);
        return (
          <Layout
            key={`inf-tok-${i}`}
            ref={tokenRefs[i]}
            layout={false}
            x={x}
            y={y}
            opacity={0}
            scale={0.85}
          >
            <Rect
              width={INF_CELL_W}
              height={INF_CELL_H}
              fill={theme.black}
              x={3}
              y={3}
            />
            <Rect
              ref={tokenFillRefs[i]}
              width={INF_CELL_W}
              height={INF_CELL_H}
              fill={theme.white}
              stroke={theme.black}
              lineWidth={theme.border}
            />
            <Txt
              ref={tokenTxtRefs[i]}
              text={word}
              fontFamily={theme.bodyFont}
              fontSize={word.length > 12 ? 18 : 22}
              fontWeight={700}
              fill={theme.black}
            />
          </Layout>
        );
      })}

      {/* Clones para animar entrada al modelo */}
      {Array.from({length: INF_CLONE_MAX}, (_, i) => (
        <Layout
          key={`inf-clone-${i}`}
          ref={cloneRefs[i]}
          layout={false}
          x={0}
          y={0}
          opacity={0}
          scale={1}
          zIndex={25}
        >
          <Rect
            width={INF_CELL_W}
            height={INF_CELL_H}
            fill={theme.black}
            x={3}
            y={3}
          />
          <Rect
            ref={cloneFillRefs[i]}
            width={INF_CELL_W}
            height={INF_CELL_H}
            fill={theme.white}
            stroke={theme.black}
            lineWidth={theme.border}
          />
          <Txt
            ref={cloneTxtRefs[i]}
            text=""
            fontFamily={theme.bodyFont}
            fontSize={18}
            fontWeight={700}
            fill={theme.black}
          />
        </Layout>
      ))}

      {/* Input: el usuario escribe aquí */}
      <Layout
        ref={inputBarRef}
        layout={false}
        x={INF_INPUT_X}
        y={INF_INPUT_Y}
        opacity={0}
        scale={0.95}
      >
        <Rect
          width={INF_INPUT_W}
          height={INF_INPUT_H}
          fill={theme.black}
          x={4}
          y={4}
        />
        <Rect
          width={INF_INPUT_W}
          height={INF_INPUT_H}
          fill={theme.white}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          text="PROMPT"
          fontFamily={theme.pixelFont}
          fontSize={18}
          fill={theme.grey}
          offsetX={-1}
          x={-INF_INPUT_W / 2 + 24}
          y={-INF_INPUT_H / 2 + 22}
        />
        <Txt
          ref={typedRef}
          text=""
          fontFamily={theme.bodyFont}
          fontSize={30}
          fontWeight={600}
          fill={theme.black}
          offsetX={-1}
          x={-INF_INPUT_W / 2 + 24}
          y={10}
        />
        <Rect
          ref={typeCursorRef}
          width={3}
          height={30}
          fill={theme.black}
          x={-INF_INPUT_W / 2 + 24}
          y={10}
          opacity={0}
        />
      </Layout>

      {/* Botón Enviar */}
      <Layout
        ref={sendBtnRef}
        layout={false}
        x={INF_SEND_X}
        y={INF_INPUT_Y}
        opacity={0}
        scale={0.95}
      >
        <Rect
          width={INF_SEND_W}
          height={INF_SEND_H}
          fill={theme.black}
          x={4}
          y={4}
        />
        <Rect
          ref={sendFillRef}
          width={INF_SEND_W}
          height={INF_SEND_H}
          fill={theme.cyan}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          text="Enviar"
          fontFamily={theme.bodyFont}
          fontSize={28}
          fontWeight={700}
          fill={theme.black}
        />
      </Layout>

      {/* Modelo con pesos finales */}
      <Layout
        ref={modelRef}
        layout={false}
        x={INF_MODEL_X}
        y={INF_MODEL_Y}
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
          fontSize={28}
          fill={theme.cyan}
          y={-38}
        />
        <Txt
          text="pesos finales (ya entrenados)"
          fontFamily={theme.bodyFont}
          fontSize={15}
          fill={theme.grey}
          y={-10}
        />
        <Layout layout={false} y={28}>
          {INF_FINAL_WEIGHTS.map((n, i) => (
            <Txt
              key={`inf-p-${i}`}
              ref={paramRefs[i]}
              text={n}
              fontFamily={theme.bodyFont}
              fontSize={22}
              fontWeight={700}
              fill={theme.cyan}
              x={-135 + i * 90}
            />
          ))}
        </Layout>
      </Layout>

      {/* Token predicho que aterriza como celda */}
      <Layout
        ref={predictRef}
        layout={false}
        x={INF_MODEL_X}
        y={INF_SPAWN_Y}
        opacity={0}
        scale={0.5}
        zIndex={20}
      >
        <Rect
          width={INF_CELL_W}
          height={INF_CELL_H}
          fill={theme.black}
          x={3}
          y={3}
        />
        <Rect
          ref={predictFillRef}
          width={INF_CELL_W}
          height={INF_CELL_H}
          fill={theme.cyan}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          ref={predictTxtRef}
          text=""
          fontFamily={theme.bodyFont}
          fontSize={22}
          fontWeight={700}
          fill={theme.black}
        />
      </Layout>

      <Txt
        ref={statusRef}
        text=""
        fontFamily={theme.bodyFont}
        fontSize={22}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={370}
        opacity={0}
      />
      <Txt
        ref={punchRef}
        text="Así responde un LLM: un token a la vez"
        fontFamily={theme.pixelFont}
        fontSize={34}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={370}
        opacity={0}
      />
    </Layout>
  );
}
