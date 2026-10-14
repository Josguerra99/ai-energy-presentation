import {Circle, Img, Latex, Layout, Line, Rect, Spline, Txt, makeScene2D} from '@motion-canvas/2d';
import {createPaso0Shell, loadPaso0Fonts} from './shared/paso0-shell';
import {
  all,
  beginSlide,
  chain,
  createRef,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  linear,
  loopFor,
  waitFor,
} from '@motion-canvas/core';
import {SourceFooter} from '../components/SourceFooter';
import {Paso0ChapterTitleCard} from '../components/Paso0ChapterTitleCard';
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
import {HypervisorVirtualizationSlide} from '../components/VirtualizationSlides';
import {
  EnergyDcIntroSlide,
  EnergyTrendChart,
  HowToExplainSlide,
  WaterDcIntroSlide,
  WaterDcSourcesSlide,
  WaterDcWasteSlide,
  WaterHyperscalerSlide,
  WaterTrendChart,
} from '../components/EnvironmentalImpactSlides';
import {dcEnergyTrend} from '../data/dcEnergyTrend';
import {dcWaterTrend} from '../data/dcWaterTrend';
import {
  HeavyLlmWhenSlide,
  LighterModelsSlide,
  RightToolIntroSlide,
  SkipGenerativeAiSlide,
} from '../components/SustainableAiUseSlides';
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
  LlmDeepSeekTrainVsInferSlide,
  LlmTrainingModelSlide,
  COST_HIGHLIGHT_OPACITY,
  TRAINING_MODEL_PROFILES,
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
import {deepSeekTrainVsInferPieWithAngles} from '../data/deepSeekTrainVsInfer';
import {tcoSlicesWithAngles} from '../data/tcoSlices';
import {theme} from '../theme';

export default makeScene2D(function* (view) {
  yield* loadPaso0Fonts();
  const {scrollTo, setFooter, contentW, contentH} = createPaso0Shell(view);

  const presentacionCard = createRef<Layout>();
  const presentacionTitle = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <Paso0ChapterTitleCard
          cardRef={presentacionCard}
          titleRef={presentacionTitle}
          title="Energía e IA"
          kicker="Presentación"
          tagline="Del prompt al datacenter: hardware, agua y uso consciente"
        />
      </Layout>,
    );
  });
  setFooter([]);
  yield* all(
    presentacionCard().opacity(1, 0.55, easeOutCubic),
    presentacionCard().scale(1, 0.55, easeOutBack),
  );
  yield* beginSlide('presentacion-inicio');

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
      <Layout layout={false} width={contentW} height={contentH}>
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
      <Layout layout={false} width={contentW} height={contentH}>
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
      <Layout layout={false} width={contentW} height={contentH}>
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
});
