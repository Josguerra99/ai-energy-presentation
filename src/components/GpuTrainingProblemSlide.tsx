import {Layout, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {theme} from '../theme';

export const TRAIN_GPU_COLS = 40;
export const TRAIN_GPU_ROWS = 9;
export const TRAIN_GPU_COUNT = TRAIN_GPU_COLS * TRAIN_GPU_ROWS;
export const TRAIN_GPU_CELL = 12;
export const TRAIN_GPU_GAP = 3;
/** Segundos de animación “entrenando” (colores + pulso en loop). */
export const TRAIN_GPU_LOOP_SEC = 5.5;
export const TRAIN_GPU_TICK_SEC = 0.1;
export const TRAIN_GPU_PULSE_HUES = [
  theme.cyan,
  theme.magenta,
  theme.yellow,
  '#4ADE80',
  '#22C55E',
  theme.pie[5],
  '#F472B6',
] as const;

const SERVER_W =
  TRAIN_GPU_COLS * TRAIN_GPU_CELL + (TRAIN_GPU_COLS - 1) * TRAIN_GPU_GAP + 48;
const SERVER_H =
  TRAIN_GPU_ROWS * TRAIN_GPU_CELL + (TRAIN_GPU_ROWS - 1) * TRAIN_GPU_GAP + 72;

/** Celdas “vacías” antes de arrancar el job de entrenamiento. */
export const TRAIN_GPU_EMPTY_FILL = '#2d2d2d';
export const TRAIN_GPU_EMPTY_OPACITY = 0.28;

const TRAIN_HUES = [theme.cyan, '#4ADE80', '#22C55E', theme.pie[5]] as const;
export const TRAIN_GPU_BASE_HUES = TRAIN_HUES;

export function trainGpuCellPosition(index: number): {x: number; y: number} {
  const col = index % TRAIN_GPU_COLS;
  const row = Math.floor(index / TRAIN_GPU_COLS);
  const gridW =
    TRAIN_GPU_COLS * TRAIN_GPU_CELL + (TRAIN_GPU_COLS - 1) * TRAIN_GPU_GAP;
  const gridH =
    TRAIN_GPU_ROWS * TRAIN_GPU_CELL + (TRAIN_GPU_ROWS - 1) * TRAIN_GPU_GAP;
  const startX = -gridW / 2 + TRAIN_GPU_CELL / 2;
  const startY = -gridH / 2 + TRAIN_GPU_CELL / 2 + 8;
  return {
    x: startX + col * (TRAIN_GPU_CELL + TRAIN_GPU_GAP),
    y: startY + row * (TRAIN_GPU_CELL + TRAIN_GPU_GAP),
  };
}

/** Índices encendidos tras el job: bloque desde esquina inferior izquierda. */
export function trainGpuPostActiveIndices(): number[] {
  const indices: number[] = [];
  const rowStart = TRAIN_GPU_ROWS - 3;
  for (let row = rowStart; row < TRAIN_GPU_ROWS; row++) {
    for (let col = 0; col < 5; col++) {
      indices.push(row * TRAIN_GPU_COLS + col);
    }
  }
  return indices;
}

export const TRAIN_GPU_POST_ACTIVE = trainGpuPostActiveIndices();

type GpuTrainingProblemSlideProps = {
  titleRef: Reference<Txt>;
  statusRef: Reference<Txt>;
  countRef: Reference<Txt>;
  serverRef: Reference<Layout>;
  cellRefs: Reference<Rect>[];
};

export function GpuTrainingProblemSlide({
  titleRef,
  statusRef,
  countRef,
  serverRef,
  cellRefs,
}: GpuTrainingProblemSlideProps) {
  return (
    <Layout layout={false} width={'100%'} height={'100%'}>
      <Txt
        ref={titleRef}
        text="El problema del entrenamiento"
        fontFamily={theme.pixelFont}
        fontSize={50}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-380}
      />

      <Layout ref={serverRef} layout={false} y={-10}>
        <Rect width={SERVER_W} height={SERVER_H} fill={theme.black} x={6} y={6} />
        <Rect
          width={SERVER_W}
          height={SERVER_H}
          fill="#1a1a1a"
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          text="Rack / servidor de entrenamiento"
          fontFamily={theme.pixelFont}
          fontSize={22}
          fill={theme.white}
          y={-SERVER_H / 2 + 22}
        />
        <Txt
          ref={countRef}
          text={`${TRAIN_GPU_COUNT} GPUs físicas`}
          fontFamily={theme.bodyFont}
          fontSize={18}
          fontWeight={700}
          fill={theme.grey}
          y={SERVER_H / 2 - 20}
        />
        {Array.from({length: TRAIN_GPU_COUNT}, (_, i) => {
          const {x, y} = trainGpuCellPosition(i);
          return (
            <Rect
              key={`train-gpu-${i}`}
              ref={cellRefs[i]}
              width={TRAIN_GPU_CELL}
              height={TRAIN_GPU_CELL}
              x={x}
              y={y}
              fill={TRAIN_GPU_EMPTY_FILL}
              opacity={TRAIN_GPU_EMPTY_OPACITY}
              stroke={theme.black}
              lineWidth={0.5}
            />
          );
        })}
      </Layout>

      <Txt
        ref={statusRef}
        text="Reservado · GPUs en reposo (aún sin entrenamiento)"
        fontFamily={theme.bodyFont}
        fontSize={24}
        fontWeight={700}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={SERVER_H / 2 + 40}
      />
    </Layout>
  );
}
