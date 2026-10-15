import {Layout, Line, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {
  MAGIC_IN_X,
  MAGIC_MACHINE_X,
  MAGIC_OUT_X,
  MAGIC_ROW_Y,
} from './AiBehindTheScenes';
import {RECOMMEND_SLIDE_H} from './AiUseRecommendationsSlides';
import {theme} from '../theme';

const TITLE_Y = -360;

export const TRANSLATE_PHRASE_W = 448;
export const TRANSLATE_PHRASE_H = 120;
const PHRASE_PAD = 28;
const PHRASE_BODY_W = TRANSLATE_PHRASE_W - PHRASE_PAD * 2;
const PHRASE_BODY_X = -TRANSLATE_PHRASE_W / 2 + PHRASE_PAD;

const processorW = 280;
const processorH = 200;

const TRANSLATE_OUTPUT_W = 448;
const TRANSLATE_OUTPUT_H = 120;
const TRANSLATE_OUTPUT_PAD = 28;
const TRANSLATE_OUTPUT_TEXT_W = TRANSLATE_OUTPUT_W - TRANSLATE_OUTPUT_PAD * 2;
const TRANSLATE_OUTPUT_TEXT_X = -TRANSLATE_OUTPUT_W / 2 + TRANSLATE_OUTPUT_PAD;

export type PhraseTranslationDemoProps = {
  phraseDockRef: Reference<Layout>;
  phraseFlyRef: Reference<Layout>;
  arrowInRef: Reference<Line>;
  arrowOutRef: Reference<Line>;
  traductorRef: Reference<Layout>;
  opusModelRef: Reference<Layout>;
  googleTranslateRef: Reference<Layout>;
  geminiModelRef: Reference<Layout>;
  almaModelRef: Reference<Layout>;
  outputRef: Reference<Layout>;
  outputTextRef: Reference<Txt>;
  outputTextLine2Ref: Reference<Txt>;
  outputLabelRef: Reference<Txt>;
};

function ProcessorBox({
  line1,
  line2,
  subtitle,
  detail,
  accentFill,
}: {
  line1: string;
  line2?: string;
  subtitle: string;
  detail: string;
  accentFill: string;
}) {
  return (
    <>
      <Rect width={processorW} height={processorH} fill={theme.black} x={5} y={5} />
      <Rect
        width={processorW}
        height={processorH}
        fill={accentFill}
        stroke={theme.black}
        lineWidth={theme.border}
        opacity={0.35}
      />
      <Rect
        width={processorW}
        height={processorH}
        fill={theme.white}
        stroke={theme.black}
        lineWidth={theme.border}
      />
      <Txt
        text={line1}
        fontFamily={theme.pixelFont}
        fontSize={line2 ? 26 : 30}
        fill={theme.black}
        y={line2 ? -44 : -28}
      />
      {line2 ? (
        <Txt
          text={line2}
          fontFamily={theme.pixelFont}
          fontSize={22}
          fill={theme.black}
          y={-16}
        />
      ) : null}
      <Txt
        text={subtitle}
        fontFamily={theme.bodyFont}
        fontSize={15}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        width={processorW - 32}
        lineHeight={20}
        y={line2 ? 18 : 10}
      />
      <Txt
        text={detail}
        fontFamily={theme.bodyFont}
        fontSize={13}
        fontWeight={600}
        fill={theme.pie[0]}
        textAlign="center"
        width={processorW - 24}
        y={line2 ? 50 : 42}
      />
    </>
  );
}

function PhraseSourceCard() {
  const w = TRANSLATE_PHRASE_W;
  const h = TRANSLATE_PHRASE_H;
  return (
    <>
      <Rect width={w} height={h} fill={theme.black} x={5} y={5} />
      <Rect width={w} height={h} fill={theme.white} stroke={theme.black} lineWidth={theme.border} />
      <Txt
        text="Texto · español"
        fontFamily={theme.pixelFont}
        fontSize={18}
        fill={theme.grey}
        textAlign="left"
        offsetX={-1}
        x={PHRASE_BODY_X}
        y={-h / 2 + 28}
      />
      <Txt
        text="Por favor envíen el informe consolidado"
        fontFamily={theme.bodyFont}
        fontSize={16}
        fontWeight={600}
        fill={theme.black}
        textAlign="left"
        offsetX={-1}
        width={PHRASE_BODY_W}
        lineHeight={22}
        x={PHRASE_BODY_X}
        y={-8}
      />
      <Txt
        text="antes del viernes."
        fontFamily={theme.bodyFont}
        fontSize={16}
        fontWeight={600}
        fill={theme.black}
        textAlign="left"
        offsetX={-1}
        width={PHRASE_BODY_W}
        lineHeight={22}
        x={PHRASE_BODY_X}
        y={28}
      />
    </>
  );
}

/** Traducir texto: traductor genérico → ejemplos de herramientas. */
export function PhraseTranslationDemo({
  phraseDockRef,
  phraseFlyRef,
  arrowInRef,
  arrowOutRef,
  traductorRef,
  opusModelRef,
  googleTranslateRef,
  geminiModelRef,
  almaModelRef,
  outputRef,
  outputTextRef,
  outputTextLine2Ref,
  outputLabelRef,
}: PhraseTranslationDemoProps) {
  return (
    <Layout layout={false} width={1680} height={RECOMMEND_SLIDE_H}>
      <Txt
        text="Traducir un texto"
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
        ref={phraseDockRef}
        layout={false}
        x={MAGIC_IN_X}
        y={MAGIC_ROW_Y}
        opacity={0}
        scale={0.9}
      >
        <PhraseSourceCard />
      </Layout>

      <Line
        ref={arrowInRef}
        points={[
          [MAGIC_IN_X + TRANSLATE_PHRASE_W / 2 + 16, MAGIC_ROW_Y],
          [MAGIC_MACHINE_X - processorW / 2 - 24, MAGIC_ROW_Y],
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
        ref={traductorRef}
        layout={false}
        x={MAGIC_MACHINE_X}
        y={MAGIC_ROW_Y}
        opacity={0}
        scale={0.85}
      >
        <ProcessorBox
          line1="Traductor"
          subtitle="Convierte texto"
          detail="ES → EN (sin marca aún)"
          accentFill={theme.yellow}
        />
      </Layout>

      <Layout
        ref={opusModelRef}
        layout={false}
        x={MAGIC_MACHINE_X}
        y={MAGIC_ROW_Y}
        opacity={0}
        scale={0.85}
      >
        <ProcessorBox
          line1="Opus 5.5"
          subtitle="LLM · traduce también"
          detail="mal ejemplo · costoso"
          accentFill={theme.magenta}
        />
      </Layout>

      <Layout
        ref={googleTranslateRef}
        layout={false}
        x={MAGIC_MACHINE_X}
        y={MAGIC_ROW_Y}
        opacity={0}
        scale={0.85}
      >
        <ProcessorBox
          line1="Google"
          line2="Translate"
          subtitle="Motor de traducción"
          detail="hecho para traducir"
          accentFill={theme.pie[3]}
        />
      </Layout>

      <Layout
        ref={geminiModelRef}
        layout={false}
        x={MAGIC_MACHINE_X}
        y={MAGIC_ROW_Y}
        opacity={0}
        scale={0.85}
      >
        <ProcessorBox
          line1="Gemini 3.5"
          line2="Flash"
          subtitle="LLM · traduce también"
          detail="tokens · más ligero que Opus"
          accentFill={theme.cyan}
        />
      </Layout>

      <Layout
        ref={almaModelRef}
        layout={false}
        x={MAGIC_MACHINE_X}
        y={MAGIC_ROW_Y}
        opacity={0}
        scale={0.85}
      >
        <ProcessorBox
          line1="ALMA"
          subtitle="Modelo open (Meta)"
          detail="traducción · self-host posible"
          accentFill={theme.pie[1]}
        />
      </Layout>

      <Line
        ref={arrowOutRef}
        points={[
          [MAGIC_MACHINE_X + processorW / 2 + 24, MAGIC_ROW_Y],
          [MAGIC_OUT_X - TRANSLATE_OUTPUT_W / 2 - 16, MAGIC_ROW_Y],
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
        ref={phraseFlyRef}
        layout={false}
        x={MAGIC_IN_X}
        y={MAGIC_ROW_Y}
        opacity={0}
        scale={0.55}
        zIndex={30}
      >
        <PhraseSourceCard />
      </Layout>

      <Layout
        ref={outputRef}
        layout={false}
        x={MAGIC_OUT_X}
        y={MAGIC_ROW_Y}
        opacity={0}
        scale={0.9}
      >
        <Rect
          width={TRANSLATE_OUTPUT_W}
          height={TRANSLATE_OUTPUT_H}
          fill={theme.black}
          x={theme.shadow}
          y={theme.shadow}
        />
        <Rect
          width={TRANSLATE_OUTPUT_W}
          height={TRANSLATE_OUTPUT_H}
          fill={theme.cyan}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          ref={outputLabelRef}
          text="Traducción · inglés"
          fontFamily={theme.pixelFont}
          fontSize={18}
          fill={theme.grey}
          textAlign="left"
          offsetX={-1}
          x={TRANSLATE_OUTPUT_TEXT_X}
          y={-TRANSLATE_OUTPUT_H / 2 + 28}
        />
        <Txt
          ref={outputTextRef}
          text="Please send the consolidated report"
          fontFamily={theme.bodyFont}
          fontSize={16}
          fontWeight={600}
          fill={theme.black}
          textAlign="left"
          offsetX={-1}
          width={TRANSLATE_OUTPUT_TEXT_W}
          lineHeight={22}
          x={TRANSLATE_OUTPUT_TEXT_X}
          y={-8}
        />
        <Txt
          ref={outputTextLine2Ref}
          text="before Friday."
          fontFamily={theme.bodyFont}
          fontSize={16}
          fontWeight={600}
          fill={theme.black}
          textAlign="left"
          offsetX={-1}
          width={TRANSLATE_OUTPUT_TEXT_W}
          lineHeight={22}
          x={TRANSLATE_OUTPUT_TEXT_X}
          y={28}
        />
      </Layout>
    </Layout>
  );
}
