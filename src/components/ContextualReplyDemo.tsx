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

export const REPLY_MSG_W = 448;
export const REPLY_MSG_H = 140;
const MSG_PAD = 28;
const MSG_BODY_W = REPLY_MSG_W - MSG_PAD * 2;
const MSG_BODY_X = -REPLY_MSG_W / 2 + MSG_PAD;

const processorW = 280;
const processorH = 200;

export const REPLY_OUT_W = 448;
export const REPLY_OUT_H = 152;
const OUT_PAD = 28;
const OUT_BODY_W = REPLY_OUT_W - OUT_PAD * 2;
const OUT_BODY_X = -REPLY_OUT_W / 2 + OUT_PAD;

export type ContextualReplyDemoProps = {
  messageDockRef: Reference<Layout>;
  messageFlyRef: Reference<Layout>;
  arrowInRef: Reference<Line>;
  arrowOutRef: Reference<Line>;
  programaRef: Reference<Layout>;
  llmRef: Reference<Layout>;
  responseRef: Reference<Layout>;
  responseBadgeRef: Reference<Rect>;
  responseLine1Ref: Reference<Txt>;
  responseLine2Ref: Reference<Txt>;
  responseLine3Ref: Reference<Txt>;
  takeawayRef: Reference<Layout>;
};

function CustomerMessageCard() {
  const w = REPLY_MSG_W;
  const h = REPLY_MSG_H;
  return (
    <>
      <Rect width={w} height={h} fill={theme.black} x={5} y={5} />
      <Rect width={w} height={h} fill={theme.white} stroke={theme.black} lineWidth={theme.border} />
      <Txt
        text="Mensaje · cliente"
        fontFamily={theme.pixelFont}
        fontSize={18}
        fill={theme.grey}
        textAlign="left"
        offsetX={-1}
        x={MSG_BODY_X}
        y={-h / 2 + 28}
      />
      <Txt
        text="Ayer la app me cobró dos veces"
        fontFamily={theme.bodyFont}
        fontSize={16}
        fontWeight={600}
        fill={theme.black}
        textAlign="left"
        offsetX={-1}
        width={MSG_BODY_W}
        lineHeight={22}
        x={MSG_BODY_X}
        y={-14}
      />
      <Txt
        text="la misma factura. Cliente 8842 , "
        fontFamily={theme.bodyFont}
        fontSize={16}
        fontWeight={600}
        fill={theme.black}
        textAlign="left"
        offsetX={-1}
        width={MSG_BODY_W}
        lineHeight={22}
        x={MSG_BODY_X}
        y={8}
      />
      <Txt
        text="¿pueden ayudarme sin llamar?"
        fontFamily={theme.bodyFont}
        fontSize={16}
        fontWeight={600}
        fill={theme.black}
        textAlign="left"
        offsetX={-1}
        width={MSG_BODY_W}
        lineHeight={22}
        x={MSG_BODY_X}
        y={30}
      />
    </>
  );
}

function ProcessorPrograma() {
  return (
    <>
      <Rect width={processorW} height={processorH} fill={theme.black} x={5} y={5} />
      <Rect
        width={processorW}
        height={processorH}
        fill={theme.yellow}
        stroke={theme.black}
        lineWidth={theme.border}
        opacity={0.45}
      />
      <Rect
        width={processorW}
        height={processorH}
        fill={theme.white}
        stroke={theme.black}
        lineWidth={theme.border}
      />
      <Txt text="Programa" fontFamily={theme.pixelFont} fontSize={34} fill={theme.black} y={-44} />
      <Txt
        text="Plantillas + palabras clave"
        fontFamily={theme.bodyFont}
        fontSize={15}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        width={processorW - 32}
        lineHeight={20}
        y={-4}
      />
      <Txt
        text="if factura → enlace FAQ"
        fontFamily={theme.bodyFont}
        fontSize={13}
        fontWeight={700}
        fill={theme.pie[0]}
        textAlign="center"
        width={processorW - 24}
        y={36}
      />
    </>
  );
}

function ProcessorLlm() {
  return (
    <>
      <Rect width={processorW} height={processorH} fill={theme.black} x={5} y={5} />
      <Rect
        width={processorW}
        height={processorH}
        fill={theme.magenta}
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
      <Txt text="LLM" fontFamily={theme.pixelFont} fontSize={42} fill={theme.black} y={-36} />
      <Txt
        text="Entender el caso y redactar"
        fontFamily={theme.bodyFont}
        fontSize={16}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        width={processorW - 32}
        lineHeight={22}
        y={12}
      />
      <Txt
        text="tono · datos · siguiente paso"
        fontFamily={theme.bodyFont}
        fontSize={13}
        fontWeight={600}
        fill={theme.grey}
        textAlign="center"
        width={processorW - 24}
        y={48}
      />
    </>
  );
}

/** Soporte: plantillas no alcanzan; hace falta generar la respuesta. */
export function ContextualReplyDemo({
  messageDockRef,
  messageFlyRef,
  arrowInRef,
  arrowOutRef,
  programaRef,
  llmRef,
  responseRef,
  responseBadgeRef,
  responseLine1Ref,
  responseLine2Ref,
  responseLine3Ref,
  takeawayRef,
}: ContextualReplyDemoProps) {
  return (
    <Layout layout={false} width={1680} height={RECOMMEND_SLIDE_H}>
      <Txt
        text="Redactar la respuesta al cliente"
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
        x={MAGIC_IN_X}
        y={MAGIC_ROW_Y}
        opacity={0}
        scale={0.9}
      >
        <CustomerMessageCard />
      </Layout>

      <Line
        ref={arrowInRef}
        points={[
          [MAGIC_IN_X + REPLY_MSG_W / 2 + 16, MAGIC_ROW_Y],
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
        ref={programaRef}
        layout={false}
        x={MAGIC_MACHINE_X}
        y={MAGIC_ROW_Y}
        opacity={0}
        scale={0.85}
      >
        <ProcessorPrograma />
      </Layout>

      <Layout
        ref={llmRef}
        layout={false}
        x={MAGIC_MACHINE_X}
        y={MAGIC_ROW_Y}
        opacity={0}
        scale={0.85}
      >
        <ProcessorLlm />
      </Layout>

      <Line
        ref={arrowOutRef}
        points={[
          [MAGIC_MACHINE_X + processorW / 2 + 24, MAGIC_ROW_Y],
          [MAGIC_OUT_X - REPLY_OUT_W / 2 - 16, MAGIC_ROW_Y],
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
        x={MAGIC_IN_X}
        y={MAGIC_ROW_Y}
        opacity={0}
        scale={0.55}
        zIndex={30}
      >
        <CustomerMessageCard />
      </Layout>

      <Layout
        ref={responseRef}
        layout={false}
        x={MAGIC_OUT_X}
        y={MAGIC_ROW_Y}
        opacity={0}
        scale={0.9}
      >
        <Rect width={REPLY_OUT_W} height={REPLY_OUT_H} fill={theme.black} x={5} y={5} />
        <Rect
          ref={responseBadgeRef}
          width={REPLY_OUT_W}
          height={REPLY_OUT_H}
          fill={theme.cyan}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          text="Borrador · respuesta"
          fontFamily={theme.pixelFont}
          fontSize={18}
          fill={theme.grey}
          textAlign="left"
          offsetX={-1}
          x={OUT_BODY_X}
          y={-REPLY_OUT_H / 2 + 28}
        />
        <Txt
          ref={responseLine1Ref}
          text="…"
          fontFamily={theme.bodyFont}
          fontSize={15}
          fontWeight={600}
          fill={theme.black}
          textAlign="left"
          offsetX={-1}
          width={OUT_BODY_W}
          lineHeight={21}
          x={OUT_BODY_X}
          y={-22}
        />
        <Txt
          ref={responseLine2Ref}
          text="…"
          fontFamily={theme.bodyFont}
          fontSize={15}
          fontWeight={600}
          fill={theme.black}
          textAlign="left"
          offsetX={-1}
          width={OUT_BODY_W}
          lineHeight={21}
          x={OUT_BODY_X}
          y={0}
        />
        <Txt
          ref={responseLine3Ref}
          text=""
          fontFamily={theme.bodyFont}
          fontSize={15}
          fontWeight={600}
          fill={theme.black}
          textAlign="left"
          offsetX={-1}
          width={OUT_BODY_W}
          lineHeight={21}
          x={OUT_BODY_X}
          y={22}
          opacity={0}
        />
      </Layout>

      <Layout ref={takeawayRef} layout={false} opacity={0}>
        <Txt
          text="Aquí sí hace falta un modelo de lenguaje:"
          fontFamily={theme.bodyFont}
          fontSize={19}
          fontWeight={600}
          fill={theme.pie[0]}
          textAlign="center"
          width={1100}
          lineHeight={26}
          y={252}
        />
        <Txt
          text="interpretar intención y escribir texto nuevo."
          fontFamily={theme.bodyFont}
          fontSize={19}
          fontWeight={600}
          fill={theme.pie[0]}
          textAlign="center"
          width={1100}
          lineHeight={26}
          y={278}
        />
      </Layout>
    </Layout>
  );
}
