import {Layout, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import type {Rect as RectNode, Txt as TxtNode} from '@motion-canvas/2d';
import {
  LBNL_US_DC_ENERGY_TWH,
  LBNL_US_DC_GPU_AI_INFLECTION_YEAR,
  LBNL_US_DC_INDIRECT_WATER_L_PER_KWH_2023,
} from '../data/lbnlUsDc2024';
import {
  US_DC_WATER_DIRECT_BIL_L_2023,
  US_DC_WATER_FOOTPRINT_YEAR,
  US_DC_WATER_INDIRECT_BIL_L_2023,
} from '../data/usDcWaterFootprint';
import {WATER_SLIDE_LAYOUT_H} from './WaterDcHeatIntroSlide';
import {theme} from '../theme';

const FACT_TITLE_BAND_Y = -318;
const FACT_SECTION_Y = -248;
const FACT_BODY_Y = -168;

function WaterFactSlide({
  index,
  title,
  body,
  bodyFontSize = 23,
  bodyLineHeight = 36,
}: {
  index: number;
  title: string;
  body: string;
  bodyFontSize?: number;
  bodyLineHeight?: number;
}) {
  return (
    <Layout layout={false} width={1680} height={WATER_SLIDE_LAYOUT_H}>
      <Txt
        text="Agua y centros de datos"
        fontFamily={theme.pixelFont}
        fontSize={32}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={FACT_TITLE_BAND_Y}
        width={1500}
      />
      <Txt
        text={`${index}. ${title}`}
        fontFamily={theme.pixelFont}
        fontSize={32}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={FACT_SECTION_Y}
        width={1400}
        lineHeight={40}
      />
      <Txt
        text={body}
        fontFamily={theme.bodyFont}
        fontSize={bodyFontSize}
        fontWeight={500}
        fill={theme.black}
        textAlign="left"
        offsetX={-1}
        width={1120}
        lineHeight={bodyLineHeight}
        x={-560}
        y={FACT_BODY_Y}
      />
    </Layout>
  );
}

export function WaterFact2WithdrawalVsConsumptionSlide() {
  return (
    <WaterFactSlide
      index={2}
      title="Extraer agua no equivale a consumirla"
      body="USGS distingue extracción (withdrawal) del agua retirada de una fuente y uso consumptivo (consumptive use): la parte que evapora, se incorpora a productos o no vuelve al entorno inmediato. Mucha extracción en centrales o torres de refrigeración regresa como return flow. Comparar cifras sin el mismo marco confunde el debate."
    />
  );
}

export function WaterFact3MeasurableUsSlide() {
  return (
    <WaterFactSlide
      index={3}
      title="Consumo directo medible y significativo (EE. UU.)"
      body={`El informe LBNL-2001637 estima consumo directo en sitio de unos ${US_DC_WATER_DIRECT_BIL_L_2023} mil millones de litros en ${US_DC_WATER_FOOTPRINT_YEAR} (Fig. 5.9) — modelo bottom-up, no lecturas de contador en cada edificio. Cubre todos los centros de datos del país; en 2023 hyperscale y colocation concentran ~84 % de ese directo.`}
    />
  );
}

export function WaterFact4EnergyGrowthAiSlide() {
  const twh2014 = LBNL_US_DC_ENERGY_TWH[2014];
  const twh2023 = LBNL_US_DC_ENERGY_TWH[2023];
  return (
    <WaterFactSlide
      index={4}
      title="La IA acelera el crecimiento energético (y presiona el agua)"
      body={`LBNL sitúa la electricidad de centros de datos en ~${twh2014} TWh/año (2014–2016, estable) y ${twh2023} TWh en ${US_DC_WATER_FOOTPRINT_YEAR} (~4,4 % del total nacional). Desde ${LBNL_US_DC_GPU_AI_INFLECTION_YEAR} el stock de servidores con GPU para IA pesa lo bastante como para reactivar el crecimiento. Más kWh implica más refrigeración directa y más huella indirecta vía red eléctrica (~${LBNL_US_DC_INDIRECT_WATER_L_PER_KWH_2023} L/kWh indirectos de media nacional en 2023).`}
    />
  );
}

export function WaterFact5LocationMattersSlide() {
  return (
    <WaterFactSlide
      index={5}
      title="El impacto depende del lugar"
      body="LBNL asigna intensidades hídricas y de emisiones por condado según el mix de la red (Fig. 5.10): un litro contabilizado en una cuenca con estrés hídrico no equivale a uno en una región húmeda, ni necesariamente a agua potable. Operadores evalúan riesgo local (p. ej. WRI Aqueduct) y usan agua reciclada o no potable donde publican políticas."
    />
  );
}

const BAR_X_DIRECT = -220;
const BAR_X_INDIRECT = 220;
const BAR_W = 280;
const COMPARE_TITLE_Y = -318;
const COMPARE_SUBTITLE_Y = -262;
const BAR_BASE_Y = 200;
const BAR_MAX_H = 320;
const COMPARE_CAPTION_Y = 288;
const BAR_SCALE_MAX = US_DC_WATER_INDIRECT_BIL_L_2023;

function barHeight(billionLiters: number): number {
  return (billionLiters / BAR_SCALE_MAX) * BAR_MAX_H;
}

export type WaterDirectIndirectCompareProps = {
  directBarRef: Reference<RectNode>;
  indirectBarRef: Reference<RectNode>;
  directLabelRef: Reference<TxtNode>;
  indirectLabelRef: Reference<TxtNode>;
  directValueRef: Reference<TxtNode>;
  indirectValueRef: Reference<TxtNode>;
  captionRef: Reference<TxtNode>;
};

export function WaterDirectIndirectCompareSlide({
  directBarRef,
  indirectBarRef,
  directLabelRef,
  indirectLabelRef,
  directValueRef,
  indirectValueRef,
  captionRef,
}: WaterDirectIndirectCompareProps) {
  const directH = barHeight(US_DC_WATER_DIRECT_BIL_L_2023);
  const indirectH = barHeight(US_DC_WATER_INDIRECT_BIL_L_2023);

  return (
    <Layout layout={false} width={1680} height={WATER_SLIDE_LAYOUT_H}>
      <Txt
        text="La comparación que más vale la pena enseñar"
        fontFamily={theme.pixelFont}
        fontSize={34}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={COMPARE_TITLE_Y}
        width={1500}
      />
      <Txt
        text={`EE. UU., ${US_DC_WATER_FOOTPRINT_YEAR} — LBNL-2001637 (mil millones de litros/año, estimaciones)`}
        fontFamily={theme.bodyFont}
        fontSize={21}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={COMPARE_SUBTITLE_Y}
        width={1300}
      />

      <Rect
        width={BAR_W}
        height={directH}
        fill={theme.cyan}
        stroke={theme.black}
        lineWidth={3}
        x={BAR_X_DIRECT}
        y={BAR_BASE_Y - directH / 2}
        scale={[1, 0]}
        ref={directBarRef}
      />
      <Rect
        width={BAR_W}
        height={indirectH}
        fill={theme.magenta}
        stroke={theme.black}
        lineWidth={3}
        x={BAR_X_INDIRECT}
        y={BAR_BASE_Y - indirectH / 2}
        scale={[1, 0]}
        ref={indirectBarRef}
      />

      <Txt
        text="Consumo directo\n(refrigeración en sitio)"
        fontFamily={theme.bodyFont}
        fontSize={20}
        fontWeight={700}
        fill={theme.black}
        textAlign="center"
        lineHeight={28}
        x={BAR_X_DIRECT}
        y={BAR_BASE_Y + 24}
        opacity={0}
        ref={directLabelRef}
      />
      <Txt
        text="Huella indirecta\n(vía generación eléctrica)"
        fontFamily={theme.bodyFont}
        fontSize={20}
        fontWeight={700}
        fill={theme.black}
        textAlign="center"
        lineHeight={28}
        x={BAR_X_INDIRECT}
        y={BAR_BASE_Y + 24}
        opacity={0}
        ref={indirectLabelRef}
      />

      <Txt
        ref={directValueRef}
        text={`${US_DC_WATER_DIRECT_BIL_L_2023} mil M L`}
        fontFamily={theme.pixelFont}
        fontSize={40}
        fill={theme.black}
        textAlign="center"
        x={BAR_X_DIRECT}
        y={BAR_BASE_Y - directH - 36}
        opacity={0}
      />
      <Txt
        ref={indirectValueRef}
        text={`~${US_DC_WATER_INDIRECT_BIL_L_2023} mil M L`}
        fontFamily={theme.pixelFont}
        fontSize={40}
        fill={theme.black}
        textAlign="center"
        x={BAR_X_INDIRECT}
        y={BAR_BASE_Y - indirectH - 36}
        opacity={0}
      />

      <Txt
        ref={captionRef}
        text="Indirecto ≈ agua consumptiva en plantas según mix regional por balancing authority; el informe indica «casi 800 mil millones de litros» en 2023. No incluye PPAs ni generación «behind the meter» por sitio."
        fontFamily={theme.bodyFont}
        fontSize={22}
        fill={theme.black}
        textAlign="center"
        width={1200}
        lineHeight={32}
        x={0}
        y={COMPARE_CAPTION_Y}
        opacity={0}
      />
    </Layout>
  );
}
