import {Layout, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {theme} from '../theme';

export const NEUBRUTAL_FACT_CARD_W = 920;
export const NEUBRUTAL_FACT_CARD_H = 100;
export const NEUBRUTAL_FACT_CARD_GAP = 22;

const BODY_TEAL = theme.pie[0];

export type NeubrutalFactCardProps = {
  title: string;
  body: string;
  cardRef?: Reference<Layout>;
  y: number;
  opacity?: number;
};

/** Tarjeta blanca, borde grueso, sombra sólida — estilo facts de la charla. */
export function NeubrutalFactCard({
  title,
  body,
  cardRef,
  y,
  opacity = 1,
}: NeubrutalFactCardProps) {
  const s = theme.shadow;
  const padX = 28;
  const textW = NEUBRUTAL_FACT_CARD_W - padX * 2;

  return (
    <Layout ref={cardRef} layout={false} y={y} opacity={opacity}>
      <Rect
        width={NEUBRUTAL_FACT_CARD_W}
        height={NEUBRUTAL_FACT_CARD_H}
        fill={theme.black}
        x={s}
        y={s}
      />
      <Rect
        width={NEUBRUTAL_FACT_CARD_W}
        height={NEUBRUTAL_FACT_CARD_H}
        fill={theme.white}
        stroke={theme.black}
        lineWidth={3}
      />
      <Txt
        text={title}
        fontFamily={theme.bodyFont}
        fontSize={22}
        fontWeight={700}
        fill={theme.black}
        textAlign="left"
        offsetX={-1}
        width={textW}
        x={-NEUBRUTAL_FACT_CARD_W / 2 + padX}
        y={-18}
      />
      <Txt
        text={body}
        fontFamily={theme.bodyFont}
        fontSize={18}
        fontWeight={600}
        fill={BODY_TEAL}
        textAlign="left"
        offsetX={-1}
        width={textW}
        lineHeight={24}
        x={-NEUBRUTAL_FACT_CARD_W / 2 + padX}
        y={12}
      />
    </Layout>
  );
}
