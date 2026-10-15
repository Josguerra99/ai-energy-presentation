import {Circle, Layout, Line, Rect, Txt} from '@motion-canvas/2d';
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

const llmW = 280;
const llmH = 200;
const mailW = 420;
const mailH = 96;
const responseW = 420;
const responseH = 72;

export const EMAIL_DEMO_ROW_Y = MAGIC_ROW_Y;
export const EMAIL_DEMO_IN_X = MAGIC_IN_X;
export const EMAIL_DEMO_MACHINE_X = MAGIC_MACHINE_X;
export const EMAIL_DEMO_OUT_X = MAGIC_OUT_X;

export type EmailLlmValidationDemoProps = {
  emailDockRef: Reference<Layout>;
  emailAddressRef: Reference<Txt>;
  emailFlyRef: Reference<Layout>;
  emailFlyAddressRef: Reference<Txt>;
  arrowInRef: Reference<Line>;
  arrowOutRef: Reference<Line>;
  llmGroupRef: Reference<Layout>;
  regexGroupRef: Reference<Layout>;
  responseGroupRef: Reference<Layout>;
  responseBadgeRef: Reference<Rect>;
  responseTextRef: Reference<Txt>;
  solutionHintRef: Reference<Txt>;
};

function EmailCard({
  addressRef,
  width,
  height,
}: {
  addressRef: Reference<Txt>;
  width: number;
  height: number;
}) {
  return (
    <>
      <Rect width={width} height={height} fill={theme.black} x={5} y={5} />
      <Rect
        width={width}
        height={height}
        fill={theme.white}
        stroke={theme.black}
        lineWidth={theme.border}
      />
      <Circle
        x={-width / 2 + 42}
        y={0}
        width={52}
        height={52}
        fill={theme.cyan}
        stroke={theme.black}
        lineWidth={2}
      />
      <Txt
        text="@"
        fontFamily={theme.pixelFont}
        fontSize={28}
        fill={theme.black}
        x={-width / 2 + 42}
        y={-2}
      />
      <Txt
        ref={addressRef}
        text="maria.garcia@empresa.com"
        fontFamily={theme.bodyFont}
        fontSize={22}
        fontWeight={700}
        fill={theme.black}
        textAlign="left"
        width={width - 110}
        x={-width / 2 + 88}
        y={0}
        offsetX={-1}
      />
    </>
  );
}

/** Correo → LLM → respuesta (layout como apertura «caja mágica»). */
export function EmailLlmValidationDemo({
  emailDockRef,
  emailAddressRef,
  emailFlyRef,
  emailFlyAddressRef,
  arrowInRef,
  arrowOutRef,
  llmGroupRef,
  regexGroupRef,
  responseGroupRef,
  responseBadgeRef,
  responseTextRef,
  solutionHintRef,
}: EmailLlmValidationDemoProps) {
  return (
    <Layout layout={false} width={1680} height={RECOMMEND_SLIDE_H}>
      <Txt
        text="Validar el formato de un correo"
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
        ref={emailDockRef}
        layout={false}
        x={EMAIL_DEMO_IN_X}
        y={EMAIL_DEMO_ROW_Y}
        opacity={0}
        scale={0.9}
      >
        <EmailCard addressRef={emailAddressRef} width={mailW} height={mailH} />
      </Layout>

      <Line
        ref={arrowInRef}
        points={[
          [EMAIL_DEMO_IN_X + mailW / 2 + 16, EMAIL_DEMO_ROW_Y],
          [EMAIL_DEMO_MACHINE_X - llmW / 2 - 24, EMAIL_DEMO_ROW_Y],
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
        ref={llmGroupRef}
        layout={false}
        x={EMAIL_DEMO_MACHINE_X}
        y={EMAIL_DEMO_ROW_Y}
        opacity={0}
        scale={0.85}
      >
        <Rect width={llmW} height={llmH} fill={theme.black} x={5} y={5} />
        <Rect
          width={llmW}
          height={llmH}
          fill={theme.magenta}
          stroke={theme.black}
          lineWidth={theme.border}
          opacity={0.35}
        />
        <Rect
          width={llmW}
          height={llmH}
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
          text="¿Es válido este correo?"
          fontFamily={theme.bodyFont}
          fontSize={16}
          fontWeight={600}
          fill={theme.black}
          textAlign="center"
          width={llmW - 32}
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
          width={llmW - 24}
          y={52}
        />
      </Layout>

      <Layout
        ref={regexGroupRef}
        layout={false}
        x={EMAIL_DEMO_MACHINE_X}
        y={EMAIL_DEMO_ROW_Y}
        opacity={0}
        scale={0.85}
      >
        <Rect width={llmW} height={llmH} fill={theme.black} x={5} y={5} />
        <Rect
          width={llmW}
          height={llmH}
          fill={theme.pie[6]}
          stroke={theme.black}
          lineWidth={theme.border}
          opacity={0.55}
        />
        <Rect
          width={llmW}
          height={llmH}
          fill={theme.white}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          text="REGEX"
          fontFamily={theme.pixelFont}
          fontSize={42}
          fill={theme.black}
          y={-48}
        />
        <Txt
          text="/^[^@]+@[^@]+\\.[^@]+$/"
          fontFamily={theme.bodyFont}
          fontSize={13}
          fontWeight={700}
          fill={theme.black}
          textAlign="center"
          width={llmW - 24}
          lineHeight={18}
          y={-4}
        />
        <Txt
          text="determinista · sin tokens"
          fontFamily={theme.bodyFont}
          fontSize={13}
          fontWeight={600}
          fill={theme.pie[0]}
          textAlign="center"
          width={llmW - 24}
          y={52}
        />
      </Layout>

      <Line
        ref={arrowOutRef}
        points={[
          [EMAIL_DEMO_MACHINE_X + llmW / 2 + 24, EMAIL_DEMO_ROW_Y],
          [EMAIL_DEMO_OUT_X - responseW / 2 - 16, EMAIL_DEMO_ROW_Y],
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
        ref={emailFlyRef}
        layout={false}
        x={EMAIL_DEMO_IN_X}
        y={EMAIL_DEMO_ROW_Y}
        opacity={0}
        scale={0.55}
        zIndex={30}
      >
        <EmailCard addressRef={emailFlyAddressRef} width={mailW} height={mailH} />
      </Layout>

      <Layout
        ref={responseGroupRef}
        layout={false}
        x={EMAIL_DEMO_OUT_X}
        y={EMAIL_DEMO_ROW_Y}
        opacity={0}
        scale={0.9}
      >
        <Rect width={responseW} height={responseH} fill={theme.black} x={5} y={5} />
        <Rect
          ref={responseBadgeRef}
          width={responseW}
          height={responseH}
          fill={theme.cyan}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          ref={responseTextRef}
          text="Respuesta: sí, parece válido"
          fontFamily={theme.bodyFont}
          fontSize={20}
          fontWeight={700}
          fill={theme.black}
          textAlign="center"
          width={380}
          lineHeight={26}
        />
      </Layout>

      <Txt
        ref={solutionHintRef}
        text="Solución habitual: regex o librería de validación, determinista, sin tokens."
        fontFamily={theme.bodyFont}
        fontSize={19}
        fontWeight={600}
        fill={theme.pie[0]}
        textAlign="center"
        width={1200}
        lineHeight={28}
        y={268}
        opacity={0}
      />
    </Layout>
  );
}
