import {Circle, Layout, Line, Txt} from '@motion-canvas/2d';
import type {Reference, ThreadGenerator} from '@motion-canvas/core';
import {tween} from '@motion-canvas/core';
import type {Line as LineNode, Txt as TxtNode} from '@motion-canvas/2d';
import {
  GLOBAL_DC_CAGR_2017_PCT,
  GLOBAL_DC_FORECAST_FROM_YEAR,
  GLOBAL_DC_GROWTH_FACTOR_2017_2025,
  GLOBAL_DC_GROWTH_PCT_2017_2025,
  GLOBAL_DC_SHARE_2030_PCT,
  GLOBAL_DC_TWH_2017_EST,
  GLOBAL_DC_TWH_2025,
  GLOBAL_DC_TWH_MAX,
  GLOBAL_DC_YEAR_MAX,
  GLOBAL_DC_YEAR_MIN,
  globalDcEnergyTrend,
} from '../data/globalDcEnergyTrend';
import {
  GOOGLE_DC_TWH_MAX,
  GOOGLE_DC_YEAR_MAX,
  GOOGLE_DC_YEAR_MIN,
  googleDcEnergyTrend,
  hyperscalerGrowthFactor,
  hyperscalerGrowthPct,
  showCompanyYearTick,
  META_DC_ACCELERATION_YEAR,
  META_DC_LATEST_PUBLISHED_YEAR,
  META_DC_TWH_MAX,
  META_DC_YEAR_MAX,
  META_DC_YEAR_MIN,
  metaDcEnergyTrend,
  metaGrowthSinceAcceleration,
  type HyperscalerEnergyPoint,
} from '../data/hyperscalerDcEnergy';
import {theme} from '../theme';

const CHART_X = -480;
/** Eje X del gráfico — más abajo que PUE para dejar título + subtítulo arriba. */
const CHART_Y = 210;
const CHART_W = 900;
const CHART_H = 400;

function xForYear(year: number): number {
  return CHART_X + ((year - GLOBAL_DC_YEAR_MIN) / (GLOBAL_DC_YEAR_MAX - GLOBAL_DC_YEAR_MIN)) * CHART_W;
}

function yForTwh(twh: number): number {
  return CHART_Y - (twh / GLOBAL_DC_TWH_MAX) * CHART_H;
}

function linePtsForTrend(
  points: typeof globalDcEnergyTrend,
): [number, number][] {
  return points.map(p => [xForYear(p.year), yForTwh(p.twh)]);
}

export const globalDcHistoricalPoints = globalDcEnergyTrend.filter(
  p => p.year <= GLOBAL_DC_FORECAST_FROM_YEAR,
);
export const globalDcForecastPoints = globalDcEnergyTrend.filter(
  p => p.year >= GLOBAL_DC_FORECAST_FROM_YEAR,
);

export function globalDcHistoricalLinePoints(): [number, number][] {
  return linePtsForTrend(globalDcHistoricalPoints);
}

export function globalDcForecastLinePoints(): [number, number][] {
  return linePtsForTrend(globalDcForecastPoints);
}

function polylineLength(pts: [number, number][]): number {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i - 1][0];
    const dy = pts[i][1] - pts[i - 1][1];
    len += Math.hypot(dx, dy);
  }
  return len;
}

/** Un solo trazo continuo: sólido hasta 2025, punteado después, misma velocidad visual. */
export function* animateGlobalDcLineDraw(
  historicalRef: Reference<LineNode>,
  forecastRef: Reference<LineNode>,
  durationSec: number,
): ThreadGenerator {
  const histLen = polylineLength(globalDcHistoricalLinePoints());
  const foreLen = polylineLength(globalDcForecastLinePoints());
  const histShare = histLen / (histLen + foreLen);

  yield* tween(durationSec, value => {
    if (value <= histShare) {
      historicalRef().end(histShare > 0 ? value / histShare : 1);
      forecastRef().end(0);
    } else {
      historicalRef().end(1);
      const foreT = (value - histShare) / (1 - histShare);
      forecastRef().end(foreT);
    }
  });
}

export type GlobalDcEnergyGrowthChartProps = {
  lineRef: Reference<LineNode>;
  forecastLineRef: Reference<LineNode>;
  pointRefs: Reference<Circle>[];
  labelRefs: Reference<TxtNode>[];
  noteRef: Reference<TxtNode>;
};

export function GlobalDcEnergyGrowthChart({
  lineRef,
  forecastLineRef,
  pointRefs,
  labelRefs,
  noteRef,
}: GlobalDcEnergyGrowthChartProps) {
  const historicalPts = globalDcHistoricalLinePoints();
  const forecastPts = globalDcForecastLinePoints();

  return (
    <Layout layout={false} width={1600} height={760}>
      <Txt
        text="Consumo eléctrico mundial — centros de datos"
        fontFamily={theme.pixelFont}
        fontSize={36}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-330}
      />
      <Txt
        text={`${GLOBAL_DC_TWH_2025} TWh en 2025 — estimación IEA más reciente`}
        fontFamily={theme.bodyFont}
        fontSize={22}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-268}
        width={1200}
      />
      <Txt
        text={`2017 → 2025: ~${GLOBAL_DC_TWH_2017_EST} TWh a ${GLOBAL_DC_TWH_2025} TWh (+~${GLOBAL_DC_GROWTH_PCT_2017_2025} %, ~×${GLOBAL_DC_GROWTH_FACTOR_2017_2025.toFixed(1)}, ~${GLOBAL_DC_CAGR_2017_PCT} %/año, IEA)`}
        fontFamily={theme.bodyFont}
        fontSize={20}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-228}
        width={1240}
        lineHeight={30}
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
        text="TWh/año"
        fontFamily={theme.bodyFont}
        fontSize={18}
        fill={theme.grey}
        textAlign="right"
        width={72}
        x={CHART_X - 10}
        y={CHART_Y - CHART_H - 26}
      />
      <Txt
        text="1000"
        fontFamily={theme.bodyFont}
        fontSize={18}
        fill={theme.grey}
        textAlign="right"
        width={72}
        x={CHART_X - 10}
        y={yForTwh(1000) - 9}
      />
      <Txt
        text="500"
        fontFamily={theme.bodyFont}
        fontSize={18}
        fill={theme.grey}
        textAlign="right"
        width={72}
        x={CHART_X - 10}
        y={yForTwh(500) - 9}
      />
      <Txt
        text={String(GLOBAL_DC_YEAR_MIN)}
        fontFamily={theme.bodyFont}
        fontSize={18}
        fill={theme.grey}
        x={xForYear(GLOBAL_DC_YEAR_MIN)}
        y={CHART_Y + 28}
      />
      <Txt
        text="2025"
        fontFamily={theme.bodyFont}
        fontSize={18}
        fill={theme.grey}
        x={xForYear(2025)}
        y={CHART_Y + 28}
      />
      <Txt
        text={String(GLOBAL_DC_YEAR_MAX)}
        fontFamily={theme.bodyFont}
        fontSize={18}
        fill={theme.grey}
        x={xForYear(GLOBAL_DC_YEAR_MAX)}
        y={CHART_Y + 28}
      />

      <Line
        ref={lineRef}
        points={historicalPts}
        stroke={theme.cyan}
        lineWidth={5}
        lineCap="round"
        lineJoin="round"
        end={0}
      />
      <Line
        ref={forecastLineRef}
        points={forecastPts}
        stroke={theme.cyan}
        lineWidth={5}
        lineCap="round"
        lineJoin="round"
        lineDash={[14, 10]}
        end={0}
      />

      {globalDcEnergyTrend.map((p, i) => (
        <Layout key={`gdc-${p.year}`} layout={false}>
          <Circle
            ref={pointRefs[i]}
            x={xForYear(p.year)}
            y={yForTwh(p.twh)}
            size={p.label ? 16 : 12}
            fill={p.projected ? theme.white : theme.magenta}
            stroke={theme.black}
            lineWidth={2}
            scale={0}
          />
          <Txt
            ref={labelRefs[i]}
            text={p.label ? `${p.twh} TWh` : ''}
            fontFamily={theme.bodyFont}
            fontSize={18}
            fontWeight={700}
            fill={theme.black}
            x={xForYear(p.year)}
            y={yForTwh(p.twh) - 26}
            opacity={0}
          />
        </Layout>
      ))}

      <Txt
        ref={noteRef}
        text={`Tramo punteado: proyección IEA (${GLOBAL_DC_TWH_2025} TWh en 2025 → ~945 TWh en 2030, ~${GLOBAL_DC_SHARE_2030_PCT} % global).\n2017 y años intermedios: tendencia ~${GLOBAL_DC_CAGR_2017_PCT} %/año hacia 2025; 2024–2025 son anclas IEA publicadas.`}
        fontFamily={theme.bodyFont}
        fontSize={24}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={CHART_Y + 88}
        width={1200}
        lineHeight={34}
        opacity={0}
      />
    </Layout>
  );
}

const CO_CHART_X = -480;
const CO_CHART_Y = 210;
const CO_CHART_W = 900;
const CO_CHART_H = 400;

function coX(year: number, yearMin: number, yearMax: number): number {
  return CO_CHART_X + ((year - yearMin) / (yearMax - yearMin)) * CO_CHART_W;
}

function coY(twh: number, twhMax: number): number {
  return CO_CHART_Y - (twh / twhMax) * CO_CHART_H;
}

function companyLinePoints(
  trend: HyperscalerEnergyPoint[],
  yearMin: number,
  yearMax: number,
  twhMax: number,
): [number, number][] {
  return trend.map(p => [coX(p.year, yearMin, yearMax), coY(p.twh, twhMax)]);
}

export type CompanyDcTrendChartProps = {
  lineRef: Reference<LineNode>;
  pointRefs: Reference<Circle>[];
  labelRefs: Reference<TxtNode>[];
  inflectionLineRef?: Reference<LineNode>;
  inflectionCaptionRef?: Reference<TxtNode>;
  company: 'Google' | 'Meta';
};

function CompanyDcTrendChart({
  lineRef,
  pointRefs,
  labelRefs,
  inflectionLineRef,
  inflectionCaptionRef,
  company,
}: CompanyDcTrendChartProps) {
  const isGoogle = company === 'Google';
  const trend = isGoogle ? googleDcEnergyTrend : metaDcEnergyTrend;
  const yearMin = isGoogle ? GOOGLE_DC_YEAR_MIN : META_DC_YEAR_MIN;
  const yearMax = isGoogle ? GOOGLE_DC_YEAR_MAX : META_DC_YEAR_MAX;
  const twhMax = isGoogle ? GOOGLE_DC_TWH_MAX : META_DC_TWH_MAX;
  const lineColor = isGoogle ? theme.cyan : theme.magenta;
  const pointColor = isGoogle ? theme.cyan : theme.magenta;
  const first = trend[0];
  const last = trend[trend.length - 1];
  const growthPct = hyperscalerGrowthPct(trend);
  const growthFactor = hyperscalerGrowthFactor(trend);
  const linePts = companyLinePoints(trend, yearMin, yearMax, twhMax);
  const metaHighlightYears = !isGoogle ? [META_DC_ACCELERATION_YEAR] : [];
  const inflectionX = !isGoogle
    ? coX(META_DC_ACCELERATION_YEAR, yearMin, yearMax)
    : 0;
  const accel = !isGoogle ? metaGrowthSinceAcceleration : null;

  const yTickHigh = twhMax;
  const yTickMid = Math.round(twhMax / 2);

  return (
    <Layout layout={false} width={1600} height={760}>
      <Txt
        text={`Casos reales: ${company}`}
        fontFamily={theme.pixelFont}
        fontSize={36}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-330}
      />
      <Txt
        text={
          isGoogle
            ? 'Electricidad en data centers — Google (desglose anual; dato 2025 en informe 2026)'
            : `Electricidad en data centers — Meta (último total DC publicado: ${META_DC_LATEST_PUBLISHED_YEAR})`
        }
        fontFamily={theme.bodyFont}
        fontSize={22}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-268}
        width={1200}
      />
      <Txt
        text={`${first.year} → ${last.year}: ${first.twh} TWh a ${last.twh} TWh (+${growthPct} %, ~×${growthFactor})`}
        fontFamily={theme.bodyFont}
        fontSize={20}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-228}
        width={1240}
      />

      <Line
        points={[
          [CO_CHART_X, CO_CHART_Y],
          [CO_CHART_X + CO_CHART_W, CO_CHART_Y],
        ]}
        stroke={theme.black}
        lineWidth={3}
      />
      <Line
        points={[
          [CO_CHART_X, CO_CHART_Y],
          [CO_CHART_X, CO_CHART_Y - CO_CHART_H],
        ]}
        stroke={theme.black}
        lineWidth={3}
      />

      <Txt
        text="TWh/año"
        fontFamily={theme.bodyFont}
        fontSize={18}
        fill={theme.grey}
        textAlign="right"
        width={72}
        x={CO_CHART_X - 10}
        y={CO_CHART_Y - CO_CHART_H - 26}
      />
      <Txt
        text={String(yTickHigh)}
        fontFamily={theme.bodyFont}
        fontSize={18}
        fill={theme.grey}
        textAlign="right"
        width={72}
        x={CO_CHART_X - 10}
        y={coY(yTickHigh, twhMax) - 9}
      />
      <Txt
        text={String(yTickMid)}
        fontFamily={theme.bodyFont}
        fontSize={18}
        fill={theme.grey}
        textAlign="right"
        width={72}
        x={CO_CHART_X - 10}
        y={coY(yTickMid, twhMax) - 9}
      />

      {!isGoogle && inflectionLineRef ? (
        <Line
          ref={inflectionLineRef}
          points={[
            [inflectionX, CO_CHART_Y],
            [inflectionX, CO_CHART_Y - CO_CHART_H],
          ]}
          stroke={theme.black}
          lineWidth={2}
          lineDash={[10, 8]}
          opacity={0}
        />
      ) : null}

      {trend.map(p =>
        showCompanyYearTick(p.year, yearMin, yearMax, metaHighlightYears) ? (
          <Txt
            key={`yr-${p.year}`}
            text={String(p.year)}
            fontFamily={theme.bodyFont}
            fontSize={16}
            fill={theme.grey}
            x={coX(p.year, yearMin, yearMax)}
            y={CO_CHART_Y + 28}
          />
        ) : null,
      )}

      <Line
        ref={lineRef}
        points={linePts}
        stroke={lineColor}
        lineWidth={5}
        lineCap="round"
        lineJoin="round"
        end={0}
      />

      {!isGoogle && inflectionCaptionRef && accel ? (
        <Txt
          ref={inflectionCaptionRef}
          text={`${META_DC_ACCELERATION_YEAR} — crecimiento acelerado\n+${accel.pct} % (${accel.fromTwh} → ${accel.toTwh} TWh)`}
          fontFamily={theme.bodyFont}
          fontSize={16}
          fontWeight={700}
          fill={theme.black}
          textAlign="center"
          lineHeight={24}
          width={320}
          x={inflectionX}
          y={CO_CHART_Y + 56}
          opacity={0}
        />
      ) : null}

      {trend.map((p, i) => (
        <Layout key={`co-${p.year}`} layout={false}>
          <Circle
            ref={pointRefs[i]}
            x={coX(p.year, yearMin, yearMax)}
            y={coY(p.twh, twhMax)}
            size={12}
            fill={pointColor}
            stroke={theme.black}
            lineWidth={2}
            scale={0}
          />
          <Txt
            ref={labelRefs[i]}
            text={`${p.twh}`}
            fontFamily={theme.bodyFont}
            fontSize={16}
            fontWeight={700}
            fill={theme.black}
            x={coX(p.year, yearMin, yearMax)}
            y={coY(p.twh, twhMax) - 22}
            opacity={0}
          />
        </Layout>
      ))}
    </Layout>
  );
}

export function GoogleDcTrendChart(props: Omit<CompanyDcTrendChartProps, 'company'>) {
  return <CompanyDcTrendChart {...props} company="Google" />;
}

export function MetaDcTrendChart(props: Omit<CompanyDcTrendChartProps, 'company'>) {
  return <CompanyDcTrendChart {...props} company="Meta" />;
}
