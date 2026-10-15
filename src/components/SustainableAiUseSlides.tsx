import {Layout, Txt} from '@motion-canvas/2d';
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

export function RightToolIntroSlide() {
  return (
    <TextSlide
      title="Menos impacto: elegir la herramienta"
      subtitle="Del data center a cada prompt"
      bullets={[
        'No todo problema necesita un LLM grande, a veces ni siquiera ML.',
        'La inferencia (cada consulta) suma más que entrenar una vez, a escala de uso.',
        'Objetivo: la calidad mínima que el caso acepta, con el menor cómputo posible.',
      ]}
    />
  );
}

export function SkipGenerativeAiSlide() {
  return (
    <TextSlide
      title="Cuándo no usar IA generativa"
      bullets={[
        'Reglas, búsqueda, SQL, plantillas o código clásico si la tarea está acotada.',
        'Clasificar intent (spam, ticket, idioma) → clasificador pequeño o reglas, no chatbot.',
        'Investigación CHI 2025: devs eligen modelos grandes por costumbre; a veces algoritmos simples bastan.',
        'Pregunta útil: “¿90 % de acierto al ~10 % del costo ya sirve para este caso?”',
      ]}
    />
  );
}

export function LighterModelsSlide() {
  return (
    <TextSlide
      title="Modelos más livianos y enrutamiento"
      bullets={[
        'Resumen corto, extracción de campos, FAQ, primer borrador → modelos pequeños (“mini” / SLM).',
        'Clasificador barato: decide si responde el modelo chico o escala al grande.',
        'Estudios energy–accuracy: modelos medianos a menudo parecen a los gigantes con mucha menos energía.',
        'Arquitectura híbrida: empezar pequeño; subir de tier solo si falla confianza o calidad.',
      ]}
    />
  );
}

export function HeavyLlmWhenSlide() {
  return (
    <TextSlide
      title="Cuándo sí un LLM pesado"
      bullets={[
        'Razonamiento largo, mucho contexto, decisiones de alto riesgo o bajo margen de error.',
        'Programación sensible o refactor grande, asistentes tipo Claude/GPT: más tokens y GPU.',
        'Medicina, legal, seguridad: puede exigirse el modelo más capaz aunque cueste más.',
        'No es “mal usar lo grande”: es reservarlo para cuando el costo del error lo justifica.',
      ]}
    />
  );
}

export function CarbonAwareWorkshopBridgeSlide() {
  return (
    <TextSlide
      title="Carbon-aware computing"
      subtitle="Metas de intensidad + elegir cuándo ejecutar"
      bullets={[
        'Microsoft y Google bajan WUE y buscan agua positiva, pero el total puede seguir subiendo si crece la demanda.',
        'El mix eléctrico cambia hora a hora y por región: el mismo kWh no tiene la misma huella siempre.',
        'Carbon-aware: posponer batch e inferencia a ventanas más limpias (taller en vivo: predecir y programar).',
        'Complementa eficiencia en sitio: menos agua/energía por kWh y menos kWh en el momento más limpio.',
      ]}
    />
  );
}
