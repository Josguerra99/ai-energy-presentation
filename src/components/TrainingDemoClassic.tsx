import {Layout, Line, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {theme} from '../theme';

/** Copia del demo anterior (una predicción → error → acierto). Para editar después. */
export const CLASSIC_TRAIN_CONTEXT = ['El', 'cielo', 'es', 'de', 'color'] as const;
export const CLASSIC_TRAIN_TARGET = 'azul';
export const CLASSIC_TRAIN_WRONG = 'rojo';

export const CLASSIC_TOKEN_W = 148;
export const CLASSIC_TOKEN_H = 80;
export const CLASSIC_TOKEN_GAP = 16;
export const CLASSIC_TOKEN_Y = -60;
export const CLASSIC_MODEL_X = 0;
export const CLASSIC_MODEL_Y = 120;
export const CLASSIC_SPAWN_Y = CLASSIC_MODEL_Y + 130;
export const CLASSIC_BLANK_X =
  -((CLASSIC_TRAIN_CONTEXT.length + 1) * (CLASSIC_TOKEN_W + CLASSIC_TOKEN_GAP) -
      CLASSIC_TOKEN_GAP) /
    2 +
  CLASSIC_TOKEN_W / 2 +
  CLASSIC_TRAIN_CONTEXT.length * (CLASSIC_TOKEN_W + CLASSIC_TOKEN_GAP);

type TrainingDemoClassicProps = {
  titleRef: Reference<Txt>;
  subtitleRef: Reference<Txt>;
  contextRefs: Reference<Layout>[];
  blankRef: Reference<Layout>;
  arrowInRef: Reference<Line>;
  modelRef: Reference<Layout>;
  paramRefs: Reference<Txt>[];
  predictWrongRef: Reference<Layout>;
  predictRightRef: Reference<Layout>;
  targetRef: Reference<Layout>;
  errorRef: Reference<Txt>;
  adjustRef: Reference<Txt>;
  punchRef: Reference<Txt>;
};

function PredictChip({
  chipRef,
  word,
  fill,
}: {
  chipRef: Reference<Layout>;
  word: string;
  fill: string;
}) {
  return (
    <Layout
      ref={chipRef}
      layout={false}
      x={CLASSIC_MODEL_X}
      y={CLASSIC_SPAWN_Y}
      opacity={0}
      scale={0.6}
    >
      <Rect
        width={CLASSIC_TOKEN_W}
        height={CLASSIC_TOKEN_H}
        fill={theme.black}
        x={4}
        y={4}
      />
      <Rect
        width={CLASSIC_TOKEN_W}
        height={CLASSIC_TOKEN_H}
        fill={fill}
        stroke={theme.black}
        lineWidth={theme.border}
      />
      <Txt
        text={word}
        fontFamily={theme.bodyFont}
        fontSize={28}
        fontWeight={700}
        fill={theme.black}
      />
    </Layout>
  );
}

/**
 * Demo clásico (copia): contexto → predicción mala → error → ajuste → acierto.
 */
export function TrainingDemoClassic({
  titleRef,
  subtitleRef,
  contextRefs,
  blankRef,
  arrowInRef,
  modelRef,
  paramRefs,
  predictWrongRef,
  predictRightRef,
  targetRef,
  errorRef,
  adjustRef,
  punchRef,
}: TrainingDemoClassicProps) {
  const tokenW = CLASSIC_TOKEN_W;
  const tokenH = CLASSIC_TOKEN_H;
  const tokenGap = CLASSIC_TOKEN_GAP;
  const tokenY = CLASSIC_TOKEN_Y;
  const ctxStart =
    -((CLASSIC_TRAIN_CONTEXT.length + 1) * (tokenW + tokenGap) - tokenGap) / 2 +
    tokenW / 2;
  const blankX = CLASSIC_BLANK_X;

  return (
    <Layout layout={false} width={'100%'} height={'100%'}>
      <Txt
        ref={titleRef}
        text="Entrenamiento (versión toy)"
        fontFamily={theme.pixelFont}
        fontSize={56}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-380}
      />
      <Txt
        ref={subtitleRef}
        text="El modelo ve tokens y trata de adivinar el siguiente"
        fontFamily={theme.bodyFont}
        fontSize={28}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-310}
        opacity={0}
      />

      {CLASSIC_TRAIN_CONTEXT.map((word, i) => {
        const x = ctxStart + i * (tokenW + tokenGap);
        return (
          <Layout
            key={`tok-${word}`}
            ref={contextRefs[i]}
            layout={false}
            x={x}
            y={tokenY}
            opacity={0}
            scale={0.85}
          >
            <Rect width={tokenW} height={tokenH} fill={theme.black} x={4} y={4} />
            <Rect
              width={tokenW}
              height={tokenH}
              fill={theme.white}
              stroke={theme.black}
              lineWidth={theme.border}
            />
            <Txt
              text={word}
              fontFamily={theme.bodyFont}
              fontSize={28}
              fontWeight={700}
              fill={theme.black}
            />
          </Layout>
        );
      })}

      <Layout
        ref={blankRef}
        layout={false}
        x={blankX}
        y={tokenY}
        opacity={0}
        scale={0.85}
      >
        <Rect width={tokenW} height={tokenH} fill={theme.black} x={4} y={4} />
        <Rect
          width={tokenW}
          height={tokenH}
          fill={theme.yellow}
          stroke={theme.black}
          lineWidth={theme.border}
          lineDash={[10, 8]}
        />
        <Txt
          text="?"
          fontFamily={theme.pixelFont}
          fontSize={48}
          fill={theme.grey}
        />
      </Layout>

      <Line
        ref={arrowInRef}
        points={[
          [0, tokenY + 70],
          [0, 40],
        ]}
        stroke={theme.black}
        lineWidth={4}
        endArrow
        arrowSize={14}
        opacity={0}
      />

      <Layout
        ref={modelRef}
        layout={false}
        x={CLASSIC_MODEL_X}
        y={CLASSIC_MODEL_Y}
        opacity={0}
        scale={0.9}
      >
        <Rect width={520} height={200} fill={theme.black} x={6} y={6} />
        <Rect
          width={520}
          height={200}
          fill={theme.black}
          stroke={theme.cyan}
          lineWidth={5}
        />
        <Txt
          text="MODELO"
          fontFamily={theme.pixelFont}
          fontSize={36}
          fill={theme.cyan}
          y={-60}
        />
        <Txt
          text="parámetros (pesos)"
          fontFamily={theme.bodyFont}
          fontSize={20}
          fill={theme.grey}
          y={-22}
        />
        <Layout layout={false} y={40}>
          {['0.42', '-1.7', '0.08', '2.3'].map((n, i) => (
            <Txt
              key={`p-${i}`}
              ref={paramRefs[i]}
              text={n}
              fontFamily={theme.bodyFont}
              fontSize={28}
              fontWeight={700}
              fill={theme.white}
              x={-150 + i * 100}
            />
          ))}
        </Layout>
      </Layout>

      <PredictChip
        chipRef={predictWrongRef}
        word={CLASSIC_TRAIN_WRONG}
        fill={theme.magenta}
      />
      <PredictChip
        chipRef={predictRightRef}
        word={CLASSIC_TRAIN_TARGET}
        fill={theme.cyan}
      />

      <Layout
        ref={targetRef}
        layout={false}
        x={blankX}
        y={tokenY + 95}
        opacity={0}
        scale={0.85}
      >
        <Txt
          text={`en el texto: ${CLASSIC_TRAIN_TARGET}`}
          fontFamily={theme.bodyFont}
          fontSize={22}
          fontWeight={700}
          fill={theme.black}
        />
      </Layout>

      <Txt
        ref={errorRef}
        text="✗ error → backpropagation"
        fontFamily={theme.pixelFont}
        fontSize={30}
        fill={theme.magenta}
        x={0}
        y={340}
        opacity={0}
      />
      <Txt
        ref={adjustRef}
        text="se ajustan los parámetros"
        fontFamily={theme.bodyFont}
        fontSize={24}
        fill={theme.black}
        x={0}
        y={375}
        opacity={0}
      />
      <Txt
        ref={punchRef}
        text="Repite esto billones de veces → nace el modelo"
        fontFamily={theme.pixelFont}
        fontSize={32}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={340}
        opacity={0}
      />
    </Layout>
  );
}
