import {Circle, Layout, Line, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {
  DC_WATER_FOOTPRINT_TOTAL_BIL_L_2023,
  dcWaterFootprintPieWithAngles,
  dcWaterFootprintPieYear,
  dcWaterFootprintSharePct,
} from '../data/dcWaterFootprintPie';
import {
  US_DC_WATER_DIRECT_BIL_L_2023,
  US_DC_WATER_INDIRECT_BIL_L_2023,
} from '../data/usDcWaterFootprint';
import {WATER_SLIDE_LAYOUT_H} from './WaterDcHeatIntroSlide';
import {theme} from '../theme';

/** Pie a la izquierda; leyenda a la derecha — sin solapar (ver TrainInferParityPieChart). */
const PIE = 240;
const PIE_R = PIE / 2;
const PIE_X = -300;
const LEGEND_X = 140;
const ITEM_STEP = 88;
const SWATCH = 22;
const LEGEND_TEXT_W = 480;

const slices = dcWaterFootprintPieWithAngles();

function radialPoints(angleDeg: number): [number, number][] {
  const a = (angleDeg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [
    [c * 1, s * 1],
    [c * PIE_R, s * PIE_R],
  ];
}

export type WaterDirectIndirectPieSlideProps = {
  sliceRefs: Reference<Circle>[];
  captionRef: Reference<Txt>;
};

export function WaterDirectIndirectPieSlide({
  sliceRefs,
  captionRef,
}: WaterDirectIndirectPieSlideProps) {
  const pieY = -10;
  const legendOriginY = pieY - ITEM_STEP / 2;
  const directPct = dcWaterFootprintSharePct(true);
  const indirectPct = dcWaterFootprintSharePct(false);

  const legendRows = [
    {
      id: 'direct',
      fill: theme.cyan,
      title: 'Directo — refrigeración en el edificio',
      value: `${US_DC_WATER_DIRECT_BIL_L_2023} mil M L · ${directPct} %`,
    },
    {
      id: 'indirect',
      fill: theme.magenta,
      title: 'Indirecto — plantas eléctricas del mix regional',
      value: `~${US_DC_WATER_INDIRECT_BIL_L_2023} mil M L · ${indirectPct} %`,
    },
  ] as const;

  return (
    <Layout layout={false} width={1680} height={WATER_SLIDE_LAYOUT_H}>
      <Txt
        text="Huella hídrica operativa — ¿dónde está el agua?"
        fontFamily={theme.pixelFont}
        fontSize={34}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-318}
        width={1500}
      />
      <Txt
        text={`EE. UU., centros de datos, ${dcWaterFootprintPieYear} — LBNL-2001637 (mil millones de litros/año)`}
        fontFamily={theme.bodyFont}
        fontSize={21}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-262}
        width={1300}
      />

      <Layout layout={false} x={0} y={48}>
        <Circle x={PIE_X} y={pieY} size={PIE + 12} fill={theme.black} />
        {slices.map((slice, i) => (
          <Circle
            key={`dc-water-pie-${slice.id}`}
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
            key={`dc-water-div-${slice.id}`}
            x={PIE_X}
            y={pieY}
            points={radialPoints(slice.startAngle)}
            stroke={theme.black}
            lineWidth={theme.border}
            lineCap="butt"
          />
        ))}

        {legendRows.map((row, i) => {
          const y = legendOriginY + i * ITEM_STEP;
          return (
            <Layout key={row.id} layout={false} x={LEGEND_X} y={y}>
              <Rect
                x={-32}
                y={-SWATCH / 2}
                width={SWATCH}
                height={SWATCH}
                fill={row.fill}
                stroke={theme.black}
                lineWidth={2}
              />
              <Txt
                x={0}
                offsetX={-1}
                y={-24}
                text={row.title}
                fontFamily={theme.bodyFont}
                fontSize={19}
                fontWeight={700}
                fill={theme.black}
                textAlign="left"
                width={LEGEND_TEXT_W}
              />
              <Txt
                x={0}
                offsetX={-1}
                y={4}
                text={row.value}
                fontFamily={theme.bodyFont}
                fontSize={18}
                fill={theme.black}
                textAlign="left"
                width={LEGEND_TEXT_W}
              />
            </Layout>
          );
        })}

        <Txt
          text={`Total modelado ≈ ${DC_WATER_FOOTPRINT_TOTAL_BIL_L_2023} mil M L/año`}
          fontFamily={theme.bodyFont}
          fontSize={18}
          fontWeight={600}
          fill={theme.black}
          x={PIE_X}
          y={pieY + PIE_R + 40}
          textAlign="center"
        />
      </Layout>

      <Txt
        ref={captionRef}
        text="Indirecto = agua consumptiva al generar la electricidad que usan los data centers (térmicas, nuclear, evaporación en embalses hidro, etc.), según dónde están ubicados y el mix de la red — no es agua en tubería hacia el rack. Solo sector DC nacional; no incluye PPAs ni generación «behind the meter» por sitio."
        fontFamily={theme.bodyFont}
        fontSize={22}
        fill={theme.black}
        textAlign="center"
        lineHeight={30}
        x={0}
        y={288}
        width={1240}
        opacity={0}
      />
    </Layout>
  );
}
