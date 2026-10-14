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
import {HypervisorVirtualizationSlide} from '../components/VirtualizationSlides';
import {HowToExplainSlide} from '../components/EnvironmentalImpactSlides';
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

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <HowToExplainSlide />
      </Layout>,
    );
  });
  setFooter([
    'berkeley2024',
    'lbnlDcWater2024',
    'googleGeminiEnvMetrics2025',
    'liMakingAiLessThirsty',
  ]);
  yield* beginSlide('ambiente-como-explicarlo');

  // —— Uso responsable: liviano vs pesado ——
  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <RightToolIntroSlide />
      </Layout>,
    );
  });
  setFooter(['chiSmallerModel2025', 'llmEnergyAccuracy2025']);
  yield* beginSlide('uso-ia-herramienta');

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <SkipGenerativeAiSlide />
      </Layout>,
    );
  });
  setFooter(['chiSmallerModel2025']);
  yield* beginSlide('uso-ia-sin-generativa');

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <LighterModelsSlide />
      </Layout>,
    );
  });
  setFooter(['llmEnergyAccuracy2025', 'garCarbonAwareRouting']);
  yield* beginSlide('uso-ia-livianos');

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <HeavyLlmWhenSlide />
      </Layout>,
    );
  });
  setFooter(['anthropicPricing', 'openAiPricing']);
  yield* beginSlide('uso-ia-pesados');
  yield* beginSlide('uso-ia-pesados-listo');
});
