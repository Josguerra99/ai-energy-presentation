import {Circle, Img, Latex, Layout, Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  beginSlide,
  createRef,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  waitFor,
} from '@motion-canvas/core';
import {loadPresentationFonts} from '../fonts';
import {SourceFooter} from '../components/SourceFooter';
import {TcoPieChart} from '../components/TcoPieChart';
import {
  ElectricityBarDiagram,
  EXAMPLE_PUE,
  facilityLoads,
  IT_KW,
  kwHeight,
  TOTAL_KW,
} from '../components/ElectricityBarDiagram';
import {PueTrendChart} from '../components/PueTrendChart';
import {
  COMPARE_A,
  COMPARE_B,
  PueUtilizationCompare,
} from '../components/PueUtilizationCompare';
import {ConsolidateWorkloads, CONSOL_APPS, CONSOL_END_X, CONSOL_END_Y} from '../components/ConsolidateWorkloads';
import {DifferentOsSlide} from '../components/DifferentOsSlide';
import {
  AiBehindTheScenes,
  MAGIC_IN_X,
  MAGIC_MACHINE_X,
  MAGIC_ROW_Y,
  XF_LAYER_COUNT,
  XF_PARAM_COUNT,
  xfParamPos,
} from '../components/AiBehindTheScenes';
import {
  TrainingDemo,
  TRAIN_TOKENS,
  TRAIN_STEPS,
  TRAIN_FAST_RUNS,
  TRAIN_MODEL_X,
  TRAIN_MODEL_Y,
  TRAIN_SPAWN_Y,
  TRAIN_TOKEN_Y,
  TRAIN_SOURCE_Y,
  TRAIN_HIGHLIGHT_W,
  trainTokenX,
  trainSourceX,
  trainSourceXAt,
  trainHighlightLayout,
} from '../components/TrainingDemo';
import {
  InferenceDemo,
  INF_SEED,
  INF_SEED_TEXT,
  INF_GEN,
  INF_TOKEN_COUNT,
  INF_CLONE_MAX,
  INF_MODEL_X,
  INF_MODEL_Y,
  INF_SPAWN_Y,
  INF_INPUT_W,
  INF_CHAR_W,
  INF_CELL_W,
  INF_CELL_H,
  infCellAbs,
} from '../components/InferenceDemo';
import {
  LlmCostCompareScaleSlide,
  LlmPromptCostSlide,
  LlmTrainingCostSlide,
} from '../components/LlmIndustrialCostSlides';
import {
  CpuGpuSlide,
  CPU_OPS,
  CPU_SCAN_COLS,
  CPU_SCAN_COUNT,
  CPU_SCAN_ORIGIN,
  CPU_SCAN_ROWS,
  cpuScanIndex,
  cpuScanPos,
  GPU_CONCURRENT_TILES,
  GPU_ZOOM_FOCUS,
  GPU_ZOOM_SCALE,
  gpuAllTiles,
  gpuTileBounds,
  gpuTileCoverIndices,
  SHADER_CALLOUT_COUNT,
  SHADER_CALLOUTS,
} from '../components/CpuGpuSlide';
import {pueTrend} from '../data/pueTrend';
import {tcoSlicesWithAngles} from '../data/tcoSlices';
import {slide, theme} from '../theme';

/** Distancia del “scroll” entre diapositivas (px). */
const SCROLL_Y = 980;
const SCROLL_DURATION = 0.7;
const CONTENT_H =
  slide.height - slide.paddingY * 2 - slide.footerHeight - 20;
const CONTENT_W = slide.width - slide.paddingX * 2;

export default makeScene2D(function* (view) {
  yield* loadPresentationFonts();

  view.fill(theme.yellow);

  const content = createRef<Layout>();
  const footer = createRef<Layout>();

  // Shell absoluto: evita que layout={false} del viewport rompa el flex y mande el footer arriba.
  view.add(
    <Layout layout={false} width={slide.width} height={slide.height}>
      <Layout
        ref={content}
        layout={false}
        clip
        width={CONTENT_W}
        height={CONTENT_H}
        x={0}
        y={-(slide.footerHeight + 20) / 2}
      />
      <Layout
        ref={footer}
        layout
        direction="column"
        width={CONTENT_W}
        height={slide.footerHeight}
        x={0}
        y={(slide.height / 2) - slide.paddingY - slide.footerHeight / 2}
      >
        <SourceFooter sourceIds={[]} />
      </Layout>
    </Layout>,
  );

  function setFooter(sourceIds: string[]) {
    footer().removeChildren();
    footer().add(<SourceFooter sourceIds={sourceIds} />);
  }

  /**
   * Transición tipo scroll: la diapositiva actual sube y la nueva entra desde abajo.
   */
  function* scrollTo(fill: (panel: Layout) => void) {
    const outgoing =
      content().children().length > 0
        ? (content().children()[0] as Layout)
        : null;

    const incoming = createRef<Layout>();
    content().add(
      <Layout
        ref={incoming}
        layout={false}
        width={CONTENT_W}
        height={CONTENT_H}
        y={outgoing ? SCROLL_Y : 0}
      />,
    );
    fill(incoming());

    if (outgoing) {
      yield* all(
        outgoing.y(-SCROLL_Y, SCROLL_DURATION, easeInOutCubic),
        incoming().y(0, SCROLL_DURATION, easeInOutCubic),
      );
      outgoing.remove();
    }
  }

  // —— Slide 0a: Qué pasa detrás de la IA (LLM) ——
  const magicTitle = createRef<Txt>();
  const magicSubtitle = createRef<Txt>();
  const magicInput = createRef<Layout>();
  const magicStage = createRef<Layout>();
  const magicMachine = createRef<Layout>();
  const magicFace = createRef<Layout>();
  const magicLights = [0, 1, 2].map(() => createRef<Rect>());
  const magicArrowIn = createRef<Line>();
  const magicArrowOut = createRef<Line>();
  const magicOutput = createRef<Layout>();
  const magicFly = createRef<Layout>();
  const magicHint = createRef<Txt>();
  const magicLayers = Array.from({length: XF_LAYER_COUNT}, () =>
    createRef<Layout>(),
  );
  const magicParams = Array.from({length: XF_LAYER_COUNT}, () =>
    Array.from({length: XF_PARAM_COUNT}, () => createRef<Txt>()),
  );
  const magicParamCount = createRef<Txt>();
  const magicNote = createRef<Txt>();
  const magicParamMarker = createRef<Rect>();
  const magicMathInside = createRef<Layout>();
  const magicMathLatex = [0, 1, 2].map(() => createRef<Latex>());
  const magicMathOps = createRef<Txt>();
  const magicInPanel = createRef<Layout>();
  const magicInText = createRef<Txt>();
  const magicInVec = createRef<Txt>();
  const magicInMath = createRef<Txt>();
  const magicInArrowBox = createRef<Line>();
  const magicInArrowBoxLabel = createRef<Txt>();
  const magicOutPanel = createRef<Layout>();
  const magicOutVec = createRef<Txt>();
  const magicOutDist = createRef<Txt>();
  const magicOutToken = createRef<Txt>();
  const magicOutMath = createRef<Txt>();
  const magicOutArrowBox = createRef<Line>();
  const magicOutArrowBoxLabel = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={CONTENT_W} height={CONTENT_H}>
        <AiBehindTheScenes
          titleRef={magicTitle}
          subtitleRef={magicSubtitle}
          inputRef={magicInput}
          stageRef={magicStage}
          machineRef={magicMachine}
          machineFaceRef={magicFace}
          lightRefs={magicLights}
          arrowInRef={magicArrowIn}
          arrowOutRef={magicArrowOut}
          outputRef={magicOutput}
          flyRef={magicFly}
          hintRef={magicHint}
          layerRefs={magicLayers}
          paramRefs={magicParams}
          paramCountRef={magicParamCount}
          noteRef={magicNote}
          mathInsideRef={magicMathInside}
          mathLatexRefs={magicMathLatex}
          mathOpsRef={magicMathOps}
          paramMarkerRef={magicParamMarker}
          inPanelRef={magicInPanel}
          inTextRef={magicInText}
          inVecRef={magicInVec}
          inMathRef={magicInMath}
          inArrowBoxRef={magicInArrowBox}
          inArrowBoxLabelRef={magicInArrowBoxLabel}
          outPanelRef={magicOutPanel}
          outVecRef={magicOutVec}
          outDistRef={magicOutDist}
          outTokenRef={magicOutToken}
          outMathRef={magicOutMath}
          outArrowBoxRef={magicOutArrowBox}
          outArrowBoxLabelRef={magicOutArrowBoxLabel}
        />
      </Layout>,
    );
  });
  setFooter([]);

  // Título + subtítulo
  yield* all(
    magicTitle().opacity(1, 0.4, easeOutCubic),
    magicSubtitle().opacity(1, 0.45, easeOutCubic),
  );
  yield* beginSlide('ia-detras-titulo');

  // Aparece la máquina
  yield* all(
    magicMachine().opacity(1, 0.4, easeOutCubic),
    magicMachine().scale(1, 0.45, easeOutBack),
  );
  yield* beginSlide('ia-detras-maquina');

  // Entrada + flecha
  yield* all(
    magicInput().opacity(1, 0.35, easeOutCubic),
    magicInput().scale(1, 0.4, easeOutBack),
    magicArrowIn().opacity(1, 0.3, easeOutCubic),
    magicArrowIn().end(1, 0.4, easeOutCubic),
  );
  yield* beginSlide('ia-detras-entrada');

  // El prompt entra a la máquina
  magicFly().position([MAGIC_IN_X, MAGIC_ROW_Y]);
  magicFly().scale(0.7);
  yield* magicFly().opacity(1, 0.15, easeOutCubic);
  yield* all(
    magicFly().x(MAGIC_MACHINE_X, 0.55, easeInOutCubic),
    magicFly().y(MAGIC_ROW_Y, 0.55, easeInOutCubic),
    magicFly().scale(0.35, 0.55, easeInOutCubic),
  );
  yield* all(
    magicFly().opacity(0, 0.2, easeOutCubic),
    magicMachine().scale(1.06, 0.2, easeInOutCubic),
  );
  // Luces “procesando”
  for (let blink = 0; blink < 3; blink++) {
    yield* all(
      ...magicLights.map((l, i) =>
        l().opacity(i === blink % 3 ? 1 : 0.35, 0.12, easeOutCubic),
      ),
    );
  }
  yield* all(
    ...magicLights.map(l => l().opacity(1, 0.15, easeOutCubic)),
    magicMachine().scale(1, 0.25, easeOutCubic),
  );
  yield* beginSlide('ia-detras-entra');

  // Sale la respuesta
  yield* all(
    magicArrowOut().opacity(1, 0.25, easeOutCubic),
    magicArrowOut().end(1, 0.4, easeOutCubic),
    magicOutput().opacity(1, 0.4, easeOutCubic),
    magicOutput().scale(1, 0.45, easeOutBack),
  );
  yield* magicHint().opacity(1, 0.35, easeOutCubic);
  yield* beginSlide('ia-detras');

  // Zoom a la caja negra → revelar Transformer
  yield* all(
    magicInput().opacity(0, 0.35, easeOutCubic),
    magicOutput().opacity(0, 0.35, easeOutCubic),
    magicArrowIn().opacity(0, 0.3, easeOutCubic),
    magicArrowOut().opacity(0, 0.3, easeOutCubic),
    magicHint().opacity(0, 0.3, easeOutCubic),
    magicSubtitle().opacity(0, 0.25, easeOutCubic),
  );
  yield* all(
    magicStage().scale(1.4, 0.7, easeInOutCubic),
    magicStage().y(10, 0.7, easeInOutCubic),
    magicTitle().fontSize(44, 0.5, easeOutCubic),
    magicTitle().y(-320, 0.5, easeOutCubic),
  );
  yield* beginSlide('ia-detras-zoom');

  // Se abre la caja (cerca) → matemática del flujo; luego capas
  magicTitle().text('Dentro: un Transformer');
  magicSubtitle().text('entrada → álgebra lineal → salida');
  magicSubtitle().y(-265);
  yield* all(
    magicFace().opacity(0, 0.35, easeOutCubic),
    magicTitle().opacity(1, 0.3, easeOutCubic),
    magicSubtitle().opacity(1, 0.35, easeOutCubic),
  );

  // Un recuadro: texto → se transforma en vectores
  yield* all(
    magicInPanel().opacity(1, 0.35, easeOutCubic),
    magicInPanel().scale(1, 0.4, easeOutBack),
  );
  yield* beginSlide('ia-detras-entrada-texto');
  yield* all(
    magicInText().opacity(0, 0.35, easeInOutCubic),
    magicInText().scale(0.7, 0.35, easeInOutCubic),
    magicInPanel().scale(1.06, 0.2, easeInOutCubic),
  );
  yield* all(
    magicInVec().opacity(1, 0.4, easeOutCubic),
    magicInVec().scale(1, 0.35, easeOutBack),
    magicInPanel().scale(1, 0.25, easeOutCubic),
    magicInMath().opacity(1, 0.35, easeOutCubic),
  );
  // Flecha → caja
  yield* all(
    magicInArrowBox().opacity(1, 0.15, easeOutCubic),
    magicInArrowBox().end(1, 0.4, easeOutCubic),
    magicInArrowBoxLabel().opacity(1, 0.3, easeOutCubic),
  );
  yield* beginSlide('ia-detras-entrada-embed');

  // Math DENTRO de la caja
  yield* magicMathInside().opacity(1, 0.25, easeOutCubic);
  for (const eq of magicMathLatex) {
    yield* eq().opacity(1, 0.28, easeOutCubic);
  }
  yield* beginSlide('ia-detras-math');
  // Reemplazar fórmulas por operaciones simplificadas
  yield* all(
    ...magicMathLatex.map(eq => eq().opacity(0, 0.3, easeOutCubic)),
  );
  yield* magicMathOps().opacity(1, 0.4, easeOutCubic);
  yield* beginSlide('ia-detras-math-ops');

  // Flecha caja → salida
  yield* all(
    magicOutArrowBox().opacity(1, 0.15, easeOutCubic),
    magicOutArrowBox().end(1, 0.4, easeOutCubic),
    magicOutArrowBoxLabel().opacity(1, 0.3, easeOutCubic),
  );
  // Un recuadro: vector h
  yield* all(
    magicOutPanel().opacity(1, 0.35, easeOutCubic),
    magicOutPanel().scale(1, 0.4, easeOutBack),
  );
  yield* beginSlide('ia-detras-salida-vector');
  // Vector → listado de tokens con %
  yield* all(
    magicOutVec().opacity(0, 0.35, easeInOutCubic),
    magicOutVec().scale(0.7, 0.35, easeInOutCubic),
    magicOutPanel().scale(1.06, 0.2, easeInOutCubic),
  );
  yield* all(
    magicOutDist().opacity(1, 0.4, easeOutCubic),
    magicOutDist().scale(1, 0.35, easeOutBack),
    magicOutPanel().scale(1, 0.25, easeOutCubic),
    magicOutMath().opacity(1, 0.35, easeOutCubic),
  );
  yield* beginSlide('ia-detras-salida-dist');
  // Se simplifica a un solo token
  yield* all(
    magicOutDist().opacity(0, 0.3, easeInOutCubic),
    magicOutDist().scale(0.7, 0.3, easeInOutCubic),
  );
  yield* all(
    magicOutToken().opacity(1, 0.4, easeOutCubic),
    magicOutToken().scale(1, 0.35, easeOutBack),
  );
  yield* beginSlide('ia-detras-salida');

  // Quitar math de la caja → mostrar capas
  magicSubtitle().text('capas apiladas · millones de parámetros cada una');
  yield* all(
    magicMathInside().opacity(0, 0.3, easeOutCubic),
    ...magicMathLatex.map(eq => eq().opacity(0, 0.25, easeOutCubic)),
    magicMathOps().opacity(0, 0.25, easeOutCubic),
    magicSubtitle().opacity(1, 0.3, easeOutCubic),
  );
  for (let i = 0; i < XF_LAYER_COUNT; i++) {
    yield* all(
      magicLayers[i]().opacity(1, 0.2, easeOutCubic),
      magicLayers[i]().scale(1, 0.25, easeOutBack),
    );
  }
  yield* beginSlide('ia-detras-capas');

  for (let i = 0; i < XF_LAYER_COUNT; i++) {
    yield* all(
      ...magicParams[i].map(p => p().opacity(1, 0.12, easeOutCubic)),
    );
  }
  yield* all(
    magicParamCount().opacity(1, 0.35, easeOutCubic),
    magicNote().opacity(1, 0.4, easeOutCubic),
  );
  yield* beginSlide('ia-detras-params');

  // Acercar la caja y animar pesos uno a uno
  const PARAM_START = [
    [0.42, -1.7, 0.08],
    [1.1, 0.03, -2.4],
    [-0.8, 1.5, 0.2],
    [0, 0, 0], // capa “…”
    [0.7, -0.3, 1.9],
  ];
  const PARAM_END = [
    [0.61, -0.9, 0.33],
    [1.4, 0.11, -1.8],
    [-0.3, 2.1, 0.55],
    [0, 0, 0],
    [0.9, -0.1, 1.6],
  ];
  const fmtW = (n: number) => {
    const a = Math.abs(n);
    if (a >= 10) return n.toFixed(0);
    if (a >= 1) return n.toFixed(1);
    return n.toFixed(2);
  };
  yield* all(
    magicStage().scale(1.9, 0.55, easeInOutCubic),
    magicStage().y(-30, 0.55, easeInOutCubic),
    magicInPanel().opacity(0.12, 0.35, easeOutCubic),
    magicInMath().opacity(0, 0.25, easeOutCubic),
    magicOutPanel().opacity(0.12, 0.35, easeOutCubic),
    magicOutMath().opacity(0, 0.25, easeOutCubic),
    magicInArrowBox().opacity(0.15, 0.3, easeOutCubic),
    magicOutArrowBox().opacity(0.15, 0.3, easeOutCubic),
    magicInArrowBoxLabel().opacity(0, 0.25, easeOutCubic),
    magicOutArrowBoxLabel().opacity(0, 0.25, easeOutCubic),
    magicParamCount().opacity(0, 0.25, easeOutCubic),
    magicNote().opacity(0, 0.25, easeOutCubic),
  );
  yield* beginSlide('ia-detras-params-anim');

  const FOCUS_CELLS: [number, number][] = [];
  for (let i = 0; i < XF_LAYER_COUNT; i++) {
    if (i === 3) continue;
    for (let j = 0; j < XF_PARAM_COUNT; j++) {
      FOCUS_CELLS.push([i, j]);
    }
  }
  const TICKS_PER_CELL = 4;
  const TICK_DUR = 0.045;
  const MOVE_DUR = 0.09;
  const firstPos = xfParamPos(FOCUS_CELLS[0][0], FOCUS_CELLS[0][1]);
  magicParamMarker().position(firstPos);

  // Atenuar todos; el activo se resalta al visitarlo
  for (let i = 0; i < XF_LAYER_COUNT; i++) {
    if (i === 3) continue;
    for (let j = 0; j < XF_PARAM_COUNT; j++) {
      magicParams[i][j]().opacity(0.35);
    }
  }
  yield* magicParamMarker().opacity(1, 0.08, easeOutCubic);

  let prevI = -1;
  let prevJ = -1;
  for (let c = 0; c < FOCUS_CELLS.length; c++) {
    const [fi, fj] = FOCUS_CELLS[c];
    const pos = xfParamPos(fi, fj);

    if (prevI >= 0) {
      magicParams[prevI][prevJ]().scale(1);
      magicParams[prevI][prevJ]().fontSize(14);
      magicParams[prevI][prevJ]().opacity(0.35);
    }

    magicParams[fi][fj]().fontSize(18);
    magicParams[fi][fj]().opacity(1);
    yield* all(
      magicParamMarker().position(pos, MOVE_DUR, easeInOutCubic),
      magicParams[fi][fj]().scale(1.35, MOVE_DUR, easeOutBack),
    );

    // Solo cambia el peso bajo el marcador
    const a = PARAM_START[fi][fj];
    const b = PARAM_END[fi][fj];
    for (let k = 1; k <= TICKS_PER_CELL; k++) {
      const t = k / TICKS_PER_CELL;
      const wobble =
        Math.sin(t * Math.PI * 3 + fi + fj) * 0.18 * (1 - t);
      magicParams[fi][fj]().text(fmtW(a + (b - a) * t + wobble));
      yield* waitFor(TICK_DUR);
    }
    magicParams[fi][fj]().text(fmtW(b));
    prevI = fi;
    prevJ = fj;
  }

  if (prevI >= 0) {
    magicParams[prevI][prevJ]().scale(1);
    magicParams[prevI][prevJ]().fontSize(14);
  }
  yield* all(
    magicParamMarker().opacity(0, 0.1, easeOutCubic),
    ...FOCUS_CELLS.map(([i, j]) => magicParams[i][j]().opacity(1, 0.1, easeOutCubic)),
  );
  yield* beginSlide('ia-detras-params-ajustados');

  // —— Slide 0b: Entrenamiento ventana a ventana ——
  const trainTitle = createRef<Txt>();
  const trainCorpus = createRef<Layout>();
  const trainHighlight = createRef<Rect>();
  const trainLines = [0, 1, 2, 3].map(() => createRef<Txt>());
  const trainToks = TRAIN_TOKENS.map(() => createRef<Layout>());
  const trainTokFills = TRAIN_TOKENS.map(() => createRef<Rect>());
  const trainTokTxts = TRAIN_TOKENS.map(() => createRef<Txt>());
  const trainClones = TRAIN_TOKENS.map(() => createRef<Layout>());
  const trainCloneFills = TRAIN_TOKENS.map(() => createRef<Rect>());
  const trainCloneTxts = TRAIN_TOKENS.map(() => createRef<Txt>());
  const trainBlank = createRef<Layout>();
  const trainModel = createRef<Layout>();
  const trainParams = [0, 1, 2, 3].map(() => createRef<Txt>());
  const trainPredict = createRef<Layout>();
  const trainPredictFill = createRef<Rect>();
  const trainPredictTxt = createRef<Txt>();
  const trainTarget = createRef<Txt>();
  const trainStatus = createRef<Txt>();
  const trainPunch = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={CONTENT_W} height={CONTENT_H}>
        <TrainingDemo
          titleRef={trainTitle}
          corpusRef={trainCorpus}
          highlightRef={trainHighlight}
          lineRefs={trainLines}
          tokenRefs={trainToks}
          tokenFillRefs={trainTokFills}
          tokenTxtRefs={trainTokTxts}
          cloneRefs={trainClones}
          cloneFillRefs={trainCloneFills}
          cloneTxtRefs={trainCloneTxts}
          blankRef={trainBlank}
          modelRef={trainModel}
          paramRefs={trainParams}
          predictRef={trainPredict}
          predictFillRef={trainPredictFill}
          predictTxtRef={trainPredictTxt}
          targetRef={trainTarget}
          statusRef={trainStatus}
          punchRef={trainPunch}
        />
      </Layout>,
    );
  });
  setFooter([]);
  yield* beginSlide('ia-entrenamiento');

  // Corpus visible (opacidad 1; no se vuelve transparente)
  yield* trainCorpus().opacity(1, 0.45, easeOutCubic);
  yield* beginSlide('ia-entrenamiento-corpus');

  // Highlight L→R como marcador sobre la frase
  yield* trainHighlight().width(TRAIN_HIGHLIGHT_W, 0.85, easeInOutCubic);
  yield* beginSlide('ia-entrenamiento-highlight');

  // Tokens nacen sobre el texto resaltado y vuelan a la fila
  for (let i = 0; i < trainToks.length; i++) {
    trainToks[i]().x(trainSourceX(i));
    trainToks[i]().y(TRAIN_SOURCE_Y);
    trainToks[i]().scale(0.45);
    trainToks[i]().opacity(0);
  }
  yield* all(
    ...trainToks.map(tok =>
      all(tok().opacity(1, 0.25, easeOutCubic), tok().scale(0.7, 0.25, easeOutBack)),
    ),
  );
  yield* all(
    ...trainToks.map((tok, i) =>
      all(
        tok().x(trainTokenX(i), 0.55, easeInOutCubic),
        tok().y(TRAIN_TOKEN_Y, 0.55, easeInOutCubic),
        tok().scale(1, 0.55, easeOutBack),
      ),
    ),
  );
  yield* beginSlide('ia-entrenamiento-tokens-fila');

  for (let i = 1; i < trainToks.length; i++) {
    trainToks[i]().opacity(0.25);
  }
  trainTokFills[0]().fill(theme.cyan);

  yield* all(
    trainModel().opacity(1, 0.4, easeOutCubic),
    trainModel().scale(1, 0.4, easeOutBack),
  );
  yield* beginSlide('ia-entrenamiento-modelo');

  /** Clones del contexto → entran al modelo; los tokens reales no se mueven. */
  function* feedContextIntoModel(contextCount: number, speed = 1) {
    if (contextCount <= 0) return;
    const tIn = 0.35 / speed;
    // Colocar clones encima de cada token y copiar aspecto
    for (let i = 0; i < contextCount; i++) {
      trainCloneTxts[i]().text(trainTokTxts[i]().text());
      trainCloneFills[i]().fill(trainTokFills[i]().fill());
      trainClones[i]().position([trainTokenX(i), TRAIN_TOKEN_Y]);
      trainClones[i]().scale(1);
      trainClones[i]().opacity(1);
    }
    yield* all(
      ...Array.from({length: contextCount}, (_, i) =>
        all(
          trainClones[i]().x(
            TRAIN_MODEL_X + (i - (contextCount - 1) / 2) * 36,
            tIn,
            easeInOutCubic,
          ),
          trainClones[i]().y(TRAIN_MODEL_Y, tIn, easeInOutCubic),
          trainClones[i]().scale(0.4, tIn, easeInOutCubic),
        ),
      ),
    );
    yield* all(
      ...Array.from({length: contextCount}, (_, i) =>
        trainClones[i]().opacity(0, 0.15 / speed, easeOutCubic),
      ),
    );
    // Reset clones fuera de vista
    for (let i = 0; i < contextCount; i++) {
      trainClones[i]().position([trainTokenX(i), TRAIN_TOKEN_Y]);
      trainClones[i]().scale(1);
    }
  }

  /** Predicción: sale del modelo → baja al spawn → sube a la casilla. */
  function* emergePredictToSlot(targetIdx: number, speed = 1) {
    const tOut = 0.28 / speed;
    const tUp = 0.5 / speed;
    trainPredict().x(TRAIN_MODEL_X);
    trainPredict().y(TRAIN_MODEL_Y);
    trainPredict().scale(0.35);
    trainPredict().opacity(0);
    yield* all(
      trainPredict().opacity(1, tOut * 0.6, easeOutCubic),
      trainPredict().y(TRAIN_SPAWN_Y, tOut, easeOutCubic),
      trainPredict().scale(0.55, tOut, easeOutBack),
    );
    yield* all(
      trainPredict().x(trainTokenX(targetIdx), tUp, easeInOutCubic),
      trainPredict().y(TRAIN_TOKEN_Y, tUp, easeInOutCubic),
      trainPredict().scale(1, tUp, easeOutBack),
    );
  }

  // Ventanas: predicción desde el modelo → casilla ?
  for (let s = 0; s < TRAIN_STEPS.length; s++) {
    const step = TRAIN_STEPS[s];
    const targetIdx = step.context;

    for (let i = 0; i < TRAIN_TOKENS.length; i++) {
      if (i < step.context) {
        trainToks[i]().opacity(1);
        trainTokFills[i]().fill(theme.cyan);
      } else if (i === targetIdx) {
        trainToks[i]().opacity(0);
        trainTokFills[i]().fill(theme.cyan);
      } else {
        trainToks[i]().opacity(0.25);
        trainTokFills[i]().fill(theme.white);
      }
    }

    // Espacio para el nuevo token a predecir
    trainBlank().x(trainTokenX(targetIdx));
    trainBlank().y(TRAIN_TOKEN_Y);
    trainBlank().scale(1);
    yield* trainBlank().opacity(1, 0.25, easeOutCubic);
    if (s > 0) {
      yield* beginSlide(`ia-entrenamiento-nuevo-${s}`);
    }

    trainTarget().text(`en el texto: ${step.target}`);
    trainTarget().x(trainTokenX(targetIdx));
    trainTarget().opacity(0);

    // Tokens de contexto entran al modelo antes de predecir
    yield* feedContextIntoModel(step.context);

    if (!step.ok && step.weights) {
      // Incorrecto: vuela predicción mala → corregir con token real
      trainPredictTxt().text(step.guess);
      trainPredictFill().fill(theme.magenta);
      trainStatus().text('✗ predicción incorrecta');
      trainStatus().fill(theme.magenta);
      trainStatus().opacity(0);

      yield* waitFor(0.05);
      yield* emergePredictToSlot(targetIdx);
      yield* all(
        trainTarget().opacity(1, 0.25, easeOutCubic),
        trainStatus().opacity(1, 0.3, easeOutCubic),
      );
      yield* beginSlide(`ia-entrenamiento-paso-${s}`);

      trainStatus().text('✗ error → backpropagation');
      yield* all(
        ...trainParams.map(p => p().opacity(0, 0.15, easeOutCubic)),
        trainModel().scale(1.04, 0.2, easeInOutCubic),
      );
      for (let p = 0; p < 4; p++) {
        trainParams[p]().text(step.weights[p]);
      }
      yield* all(
        ...trainParams.map(p =>
          all(p().opacity(1, 0.2, easeOutCubic), p().fill(theme.cyan, 0)),
        ),
        trainModel().scale(1, 0.2, easeInOutCubic),
      );
      yield* all(...trainParams.map(p => p().fill(theme.white, 0.2, easeOutCubic)));
      yield* beginSlide(`ia-entrenamiento-backprop-${s}`);

      trainStatus().text(`corregido → “${TRAIN_TOKENS.slice(0, targetIdx + 1).join(' ')}”`);
      trainStatus().fill(theme.black);
      trainTokFills[targetIdx]().fill(theme.cyan);
      yield* all(
        trainPredict().opacity(0, 0.25, easeOutCubic),
        trainBlank().opacity(0, 0.25, easeOutCubic),
        trainTarget().opacity(0, 0.25, easeOutCubic),
        trainToks[targetIdx]().opacity(1, 0.3, easeOutCubic),
        trainStatus().opacity(1, 0.25, easeOutCubic),
      );
      yield* beginSlide(`ia-entrenamiento-corrige-${s}`);
      yield* trainStatus().opacity(0, 0.2, easeOutCubic);
    } else {
      // Acierto: sí sale del modelo; al confirmar no se “re-agrega” la misma palabra
      trainPredictTxt().text(step.guess);
      trainPredictFill().fill(theme.cyan);
      trainStatus().text('✓ acierto');
      trainStatus().fill(theme.black);
      trainStatus().opacity(0);

      yield* waitFor(0.05);
      yield* emergePredictToSlot(targetIdx);
      yield* trainStatus().opacity(1, 0.25, easeOutCubic);
      yield* beginSlide(`ia-entrenamiento-paso-${s}`);

      // Token real ya debajo (cyan); solo quitar chip/blank — sin fade-in encima
      trainTokFills[targetIdx]().fill(theme.cyan);
      trainToks[targetIdx]().opacity(1);
      yield* all(
        trainPredict().opacity(0, 0.2, easeOutCubic),
        trainBlank().opacity(0, 0.2, easeOutCubic),
        trainStatus().opacity(0, 0.2, easeOutCubic),
      );
    }

    trainPredict().x(TRAIN_MODEL_X);
    trainPredict().y(TRAIN_SPAWN_Y);
    trainPredict().scale(0.55);
  }

  for (let i = 0; i < TRAIN_TOKENS.length; i++) {
    trainToks[i]().opacity(1);
    trainTokFills[i]().fill(theme.cyan);
  }
  yield* trainPunch().opacity(1, 0.4, easeOutCubic);
  yield* beginSlide('ia-entrenamiento-listo');

  // Montajes rápidos: otras frases del mismo texto, sin pausas
  yield* all(
    trainPunch().opacity(0, 0.2, easeOutCubic),
    trainStatus().opacity(0, 0.15, easeOutCubic),
  );

  for (const run of TRAIN_FAST_RUNS) {
    const layout = trainHighlightLayout(run.before, run.sentence, run.phraseLine);

    // Mismo fragmento; solo otra frase del texto
    for (let i = 0; i < 6; i++) {
      trainTokTxts[i]().text(run.tokens[i]);
      trainTokFills[i]().fill(theme.white);
      trainToks[i]().opacity(0);
      trainToks[i]().scale(0.45);
      trainToks[i]().x(trainSourceXAt(i, layout.phraseCenterX));
      trainToks[i]().y(layout.sourceY);
    }
    trainBlank().opacity(0);
    trainPredict().opacity(0);
    trainTarget().opacity(0);
    trainHighlight().width(0);
    trainHighlight().x(layout.phraseLeft);
    trainHighlight().y(layout.phraseLineY);

    yield* trainHighlight().width(layout.highlightW, 0.16, easeInOutCubic);
    yield* all(
      ...trainToks.map(tok =>
        all(tok().opacity(1, 0.06, easeOutCubic), tok().scale(0.65, 0.06, easeOutBack)),
      ),
    );
    yield* all(
      ...trainToks.map((tok, i) =>
        all(
          tok().x(trainTokenX(i), 0.12, easeInOutCubic),
          tok().y(TRAIN_TOKEN_Y, 0.12, easeInOutCubic),
          tok().scale(1, 0.12, easeOutBack),
        ),
      ),
    );
    for (let i = 1; i < 6; i++) {
      trainToks[i]().opacity(0.25);
    }
    trainTokFills[0]().fill(theme.cyan);

    for (let s = 0; s < run.steps.length; s++) {
      const step = run.steps[s];
      const targetIdx = step.context;

      for (let i = 0; i < 6; i++) {
        if (i < step.context) {
          trainToks[i]().opacity(1);
          trainTokFills[i]().fill(theme.cyan);
        } else if (i === targetIdx) {
          trainToks[i]().opacity(0);
          trainTokFills[i]().fill(theme.cyan);
        } else {
          trainToks[i]().opacity(0.25);
          trainTokFills[i]().fill(theme.white);
        }
      }

      trainBlank().x(trainTokenX(targetIdx));
      trainBlank().y(TRAIN_TOKEN_Y);
      yield* trainBlank().opacity(1, 0.04, easeOutCubic);

      // Contexto entra al modelo (clones; versión rápida)
      if (step.context > 0) {
        for (let i = 0; i < step.context; i++) {
          trainCloneTxts[i]().text(trainTokTxts[i]().text());
          trainCloneFills[i]().fill(trainTokFills[i]().fill());
          trainClones[i]().position([trainTokenX(i), TRAIN_TOKEN_Y]);
          trainClones[i]().scale(1);
          trainClones[i]().opacity(1);
        }
        yield* all(
          ...Array.from({length: step.context}, (_, i) =>
            all(
              trainClones[i]().x(
                TRAIN_MODEL_X + (i - (step.context - 1) / 2) * 28,
                0.08,
                easeInOutCubic,
              ),
              trainClones[i]().y(TRAIN_MODEL_Y, 0.08, easeInOutCubic),
              trainClones[i]().scale(0.35, 0.08, easeInOutCubic),
            ),
          ),
        );
        yield* all(
          ...Array.from({length: step.context}, (_, i) =>
            trainClones[i]().opacity(0, 0.06, easeOutCubic),
          ),
        );
        for (let i = 0; i < step.context; i++) {
          trainClones[i]().position([trainTokenX(i), TRAIN_TOKEN_Y]);
          trainClones[i]().scale(1);
        }
      }

      trainPredictTxt().text(step.guess);
      trainPredictFill().fill(step.ok ? theme.cyan : theme.magenta);

      yield* emergePredictToSlot(targetIdx, 5);

      if (!step.ok && step.weights) {
        yield* all(
          ...trainParams.map(p => p().opacity(0, 0.03, easeOutCubic)),
          trainModel().scale(1.03, 0.05, easeInOutCubic),
        );
        for (let p = 0; p < 4; p++) {
          trainParams[p]().text(step.weights[p]);
        }
        yield* all(
          ...trainParams.map(p => p().opacity(1, 0.03, easeOutCubic)),
          trainModel().scale(1, 0.05, easeInOutCubic),
        );
      }

      trainTokFills[targetIdx]().fill(theme.cyan);
      trainToks[targetIdx]().opacity(1);
      yield* all(
        trainPredict().opacity(0, 0.04, easeOutCubic),
        trainBlank().opacity(0, 0.04, easeOutCubic),
      );
      trainPredict().x(TRAIN_MODEL_X);
      trainPredict().y(TRAIN_SPAWN_Y);
    }

    for (let i = 0; i < 6; i++) {
      trainToks[i]().opacity(1);
      trainTokFills[i]().fill(theme.cyan);
    }
    yield* waitFor(0.08);
  }

  trainPunch().text('× billones de ventanas → así nace el modelo');
  yield* trainPunch().opacity(1, 0.35, easeOutCubic);
  yield* beginSlide('ia-entrenamiento-rapido-listo');

  // —— Slide: Inferencia (detrás de un prompt) ——
  const infTitle = createRef<Txt>();
  const infInputBar = createRef<Layout>();
  const infTyped = createRef<Txt>();
  const infTypeCursor = createRef<Rect>();
  const infSendBtn = createRef<Layout>();
  const infSendFill = createRef<Rect>();
  const infToks = Array.from({length: INF_TOKEN_COUNT}, () => createRef<Layout>());
  const infTokFills = Array.from({length: INF_TOKEN_COUNT}, () => createRef<Rect>());
  const infTokTxts = Array.from({length: INF_TOKEN_COUNT}, () => createRef<Txt>());
  const infClones = Array.from({length: INF_CLONE_MAX}, () => createRef<Layout>());
  const infCloneFills = Array.from({length: INF_CLONE_MAX}, () => createRef<Rect>());
  const infCloneTxts = Array.from({length: INF_CLONE_MAX}, () => createRef<Txt>());
  const infModel = createRef<Layout>();
  const infParams = [0, 1, 2, 3].map(() => createRef<Txt>());
  const infPredict = createRef<Layout>();
  const infPredictFill = createRef<Rect>();
  const infPredictTxt = createRef<Txt>();
  const infStatus = createRef<Txt>();
  const infPunch = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={CONTENT_W} height={CONTENT_H}>
        <InferenceDemo
          titleRef={infTitle}
          inputBarRef={infInputBar}
          typedRef={infTyped}
          typeCursorRef={infTypeCursor}
          sendBtnRef={infSendBtn}
          sendFillRef={infSendFill}
          tokenRefs={infToks}
          tokenFillRefs={infTokFills}
          tokenTxtRefs={infTokTxts}
          cloneRefs={infClones}
          cloneFillRefs={infCloneFills}
          cloneTxtRefs={infCloneTxts}
          modelRef={infModel}
          paramRefs={infParams}
          predictRef={infPredict}
          predictFillRef={infPredictFill}
          predictTxtRef={infPredictTxt}
          statusRef={infStatus}
          punchRef={infPunch}
        />
      </Layout>,
    );
  });
  setFooter([]);

  // Aparece el composer (input + enviar)
  yield* all(
    infInputBar().opacity(1, 0.35, easeOutCubic),
    infInputBar().scale(1, 0.4, easeOutBack),
    infSendBtn().opacity(1, 0.35, easeOutCubic),
    infSendBtn().scale(1, 0.4, easeOutBack),
  );
  const typeBaseX = -INF_INPUT_W / 2 + 24;
  infTypeCursor().x(typeBaseX);
  yield* infTypeCursor().opacity(1, 0.15, easeOutCubic);
  yield* beginSlide('ia-inferencia-composer');

  // El usuario escribe: "Un LLM es"
  for (let i = 1; i <= INF_SEED_TEXT.length; i++) {
    infTyped().text(INF_SEED_TEXT.slice(0, i));
    infTypeCursor().x(typeBaseX + i * INF_CHAR_W);
    yield* waitFor(i === INF_SEED_TEXT.length ? 0.08 : 0.055);
  }
  yield* infTypeCursor().opacity(0.2, 0.15, easeOutCubic);
  yield* infTypeCursor().opacity(1, 0.15, easeOutCubic);
  yield* beginSlide('ia-inferencia-escrito');

  // Presiona Enviar
  yield* all(
    infSendBtn().scale(0.9, 0.1, easeInOutCubic),
    infSendFill().fill(theme.yellow, 0.1, easeOutCubic),
  );
  yield* all(
    infSendBtn().scale(1.05, 0.15, easeOutBack),
    infSendFill().fill(theme.cyan, 0.15, easeOutCubic),
  );
  yield* infSendBtn().scale(1, 0.1, easeOutCubic);

  // Prompt tokenizado: aparecen las celdas del seed
  yield* all(
    infTypeCursor().opacity(0, 0.15, easeOutCubic),
    infInputBar().opacity(0.3, 0.3, easeOutCubic),
    infSendBtn().opacity(0.3, 0.3, easeOutCubic),
  );
  for (let i = 0; i < INF_SEED.length; i++) {
    infTokFills[i]().fill(theme.white);
    yield* all(
      infToks[i]().opacity(1, 0.2, easeOutCubic),
      infToks[i]().scale(1, 0.25, easeOutBack),
    );
  }
  yield* beginSlide('ia-inferencia-enviado');

  // Aparece el modelo (ya entrenado)
  yield* all(
    infModel().opacity(1, 0.4, easeOutCubic),
    infModel().scale(1, 0.45, easeOutBack),
  );
  yield* beginSlide('ia-inferencia-modelo');

  /** Celdas actuales (clones) → entran al modelo. */
  function* feedInferenceTokens(contextCount: number, speed = 1) {
    if (contextCount <= 0) return;
    const start = Math.max(0, contextCount - INF_CLONE_MAX);
    const n = contextCount - start;
    const tIn = 0.35 / speed;
    for (let k = 0; k < n; k++) {
      const i = start + k;
      const pos = infCellAbs(i);
      infCloneTxts[k]().text(infTokTxts[i]().text());
      infCloneFills[k]().fill(infTokFills[i]().fill());
      infClones[k]().position([pos.x, pos.y]);
      infClones[k]().scale(1);
      infClones[k]().opacity(1);
    }
    yield* all(
      ...Array.from({length: n}, (_, k) =>
        all(
          infClones[k]().x(
            INF_MODEL_X + (k - (n - 1) / 2) * 28,
            tIn,
            easeInOutCubic,
          ),
          infClones[k]().y(INF_MODEL_Y, tIn, easeInOutCubic),
          infClones[k]().scale(0.35, tIn, easeInOutCubic),
        ),
      ),
      infModel().scale(1.05, tIn, easeInOutCubic),
    );
    yield* all(
      ...Array.from({length: n}, (_, k) =>
        infClones[k]().opacity(0, 0.12 / speed, easeOutCubic),
      ),
      infModel().scale(1, 0.18 / speed, easeOutCubic),
    );
  }

  /** Sale del modelo → aterriza como nueva celda. */
  function* emergeTokenToCell(tokenIdx: number, speed = 1) {
    const token = INF_GEN[tokenIdx - INF_SEED.length];
    const dest = infCellAbs(tokenIdx);
    const tOut = 0.22 / speed;
    const tUp = 0.4 / speed;
    infPredictTxt().text(token);
    infPredictFill().width(INF_CELL_W);
    infPredictFill().height(INF_CELL_H);
    const shadow = infPredict().children()[0] as Rect;
    shadow.width(INF_CELL_W);
    shadow.height(INF_CELL_H);
    infPredict().x(INF_MODEL_X);
    infPredict().y(INF_MODEL_Y);
    infPredict().scale(0.35);
    infPredict().opacity(0);
    yield* all(
      infPredict().opacity(1, tOut * 0.55, easeOutCubic),
      infPredict().y(INF_SPAWN_Y, tOut, easeOutCubic),
      infPredict().scale(0.55, tOut, easeOutBack),
      infModel().scale(1.04, tOut * 0.8, easeInOutCubic),
    );
    yield* all(
      infPredict().x(dest.x, tUp, easeInOutCubic),
      infPredict().y(dest.y, tUp, easeInOutCubic),
      infPredict().scale(1, tUp, easeOutBack),
      infModel().scale(1, tUp * 0.6, easeOutCubic),
    );
    // Queda la celda real (cyan = generado)
    infTokFills[tokenIdx]().fill(theme.cyan);
    infToks[tokenIdx]().opacity(1);
    infToks[tokenIdx]().scale(1);
    yield* infPredict().opacity(0, 0.1 / speed, easeOutCubic);
  }

  let contextCount = INF_SEED.length;
  const INF_SLOW_COUNT = 4;
  for (let g = 0; g < INF_GEN.length; g++) {
    const tokenIdx = INF_SEED.length + g;
    const speed = g < INF_SLOW_COUNT ? 1 : 5;
    const token = INF_GEN[g];

    if (g < INF_SLOW_COUNT) {
      infStatus().text('tokens actuales → entran al modelo');
      yield* infStatus().opacity(1, 0.15, easeOutCubic);
    }
    yield* feedInferenceTokens(contextCount, speed);

    if (g < INF_SLOW_COUNT) {
      infStatus().text(`siguiente token → “${token}”`);
    }
    yield* emergeTokenToCell(tokenIdx, speed);
    contextCount = tokenIdx + 1;

    if (g < INF_SLOW_COUNT) {
      yield* beginSlide(`ia-inferencia-tok-${g}`);
      yield* infStatus().opacity(0, 0.12, easeOutCubic);
    } else if (g === INF_SLOW_COUNT) {
      infStatus().text('…contexto entra → sale un token → se agrega');
      yield* infStatus().opacity(1, 0.2, easeOutCubic);
    }
  }

  yield* all(
    infStatus().opacity(0, 0.2, easeOutCubic),
    infPunch().opacity(1, 0.4, easeOutCubic),
  );
  yield* beginSlide('ia-inferencia-listo');

  // —— Slide: CPU lento → GPU paralelo (píxeles) ——
  const gpuTitle = createRef<Txt>();
  const gpuSubtitle = createRef<Txt>();
  const gpuCpu = createRef<Layout>();
  const gpuCpuChip = createRef<Layout>();
  const gpuCpuOps = CPU_OPS.map(() => createRef<Txt>());
  const gpuCpuCursor = createRef<Rect>();
  const gpuCpuNote = createRef<Txt>();
  const gpuScreen = createRef<Layout>();
  const gpuImgStage = createRef<Layout>();
  const gpuImg = createRef<Img>();
  const gpuCpuCovers = Array.from({length: CPU_SCAN_COUNT}, () =>
    createRef<Rect>(),
  );
  const gpuSinglePixel = createRef<Rect>();
  const gpuLiveTiles = Array.from({length: GPU_CONCURRENT_TILES}, () =>
    createRef<Layout>(),
  );
  const gpuLiveTileBoxes = Array.from({length: GPU_CONCURRENT_TILES}, () =>
    createRef<Rect>(),
  );
  const gpuShaderLines = Array.from({length: SHADER_CALLOUT_COUNT}, () =>
    createRef<Line>(),
  );
  const gpuShaderDots = Array.from({length: SHADER_CALLOUT_COUNT}, () =>
    createRef<Circle>(),
  );
  const gpuShaderBadges = Array.from({length: SHADER_CALLOUT_COUNT}, () =>
    createRef<Layout>(),
  );
  const gpuScreenLabel = createRef<Txt>();
  const gpuParallelNote = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={CONTENT_W} height={CONTENT_H}>
        <CpuGpuSlide
          titleRef={gpuTitle}
          subtitleRef={gpuSubtitle}
          cpuRef={gpuCpu}
          cpuChipRef={gpuCpuChip}
          cpuOpRefs={gpuCpuOps}
          cpuCursorRef={gpuCpuCursor}
          cpuNoteRef={gpuCpuNote}
          screenRef={gpuScreen}
          imgStageRef={gpuImgStage}
          imgRef={gpuImg}
          cpuCoverRefs={gpuCpuCovers}
          singlePixelRef={gpuSinglePixel}
          liveTileRefs={gpuLiveTiles}
          liveTileBoxRefs={gpuLiveTileBoxes}
          shaderLineRefs={gpuShaderLines}
          shaderDotRefs={gpuShaderDots}
          shaderBadgeRefs={gpuShaderBadges}
          screenLabelRef={gpuScreenLabel}
          parallelNoteRef={gpuParallelNote}
        />
      </Layout>,
    );
  });
  setFooter([]);
  yield* all(
    gpuTitle().opacity(1, 0.35, easeOutCubic),
    gpuSubtitle().opacity(1, 0.4, easeOutCubic),
    gpuCpu().opacity(1, 0.4, easeOutCubic),
  );
  yield* beginSlide('ia-cpu-titulo');

  // CPU: secuencia en serie, más rápida, ×4 (1 + 3 repeticiones)
  gpuCpuCursor().opacity(1);
  const CPU_SEQ_RUNS = 4;
  const CPU_STEP = 0.16;
  const CPU_PAUSE = 0.07;
  for (let run = 0; run < CPU_SEQ_RUNS; run++) {
    if (run > 0) {
      for (const op of gpuCpuOps) {
        op().opacity(0.25);
        op().scale(1);
      }
      gpuCpuCursor().x(-((CPU_OPS.length - 1) * 130) / 2);
    }
    for (let i = 0; i < CPU_OPS.length; i++) {
      const x = -((CPU_OPS.length - 1) * 130) / 2 + i * 130;
      yield* all(
        gpuCpuCursor().x(x, CPU_STEP, easeInOutCubic),
        gpuCpuOps[i]().opacity(1, CPU_STEP * 0.55, easeOutCubic),
        ...gpuCpuOps.map((op, j) =>
          j === i
            ? op().scale(1.12, CPU_STEP * 0.55, easeOutBack)
            : op().scale(1, CPU_STEP * 0.4, easeOutCubic),
        ),
      );
      yield* waitFor(CPU_PAUSE);
    }
  }
  yield* all(
    gpuCpuNote().opacity(1, 0.3, easeOutCubic),
    gpuCpuChip().scale(0.95, 0.25, easeOutCubic),
  );
  yield* beginSlide('ia-cpu-lento');

  // Pantalla con imagen (GPU)
  gpuTitle().text('Así nació la idea… la GPU');
  yield* all(
    gpuCpu().opacity(0, 0.3, easeOutCubic),
    gpuCpuNote().opacity(0, 0.25, easeOutCubic),
    gpuSubtitle().opacity(0, 0.25, easeOutCubic),
    gpuTitle().opacity(1, 0.35, easeOutCubic),
    gpuScreen().opacity(1, 0.4, easeOutCubic),
    gpuScreenLabel().opacity(1, 0.4, easeOutCubic),
  );
  yield* beginSlide('ia-gpu-pantalla');

  // 1) Zoom → un solo píxel + shader
  const zoomS = GPU_ZOOM_SCALE;
  yield* all(
    gpuImgStage().scale(zoomS, 1.1, easeInOutCubic),
    gpuImgStage().position(
      [-GPU_ZOOM_FOCUS.x * zoomS, -GPU_ZOOM_FOCUS.y * zoomS],
      1.1,
      easeInOutCubic,
    ),
    gpuScreenLabel().opacity(0, 0.3, easeOutCubic),
  );
  yield* beginSlide('ia-gpu-zoom');

  // Callouts al centro (1 píxel)
  for (let i = 0; i < SHADER_CALLOUT_COUNT; i++) {
    const badge = SHADER_CALLOUTS[i].badge;
    gpuShaderDots[i]().position(0);
    gpuShaderLines[i]().points([
      [badge.x - 90, badge.y],
      [badge.x - 70, badge.y],
      [10, 0],
      [0, 0],
    ]);
    gpuShaderLines[i]().end(0);
  }

  gpuParallelNote().text('1 píxel → shader: luz + profundidad + color');
  yield* gpuSinglePixel().opacity(1, 0.25, easeOutCubic);
  yield* all(
    ...gpuShaderLines.map(l =>
      all(l().opacity(1, 0.1, easeOutCubic), l().end(1, 0.45, easeOutCubic)),
    ),
    ...gpuShaderDots.map(d => d().opacity(1, 0.35, easeOutCubic)),
    ...gpuShaderBadges.map(b => b().opacity(1, 0.35, easeOutCubic)),
    gpuParallelNote().opacity(1, 0.35, easeOutCubic),
  );
  yield* all(
    gpuSinglePixel().lineWidth(7, 0.2, easeOutCubic),
    ...gpuShaderDots.map(d => d().scale(1.35, 0.2, easeOutCubic)),
  );
  yield* all(
    gpuSinglePixel().lineWidth(4, 0.25, easeOutCubic),
    ...gpuShaderDots.map(d => d().scale(1, 0.25, easeOutCubic)),
  );
  yield* beginSlide('ia-gpu-un-pixel');

  // 2) Alejar la imagen
  yield* all(
    gpuSinglePixel().opacity(0, 0.2, easeOutCubic),
    ...gpuShaderLines.map(l =>
      all(l().end(0, 0.25, easeOutCubic), l().opacity(0, 0.25, easeOutCubic)),
    ),
    ...gpuShaderDots.map(d => d().opacity(0, 0.2, easeOutCubic)),
    ...gpuShaderBadges.map(b => b().opacity(0, 0.2, easeOutCubic)),
    gpuParallelNote().opacity(0, 0.2, easeOutCubic),
    gpuImgStage().scale(1, 0.9, easeInOutCubic),
    gpuImgStage().position([0, 0], 0.9, easeInOutCubic),
  );
  yield* beginSlide('ia-gpu-aleja');

  // 3) CPU: máscara + barrido píxel a píxel (revela la imagen)
  gpuParallelNote().text('CPU: un píxel tras otro…');
  gpuSinglePixel().scale(0.55);
  gpuSinglePixel().position([CPU_SCAN_ORIGIN.x, CPU_SCAN_ORIGIN.y]);
  // Tapar la imagen entera, luego revelar con el cursor
  for (const cover of gpuCpuCovers) {
    cover().opacity(1);
  }
  yield* all(
    gpuSinglePixel().opacity(1, 0.2, easeOutCubic),
    gpuParallelNote().opacity(1, 0.3, easeOutCubic),
  );
  const CPU_SCAN_STEP = 0.014; // ×2 más lento que 0.007
  for (let row = 0; row < CPU_SCAN_ROWS; row++) {
    for (let col = 0; col < CPU_SCAN_COLS; col++) {
      const pos = cpuScanPos(col, row);
      const idx = cpuScanIndex(col, row);
      yield* all(
        gpuSinglePixel().position([pos.x, pos.y], CPU_SCAN_STEP, easeInOutCubic),
        gpuCpuCovers[idx]().opacity(0, CPU_SCAN_STEP * 0.85, easeOutCubic),
      );
    }
  }
  yield* beginSlide('ia-gpu-cpu-scan');

  // 4) GPU: re-tapar y revelar por tiles concurrentes (toda la imagen)
  gpuParallelNote().text(
    'GPU: varios tiles a la vez · revelan la imagen en paralelo',
  );
  yield* gpuSinglePixel().opacity(0, 0.15, easeOutCubic);
  for (const cover of gpuCpuCovers) {
    cover().opacity(1);
  }
  yield* gpuParallelNote().opacity(1, 0.25, easeOutCubic);

  const gpuTiles = gpuAllTiles();
  const GPU_WAVE_DUR = 0.22;
  for (let i = 0; i < gpuTiles.length; i += GPU_CONCURRENT_TILES) {
    const batch = gpuTiles.slice(i, i + GPU_CONCURRENT_TILES);
    const coverIdxs = batch.flatMap(t => gpuTileCoverIndices(t.tx, t.ty));

    for (let b = 0; b < GPU_CONCURRENT_TILES; b++) {
      if (b < batch.length) {
        const bounds = gpuTileBounds(batch[b].tx, batch[b].ty);
        gpuLiveTiles[b]().position([bounds.x, bounds.y]);
        gpuLiveTileBoxes[b]().width(bounds.w + 6);
        gpuLiveTileBoxes[b]().height(bounds.h + 6);
        gpuLiveTiles[b]().opacity(1);
        gpuLiveTiles[b]().scale(1);
      } else {
        gpuLiveTiles[b]().opacity(0);
      }
    }

    yield* all(
      ...coverIdxs.map(idx =>
        gpuCpuCovers[idx]().opacity(0, GPU_WAVE_DUR, easeOutCubic),
      ),
      ...batch.map((_, b) =>
        gpuLiveTiles[b]().scale(1.05, GPU_WAVE_DUR * 0.5, easeOutCubic),
      ),
    );
    yield* all(
      ...batch.map((_, b) =>
        gpuLiveTiles[b]().scale(1, GPU_WAVE_DUR * 0.4, easeOutCubic),
      ),
    );
  }
  yield* all(...gpuLiveTiles.map(t => t().opacity(0, 0.2, easeOutCubic)));
  yield* beginSlide('ia-gpu-paralelo');

  // —— Slides 0c–0e: costos industrial (entrenar · prompt · comparación) ——
  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={CONTENT_W} height={CONTENT_H}>
        <LlmTrainingCostSlide />
      </Layout>,
    );
  });
  setFooter([
    'llama31Card',
    'metaLlamaBlog',
    'deepSeekV3Paper',
    'bloomModelCard',
    'epochAi',
  ]);
  yield* beginSlide('ia-costos-entrenamiento');

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={CONTENT_W} height={CONTENT_H}>
        <LlmPromptCostSlide />
      </Layout>,
    );
  });
  setFooter([
    'openAiPricing',
    'anthropicPricing',
    'googleGeminiPricing',
  ]);
  yield* beginSlide('ia-costos-prompt');

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={CONTENT_W} height={CONTENT_H}>
        <LlmCostCompareScaleSlide />
      </Layout>,
    );
  });
  setFooter([
    'llama31Card',
    'stanfordAiIndex2025',
    'epochAi',
    'openAiPricing',
  ]);
  yield* beginSlide('ia-costos-comparacion');

  // —— Slide 1: TCO pie ——
  const tcoSlices = tcoSlicesWithAngles();
  const pieSliceRefs = tcoSlices.map(() => createRef<Circle>());
  const questionTxt = createRef<Txt>();
  const pieWrap = createRef<Layout>();
  const stage = createRef<Layout>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout ref={stage} layout={false} width={CONTENT_W} height={CONTENT_H}>
        <Txt
          ref={questionTxt}
          text="¿Cuánto cuesta un servidor de $5,000?"
          fontFamily={theme.bodyFont}
          fontSize={52}
          fontWeight={700}
          fill={theme.black}
          textAlign="center"
          x={0}
          y={0}
        />
      </Layout>,
    );
  });
  setFooter(['ieeeTco', 'berkeley2024', 'microsoftTco', 'doe']);
  yield* beginSlide('servidor-costo');

  stage().add(
    <Layout ref={pieWrap} layout={false} opacity={0} x={0} y={80}>
      <TcoPieChart slices={tcoSlices} sliceRefs={pieSliceRefs} />
    </Layout>,
  );

  const pieDuration = 1;
  yield* all(
    questionTxt().y(-340, pieDuration, easeOutCubic),
    pieWrap().opacity(1, pieDuration * 0.85, easeOutCubic),
    pieWrap().y(40, pieDuration, easeOutCubic),
    ...tcoSlices.map((slice, i) =>
      pieSliceRefs[i]().endAngle(slice.endAngle, pieDuration, easeOutCubic),
    ),
  );
  yield* beginSlide('servidor-costo-listo');

  // —— Slide 2: electricidad IT ≠ electricidad del sitio ——
  const itBar = createRef<Rect>();
  const itLabel = createRef<Txt>();
  const segmentRefs = facilityLoads.map(() => createRef<Rect>());
  const labelRefs = facilityLoads.map(() => createRef<Txt>());
  const totalLabel = createRef<Txt>();
  const pueBlock = createRef<Layout>();
  const doeBench = createRef<Layout>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={CONTENT_W} height={CONTENT_H}>
        <ElectricityBarDiagram
          itBar={itBar}
          itLabel={itLabel}
          segmentRefs={segmentRefs}
          labelRefs={labelRefs}
          totalLabel={totalLabel}
        />
        <Layout ref={pueBlock} layout={false} x={340} y={0} opacity={0}>
          <Txt
            text="PUE - Power Usage Effectiveness"
            fontFamily={theme.pixelFont}
            fontSize={28}
            fill={theme.black}
            offsetX={-1}
            x={-220}
            y={-150}
          />
          <Latex
            tex="{\mathrm{PUE}} = \dfrac{\text{Total facility energy}}{\text{IT equipment energy}}"
            fill={theme.black}
            fontSize={28}
            x={-20}
            y={-30}
          />
          <Latex
            tex={`{\\mathrm{PUE}} = \\dfrac{${TOTAL_KW}\\,\\mathrm{kW}}{${IT_KW}\\,\\mathrm{kW}} = ${EXAMPLE_PUE.toFixed(2)}`}
            fill={theme.black}
            fontSize={26}
            x={-40}
            y={100}
          />
          <Layout ref={doeBench} layout={false} x={-40} y={200} opacity={0}>
            <Txt
              text="DOE · 1.6 estándar · 1.4 bueno · 1.1 mejor"
              fontFamily={theme.pixelFont}
              fontSize={26}
              fill={theme.black}
              textAlign="center"
            />
            <Txt
              text="PUE mide la infraestructura de soporte, no la eficiencia computacional."
              fontFamily={theme.bodyFont}
              fontSize={20}
              fill={theme.grey}
              textAlign="center"
              y={36}
            />
          </Layout>
        </Layout>
      </Layout>,
    );
  });
  setFooter(['doe', 'uptime2024']);
  yield* beginSlide('electricidad');

  yield* all(
    itBar().height(kwHeight(IT_KW), 0.7, easeOutCubic),
    itLabel().opacity(1, 0.5),
  );
  yield* beginSlide('electricidad-it');

  for (let i = 0; i < facilityLoads.length; i++) {
    yield* all(
      segmentRefs[i]().height(kwHeight(facilityLoads[i].kw), 0.35, easeOutCubic),
      labelRefs[i]().opacity(1, 0.3),
    );
  }
  yield* totalLabel().opacity(1, 0.45);
  yield* beginSlide('electricidad-barra');

  yield* pueBlock().opacity(1, 0.7, easeOutCubic);
  yield* beginSlide('pue');

  yield* doeBench().opacity(1, 0.5, easeOutCubic);
  yield* beginSlide('pue-doe');

  // —— Slide 3: PUE histórico (Uptime) ——
  const pueLine = createRef<Line>();
  const puePointRefs = pueTrend.map(() => createRef<Circle>());
  const pueLabelRefs = pueTrend.map(() => createRef<Txt>());
  const noteRef = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={CONTENT_W} height={CONTENT_H}>
        <PueTrendChart
          lineRef={pueLine}
          pointRefs={puePointRefs}
          labelRefs={pueLabelRefs}
          noteRef={noteRef}
        />
      </Layout>,
    );
  });
  setFooter(['uptime2024', 'uptime2025', 'uptime2026']);
  yield* beginSlide('pue-tendencia');

  yield* pueLine().end(1, 1.6, easeOutCubic);
  for (let i = 0; i < pueTrend.length; i++) {
    yield* all(
      puePointRefs[i]().scale(1, 0.2, easeOutCubic),
      pueLabelRefs[i]().opacity(pueTrend[i].label ? 1 : 0, 0.2),
    );
  }
  yield* beginSlide('pue-tendencia-serie');

  yield* noteRef().opacity(1, 0.6);
  yield* beginSlide('pue-tendencia-nota');

  // —— Slide 4: misma carga, distinto PUE/utilización ——
  const countA = createRef<Txt>();
  const countB = createRef<Txt>();
  const gridA = createRef<Layout>();
  const gridB = createRef<Layout>();
  const statsA = createRef<Layout>();
  const statsB = createRef<Layout>();
  const fillA = Array.from({length: COMPARE_A.servers}, () => createRef<Rect>());
  const fillB = Array.from({length: COMPARE_B.servers}, () => createRef<Rect>());
  const winnerBox = createRef<Rect>();
  const winnerBadge = createRef<Layout>();
  const winnerChip = createRef<Rect>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={CONTENT_W} height={CONTENT_H}>
        <PueUtilizationCompare
          countA={countA}
          countB={countB}
          gridA={gridA}
          gridB={gridB}
          statsA={statsA}
          statsB={statsB}
          fillA={fillA}
          fillB={fillB}
          winnerBox={winnerBox}
          winnerBadge={winnerBadge}
          winnerChip={winnerChip}
        />
      </Layout>,
    );
  });
  setFooter(['doe', 'uptime2024']);
  yield* beginSlide('pue-vs-util');

  yield* all(
    countA().opacity(1, 0.55),
    countB().opacity(1, 0.55),
    gridA().opacity(1, 0.65),
    gridB().opacity(1, 0.65),
  );
  yield* beginSlide('pue-vs-util-servidores');

  const fillH_A = (COMPARE_A.gridCell - 4) * (COMPARE_A.cpuPct / 100);
  const fillH_B = (COMPARE_B.gridCell - 4) * (COMPARE_B.cpuPct / 100);
  yield* all(
    statsA().opacity(1, 0.55),
    statsB().opacity(1, 0.55),
    ...fillA.map(r => r().height(fillH_A, 0.7, easeOutCubic)),
    ...fillB.map(r => r().height(fillH_B, 0.7, easeOutCubic)),
  );
  yield* beginSlide('pue-vs-util-potencia');

  // B gana: borde cyan + badge + chip de kW
  yield* all(
    winnerBox().stroke(theme.cyan, 0.45),
    winnerBox().lineWidth(6, 0.45),
    winnerBadge().opacity(1, 0.5),
    winnerChip().fill(theme.cyan, 0.45),
  );
  yield* beginSlide('pue-vs-util-ganador');

  // —— Slide 5: consolidar apps en el mismo SO ——
  const beforeLabel = createRef<Txt>();
  const afterLabel = createRef<Txt>();
  const hostRef = createRef<Layout>();
  const chassisRefs = CONSOL_APPS.map(() => createRef<Layout>());
  const utilRefs = CONSOL_APPS.map(() => createRef<Txt>());
  const serverRefs = CONSOL_APPS.map(() => createRef<Layout>());
  const consolPunch = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={CONTENT_W} height={CONTENT_H}>
        <ConsolidateWorkloads
          beforeLabel={beforeLabel}
          afterLabel={afterLabel}
          hostRef={hostRef}
          chassisRefs={chassisRefs}
          utilRefs={utilRefs}
          serverRefs={serverRefs}
          punchRef={consolPunch}
        />
      </Layout>,
    );
  });
  setFooter(['doe']);
  yield* beginSlide('consolidar');

  // Los 4 servidores se unen en uno
  yield* all(
    beforeLabel().opacity(0, 0.35),
    afterLabel().opacity(1, 0.45),
    hostRef().opacity(1, 0.55),
    hostRef().scale(1, 0.7, easeOutCubic),
    ...serverRefs.map((r, i) =>
      all(
        r().x(CONSOL_END_X[i], 0.85, easeInOutCubic),
        r().y(CONSOL_END_Y, 0.85, easeInOutCubic),
      ),
    ),
    ...chassisRefs.map(r => r().opacity(0, 0.5)),
    ...utilRefs.map(r => r().opacity(0, 0.4)),
  );
  yield* beginSlide('consolidar-despues');

  yield* consolPunch().opacity(1, 0.5);
  yield* beginSlide('consolidar-punch');

  // —— Slide 6: SO distintos ——
  const osClash = createRef<Layout>();
  const osPunch = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={CONTENT_W} height={CONTENT_H}>
        <DifferentOsSlide clashRef={osClash} punchRef={osPunch} />
      </Layout>,
    );
  });
  setFooter(['doe']);
  yield* beginSlide('os-conflicto');

  yield* osClash().opacity(1, 0.45);
  yield* beginSlide('os-conflicto-neq');

  yield* osPunch().opacity(1, 0.5);
  yield* beginSlide('os-conflicto-virt');
});
