import {Layout, type View2D} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic} from '@motion-canvas/core';
import type {ThreadGenerator} from '@motion-canvas/core';
import {loadPresentationFonts} from '../../fonts';
import {SourceFooter} from '../../components/SourceFooter';
import {slide, theme} from '../../theme';
import type {Paso0SceneContext} from '../sections/paso0-scene-context';

export const SCROLL_Y = 980;
export const SCROLL_DURATION = 0.7;
export const PASO0_CONTENT_H =
  slide.height - slide.paddingY * 2 - slide.footerHeight - 20;
export const PASO0_CONTENT_W = slide.width - slide.paddingX * 2;

export function* loadPaso0Fonts(): ThreadGenerator {
  yield* loadPresentationFonts();
}

/** Monta viewport amarillo, área de contenido con clip y pie de fuentes. */
export function createPaso0Shell(view: View2D): Paso0SceneContext {
  view.fill(theme.yellow);

  const content = createRef<Layout>();
  const footer = createRef<Layout>();

  view.add(
    <Layout layout={false} width={slide.width} height={slide.height}>
      <Layout
        ref={content}
        layout={false}
        clip
        width={PASO0_CONTENT_W}
        height={PASO0_CONTENT_H}
        x={0}
        y={-(slide.footerHeight + 20) / 2}
      />
      <Layout
        ref={footer}
        layout
        direction="column"
        width={PASO0_CONTENT_W}
        height={slide.footerHeight}
        x={0}
        y={slide.height / 2 - slide.paddingY - slide.footerHeight / 2}
      >
        <SourceFooter sourceIds={[]} />
      </Layout>
    </Layout>,
  );

  function setFooter(sourceIds: string[]) {
    footer().removeChildren();
    footer().add(<SourceFooter sourceIds={sourceIds} />);
  }

  function* scrollTo(fill: (panel: Layout) => void) {
    const outgoing =
      content().children().length > 0
        ? (content().children()[0] as Layout)
        : null;

    const incoming = createRef<Layout>();
    content().add(
      <Layout
        ref={incoming}
        layout={false}
        width={PASO0_CONTENT_W}
        height={PASO0_CONTENT_H}
        y={outgoing ? SCROLL_Y : 0}
      />,
    );
    fill(incoming());

    if (outgoing) {
      yield* all(
        outgoing.y(-SCROLL_Y, SCROLL_DURATION, easeInOutCubic),
        incoming().y(0, SCROLL_DURATION, easeInOutCubic),
      );
      outgoing.remove();
    }
  }

  return {
    contentW: PASO0_CONTENT_W,
    contentH: PASO0_CONTENT_H,
    scrollTo,
    setFooter,
  };
}
