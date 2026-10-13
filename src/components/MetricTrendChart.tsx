import {Circle, Layout, Line, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {theme} from '../theme';

const CHART_X = -480;
const CHART_Y = 90;
const CHART_W = 900;
const CHART_H = 400;

export type MetricPoint = {year: number; value: number; label?: boolean};

export type MetricTrendChartProps = {
  title: string;
  yAxisLabel: string;
  yearMin: number;
  yearMax: number;
  valueMin: number;
  valueMax: number;
  points: MetricPoint[];
  valueFormat: (v: number) => string;
  note: string;
  lineRef: Reference<Line>;
  pointRefs: Reference<Circle>[];
  labelRefs: Reference<Txt>[];
  noteRef: Reference<Txt>;
  lineColor?: string;
  pointColor?: string;
};

function xForYear(year: number, yearMin: number, yearMax: number): number {
  return CHART_X + ((year - yearMin) / (yearMax - yearMin)) * CHART_W;
}

function yForValue(value: number, valueMin: number, valueMax: number): number {
  return CHART_Y - ((value - valueMin) / (valueMax - valueMin)) * CHART_H;
}

export function metricLinePoints(
  points: MetricPoint[],
  yearMin: number,
  yearMax: number,
  valueMin: number,
  valueMax: number,
): [number, number][] {
  return points.map(p => [
    xForYear(p.year, yearMin, yearMax),
    yForValue(p.value, valueMin, valueMax),
  ]);
}

export function MetricTrendChart({
  title,
  yAxisLabel,
  yearMin,
  yearMax,
  valueMin,
  valueMax,
  points,
  valueFormat,
  note,
  lineRef,
  pointRefs,
  labelRefs,
  noteRef,
  lineColor = theme.cyan,
  pointColor = theme.magenta,
}: MetricTrendChartProps) {
  const linePts = metricLinePoints(points, yearMin, yearMax, valueMin, valueMax);

  return (
    <Layout layout={false} width={1600} height={760}>
      <Txt
        text={title}
        fontFamily={theme.pixelFont}
        fontSize={34}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-320}
      />
      <Line
        points={[
          [CHART_X, CHART_Y],
          [CHART_X + CHART_W, CHART_Y],
        ]}
        stroke={theme.black}
        lineWidth={3}
      />
      <Line
        points={[
          [CHART_X, CHART_Y],
          [CHART_X, CHART_Y - CHART_H],
        ]}
        stroke={theme.black}
        lineWidth={3}
      />
      <Txt
        text={yAxisLabel}
        fontFamily={theme.bodyFont}
        fontSize={18}
        fill={theme.grey}
        x={CHART_X - 48}
        y={CHART_Y - CHART_H / 2}
      />
      <Txt
        text={String(yearMin)}
        fontFamily={theme.bodyFont}
        fontSize={18}
        fill={theme.grey}
        x={xForYear(yearMin, yearMin, yearMax)}
        y={CHART_Y + 28}
      />
      <Txt
        text={String(yearMax)}
        fontFamily={theme.bodyFont}
        fontSize={18}
        fill={theme.grey}
        x={xForYear(yearMax, yearMin, yearMax)}
        y={CHART_Y + 28}
      />
      <Line
        ref={lineRef}
        points={linePts}
        stroke={lineColor}
        lineWidth={5}
        lineCap="round"
        lineJoin="round"
        end={0}
      />
      {points.map((p, i) => (
        <Layout key={`pt-${p.year}`} layout={false}>
          <Circle
            ref={pointRefs[i]}
            x={xForYear(p.year, yearMin, yearMax)}
            y={yForValue(p.value, valueMin, valueMax)}
            size={p.label ? 16 : 12}
            fill={pointColor}
            stroke={theme.black}
            lineWidth={2}
            scale={0}
          />
          <Txt
            ref={labelRefs[i]}
            text={p.label ? valueFormat(p.value) : ''}
            fontFamily={theme.bodyFont}
            fontSize={17}
            fontWeight={700}
            fill={theme.black}
            x={xForYear(p.year, yearMin, yearMax)}
            y={yForValue(p.value, valueMin, valueMax) - 28}
            opacity={0}
          />
        </Layout>
      ))}
      <Txt
        ref={noteRef}
        text={note}
        fontFamily={theme.bodyFont}
        fontSize={22}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={CHART_Y + 95}
        width={1200}
        lineHeight={30}
        opacity={0}
      />
    </Layout>
  );
}
