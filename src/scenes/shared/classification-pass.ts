import type {Line, Layout, Rect} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {all, beginSlide, easeInOutCubic, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {
  CLASSIFY_BUCKET_COUNT,
  CLASSIFY_BUCKETS_X,
  CLASSIFY_IN_X,
  CLASSIFY_MACHINE_X,
  CLASSIFY_ROW_Y,
  CLASSIFY_URGENT_BUCKET_INDEX,
  classifyBucketY,
} from '../../components/IncomingMailClassificationDemo';
import {theme} from '../../theme';

export type ClassificationPassContext = {
  messageDockRef: Reference<Layout>;
  messageFlyRef: Reference<Layout>;
  arrowInRef: Reference<Line>;
  arrowOutRef: Reference<Line>;
  bucketRefs: Reference<Layout>[];
  bucketFillRefs: Reference<Rect>[];
};

export function* resetBucketHighlights(ctx: ClassificationPassContext) {
  for (let i = 0; i < CLASSIFY_BUCKET_COUNT; i++) {
    ctx.bucketFillRefs[i]().fill(theme.white);
    ctx.bucketRefs[i]().scale(1);
  }
  ctx.messageFlyRef().opacity(0);
}

export function* runClassificationPass(
  ctx: ClassificationPassContext,
  machineRef: Reference<Layout>,
  revealBuckets: boolean,
  bucketsSlideMarker?: string,
) {
  yield* resetBucketHighlights(ctx);
  ctx.messageDockRef().opacity(0);
  ctx.messageDockRef().scale(0.9);
  ctx.arrowInRef().opacity(0);
  ctx.arrowInRef().end(0);
  if (revealBuckets) {
    ctx.arrowOutRef().opacity(0);
    ctx.arrowOutRef().end(0);
    for (let i = 0; i < CLASSIFY_BUCKET_COUNT; i++) {
      ctx.bucketRefs[i]().opacity(0);
      ctx.bucketRefs[i]().scale(0.92);
    }
  }

  yield* all(
    ctx.messageDockRef().opacity(1, 0.35, easeOutCubic),
    ctx.messageDockRef().scale(1, 0.4, easeOutBack),
    ctx.arrowInRef().opacity(1, 0.3, easeOutCubic),
    ctx.arrowInRef().end(1, 0.4, easeOutCubic),
  );

  ctx.messageFlyRef().position([CLASSIFY_IN_X, CLASSIFY_ROW_Y]);
  ctx.messageFlyRef().scale(0.55);
  yield* ctx.messageFlyRef().opacity(1, 0.15, easeOutCubic);
  yield* all(
    ctx.messageFlyRef().x(CLASSIFY_MACHINE_X, 0.55, easeInOutCubic),
    ctx.messageFlyRef().y(CLASSIFY_ROW_Y, 0.55, easeInOutCubic),
    ctx.messageFlyRef().scale(0.32, 0.55, easeInOutCubic),
  );
  yield* all(
    ctx.messageFlyRef().opacity(0, 0.2, easeOutCubic),
    machineRef().scale(1.06, 0.2, easeInOutCubic),
  );
  yield* machineRef().scale(1, 0.25, easeOutCubic);

  if (revealBuckets) {
    yield* all(
      ctx.arrowOutRef().opacity(1, 0.25, easeOutCubic),
      ctx.arrowOutRef().end(1, 0.4, easeOutCubic),
      ...ctx.bucketRefs.map(b => b().opacity(1, 0.35, easeOutCubic)),
      ...ctx.bucketRefs.map(b => b().scale(1, 0.4, easeOutBack)),
    );
    if (bucketsSlideMarker) {
      yield* beginSlide(bucketsSlideMarker);
    }
  }

  const urgent = CLASSIFY_URGENT_BUCKET_INDEX;
  ctx.messageFlyRef().position([CLASSIFY_MACHINE_X, CLASSIFY_ROW_Y]);
  ctx.messageFlyRef().scale(0.32);
  yield* ctx.messageFlyRef().opacity(1, 0.15, easeOutCubic);
  yield* all(
    ctx.messageFlyRef().x(CLASSIFY_BUCKETS_X, 0.55, easeInOutCubic),
    ctx.messageFlyRef().y(classifyBucketY(urgent), 0.55, easeInOutCubic),
    ctx.messageFlyRef().scale(0.22, 0.55, easeInOutCubic),
    ctx.bucketFillRefs[urgent]().fill(theme.cyan, 0.55, easeOutCubic),
    ctx.bucketRefs[urgent]().scale(1.06, 0.55, easeOutBack),
  );
  yield* ctx.messageFlyRef().opacity(0, 0.2, easeOutCubic);
}

export function* swapProcessor(
  fromRef: Reference<Layout>,
  toRef: Reference<Layout>,
) {
  yield* all(
    fromRef().opacity(0, 0.45, easeOutCubic),
    fromRef().scale(0.85, 0.45, easeOutCubic),
  );
  yield* all(
    toRef().opacity(1, 0.45, easeOutCubic),
    toRef().scale(1, 0.5, easeOutBack),
  );
}
