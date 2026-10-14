import {Circle, Layout, Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef, easeInOutCubic, easeOutCubic, waitFor} from '@motion-canvas/core';
import {
  CarbonAwareSchedulingSlide,
  GridCarbonImpactSlide,
  hourIndexToX,
} from '../components/CarbonAwareSlides';
import {GRID_CARBON_BEST_HOUR, GRID_CARBON_HOURLY, GRID_CARBON_PEAK_REQUEST_HOUR} from '../data/gridCarbonIntensityDay';
import {
  animateGlobalDcLineDraw,
  GlobalDcEnergyGrowthChart,
  GoogleDcTrendChart,
  MetaDcTrendChart,
} from '../components/GlobalDcEnergySlides';
import {globalDcEnergyTrend} from '../data/globalDcEnergyTrend';
import {googleDcEnergyTrend, metaDcEnergyTrend} from '../data/hyperscalerDcEnergy';
import {createPaso0Shell, loadPaso0Fonts} from './shared/paso0-shell';

export default makeScene2D(function* (view) {
  yield* loadPaso0Fonts();
  const {scrollTo, setFooter, contentW, contentH} = createPaso0Shell(view);

  const globalLine = createRef<Line>();
  const globalForecastLine = createRef<Line>();
  const globalPointRefs = globalDcEnergyTrend.map(() => createRef<Circle>());
  const globalLabelRefs = globalDcEnergyTrend.map(() => createRef<Txt>());
  const globalNote = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <GlobalDcEnergyGrowthChart
          lineRef={globalLine}
          forecastLineRef={globalForecastLine}
          pointRefs={globalPointRefs}
          labelRefs={globalLabelRefs}
          noteRef={globalNote}
        />
      </Layout>,
    );
  });
  setFooter([
    'ieaEnergyAi2025',
    'ieaEnergyAiDemand',
    'ieaKeyQuestionsEnergyAi2026',
    'ieaDcConsumptionChart',
  ]);
  yield* beginSlide('energia-mundo-crecimiento');

  yield* animateGlobalDcLineDraw(globalLine, globalForecastLine, 1.6);
  for (let i = 0; i < globalDcEnergyTrend.length; i++) {
    yield* all(
      globalPointRefs[i]().scale(1, 0.2, easeOutCubic),
      globalLabelRefs[i]().opacity(globalDcEnergyTrend[i].label ? 1 : 0, 0.2),
    );
  }
  yield* beginSlide('energia-mundo-crecimiento-serie');

  yield* globalNote().opacity(1, 0.6);
  yield* beginSlide('energia-mundo-crecimiento-nota');

  const googleLine = createRef<Line>();
  const googlePointRefs = googleDcEnergyTrend.map(() => createRef<Circle>());
  const googleLabelRefs = googleDcEnergyTrend.map(() => createRef<Txt>());
  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <GoogleDcTrendChart
          lineRef={googleLine}
          pointRefs={googlePointRefs}
          labelRefs={googleLabelRefs}
        />
      </Layout>,
    );
  });
  setFooter([
    'googleEnvironmentalReport2026',
    'googleFy2025AssuranceDc',
    'googleEnvironmentalReport2025',
  ]);
  yield* beginSlide('energia-google-grafica');
  yield* googleLine().end(1, 1.6, easeOutCubic);
  for (let i = 0; i < googleDcEnergyTrend.length; i++) {
    yield* all(
      googlePointRefs[i]().scale(1, 0.2, easeOutCubic),
      googleLabelRefs[i]().opacity(googleDcEnergyTrend[i].label ? 1 : 0, 0.2),
    );
  }
  yield* beginSlide('energia-google-grafica-serie');

  const metaLine = createRef<Line>();
  const metaInflectionLine = createRef<Line>();
  const metaInflectionCaption = createRef<Txt>();
  const metaPointRefs = metaDcEnergyTrend.map(() => createRef<Circle>());
  const metaLabelRefs = metaDcEnergyTrend.map(() => createRef<Txt>());

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <MetaDcTrendChart
          lineRef={metaLine}
          pointRefs={metaPointRefs}
          labelRefs={metaLabelRefs}
          inflectionLineRef={metaInflectionLine}
          inflectionCaptionRef={metaInflectionCaption}
        />
      </Layout>,
    );
  });
  setFooter([
    'metaEnvironmentalDataIndex2025',
    'metaSustainabilityData2016',
    'metaSustainabilityData2015',
  ]);
  yield* beginSlide('energia-meta-grafica');
  yield* metaLine().end(1, 1.6, easeOutCubic);
  for (let i = 0; i < metaDcEnergyTrend.length; i++) {
    yield* all(
      metaPointRefs[i]().scale(1, 0.2, easeOutCubic),
      metaLabelRefs[i]().opacity(metaDcEnergyTrend[i].label ? 1 : 0, 0.2),
    );
  }
  yield* beginSlide('energia-meta-grafica-serie');
  yield* all(
    metaInflectionLine().opacity(0.75, 0.45),
    metaInflectionCaption().opacity(1, 0.45),
  );
  yield* beginSlide('energia-meta-grafica-inflection');

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <GridCarbonImpactSlide />
      </Layout>,
    );
  });
  setFooter(['berkeley2024', 'ieaEnergyAi2025']);
  yield* beginSlide('energia-grid-carbon-impact');

  const carbonBars = GRID_CARBON_HOURLY.map(() => createRef<Rect>());
  const carbonPlannedWindow = createRef<Rect>();
  const carbonPlannedLabel = createRef<Txt>();
  const carbonWindow = createRef<Rect>();
  const carbonJob = createRef<Layout>();
  const carbonStatus = createRef<Txt>();
  const carbonSdkHint = createRef<Txt>();
  const carbonScheduleArrow = createRef<Line>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <CarbonAwareSchedulingSlide
          hourBarRefs={carbonBars}
          plannedWindowRef={carbonPlannedWindow}
          plannedLabelRef={carbonPlannedLabel}
          cleanWindowRef={carbonWindow}
          jobRef={carbonJob}
          statusRef={carbonStatus}
          sdkHintRef={carbonSdkHint}
          scheduleArrowRef={carbonScheduleArrow}
        />
      </Layout>,
    );
  });
  setFooter(['garCarbonAwareRouting', 'berkeley2024']);
  yield* beginSlide('energia-carbon-aware');

  yield* all(
    ...carbonBars.map(bar => bar().scale.y(1, 0.9, easeOutCubic)),
  );
  yield* all(
    carbonJob().opacity(1, 0.35, easeOutCubic),
    carbonPlannedWindow().opacity(0.42, 0.35, easeOutCubic),
    carbonPlannedLabel().opacity(1, 0.35, easeOutCubic),
  );
  carbonStatus().text(
    `Plan original ~${String(GRID_CARBON_PEAK_REQUEST_HOUR).padStart(2, '0')}:00 · mix más sucio`,
  );
  yield* beginSlide('energia-carbon-aware-espera');

  yield* all(
    carbonScheduleArrow().opacity(0.85, 0.4, easeOutCubic),
    carbonWindow().opacity(0.35, 0.45, easeOutCubic),
    carbonPlannedWindow().opacity(0.18, 0.35, easeOutCubic),
  );
  carbonStatus().text('Posponer batch · buscando hora con mix más limpio…');
  yield* waitFor(0.25);

  const jobTargetX = hourIndexToX(GRID_CARBON_BEST_HOUR);
  yield* all(
    carbonJob().x(jobTargetX, 1.1, easeInOutCubic),
    carbonJob().y(116, 1.1, easeInOutCubic),
    carbonWindow().opacity(0.55, 0.8, easeOutCubic),
    carbonPlannedWindow().opacity(0, 0.5, easeOutCubic),
    carbonPlannedLabel().opacity(0, 0.4, easeOutCubic),
  );
  carbonStatus().text(
    `Programado ~${String(GRID_CARBON_BEST_HOUR).padStart(2, '0')}:00 · menor intensidad de carbono (ilustrativo)`,
  );
  setFooter(['carbonAwareSdk', 'carbonAwareScheduler']);
  yield* carbonSdkHint().opacity(1, 0.45, easeOutCubic);
  yield* beginSlide('energia-carbon-aware-programado');
  yield* beginSlide('energia-carbon-aware-listo');
});
