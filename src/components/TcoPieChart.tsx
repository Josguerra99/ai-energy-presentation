import {Circle, Layout, Line, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {formatUsd, TCO_TOTAL_USD, tcoLegendAmount} from '../data/tcoSlices';
import type {TcoSliceAngles} from '../data/tcoSlices';
import {theme} from '../theme';
import {HypotheticalDisclaimer} from './HypotheticalDisclaimer';

/**
 * Pie chart SIN flex.
 * Leyenda CAPEX / OPEX; pie y leyenda centrados verticalmente bajo el título TCO.
 */
const W = 1100;
const H = 580;
const PIE = 300;
const PIE_R = PIE / 2;
const PIE_X = -300;
const LEGEND_X = 200;
const HEADER_STEP = 28;
const ITEM_STEP = 38;
const SECTION_GAP = 20;
/** Espacio entre el título TCO y el bloque pie+leyenda. */
const TITLE_TO_CONTENT_GAP = 56;

function radialPoints(angleDeg: number): [number, number][] {
  const a = (angleDeg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [
    [c * 1, s * 1],
    [c * PIE_R, s * PIE_R],
  ];
}

type LegendEntry =
  | {type: 'header'; text: string; y: number}
  | {type: 'item'; slice: TcoSliceAngles; y: number};

function buildLegend(slices: TcoSliceAngles[], originY: number): LegendEntry[] {
  const capex = slices.filter(s => s.kind === 'capex');
  const opex = slices.filter(s => s.kind === 'opex');
  const entries: LegendEntry[] = [];
  let y = originY;

  entries.push({type: 'header', text: 'CAPEX (compra / equip.)', y});
  y += HEADER_STEP;
  for (const slice of capex) {
    entries.push({type: 'item', slice, y});
    y += ITEM_STEP;
  }

  y += SECTION_GAP;
  entries.push({type: 'header', text: 'OPEX (total ~5 años)', y});
  y += HEADER_STEP;
  for (const slice of opex) {
    entries.push({type: 'item', slice, y});
    y += ITEM_STEP;
  }

  return entries;
}

function legendHeight(slices: TcoSliceAngles[]): number {
  const capexN = slices.filter(s => s.kind === 'capex').length;
  const opexN = slices.filter(s => s.kind === 'opex').length;
  return (
    HEADER_STEP +
    capexN * ITEM_STEP +
    SECTION_GAP +
    HEADER_STEP +
    opexN * ITEM_STEP
  );
}

type TcoPieChartProps = {
  slices: TcoSliceAngles[];
  sliceRefs: Reference<Circle>[];
  /** Keys únicos MC si el pie se monta más de una vez en recalculate. */
  nodeKeyPrefix?: string;
};

export function TcoPieChart({
  slices,
  sliceRefs,
  nodeKeyPrefix = 'tco-servidor',
}: TcoPieChartProps) {
  const titleY = -H / 2 + 32;
  const contentCenterY = titleY + TITLE_TO_CONTENT_GAP + 24 + legendHeight(slices) / 2;
  const legendOriginY = contentCenterY - legendHeight(slices) / 2;
  const pieY = contentCenterY;
  const legend = buildLegend(slices, legendOriginY);

  return (
    <Layout layout={false} width={W} height={H}>
      <Txt
        text={`TCO ~5 AÑOS · ${formatUsd(TCO_TOTAL_USD)} total`}
        fontFamily={theme.pixelFont}
        fontSize={40}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={titleY}
      />
      <HypotheticalDisclaimer x={0} y={titleY + 36} />

      <Circle x={PIE_X} y={pieY} size={PIE + 10} fill={theme.black} />
      {slices.map((slice, i) => (
        <Circle
          key={`${nodeKeyPrefix}-slice-${slice.id}`}
          ref={sliceRefs[i]}
          x={PIE_X}
          y={pieY}
          size={PIE}
          fill={slice.fill}
          startAngle={slice.startAngle}
          endAngle={slice.startAngle}
          closed={true}
        />
      ))}
      {slices.map(slice => (
        <Line
          key={`${nodeKeyPrefix}-div-${slice.id}`}
          x={PIE_X}
          y={pieY}
          points={radialPoints(slice.startAngle)}
          stroke={theme.black}
          lineWidth={theme.border}
          lineCap="butt"
        />
      ))}

      {legend.map(entry => {
        if (entry.type === 'header') {
          return (
            <Txt
              key={`${nodeKeyPrefix}-hdr-${entry.text}`}
              x={LEGEND_X - 220}
              y={entry.y}
              offsetX={-1}
              text={entry.text}
              fontFamily={theme.pixelFont}
              fontSize={22}
              fill={theme.grey}
              textAlign="left"
            />
          );
        }

        const {slice, y} = entry;
        return (
          <Layout
            key={`${nodeKeyPrefix}-leg-${slice.id}`}
            layout={false}
            x={LEGEND_X}
            y={y}
          >
            <Rect
              x={-220}
              width={20}
              height={20}
              fill={slice.fill}
              stroke={theme.black}
              lineWidth={2}
            />
            <Txt
              x={-190}
              offsetX={-1}
              text={`${slice.label} · ${tcoLegendAmount(slice)}`}
              fontFamily={theme.bodyFont}
              fontSize={22}
              fontWeight={500}
              fill={theme.black}
              textAlign="left"
            />
          </Layout>
        );
      })}
    </Layout>
  );
}
