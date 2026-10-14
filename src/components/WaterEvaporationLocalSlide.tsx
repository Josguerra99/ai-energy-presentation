import {Layout, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {
  NEUBRUTAL_FACT_CARD_GAP,
  NEUBRUTAL_FACT_CARD_H,
  NeubrutalFactCard,
} from './NeubrutalFactCard';
import {WATER_SLIDE_LAYOUT_H} from './WaterDcHeatIntroSlide';
import {theme} from '../theme';

const TITLE_Y = -318;
const SUBTITLE_Y = -262;
const STACK_Y = -58;

const facts = [
  {
    title: 'El agua evaporada no “sale” del planeta',
    body: 'Entra al ciclo hidrológico: vapor, nubes y precipitación — a menudo en otro lugar o en otro momento.',
  },
  {
    title: 'El impacto sí es local y regional',
    body: 'Menos caudal en la cuenca, más competencia por agua dulce y estrés hídrico en sequía.',
  },
  {
    title: 'Importa de dónde se toma el agua',
    body: 'Potable, superficial, acuífero o reutilizada: distinto riesgo, permiso y costo para la comunidad.',
  },
] as const;

export type WaterEvaporationLocalSlideProps = {
  cardRefs: Reference<Layout>[];
  captionRef: Reference<Txt>;
};

/** Evaporación: ciclo global vs presión local y origen del agua. */
export function WaterEvaporationLocalSlide({
  cardRefs,
  captionRef,
}: WaterEvaporationLocalSlideProps) {
  return (
    <Layout layout={false} width={1680} height={WATER_SLIDE_LAYOUT_H}>
      <Txt
        text="Evaporación: global vs impacto local"
        fontFamily={theme.pixelFont}
        fontSize={34}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={TITLE_Y}
        width={1500}
      />
      <Txt
        text="Tres ideas para leer WUE, torres húmedas y política hídrica sin confundir escala global con cuenca"
        fontFamily={theme.bodyFont}
        fontSize={21}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={SUBTITLE_Y}
        width={1280}
      />

      {facts.map((fact, i) => (
        <NeubrutalFactCard
          cardRef={cardRefs[i]}
          title={fact.title}
          body={fact.body}
          y={STACK_Y + i * (NEUBRUTAL_FACT_CARD_H + NEUBRUTAL_FACT_CARD_GAP)}
          opacity={0}
        />
      ))}

      <Txt
        ref={captionRef}
        text="USGS: uso consumptivo incluye evaporación que no vuelve de inmediato a la misma fuente. WRI Aqueduct ayuda a leer estrés por cuenca."
        fontFamily={theme.bodyFont}
        fontSize={17}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        width={1180}
        lineHeight={26}
        y={278}
        opacity={0}
      />
    </Layout>
  );
}
