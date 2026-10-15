import {Layout, Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {
  all,
  beginSlide,
  createRef,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
} from '@motion-canvas/core';
import {
  RightQuestionSlide,
  WorkAiToolSlide,
} from '../components/AiUseRecommendationsSlides';
import {
  EMAIL_DEMO_IN_X,
  EMAIL_DEMO_MACHINE_X,
  EMAIL_DEMO_ROW_Y,
  EmailLlmValidationDemo,
} from '../components/EmailLlmValidationDemo';
import {
  CLASSIFY_BUCKET_COUNT,
  IncomingMailClassificationDemo,
} from '../components/IncomingMailClassificationDemo';
import {ContextualReplyDemo} from '../components/ContextualReplyDemo';
import {PhraseTranslationDemo} from '../components/PhraseTranslationDemo';
import {
  runClassificationPass,
  swapProcessor,
  type ClassificationPassContext,
} from './shared/classification-pass';
import {
  runReplyPass,
  type ReplyDraft,
  type ReplyPassContext,
} from './shared/reply-pass';
import {
  runTranslationPass,
  type TranslationPassContext,
} from './shared/translation-pass';
import {theme} from '../theme';
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

  const emailDockRef = createRef<Layout>();
  const emailAddressRef = createRef<Txt>();
  const emailFlyRef = createRef<Layout>();
  const emailFlyAddressRef = createRef<Txt>();
  const arrowInRef = createRef<Line>();
  const arrowOutRef = createRef<Line>();
  const llmGroupRef = createRef<Layout>();
  const regexGroupRef = createRef<Layout>();
  const responseGroupRef = createRef<Layout>();
  const responseBadgeRef = createRef<Rect>();
  const responseTextRef = createRef<Txt>();
  const solutionHintRef = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <EmailLlmValidationDemo
          emailDockRef={emailDockRef}
          emailAddressRef={emailAddressRef}
          emailFlyRef={emailFlyRef}
          emailFlyAddressRef={emailFlyAddressRef}
          arrowInRef={arrowInRef}
          arrowOutRef={arrowOutRef}
          llmGroupRef={llmGroupRef}
          regexGroupRef={regexGroupRef}
          responseGroupRef={responseGroupRef}
          responseBadgeRef={responseBadgeRef}
          responseTextRef={responseTextRef}
          solutionHintRef={solutionHintRef}
        />
      </Layout>,
    );
  });
  setFooter(['chiSmallerModel2025']);

  yield* all(
    llmGroupRef().opacity(1, 0.4, easeOutCubic),
    llmGroupRef().scale(1, 0.45, easeOutBack),
  );
  yield* beginSlide('recomendaciones-email-llm');

  regexGroupRef().opacity(0);
  regexGroupRef().scale(0.85);

  function* runEmailCase(
    address: string,
    response: string,
    badgeFill: string,
    machineRef: Reference<Layout>,
  ) {
    emailAddressRef().text(address);
    emailFlyAddressRef().text(address);
    responseTextRef().text(response);
    responseBadgeRef().fill(badgeFill);

    emailDockRef().opacity(0);
    emailDockRef().scale(0.9);
    emailFlyRef().opacity(0);
    arrowInRef().opacity(0);
    arrowInRef().end(0);
    arrowOutRef().opacity(0);
    arrowOutRef().end(0);
    responseGroupRef().opacity(0);
    responseGroupRef().scale(0.9);

    yield* all(
      emailDockRef().opacity(1, 0.35, easeOutCubic),
      emailDockRef().scale(1, 0.4, easeOutBack),
      arrowInRef().opacity(1, 0.3, easeOutCubic),
      arrowInRef().end(1, 0.4, easeOutCubic),
    );

    emailFlyRef().position([EMAIL_DEMO_IN_X, EMAIL_DEMO_ROW_Y]);
    emailFlyRef().scale(0.55);
    yield* emailFlyRef().opacity(1, 0.15, easeOutCubic);
    yield* all(
      emailFlyRef().x(EMAIL_DEMO_MACHINE_X, 0.55, easeInOutCubic),
      emailFlyRef().y(EMAIL_DEMO_ROW_Y, 0.55, easeInOutCubic),
      emailFlyRef().scale(0.35, 0.55, easeInOutCubic),
    );
    yield* all(
      emailFlyRef().opacity(0, 0.2, easeOutCubic),
      machineRef().scale(1.06, 0.2, easeInOutCubic),
    );
    yield* machineRef().scale(1, 0.25, easeOutCubic);

    yield* all(
      arrowOutRef().opacity(1, 0.25, easeOutCubic),
      arrowOutRef().end(1, 0.4, easeOutCubic),
      responseGroupRef().opacity(1, 0.4, easeOutCubic),
      responseGroupRef().scale(1, 0.45, easeOutBack),
    );
  }

  yield* runEmailCase(
    'maria.garcia@empresa.com',
    'Respuesta: sí, parece un correo válido',
    theme.cyan,
    llmGroupRef,
  );
  yield* beginSlide('recomendaciones-email-valido');
  yield* runEmailCase(
    'ejemplo.com',
    'Respuesta: no, no es un correo válido',
    '#FFE8E8',
    llmGroupRef,
  );
  yield* beginSlide('recomendaciones-email-regex');

  yield* all(
    responseGroupRef().opacity(0, 0.3, easeOutCubic),
    arrowOutRef().opacity(0, 0.25, easeOutCubic),
    arrowOutRef().end(0, 0.25, easeOutCubic),
    llmGroupRef().opacity(0, 0.45, easeOutCubic),
    llmGroupRef().scale(0.85, 0.45, easeOutCubic),
  );
  yield* all(
    regexGroupRef().opacity(1, 0.45, easeOutCubic),
    regexGroupRef().scale(1, 0.5, easeOutBack),
  );
  yield* beginSlide('recomendaciones-email-regex-demo');

  yield* runEmailCase(
    'ejemplo.com',
    'Resultado: inválido (regex)',
    '#FFE8E8',
    regexGroupRef,
  );
  yield* solutionHintRef().opacity(1, 0.4, easeOutCubic);
  yield* beginSlide('recomendaciones-email-llm-listo');

  const messageDockRef = createRef<Layout>();
  const messageFlyRef = createRef<Layout>();
  const classifyArrowInRef = createRef<Line>();
  const classifyArrowOutRef = createRef<Line>();
  const programRef = createRef<Layout>();
  const classifyLlmRef = createRef<Layout>();
  const classifyClassifierRef = createRef<Layout>();
  const bucketRefs = Array.from({length: CLASSIFY_BUCKET_COUNT}, () =>
    createRef<Layout>(),
  );
  const bucketFillRefs = Array.from({length: CLASSIFY_BUCKET_COUNT}, () =>
    createRef<Rect>(),
  );
  const bucketLabelRefs = Array.from({length: CLASSIFY_BUCKET_COUNT}, () =>
    createRef<Txt>(),
  );

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <IncomingMailClassificationDemo
          messageDockRef={messageDockRef}
          messageFlyRef={messageFlyRef}
          arrowInRef={classifyArrowInRef}
          arrowOutRef={classifyArrowOutRef}
          programRef={programRef}
          llmGroupRef={classifyLlmRef}
          classifierGroupRef={classifyClassifierRef}
          bucketRefs={bucketRefs}
          bucketFillRefs={bucketFillRefs}
          bucketLabelRefs={bucketLabelRefs}
        />
      </Layout>,
    );
  });
  setFooter(['chiSmallerModel2025']);

  classifyLlmRef().opacity(0);
  classifyLlmRef().scale(0.85);
  classifyClassifierRef().opacity(0);
  classifyClassifierRef().scale(0.85);

  yield* all(
    programRef().opacity(1, 0.4, easeOutCubic),
    programRef().scale(1, 0.45, easeOutBack),
  );
  yield* beginSlide('recomendaciones-clasificacion');

  const classifyCtx: ClassificationPassContext = {
    messageDockRef,
    messageFlyRef,
    arrowInRef: classifyArrowInRef,
    arrowOutRef: classifyArrowOutRef,
    bucketRefs,
    bucketFillRefs,
  };

  yield* runClassificationPass(
    classifyCtx,
    programRef,
    true,
    'recomendaciones-clasificacion-cubetas',
  );
  yield* beginSlide('recomendaciones-clasificacion-listo');

  yield* beginSlide('recomendaciones-clasificacion-llm');
  yield* swapProcessor(programRef, classifyLlmRef);
  yield* runClassificationPass(classifyCtx, classifyLlmRef, false);

  yield* beginSlide('recomendaciones-clasificacion-jev');
  yield* swapProcessor(classifyLlmRef, classifyClassifierRef);
  yield* runClassificationPass(classifyCtx, classifyClassifierRef, false);
  yield* beginSlide('recomendaciones-clasificacion-engine-listo');

  const phraseDockRef = createRef<Layout>();
  const phraseFlyRef = createRef<Layout>();
  const translateArrowInRef = createRef<Line>();
  const translateArrowOutRef = createRef<Line>();
  const traductorRef = createRef<Layout>();
  const translateOpusRef = createRef<Layout>();
  const googleTranslateRef = createRef<Layout>();
  const translateGeminiRef = createRef<Layout>();
  const almaModelRef = createRef<Layout>();
  const translationOutputRef = createRef<Layout>();
  const translationOutputTextRef = createRef<Txt>();
  const translationOutputTextLine2Ref = createRef<Txt>();
  const translationOutputLabelRef = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <PhraseTranslationDemo
          phraseDockRef={phraseDockRef}
          phraseFlyRef={phraseFlyRef}
          arrowInRef={translateArrowInRef}
          arrowOutRef={translateArrowOutRef}
          traductorRef={traductorRef}
          opusModelRef={translateOpusRef}
          googleTranslateRef={googleTranslateRef}
          geminiModelRef={translateGeminiRef}
          almaModelRef={almaModelRef}
          outputRef={translationOutputRef}
          outputTextRef={translationOutputTextRef}
          outputTextLine2Ref={translationOutputTextLine2Ref}
          outputLabelRef={translationOutputLabelRef}
        />
      </Layout>,
    );
  });
  setFooter(['chiSmallerModel2025']);

  for (const r of [
    translateOpusRef,
    googleTranslateRef,
    translateGeminiRef,
    almaModelRef,
  ]) {
    r().opacity(0);
    r().scale(0.85);
  }

  yield* all(
    traductorRef().opacity(1, 0.4, easeOutCubic),
    traductorRef().scale(1, 0.45, easeOutBack),
  );
  yield* beginSlide('recomendaciones-traduccion');

  const translationCtx: TranslationPassContext = {
    phraseDockRef,
    phraseFlyRef,
    arrowInRef: translateArrowInRef,
    arrowOutRef: translateArrowOutRef,
    outputRef: translationOutputRef,
    outputTextRef: translationOutputTextRef,
    outputTextLine2Ref: translationOutputTextLine2Ref,
  };

  const translateEn =
    'Please send the consolidated report before Friday.';
  translationOutputLabelRef().text('Traducción · inglés');
  translationOutputTextRef().text('Please send the consolidated report');
  translationOutputTextLine2Ref().text('before Friday.');

  yield* runTranslationPass(
    translationCtx,
    traductorRef,
    translateEn,
    true,
    'recomendaciones-traduccion-salida',
  );
  yield* beginSlide('recomendaciones-traduccion-traductor-listo');

  yield* beginSlide('recomendaciones-traduccion-opus');
  yield* swapProcessor(traductorRef, translateOpusRef);
  yield* runTranslationPass(translationCtx, translateOpusRef, translateEn, false);

  yield* beginSlide('recomendaciones-traduccion-google');
  yield* swapProcessor(translateOpusRef, googleTranslateRef);
  yield* runTranslationPass(translationCtx, googleTranslateRef, translateEn, false);

  yield* beginSlide('recomendaciones-traduccion-gemini');
  yield* swapProcessor(googleTranslateRef, translateGeminiRef);
  yield* runTranslationPass(translationCtx, translateGeminiRef, translateEn, false);

  yield* beginSlide('recomendaciones-traduccion-alma');
  yield* swapProcessor(translateGeminiRef, almaModelRef);
  yield* runTranslationPass(translationCtx, almaModelRef, translateEn, false);
  yield* beginSlide('recomendaciones-traduccion-listo');

  const replyMessageDockRef = createRef<Layout>();
  const replyMessageFlyRef = createRef<Layout>();
  const replyArrowInRef = createRef<Line>();
  const replyArrowOutRef = createRef<Line>();
  const replyProgramaRef = createRef<Layout>();
  const replyLlmRef = createRef<Layout>();
  const replyResponseRef = createRef<Layout>();
  const replyResponseBadgeRef = createRef<Rect>();
  const replyResponseLine1Ref = createRef<Txt>();
  const replyResponseLine2Ref = createRef<Txt>();
  const replyResponseLine3Ref = createRef<Txt>();
  const replyTakeawayRef = createRef<Layout>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <ContextualReplyDemo
          messageDockRef={replyMessageDockRef}
          messageFlyRef={replyMessageFlyRef}
          arrowInRef={replyArrowInRef}
          arrowOutRef={replyArrowOutRef}
          programaRef={replyProgramaRef}
          llmRef={replyLlmRef}
          responseRef={replyResponseRef}
          responseBadgeRef={replyResponseBadgeRef}
          responseLine1Ref={replyResponseLine1Ref}
          responseLine2Ref={replyResponseLine2Ref}
          responseLine3Ref={replyResponseLine3Ref}
          takeawayRef={replyTakeawayRef}
        />
      </Layout>,
    );
  });
  setFooter(['chiSmallerModel2025']);

  replyLlmRef().opacity(0);
  replyLlmRef().scale(0.85);
  yield* all(
    replyProgramaRef().opacity(1, 0.4, easeOutCubic),
    replyProgramaRef().scale(1, 0.45, easeOutBack),
  );
  yield* beginSlide('recomendaciones-respuesta');

  const replyCtx: ReplyPassContext = {
    messageDockRef: replyMessageDockRef,
    messageFlyRef: replyMessageFlyRef,
    arrowInRef: replyArrowInRef,
    arrowOutRef: replyArrowOutRef,
    responseRef: replyResponseRef,
    responseLine1Ref: replyResponseLine1Ref,
    responseLine2Ref: replyResponseLine2Ref,
    responseLine3Ref: replyResponseLine3Ref,
    responseBadgeRef: replyResponseBadgeRef,
  };

  const replyProgramaDraft: ReplyDraft = {
    line1: 'Visite ayuda.empresa.com/',
    line2: 'facturación, FAQ de pagos.',
    badgeFill: '#FFE8E8',
  };
  const replyLlmDraft: ReplyDraft = {
    line1: 'Hola, confirmamos el doble cargo de ayer.',
    line2: 'Cliente 8842: reembolso en 3–5 días;',
    line3: 'no hace falta llamar.',
    badgeFill: theme.cyan,
  };

  yield* runReplyPass(
    replyCtx,
    replyProgramaRef,
    replyProgramaDraft,
    'recomendaciones-respuesta-programa',
  );
  yield* swapProcessor(replyProgramaRef, replyLlmRef);
  yield* runReplyPass(
    replyCtx,
    replyLlmRef,
    replyLlmDraft,
    'recomendaciones-respuesta-llm',
  );
  yield* replyTakeawayRef().opacity(1, 0.4, easeOutCubic);
  yield* beginSlide('recomendaciones-respuesta-listo');

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <RightQuestionSlide />
      </Layout>,
    );
  });
  setFooter(['chiSmallerModel2025', 'frugalGpt2023']);
  yield* beginSlide('recomendaciones-pregunta-correcta');

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <WorkAiToolSlide />
      </Layout>,
    );
  });
  setFooter(['chiSmallerModel2025']);
  yield* beginSlide('recomendaciones-herramienta-trabajo');
  yield* beginSlide('recomendaciones-listo');
});
