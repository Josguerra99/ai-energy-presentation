import {Circle, Layout, Line, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {
  PUE_THEORETICAL_MIN,
  pueChartColors,
  pueTrend,
} from '../data/pueTrend';
import {theme} from '../theme';

const CHART_X = -480;
const CHART_Y = 100;
const CHART_W = 900;
const CHART_H = 420;
const PUE_MIN = 1.0;
const PUE_MAX = 2.6;
const YEAR_MIN = 2007;
const YEAR_MAX = 2026;

function xForYear(year: number): number {
  return CHART_X + ((year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * CHART_W;
}

function yForPue(pue: number): number {
  return CHART_Y - ((pue - PUE_MIN) / (PUE_MAX - PUE_MIN)) * CHART_H;
}

export function pueLinePoints(): [number, number][] {
  return pueTrend.map(p => [xForYear(p.year), yForPue(p.pue)]);
}

type PueTrendChartProps = {
  lineRef: Reference<Line>;
  pointRefs: Reference<Circle>[];
  labelRefs: Reference<Txt>[];
  noteRef: Reference<Txt>;
};

export function PueTrendChart({
  lineRef,
  pointRefs,
  labelRefs,
  noteRef,
}: PueTrendChartProps) {
  const points = pueLinePoints();
  const yOne = yForPue(PUE_THEORETICAL_MIN);

  return (
    <Layout layout={false} width={1600} height={760}>
      <Txt
        text="PUE promedio a lo largo de los años"
        fontFamily={theme.pixelFont}
        fontSize={36}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-330}
      />

      <Line
        points={[
          [CHART_X, CHART_Y],
          [CHART_X + CHART_W, CHART_Y],
        ]}
        stroke={pueChartColors.axis}
        lineWidth={3}
      />
      <Line
        points={[
          [CHART_X, CHART_Y],
          [CHART_X, CHART_Y - CHART_H],
        ]}
        stroke={pueChartColors.axis}
        lineWidth={3}
      />

      {/* Mínimo teórico PUE = 1 */}
      <Line
        points={[
          [CHART_X, yOne],
          [CHART_X + CHART_W, yOne],
        ]}
        stroke={pueChartColors.theoretical}
        lineWidth={2}
        lineDash={[10, 8]}
      />
      <Txt
        text="1.0"
        fontFamily={theme.bodyFont}
        fontSize={18}
        fill={theme.grey}
        x={CHART_X - 36}
        y={yOne}
      />

      <Txt text="PUE" fontFamily={theme.bodyFont} fontSize={20} fill={theme.grey} x={CHART_X - 42} y={CHART_Y - CHART_H / 2} />
      <Txt text="2.5" fontFamily={theme.bodyFont} fontSize={18} fill={theme.grey} x={CHART_X - 36} y={yForPue(2.5)} />
      <Txt text="1.5" fontFamily={theme.bodyFont} fontSize={18} fill={theme.grey} x={CHART_X - 36} y={yForPue(1.5)} />
      <Txt text="2007" fontFamily={theme.bodyFont} fontSize={18} fill={theme.grey} x={xForYear(2007)} y={CHART_Y + 28} />
      <Txt text="2018" fontFamily={theme.bodyFont} fontSize={18} fill={theme.grey} x={xForYear(2018)} y={CHART_Y + 28} />
      <Txt text="2026" fontFamily={theme.bodyFont} fontSize={18} fill={theme.grey} x={xForYear(2026)} y={CHART_Y + 28} />

      <Line
        ref={lineRef}
        points={points}
        stroke={pueChartColors.line}
        lineWidth={5}
        lineCap="round"
        lineJoin="round"
        end={0}
      />

      {pueTrend.map((p, i) => (
        <Layout key={`pue-${p.year}`} layout={false}>
          <Circle
            ref={pointRefs[i]}
            x={xForYear(p.year)}
            y={yForPue(p.pue)}
            size={p.label ? 16 : 12}
            fill={pueChartColors.point}
            stroke={theme.black}
            lineWidth={2}
            scale={0}
          />
          <Txt
            ref={labelRefs[i]}
            text={p.label ? p.pue.toFixed(2) : ''}
            fontFamily={theme.bodyFont}
            fontSize={18}
            fontWeight={700}
            fill={theme.black}
            x={xForYear(p.year)}
            y={yForPue(p.pue) - 26}
            opacity={0}
          />
        </Layout>
      ))}

      <Txt
        ref={noteRef}
        text={`Mínimo teórico = ${PUE_THEORETICAL_MIN.toFixed(1)} (toda la energía va al equipo IT).\nNo existe “el” PUE de un data center: difiere por edad, diseño y escala.`}
        fontFamily={theme.bodyFont}
        fontSize={24}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={CHART_Y + 100}
        opacity={0}
      />
    </Layout>
  );
}
