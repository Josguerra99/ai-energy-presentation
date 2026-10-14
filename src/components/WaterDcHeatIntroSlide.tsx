import {Layout, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import type {Rect as RectNode, Txt as TxtNode} from '@motion-canvas/2d';
import {theme} from '../theme';

/** Altura útil alineada con el panel paso0; deja margen inferior al pie de fuentes. */
export const WATER_SLIDE_LAYOUT_H = 760;

const TITLE_Y = -318;
const SUBTITLE_Y = -268;
const DIAGRAM_Y = -10;
const STATUS_Y = 248;
const CHAIN_Y = 302;

const DC_X = -248;
const DC_W = 448;
const DC_H = 268;

const RACK_W = 148;
const RACK_H = 164;
const RACK1_X = DC_X - 92;
const RACK2_X = DC_X + 92;

const THERMO_X = 368;
const THERMO_TRACK_H = 196;
const THERMO_W = 36;
const THERMO_BOTTOM_Y = THERMO_TRACK_H / 2 - 6;

export const WATER_HEAT_TEMP_START_C = 28;
export const WATER_HEAT_TEMP_END_C = 72;
export const WATER_HEAT_THERMO_FILL_MAX = THERMO_TRACK_H - 12;

/** Uso bajo (reposo); el cyan del sitio indica carga que sube. */
export const WATER_SERVER_IDLE_FILL = theme.pie[1];
export const WATER_SERVER_SLOT_COUNT = 3;
export const WATER_SERVER_SLOT_H = 34;
export const WATER_SERVER_SLOT_GAP = 8;
/** Altura total de los 3 segmentos (sin llenar al tope). ~2 segmentos + un poco del tercero. */
export const WATER_SERVER_FILL_MAX_RATIO = 0.62;

const SERVER_STACK_H =
  WATER_SERVER_SLOT_COUNT * WATER_SERVER_SLOT_H +
  (WATER_SERVER_SLOT_COUNT - 1) * WATER_SERVER_SLOT_GAP;

/** Índice 0 = arriba, 2 = abajo. Una sola “ola” de uso que sube por segmentos. */
export function waterServerSlotScales(progress: number): [number, number, number] {
  const t = Math.max(0, Math.min(1, progress));
  const filledPx = t * WATER_SERVER_FILL_MAX_RATIO * SERVER_STACK_H;
  const scales: [number, number, number] = [0, 0, 0];
  let remaining = filledPx;
  for (const slotIndex of [2, 1, 0] as const) {
    const inSlot = Math.min(remaining, WATER_SERVER_SLOT_H);
    scales[slotIndex] = inSlot / WATER_SERVER_SLOT_H;
    remaining -= inSlot;
  }
  return scales;
}

export type WaterDcHeatIntroSlideProps = {
  tempValueRef: Reference<TxtNode>;
  thermoFillRef: Reference<RectNode>;
  /** [rack][slot] — cyan por segmento, no un bloque único. */
  serverUsageRefs: Reference<RectNode>[][];
  statusRef: Reference<TxtNode>;
  chainRef: Reference<TxtNode>;
};

function Rack({
  x,
  usageRefs,
}: {
  x: number;
  usageRefs: Reference<RectNode>[];
}) {
  const slotH = WATER_SERVER_SLOT_H;
  const slotGap = WATER_SERVER_SLOT_GAP;
  const slotW = RACK_W - 28;
  const innerTop = -RACK_H / 2 + 34;
  return (
    <Layout layout={false} x={x} y={12}>
      <Rect width={RACK_W} height={RACK_H} fill="#1a1a1a" stroke={theme.black} lineWidth={3} />
      {[0, 1, 2].map(i => {
        const slotY = innerTop + i * (slotH + slotGap);
        return (
          <Layout key={`slot-${i}`} layout={false} clip width={slotW} height={slotH} y={slotY}>
            <Rect width={slotW} height={slotH} fill={WATER_SERVER_IDLE_FILL} />
            <Rect
              ref={usageRefs[i]}
              width={slotW}
              height={slotH}
              y={slotH / 2}
              offsetY={1}
              fill={theme.cyan}
              scale={[1, 0]}
            />
          </Layout>
        );
      })}
      {[0, 1, 2].map(i => (
        <Rect
          key={`slot-frame-${i}`}
          width={slotW}
          height={slotH}
          y={innerTop + i * (slotH + slotGap)}
          fill={null}
          stroke={theme.black}
          lineWidth={2}
        />
      ))}
      <Txt
        text="Servidor"
        fontFamily={theme.pixelFont}
        fontSize={16}
        fill={theme.white}
        y={RACK_H / 2 - 14}
      />
    </Layout>
  );
}

export function WaterDcHeatIntroSlide({
  tempValueRef,
  thermoFillRef,
  serverUsageRefs,
  statusRef,
  chainRef,
}: WaterDcHeatIntroSlideProps) {
  return (
    <Layout layout={false} width={1680} height={WATER_SLIDE_LAYOUT_H}>
      <Txt
        text="Agua y centros de datos"
        fontFamily={theme.pixelFont}
        fontSize={38}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={TITLE_Y}
        width={1500}
      />
      <Txt
        text="El calor del cómputo es lo que empuja la refrigeración"
        fontFamily={theme.bodyFont}
        fontSize={24}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={SUBTITLE_Y}
        width={1400}
      />

      <Layout layout={false} y={DIAGRAM_Y}>
        <Rect
          width={DC_W}
          height={DC_H}
          fill="#f5f5f0"
          stroke={theme.black}
          lineWidth={4}
          x={DC_X}
        />
        <Txt
          text="Centro de datos"
          fontFamily={theme.pixelFont}
          fontSize={22}
          fill={theme.black}
          x={DC_X}
          y={-DC_H / 2 + 22}
        />

        <Rack x={RACK1_X} usageRefs={serverUsageRefs[0]} />
        <Rack x={RACK2_X} usageRefs={serverUsageRefs[1]} />

        <Layout layout={false} x={THERMO_X} y={6}>
          <Txt
            text="Temperatura del pasillo"
            fontFamily={theme.bodyFont}
            fontSize={16}
            fontWeight={700}
            fill={theme.black}
            textAlign="center"
            y={-THERMO_TRACK_H / 2 - 32}
            width={180}
          />
          <Rect
            width={THERMO_W}
            height={THERMO_TRACK_H}
            fill={theme.white}
            stroke={theme.black}
            lineWidth={3}
          />
          <Rect
            ref={thermoFillRef}
            width={THERMO_W - 8}
            height={0}
            y={THERMO_BOTTOM_Y}
            offsetY={1}
            fill={theme.magenta}
          />
          <Txt
            ref={tempValueRef}
            text={`${WATER_HEAT_TEMP_START_C} °C`}
            fontFamily={theme.pixelFont}
            fontSize={42}
            fill={theme.black}
            y={THERMO_TRACK_H / 2 + 42}
          />
        </Layout>
      </Layout>

      <Txt
        ref={statusRef}
        text="Carga de trabajo subiendo…"
        fontFamily={theme.bodyFont}
        fontSize={22}
        fontWeight={700}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={STATUS_Y}
        width={1500}
        opacity={0}
      />
      <Txt
        ref={chainRef}
        text="Electricidad → calor en chips → aire caliente → refrigeración (aire, agua o ambos)"
        fontFamily={theme.bodyFont}
        fontSize={20}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={CHAIN_Y}
        width={1500}
        lineHeight={28}
        opacity={0}
      />
    </Layout>
  );
}
