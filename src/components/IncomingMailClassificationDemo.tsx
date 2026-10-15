import {Layout, Line, Rect, Txt} from '@motion-canvas/2d';
import {ClassificationMessageCard} from './ClassificationMessageCard';
import type {Reference} from '@motion-canvas/core';
import {
  MAGIC_IN_X,
  MAGIC_MACHINE_X,
  MAGIC_ROW_Y,
} from './AiBehindTheScenes';
import {RECOMMEND_SLIDE_H} from './AiUseRecommendationsSlides';
import {theme} from '../theme';

const TITLE_Y = -360;

export const CLASSIFY_ROW_Y = MAGIC_ROW_Y;
export const CLASSIFY_IN_X = MAGIC_IN_X;
export const CLASSIFY_MACHINE_X = MAGIC_MACHINE_X;
export const CLASSIFY_BUCKETS_X = 620;

const programW = 280;
const programH = 200;
const msgW = 420;
const msgH = 128;
const bucketW = 300;
const bucketH = 58;

export const CLASSIFY_BUCKET_COUNT = 4;
export const CLASSIFY_BUCKET_LABELS = ['Spam', 'Social', 'Urgente', 'Otros'] as const;
export const CLASSIFY_URGENT_BUCKET_INDEX = 2;

export function classifyBucketY(index: number): number {
  const gap = 14;
  const totalH = CLASSIFY_BUCKET_COUNT * bucketH + (CLASSIFY_BUCKET_COUNT - 1) * gap;
  const top = CLASSIFY_ROW_Y - totalH / 2 + bucketH / 2;
  return top + index * (bucketH + gap);
}

export type IncomingMailClassificationDemoProps = {
  messageDockRef: Reference<Layout>;
  messageFlyRef: Reference<Layout>;
  arrowInRef: Reference<Line>;
  arrowOutRef: Reference<Line>;
  programRef: Reference<Layout>;
  llmGroupRef: Reference<Layout>;
  classifierGroupRef: Reference<Layout>;
  bucketRefs: Reference<Layout>[];
  bucketFillRefs: Reference<Rect>[];
  bucketLabelRefs: Reference<Txt>[];
};

/** Correo entrante → programa (tipo oculto) → cubeta de clasificación. */
export function IncomingMailClassificationDemo({
  messageDockRef,
  messageFlyRef,
  arrowInRef,
  arrowOutRef,
  programRef,
  llmGroupRef,
  classifierGroupRef,
  bucketRefs,
  bucketFillRefs,
  bucketLabelRefs,
}: IncomingMailClassificationDemoProps) {
  const arrowOutEndX = CLASSIFY_BUCKETS_X - bucketW / 2 - 20;

  return (
    <Layout layout={false} width={1680} height={RECOMMEND_SLIDE_H}>
      <Txt
        text="Clasificar un correo recibido"
        fontFamily={theme.pixelFont}
        fontSize={38}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={TITLE_Y}
        width={1500}
        lineHeight={46}
      />

      <Layout
        ref={messageDockRef}
        layout={false}
        x={CLASSIFY_IN_X}
        y={CLASSIFY_ROW_Y}
        opacity={0}
        scale={0.9}
      >
        <ClassificationMessageCard />
      </Layout>

      <Line
        ref={arrowInRef}
        points={[
          [CLASSIFY_IN_X + msgW / 2 + 16, CLASSIFY_ROW_Y],
          [CLASSIFY_MACHINE_X - programW / 2 - 24, CLASSIFY_ROW_Y],
        ]}
        stroke={theme.black}
        lineWidth={5}
        lineCap="round"
        endArrow
        arrowSize={16}
        end={0}
        opacity={0}
      />

      <Layout
        ref={programRef}
        layout={false}
        x={CLASSIFY_MACHINE_X}
        y={CLASSIFY_ROW_Y}
        opacity={0}
        scale={0.85}
      >
        <Rect width={programW} height={programH} fill={theme.black} x={5} y={5} />
        <Rect
          width={programW}
          height={programH}
          fill={theme.yellow}
          stroke={theme.black}
          lineWidth={theme.border}
          opacity={0.35}
        />
        <Rect
          width={programW}
          height={programH}
          fill={theme.white}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          text="Programa"
          fontFamily={theme.pixelFont}
          fontSize={42}
          fill={theme.black}
          y={-8}
        />
      </Layout>

      <Layout
        ref={llmGroupRef}
        layout={false}
        x={CLASSIFY_MACHINE_X}
        y={CLASSIFY_ROW_Y}
        opacity={0}
        scale={0.85}
      >
        <Rect width={programW} height={programH} fill={theme.black} x={5} y={5} />
        <Rect
          width={programW}
          height={programH}
          fill={theme.magenta}
          stroke={theme.black}
          lineWidth={theme.border}
          opacity={0.35}
        />
        <Rect
          width={programW}
          height={programH}
          fill={theme.white}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          text="LLM"
          fontFamily={theme.pixelFont}
          fontSize={42}
          fill={theme.black}
          y={-36}
        />
        <Txt
          text="¿Spam, social o urgente?"
          fontFamily={theme.bodyFont}
          fontSize={16}
          fontWeight={600}
          fill={theme.black}
          textAlign="center"
          width={programW - 32}
          lineHeight={22}
          y={18}
        />
        <Txt
          text="tokens · latencia · probabilístico"
          fontFamily={theme.bodyFont}
          fontSize={13}
          fontWeight={600}
          fill={theme.grey}
          textAlign="center"
          width={programW - 24}
          y={52}
        />
      </Layout>

      <Layout
        ref={classifierGroupRef}
        layout={false}
        x={CLASSIFY_MACHINE_X}
        y={CLASSIFY_ROW_Y}
        opacity={0}
        scale={0.85}
      >
        <Rect width={programW} height={programH} fill={theme.black} x={5} y={5} />
        <Rect
          width={programW}
          height={programH}
          fill={theme.pie[1]}
          stroke={theme.black}
          lineWidth={theme.border}
          opacity={0.4}
        />
        <Rect
          width={programW}
          height={programH}
          fill={theme.white}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          text="Jev"
          fontFamily={theme.pixelFont}
          fontSize={42}
          fill={theme.black}
          y={-36}
        />
        <Txt
          text="Clasificador entrenado"
          fontFamily={theme.bodyFont}
          fontSize={16}
          fontWeight={600}
          fill={theme.black}
          textAlign="center"
          width={programW - 32}
          lineHeight={22}
          y={12}
        />
        <Txt
          text="spam · social · urgente"
          fontFamily={theme.bodyFont}
          fontSize={13}
          fontWeight={600}
          fill={theme.pie[0]}
          textAlign="center"
          width={programW - 24}
          y={48}
        />
      </Layout>

      <Line
        ref={arrowOutRef}
        points={[
          [CLASSIFY_MACHINE_X + programW / 2 + 24, CLASSIFY_ROW_Y],
          [arrowOutEndX, CLASSIFY_ROW_Y],
        ]}
        stroke={theme.black}
        lineWidth={5}
        lineCap="round"
        endArrow
        arrowSize={16}
        end={0}
        opacity={0}
      />

      <Layout
        ref={messageFlyRef}
        layout={false}
        x={CLASSIFY_IN_X}
        y={CLASSIFY_ROW_Y}
        opacity={0}
        scale={0.55}
        zIndex={30}
      >
        <ClassificationMessageCard />
      </Layout>

      {CLASSIFY_BUCKET_LABELS.map((label, i) => (
        <Layout
          key={label}
          ref={bucketRefs[i]}
          layout={false}
          x={CLASSIFY_BUCKETS_X}
          y={classifyBucketY(i)}
          opacity={0}
          scale={0.92}
        >
          <Rect width={bucketW} height={bucketH} fill={theme.black} x={4} y={4} />
          <Rect
            ref={bucketFillRefs[i]}
            width={bucketW}
            height={bucketH}
            fill={theme.white}
            stroke={theme.black}
            lineWidth={2}
          />
          <Txt
            ref={bucketLabelRefs[i]}
            text={label}
            fontFamily={theme.bodyFont}
            fontSize={20}
            fontWeight={700}
            fill={theme.black}
            textAlign="left"
            offsetX={-1}
            x={-bucketW / 2 + 22}
          />
        </Layout>
      ))}
    </Layout>
  );
}
