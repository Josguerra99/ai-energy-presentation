import {Layout, Line, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {
  GRID_CARBON_BEST_HOUR,
  GRID_CARBON_HOURLY,
  GRID_CARBON_PEAK_REQUEST_HOUR,
  gridCarbonBarFill,
} from '../data/gridCarbonIntensityDay';
import {theme} from '../theme';

const SLIDE_H = 760;
const TITLE_Y = -360;

const MIX_SEGMENTS = [
  {label: 'Gas', pct: 0.34, fill: '#FB923C'},
  {label: 'Carbón', pct: 0.22, fill: '#57534E'},
  {label: 'Nuclear', pct: 0.18, fill: '#A78BFA'},
  {label: 'Renovable', pct: 0.26, fill: '#22C55E'},
] as const;

/** Por qué más kWh no es neutral: el mix no es 100 % limpio. */
export function GridCarbonImpactSlide() {
  const barW = 720;
  const barH = 48;
  let x = -barW / 2;
  return (
    <Layout layout={false} width={1680} height={SLIDE_H}>
      <Txt
        text="Más electricidad → más impacto… según el mix"
        fontFamily={theme.pixelFont}
        fontSize={36}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={TITLE_Y}
        width={1500}
        lineHeight={44}
      />
      <Txt
        text="Un data center consume kWh de la red regional — no siempre de fuentes limpias"
        fontFamily={theme.bodyFont}
        fontSize={22}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-300}
        width={1200}
      />
      <Layout layout={false} y={-200}>
        <Rect width={barW} height={barH} fill={theme.black} x={4} y={4} />
        <Layout layout={false}>
          {MIX_SEGMENTS.map(seg => {
            const w = barW * seg.pct;
            const node = (
              <Rect
                key={seg.label}
                x={x + w / 2}
                width={w}
                height={barH}
                fill={seg.fill}
                stroke={theme.black}
                lineWidth={2}
              />
            );
            x += w;
            return node;
          })}
        </Layout>
        <Txt
          text="Ejemplo ilustrativo · mix horario/regional (EE. UU.)"
          fontFamily={theme.bodyFont}
          fontSize={15}
          fontWeight={500}
          fill={theme.grey}
          y={barH / 2 + 28}
        />
      </Layout>
      <Layout layout={false} y={-118}>
        {MIX_SEGMENTS.map((seg, i) => {
          const lx = -340 + i * 170;
          return (
            <Layout key={`leg-${seg.label}`} layout={false} x={lx} y={0}>
              <Rect width={16} height={16} x={-8} fill={seg.fill} stroke={theme.black} lineWidth={1} />
              <Txt
                text={`${seg.label} ~${Math.round(seg.pct * 100)}%`}
                fontFamily={theme.bodyFont}
                fontSize={16}
                fontWeight={600}
                fill={theme.black}
                x={12}
                offsetX={-1}
              />
            </Layout>
          );
        })}
      </Layout>
      <Layout layout={false} y={40}>
        <Rect width={1280} height={120} fill={theme.black} x={5} y={5} />
        <Rect width={1280} height={120} fill={theme.white} stroke={theme.black} lineWidth={theme.border} />
        <Txt
          text="· Más GPUs y más inferencia empujan demanda en la red existente."
          fontFamily={theme.bodyFont}
          fontSize={20}
          fontWeight={600}
          fill={theme.black}
          textAlign="left"
          width={1180}
          x={0}
          y={-28}
        />
        <Txt
          text="· Acuerdos de compra de energía (PPA) y compras verdes ayudan a largo plazo, pero el margen hora a hora sigue variando."
          fontFamily={theme.bodyFont}
          fontSize={20}
          fontWeight={600}
          fill={theme.black}
          textAlign="left"
          width={1180}
          x={0}
          y={8}
        />
        <Txt
          text="· Mismo trabajo en otro momento o región puede tener huella distinta."
          fontFamily={theme.bodyFont}
          fontSize={20}
          fontWeight={600}
          fill={theme.black}
          textAlign="left"
          width={1180}
          x={0}
          y={44}
        />
      </Layout>
    </Layout>
  );
}

/** Borde izquierdo del área de barras (sin columna del eje Y). */
const CHART_BAR_ORIGIN = -392;
const BAR_W = 28;
const BAR_GAP = 7;
const BAR_MAX_H = 160;
const CHART_BASE_Y = 80;
/** ≥80 px entre etiquetas del eje y la primera barra (regla anti-solapamiento). */
const Y_AXIS_LABEL_X = CHART_BAR_ORIGIN - 88;

export function hourIndexToX(hour: number): number {
  const step = BAR_W + BAR_GAP;
  return CHART_BAR_ORIGIN + hour * step + BAR_W / 2;
}

function hourWindowLayout(hour: number, halfWindow = 1): {x: number; w: number} {
  const winW = (halfWindow * 2 + 1) * (BAR_W + BAR_GAP) - BAR_GAP;
  const winLeft = hourIndexToX(hour - halfWindow) - BAR_W / 2 - BAR_GAP / 2;
  return {x: winLeft + winW / 2, w: winW};
}

export type CarbonAwareSchedulingSlideProps = {
  hourBarRefs: Reference<Rect>[];
  /** Ventana en la hora en que el batch iba a correr (mix sucio). */
  plannedWindowRef: Reference<Rect>;
  plannedLabelRef: Reference<Txt>;
  cleanWindowRef: Reference<Rect>;
  jobRef: Reference<Layout>;
  statusRef: Reference<Txt>;
  sdkHintRef: Reference<Txt>;
  scheduleArrowRef: Reference<Line>;
};

/** Carbon-aware: posponer batch a ventana con mix más limpio (animación en escena). */
export function CarbonAwareSchedulingSlide({
  hourBarRefs,
  plannedWindowRef,
  plannedLabelRef,
  cleanWindowRef,
  jobRef,
  statusRef,
  sdkHintRef,
  scheduleArrowRef,
}: CarbonAwareSchedulingSlideProps) {
  const plannedWin = hourWindowLayout(GRID_CARBON_PEAK_REQUEST_HOUR);
  const cleanWin = hourWindowLayout(GRID_CARBON_BEST_HOUR);
  const plannedHourLabel = String(GRID_CARBON_PEAK_REQUEST_HOUR).padStart(2, '0');

  return (
    <Layout layout={false} width={1680} height={SLIDE_H}>
      <Txt
        text="Carbon-aware computing"
        fontFamily={theme.pixelFont}
        fontSize={38}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={TITLE_Y}
        width={1400}
      />
      <Txt
        text="Intensidad de carbono ilustrativa · 24 h"
        fontFamily={theme.bodyFont}
        fontSize={20}
        fontWeight={600}
        fill={theme.grey}
        textAlign="center"
        x={0}
        y={-302}
        width={1000}
      />

      <Layout layout={false} y={CHART_BASE_Y - BAR_MAX_H - 36}>
        <Txt
          text="más sucio"
          fontFamily={theme.bodyFont}
          fontSize={14}
          fontWeight={700}
          fill="#DC2626"
          textAlign="right"
          width={76}
          x={Y_AXIS_LABEL_X}
          y={2}
          offsetX={1}
        />
        <Txt
          text="más limpio"
          fontFamily={theme.bodyFont}
          fontSize={14}
          fontWeight={700}
          fill="#22C55E"
          textAlign="right"
          width={76}
          x={Y_AXIS_LABEL_X}
          y={BAR_MAX_H - 18}
          offsetX={1}
        />
        {GRID_CARBON_HOURLY.map((intensity, hour) => {
          const h = intensity * BAR_MAX_H;
          const x = hourIndexToX(hour);
          return (
            <Layout key={`h-${hour}`} layout={false} clip width={BAR_W} height={BAR_MAX_H} x={x} y={BAR_MAX_H / 2}>
              <Rect
                ref={hourBarRefs[hour]}
                width={BAR_W}
                height={h}
                y={BAR_MAX_H / 2}
                offsetY={1}
                fill={gridCarbonBarFill(intensity)}
                stroke={theme.black}
                lineWidth={2}
                scale={[1, 0]}
              />
            </Layout>
          );
        })}
        <Rect
          ref={plannedWindowRef}
          x={plannedWin.x}
          y={BAR_MAX_H / 2}
          width={plannedWin.w}
          height={BAR_MAX_H + 8}
          fill={theme.magenta}
          opacity={0}
          stroke={theme.black}
          lineWidth={3}
          lineDash={[8, 6]}
        />
        <Rect
          ref={cleanWindowRef}
          x={cleanWin.x}
          y={BAR_MAX_H / 2}
          width={cleanWin.w}
          height={BAR_MAX_H + 8}
          fill={theme.cyan}
          opacity={0}
          stroke={theme.black}
          lineWidth={3}
          lineDash={[8, 6]}
        />
        <Txt
          ref={plannedLabelRef}
          text={`Iba a procesarse ~${plannedHourLabel}:00`}
          fontFamily={theme.pixelFont}
          fontSize={16}
          fill={theme.black}
          textAlign="center"
          width={plannedWin.w + 40}
          x={plannedWin.x}
          y={BAR_MAX_H + 38}
          opacity={0}
        />
        {[0, 6, 12, 18, 23].map(h => (
          <Txt
            key={`tick-${h}`}
            text={`${h}h`}
            fontFamily={theme.bodyFont}
            fontSize={13}
            fontWeight={700}
            fill={theme.black}
            textAlign="center"
            width={BAR_W + 8}
            x={hourIndexToX(h)}
            y={BAR_MAX_H + 22}
          />
        ))}
      </Layout>

      <Layout
        ref={jobRef}
        layout={false}
        x={hourIndexToX(GRID_CARBON_PEAK_REQUEST_HOUR)}
        y={CHART_BASE_Y + 36}
        opacity={0}
      >
        <Rect width={200} height={52} fill={theme.black} x={4} y={4} />
        <Rect width={200} height={52} fill={theme.magenta} stroke={theme.black} lineWidth={2} />
        <Txt
          text="Batch IA"
          fontFamily={theme.pixelFont}
          fontSize={18}
          fill={theme.white}
          y={-4}
        />
      </Layout>

      <Line
        ref={scheduleArrowRef}
        points={[
          [hourIndexToX(GRID_CARBON_PEAK_REQUEST_HOUR), CHART_BASE_Y + 8],
          [hourIndexToX(GRID_CARBON_BEST_HOUR), CHART_BASE_Y - BAR_MAX_H - 48],
        ]}
        stroke={theme.black}
        lineWidth={3}
        lineDash={[12, 8]}
        endArrow
        arrowSize={14}
        opacity={0}
      />

      <Txt
        ref={statusRef}
        text="Carga flexible · esperando ventana más limpia…"
        fontFamily={theme.bodyFont}
        fontSize={22}
        fontWeight={700}
        fill={theme.black}
        textAlign="center"
        width={1200}
        y={248}
      />
      <Txt
        ref={sdkHintRef}
        text={
          'En producción: Carbon Aware SDK (Microsoft / GSF) — API, CLI y librería C# con pronósticos y ventana óptima.\n' +
          'CarbonAware Scheduler (REST / Python): elige hora y región Azure según intensidad prevista. ' +
          'Azure Carbon Optimization API = reportes de emisiones, no scheduling.'
        }
        fontFamily={theme.bodyFont}
        fontSize={17}
        fontWeight={500}
        fill={theme.grey}
        textAlign="center"
        width={1280}
        lineHeight={26}
        y={318}
        opacity={0}
      />
    </Layout>
  );
}
