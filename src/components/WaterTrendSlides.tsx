import type {Reference} from '@motion-canvas/core';
import type {Circle, Line, Txt as TxtNode} from '@motion-canvas/2d';
import {
  DC_WATER_DIRECT_ACCELERATION_YEAR,
  DC_WATER_DIRECT_GROWTH_FACTOR,
  DC_WATER_DIRECT_GROWTH_PCT,
  dcWaterDirectGrowthSinceAcceleration,
} from '../data/dcWaterDirectGrowth';
import {
  DC_INDIRECT_WATER_BIL_L_MAX,
  DC_INDIRECT_WATER_YEAR_MAX,
  DC_INDIRECT_WATER_YEAR_MIN,
  dcIndirectWaterTrend,
} from '../data/dcIndirectWaterTrend';
import {
  DC_WATER_BIL_L_MAX,
  DC_WATER_YEAR_MAX,
  DC_WATER_YEAR_MIN,
  dcWaterTrend,
} from '../data/dcWaterTrend';
import {MetricTrendChart} from './MetricTrendChart';
import {WATER_SLIDE_LAYOUT_H} from './WaterDcHeatIntroSlide';
import {theme} from '../theme';

const directPoints = dcWaterTrend.map(p => ({
  year: p.year,
  value: p.billionLiters,
  label: p.label,
}));

const indirectPoints = dcIndirectWaterTrend.map(p => ({
  year: p.year,
  value: p.billionLiters,
  label: p.label,
}));

export type WaterTrendSlideProps = {
  lineRef: Reference<Line>;
  pointRefs: Reference<Circle>[];
  labelRefs: Reference<TxtNode>[];
  noteRef: Reference<TxtNode>;
  inflectionLineRef?: Reference<Line>;
  inflectionCaptionRef?: Reference<TxtNode>;
};

const waterDirectInflectionCaption = (() => {
  const a = dcWaterDirectGrowthSinceAcceleration;
  const fmt = (v: number) => String(v).replace('.', ',');
  return `${DC_WATER_DIRECT_ACCELERATION_YEAR}, crecimiento acelerado\n+${a.pct} % (${fmt(a.fromBilL)} → ${fmt(a.toBilL)} mil M L)`;
})();

export function WaterDirectGrowthTrendSlide({
  inflectionLineRef,
  inflectionCaptionRef,
  ...props
}: WaterTrendSlideProps) {
  return (
    <MetricTrendChart
      title="Agua directa en sitio, EE. UU."
      yAxisLabel="mil M L"
      yearMin={DC_WATER_YEAR_MIN}
      yearMax={DC_WATER_YEAR_MAX}
      valueMin={0}
      valueMax={DC_WATER_BIL_L_MAX}
      points={directPoints}
      valueFormat={v => `${v} mil M L`}
      note={`LBNL Fig. 5.9 (modelo, todos los centros de datos): serie histórica 2014–2023 extraída del informe; 21,2 → 66 mil M L (+${DC_WATER_DIRECT_GROWTH_PCT.toFixed(0)} %, ~×${DC_WATER_DIRECT_GROWTH_FACTOR.toFixed(1)}). No es cifra solo de IA.`}
      lineColor={theme.cyan}
      pointColor={theme.magenta}
      inflectionYear={DC_WATER_DIRECT_ACCELERATION_YEAR}
      inflectionLineRef={inflectionLineRef}
      inflectionCaptionRef={inflectionCaptionRef}
      inflectionCaption={waterDirectInflectionCaption}
      {...props}
    />
  );
}

export function WaterIndirectGrowthTrendSlide(props: WaterTrendSlideProps) {
  return (
    <MetricTrendChart
      title="Agua indirecta vía electricidad, EE. UU."
      yAxisLabel="mil M L"
      yearMin={DC_INDIRECT_WATER_YEAR_MIN}
      yearMax={DC_INDIRECT_WATER_YEAR_MAX}
      valueMin={0}
      valueMax={DC_INDIRECT_WATER_BIL_L_MAX}
      points={indirectPoints}
      valueFormat={v => `~${v} mil M L`}
      note="2023: casi 800 mil M L (LBNL Fig. 5.10), agua consumptiva en plantas del mix que alimenta los data centers (térmicas, hidro, etc.), solo sector DC en EE. UU. Años previos: proporcional a TWh DC del mismo informe, calibrado a 2023."
      lineColor={theme.magenta}
      pointColor={theme.cyan}
      {...props}
    />
  );
}

/** Altura compartida con el resto de la escena agua. */
export const WATER_TREND_CHART_LAYOUT_H = WATER_SLIDE_LAYOUT_H;
