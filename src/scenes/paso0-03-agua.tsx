import {Circle, Layout, Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  beginSlide,
  chain,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  linear,
  loopFor,
  spawn,
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
import {
  CLOSED_FLOW_FADE_SEC,
  COOLING_DEMO_LOOP_SEC,
  COOLING_EVAPOR_BUBBLES_PER_PLUME,
  COOLING_EVAPOR_PLUME_GAP_SEC,
  COOLING_EVAPOR_PLUME_SETS,
  COOLING_EVAPOR_PLUME_TAIL_SEC,
  COOLING_EVAPOR_VAPOR_COUNT,
  COOLING_EVAPOR_VAPOR_DRIFT_X,
  COOLING_EVAPOR_VAPOR_RISE,
  COOLING_EVAPOR_VAPOR_SPAWN_X,
  COOLING_EVAPOR_VAPOR_Y,
  COOLING_FLOW_DASH_CYCLE,
  COOLING_FLOW_STEP_SEC,
  DcCoolingTypesSlide,
} from '../components/DcCoolingTypesSlide';
import {WaterDirectIndirectPieSlide} from '../components/WaterDirectIndirectPieSlide';
import {WaterEvaporationLocalSlide} from '../components/WaterEvaporationLocalSlide';
import {
  GOOGLE_PIPE_DASH,
  GOOGLE_PIPE_STEP,
  WaterGoogleReclaimedSlide,
} from '../components/WaterGoogleReclaimedSlide';
import {
  MICROSOFT_LOOP_FLOW_DASH,
  MICROSOFT_LOOP_FLOW_STEP,
  WaterMicrosoftClosedLoopSlide,
} from '../components/WaterMicrosoftClosedLoopSlide';
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

  const evaporVapor = Array.from({length: COOLING_EVAPOR_VAPOR_COUNT}, () =>
    createRef<Circle>(),
  );
  const evaporWater = createRef<Rect>();
  const closedFlow = createRef<Line>();
  const closedPulse = createRef<Circle>();
  const coolingNote = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <DcCoolingTypesSlide
          evaporVaporRefs={evaporVapor}
          evaporWaterRef={evaporWater}
          closedFlowRef={closedFlow}
          closedPulseRef={closedPulse}
          noteRef={coolingNote}
        />
      </Layout>,
    );
  });
  setFooter(['lbnlFigure59DirectWater', 'microsoftDatacenterWue', 'leiDcWaterReview2025']);
  yield* beginSlide('agua-enfriamiento-tipos');

  closedFlow().lineDashOffset(0);

  function* animateEvaporativePlume(setIndex: number): ThreadGenerator {
    const base = setIndex * COOLING_EVAPOR_BUBBLES_PER_PLUME;
    for (let i = 0; i < COOLING_EVAPOR_BUBBLES_PER_PLUME; i++) {
      const spawnX = COOLING_EVAPOR_VAPOR_SPAWN_X[i];
      evaporVapor[base + i]().opacity(0);
      evaporVapor[base + i]().x(spawnX);
      evaporVapor[base + i]().y(COOLING_EVAPOR_VAPOR_Y);
      evaporVapor[base + i]().scale(1);
    }
    yield* all(
      ...Array.from({length: COOLING_EVAPOR_BUBBLES_PER_PLUME}, (_, i) =>
        chain(
          waitFor(i * 0.03),
          all(
            evaporVapor[base + i]().opacity(0.85, 0.12, easeOutCubic),
            evaporVapor[base + i]().y(
              COOLING_EVAPOR_VAPOR_Y - COOLING_EVAPOR_VAPOR_RISE - i * 2,
              0.68,
              easeOutCubic,
            ),
            evaporVapor[base + i]().x(
              COOLING_EVAPOR_VAPOR_SPAWN_X[i] + COOLING_EVAPOR_VAPOR_DRIFT_X[i],
              0.68,
              easeOutCubic,
            ),
            evaporVapor[base + i]().opacity(0, 0.68, easeOutCubic),
          ),
        ),
      ),
    );
  }

  function* animateEvaporativeVaporStream(): ThreadGenerator {
    let plume = 0;
    const spawnWindowSec =
      COOLING_DEMO_LOOP_SEC - COOLING_EVAPOR_PLUME_TAIL_SEC;
    yield* loopFor(spawnWindowSec, function* () {
      const setIndex = plume % COOLING_EVAPOR_PLUME_SETS;
      spawn(function* () {
        yield* animateEvaporativePlume(setIndex);
      });
      plume += 1;
      yield* waitFor(COOLING_EVAPOR_PLUME_GAP_SEC);
    });
    yield* waitFor(COOLING_EVAPOR_PLUME_TAIL_SEC);
  }

  function* animateCoolantFlowLoop(): ThreadGenerator {
    yield* loopFor(COOLING_DEMO_LOOP_SEC, function* () {
      yield* closedFlow().lineDashOffset(
        -COOLING_FLOW_DASH_CYCLE,
        COOLING_FLOW_STEP_SEC,
        linear,
      );
      closedFlow().lineDashOffset(0);
    });
  }

  function* animateClosedPulseLoop(): ThreadGenerator {
    yield* loopFor(COOLING_DEMO_LOOP_SEC, function* () {
      yield* closedPulse().opacity(0.55, 0.22, easeOutCubic);
      yield* all(
        closedPulse().scale(1.22, 0.22, easeOutCubic),
        closedPulse().opacity(0.35, 0.22, easeOutCubic),
      );
      closedPulse().scale(1);
      closedPulse().opacity(0);
      yield* waitFor(0.35);
    });
  }

  yield* all(
    chain(
      waitFor(CLOSED_FLOW_FADE_SEC),
      animateEvaporativeVaporStream(),
    ),
    chain(
      closedFlow().opacity(0.92, CLOSED_FLOW_FADE_SEC, easeOutCubic),
      animateCoolantFlowLoop(),
    ),
    chain(
      waitFor(CLOSED_FLOW_FADE_SEC),
      animateClosedPulseLoop(),
    ),
  );
  yield* coolingNote().opacity(1, 0.45, easeOutCubic);
  yield* beginSlide('agua-enfriamiento-tipos-listo');

  const evapCards = Array.from({length: 3}, () => createRef<Layout>());
  const evapCaption = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <WaterEvaporationLocalSlide cardRefs={evapCards} captionRef={evapCaption} />
      </Layout>,
    );
  });
  setFooter(['usgsWaterUseTerminology', 'wriAqueductWaterRisk', 'leiDcWaterReview2025']);
  for (let i = 0; i < evapCards.length; i++) {
    yield* evapCards[i]().opacity(1, 0.32, easeOutCubic);
    yield* waitFor(0.1);
  }
  yield* evapCaption().opacity(1, 0.4, easeOutCubic);
  yield* beginSlide('agua-evaporacion-local');

  const googleWsaGroup = createRef<Layout>();
  const googleDcGroup = createRef<Layout>();
  const googlePipe = createRef<Line>();
  const googlePipeLabel = createRef<Txt>();
  const googleReturn = createRef<Line>();
  const googleRiverGroup = createRef<Layout>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <WaterGoogleReclaimedSlide
          wsaGroupRef={googleWsaGroup}
          googleGroupRef={googleDcGroup}
          pipeFlowRef={googlePipe}
          pipeLabelRef={googlePipeLabel}
          returnFlowRef={googleReturn}
          riverGroupRef={googleRiverGroup}
        />
      </Layout>,
    );
  });
  setFooter([
    'googleDatacenterWater',
    'googleWaterStewardship2023',
    'googleDouglasReuseWired2012',
  ]);
  googlePipe().lineDashOffset(0);
  yield* all(
    googleWsaGroup().opacity(1, 0.35, easeOutCubic),
    googleDcGroup().opacity(1, 0.35, easeOutCubic),
    googlePipe().opacity(0.95, 0.35, easeOutCubic),
    googlePipeLabel().opacity(1, 0.35, easeOutCubic),
  );
  yield* loopFor(3, function* () {
    yield* googlePipe().lineDashOffset(-GOOGLE_PIPE_DASH, GOOGLE_PIPE_STEP, linear);
    googlePipe().lineDashOffset(0);
  });
  yield* all(
    googleReturn().opacity(0.9, 0.35, easeOutCubic),
    googleRiverGroup().opacity(1, 0.35, easeOutCubic),
  );
  yield* beginSlide('agua-google-reutilizada');

  const msFrame = createRef<Layout>();
  const msLoopTrack = createRef<Line>();
  const msLoopFlow = createRef<Line>();
  const msTimelineMilestones = Array.from({length: 4}, () => createRef<Layout>());
  const msStatGroup = createRef<Layout>();
  const msCaption = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <WaterMicrosoftClosedLoopSlide
          frameRef={msFrame}
          loopTrackRef={msLoopTrack}
          loopFlowRef={msLoopFlow}
          timelineMilestoneRefs={msTimelineMilestones}
          statGroupRef={msStatGroup}
          captionRef={msCaption}
        />
      </Layout>,
    );
  });
  setFooter([
    'microsoftZeroWaterEvapCooling2024',
    'microsoftDatacenterLiquidCooling2024',
    'microsoftNatureCoolingLifecycle2025',
    'dcdMicrosoftClosedLoop2024',
  ]);

  msLoopFlow().lineDashOffset(0);

  function* revealMicrosoftTimeline(): ThreadGenerator {
    for (let i = 0; i < msTimelineMilestones.length; i++) {
      yield* msTimelineMilestones[i]().opacity(1, 0.32, easeOutCubic);
      yield* waitFor(0.1);
    }
  }

  yield* msFrame().opacity(1, 0.4, easeOutCubic);
  yield* all(
    msLoopTrack().opacity(0.22, 0.35, easeOutCubic),
    msLoopFlow().opacity(0.92, 0.35, easeOutCubic),
  );
  yield* all(
    loopFor(4.2, function* () {
      yield* msLoopFlow().lineDashOffset(
        -MICROSOFT_LOOP_FLOW_DASH,
        MICROSOFT_LOOP_FLOW_STEP,
        linear,
      );
      msLoopFlow().lineDashOffset(0);
    }),
    revealMicrosoftTimeline(),
    chain(
      waitFor(0.55),
      msStatGroup().opacity(1, 0.35, easeOutCubic),
      msCaption().opacity(1, 0.4, easeOutCubic),
    ),
  );
  yield* beginSlide('agua-microsoft-circuito-cerrado');
  yield* beginSlide('agua-listo');
});
