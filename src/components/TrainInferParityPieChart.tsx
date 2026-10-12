import {Circle, Layout, Line, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {
  formatParityAmount,
  type ParitySliceAngles,
  type ParityUnit,
} from '../data/trainInferParity';
import {theme} from '../theme';

/** Train vs infer — pie a la izquierda, leyenda a la derecha (ángulos proporcionales al USD). */
const W = 620;
const H = 320;
const PIE = 220;
const PIE_R = PIE / 2;
const PIE_X = -155;
const LEGEND_X = 75;
/** Leyenda de 2 ítems; infer puede llevar 2 o 3 líneas. */
const ITEM_STEP = 68;
const SWATCH = 20;

function radialPoints(angleDeg: number): [number, number][] {
  const a = (angleDeg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [
    [c * 1, s * 1],
    [c * PIE_R, s * PIE_R],
  ];
}

type TrainInferParityPieChartProps = {
  keyPrefix: string;
  unit: ParityUnit;
  slices: ParitySliceAngles[];
  sliceRefs: Reference<Circle>[];
  /** Segunda línea bajo “Entrenamiento”. */
  trainDetail: string;
  inferAmountDetail: string;
  inferVolumeDetail?: string;
  /** Texto bajo el pie; por defecto suma de porciones. */
  totalCaption?: string;
};

export function TrainInferParityPieChart({
  keyPrefix,
  unit,
  slices,
  sliceRefs,
  trainDetail,
  inferAmountDetail,
  inferVolumeDetail,
  totalCaption,
}: TrainInferParityPieChartProps) {
  const pieY = 0;
  const legendOriginY = pieY - ((slices.length - 1) * ITEM_STEP) / 2;
  const totalAmount = slices.reduce((sum, s) => sum + s.amount, 0);
  const pieFooter =
    totalCaption ??
    `Total · ${formatParityAmount(totalAmount, unit)}`;

  return (
    <Layout layout={false} width={W} height={H}>
      <Circle x={PIE_X} y={pieY} size={PIE + 10} fill={theme.black} />
      {slices.map((slice, i) => (
        <Circle
          key={`${keyPrefix}-pie-${slice.id}`}
          ref={sliceRefs[i]}
          x={PIE_X}
          y={pieY}
          size={PIE}
          fill={slice.fill}
          startAngle={slice.startAngle}
          endAngle={slice.startAngle}
          closed={true}
        />
      ))}
      {slices.map(slice => (
        <Line
          key={`${keyPrefix}-div-${slice.id}`}
          x={PIE_X}
          y={pieY}
          points={radialPoints(slice.startAngle)}
          stroke={theme.black}
          lineWidth={theme.border}
          lineCap="butt"
        />
      ))}

      <Txt
        text={pieFooter}
        fontFamily={theme.bodyFont}
        fontSize={17}
        fontWeight={600}
        fill={theme.black}
        x={PIE_X}
        y={pieY + PIE_R + 30}
        textAlign="center"
      />

      {slices.map((slice, i) => {
        const y = legendOriginY + i * ITEM_STEP;
        const isInfer = slice.kind === 'infer';
        const line2 = isInfer ? inferAmountDetail : trainDetail;
        const line3 = isInfer ? inferVolumeDetail?.trim() : '';

        return (
          <Layout
            key={`${keyPrefix}-leg-${slice.id}`}
            layout={false}
            x={LEGEND_X}
            y={y}
          >
            <Rect
              x={-28}
              y={-SWATCH / 2}
              width={SWATCH}
              height={SWATCH}
              fill={slice.fill}
              stroke={theme.black}
              lineWidth={2}
            />
            <Txt
              x={0}
              offsetX={-1}
              y={-22}
              text={slice.label}
              fontFamily={theme.bodyFont}
              fontSize={19}
              fontWeight={600}
              fill={theme.black}
              textAlign="left"
              width={340}
            />
            <Txt
              x={0}
              offsetX={-1}
              y={2}
              text={line2}
              fontFamily={theme.bodyFont}
              fontSize={17}
              fontWeight={500}
              fill={theme.grey}
              textAlign="left"
              width={340}
            />
            {line3 ? (
              <Txt
                x={0}
                offsetX={-1}
                y={24}
                text={line3}
                fontFamily={theme.bodyFont}
                fontSize={17}
                fontWeight={500}
                fill={theme.grey}
                textAlign="left"
                width={340}
              />
            ) : null}
          </Layout>
        );
      })}
    </Layout>
  );
}
