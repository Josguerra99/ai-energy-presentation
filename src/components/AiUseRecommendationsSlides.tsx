import {Layout, Line, Rect, Txt} from '@motion-canvas/2d';
import type {ComponentChildren} from '@motion-canvas/2d/lib/components/types';
import {theme} from '../theme';

export const RECOMMEND_SLIDE_H = 760;

const TITLE_Y = -360;
const KICKER_Y = -368;

function SlideFrame({
  sectionKicker,
  title,
  children,
}: {
  sectionKicker?: string;
  title: string;
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

/** No toda IA necesita ser un LLM gigante */
export function RightSizedModelSlide() {
  return (
    <SlideFrame title="No toda IA necesita ser un LLM gigante">
      <ExampleCard
        y={-228}
        task="Clasificar correos o tickets"
        solution="Clasificador tradicional o especializado (p. ej. Jev), evaluar rendimiento"
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
        text="Imaginemos cien mil mensajes de soporte: ¿hace falta un modelo enorme para ventas vs facturación vs soporte? Probablemente no. Para un bug intermitente con microservicios y condiciones de carrera, ahí sí puede valer un modelo más capaz. No es que lo pequeño gane siempre: hay que usar el que el problema exige."
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
    <SlideFrame title="Una arquitectura más inteligente">
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
        text="Model routing: tareas sencillas con código o modelos pequeños; las complejas al modelo capaz. FrugalGPT (Chen et al., 2023) muestra ahorros fuertes en inferencia, pero hay que medir: el router también cuesta y puede equivocarse."
      />
    </SlideFrame>
  );
}

function WorkToolCard({
  x,
  y,
  tag,
  title,
  detailLine1,
  detailLine2,
  fill,
}: {
  x: number;
  y: number;
  tag: string;
  title: string;
  detailLine1: string;
  detailLine2: string;
  fill: string;
}) {
  const w = 596;
  const h = 108;
  const pad = 22;
  const tagSize = 72;
  const bodyX = -w / 2 + pad + tagSize + 16;
  const bodyW = w - pad * 2 - tagSize - 16;
  return (
    <Layout layout={false} x={x} y={y}>
      <Rect width={w} height={h} fill={theme.black} x={5} y={5} />
      <Rect width={w} height={h} fill={fill} stroke={theme.black} lineWidth={theme.border} />
      <Rect
        x={-w / 2 + pad + tagSize / 2}
        y={0}
        width={tagSize}
        height={tagSize}
        fill={theme.white}
        stroke={theme.black}
        lineWidth={3}
      />
      <Txt
        text={tag}
        fontFamily={theme.pixelFont}
        fontSize={tag.length > 5 ? 16 : 20}
        fill={theme.black}
        textAlign="center"
        width={tagSize - 8}
        x={-w / 2 + pad + tagSize / 2}
        y={-2}
      />
      <Txt
        text={title}
        fontFamily={theme.bodyFont}
        fontSize={19}
        fontWeight={700}
        fill={theme.black}
        textAlign="left"
        offsetX={-1}
        width={bodyW}
        x={bodyX}
        y={-24}
      />
      <Txt
        text={detailLine1}
        fontFamily={theme.bodyFont}
        fontSize={15}
        fontWeight={500}
        fill={theme.black}
        textAlign="left"
        offsetX={-1}
        width={bodyW}
        lineHeight={20}
        x={bodyX}
        y={-2}
      />
      <Txt
        text={detailLine2}
        fontFamily={theme.bodyFont}
        fontSize={15}
        fontWeight={500}
        fill={theme.black}
        textAlign="left"
        offsetX={-1}
        width={bodyW}
        lineHeight={20}
        x={bodyX}
        y={20}
      />
    </Layout>
  );
}

/** Cierre: usos legítimos de IA en el día a día */
export function WorkAiToolSlide() {
  const row0 = -224;
  const row1 = -100;
  const row2 = 24;
  const colL = -352;
  const colR = 352;
  return (
    <SlideFrame title="IA, herramienta de trabajo">
      <WorkToolCard
        x={colL}
        y={row0}
        tag="CODE"
        title="Codificar"
        detailLine1="Borradores, refactors, tests y APIs."
        detailLine2="Acelerar lo repetitivo; tú validas."
        fill={theme.cyan}
      />
      <WorkToolCard
        x={colR}
        y={row0}
        tag="DBG"
        title="Debuggear"
        detailLine1="Logs, stack traces e hipótesis."
        detailLine2="Ordenar síntomas antes de tocar prod."
        fill="#FFE8E8"
      />
      <WorkToolCard
        x={colL}
        y={row1}
        tag="READ"
        title="Research"
        detailLine1="Docs, papers y comparar enfoques."
        detailLine2="Mapa rápido, fuentes en la mano."
        fill={theme.yellow}
      />
      <WorkToolCard
        x={colR}
        y={row1}
        tag="PR"
        title="Revisar cambios"
        detailLine1="Diffs, riesgos y casos borde."
        detailLine2="En pull requests antes del merge."
        fill={theme.magenta}
      />
      <WorkToolCard
        x={colL}
        y={row2}
        tag="TXT"
        title="Documentar"
        detailLine1="README, runbooks y mensajes al equipo."
        detailLine2="Primer borrador, tono claro."
        fill={theme.pie[6]}
      />
      <WorkToolCard
        x={colR}
        y={row2}
        tag="?"
        title="Aprender"
        detailLine1="Explicaciones paso a paso."
        detailLine2="Ejercicios cuando algo nuevo no cierra."
        fill={theme.white}
      />
      <Txt
        text="Asistente en el flujo,"
        fontFamily={theme.bodyFont}
        fontSize={17}
        fontWeight={600}
        fill={theme.pie[0]}
        textAlign="center"
        width={1100}
        lineHeight={24}
        y={262}
      />
      <Txt
        text="no sustituto del criterio ni del diseño del sistema."
        fontFamily={theme.bodyFont}
        fontSize={17}
        fontWeight={600}
        fill={theme.pie[0]}
        textAlign="center"
        width={1100}
        lineHeight={24}
        y={286}
      />
    </SlideFrame>
  );
}

/** Contraste de preguntas */
export function RightQuestionSlide() {
  const boxW = 520;
  const boxH = 228;
  const pad = 28;
  const bodyW = boxW - pad * 2;
  const bodyX = -boxW / 2 + pad;
  const labelY = -boxH / 2 + 36;

  return (
    <SlideFrame title="La pregunta correcta">
      <Layout layout={false} x={-280} y={-128}>
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
          fontSize={20}
          fill={theme.grey}
          textAlign="left"
          offsetX={-1}
          x={bodyX}
          y={labelY}
        />
        <Txt
          text="¿Cómo puedo agregar IA a esto?"
          fontFamily={theme.bodyFont}
          fontSize={20}
          fontWeight={700}
          fill={theme.black}
          textAlign="left"
          offsetX={-1}
          width={bodyW}
          lineHeight={28}
          x={bodyX}
          y={-4}
        />
      </Layout>
      <Layout layout={false} x={280} y={-128}>
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
          fontSize={20}
          fill={theme.grey}
          textAlign="left"
          offsetX={-1}
          x={bodyX}
          y={labelY}
        />
        <Txt
          text="¿Cuál es la solución más eficiente"
          fontFamily={theme.bodyFont}
          fontSize={18}
          fontWeight={700}
          fill={theme.black}
          textAlign="left"
          offsetX={-1}
          width={bodyW}
          lineHeight={26}
          x={bodyX}
          y={-18}
        />
        <Txt
          text="que resuelve este problema"
          fontFamily={theme.bodyFont}
          fontSize={18}
          fontWeight={700}
          fill={theme.black}
          textAlign="left"
          offsetX={-1}
          width={bodyW}
          lineHeight={26}
          x={bodyX}
          y={8}
        />
        <Txt
          text="correctamente?"
          fontFamily={theme.bodyFont}
          fontSize={18}
          fontWeight={700}
          fill={theme.black}
          textAlign="left"
          offsetX={-1}
          width={bodyW}
          lineHeight={26}
          x={bodyX}
          y={34}
        />
      </Layout>
    </SlideFrame>
  );
}
