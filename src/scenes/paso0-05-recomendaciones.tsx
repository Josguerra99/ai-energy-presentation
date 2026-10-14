import {Layout, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {
  NeedIaForThisSlide,
  RightQuestionSlide,
  RightSizedModelSlide,
  SmartRoutingArchitectureSlide,
} from '../components/AiUseRecommendationsSlides';
import {Paso0ChapterTitleCard} from '../components/Paso0ChapterTitleCard';
import {createPaso0Shell, loadPaso0Fonts} from './shared/paso0-shell';

export default makeScene2D(function* (view) {
  yield* loadPaso0Fonts();
  const {scrollTo, setFooter, contentW, contentH} = createPaso0Shell(view);

  const chapterCard = createRef<Layout>();
  const chapterTitle = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <Paso0ChapterTitleCard
          cardRef={chapterCard}
          titleRef={chapterTitle}
          title="Recomendaciones"
          kicker="Parte 8"
          tagline="Cómo reducir costos cuando usamos IA"
        />
      </Layout>,
    );
  });
  setFooter([]);
  yield* all(
    chapterCard().opacity(1, 0.55, easeOutCubic),
    chapterCard().scale(1, 0.55, easeOutBack),
  );
  yield* beginSlide('recomendaciones-inicio');

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <NeedIaForThisSlide />
      </Layout>,
    );
  });
  setFooter(['chiSmallerModel2025']);
  yield* beginSlide('recomendaciones-necesitamos-ia');

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <RightSizedModelSlide />
      </Layout>,
    );
  });
  setFooter(['chiSmallerModel2025', 'llmEnergyAccuracy2025']);
  yield* beginSlide('recomendaciones-modelo-adecuado');

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <SmartRoutingArchitectureSlide />
      </Layout>,
    );
  });
  setFooter(['frugalGpt2023']);
  yield* beginSlide('recomendaciones-routing');

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <RightQuestionSlide />
      </Layout>,
    );
  });
  setFooter(['chiSmallerModel2025', 'frugalGpt2023']);
  yield* beginSlide('recomendaciones-pregunta-correcta');
  yield* beginSlide('recomendaciones-listo');
});
