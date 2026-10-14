import {Circle, Layout, Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  beginSlide,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  waitFor,
} from '@motion-canvas/core';
import type {ThreadGenerator} from '@motion-canvas/core';
import {
  WaterDirectGrowthTrendSlide,
  WaterIndirectGrowthTrendSlide,
} from '../components/WaterTrendSlides';
import {
  WATER_HEAT_TEMP_END_C,
  WATER_HEAT_TEMP_START_C,
  WATER_HEAT_THERMO_FILL_MAX,
  WaterDcHeatIntroSlide,
  waterServerSlotScales,
} from '../components/WaterDcHeatIntroSlide';
import {WaterDirectIndirectPieSlide} from '../components/WaterDirectIndirectPieSlide';
import {
  WaterDirectIndirectCompareSlide,
  WaterFact2WithdrawalVsConsumptionSlide,
  WaterFact3MeasurableUsSlide,
  WaterFact4EnergyGrowthAiSlide,
  WaterFact5LocationMattersSlide,
} from '../components/WaterFactsSlides';
import {dcWaterFootprintPieWithAngles} from '../data/dcWaterFootprintPie';
import {dcIndirectWaterTrend} from '../data/dcIndirectWaterTrend';
import {dcWaterTrend} from '../data/dcWaterTrend';
import {createPaso0Shell, loadPaso0Fonts} from './shared/paso0-shell';

export default makeScene2D(function* (view) {
  yield* loadPaso0Fonts();
  const {scrollTo, setFooter, contentW, contentH} = createPaso0Shell(view);

  const tempValue = createRef<Txt>();
  const thermoFill = createRef<Rect>();
  const serverUsageRefs = [0, 1].map(() =>
    [0, 1, 2].map(() => createRef<Rect>()),
  );
  const heatStatus = createRef<Txt>();
  const heatChain = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <WaterDcHeatIntroSlide
          tempValueRef={tempValue}
          thermoFillRef={thermoFill}
          serverUsageRefs={serverUsageRefs}
          statusRef={heatStatus}
          chainRef={heatChain}
        />
      </Layout>,
    );
  });
  setFooter(['berkeley2024', 'leiDcWaterReview2025']);
  yield* beginSlide('agua-calor-gancho');

  heatStatus().text('Carga subiendo · el calor se acumula en el pasillo');

  function* animateServerUsageRise(): ThreadGenerator {
    const steps = 48;
    const duration = 1.4;
    for (let s = 0; s <= steps; s++) {
      const scales = waterServerSlotScales(easeInOutCubic(s / steps));
      for (const rack of serverUsageRefs) {
        rack.forEach((slotRef, i) => slotRef().scale.y(scales[i]));
      }
      if (s < steps) {
        yield* waitFor(duration / steps);
      }
    }
  }

  function* animateTemperatureReadout(): ThreadGenerator {
    const tempRange = WATER_HEAT_TEMP_END_C - WATER_HEAT_TEMP_START_C;
    const steps = 14;
    for (let s = 0; s <= steps; s++) {
      const c = Math.round(WATER_HEAT_TEMP_START_C + (tempRange * s) / steps);
      tempValue().text(`${c} °C`);
      if (s < steps) {
        yield* waitFor(1.25 / steps);
      }
    }
  }

  yield* all(
    thermoFill().height(WATER_HEAT_THERMO_FILL_MAX, 1.4, easeInOutCubic),
    animateServerUsageRise(),
    heatStatus().opacity(1, 0.35),
    heatChain().opacity(1, 1.1),
    animateTemperatureReadout(),
  );

  yield* beginSlide('agua-calor-listo');

  const directLine = createRef<Line>();
  const directInflectionLine = createRef<Line>();
  const directInflectionCaption = createRef<Txt>();
  const directPointRefs = dcWaterTrend.map(() => createRef<Circle>());
  const directLabelRefs = dcWaterTrend.map(() => createRef<Txt>());
  const directNote = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <WaterDirectGrowthTrendSlide
          lineRef={directLine}
          pointRefs={directPointRefs}
          labelRefs={directLabelRefs}
          noteRef={directNote}
          inflectionLineRef={directInflectionLine}
          inflectionCaptionRef={directInflectionCaption}
        />
      </Layout>,
    );
  });
  setFooter([
    'lbnlFigure59DirectWater',
    'lbnlUsDc2024Pdf',
    'dcdLbnlWater2024',
  ]);
  yield* beginSlide('agua-directa-crecimiento');
  yield* directLine().end(1, 1.6, easeOutCubic);
  for (let i = 0; i < dcWaterTrend.length; i++) {
    yield* all(
      directPointRefs[i]().scale(1, 0.2, easeOutCubic),
      directLabelRefs[i]().opacity(dcWaterTrend[i].label ? 1 : 0, 0.2),
    );
  }
  yield* beginSlide('agua-directa-crecimiento-serie');
  yield* all(
    directInflectionLine().opacity(0.75, 0.45),
    directInflectionCaption().opacity(1, 0.45),
    directNote().opacity(1, 0.45),
  );
  yield* beginSlide('agua-directa-crecimiento-listo');

  const indirectLine = createRef<Line>();
  const indirectPointRefs = dcIndirectWaterTrend.map(() => createRef<Circle>());
  const indirectLabelRefs = dcIndirectWaterTrend.map(() => createRef<Txt>());
  const indirectNote = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <WaterIndirectGrowthTrendSlide
          lineRef={indirectLine}
          pointRefs={indirectPointRefs}
          labelRefs={indirectLabelRefs}
          noteRef={indirectNote}
        />
      </Layout>,
    );
  });
  setFooter([
    'lbnlFigure510IndirectWater',
    'lbnlUsDc2024Pdf',
    'berkeley2024',
  ]);
  yield* beginSlide('agua-indirecta-crecimiento');
  yield* indirectLine().end(1, 1.35, easeOutCubic);
  yield* all(
    ...dcIndirectWaterTrend.map((p, i) =>
      all(
        indirectPointRefs[i]().scale(1, 0.22, easeOutCubic),
        indirectLabelRefs[i]().opacity(p.label ? 1 : 0, 0.2),
      ),
    ),
    indirectNote().opacity(1, 0.45),
  );
  yield* beginSlide('agua-indirecta-crecimiento-listo');

  const waterPieSlices = dcWaterFootprintPieWithAngles();
  const waterPieSliceRefs = waterPieSlices.map(() => createRef<Circle>());
  const waterPieCaption = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <WaterDirectIndirectPieSlide
          sliceRefs={waterPieSliceRefs}
          captionRef={waterPieCaption}
        />
      </Layout>,
    );
  });
  setFooter(['lbnlFigure510IndirectWater', 'lbnlFigure59DirectWater', 'lbnlUsDc2024Pdf']);
  yield* beginSlide('agua-directa-indirecta-pie');
  const pieDur = 1;
  yield* all(
    ...waterPieSlices.map((slice, i) =>
      waterPieSliceRefs[i]().endAngle(slice.endAngle, pieDur, easeOutCubic),
    ),
  );
  yield* waterPieCaption().opacity(1, 0.45);
  yield* beginSlide('agua-directa-indirecta-pie-listo');

  const factSlides = [
    {
      node: <WaterFact2WithdrawalVsConsumptionSlide />,
      footer: ['usgsWaterUseTerminology', 'lbnlDcWater2024'],
      marker: 'agua-hecho-1',
    },
    {
      node: <WaterFact3MeasurableUsSlide />,
      footer: ['lbnlDcWater2024', 'lbnlUsDc2024Pdf'],
      marker: 'agua-hecho-2',
    },
    {
      node: <WaterFact4EnergyGrowthAiSlide />,
      footer: ['berkeley2024', 'lbnlUsDc2024Pdf'],
      marker: 'agua-hecho-3',
    },
    {
      node: <WaterFact5LocationMattersSlide />,
      footer: [
        'wriAqueductWaterRisk',
        'leiDcWaterReview2025',
        'googleDatacenterWater',
      ],
      marker: 'agua-hecho-4',
    },
  ] as const;

  for (const slide of factSlides) {
    yield* scrollTo(panel => {
      panel.add(
        <Layout layout={false} width={contentW} height={contentH}>
          {slide.node}
        </Layout>,
      );
    });
    setFooter([...slide.footer]);
    yield* beginSlide(slide.marker);
  }

  const directBar = createRef<Rect>();
  const indirectBar = createRef<Rect>();
  const directLabel = createRef<Txt>();
  const indirectLabel = createRef<Txt>();
  const directValue = createRef<Txt>();
  const indirectValue = createRef<Txt>();
  const caption = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <WaterDirectIndirectCompareSlide
          directBarRef={directBar}
          indirectBarRef={indirectBar}
          directLabelRef={directLabel}
          indirectLabelRef={indirectLabel}
          directValueRef={directValue}
          indirectValueRef={indirectValue}
          captionRef={caption}
        />
      </Layout>,
    );
  });
  setFooter(['lbnlDcWater2024', 'lbnlUsDc2024Pdf', 'berkeley2024']);
  yield* beginSlide('agua-comparacion-directa-indirecta');

  yield* all(
    directBar().scale.y(1, 0.55, easeOutCubic),
    indirectBar().scale.y(1, 0.85, easeOutCubic),
  );
  yield* all(
    directValue().opacity(1, 0.25),
    indirectValue().opacity(1, 0.25),
    directLabel().opacity(1, 0.25),
    indirectLabel().opacity(1, 0.25),
  );
  yield* caption().opacity(1, 0.45);
  yield* beginSlide('agua-comparacion-listo');

});
