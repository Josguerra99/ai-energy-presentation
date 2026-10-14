import {Layout, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import type {Circle, Line, Txt as TxtNode} from '@motion-canvas/2d';
import {
  DC_ENERGY_TWH_MAX,
  DC_ENERGY_YEAR_MAX,
  DC_ENERGY_YEAR_MIN,
  dcEnergyTrend,
} from '../data/dcEnergyTrend';
import {
  DC_WATER_BIL_L_MAX,
  DC_WATER_YEAR_MAX,
  DC_WATER_YEAR_MIN,
  dcWaterTrend,
} from '../data/dcWaterTrend';
import {MetricTrendChart} from './MetricTrendChart';
import {theme} from '../theme';

function TextSlide({
  title,
  subtitle,
  bullets,
}: {
  title: string;
  subtitle?: string;
  bullets: readonly string[];
}) {
  return (
    <Layout layout={false} width={1600} height={760}>
      <Txt
        text={title}
        fontFamily={theme.pixelFont}
        fontSize={40}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-280}
        width={1400}
      />
      {subtitle ? (
        <Txt
          text={subtitle}
          fontFamily={theme.bodyFont}
          fontSize={24}
          fontWeight={500}
          fill={theme.black}
          textAlign="center"
          x={0}
          y={-210}
          width={1200}
        />
      ) : null}
      {bullets.map((line, i) => (
        <Txt
          key={`${i}-${line.slice(0, 24)}`}
          text={`· ${line}`}
          fontFamily={theme.bodyFont}
          fontSize={22}
          fontWeight={500}
          fill={theme.black}
          textAlign="left"
          width={1200}
          lineHeight={34}
          x={0}
          y={-120 + i * 72}
        />
      ))}
    </Layout>
  );
}

export function WaterDcIntroSlide() {
  return (
    <TextSlide
      title="Agua y centros de datos"
      subtitle="No es solo IA — es cómputo, calor y electricidad"
      bullets={[
        'El modelo no “bebe” agua: la usan (o puede usar) el sitio y la red eléctrica.',
        'Más GPUs y más densidad → más calor → más necesidad de refrigeración.',
        'La cantidad depende del clima, del diseño y de la mezcla de electricidad.',
      ]}
    />
  );
}

export function WaterDcSourcesSlide() {
  return (
    <TextSlide
      title="De dónde sale el agua"
      bullets={[
        'Directa en el sitio: torres evaporativas, humidificación (parte se evapora = “consumo”).',
        'Indirecta: generar la electricidad también puede usar agua (mix regional).',
        'Refrigeración líquida en circuito cerrado: el fluido recircula; no implica evaporar a diario.',
        'Agua no potable / reciclada / rechazo de tratamiento: reduce presión sobre agua dulce.',
      ]}
    />
  );
}

export function WaterDcWasteSlide() {
  return (
    <TextSlide
      title="“Desperdicio” y ciclo del agua"
      bullets={[
        'Evaporar no destruye H₂O: la mueve en el ciclo — puede llover lejos y tarde.',
        'Consumo hidrológico = lo que no vuelve pronto a la misma cuenca disponible.',
        'El riesgo fuerte es local: sequía, comunidad, industria agrícola en la misma cuenca.',
        'No hay “ml por prompt” universal: varía órdenes de magnitud según sitio y carga.',
      ]}
    />
  );
}

export function WaterHyperscalerSlide() {
  return (
    <TextSlide
      title="Qué hacen Microsoft y Google (ejemplos publicados)"
      bullets={[
        'Microsoft: WUE global 0,30 → 0,27 L/kWh IT (FY24→FY25); meta agua-positiva 2030.',
        'Microsoft: agua reciclada/no potable en sitios clave; diseños sin evaporación en algunos DC IA.',
        'Google: evalúa estrés hídrico local; aire o agua reciclada donde el riesgo es alto.',
        'Google: meta repone más agua dulce de la que consume (promedio) para 2030.',
      ]}
    />
  );
}

export function EnergyDcIntroSlide() {
  return (
    <TextSlide
      title="Energía y centros de datos (EE. UU.)"
      subtitle="Misma física para web, cloud e IA"
      bullets={[
        '2014–2016: uso eléctrico relativamente estable (~60 TWh/año).',
        'Desde ~2017: más servidores y GPUs de IA → crecimiento acelerado.',
        '2023: ~176 TWh (~4,4 % de la electricidad del país) — informe LBNL/DOE.',
        'Menos cómputo innecesario = menos electricidad, calor y presión sobre agua.',
      ]}
    />
  );
}

export function HowToExplainSlide() {
  return (
    <TextSlide
      title="Cómo contarlo en 30 segundos"
      bullets={[
        '“Más cómputo → más electricidad → más calor; el agua entra al enfriar y al generar luz.”',
        '“No es magia de la IA: un data center clásico obedece la misma cadena.”',
        '“El titular de la botella por prompt es un modelo viejo — depende del sitio.”',
        '“Eficiencia (PUE/WUE), agua reciclada, menos modelos gigantes donde no hacen falta.”',
      ]}
    />
  );
}

const waterMetricPoints = dcWaterTrend.map(p => ({
  year: p.year,
  value: p.billionLiters,
  label: p.label,
}));

const energyMetricPoints = dcEnergyTrend.map(p => ({
  year: p.year,
  value: p.twh,
  label: p.label,
}));

export type WaterTrendChartProps = {
  lineRef: Reference<Line>;
  pointRefs: Reference<Circle>[];
  labelRefs: Reference<TxtNode>[];
  noteRef: Reference<TxtNode>;
};

export function WaterTrendChart({
  lineRef,
  pointRefs,
  labelRefs,
  noteRef,
}: WaterTrendChartProps) {
  return (
    <MetricTrendChart
      title="Agua directa en sitio — EE. UU."
      yAxisLabel="mil M L"
      yearMin={DC_WATER_YEAR_MIN}
      yearMax={DC_WATER_YEAR_MAX}
      valueMin={0}
      valueMax={DC_WATER_BIL_L_MAX}
      points={waterMetricPoints}
      valueFormat={v => `${v} mil M L`}
      note="Consumo directo estimado (Fig. 5.9, LBNL-2001637). Indirecto vía electricidad ≈ «casi 800» mil M L en 2023 (Fig. 5.10; mix regional, sin PPAs por sitio)."
      lineRef={lineRef}
      pointRefs={pointRefs}
      labelRefs={labelRefs}
      noteRef={noteRef}
      lineColor={theme.cyan}
      pointColor={theme.magenta}
    />
  );
}

export type EnergyTrendChartProps = WaterTrendChartProps;

export function EnergyTrendChart({
  lineRef,
  pointRefs,
  labelRefs,
  noteRef,
}: EnergyTrendChartProps) {
  return (
    <MetricTrendChart
      title="Electricidad de data centers — EE. UU."
      yAxisLabel="TWh/año"
      yearMin={DC_ENERGY_YEAR_MIN}
      yearMax={DC_ENERGY_YEAR_MAX}
      valueMin={0}
      valueMax={DC_ENERGY_TWH_MAX}
      points={energyMetricPoints}
      valueFormat={v => `${v} TWh`}
      note="Serie LBNL Figure ES-1 (2024 Report). 2014–2016 ~meseta; después acelera con IA/GPU. Proyecciones 2028 en el informe — no mostradas aquí."
      lineRef={lineRef}
      pointRefs={pointRefs}
      labelRefs={labelRefs}
      noteRef={noteRef}
    />
  );
}
