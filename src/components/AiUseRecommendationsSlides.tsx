import {Layout, Line, Rect, Txt} from '@motion-canvas/2d';
import type {ComponentChildren} from '@motion-canvas/2d/lib/components/types';
import {theme} from '../theme';

export const RECOMMEND_SLIDE_H = 760;

const TITLE_Y = -360;
const DURATION_Y = -312;
const KICKER_Y = -368;

function SlideFrame({
  sectionKicker,
  title,
  durationLabel,
  children,
}: {
  sectionKicker?: string;
  title: string;
  durationLabel: string;
  children: ComponentChildren;
}) {
  return (
    <Layout layout={false} width={1680} height={RECOMMEND_SLIDE_H}>
      {sectionKicker ? (
        <Txt
          text={sectionKicker}
          fontFamily={theme.pixelFont}
          fontSize={22}
          fill={theme.grey}
          textAlign="center"
          x={0}
          y={KICKER_Y}
          width={1400}
        />
      ) : null}
      <Txt
        text={title}
        fontFamily={theme.pixelFont}
        fontSize={38}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={TITLE_Y}
        width={1500}
        lineHeight={46}
      />
      <Layout layout={false} y={DURATION_Y}>
        <Rect width={132} height={34} fill={theme.black} x={4} y={4} />
        <Rect width={132} height={34} fill={theme.yellow} stroke={theme.black} lineWidth={2} />
        <Txt
          text={durationLabel}
          fontFamily={theme.pixelFont}
          fontSize={18}
          fill={theme.black}
          textAlign="center"
          y={-1}
        />
      </Layout>
      {children}
    </Layout>
  );
}

function ExampleCard({
  y,
  task,
  solution,
  width = 1280,
}: {
  y: number;
  task: string;
  solution: string;
  width?: number;
}) {
  const h = 78;
  return (
    <Layout layout={false} y={y}>
      <Rect width={width} height={h} fill={theme.black} x={5} y={5} />
      <Rect
        width={width}
        height={h}
        fill={theme.white}
        stroke={theme.black}
        lineWidth={theme.border}
      />
      <Txt
        text={task}
        fontFamily={theme.bodyFont}
        fontSize={22}
        fontWeight={700}
        fill={theme.black}
        textAlign="left"
        width={width - 48}
        x={-width / 2 + 24}
        y={-14}
        offsetX={-1}
      />
      <Txt
        text={solution}
        fontFamily={theme.bodyFont}
        fontSize={19}
        fontWeight={500}
        fill={theme.pie[0]}
        textAlign="left"
        width={width - 48}
        x={-width / 2 + 24}
        y={16}
        offsetX={-1}
      />
    </Layout>
  );
}

function PresenterQuote({y, text}: {y: number; text: string}) {
  return (
    <Layout layout={false} y={y}>
      <Rect width={1280} height={1} fill={theme.black} y={-52} opacity={0.15} />
      <Txt
        text="Lo que dirías"
        fontFamily={theme.pixelFont}
        fontSize={18}
        fill={theme.grey}
        textAlign="left"
        x={-620}
        y={-36}
        offsetX={-1}
      />
      <Txt
        text={text}
        fontFamily={theme.bodyFont}
        fontSize={17}
        fontWeight={500}
        fill={theme.black}
        textAlign="left"
        width={1240}
        lineHeight={26}
        x={0}
        y={8}
      />
    </Layout>
  );
}

/** ¿De verdad necesitamos IA para esto? */
export function NeedIaForThisSlide() {
  return (
    <SlideFrame title="¿De verdad necesitamos IA para esto?" durationLabel="1 min">
      <ExampleCard y={-228} task="Calcular el 15% de descuento" solution="Solución: una multiplicación" />
      <ExampleCard y={-132} task="Consultar el estado de un pedido" solution="Solución: una consulta a base de datos" />
      <ExampleCard
        y={-36}
        task="Validar el formato de un correo"
        solution="Solución: validación convencional"
      />
      <PresenterQuote
        y={118}
        text="«A veces estamos utilizando IA para problemas que resolvíamos perfectamente hace diez años. No tiene sentido pagar por tokens, introducir latencia y aceptar respuestas probabilísticas cuando podemos obtener una respuesta determinista con código. La IA es increíble, pero no necesitamos convertir cada if en una llamada a ChatGPT»."
      />
    </SlideFrame>
  );
}

/** No toda IA necesita ser un LLM gigante */
export function RightSizedModelSlide() {
  return (
    <SlideFrame title="No toda IA necesita ser un LLM gigante" durationLabel="1,5 min">
      <ExampleCard
        y={-228}
        task="Clasificar correos o tickets"
        solution="Clasificador tradicional o especializado (p. ej. Jev) — evaluar rendimiento"
      />
      <ExampleCard
        y={-120}
        task="Responder preguntas frecuentes"
        solution="Respuestas predefinidas, búsqueda o un LLM pequeño si hace falta generar lenguaje"
      />
      <ExampleCard
        y={-12}
        task="Investigar un bug complejo"
        solution="Un LLM grande (p. ej. Claude) puede justificar su costo si mejora los resultados"
      />
      <PresenterQuote
        y={108}
        text="«Imaginemos cien mil mensajes de soporte: ¿hace falta un modelo enorme para ventas vs facturación vs soporte? Probablemente no. Para un bug intermitente con microservicios y condiciones de carrera, ahí sí puede valer un modelo más capaz. No es que lo pequeño gane siempre: hay que usar el que el problema exige»."
      />
    </SlideFrame>
  );
}

function RouteNode({
  x,
  y,
  w,
  h,
  label,
  sublabel,
  fill,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sublabel?: string;
  fill: string;
}) {
  return (
    <Layout layout={false} x={x} y={y}>
      <Rect width={w} height={h} fill={theme.black} x={4} y={4} />
      <Rect width={w} height={h} fill={fill} stroke={theme.black} lineWidth={2} />
      <Txt
        text={label}
        fontFamily={theme.pixelFont}
        fontSize={20}
        fill={theme.black}
        textAlign="center"
        width={w - 16}
        y={sublabel ? -10 : 0}
      />
      {sublabel ? (
        <Txt
          text={sublabel}
          fontFamily={theme.bodyFont}
          fontSize={14}
          fontWeight={600}
          fill={theme.black}
          textAlign="center"
          width={w - 20}
          y={14}
          lineHeight={18}
        />
      ) : null}
    </Layout>
  );
}

/** Router / clasificador + tres destinos */
export function SmartRoutingArchitectureSlide() {
  const routerY = -118;
  const leafY = 72;
  return (
    <SlideFrame title="Una arquitectura más inteligente" durationLabel="2 min">
      <RouteNode x={0} y={-248} w={320} h={56} label="Solicitud del usuario" fill={theme.white} />
      <Line
        points={[
          [0, -220],
          [0, routerY - 36],
        ]}
        stroke={theme.black}
        lineWidth={3}
        arrowSize={12}
        endArrow
      />
      <RouteNode
        x={0}
        y={routerY}
        w={360}
        h={72}
        label="Router / clasificador"
        sublabel="Decide cómo procesar la solicitud"
        fill={theme.yellow}
      />
      <Line
        points={[
          [0, routerY + 36],
          [-280, leafY - 40],
        ]}
        stroke={theme.black}
        lineWidth={3}
        arrowSize={10}
        endArrow
      />
      <Line
        points={[
          [0, routerY + 36],
          [0, leafY - 40],
        ]}
        stroke={theme.black}
        lineWidth={3}
        arrowSize={10}
        endArrow
      />
      <Line
        points={[
          [0, routerY + 36],
          [280, leafY - 40],
        ]}
        stroke={theme.black}
        lineWidth={3}
        arrowSize={10}
        endArrow
      />
      <RouteNode
        x={-280}
        y={leafY}
        w={240}
        h={88}
        label="Código"
        sublabel="Reglas y consultas"
        fill={theme.pie[6]}
      />
      <RouteNode
        x={0}
        y={leafY}
        w={240}
        h={88}
        label="IA ligera"
        sublabel="Clasificación y tareas sencillas"
        fill={theme.cyan}
      />
      <RouteNode
        x={280}
        y={leafY}
        w={240}
        h={88}
        label="LLM grande"
        sublabel="Razonamiento complejo"
        fill={theme.magenta}
      />
      <PresenterQuote
        y={200}
        text="«Model routing: tareas sencillas con código o modelos pequeños; las complejas al modelo capaz. FrugalGPT (Chen et al., 2023) muestra ahorros fuertes en inferencia — pero hay que medir: el router también cuesta y puede equivocarse»."
      />
    </SlideFrame>
  );
}

/** Contraste de preguntas */
export function RightQuestionSlide() {
  const boxW = 520;
  const boxH = 200;
  return (
    <SlideFrame title="La pregunta correcta" durationLabel="1 min">
      <Layout layout={false} x={-280} y={-140}>
        <Rect width={boxW} height={boxH} fill={theme.black} x={5} y={5} />
        <Rect
          width={boxW}
          height={boxH}
          fill="#FFE8E8"
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          text="No preguntes:"
          fontFamily={theme.pixelFont}
          fontSize={22}
          fill={theme.black}
          y={-boxH / 2 + 36}
        />
        <Txt
          text="«¿Cómo puedo agregar IA a esto?»"
          fontFamily={theme.bodyFont}
          fontSize={24}
          fontWeight={700}
          fill={theme.black}
          textAlign="center"
          width={boxW - 40}
          lineHeight={34}
          y={24}
        />
      </Layout>
      <Layout layout={false} x={280} y={-140}>
        <Rect width={boxW} height={boxH} fill={theme.black} x={5} y={5} />
        <Rect
          width={boxW}
          height={boxH}
          fill={theme.cyan}
          stroke={theme.black}
          lineWidth={theme.border}
          opacity={0.45}
        />
        <Rect
          width={boxW}
          height={boxH}
          fill={theme.white}
          stroke={theme.black}
          lineWidth={theme.border}
          opacity={0.92}
        />
        <Txt
          text="Pregunta:"
          fontFamily={theme.pixelFont}
          fontSize={22}
          fill={theme.black}
          y={-boxH / 2 + 36}
        />
        <Txt
          text="«¿Cuál es la solución más eficiente que resuelve este problema correctamente?»"
          fontFamily={theme.bodyFont}
          fontSize={21}
          fontWeight={700}
          fill={theme.black}
          textAlign="center"
          width={boxW - 36}
          lineHeight={32}
          y={28}
        />
      </Layout>
    </SlideFrame>
  );
}
