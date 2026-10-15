import type {Line, Layout, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {all, beginSlide, easeInOutCubic, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {
  MAGIC_IN_X,
  MAGIC_MACHINE_X,
  MAGIC_ROW_Y,
} from '../../components/AiBehindTheScenes';

export type TranslationPassContext = {
  phraseDockRef: Reference<Layout>;
  phraseFlyRef: Reference<Layout>;
  arrowInRef: Reference<Line>;
  arrowOutRef: Reference<Line>;
  outputRef: Reference<Layout>;
  outputTextRef: Reference<Txt>;
  outputTextLine2Ref: Reference<Txt>;
};

const EN_TRANSLATION_L1 = 'Please send the consolidated report';
const EN_TRANSLATION_L2 = 'before Friday.';

function applyEnglishOutput(ctx: TranslationPassContext, _translatedText: string) {
  ctx.outputTextRef().text(EN_TRANSLATION_L1);
  ctx.outputTextLine2Ref().text(EN_TRANSLATION_L2);
}

export function* runTranslationPass(
  ctx: TranslationPassContext,
  processorRef: Reference<Layout>,
  translatedText: string,
  revealOutput: boolean,
  outputSlideMarker?: string,
) {
  applyEnglishOutput(ctx, translatedText);
  ctx.phraseFlyRef().opacity(0);
  ctx.phraseDockRef().opacity(0);
  ctx.phraseDockRef().scale(0.9);
  ctx.arrowInRef().opacity(0);
  ctx.arrowInRef().end(0);
  ctx.outputRef().opacity(0);
  ctx.outputRef().scale(0.9);
  if (revealOutput) {
    ctx.arrowOutRef().opacity(0);
    ctx.arrowOutRef().end(0);
  }

  yield* all(
    ctx.phraseDockRef().opacity(1, 0.35, easeOutCubic),
    ctx.phraseDockRef().scale(1, 0.4, easeOutBack),
    ctx.arrowInRef().opacity(1, 0.3, easeOutCubic),
    ctx.arrowInRef().end(1, 0.4, easeOutCubic),
  );

  ctx.phraseFlyRef().position([MAGIC_IN_X, MAGIC_ROW_Y]);
  ctx.phraseFlyRef().scale(0.55);
  yield* ctx.phraseFlyRef().opacity(1, 0.15, easeOutCubic);
  yield* all(
    ctx.phraseFlyRef().x(MAGIC_MACHINE_X, 0.55, easeInOutCubic),
    ctx.phraseFlyRef().y(MAGIC_ROW_Y, 0.55, easeInOutCubic),
    ctx.phraseFlyRef().scale(0.35, 0.55, easeInOutCubic),
  );
  yield* all(
    ctx.phraseFlyRef().opacity(0, 0.2, easeOutCubic),
    processorRef().scale(1.06, 0.2, easeInOutCubic),
  );
  yield* processorRef().scale(1, 0.25, easeOutCubic);

  if (revealOutput) {
    yield* all(
      ctx.arrowOutRef().opacity(1, 0.25, easeOutCubic),
      ctx.arrowOutRef().end(1, 0.4, easeOutCubic),
      ctx.outputRef().opacity(1, 0.4, easeOutCubic),
      ctx.outputRef().scale(1, 0.45, easeOutBack),
    );
    if (outputSlideMarker) {
      yield* beginSlide(outputSlideMarker);
    }
  } else {
    yield* all(
      ctx.arrowOutRef().opacity(1, 0.2, easeOutCubic),
      ctx.arrowOutRef().end(1, 0.35, easeOutCubic),
      ctx.outputRef().opacity(1, 0.35, easeOutCubic),
      ctx.outputRef().scale(1, 0.4, easeOutBack),
    );
  }
}

export {swapProcessor} from './classification-pass';
