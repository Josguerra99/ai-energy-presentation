import {Layout, Line, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {WATER_SLIDE_LAYOUT_H} from './WaterDcHeatIntroSlide';
import {theme} from '../theme';

const TITLE_Y = -318;
const SUBTITLE_Y = -262;
const DIAGRAM_Y = -24;

const WSA_X = -400;
const WSA_W = 220;
const WSA_H = 152;

const GOOGLE_X = 280;
const GOOGLE_W = 260;
const GOOGLE_H = 168;

const RIVER_Y = 188;
const RIVER_W = 920;
const RIVER_H = 52;

/** Tubería por debajo del centro del texto interior. */
const PIPE_Y = 36;

export type WaterGoogleReclaimedSlideProps = {
  wsaGroupRef: Reference<Layout>;
  googleGroupRef: Reference<Layout>;
  pipeFlowRef: Reference<Line>;
  pipeLabelRef: Reference<Txt>;
  returnFlowRef: Reference<Line>;
  riverGroupRef: Reference<Layout>;
};

/** Google Douglas County — planta → DC → río (esquema mínimo). */
export function WaterGoogleReclaimedSlide({
  wsaGroupRef,
  googleGroupRef,
  pipeFlowRef,
  pipeLabelRef,
  returnFlowRef,
  riverGroupRef,
}: WaterGoogleReclaimedSlideProps) {
  const wsaRight = WSA_X + WSA_W / 2;
  const googleLeft = GOOGLE_X - GOOGLE_W / 2;
  const googleBottom = GOOGLE_H / 2;
  const riverTop = RIVER_Y - RIVER_H / 2;

  return (
    <Layout layout={false} width={1680} height={WATER_SLIDE_LAYOUT_H}>
      <Txt
        text="Google — agua reutilizada en centros de datos"
        fontFamily={theme.pixelFont}
        fontSize={34}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={TITLE_Y}
        width={1500}
      />
      <Txt
        text="Douglas County (Georgia): agua tratada de la utility → torres → efluente al río"
        fontFamily={theme.bodyFont}
        fontSize={21}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={SUBTITLE_Y}
        width={1300}
      />

      <Layout layout={false} y={DIAGRAM_Y}>
        <Layout ref={wsaGroupRef} layout={false} opacity={0}>
          <Rect
            width={WSA_W}
            height={WSA_H}
            fill={theme.black}
            x={WSA_X + theme.shadow}
            y={theme.shadow}
          />
          <Rect
            width={WSA_W}
            height={WSA_H}
            fill="#cbd5e1"
            stroke={theme.black}
            lineWidth={3}
            x={WSA_X}
          />
          <Txt
            text="Planta WSA"
            fontFamily={theme.pixelFont}
            fontSize={26}
            fill={theme.black}
            x={WSA_X}
            y={-WSA_H / 2 - 36}
          />
          <Txt
            text={'Agua reutilizada'}
            fontFamily={theme.bodyFont}
            fontSize={18}
            fontWeight={700}
            fill={theme.black}
            textAlign="center"
            width={WSA_W - 24}
            x={WSA_X}
            y={-6}
          />
          <Txt
            text={'(sidestream)'}
            fontFamily={theme.bodyFont}
            fontSize={16}
            fontWeight={600}
            fill={theme.pie[0]}
            textAlign="center"
            width={WSA_W - 24}
            x={WSA_X}
            y={16}
          />
        </Layout>

        <Layout ref={googleGroupRef} layout={false} opacity={0}>
          <Rect
            width={GOOGLE_W}
            height={GOOGLE_H}
            fill={theme.black}
            x={GOOGLE_X + theme.shadow}
            y={theme.shadow}
          />
          <Rect
            width={GOOGLE_W}
            height={GOOGLE_H}
            fill={theme.white}
            stroke={theme.black}
            lineWidth={3}
            x={GOOGLE_X}
          />
          <Txt
            text="Google DC"
            fontFamily={theme.pixelFont}
            fontSize={28}
            fill={theme.black}
            x={GOOGLE_X}
            y={-GOOGLE_H / 2 - 38}
          />
          <Txt
            text={'Refrigeración'}
            fontFamily={theme.bodyFont}
            fontSize={17}
            fontWeight={700}
            fill={theme.black}
            textAlign="center"
            width={GOOGLE_W - 28}
            x={GOOGLE_X}
            y={-4}
          />
          <Txt
            text={'(evaporación parcial)'}
            fontFamily={theme.bodyFont}
            fontSize={15}
            fontWeight={600}
            fill={theme.pie[0]}
            textAlign="center"
            width={GOOGLE_W - 28}
            x={GOOGLE_X}
            y={18}
          />
        </Layout>

        <Txt
          ref={pipeLabelRef}
          text="Conexión desde planta"
          fontFamily={theme.bodyFont}
          fontSize={16}
          fontWeight={700}
          fill={theme.pie[0]}
          x={(wsaRight + googleLeft) / 2}
          y={PIPE_Y - 28}
          opacity={0}
        />

        <Line
          ref={pipeFlowRef}
          points={[
            [wsaRight, PIPE_Y],
            [googleLeft, PIPE_Y],
          ]}
          stroke={theme.cyan}
          lineWidth={10}
          lineCap="round"
          lineDash={[22, 14]}
          lineDashOffset={0}
          end={1}
          opacity={0}
        />

        <Line
          ref={returnFlowRef}
          points={[
            [GOOGLE_X, googleBottom],
            [GOOGLE_X, riverTop - 8],
          ]}
          stroke={theme.pie[0]}
          lineWidth={6}
          lineCap="round"
          endArrow
          arrowSize={12}
          opacity={0}
        />

        <Layout ref={riverGroupRef} layout={false} opacity={0}>
          <Rect
            width={RIVER_W}
            height={RIVER_H}
            fill={theme.black}
            x={theme.shadow}
            y={RIVER_Y + theme.shadow}
          />
          <Rect
            width={RIVER_W}
            height={RIVER_H}
            fill={theme.cyan}
            stroke={theme.black}
            lineWidth={3}
            x={0}
            y={RIVER_Y}
          />
          <Txt
            text={'Devuelta al río Chattahoochee — agua tratada en el campus (no evaporada)'}
            fontFamily={theme.bodyFont}
            fontSize={17}
            fontWeight={700}
            fill={theme.black}
            textAlign="center"
            width={RIVER_W - 48}
            lineHeight={22}
            x={0}
            y={RIVER_Y}
          />
        </Layout>
      </Layout>
    </Layout>
  );
}

export const GOOGLE_PIPE_DASH = 36;
export const GOOGLE_PIPE_STEP = 0.34;
