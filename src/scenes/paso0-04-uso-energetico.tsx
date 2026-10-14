import {Circle, Layout, Line, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef, easeOutCubic} from '@motion-canvas/core';
import {
  animateGlobalDcLineDraw,
  GlobalDcEnergyGrowthChart,
  GoogleDcTrendChart,
  MetaDcTrendChart,
} from '../components/GlobalDcEnergySlides';
import {CarbonAwareWorkshopBridgeSlide} from '../components/SustainableAiUseSlides';
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
        <CarbonAwareWorkshopBridgeSlide />
      </Layout>,
    );
  });
  setFooter(['garCarbonAwareRouting', 'berkeley2024']);
  yield* beginSlide('energia-carbon-aware');
  yield* beginSlide('energia-carbon-aware-listo');
});
