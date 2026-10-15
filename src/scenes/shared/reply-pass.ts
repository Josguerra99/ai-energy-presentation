import type {Layout, Line, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {all, beginSlide, easeInOutCubic, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {
  MAGIC_IN_X,
  MAGIC_MACHINE_X,
  MAGIC_ROW_Y,
} from '../../components/AiBehindTheScenes';

export type ReplyDraft = {
  line1: string;
  line2: string;
  line3?: string;
  badgeFill: string;
};

export type ReplyPassContext = {
  messageDockRef: Reference<Layout>;
  messageFlyRef: Reference<Layout>;
  arrowInRef: Reference<Line>;
  arrowOutRef: Reference<Line>;
  responseRef: Reference<Layout>;
  responseLine1Ref: Reference<Txt>;
  responseLine2Ref: Reference<Txt>;
  responseLine3Ref: Reference<Txt>;
  responseBadgeRef: Reference<Rect>;
};

export function applyReplyDraft(ctx: ReplyPassContext, draft: ReplyDraft) {
  ctx.responseLine1Ref().text(draft.line1);
  ctx.responseLine2Ref().text(draft.line2);
  const line3 = draft.line3?.trim() ?? '';
  ctx.responseLine3Ref().text(line3);
  ctx.responseLine3Ref().opacity(line3 ? 1 : 0);
  ctx.responseBadgeRef().fill(draft.badgeFill);
}

export function* runReplyPass(
  ctx: ReplyPassContext,
  processorRef: Reference<Layout>,
  draft: ReplyDraft,
  outputSlideMarker?: string,
) {
  applyReplyDraft(ctx, draft);
  ctx.messageFlyRef().opacity(0);
  ctx.messageDockRef().opacity(0);
  ctx.messageDockRef().scale(0.9);
  ctx.arrowInRef().opacity(0);
  ctx.arrowInRef().end(0);
  ctx.responseRef().opacity(0);
  ctx.responseRef().scale(0.9);
  ctx.arrowOutRef().opacity(0);
  ctx.arrowOutRef().end(0);

  yield* all(
    ctx.messageDockRef().opacity(1, 0.35, easeOutCubic),
    ctx.messageDockRef().scale(1, 0.4, easeOutBack),
    ctx.arrowInRef().opacity(1, 0.3, easeOutCubic),
    ctx.arrowInRef().end(1, 0.4, easeOutCubic),
  );

  ctx.messageFlyRef().position([MAGIC_IN_X, MAGIC_ROW_Y]);
  ctx.messageFlyRef().scale(0.55);
  yield* ctx.messageFlyRef().opacity(1, 0.15, easeOutCubic);
  yield* all(
    ctx.messageFlyRef().x(MAGIC_MACHINE_X, 0.55, easeInOutCubic),
    ctx.messageFlyRef().y(MAGIC_ROW_Y, 0.55, easeInOutCubic),
    ctx.messageFlyRef().scale(0.35, 0.55, easeInOutCubic),
  );
  yield* all(
    ctx.messageFlyRef().opacity(0, 0.2, easeOutCubic),
    processorRef().scale(1.06, 0.2, easeInOutCubic),
  );
  yield* processorRef().scale(1, 0.25, easeOutCubic);

  yield* all(
    ctx.arrowOutRef().opacity(1, 0.25, easeOutCubic),
    ctx.arrowOutRef().end(1, 0.4, easeOutCubic),
    ctx.responseRef().opacity(1, 0.4, easeOutCubic),
    ctx.responseRef().scale(1, 0.45, easeOutBack),
  );
  if (outputSlideMarker) {
    yield* beginSlide(outputSlideMarker);
  }
}
