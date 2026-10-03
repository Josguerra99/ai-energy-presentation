import {Layout, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {theme} from '../theme';

const PX = 10;

/** Logo Windows clásico 2×2 (pixel). */
function WindowsIcon({x = 0, y = 0, scale = 1}: {x?: number; y?: number; scale?: number}) {
  const s = PX * scale;
  const gap = 2 * scale;
  const colors = ['#F25022', '#7FBA00', '#00A4EF', '#FFB900'] as const;
  const pos = [
    [-s / 2 - gap / 2, -s / 2 - gap / 2],
    [s / 2 + gap / 2, -s / 2 - gap / 2],
    [-s / 2 - gap / 2, s / 2 + gap / 2],
    [s / 2 + gap / 2, s / 2 + gap / 2],
  ];

  return (
    <Layout layout={false} x={x} y={y}>
      {colors.map((fill, i) => (
        <Rect
          key={`w-${i}`}
          width={s}
          height={s}
          fill={fill}
          stroke={theme.black}
          lineWidth={1}
          x={pos[i][0]}
          y={pos[i][1]}
        />
      ))}
    </Layout>
  );
}

/**
 * Tux simplificado en pixel art (negro / blanco / amarillo).
 * Grid 7×8 de celdas.
 */
function LinuxIcon({x = 0, y = 0, scale = 1}: {x?: number; y?: number; scale?: number}) {
  // 0 vacío · 1 negro · 2 blanco · 3 amarillo pico · 4 naranja pies
  const grid: number[][] = [
    [0, 0, 1, 1, 1, 0, 0],
    [0, 1, 2, 1, 2, 1, 0],
    [0, 1, 2, 1, 2, 1, 0],
    [0, 1, 1, 3, 1, 1, 0],
    [0, 1, 2, 2, 2, 1, 0],
    [1, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 1],
    [0, 4, 0, 0, 0, 4, 0],
  ];
  const fills = ['', theme.black, theme.white, '#FFB900', '#E67E22'];
  const cell = 6 * scale;
  const cols = 7;
  const rows = 8;
  const originX = -((cols - 1) * cell) / 2;
  const originY = -((rows - 1) * cell) / 2;

  return (
    <Layout layout={false} x={x} y={y}>
      {grid.flatMap((row, ry) =>
        row.map((v, rx) =>
          v === 0 ? null : (
            <Rect
              key={`l-${rx}-${ry}`}
              width={cell}
              height={cell}
              fill={fills[v]}
              stroke={theme.black}
              lineWidth={1}
              x={originX + rx * cell}
              y={originY + ry * cell}
            />
          ),
        ),
      )}
    </Layout>
  );
}

function OsCard({
  x,
  title,
  appLabel,
  appFill,
  kind,
}: {
  x: number;
  title: string;
  appLabel: string;
  appFill: string;
  kind: 'windows' | 'linux';
}) {
  return (
    <Layout layout={false} x={x} y={0}>
      <Rect width={280} height={320} fill={theme.black} x={5} y={5} />
      <Rect
        width={280}
        height={320}
        fill={theme.yellow}
        stroke={theme.black}
        lineWidth={theme.border}
      />
      {kind === 'windows' ? (
        <WindowsIcon y={-90} scale={3.2} />
      ) : (
        <LinuxIcon y={-90} scale={2.2} />
      )}
      <Txt
        text={title}
        fontFamily={theme.pixelFont}
        fontSize={26}
        fill={theme.black}
        y={20}
      />
      <Rect
        width={160}
        height={44}
        fill={appFill}
        stroke={theme.black}
        lineWidth={2}
        y={80}
      />
      <Txt
        text={appLabel}
        fontFamily={theme.bodyFont}
        fontSize={20}
        fontWeight={700}
        fill={theme.black}
        y={80}
      />
      <Txt
        text={kind === 'windows' ? 'Windows Server' : 'Ubuntu Server'}
        fontFamily={theme.bodyFont}
        fontSize={18}
        fill={theme.grey}
        y={130}
      />
    </Layout>
  );
}

type DifferentOsProps = {
  clashRef: Reference<Layout>;
  punchRef: Reference<Txt>;
};

/**
 * Cuando las apps no pueden compartir máquina por SO distintos.
 */
export function DifferentOsSlide({clashRef, punchRef}: DifferentOsProps) {
  return (
    <Layout layout={false} width={1600} height={760}>
      <Txt
        text="¿Y si no pueden vivir juntas?"
        fontFamily={theme.pixelFont}
        fontSize={36}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-310}
      />
      <Txt
        text="Sistemas operativos distintos → no caben en el mismo servidor “tal cual”."
        fontFamily={theme.bodyFont}
        fontSize={24}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-255}
      />

      <OsCard
        x={-320}
        title="Server A"
        appLabel="App .NET"
        appFill={theme.cyan}
        kind="windows"
      />
      <OsCard
        x={320}
        title="Server B"
        appLabel="App Node"
        appFill={theme.magenta}
        kind="linux"
      />

      <Layout ref={clashRef} layout={false} opacity={0} y={0}>
        <Rect width={72} height={72} fill={theme.black} x={4} y={4} />
        <Rect
          width={72}
          height={72}
          fill={theme.yellow}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          text="≠"
          fontFamily={theme.pixelFont}
          fontSize={48}
          fill={theme.black}
        />
      </Layout>

      <Txt
        ref={punchRef}
        text="Aquí entra la virtualización: varios SO (o aislamientos) en el mismo hardware."
        fontFamily={theme.bodyFont}
        fontSize={24}
        fontWeight={700}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={280}
        opacity={0}
      />
    </Layout>
  );
}
