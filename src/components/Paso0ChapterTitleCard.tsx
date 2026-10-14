import {Layout, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {theme} from '../theme';

const CARD_W = 1180;
const CARD_H = 320;
const PIXEL = 12;
const PIXEL_GAP = 5;

const TOP_PIXELS = [
  theme.black,
  theme.cyan,
  theme.magenta,
  theme.yellow,
  theme.pie[0],
  theme.cyan,
  theme.magenta,
  theme.black,
  theme.pie[2],
  theme.cyan,
] as const;

function PixelRow({colors, y}: {colors: readonly string[]; y: number}) {
  const span = colors.length * PIXEL + (colors.length - 1) * PIXEL_GAP;
  return (
    <Layout layout={false} y={y}>
      {colors.map((fill, i) => (
        <Rect
          key={`${y}-${i}`}
          x={-span / 2 + PIXEL / 2 + i * (PIXEL + PIXEL_GAP)}
          width={PIXEL}
          height={PIXEL}
          fill={fill}
          stroke={theme.black}
          lineWidth={2}
        />
      ))}
    </Layout>
  );
}

function CornerPixels({x, y, flipX, flipY}: {x: number; y: number; flipX: 1 | -1; flipY: 1 | -1}) {
  const unit = PIXEL + 2;
  const offsets = [
    [0, 0],
    [unit * flipX, 0],
    [0, unit * flipY],
    [unit * flipX, unit * flipY],
  ] as const;
  const fills = [theme.cyan, theme.magenta, theme.magenta, theme.cyan];
  return (
    <Layout layout={false} x={x} y={y}>
      {offsets.map(([ox, oy], i) => (
        <Rect
          key={`c-${i}`}
          x={ox}
          y={oy}
          width={PIXEL}
          height={PIXEL}
          fill={fills[i]}
          stroke={theme.black}
          lineWidth={2}
        />
      ))}
    </Layout>
  );
}

export type Paso0ChapterTitleCardProps = {
  cardRef: Reference<Layout>;
  titleRef: Reference<Txt>;
  title: string;
  /** Etiqueta superior (p. ej. “Parte 2”). */
  kicker?: string;
  tagline?: string;
};

/**
 * Title card centrada — sombra dura, marco pixel y acentos del sitio.
 */
export function Paso0ChapterTitleCard({
  cardRef,
  titleRef,
  title,
  kicker,
  tagline,
}: Paso0ChapterTitleCardProps) {
  const titleY = tagline ? -18 : -8;
  const taglineY = 52;

  return (
    <Layout ref={cardRef} layout={false} opacity={0} scale={0.92}>
      <CornerPixels x={-CARD_W / 2 - 36} y={-CARD_H / 2 - 28} flipX={1} flipY={1} />
      <CornerPixels x={CARD_W / 2 + 36} y={-CARD_H / 2 - 28} flipX={-1} flipY={1} />
      <CornerPixels x={-CARD_W / 2 - 36} y={CARD_H / 2 + 28} flipX={1} flipY={-1} />
      <CornerPixels x={CARD_W / 2 + 36} y={CARD_H / 2 + 28} flipX={-1} flipY={-1} />

      <Rect width={CARD_W} height={CARD_H} fill={theme.black} x={theme.shadow + 2} y={theme.shadow + 2} />
      <Rect
        width={CARD_W}
        height={CARD_H}
        fill={theme.white}
        stroke={theme.black}
        lineWidth={theme.border}
      />

      <Rect
        width={CARD_W - 32}
        height={14}
        y={-CARD_H / 2 + 22}
        fill={theme.cyan}
        stroke={theme.black}
        lineWidth={2}
      />
      <Rect
        width={CARD_W - 32}
        height={6}
        y={CARD_H / 2 - 20}
        fill={theme.magenta}
        stroke={theme.black}
        lineWidth={2}
      />

      <PixelRow colors={TOP_PIXELS} y={-CARD_H / 2 + 58} />

      {kicker ? (
        <Layout layout={false} y={-CARD_H / 2 + 98}>
          <Rect width={168} height={40} fill={theme.black} x={4} y={4} />
          <Rect
            width={168}
            height={40}
            fill={theme.yellow}
            stroke={theme.black}
            lineWidth={2}
          />
          <Txt
            text={kicker.toUpperCase()}
            fontFamily={theme.pixelFont}
            fontSize={22}
            fill={theme.black}
            textAlign="center"
            y={-2}
          />
        </Layout>
      ) : null}

      <Txt
        ref={titleRef}
        text={title}
        fontFamily={theme.pixelFont}
        fontSize={56}
        fill={theme.black}
        textAlign="center"
        width={CARD_W - 80}
        lineHeight={68}
        y={titleY}
      />

      {tagline ? (
        <Txt
          text={tagline}
          fontFamily={theme.pixelFont}
          fontSize={26}
          fill={theme.grey}
          textAlign="center"
          width={CARD_W - 100}
          lineHeight={34}
          y={taglineY}
        />
      ) : null}

      <PixelRow colors={[...TOP_PIXELS].reverse()} y={CARD_H / 2 - 52} />
    </Layout>
  );
}
