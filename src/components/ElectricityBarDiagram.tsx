import {Layout, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {theme} from '../theme';
import {HypotheticalDisclaimer} from './HypotheticalDisclaimer';

/** Overhead ilustrativo encima de 100 kW IT → total sitio (PUE ≈ 1.58). */
export const facilityLoads = [
  {id: 'cooling', label: 'Refrigeración', kw: 22, fill: theme.magenta},
  {id: 'fans', label: 'Bombas y ventiladores', kw: 8, fill: theme.gold},
  {id: 'ups', label: 'UPS', kw: 8, fill: theme.pie[2]},
  {id: 'building', label: 'Edificio y otros', kw: 8, fill: theme.black},
  {id: 'dist', label: 'Distribución eléctrica', kw: 8, fill: theme.pie[0]},
  {id: 'lights', label: 'Iluminación', kw: 4, fill: theme.pie[5]},
] as const;

export const IT_KW = 100;
export const TOTAL_KW =
  IT_KW + facilityLoads.reduce((s, x) => s + x.kw, 0); // 156
export const EXAMPLE_PUE = TOTAL_KW / IT_KW; // 1.56

const BAR_X = -400;
const BAR_WIDTH = 180;
/** Más px/kW → segmentos más altos (menos labels amontonados). */
const PX_PER_KW = 3.05;
const BAR_BOTTOM = 280;
const LABEL_GAP = 24;

export function kwHeight(kw: number): number {
  return kw * PX_PER_KW;
}

/** Bottoms (y) of each facility segment, stacking up from IT top. */
export function facilityBottoms(): number[] {
  let bottom = BAR_BOTTOM - kwHeight(IT_KW);
  return facilityLoads.map(load => {
    const b = bottom;
    bottom -= kwHeight(load.kw);
    return b;
  });
}

type ElectricityBarProps = {
  itBar: Reference<Rect>;
  itLabel: Reference<Txt>;
  segmentRefs: Reference<Rect>[];
  labelRefs: Reference<Txt>[];
  totalLabel: Reference<Txt>;
};

export function ElectricityBarDiagram({
  itBar,
  itLabel,
  segmentRefs,
  labelRefs,
  totalLabel,
}: ElectricityBarProps) {
  const itH = kwHeight(IT_KW);
  const bottoms = facilityBottoms();

  return (
    <Layout layout={false} width={1200} height={720}>
      <Txt
        text="La electricidad del servidor no es toda la electricidad"
        fontFamily={theme.pixelFont}
        fontSize={34}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-330}
      />
      <HypotheticalDisclaimer x={0} y={-288} />

      <Rect
        ref={itBar}
        x={BAR_X}
        y={BAR_BOTTOM}
        width={BAR_WIDTH}
        height={0}
        fill={theme.cyan}
        stroke={theme.black}
        lineWidth={theme.border}
        offsetY={1}
      />
      <Txt
        ref={itLabel}
        text={`Equipo IT · ${IT_KW} kW`}
        fontFamily={theme.bodyFont}
        fontSize={26}
        fontWeight={700}
        fill={theme.black}
        x={BAR_X - BAR_WIDTH / 2 - LABEL_GAP}
        y={BAR_BOTTOM - itH / 2}
        offsetX={1}
        textAlign="right"
        opacity={0}
      />

      {facilityLoads.map((load, i) => {
        const h = kwHeight(load.kw);
        const bottom = bottoms[i];
        const isTop = i === facilityLoads.length - 1;
        const labelY = isTop ? bottom - h - 10 : bottom - h / 2;
        return (
          <Layout key={load.id} layout={false}>
            <Rect
              ref={segmentRefs[i]}
              x={BAR_X}
              y={bottom}
              width={BAR_WIDTH}
              height={0}
              fill={load.fill}
              stroke={theme.black}
              lineWidth={2}
              offsetY={1}
            />
            <Txt
              ref={labelRefs[i]}
              text={`${load.label} · ${load.kw} kW`}
              fontFamily={theme.bodyFont}
              fontSize={22}
              fontWeight={500}
              fill={theme.black}
              x={BAR_X - BAR_WIDTH / 2 - LABEL_GAP}
              y={labelY}
              offsetX={1}
              textAlign="right"
              opacity={0}
            />
          </Layout>
        );
      })}

      <Txt
        ref={totalLabel}
        text={`Total del sitio · ~${TOTAL_KW} kW`}
        fontFamily={theme.pixelFont}
        fontSize={30}
        fill={theme.black}
        x={BAR_X}
        y={BAR_BOTTOM - kwHeight(TOTAL_KW) - 56}
        opacity={0}
      />
    </Layout>
  );
}
