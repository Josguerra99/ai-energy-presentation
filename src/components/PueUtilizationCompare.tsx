import {Layout, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {HypotheticalDisclaimer} from './HypotheticalDisclaimer';
import {theme} from '../theme';

/** Mismo cuadro inicial A/B para que la revelación compare el conteo. */
const BOX_W = 320;
const BOX_H = 280;
const GRID_GAP = 5;
const IDLE = '#3A3A3A';

type ServerGridProps = {
  nodeKeyPrefix: string;
  count: number;
  cols: number;
  cell: number;
  accent: string;
  fillRefs: Reference<Rect>[];
};

function ServerGrid({
  nodeKeyPrefix,
  count,
  cols,
  cell,
  accent,
  fillRefs,
}: ServerGridProps) {
  const rows = Math.ceil(count / cols);
  const gridW = cols * cell + (cols - 1) * GRID_GAP;
  const gridH = rows * cell + (rows - 1) * GRID_GAP;
  const pad = 2;

  return (
    <Layout layout={false}>
      {Array.from({length: count}, (_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = -gridW / 2 + col * (cell + GRID_GAP) + cell / 2;
        const cy = -gridH / 2 + row * (cell + GRID_GAP) + cell / 2;
        return (
          <Layout key={`${nodeKeyPrefix}-g-${i}`} layout={false} x={cx} y={cy}>
            <Rect
              width={cell}
              height={cell}
              fill={IDLE}
              stroke={theme.black}
              lineWidth={2}
            />
            <Rect
              ref={fillRefs[i]}
              width={cell - pad * 2}
              height={0}
              fill={accent}
              offsetY={1}
              y={cell / 2 - pad}
            />
          </Layout>
        );
      })}
    </Layout>
  );
}

type SideProps = {
  x: number;
  name: string;
  pue: number;
  pueGood: boolean;
  servers: number;
  cpuPct: number;
  wattsEach: number;
  itKw: number;
  totalKw: number;
  accent: string;
  gridCols: number;
  gridCell: number;
  countRef: Reference<Txt>;
  gridRef: Reference<Layout>;
  statsRef: Reference<Layout>;
  fillRefs: Reference<Rect>[];
  gridKeyPrefix: string;
  /** Borde del cuadro negro (p. ej. ganador). */
  boxRef?: Reference<Rect>;
  /** Badge “GANADOR” opcional. */
  winnerRef?: Reference<Layout>;
  /** Fondo del chip de kW total. */
  totalChipRef?: Reference<Rect>;
};

function DataCenterSide({
  x,
  name,
  pue,
  pueGood,
  servers,
  cpuPct,
  wattsEach,
  itKw,
  totalKw,
  accent,
  gridCols,
  gridCell,
  countRef,
  gridRef,
  statsRef,
  fillRefs,
  gridKeyPrefix,
  boxRef,
  winnerRef,
  totalChipRef,
}: SideProps) {
  return (
    <Layout layout={false} x={x} y={0}>
      <Txt
        text={name}
        fontFamily={theme.pixelFont}
        fontSize={32}
        fill={theme.black}
        y={-240}
      />
      <Txt
        text={`PUE = ${pue.toFixed(1)} ${pueGood ? '✓' : '✗'}`}
        fontFamily={theme.bodyFont}
        fontSize={28}
        fontWeight={700}
        fill={theme.black}
        y={-192}
      />

      <Txt
        ref={countRef}
        text={`${servers} servidores`}
        fontFamily={theme.pixelFont}
        fontSize={28}
        fill={theme.black}
        y={-140}
        opacity={0}
      />

      <Layout layout={false} y={40}>
        <Rect width={BOX_W + 8} height={BOX_H + 8} fill={theme.black} x={5} y={5} />
        <Rect
          ref={boxRef}
          width={BOX_W}
          height={BOX_H}
          fill={theme.black}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Layout ref={gridRef} layout={false} opacity={0}>
          <ServerGrid
            nodeKeyPrefix={gridKeyPrefix}
            count={servers}
            cols={gridCols}
            cell={gridCell}
            accent={accent}
            fillRefs={fillRefs}
          />
        </Layout>
      </Layout>

      {winnerRef && (
        <Layout ref={winnerRef} layout={false} opacity={0} y={-90}>
          <Rect width={160} height={40} fill={theme.black} x={4} y={4} />
          <Rect
            width={160}
            height={40}
            fill={theme.cyan}
            stroke={theme.black}
            lineWidth={theme.border}
          />
          <Txt
            text="GANADOR"
            fontFamily={theme.pixelFont}
            fontSize={22}
            fill={theme.black}
          />
        </Layout>
      )}

      <Layout ref={statsRef} layout={false} opacity={0} y={250}>
        <Txt
          text={`CPU ~${cpuPct}%  ·  ${wattsEach} W/servidor`}
          fontFamily={theme.bodyFont}
          fontSize={22}
          fill={theme.black}
          y={0}
        />
        <Txt
          text={`IT ${itKw} kW  ×  PUE ${pue.toFixed(1)}  =  ${totalKw} kW`}
          fontFamily={theme.bodyFont}
          fontSize={24}
          fontWeight={700}
          fill={theme.black}
          y={40}
        />
        <Rect width={200} height={52} fill={theme.black} x={4} y={94} />
        <Rect
          ref={totalChipRef}
          width={200}
          height={52}
          fill={theme.yellow}
          stroke={theme.black}
          lineWidth={theme.border}
          y={90}
        />
        <Txt
          text={`${totalKw} kW total`}
          fontFamily={theme.pixelFont}
          fontSize={28}
          fill={theme.black}
          y={90}
        />
      </Layout>
    </Layout>
  );
}

/** Misma carga: 30×10% = 4×75% = 300. Celdas del mismo tamaño. */
export const COMPARE_A = {
  servers: 30,
  cpuPct: 10,
  wattsEach: 200,
  itKw: 6,
  totalKw: 7.2,
  pue: 1.2,
  gridCols: 5,
  gridCell: 36,
} as const;

export const COMPARE_B = {
  servers: 4,
  cpuPct: 75,
  wattsEach: 500,
  itKw: 2,
  totalKw: 3,
  pue: 1.5,
  gridCols: 2,
  gridCell: 36,
} as const;

type PueUtilizationCompareProps = {
  countA: Reference<Txt>;
  countB: Reference<Txt>;
  gridA: Reference<Layout>;
  gridB: Reference<Layout>;
  statsA: Reference<Layout>;
  statsB: Reference<Layout>;
  fillA: Reference<Rect>[];
  fillB: Reference<Rect>[];
  winnerBox: Reference<Rect>;
  winnerBadge: Reference<Layout>;
  winnerChip: Reference<Rect>;
};

export function PueUtilizationCompare({
  countA,
  countB,
  gridA,
  gridB,
  statsA,
  statsB,
  fillA,
  fillB,
  winnerBox,
  winnerBadge,
  winnerChip,
}: PueUtilizationCompareProps) {
  return (
    <Layout layout={false} width={1600} height={760}>
      <Txt
        text="Misma carga de trabajo · 300 CPU-units"
        fontFamily={theme.pixelFont}
        fontSize={32}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-350}
      />
      <HypotheticalDisclaimer x={0} y={-310} />

      <DataCenterSide
        x={-380}
        name="DATA CENTER A"
        pue={COMPARE_A.pue}
        pueGood
        servers={COMPARE_A.servers}
        cpuPct={COMPARE_A.cpuPct}
        wattsEach={COMPARE_A.wattsEach}
        itKw={COMPARE_A.itKw}
        totalKw={COMPARE_A.totalKw}
        accent={theme.cyan}
        gridCols={COMPARE_A.gridCols}
        gridCell={COMPARE_A.gridCell}
        countRef={countA}
        gridRef={gridA}
        statsRef={statsA}
        fillRefs={fillA}
        gridKeyPrefix="pue-cmp-a"
      />
      <DataCenterSide
        x={380}
        name="DATA CENTER B"
        pue={COMPARE_B.pue}
        pueGood={false}
        servers={COMPARE_B.servers}
        cpuPct={COMPARE_B.cpuPct}
        wattsEach={COMPARE_B.wattsEach}
        itKw={COMPARE_B.itKw}
        totalKw={COMPARE_B.totalKw}
        accent={theme.magenta}
        gridCols={COMPARE_B.gridCols}
        gridCell={COMPARE_B.gridCell}
        countRef={countB}
        gridRef={gridB}
        statsRef={statsB}
        fillRefs={fillB}
        boxRef={winnerBox}
        winnerRef={winnerBadge}
        totalChipRef={winnerChip}
        gridKeyPrefix="pue-cmp-b"
      />
    </Layout>
  );
}
