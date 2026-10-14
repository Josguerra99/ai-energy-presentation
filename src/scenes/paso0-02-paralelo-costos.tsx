import {Circle, Img, Layout, Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createPaso0Shell, loadPaso0Fonts} from './shared/paso0-shell';
import {
  all,
  beginSlide,
  createRef,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  waitFor,
} from '@motion-canvas/core';
import {Paso0ChapterTitleCard} from '../components/Paso0ChapterTitleCard';
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

export default makeScene2D(function* (view) {
  yield* loadPaso0Fonts();
  const {scrollTo, setFooter, contentW, contentH} = createPaso0Shell(view);

  const hardwareChapterCard = createRef<Layout>();
  const hardwareChapterTitle = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <Paso0ChapterTitleCard
          cardRef={hardwareChapterCard}
          titleRef={hardwareChapterTitle}
          title="El hardware necesario"
          kicker="Parte 2"
          tagline="De la CPU secuencial al paralelismo de la GPU"
        />
      </Layout>,
    );
  });
  setFooter([]);
  yield* all(
    hardwareChapterCard().opacity(1, 0.55, easeOutCubic),
    hardwareChapterCard().scale(1, 0.55, easeOutBack),
  );
  yield* beginSlide('hardware-necesario-inicio');

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
      <Layout layout={false} width={contentW} height={contentH}>
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
});
