import {Layout, Line, Rect, Txt} from '@motion-canvas/2d';
import {theme} from '../theme';

const CHIP = {
  w: 400,
  computeH: 118,
  smVramGap: 34,
  vramH: 46,
  innerPad: 12,
  gridCols: 18,
  gridRows: 10,
  cell: 5,
  cellGap: 2,
} as const;

const CHIP_H = CHIP.computeH + CHIP.smVramGap + CHIP.vramH;
const VRAM_INNER_W = CHIP.w - CHIP.innerPad * 2;
const VRAM_INNER_H = CHIP.vramH - 12;

function chipRegions() {
  const top = -CHIP_H / 2;
  const computeCenterY = top + CHIP.computeH / 2;
  const gapTop = top + CHIP.computeH;
  const gapBottom = gapTop + CHIP.smVramGap;
  const vramCenterY = gapBottom + CHIP.vramH / 2;
  return {top, computeCenterY, gapTop, gapBottom, vramCenterY};
}

function computeGridOrigin() {
  const gridW = CHIP.gridCols * CHIP.cell + (CHIP.gridCols - 1) * CHIP.cellGap;
  const gridH = CHIP.gridRows * CHIP.cell + (CHIP.gridRows - 1) * CHIP.cellGap;
  return {
    startX: -gridW / 2 + CHIP.cell / 2,
    startY: -CHIP_H / 2 + (CHIP.computeH - gridH) / 2 + CHIP.cell / 2,
  };
}

function SmGrid({
  mode,
}: {
  mode: 'shared' | 'split';
}) {
  const {startX, startY} = computeGridOrigin();
  const hues = [theme.cyan, '#4ADE80', '#22C55E', '#16A34A'];
  const cells: {x: number; y: number; i: number; c: number}[] = [];
  let i = 0;
  for (let r = 0; r < CHIP.gridRows; r++) {
    for (let c = 0; c < CHIP.gridCols; c++) {
      cells.push({
        x: startX + c * (CHIP.cell + CHIP.cellGap),
        y: startY + r * (CHIP.cell + CHIP.cellGap),
        i: i++,
        c,
      });
    }
  }
  const midCol = CHIP.gridCols / 2;
  return (
    <Layout layout={false}>
      {cells.map(({x, y, i: idx, c}) => {
        let fill = hues[idx % hues.length];
        if (mode === 'split') {
          fill = c < midCol ? theme.magenta : theme.cyan;
        }
        return (
          <Rect
            key={`sm-${idx}`}
            width={CHIP.cell}
            height={CHIP.cell}
            x={x}
            y={y}
            fill={fill}
            stroke={theme.black}
            lineWidth={0.4}
          />
        );
      })}
    </Layout>
  );
}

function SmToVramLinks() {
  const {gapTop, gapBottom} = chipRegions();
  const yFrom = gapTop + 6;
  const yTo = gapBottom - 8;
  const innerHalf = (CHIP.w - CHIP.innerPad * 2) / 2 - 24;
  const xs = [-0.85, 0, 0.85].map(t => t * innerHalf);
  return (
    <Layout layout={false}>
      {xs.map((x, i) => (
        <Line
          key={`link-${i}`}
          points={[
            [x, yFrom],
            [x, yTo],
          ]}
          stroke={theme.white}
          lineWidth={2}
          lineCap="round"
          endArrow
          arrowSize={9}
        />
      ))}
    </Layout>
  );
}

function VramSplit({
  mode,
}: {
  mode: 'timeslice' | 'mig';
}) {
  const {vramCenterY} = chipRegions();
  const halfW = VRAM_INNER_W / 2;
  const leftX = -VRAM_INNER_W / 2 + halfW / 2;
  const rightX = halfW / 2;
  const trackY = vramCenterY;

  return (
    <Layout layout={false}>
      <Rect
        width={VRAM_INNER_W}
        height={VRAM_INNER_H}
        y={trackY}
        fill="#BAE6FD"
        stroke={theme.black}
        lineWidth={2}
      />
      <Rect
        width={halfW - 2}
        height={VRAM_INNER_H - 4}
        x={leftX}
        y={trackY}
        fill={theme.magenta}
        opacity={0.55}
      />
      <Rect
        width={halfW - 2}
        height={VRAM_INNER_H - 4}
        x={rightX}
        y={trackY}
        fill={theme.cyan}
        opacity={0.55}
      />
      <Line
        points={[
          [0, trackY - VRAM_INNER_H / 2],
          [0, trackY + VRAM_INNER_H / 2],
        ]}
        stroke={theme.black}
        lineWidth={2}
      />
      <Txt
        text="vGPU 1"
        fontFamily={theme.bodyFont}
        fontSize={12}
        fontWeight={700}
        fill={theme.black}
        x={leftX}
        y={trackY - 2}
      />
      <Txt
        text="vGPU 2"
        fontFamily={theme.bodyFont}
        fontSize={12}
        fontWeight={700}
        fill={theme.black}
        x={rightX}
        y={trackY - 2}
      />
      <Txt
        text="VRAM"
        fontFamily={theme.bodyFont}
        fontSize={11}
        fontWeight={700}
        fill={theme.black}
        y={trackY - VRAM_INNER_H / 2 - 10}
      />
      {mode === 'timeslice' ? (
        <Txt
          text="particiones lógicas · un turno"
          fontFamily={theme.bodyFont}
          fontSize={11}
          fontWeight={600}
          fill={theme.grey}
          y={trackY + VRAM_INNER_H / 2 + 14}
        />
      ) : (
        <Txt
          text="VRAM fija por instancia"
          fontFamily={theme.bodyFont}
          fontSize={11}
          fontWeight={600}
          fill={theme.grey}
          y={trackY + VRAM_INNER_H / 2 + 14}
        />
      )}
    </Layout>
  );
}

function PhysicalGpuDiagram({
  x,
  mode,
  title,
  caption,
  captionLine2,
}: {
  x: number;
  mode: 'timeslice' | 'mig';
  title: string;
  caption: string;
  captionLine2?: string;
}) {
  const chip = chipRegions();
  const computeSplit = mode === 'mig';

  return (
    <Layout layout={false} x={x} y={20}>
      <Txt
        text={title}
        fontFamily={theme.pixelFont}
        fontSize={28}
        fill={theme.black}
        y={-CHIP_H / 2 - 58}
      />
      <Rect width={CHIP.w} height={CHIP_H} fill={theme.black} x={4} y={4} />
      <Rect
        width={CHIP.w}
        height={CHIP_H}
        fill="#4A4A4A"
        stroke={theme.black}
        lineWidth={theme.border}
      />
      <Rect
        width={132}
        height={28}
        y={chip.top - 18}
        fill={theme.black}
        radius={4}
      />
      <Txt
        text="GPU física"
        fontFamily={theme.pixelFont}
        fontSize={18}
        fill={theme.white}
        y={chip.top - 18}
      />
      <Rect
        width={CHIP.w - CHIP.innerPad * 2}
        height={CHIP.computeH - 14}
        y={chip.computeCenterY}
        fill="#2D2D2D"
        stroke={theme.black}
        lineWidth={2}
      />
      {computeSplit ? (
        <Line
          points={[
            [0, chip.top + 8],
            [0, chip.gapTop - 4],
          ]}
          stroke={theme.yellow}
          lineWidth={3}
          lineDash={[8, 6]}
        />
      ) : null}
      <SmGrid mode={computeSplit ? 'split' : 'shared'} />
      <SmToVramLinks />
      <VramSplit mode={mode} />
      <Txt
        text={caption}
        fontFamily={theme.bodyFont}
        fontSize={17}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        width={CHIP.w + 40}
        lineHeight={26}
        y={CHIP_H / 2 + (captionLine2 ? 40 : 52)}
      />
      {captionLine2 ? (
        <Txt
          text={captionLine2}
          fontFamily={theme.bodyFont}
          fontSize={17}
          fontWeight={600}
          fill={theme.black}
          textAlign="center"
          width={CHIP.w + 40}
          lineHeight={26}
          y={CHIP_H / 2 + 68}
        />
      ) : null}
      {mode === 'mig' ? (
        <>
          <Txt
            text="vGPU 1"
            fontFamily={theme.bodyFont}
            fontSize={12}
            fontWeight={700}
            fill={theme.magenta}
            x={-CHIP.w / 4}
            y={chip.computeCenterY - 6}
          />
          <Txt
            text="vGPU 2"
            fontFamily={theme.bodyFont}
            fontSize={12}
            fontWeight={700}
            fill={theme.cyan}
            x={CHIP.w / 4}
            y={chip.computeCenterY - 6}
          />
        </>
      ) : null}
    </Layout>
  );
}

/** vGPU time-slice vs MIG: mismo silicio, dos paradigmas. */
export function VgpuMigParadigmsSlide() {
  return (
    <Layout layout={false} width={'100%'} height={'100%'}>
      <Txt
        text="Dos paradigmas para compartir la GPU"
        fontFamily={theme.pixelFont}
        fontSize={50}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-380}
      />
      <Txt
        text="Mismo chip · distinto reparto de SM y VRAM"
        fontFamily={theme.bodyFont}
        fontSize={26}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-315}
      />

      <Line
        points={[
          [0, -240],
          [0, 280],
        ]}
        stroke={theme.black}
        lineWidth={2}
        lineDash={[12, 10]}
        lineCap="round"
      />

      <PhysicalGpuDiagram
        x={-480}
        mode="timeslice"
        title="vGPU · time-slicing"
        caption="Una vGPU usa todos los SM a la vez; la otra espera."
        captionLine2="VRAM repartida por perfil · context switch."
      />
      <PhysicalGpuDiagram
        x={480}
        mode="mig"
        title="MIG"
        caption="SM y VRAM partidos en hardware. vGPU 1 y vGPU 2 pueden ejecutar en paralelo en su trozo."
      />
    </Layout>
  );
}
