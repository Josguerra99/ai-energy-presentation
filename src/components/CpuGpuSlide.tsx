import {Circle, Img, Layout, Line, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {theme} from '../theme';
import gpuScreenImg from '../assets/gpu-screen.jpg';

/** Ops secuenciales que muestra la CPU. */
export const CPU_OPS = [
  'matmul',
  'softmax',
  'attn',
  'FFN',
  'grad',
  'update',
] as const;

export const REAL_PIXELS = 1920 * 1080; // 2_073_600

/** Monitor pixel-art 16:9 */
export const GPU_SCREEN_INNER_W = 820;
export const GPU_SCREEN_INNER_H = 460;
const BEZEL = 28;
const BEZEL_OUTER = 10;
export const GPU_SCREEN_W = GPU_SCREEN_INNER_W + BEZEL * 2 + BEZEL_OUTER * 2;
export const GPU_SCREEN_H = GPU_SCREEN_INNER_H + BEZEL * 2 + BEZEL_OUTER * 2 + 36;

/**
 * Zoom moderado al coche / calle (coords locales al centro del Img).
 */
export const GPU_ZOOM_FOCUS = {
  x: -GPU_SCREEN_INNER_W * 0.05,
  y: GPU_SCREEN_INNER_H * 0.12,
};
export const GPU_ZOOM_SCALE = 4.5;

/** Tamaño del marco de 1 píxel (zoom cercano). */
export const SINGLE_PIXEL_SIZE = 44;

/** Barrido CPU: un píxel tras otro cubriendo toda la imagen (izq → der). */
export const CPU_SCAN_CELL = 40;
export const CPU_SCAN_COLS = Math.floor(GPU_SCREEN_INNER_W / CPU_SCAN_CELL);
export const CPU_SCAN_ROWS = Math.floor(GPU_SCREEN_INNER_H / CPU_SCAN_CELL);
export const CPU_SCAN_COUNT = CPU_SCAN_COLS * CPU_SCAN_ROWS;
export const CPU_SCAN_ORIGIN = {
  x: -GPU_SCREEN_INNER_W / 2 + CPU_SCAN_CELL / 2,
  y: -GPU_SCREEN_INNER_H / 2 + CPU_SCAN_CELL / 2,
} as const;

export function cpuScanPos(col: number, row: number): {x: number; y: number} {
  return {
    x: CPU_SCAN_ORIGIN.x + col * CPU_SCAN_CELL,
    y: CPU_SCAN_ORIGIN.y + row * CPU_SCAN_CELL,
  };
}

export function cpuScanIndex(col: number, row: number): number {
  return row * CPU_SCAN_COLS + col;
}

/**
 * GPU: tiles sobre la misma grilla de máscara.
 * Varios tiles activos a la vez → revelan la imagen completa.
 */
export const GPU_TILE_CELL_COLS = 4;
export const GPU_TILE_CELL_ROWS = 3;
export const GPU_TILE_COLS = Math.ceil(CPU_SCAN_COLS / GPU_TILE_CELL_COLS);
export const GPU_TILE_ROWS = Math.ceil(CPU_SCAN_ROWS / GPU_TILE_CELL_ROWS);
export const GPU_CONCURRENT_TILES = 4;

export type GpuTileCoord = {tx: number; ty: number};

export function gpuAllTiles(): GpuTileCoord[] {
  const out: GpuTileCoord[] = [];
  for (let ty = 0; ty < GPU_TILE_ROWS; ty++) {
    for (let tx = 0; tx < GPU_TILE_COLS; tx++) {
      out.push({tx, ty});
    }
  }
  return out;
}

export function gpuTileBounds(tx: number, ty: number): {
  col0: number;
  row0: number;
  cols: number;
  rows: number;
  x: number;
  y: number;
  w: number;
  h: number;
} {
  const col0 = tx * GPU_TILE_CELL_COLS;
  const row0 = ty * GPU_TILE_CELL_ROWS;
  const cols = Math.min(GPU_TILE_CELL_COLS, CPU_SCAN_COLS - col0);
  const rows = Math.min(GPU_TILE_CELL_ROWS, CPU_SCAN_ROWS - row0);
  const w = cols * CPU_SCAN_CELL;
  const h = rows * CPU_SCAN_CELL;
  const topLeft = cpuScanPos(col0, row0);
  return {
    col0,
    row0,
    cols,
    rows,
    w,
    h,
    x: topLeft.x - CPU_SCAN_CELL / 2 + w / 2,
    y: topLeft.y - CPU_SCAN_CELL / 2 + h / 2,
  };
}

export function gpuTileCoverIndices(tx: number, ty: number): number[] {
  const {col0, row0, cols, rows} = gpuTileBounds(tx, ty);
  const idxs: number[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      idxs.push(cpuScanIndex(col0 + c, row0 + r));
    }
  }
  return idxs;
}

/** Callouts tipo HUD (fase 1 píxel; tips se reubican en la escena). */
export const SHADER_CALLOUTS = [
  {
    id: 'luz',
    label: 'luz',
    tip: {x: 0, y: 0},
    badge: {x: 340, y: -100},
  },
  {
    id: 'depth',
    label: 'profundidad',
    tip: {x: 0, y: 0},
    badge: {x: 340, y: 10},
  },
  {
    id: 'color',
    label: 'color',
    tip: {x: 0, y: 0},
    badge: {x: 340, y: 110},
  },
] as const;
export const SHADER_CALLOUT_COUNT = SHADER_CALLOUTS.length;

type CpuGpuSlideProps = {
  titleRef: Reference<Txt>;
  subtitleRef: Reference<Txt>;
  cpuRef: Reference<Layout>;
  cpuChipRef: Reference<Layout>;
  cpuOpRefs: Reference<Txt>[];
  cpuCursorRef: Reference<Rect>;
  cpuNoteRef: Reference<Txt>;
  screenRef: Reference<Layout>;
  imgStageRef: Reference<Layout>;
  imgRef: Reference<Img>;
  /** Máscara que tapa la imagen; se revela con el barrido CPU. */
  cpuCoverRefs: Reference<Rect>[];
  singlePixelRef: Reference<Rect>;
  /** Marcos de tiles GPU activos (pool concurrente). */
  liveTileRefs: Reference<Layout>[];
  liveTileBoxRefs: Reference<Rect>[];
  shaderLineRefs: Reference<Line>[];
  shaderDotRefs: Reference<Circle>[];
  shaderBadgeRefs: Reference<Layout>[];
  screenLabelRef: Reference<Txt>;
  parallelNoteRef: Reference<Txt>;
};

/**
 * CPU entrena lento (ops en serie) → deseo de paralelismo →
 * GPU vía imagen en pantalla + zoom a píxeles en paralelo.
 */
export function CpuGpuSlide({
  titleRef,
  subtitleRef,
  cpuRef,
  cpuChipRef,
  cpuOpRefs,
  cpuCursorRef,
  cpuNoteRef,
  screenRef,
  imgStageRef,
  imgRef,
  cpuCoverRefs,
  singlePixelRef,
  liveTileRefs,
  liveTileBoxRefs,
  shaderLineRefs,
  shaderDotRefs,
  shaderBadgeRefs,
  screenLabelRef,
  parallelNoteRef,
}: CpuGpuSlideProps) {
  return (
    <Layout layout={false} width={'100%'} height={'100%'}>
      <Txt
        ref={titleRef}
        text="Entrenar en una CPU…"
        fontFamily={theme.pixelFont}
        fontSize={56}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-380}
        opacity={0}
      />
      <Txt
        ref={subtitleRef}
        text="una operación matemática… luego otra… luego otra"
        fontFamily={theme.bodyFont}
        fontSize={28}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-310}
        opacity={0}
      />

      {/* CPU: chip + cola de ops en serie */}
      <Layout ref={cpuRef} layout={false} x={0} y={20} opacity={0}>
        <Layout ref={cpuChipRef} layout={false} x={0} y={-40}>
          <Rect width={280} height={200} fill={theme.black} x={5} y={5} />
          <Rect
            width={280}
            height={200}
            fill={theme.white}
            stroke={theme.black}
            lineWidth={theme.border}
          />
          <Txt
            text="CPU"
            fontFamily={theme.pixelFont}
            fontSize={48}
            fill={theme.black}
            y={-50}
          />
          <Txt
            text="1 núcleo fuerte"
            fontFamily={theme.bodyFont}
            fontSize={22}
            fontWeight={600}
            fill={theme.grey}
            y={10}
          />
          <Txt
            text="serie"
            fontFamily={theme.bodyFont}
            fontSize={20}
            fontWeight={700}
            fill={theme.black}
            y={50}
          />
        </Layout>

        <Layout layout={false} y={160}>
          <Rect
            ref={cpuCursorRef}
            width={118}
            height={44}
            fill={theme.cyan}
            stroke={theme.black}
            lineWidth={2}
            x={-((CPU_OPS.length - 1) * 130) / 2}
            opacity={0}
          />
          {CPU_OPS.map((op, i) => (
            <Txt
              key={op}
              ref={cpuOpRefs[i]}
              text={op}
              fontFamily={theme.bodyFont}
              fontSize={22}
              fontWeight={700}
              fill={theme.black}
              x={-((CPU_OPS.length - 1) * 130) / 2 + i * 130}
              opacity={0.25}
            />
          ))}
        </Layout>
      </Layout>

      <Txt
        ref={cpuNoteRef}
        text="billones de cuentas → en serie, tardaría muchísimo"
        fontFamily={theme.bodyFont}
        fontSize={26}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={320}
        opacity={0}
      />

      {/* Monitor pixel-art (sin caja blanca) */}
      <Layout ref={screenRef} layout={false} x={0} y={-10} opacity={0}>
        {/* Sombra dura */}
        <Rect
          width={GPU_SCREEN_W}
          height={GPU_SCREEN_H - 20}
          fill={theme.black}
          x={8}
          y={8}
        />

        {/* Carcasa exterior */}
        <Rect
          width={GPU_SCREEN_W}
          height={GPU_SCREEN_H - 20}
          fill={'#2a2a2a'}
          stroke={theme.black}
          lineWidth={4}
        />
        {/* Bisel interior */}
        <Rect
          width={GPU_SCREEN_INNER_W + BEZEL * 2}
          height={GPU_SCREEN_INNER_H + BEZEL * 2}
          fill={'#1a1a1a'}
          stroke={theme.black}
          lineWidth={3}
          y={-6}
        />
        {/* Marco del panel */}
        <Rect
          width={GPU_SCREEN_INNER_W + 8}
          height={GPU_SCREEN_INNER_H + 8}
          fill={theme.black}
          y={-6}
        />

        {/* Pantalla / imagen */}
        <Layout
          layout={false}
          y={-6}
          width={GPU_SCREEN_INNER_W}
          height={GPU_SCREEN_INNER_H}
          clip
        >
          <Rect
            width={GPU_SCREEN_INNER_W}
            height={GPU_SCREEN_INNER_H}
            fill={theme.black}
          />
          <Layout ref={imgStageRef} layout={false}>
            <Img
              ref={imgRef}
              src={gpuScreenImg}
              width={GPU_SCREEN_INNER_W}
              height={GPU_SCREEN_INNER_H}
              smoothing={false}
            />
          </Layout>

          {/* Máscara por celdas: se abre con el barrido CPU */}
          {Array.from({length: CPU_SCAN_COUNT}, (_, i) => {
            const col = i % CPU_SCAN_COLS;
            const row = Math.floor(i / CPU_SCAN_COLS);
            const {x, y} = cpuScanPos(col, row);
            return (
              <Rect
                key={`cover-${i}`}
                ref={cpuCoverRefs[i]}
                width={CPU_SCAN_CELL + 1}
                height={CPU_SCAN_CELL + 1}
                fill={theme.black}
                x={x}
                y={y}
                opacity={0}
                zIndex={8}
              />
            );
          })}

          {/* Un solo píxel (ejemplo inicial) */}
          <Rect
            ref={singlePixelRef}
            width={SINGLE_PIXEL_SIZE}
            height={SINGLE_PIXEL_SIZE}
            fill={null}
            stroke={theme.yellow}
            lineWidth={4}
            x={0}
            y={0}
            opacity={0}
            zIndex={12}
          />

          {/* Pool de marcos para tiles GPU concurrentes */}
          {Array.from({length: GPU_CONCURRENT_TILES}, (_, t) => (
            <Layout
              key={`tile-${t}`}
              ref={liveTileRefs[t]}
              layout={false}
              x={0}
              y={0}
              opacity={0}
              zIndex={10}
            >
              <Rect
                ref={liveTileBoxRefs[t]}
                width={GPU_TILE_CELL_COLS * CPU_SCAN_CELL + 6}
                height={GPU_TILE_CELL_ROWS * CPU_SCAN_CELL + 6}
                fill={'#00E5FF44'}
                stroke={theme.cyan}
                lineWidth={4}
              />
            </Layout>
          ))}
        </Layout>

        {/* Callouts shader → píxeles (fuera del clip para no cortar) */}
        <Layout layout={false} y={-6} zIndex={20}>
          {SHADER_CALLOUTS.map((c, i) => {
            const elbowX = c.badge.x - 70;
            return (
              <Layout key={c.id} layout={false}>
                <Line
                  ref={shaderLineRefs[i]}
                  points={[
                    [c.badge.x - 90, c.badge.y],
                    [elbowX, c.badge.y],
                    [c.tip.x + 10, c.tip.y],
                    [c.tip.x, c.tip.y],
                  ]}
                  stroke={theme.yellow}
                  lineWidth={3}
                  end={0}
                  opacity={0}
                />
                <Circle
                  ref={shaderDotRefs[i]}
                  width={12}
                  height={12}
                  fill={theme.yellow}
                  stroke={theme.black}
                  lineWidth={2}
                  x={c.tip.x}
                  y={c.tip.y}
                  opacity={0}
                />
                <Layout
                  ref={shaderBadgeRefs[i]}
                  layout={false}
                  x={c.badge.x}
                  y={c.badge.y}
                  opacity={0}
                >
                  <Rect
                    width={c.label.length > 6 ? 200 : 110}
                    height={44}
                    fill={theme.black}
                    stroke={theme.yellow}
                    lineWidth={3}
                  />
                  <Txt
                    text={c.label}
                    fontFamily={theme.pixelFont}
                    fontSize={28}
                    fill={theme.yellow}
                  />
                </Layout>
              </Layout>
            );
          })}
        </Layout>

        {/* Mentón del monitor + LED */}
        <Rect
          width={120}
          height={10}
          fill={'#3a3a3a'}
          stroke={theme.black}
          lineWidth={2}
          y={GPU_SCREEN_H / 2 - 28}
        />
        <Rect
          width={10}
          height={10}
          fill={theme.cyan}
          stroke={theme.black}
          lineWidth={2}
          x={GPU_SCREEN_W / 2 - 36}
          y={GPU_SCREEN_H / 2 - 42}
        />

        {/* Pie / stand pixel */}
        <Rect
          width={56}
          height={28}
          fill={'#2a2a2a'}
          stroke={theme.black}
          lineWidth={3}
          y={GPU_SCREEN_H / 2 - 2}
        />
        <Rect
          width={160}
          height={18}
          fill={'#1a1a1a'}
          stroke={theme.black}
          lineWidth={3}
          y={GPU_SCREEN_H / 2 + 20}
        />
      </Layout>

      <Txt
        ref={screenLabelRef}
        text={`una imagen ~ ${REAL_PIXELS.toLocaleString('es-MX')} píxeles de color`}
        fontFamily={theme.bodyFont}
        fontSize={26}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={330}
        opacity={0}
      />
      <Txt
        ref={parallelNoteRef}
        text="1 píxel → shader: luz + profundidad + color"
        fontFamily={theme.bodyFont}
        fontSize={24}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={370}
        opacity={0}
      />
    </Layout>
  );
}
