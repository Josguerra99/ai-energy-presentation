import {Circle, Layout, Line, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {WATER_SLIDE_LAYOUT_H} from './WaterDcHeatIntroSlide';
import {theme} from '../theme';

export const COOLING_EVAPOR_BUBBLES_PER_PLUME = 7;
/** Dos juegos de burbujas alternados para ráfagas solapadas. */
export const COOLING_EVAPOR_PLUME_SETS = 2;
export const COOLING_EVAPOR_VAPOR_COUNT =
  COOLING_EVAPOR_BUBBLES_PER_PLUME * COOLING_EVAPOR_PLUME_SETS;
/** Pausa entre ráfagas; más bajo = evaporación más continua (se solapan). */
export const COOLING_EVAPOR_PLUME_GAP_SEC = 0.24;
/** Suma de segmentos de `lineDash` en circuitos de refrigeración. */
export const COOLING_FLOW_DASH_CYCLE = 28;
export const COOLING_FLOW_STEP_SEC = 0.32;
export const CLOSED_FLOW_FADE_SEC = 0.35;
/** Bucle principal (fluido cerrado + emisión de vapor). */
export const COOLING_DEMO_LOOP_SEC = 5;
/** Tras dejar de lanzar ráfagas, deja terminar la última oleada. */
export const COOLING_EVAPOR_PLUME_TAIL_SEC = 0.82;

/** Animación de vapor — alineado con la boca superior de la torre. */
export const COOLING_EVAPOR_VAPOR_Y = -48;
export const COOLING_EVAPOR_VAPOR_RISE = 78;
/** Origen en el borde superior de la torre (varios puntos). */
export const COOLING_EVAPOR_VAPOR_SPAWN_X = [
  -54, -36, -18, 0, 18, 36, 54,
] as const;
/** Deriva horizontal al subir (izq / centro / der). */
export const COOLING_EVAPOR_VAPOR_DRIFT_X = [
  -12, -7, -3, 0, 3, 7, 12,
] as const;

const TITLE_Y = -318;
const SUBTITLE_Y = -262;
const PANEL_Y = -36;
const COLUMN_X = 340;

const EVAP_TOWER_Y = 8;
const EVAP_TOWER_SIZE = 132;
const EVAP_BASIN_Y = 92;
const EVAP_LABEL_Y = 112;
const EVAP_CAPTION_Y = 152;

const CLOSED_COOLER_X = 96;
const CLOSED_COOLER_W = 118;
const CLOSED_COOLER_H = 86;
const CLOSED_COOLER_Y = 12;
const CLOSED_EAST_X = CLOSED_COOLER_X + CLOSED_COOLER_W / 2;
const CLOSED_LOOP_TOP = -78;
const CLOSED_LOOP_BOTTOM = 108;
const CLOSED_CAPTION_Y = 152;

const CLOSED_LOOP_POINTS: [number, number][] = [
  [0, CLOSED_LOOP_TOP],
  [0, CLOSED_LOOP_BOTTOM],
  [CLOSED_EAST_X, CLOSED_LOOP_BOTTOM],
  [CLOSED_EAST_X, CLOSED_LOOP_TOP],
  [0, CLOSED_LOOP_TOP],
];

export type DcCoolingTypesSlideProps = {
  evaporVaporRefs: Reference<Circle>[];
  evaporWaterRef: Reference<Rect>;
  closedFlowRef: Reference<Line>;
  closedPulseRef: Reference<Circle>;
  noteRef: Reference<Txt>;
};

/** Dos estilos de refrigeración directa — impacto en agua operativa. */
export function DcCoolingTypesSlide({
  evaporVaporRefs,
  evaporWaterRef,
  closedFlowRef,
  closedPulseRef,
  noteRef,
}: DcCoolingTypesSlideProps) {
  const leftX = -COLUMN_X;
  const rightX = COLUMN_X;
  return (
    <Layout layout={false} width={1680} height={WATER_SLIDE_LAYOUT_H}>
      <Txt
        text="Refrigeración directa en el sitio"
        fontFamily={theme.pixelFont}
        fontSize={34}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={TITLE_Y}
        width={1500}
      />
      <Txt
        text="Dos familias comunes — distinto consumo de agua (huella directa)"
        fontFamily={theme.bodyFont}
        fontSize={21}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={SUBTITLE_Y}
        width={1300}
      />

      <Layout layout={false} y={PANEL_Y}>
        {/* —— Evaporativo —— */}
        <Layout layout={false} x={leftX} y={0}>
          <Txt
            text="Evaporativo"
            fontFamily={theme.pixelFont}
            fontSize={24}
            fill={theme.black}
            textAlign="center"
            y={-92}
            width={300}
          />
          <Rect
            width={EVAP_TOWER_SIZE}
            height={EVAP_TOWER_SIZE}
            fill="#cbd5e1"
            stroke={theme.black}
            lineWidth={3}
            y={EVAP_TOWER_Y}
          />
          <Rect
            width={EVAP_TOWER_SIZE * 0.72}
            height={EVAP_TOWER_SIZE * 0.48}
            fill="#94a3b8"
            stroke={theme.black}
            lineWidth={2}
            y={EVAP_TOWER_Y - 18}
          />
          <Line
            points={[
              [-EVAP_TOWER_SIZE / 2 - 28, EVAP_TOWER_Y],
              [-EVAP_TOWER_SIZE / 2, EVAP_TOWER_Y],
            ]}
            stroke={theme.magenta}
            lineWidth={5}
            lineCap="round"
            arrowSize={12}
            endArrow
          />
          <Rect
            ref={evaporWaterRef}
            width={EVAP_TOWER_SIZE + 16}
            height={16}
            fill={theme.cyan}
            stroke={theme.black}
            lineWidth={2}
            y={EVAP_BASIN_Y}
            opacity={0.85}
          />
          <Txt
            text="Torre / media húmeda"
            fontFamily={theme.bodyFont}
            fontSize={15}
            fontWeight={700}
            fill={theme.black}
            textAlign="center"
            y={EVAP_LABEL_Y}
            width={280}
          />
          {evaporVaporRefs.map((_, i) => {
            const slot = i % COOLING_EVAPOR_BUBBLES_PER_PLUME;
            const ox = COOLING_EVAPOR_VAPOR_SPAWN_X[slot];
            const size = 18 + (slot % 3) * 5;
            return (
              <Circle
                key={`vapor-${i}`}
                ref={evaporVaporRefs[i]}
                x={ox}
                y={COOLING_EVAPOR_VAPOR_Y}
                width={size}
                height={size}
                fill={theme.white}
                stroke={theme.black}
                lineWidth={2}
                opacity={0}
              />
            );
          })}
          <Txt
            text="Parte del agua se evapora → consumo directo (WUE)"
            fontFamily={theme.bodyFont}
            fontSize={15}
            fontWeight={600}
            fill={theme.pie[0]}
            textAlign="center"
            width={300}
            lineHeight={22}
            y={EVAP_CAPTION_Y}
          />
        </Layout>

        {/* —— Circuito cerrado —— */}
        <Layout layout={false} x={rightX} y={0}>
          <Txt
            text="Circuito cerrado"
            fontFamily={theme.pixelFont}
            fontSize={24}
            fill={theme.black}
            textAlign="center"
            y={-92}
            width={320}
          />
          <Line
            points={CLOSED_LOOP_POINTS}
            stroke={theme.black}
            lineWidth={6}
            lineCap="round"
            lineJoin="round"
            end={1}
            opacity={0.22}
          />
          <Line
            ref={closedFlowRef}
            points={CLOSED_LOOP_POINTS}
            stroke={theme.pie[0]}
            lineWidth={6}
            lineCap="round"
            lineJoin="round"
            lineDash={[16, 12]}
            lineDashOffset={0}
            end={1}
            opacity={0}
          />
          <Rect
            width={CLOSED_COOLER_W}
            height={CLOSED_COOLER_H}
            fill={theme.white}
            stroke={theme.black}
            lineWidth={3}
            x={CLOSED_COOLER_X}
            y={CLOSED_COOLER_Y}
          />
          <Circle
            ref={closedPulseRef}
            x={CLOSED_COOLER_X}
            y={CLOSED_COOLER_Y}
            width={32}
            height={32}
            fill={theme.cyan}
            stroke={theme.black}
            lineWidth={2}
            opacity={0}
          />
          <Txt
            text={'Intercambiador\n/ dry cooler'}
            fontFamily={theme.bodyFont}
            fontSize={12}
            fontWeight={700}
            fill={theme.black}
            textAlign="center"
            width={CLOSED_COOLER_W - 10}
            lineHeight={15}
            x={CLOSED_COOLER_X}
            y={CLOSED_COOLER_Y}
          />
          <Txt
            text="Fluido recircula — poco o nulo consumo diario"
            fontFamily={theme.bodyFont}
            fontSize={15}
            fontWeight={600}
            fill={theme.pie[0]}
            textAlign="center"
            width={320}
            lineHeight={22}
            y={CLOSED_CAPTION_Y}
          />
        </Layout>
      </Layout>

      <Txt
        ref={noteRef}
        text="El total «directo» del LBNL mezcla diseños: clima seco favorece evaporativo; nuevos sitios IA prueban menos evaporación."
        fontFamily={theme.bodyFont}
        fontSize={18}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        width={1200}
        lineHeight={28}
        y={268}
        opacity={0}
      />
    </Layout>
  );
}
