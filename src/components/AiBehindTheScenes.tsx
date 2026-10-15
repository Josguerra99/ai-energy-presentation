import {Layout, Line, Latex, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {theme} from '../theme';

export const MAGIC_MACHINE_W = 420;
export const MAGIC_MACHINE_H = 320;
export const MAGIC_BUBBLE_W = 380;
export const MAGIC_BUBBLE_H = 200;
export const MAGIC_ROW_Y = 40;
export const MAGIC_IN_X = -620;
export const MAGIC_OUT_X = 620;
export const MAGIC_MACHINE_X = 0;

export const MAGIC_PROMPT = 'Un LLM es';
export const MAGIC_ANSWER = 'un modelo de\ninteligencia artificial…';

export const XF_LAYER_COUNT = 5;
export const XF_LAYER_W = 380;
export const XF_LAYER_H = 46;
export const XF_LAYER_GAP = 8;

/** Y relativa al stage (centro = 0) para la capa i. */
export function xfLayerY(i: number): number {
  const totalH =
    XF_LAYER_COUNT * XF_LAYER_H + (XF_LAYER_COUNT - 1) * XF_LAYER_GAP;
  return -totalH / 2 + XF_LAYER_H / 2 + i * (XF_LAYER_H + XF_LAYER_GAP);
}

/** Centro aproximado de un peso (para el marcador). */
export function xfParamPos(layer: number, param: number): {x: number; y: number} {
  return {
    x: XF_LAYER_W / 2 - 12 - (XF_PARAM_COUNT - 1 - param) * 52 - 18,
    y: xfLayerY(layer) + 16,
  };
}

const LAYER_LABELS = [
  'capa 1 · attn + FFN',
  'capa 2 · attn + FFN',
  'capa 3 · attn + FFN',
  '…',
  'capa N · attn + FFN',
] as const;

/** Solo 3 pesos por capa — caben dentro de la caja. */
export const XF_PARAM_COUNT = 3;
const PARAM_SAMPLES = [
  ['0.42', '-1.7', '0.08'],
  ['1.1', '0.03', '-2.4'],
  ['-0.8', '1.5', '0.2'],
  ['·', '·', '·'],
  ['0.7', '-0.3', '1.9'],
] as const;

type AiBehindTheScenesProps = {
  titleRef: Reference<Txt>;
  subtitleRef: Reference<Txt>;
  inputRef: Reference<Layout>;
  /** Contenedor que hacemos zoom (máquina + capas). */
  stageRef: Reference<Layout>;
  machineRef: Reference<Layout>;
  /** Contenido inicial de la caja (IA, luces…); se oculta al revelar capas. */
  machineFaceRef: Reference<Layout>;
  lightRefs: Reference<Rect>[];
  arrowInRef: Reference<Line>;
  arrowOutRef: Reference<Line>;
  outputRef: Reference<Layout>;
  flyRef: Reference<Layout>;
  hintRef: Reference<Txt>;
  layerRefs: Reference<Layout>[];
  paramRefs: Reference<Txt>[][];
  paramCountRef: Reference<Txt>;
  noteRef: Reference<Txt>;
  /** Math dentro de la caja (se quita al mostrar capas) */
  mathInsideRef: Reference<Layout>;
  mathLatexRefs: Reference<Latex>[];
  mathOpsRef: Reference<Txt>;
  /** Marcador del peso que se está ajustando */
  paramMarkerRef: Reference<Rect>;
  /** Un solo recuadro: texto → vectores */
  inPanelRef: Reference<Layout>;
  inTextRef: Reference<Txt>;
  inVecRef: Reference<Txt>;
  inMathRef: Reference<Txt>;
  inArrowBoxRef: Reference<Line>;
  inArrowBoxLabelRef: Reference<Txt>;
  /** Un solo recuadro: vector h → distribución → token */
  outPanelRef: Reference<Layout>;
  outVecRef: Reference<Txt>;
  outDistRef: Reference<Txt>;
  outTokenRef: Reference<Txt>;
  outMathRef: Reference<Txt>;
  outArrowBoxRef: Reference<Line>;
  outArrowBoxLabelRef: Reference<Txt>;
};

/**
 * Apertura: máquina mágica → zoom a la caja → Transformer + parámetros.
 */
export function AiBehindTheScenes({
  titleRef,
  subtitleRef,
  inputRef,
  stageRef,
  machineRef,
  machineFaceRef,
  lightRefs,
  arrowInRef,
  arrowOutRef,
  outputRef,
  flyRef,
  hintRef,
  layerRefs,
  paramRefs,
  paramCountRef,
  noteRef,
  mathInsideRef,
  mathLatexRefs,
  mathOpsRef,
  paramMarkerRef,
  inPanelRef,
  inTextRef,
  inVecRef,
  inMathRef,
  inArrowBoxRef,
  inArrowBoxLabelRef,
  outPanelRef,
  outVecRef,
  outDistRef,
  outTokenRef,
  outMathRef,
  outArrowBoxRef,
  outArrowBoxLabelRef,
}: AiBehindTheScenesProps) {
  return (
    <Layout layout={false} width={'100%'} height={'100%'}>
      <Txt
        ref={titleRef}
        text="Qué pasa detrás de la IA (LLM)"
        fontFamily={theme.pixelFont}
        fontSize={64}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-340}
        opacity={0}
      />
      <Txt
        ref={subtitleRef}
        text="¿máquina mágica?"
        fontFamily={theme.bodyFont}
        fontSize={36}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-270}
        opacity={0}
      />

      {/* —— Entrada —— */}
      <Layout
        ref={inputRef}
        layout={false}
        x={MAGIC_IN_X}
        y={MAGIC_ROW_Y}
        opacity={0}
        scale={0.9}
      >
        <Rect
          width={MAGIC_BUBBLE_W}
          height={MAGIC_BUBBLE_H}
          fill={theme.black}
          x={theme.shadow}
          y={theme.shadow}
        />
        <Rect
          width={MAGIC_BUBBLE_W}
          height={MAGIC_BUBBLE_H}
          fill={theme.white}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          text="ENTRADA"
          fontFamily={theme.pixelFont}
          fontSize={28}
          fill={theme.grey}
          y={-MAGIC_BUBBLE_H / 2 + 36}
        />
        <Txt
          text={`“${MAGIC_PROMPT}”`}
          fontFamily={theme.bodyFont}
          fontSize={28}
          fontWeight={600}
          fill={theme.black}
          textAlign="center"
          y={16}
        />
      </Layout>

      <Line
        ref={arrowInRef}
        points={[
          [MAGIC_IN_X + MAGIC_BUBBLE_W / 2 + 16, MAGIC_ROW_Y],
          [-MAGIC_MACHINE_W / 2 - 24, MAGIC_ROW_Y],
        ]}
        stroke={theme.black}
        lineWidth={5}
        endArrow
        arrowSize={16}
        end={0}
        opacity={0}
      />

      {/* Stage: zoom aquí (máquina → capas) */}
      <Layout
        ref={stageRef}
        layout={false}
        x={MAGIC_MACHINE_X}
        y={MAGIC_ROW_Y}
        scale={1}
      >
        <Layout
          ref={machineRef}
          layout={false}
          x={0}
          y={0}
          opacity={0}
          scale={0.85}
        >
          <Rect
            width={MAGIC_MACHINE_W}
            height={MAGIC_MACHINE_H}
            fill={theme.black}
            x={theme.shadow}
            y={theme.shadow}
          />
          <Rect
            width={MAGIC_MACHINE_W}
            height={MAGIC_MACHINE_H}
            fill={theme.black}
            stroke={theme.cyan}
            lineWidth={5}
          />

          {/* Cara inicial: se oculta; la caja se queda */}
          <Layout ref={machineFaceRef} layout={false} opacity={1}>
            <Rect
              ref={lightRefs[0]}
              width={18}
              height={18}
              fill={theme.cyan}
              x={-140}
              y={-MAGIC_MACHINE_H / 2 + 36}
              opacity={0.35}
            />
            <Rect
              ref={lightRefs[1]}
              width={18}
              height={18}
              fill={theme.magenta}
              x={-110}
              y={-MAGIC_MACHINE_H / 2 + 36}
              opacity={0.35}
            />
            <Rect
              ref={lightRefs[2]}
              width={18}
              height={18}
              fill={theme.yellow}
              x={-80}
              y={-MAGIC_MACHINE_H / 2 + 36}
              opacity={0.35}
            />
            <Txt
              text="IA"
              fontFamily={theme.pixelFont}
              fontSize={96}
              fill={theme.cyan}
              y={-20}
            />
            <Txt
              text="caja negra"
              fontFamily={theme.bodyFont}
              fontSize={24}
              fill={theme.grey}
              y={50}
            />
            <Rect
              width={MAGIC_MACHINE_W - 48}
              height={36}
              fill={theme.yellow}
              stroke={theme.black}
              lineWidth={2}
              y={MAGIC_MACHINE_H / 2 - 48}
            />
          </Layout>

          {/* Math en el centro de la caja (luego se remueve para capas) */}
          <Layout ref={mathInsideRef} layout={false} opacity={0}>
            <Latex
              ref={mathLatexRefs[0]}
              tex="{\mathrm{Attn}}(Q,K,V)=\mathrm{softmax}\!\left(\dfrac{QK^{\top}}{\sqrt{d}}\right)V"
              fill={theme.cyan}
              fontSize={16}
              y={-48}
              opacity={0}
            />
            <Latex
              ref={mathLatexRefs[1]}
              tex="{\mathrm{FFN}}(x)=W_{2}\sigma(W_{1}x)+b"
              fill={theme.cyan}
              fontSize={16}
              y={0}
              opacity={0}
            />
            <Latex
              ref={mathLatexRefs[2]}
              tex="Y=XW\ (\mathrm{GEMM})"
              fill={theme.yellow}
              fontSize={18}
              y={48}
              opacity={0}
            />
            <Txt
              ref={mathOpsRef}
              text={
                '×  multiplicar matrices (GEMM)\n+  sumas / sesgos\n÷  exp  ·  softmax'
              }
              fontFamily={theme.bodyFont}
              fontSize={22}
              fontWeight={700}
              fill={theme.cyan}
              textAlign="center"
              y={0}
              opacity={0}
            />
          </Layout>

          {/* Capas dentro de la misma caja (clip para no salirse) */}
          <Layout
            layout={false}
            width={MAGIC_MACHINE_W - 20}
            height={MAGIC_MACHINE_H - 20}
            clip
          >
            {LAYER_LABELS.map((label, i) => (
              <Layout
                key={`layer-${i}`}
                ref={layerRefs[i]}
                layout={false}
                x={0}
                y={xfLayerY(i)}
                opacity={0}
                scale={0.9}
              >
                <Rect
                  width={XF_LAYER_W}
                  height={XF_LAYER_H}
                  fill={theme.black}
                  x={3}
                  y={3}
                />
                <Rect
                  width={XF_LAYER_W}
                  height={XF_LAYER_H}
                  fill={i === 3 ? theme.white : theme.yellow}
                  stroke={theme.cyan}
                  lineWidth={2}
                />
                <Txt
                  text={label}
                  fontFamily={theme.bodyFont}
                  fontSize={15}
                  fontWeight={700}
                  fill={theme.black}
                  offsetX={-1}
                  x={-XF_LAYER_W / 2 + 12}
                />
                {/* Pesos anclados a la derecha, dentro de la capa */}
                <Layout layout={false} x={XF_LAYER_W / 2 - 12}>
                  {PARAM_SAMPLES[i].map((n, j) => (
                    <Txt
                      key={`p-${i}-${j}`}
                      ref={paramRefs[i][j]}
                      text={n}
                      fontFamily={theme.bodyFont}
                      fontSize={14}
                      fontWeight={700}
                      fill={theme.black}
                      offsetX={1}
                      x={-(XF_PARAM_COUNT - 1 - j) * 52}
                      opacity={0}
                    />
                  ))}
                </Layout>
              </Layout>
            ))}
            {/* Subrayado del peso activo */}
            <Rect
              ref={paramMarkerRef}
              width={48}
              height={7}
              fill={theme.black}
              radius={3}
              opacity={0}
              zIndex={8}
            />
          </Layout>
        </Layout>
      </Layout>

      <Layout
        ref={flyRef}
        layout={false}
        x={MAGIC_IN_X}
        y={MAGIC_ROW_Y}
        opacity={0}
        scale={0.7}
        zIndex={30}
      >
        <Rect width={280} height={72} fill={theme.black} x={4} y={4} />
        <Rect
          width={280}
          height={72}
          fill={theme.white}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          text="prompt"
          fontFamily={theme.bodyFont}
          fontSize={26}
          fontWeight={700}
          fill={theme.black}
        />
      </Layout>

      <Line
        ref={arrowOutRef}
        points={[
          [MAGIC_MACHINE_W / 2 + 24, MAGIC_ROW_Y],
          [MAGIC_OUT_X - MAGIC_BUBBLE_W / 2 - 16, MAGIC_ROW_Y],
        ]}
        stroke={theme.black}
        lineWidth={5}
        endArrow
        arrowSize={16}
        end={0}
        opacity={0}
      />

      <Layout
        ref={outputRef}
        layout={false}
        x={MAGIC_OUT_X}
        y={MAGIC_ROW_Y}
        opacity={0}
        scale={0.9}
      >
        <Rect
          width={MAGIC_BUBBLE_W}
          height={MAGIC_BUBBLE_H}
          fill={theme.black}
          x={theme.shadow}
          y={theme.shadow}
        />
        <Rect
          width={MAGIC_BUBBLE_W}
          height={MAGIC_BUBBLE_H}
          fill={theme.cyan}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          text="RESPUESTA"
          fontFamily={theme.pixelFont}
          fontSize={28}
          fill={theme.black}
          y={-MAGIC_BUBBLE_H / 2 + 36}
        />
        <Txt
          text={`“${MAGIC_ANSWER}”`}
          fontFamily={theme.bodyFont}
          fontSize={28}
          fontWeight={700}
          fill={theme.black}
          textAlign="center"
          y={16}
        />
      </Layout>

      <Txt
        ref={hintRef}
        text="¿Qué hay dentro de esa caja?"
        fontFamily={theme.bodyFont}
        fontSize={28}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={320}
        opacity={0}
      />

      <Txt
        ref={paramCountRef}
        text="billones de números ajustables (pesos)"
        fontFamily={theme.pixelFont}
        fontSize={30}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={260}
        opacity={0}
      />
      <Txt
        ref={noteRef}
        text="(+ tokenizer y embeddings, el núcleo es el Transformer)"
        fontFamily={theme.bodyFont}
        fontSize={20}
        fill={theme.grey}
        textAlign="center"
        x={0}
        y={305}
        opacity={0}
      />

      {/* Entrada: un recuadro — texto se transforma en vectores */}
      <Layout
        ref={inPanelRef}
        layout={false}
        x={-640}
        y={10}
        opacity={0}
        scale={0.9}
      >
        <Rect width={240} height={120} fill={theme.black} x={4} y={4} />
        <Rect
          width={240}
          height={120}
          fill={theme.white}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          ref={inTextRef}
          text={'"Un LLM es"'}
          fontFamily={theme.bodyFont}
          fontSize={28}
          fontWeight={700}
          fill={theme.black}
          opacity={1}
        />
        <Txt
          ref={inVecRef}
          text={"[0.12, -0.4, …]\nvectores"}
          fontFamily={theme.bodyFont}
          fontSize={22}
          fontWeight={700}
          fill={theme.black}
          textAlign="center"
          opacity={0}
          scale={0.7}
        />
      </Layout>
      <Txt
        ref={inMathRef}
        text="x = E[id]  ·  embedding lookup"
        fontFamily={theme.bodyFont}
        fontSize={16}
        fill={theme.grey}
        textAlign="center"
        x={-640}
        y={88}
        opacity={0}
      />

      {/* Flecha input → caja (fuera del borde ampliado ~±294) */}
      <Line
        ref={inArrowBoxRef}
        points={[
          [-510, 10],
          [-330, 10],
        ]}
        stroke={theme.black}
        lineWidth={4}
        endArrow
        arrowSize={12}
        end={0}
        opacity={0}
      />
      <Txt
        ref={inArrowBoxLabelRef}
        text="input"
        fontFamily={theme.bodyFont}
        fontSize={14}
        fontWeight={600}
        fill={theme.black}
        x={-420}
        y={-32}
        opacity={0}
      />

      {/* Flecha caja → output (fuera del borde) */}
      <Line
        ref={outArrowBoxRef}
        points={[
          [330, 10],
          [490, 10],
        ]}
        stroke={theme.black}
        lineWidth={4}
        endArrow
        arrowSize={12}
        end={0}
        opacity={0}
      />
      <Txt
        ref={outArrowBoxLabelRef}
        text="output h"
        fontFamily={theme.bodyFont}
        fontSize={14}
        fontWeight={600}
        fill={theme.black}
        x={410}
        y={-32}
        opacity={0}
      />

      {/* Salida: vector h → listado con % → un token */}
      <Layout
        ref={outPanelRef}
        layout={false}
        x={640}
        y={10}
        opacity={0}
        scale={0.9}
      >
        <Rect width={260} height={160} fill={theme.black} x={4} y={4} />
        <Rect
          width={260}
          height={160}
          fill={theme.cyan}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          ref={outVecRef}
          text={"[0.08, 1.2, …]\nvector h"}
          fontFamily={theme.bodyFont}
          fontSize={22}
          fontWeight={700}
          fill={theme.black}
          textAlign="center"
          opacity={1}
        />
        <Txt
          ref={outDistRef}
          text={'“un”   62%\n“el”   18%\n“una”  11%\n…      9%'}
          fontFamily={theme.bodyFont}
          fontSize={18}
          fontWeight={700}
          fill={theme.black}
          textAlign="left"
          opacity={0}
          scale={0.7}
        />
        <Txt
          ref={outTokenRef}
          text={'"un"'}
          fontFamily={theme.bodyFont}
          fontSize={32}
          fontWeight={700}
          fill={theme.black}
          opacity={0}
          scale={0.7}
        />
      </Layout>
      <Txt
        ref={outMathRef}
        text="ℓ = h Wᵀ_U  →  softmax"
        fontFamily={theme.bodyFont}
        fontSize={16}
        fill={theme.grey}
        textAlign="center"
        x={640}
        y={110}
        opacity={0}
      />
    </Layout>
  );
}
