import {Circle, Layout, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {Paso0ChapterTitleCard} from '../components/Paso0ChapterTitleCard';
import {
  COST_HIGHLIGHT_OPACITY,
  LlmCostCompareScaleSlide,
  LlmDeepSeekTrainVsInferSlide,
  LlmPromptCostSlide,
  LlmTrainingModelSlide,
  TRAINING_MODEL_PROFILES,
} from '../components/LlmIndustrialCostSlides';
import {deepSeekTrainVsInferPieWithAngles} from '../data/deepSeekTrainVsInfer';
import {createPaso0Shell, loadPaso0Fonts} from './shared/paso0-shell';

export default makeScene2D(function* (view) {
  yield* loadPaso0Fonts();
  const {scrollTo, setFooter, contentW, contentH} = createPaso0Shell(view);

  const costosChapterCard = createRef<Layout>();
  const costosChapterTitle = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <Paso0ChapterTitleCard
          cardRef={costosChapterCard}
          titleRef={costosChapterTitle}
          title="Costos"
          kicker="Parte 5"
          tagline="Entrenamiento, inferencia y estimaciones públicas"
        />
      </Layout>,
    );
  });
  setFooter([]);
  yield* all(
    costosChapterCard().opacity(1, 0.55, easeOutCubic),
    costosChapterCard().scale(1, 0.55, easeOutBack),
  );
  yield* beginSlide('costos-inicio');

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <LlmCostCompareScaleSlide />
      </Layout>,
    );
  });
  setFooter(['ieeeTco']);
  yield* beginSlide('ia-costos-comparacion');

  for (const trainProfile of TRAINING_MODEL_PROFILES) {
    const trainRunHighlight = createRef<Rect>();
    const trainCapexHighlight = createRef<Rect>();
    yield* scrollTo(panel => {
      panel.add(
        <Layout layout={false} width={contentW} height={contentH}>
          <LlmTrainingModelSlide
            profile={trainProfile}
            runHighlightRef={trainRunHighlight}
            capexHighlightRef={trainCapexHighlight}
          />
        </Layout>,
      );
    });
    setFooter([...trainProfile.footerIds]);
    yield* beginSlide(trainProfile.slideId);

    const highlightRun = trainProfile.facts.some(f => f.costHighlight === 'run');
    const highlightCapex = trainProfile.facts.some(
      f => f.costHighlight === 'capex',
    );

    if (highlightRun) {
      yield* trainRunHighlight().opacity(
        COST_HIGHLIGHT_OPACITY,
        0.4,
        easeOutCubic,
      );
      yield* beginSlide(`${trainProfile.slideId}-coste-run`);
    }

    if (highlightCapex) {
      if (highlightRun) {
        yield* all(
          trainRunHighlight().opacity(0, 0.25, easeOutCubic),
          trainCapexHighlight().opacity(
            COST_HIGHLIGHT_OPACITY,
            0.4,
            easeOutCubic,
          ),
        );
      } else {
        yield* trainCapexHighlight().opacity(
          COST_HIGHLIGHT_OPACITY,
          0.4,
          easeOutCubic,
        );
      }
      yield* beginSlide(`${trainProfile.slideId}-coste-capex`);
    }
  }

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <LlmPromptCostSlide />
      </Layout>,
    );
  });
  setFooter([
    'googleGeminiPricing',
    'openAiPricingDocs',
    'anthropicPricing',
    'deepSeekApiPricing',
    'metaLlamaApiHosted',
  ]);
  yield* beginSlide('ia-costos-prompt');

  const trainInferPieSlices = deepSeekTrainVsInferPieWithAngles();
  const trainInferPieRefs = trainInferPieSlices.map(() => createRef<Circle>());
  const trainInferPieWrap = createRef<Layout>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <Layout ref={trainInferPieWrap} layout={false} opacity={0}>
          <LlmDeepSeekTrainVsInferSlide pieSliceRefs={trainInferPieRefs} />
        </Layout>
      </Layout>,
    );
  });
  setFooter(['deepSeekV3Paper', 'deepSeekApiPricing', 'nistDeepSeekEval2025']);
  yield* beginSlide('ia-costos-train-vs-infer-deepseek');

  const trainInferPieDur = 1;
  yield* all(
    trainInferPieWrap().opacity(1, trainInferPieDur * 0.85, easeOutCubic),
    ...trainInferPieSlices.map((slice, i) =>
      trainInferPieRefs[i]().endAngle(slice.endAngle, trainInferPieDur, easeOutCubic),
    ),
  );
  yield* beginSlide('ia-costos-train-vs-infer-deepseek-listo');
});
