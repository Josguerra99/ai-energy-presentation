import {Circle, Layout, Line, Rect, Spline, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {theme} from '../theme';

/** Diagrama CPU (layout estático; animación después). */
const CPU = {
  vm: {w: 200, h: 112},
  coreSquare: 28,
  vmGap: 56,
  vmRowY: -220,
  hyp: {w: 168, h: 48},
  /** Hypervisor + RAM + conector desplazados a la derecha del CPU. */
  hostRightOffset: 80,
  cpu: {w: 440, h: 108},
  cpuY: 36,
  ram: {w: 280, h: 108},
  ramGap: 56,
} as const;

const CPU_HOST_GRAY = '#C8C8C8';

/** vCPU: cada cuadrado de un color distinto. */
const VCPU_A_COLORS = [theme.magenta, theme.cyan, '#7B1FA2', '#FF6B35'] as const;
const VCPU_B_COLORS = [theme.pie[0], theme.pie[5]] as const;

/** pCPU i = color del cable que llega (plugs 0→0, 1→1, …). */
const PCPU_COLORS = [
  VCPU_A_COLORS[0],
  VCPU_A_COLORS[1],
  VCPU_A_COLORS[2],
  VCPU_B_COLORS[1],
] as const;

const VM_A_CORE_SPAN = 132;
const VM_B_CORE_SPAN = 72;
const PCPU_SPAN = 300;

/** Enchufes activos al inicio + reserva para VM A vCPU3 → pCPU libre. */
const CPU_PLUGS = [
  {vm: 'a' as const, vcpu: 0, pcpu: 0, color: VCPU_A_COLORS[0]},
  {vm: 'a' as const, vcpu: 1, pcpu: 1, color: VCPU_A_COLORS[1]},
  {vm: 'a' as const, vcpu: 2, pcpu: 2, color: VCPU_A_COLORS[2]},
  {vm: 'b' as const, vcpu: 1, pcpu: 3, color: VCPU_B_COLORS[1]},
  {vm: 'a' as const, vcpu: 3, pcpu: 2, color: VCPU_A_COLORS[3]},
  {vm: 'b' as const, vcpu: 0, pcpu: 3, color: VCPU_B_COLORS[0]},
] as const;

export const CPU_PLUG_COUNT = CPU_PLUGS.length;
export const CPU_INITIAL_PLUG_COUNT = 4;
/** Morado (VM A vCPU3) y celeste VM B vCPU2 → guardar a RAM. */
export const CPU_PREEMPT_PLUG_INDICES = [2, 3] as const;
/** VM A vCPU4 naranja → pCPU2 (donde morado). */
export const CPU_SWAP_PLUG_ORANGE = 4;
/** VM B vCPU1 teal → pCPU3 (donde celeste de VM B). */
export const CPU_SWAP_PLUG_GREEN = 5;
export const CPU_CONTEXT_PACKET_COUNT = 2;
/** pCPU de donde salen los paquetes de contexto (morado y celeste VM B). */
export const CPU_CONTEXT_PACKET_PCPUS = [2, 3] as const;
/** Relleno sólido (mismo tono que el pCPU que guarda contexto). */
const CPU_CONTEXT_PACKET_FILLS = [PCPU_COLORS[2], PCPU_COLORS[3]] as const;

/** Posiciones en coords. locales del layout `cpuDie` (igual que CoreSquares y=4). */
export function cpuContextPacketPositions(
  pcpuIndex: number,
  lane: 0 | 1 = 0,
): {
  from: [number, number];
  to: [number, number];
} {
  const x = coreSquareOffsets(4, PCPU_SPAN)[pcpuIndex];
  const laneDy = lane === 0 ? -3 : 3;
  return {
    from: [x, 4 + laneDy],
    to: [ramCenterX(), 2 + laneDy],
  };
}

export function cpuPlugRoute(
  vm: 'a' | 'b',
  vcpu: number,
  pcpu: number,
): [number, number][] {
  return plugRoutePoints(vcpuAnchor(vm, vcpu), pcpuAnchor(pcpu));
}

export function cpuPlugBusJoint(plugIndex: number): {
  position: [number, number];
  color: string;
} | null {
  const link = CPU_PLUGS[plugIndex];
  if (!link) return null;
  const hit = plugBusCrossing(
    vcpuAnchor(link.vm, link.vcpu),
    pcpuAnchor(link.pcpu),
  );
  if (!hit) return null;
  return {position: hit, color: link.color};
}
/** Longitud de un ciclo de `lineDashOffset` (flujo vCPU → pCPU). */
export const CPU_PLUG_FLOW_DASH_CYCLE = 40;
/** Duración de un pulso en la escena (segundos). */
export const CPU_PLUG_FLOW_STEP_SEC = 1.05;
/** Segundos totales de flujo en virt-gpu-cpu-titulo. */
export const CPU_PLUG_FLOW_DURATION_SEC = 3;
/** Flujo tras reconectar VM A vCPU4 / VM B vCPU1. */
export const CPU_PLUG_FLOW_RECONNECT_SEC = 2.5;
const CPU_PLUG_FLOW_DASH = [16, 24] as const;
export const CPU_PLUG_FLOW_LINE_WIDTH = 12;
export const CPU_PLUG_FLOW_LAYER_OPACITY = 0.6;

/** Patrón de trazo animado (reaplicar tras `points()` en los splines de flujo). */
export function cpuPlugFlowLineDash(): number[] {
  return [...CPU_PLUG_FLOW_DASH];
}

/** Índices de enchufes activos tras el swap (magenta, cyan, naranja, teal). */
export const CPU_POST_SWAP_FLOW_PLUGS = [
  0,
  1,
  CPU_SWAP_PLUG_ORANGE,
  CPU_SWAP_PLUG_GREEN,
] as const;

/** Segundo cambio de contexto: quitar teal y restaurar celeste VM B en pCPU3. */
export const CPU_TEAL_PLUG_INDEX = CPU_SWAP_PLUG_GREEN;
export const CPU_VM_B_CYAN_PLUG_INDEX = 3;
export const CPU_TEAL_SAVE_PCPU = 3;
export const CPU_TEAL_VCPU_COLOR = VCPU_B_COLORS[0];
export const CPU_VM_B_LIGHT_CYAN = VCPU_B_COLORS[1];

/** Tras restaurar celeste VM B (sin enchufe teal). */
export const CPU_POST_RESTORE_FLOW_PLUGS = [
  0,
  1,
  CPU_SWAP_PLUG_ORANGE,
  CPU_VM_B_CYAN_PLUG_INDEX,
] as const;

export function cpuContextPacketPositionsFromRam(
  pcpuIndex: number,
  lane: 0 | 1 = 0,
): {
  from: [number, number];
  to: [number, number];
} {
  const leg = cpuContextPacketPositions(pcpuIndex, lane);
  return {from: leg.to, to: leg.from};
}

function coreSquareOffsets(count: number, span: number): number[] {
  if (count <= 1) return [0];
  const step = span / (count - 1);
  const start = -span / 2;
  return Array.from({length: count}, (_, i) => start + step * i);
}

function CoreSquares({
  count,
  colors,
  span,
  y,
  empty,
  fillRefs,
}: {
  count: number;
  colors?: readonly string[];
  span: number;
  y: number;
  /** pCPU: huecos sin relleno (solo borde). */
  empty?: boolean;
  fillRefs?: Reference<Rect>[];
}) {
  const xs = coreSquareOffsets(count, span);
  return (
    <Layout layout={false}>
      {xs.map((x, i) => (
        <Rect
          key={`core-sq-${i}`}
          ref={fillRefs?.[i]}
          width={CPU.coreSquare}
          height={CPU.coreSquare}
          x={x}
          y={y}
          fill={empty ? theme.white : (colors?.[i] ?? theme.grey)}
          stroke={theme.black}
          lineWidth={2}
        />
      ))}
    </Layout>
  );
}

function VmBox({
  label,
  coreCount,
  coreColors,
}: {
  label: string;
  coreCount: number;
  coreColors: readonly string[];
}) {
  const titleY = -CPU.vm.h / 2 + 26;
  const coresY = CPU.vm.h / 2 - CPU.coreSquare / 2 - 14;
  const span = coreCount === 2 ? VM_B_CORE_SPAN : VM_A_CORE_SPAN;
  return (
    <Layout layout={false} width={CPU.vm.w} height={CPU.vm.h}>
      <Box width={CPU.vm.w} height={CPU.vm.h} fill={theme.white} />
      <Txt
        text={label}
        fontFamily={theme.pixelFont}
        fontSize={26}
        fill={theme.black}
        y={titleY}
      />
      <CoreSquares
        count={coreCount}
        colors={coreColors}
        span={span}
        y={coresY}
      />
    </Layout>
  );
}

function vmCenterX(side: 'a' | 'b') {
  const half = CPU.vm.w / 2 + CPU.vmGap / 2;
  return side === 'a' ? -half : half;
}

function vmCoresCenterY() {
  return CPU.vm.h / 2 - CPU.coreSquare / 2 - 14;
}

function vcpuAnchor(vm: 'a' | 'b', vIndex: number): [number, number] {
  const count = vm === 'a' ? 4 : 2;
  const span = vm === 'a' ? VM_A_CORE_SPAN : VM_B_CORE_SPAN;
  const x = vmCenterX(vm) + coreSquareOffsets(count, span)[vIndex];
  const y = CPU.vmRowY + vmCoresCenterY() + CPU.coreSquare / 2;
  return [x, y];
}

function pcpuAnchor(pIndex: number): [number, number] {
  const x = coreSquareOffsets(4, PCPU_SPAN)[pIndex];
  const y = CPU.cpuY + 4 - CPU.coreSquare / 2;
  return [x, y];
}

/** Curva suave vCPU → pCPU; pasa por la barra del hypervisor. */
function plugRoutePoints(from: [number, number], to: [number, number]) {
  const [vx, vy] = from;
  const [cx, cy] = to;
  const busY = hypBusY();
  const busX = (vx + cx) / 2;
  return [
    [vx, vy],
    [vx, vy + (busY - vy) * 0.55],
    [busX, busY],
    [cx, busY + (cy - busY) * 0.45],
    [cx, cy],
  ] as [number, number][];
}

function hypCenterY() {
  return (CPU.vmRowY + CPU.cpuY) / 2;
}

/** Misma Y que el centro del hypervisor (el recuadro tapa el tramo bajo él). */
function hypBusY() {
  return hypCenterY();
}

function hypCenterX() {
  return 368 + CPU.hostRightOffset;
}

function hypBusSpan() {
  const busY = hypBusY();
  const left = vmCenterX('a') - CPU.vm.w / 2 - 56;
  /** Termina en el borde izquierdo del hypervisor (sale hacia la izquierda). */
  const right = hypCenterX() - CPU.hyp.w / 2;
  return {busY, left, right};
}

/** Cruce cable ↔ barra horizontal (aprox. polilínea de control del spline). */
function plugBusCrossing(
  from: [number, number],
  to: [number, number],
): [number, number] | null {
  const busY = hypBusY();
  const pts = plugRoutePoints(from, to);
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    if (Math.abs(y0 - busY) < 0.01) return [x0, busY];
    if ((y0 - busY) * (y1 - busY) < 0) {
      const t = (busY - y0) / (y1 - y0);
      return [x0 + t * (x1 - x0), busY];
    }
  }
  return null;
}

function ramCenterX() {
  return (
    CPU.cpu.w / 2 + CPU.ramGap + CPU.ram.w / 2 + CPU.hostRightOffset
  );
}

function Box({
  width,
  height,
  fill,
  stroke = theme.black,
  lineWidth = theme.border,
}: {
  width: number;
  height: number;
  fill: string;
  stroke?: string;
  lineWidth?: number;
}) {
  const s = theme.shadow;
  return (
    <Layout layout={false}>
      <Rect width={width} height={height} fill={theme.black} x={s} y={s} />
      <Rect
        width={width}
        height={height}
        fill={fill}
        stroke={stroke}
        lineWidth={lineWidth}
      />
    </Layout>
  );
}

/** Fase GPU: chip + VRAM (GB) + RAM host (como CPU). */
const GPU = {
  /** Alineado con la fila CPU (`cpuPhase` y=24 + `CPU.cpuY`). */
  chipY: 36,
  chipW: 440,
  computeH: 152,
  /** Canal SM → VRAM (flechas en el gris, sin tapar HBM). */
  smVramGap: 44,
  vramH: 52,
  /** Espacio para etiqueta PCIe en el conector. */
  ramGap: 168,
  ramW: 280,
  ramH: 108,
  gridCols: 22,
  gridRows: 12,
  cell: 6,
  cellGap: 2,
  vmRowY: 268,
  vmX: 220,
  vmW: 160,
  vmH: 92,
  /** VRAM típica H100 SXM / PCIe. */
  vramGbLabel: '80 GB',
  hostRamGbLabel: '512 GB',
  vramInnerW: 440 - 24,
  vramInnerH: 52 - 14,
  /** Margen del texto respecto al borde interior de VRAM. */
  vramTextPadX: 12,
  vramTextPadY: 10,
} as const;

export const GPU_VRAM_CAPACITY_GB = 80;
export const GPU_VRAM_USED_GB = 60;
export const GPU_VRAM_PARTIAL_EVAC_GB = 20;
export const GPU_VRAM_VM2_TASK_GB = 40;
export const GPU_PACKET_VRAM_20_LABEL = '20 GB';
export const GPU_PACKET_VRAM_40_LABEL = '40 GB';

export function gpuVramFillMetrics(usedGb: number): {
  width: number;
  x: number;
  y: number;
  leftX: number;
} {
  const trackW = GPU.vramInnerW;
  const ratio = Math.min(Math.max(usedGb / GPU_VRAM_CAPACITY_GB, 0), 1);
  const width = ratio * trackW;
  const chip = gpuChipRegions();
  const leftX = -GPU.vramInnerW / 2;
  return {
    width,
    x: leftX + width / 2,
    y: chip.vramCenterY,
    leftX,
  };
}

const GPU_CHIP_H = GPU.computeH + GPU.smVramGap + GPU.vramH;

function gpuChipRegions() {
  const top = -GPU_CHIP_H / 2;
  const computeCenterY = top + GPU.computeH / 2;
  const gapTop = top + GPU.computeH;
  const gapBottom = gapTop + GPU.smVramGap;
  const vramCenterY = gapBottom + GPU.vramH / 2;
  return {
    top,
    computeCenterY,
    gapTop,
    gapBottom,
    vramCenterY,
  };
}

function gpuRamCenterX() {
  return GPU.chipW / 2 + GPU.ramGap + GPU.ramW / 2;
}

function gpuPcieLink() {
  const y = GPU.chipY;
  const left = GPU.chipW / 2 + 12;
  const right = gpuRamCenterX() - GPU.ramW / 2 - 12;
  return {y, left, right, midX: (left + right) / 2};
}

export const GPU_TRANSFER_PACKET_COUNT = 2;
/** Paquete 0: contexto SM · paquete 1: bloques grandes (legacy anim.). */
export const GPU_PACKET_MB_LABEL = 'estado SM';
export const GPU_PACKET_FREEZE_LABEL = 'congelar';
export const GPU_PACKET_GB_LABEL = GPU_PACKET_VRAM_40_LABEL;
export const GPU_PACKET_MOVE_MB_SEC = 2.1;
export const GPU_PACKET_MOVE_GB_SEC = 3.6;

export const GPU_VM_PLUG_COUNT = 2;
export const GPU_VM1_PLUG_COLOR = theme.magenta;
export const GPU_VM2_PLUG_COLOR = theme.cyan;
export const GPU_VM_PLUG_FLOW_SEC = 2.5;

export function gpuVm1PlugAnchor(): [number, number] {
  return [-GPU.vmX, GPU.vmRowY - GPU.vmH / 2 + 14];
}

export function gpuVm2PlugAnchor(): [number, number] {
  return [GPU.vmX, GPU.vmRowY - GPU.vmH / 2 + 14];
}

export function gpuChipPlugAnchor(): [number, number] {
  return [0, GPU.chipY + GPU_CHIP_H / 2 - 6];
}

function gpuVmPlugRoutePoints(
  from: [number, number],
  to: [number, number],
): [number, number][] {
  const [vx, vy] = from;
  const [cx, cy] = to;
  const busY = (vy + cy) / 2;
  const busX = (vx + cx) / 2;
  return [
    [vx, vy],
    [vx, vy + (busY - vy) * 0.55],
    [busX, busY],
    [cx, busY + (cy - busY) * 0.45],
    [cx, cy],
  ];
}

export function gpuVm1PlugRoute(): [number, number][] {
  return gpuVmPlugRoutePoints(gpuVm1PlugAnchor(), gpuChipPlugAnchor());
}

export function gpuVm2PlugRoute(): [number, number][] {
  return gpuVmPlugRoutePoints(gpuVm2PlugAnchor(), gpuChipPlugAnchor());
}

/** @deprecated use gpuVm1PlugRoute */
export function gpuVmPlugRoute(): [number, number][] {
  return gpuVm1PlugRoute();
}

function gpuVm1BusY() {
  const [, vy] = gpuVm1PlugAnchor();
  const [, cy] = gpuChipPlugAnchor();
  return (vy + cy) / 2;
}

function gpuVm2BusY() {
  const [, vy] = gpuVm2PlugAnchor();
  const [, cy] = gpuChipPlugAnchor();
  return (vy + cy) / 2;
}

function gpuVmBusSpan() {
  const busY = gpuVm1BusY();
  return {
    busY,
    left: -GPU.vmX - GPU.vmW / 2 - 36,
    right: GPU.vmX + GPU.vmW / 2 + 36,
  };
}

function gpuPlugBusJointForRoute(
  pts: [number, number][],
  busY: number,
  color: string,
): {position: [number, number]; color: string} | null {
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    if (Math.abs(y0 - busY) < 0.01) {
      return {position: [x0, busY], color};
    }
    if ((y0 - busY) * (y1 - busY) < 0) {
      const t = (busY - y0) / (y1 - y0);
      return {position: [x0 + t * (x1 - x0), busY], color};
    }
  }
  return null;
}

export function gpuVm1PlugBusJoint(): {
  position: [number, number];
  color: string;
} | null {
  return gpuPlugBusJointForRoute(
    gpuVm1PlugRoute(),
    gpuVm1BusY(),
    GPU_VM1_PLUG_COLOR,
  );
}

export function gpuVm2PlugBusJoint(): {
  position: [number, number];
  color: string;
} | null {
  return gpuPlugBusJointForRoute(
    gpuVm2PlugRoute(),
    gpuVm2BusY(),
    GPU_VM2_PLUG_COLOR,
  );
}

export function gpuVmPlugBusJoint(): {
  position: [number, number];
  color: string;
} | null {
  return gpuVm1PlugBusJoint();
}

function gpuSmContextOrigin(): [number, number] {
  const chip = gpuChipRegions();
  return [0, GPU.chipY + chip.computeCenterY];
}

export function gpuTransferPacketRoute(
  kind:
    | 'sm-context-host'
    | 'sm-context-vram'
    | 'sm-context'
    | 'sm-mb'
    | 'vram-gb',
): {from: [number, number]; to: [number, number]} {
  const pcie = gpuPcieLink();
  const chip = gpuChipRegions();
  const toHostRam: [number, number] = [
    gpuRamCenterX() - GPU.ramW / 2 + 52,
    GPU.chipY,
  ];
  const fromVram: [number, number] = [
    pcie.left,
    GPU.chipY + chip.vramCenterY,
  ];
  const fromSmPcie: [number, number] = [
    pcie.left,
    GPU.chipY + chip.gapTop - 6,
  ];
  if (kind === 'sm-context-host' || kind === 'sm-mb') {
    return {from: fromSmPcie, to: toHostRam};
  }
  if (kind === 'sm-context-vram' || kind === 'sm-context') {
    return {
      from: gpuSmContextOrigin(),
      to: [-GPU.vramInnerW / 2 + 44, GPU.chipY + chip.vramCenterY],
    };
  }
  return {from: fromVram, to: toHostRam};
}

export function gpuTransferPacketRouteRamToVram(): {
  from: [number, number];
  to: [number, number];
} {
  const pcie = gpuPcieLink();
  const chip = gpuChipRegions();
  return {
    from: [gpuRamCenterX() - GPU.ramW / 2 + 52, GPU.chipY],
    to: [pcie.left, GPU.chipY + chip.vramCenterY],
  };
}

function gpuComputeGridOrigin(): {startX: number; startY: number} {
  const gridW = GPU.gridCols * GPU.cell + (GPU.gridCols - 1) * GPU.cellGap;
  const gridH = GPU.gridRows * GPU.cell + (GPU.gridRows - 1) * GPU.cellGap;
  return {
    startX: -gridW / 2 + GPU.cell / 2,
    startY: -GPU_CHIP_H / 2 + (GPU.computeH - gridH) / 2 + GPU.cell / 2,
  };
}

/** Flechas SM → VRAM (ancho de banda on-chip). */
function GpuSmToVramLinks() {
  const {gapTop, gapBottom} = gpuChipRegions();
  const yFrom = gapTop + 8;
  const yTo = gapBottom - 10;
  const innerHalf = (GPU.chipW - 24) / 2 - 32;
  const xs = [-0.85, -0.42, 0, 0.42, 0.85].map(t => t * innerHalf);

  return (
    <Layout layout={false}>
      {xs.map((x, i) => (
        <Line
          key={`sm-vram-link-${i}`}
          points={[
            [x, yFrom],
            [x, yTo],
          ]}
          stroke={theme.white}
          lineWidth={2.5}
          lineCap="round"
          endArrow
          arrowSize={11}
        />
      ))}
    </Layout>
  );
}

function GpuComputeGrid() {
  const {startX, startY} = gpuComputeGridOrigin();
  const cells: {x: number; y: number; i: number}[] = [];
  let i = 0;
  for (let r = 0; r < GPU.gridRows; r++) {
    for (let c = 0; c < GPU.gridCols; c++) {
      cells.push({
        x: startX + c * (GPU.cell + GPU.cellGap),
        y: startY + r * (GPU.cell + GPU.cellGap),
        i: i++,
      });
    }
  }
  const hues = [theme.cyan, '#4ADE80', '#22C55E', '#16A34A'];
  return (
    <Layout layout={false}>
      {cells.map(({x, y, i: idx}) => (
        <Rect
          key={`gpu-sm-${idx}`}
          width={GPU.cell}
          height={GPU.cell}
          x={x}
          y={y}
          fill={hues[idx % hues.length]}
          stroke={theme.black}
          lineWidth={0.5}
        />
      ))}
    </Layout>
  );
}

export type VgpuContextSwitchSlideProps = {
  titleRef: Reference<Txt>;
  subtitleRef: Reference<Txt>;
  cpuPhaseRef: Reference<Layout>;
  cpuVmARef: Reference<Layout>;
  cpuVmBRef: Reference<Layout>;
  cpuHypervisorRef: Reference<Layout>;
  cpuDieRef: Reference<Layout>;
  cpuRamRef: Reference<Layout>;
  cpuPlugBaseRefs: Reference<Spline>[];
  cpuPlugFlowRefs: Reference<Spline>[];
  cpuPcpuFillRefs: Reference<Rect>[];
  cpuBusJointRefs: Reference<Circle>[];
  cpuContextPacketRefs: Reference<Rect>[];
  gpuPhaseRef: Reference<Layout>;
  gpuCoreRef: Reference<Layout>;
  gpuRamRef: Reference<Layout>;
  gpuVramFillRef: Reference<Rect>;
  gpuVramUsageRef: Reference<Txt>;
  gpuTransferPacketRefs: Reference<Layout>[];
  gpuTransferPacketLabelRefs: Reference<Txt>[];
  gpuVm1Ref: Reference<Layout>;
  gpuVm2Ref: Reference<Layout>;
  gpuVm1BodyRef: Reference<Rect>;
  gpuVm1PortRef: Reference<Rect>;
  gpuVm1ActiveLabelRef: Reference<Txt>;
  gpuVm1LabelRef: Reference<Txt>;
  gpuVm2BodyRef: Reference<Rect>;
  gpuVm2PortRef: Reference<Rect>;
  gpuVm2ActiveLabelRef: Reference<Txt>;
  gpuVm2LabelRef: Reference<Txt>;
  gpuVm2TaskRef: Reference<Layout>;
  gpuPlugBaseRef: Reference<Spline>;
  gpuPlugFlowRef: Reference<Spline>;
  gpuBusJointRef: Reference<Circle>;
  gpuPlug2BaseRef: Reference<Spline>;
  gpuPlug2FlowRef: Reference<Spline>;
  gpuBusJoint2Ref: Reference<Circle>;
};

/**
 * Cambio de contexto: CPU (layout) → GPU / vGPU.
 */
export function VgpuContextSwitchSlide({
  titleRef,
  subtitleRef,
  cpuPhaseRef,
  cpuVmARef,
  cpuVmBRef,
  cpuHypervisorRef,
  cpuDieRef,
  cpuRamRef,
  cpuPlugBaseRefs,
  cpuPlugFlowRefs,
  cpuPcpuFillRefs,
  cpuBusJointRefs,
  cpuContextPacketRefs,
  gpuPhaseRef,
  gpuCoreRef,
  gpuRamRef,
  gpuVramFillRef,
  gpuVramUsageRef,
  gpuTransferPacketRefs,
  gpuTransferPacketLabelRefs,
  gpuVm1Ref,
  gpuVm2Ref,
  gpuVm1BodyRef,
  gpuVm1PortRef,
  gpuVm1ActiveLabelRef,
  gpuVm1LabelRef,
  gpuVm2BodyRef,
  gpuVm2PortRef,
  gpuVm2ActiveLabelRef,
  gpuVm2LabelRef,
  gpuVm2TaskRef,
  gpuPlugBaseRef,
  gpuPlugFlowRef,
  gpuBusJointRef,
  gpuPlug2BaseRef,
  gpuPlug2FlowRef,
  gpuBusJoint2Ref,
}: VgpuContextSwitchSlideProps) {
  const gpuPcie = gpuPcieLink();
  const gpuChip = gpuChipRegions();
  const gpuVm1PlugPts = gpuVm1PlugRoute();
  const gpuVm2PlugPts = gpuVm2PlugRoute();
  const gpuVmBus = gpuVmBusSpan();
  const gpuVm1Joint = gpuVm1PlugBusJoint();
  const gpuVm2Joint = gpuVm2PlugBusJoint();
  const gpuVramInitial = gpuVramFillMetrics(GPU_VRAM_USED_GB);

  return (
    <Layout layout={false} width={'100%'} height={'100%'}>
      <Txt
        ref={titleRef}
        text="Compartir un chip: cambio de contexto"
        fontFamily={theme.pixelFont}
        fontSize={52}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-380}
      />
      <Txt
        ref={subtitleRef}
        text="El hypervisor enchufa vCPU → núcleos físicos"
        fontFamily={theme.bodyFont}
        fontSize={26}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-315}
      />

      {/* —— Fase CPU: todo centrado en x=0 —— */}
      <Layout ref={cpuPhaseRef} layout={false} y={24}>
        <Layout
          ref={cpuVmARef}
          layout={false}
          x={vmCenterX('a')}
          y={CPU.vmRowY}
        >
          <VmBox
            label="VM A"
            coreCount={4}
            coreColors={VCPU_A_COLORS}
          />
        </Layout>
        <Layout
          ref={cpuVmBRef}
          layout={false}
          x={vmCenterX('b')}
          y={CPU.vmRowY}
        >
          <VmBox
            label="VM B"
            coreCount={2}
            coreColors={VCPU_B_COLORS}
          />
        </Layout>

        <Line
          points={[
            [hypBusSpan().left, hypBusSpan().busY],
            [hypBusSpan().right, hypBusSpan().busY],
          ]}
          stroke={theme.black}
          lineWidth={2}
          lineDash={[10, 8]}
          lineCap="round"
        />

        <Layout
          ref={cpuHypervisorRef}
          layout={false}
          x={hypCenterX()}
          y={hypCenterY()}
        >
          <Box width={CPU.hyp.w} height={CPU.hyp.h} fill={theme.cyan} />
          <Txt
            text="Hypervisor"
            fontFamily={theme.bodyFont}
            fontSize={18}
            fontWeight={700}
            fill={theme.black}
          />
        </Layout>

        <Layout ref={cpuDieRef} layout={false} x={0} y={CPU.cpuY}>
          <Box width={CPU.cpu.w} height={CPU.cpu.h} fill={CPU_HOST_GRAY} />
          <CoreSquares
            count={4}
            colors={PCPU_COLORS}
            span={PCPU_SPAN}
            y={4}
            fillRefs={cpuPcpuFillRefs}
          />
          <Txt
            text="CPU · 4 núcleos físicos"
            fontFamily={theme.pixelFont}
            fontSize={20}
            fill={theme.black}
            y={CPU.cpu.h / 2 + 26}
          />
          {[0, 1].map(i => {
            const pcpu = CPU_CONTEXT_PACKET_PCPUS[i];
            const [px, py] = cpuContextPacketPositions(pcpu, i as 0 | 1).from;
            return (
              <Rect
                key={`ctx-pkt-${i}`}
                ref={cpuContextPacketRefs[i]}
                x={px}
                y={py}
                width={CPU.coreSquare}
                height={CPU.coreSquare}
                fill={CPU_CONTEXT_PACKET_FILLS[i]}
                stroke={theme.black}
                lineWidth={2}
                zIndex={40}
                opacity={0}
              />
            );
          })}
        </Layout>

        {CPU_PLUGS.map((link, i) => {
          const pts = plugRoutePoints(
            vcpuAnchor(link.vm, link.vcpu),
            pcpuAnchor(link.pcpu),
          );
          const connected = i < CPU_INITIAL_PLUG_COUNT;
          return (
            <Layout layout={false} key={`cpu-plug-${i}`}>
              <Spline
                ref={cpuPlugBaseRefs[i]}
                points={pts}
                smoothness={0.38}
                stroke={link.color}
                lineWidth={4}
                lineCap="round"
                end={connected ? 1 : 0}
              />
              <Spline
                ref={cpuPlugFlowRefs[i]}
                points={pts}
                smoothness={0.38}
                stroke={link.color}
                lineWidth={12}
                lineCap="round"
                lineDash={[...CPU_PLUG_FLOW_DASH]}
                lineDashOffset={0}
                opacity={connected ? 0.6 : 0}
                end={connected ? 1 : 0}
              />
            </Layout>
          );
        })}

        {CPU_PLUGS.map((link, i) => {
          const joint = cpuPlugBusJoint(i);
          if (!joint) return null;
          const visible = i < CPU_INITIAL_PLUG_COUNT;
          return (
            <Circle
              key={`bus-joint-${i}`}
              ref={cpuBusJointRefs[i]}
              x={joint.position[0]}
              y={joint.position[1]}
              width={14}
              height={14}
              fill={link.color}
              stroke={theme.black}
              lineWidth={2}
              opacity={visible ? 1 : 0}
            />
          );
        })}

        <Line
          points={[
            [CPU.cpu.w / 2 + 12, CPU.cpuY],
            [ramCenterX() - CPU.ram.w / 2 - 12, CPU.cpuY],
          ]}
          stroke={theme.black}
          lineWidth={2}
          lineDash={[10, 8]}
          lineCap="round"
        />

        <Layout ref={cpuRamRef} layout={false} x={ramCenterX()} y={CPU.cpuY}>
          <Box width={CPU.ram.w} height={CPU.ram.h} fill={CPU_HOST_GRAY} />
          <Rect
            width={CPU.ram.w - 32}
            height={58}
            fill={theme.white}
            stroke={theme.black}
            lineWidth={2}
            y={2}
          />
          <Txt
            text="~KB al cambiar"
            fontFamily={theme.bodyFont}
            fontSize={16}
            fontWeight={700}
            fill={theme.black}
            y={-10}
          />
          <Txt
            text="~KB"
            fontFamily={theme.bodyFont}
            fontSize={14}
            fontWeight={600}
            fill={theme.grey}
            y={14}
          />
          <Txt
            text="RAM del host"
            fontFamily={theme.pixelFont}
            fontSize={20}
            fill={theme.black}
            y={CPU.ram.h / 2 + 26}
          />
        </Layout>

      </Layout>

      {/* —— Fase GPU —— */}
      <Layout ref={gpuPhaseRef} layout={false} y={24} opacity={0}>
        <Layout ref={gpuCoreRef} layout={false} y={GPU.chipY}>
          <Box width={GPU.chipW} height={GPU_CHIP_H} fill="#4A4A4A" />
          <Rect
            width={GPU.chipW - 24}
            height={GPU.computeH - 16}
            y={gpuChip.computeCenterY}
            fill="#2D2D2D"
            stroke={theme.black}
            lineWidth={2}
          />
          <GpuComputeGrid />
          <GpuSmToVramLinks />
          <Rect
            width={GPU.vramInnerW}
            height={GPU.vramInnerH}
            y={gpuChip.vramCenterY}
            fill="#BAE6FD"
            stroke={theme.black}
            lineWidth={2}
          />
          <Rect
            ref={gpuVramFillRef}
            width={gpuVramInitial.width}
            height={GPU.vramInnerH}
            x={gpuVramInitial.x}
            y={gpuChip.vramCenterY}
            fill={theme.cyan}
          />
          <Txt
            text="VRAM (GB · HBM)"
            fontFamily={theme.bodyFont}
            fontSize={15}
            fontWeight={700}
            fill={theme.black}
            textAlign="center"
            width={GPU.vramInnerW - GPU.vramTextPadX * 2}
            y={gpuChip.vramCenterY - GPU.vramInnerH / 2 + GPU.vramTextPadY}
          />
          <Txt
            ref={gpuVramUsageRef}
            text={`${GPU_VRAM_USED_GB} / ${GPU_VRAM_CAPACITY_GB} GB en uso`}
            fontFamily={theme.bodyFont}
            fontSize={13}
            fontWeight={700}
            fill={theme.black}
            textAlign="center"
            width={GPU.vramInnerW - GPU.vramTextPadX * 2}
            y={gpuChip.vramCenterY + GPU.vramInnerH / 2 - GPU.vramTextPadY}
          />
          <Txt
            text="GPU física"
            fontFamily={theme.pixelFont}
            fontSize={22}
            fill={theme.black}
            y={-GPU_CHIP_H / 2 - 26}
          />
        </Layout>

        <Line
          points={[
            [gpuPcie.left, gpuPcie.y],
            [gpuPcie.right, gpuPcie.y],
          ]}
          stroke={theme.black}
          lineWidth={2}
          lineDash={[10, 8]}
          lineCap="round"
        />
        <Txt
          text="PCIe · lento"
          fontFamily={theme.bodyFont}
          fontSize={15}
          fontWeight={700}
          fill={theme.magenta}
          x={gpuPcie.midX}
          y={gpuPcie.y - 22}
        />

        <Layout ref={gpuRamRef} layout={false} x={gpuRamCenterX()} y={GPU.chipY}>
          <Box width={GPU.ramW} height={GPU.ramH} fill={CPU_HOST_GRAY} />
          <Rect
            width={GPU.ramW - 32}
            height={58}
            fill={theme.white}
            stroke={theme.black}
            lineWidth={2}
            y={2}
          />
          <Txt
            text={GPU.hostRamGbLabel}
            fontFamily={theme.bodyFont}
            fontSize={18}
            fontWeight={700}
            fill={theme.black}
            y={2}
          />
          <Txt
            text="RAM del host"
            fontFamily={theme.pixelFont}
            fontSize={20}
            fill={theme.black}
            y={GPU.ramH / 2 + 26}
          />
        </Layout>

        <Line
          points={[
            [gpuVmBus.left, gpuVmBus.busY],
            [gpuVmBus.right, gpuVmBus.busY],
          ]}
          stroke={theme.black}
          lineWidth={2}
          lineDash={[10, 8]}
          lineCap="round"
        />

        <Layout layout={false} key="gpu-vm1-plug">
          <Spline
            ref={gpuPlugBaseRef}
            points={gpuVm1PlugPts}
            smoothness={0.38}
            stroke={GPU_VM1_PLUG_COLOR}
            lineWidth={4}
            lineCap="round"
            end={1}
          />
          <Spline
            ref={gpuPlugFlowRef}
            points={gpuVm1PlugPts}
            smoothness={0.38}
            stroke={GPU_VM1_PLUG_COLOR}
            lineWidth={12}
            lineCap="round"
            lineDash={[16, 24]}
            lineDashOffset={0}
            opacity={0.6}
            end={1}
          />
        </Layout>

        <Layout layout={false} key="gpu-vm2-plug">
          <Spline
            ref={gpuPlug2BaseRef}
            points={gpuVm2PlugPts}
            smoothness={0.38}
            stroke={GPU_VM2_PLUG_COLOR}
            lineWidth={4}
            lineCap="round"
            end={0}
          />
          <Spline
            ref={gpuPlug2FlowRef}
            points={gpuVm2PlugPts}
            smoothness={0.38}
            stroke={GPU_VM2_PLUG_COLOR}
            lineWidth={12}
            lineCap="round"
            lineDash={[16, 24]}
            lineDashOffset={0}
            opacity={0.6}
            end={0}
          />
        </Layout>

        {gpuVm1Joint ? (
          <Circle
            ref={gpuBusJointRef}
            x={gpuVm1Joint.position[0]}
            y={gpuVm1Joint.position[1]}
            width={14}
            height={14}
            fill={GPU_VM1_PLUG_COLOR}
            stroke={theme.black}
            lineWidth={2}
          />
        ) : null}

        {gpuVm2Joint ? (
          <Circle
            ref={gpuBusJoint2Ref}
            x={gpuVm2Joint.position[0]}
            y={gpuVm2Joint.position[1]}
            width={14}
            height={14}
            fill={GPU_VM2_PLUG_COLOR}
            stroke={theme.black}
            lineWidth={2}
            opacity={0}
          />
        ) : null}

        {[0, 1].map(i => (
          <Layout
            key={`gpu-xfer-pkt-${i}`}
            ref={gpuTransferPacketRefs[i]}
            layout={false}
            zIndex={50}
            opacity={0}
          >
            <Rect
              width={i === 0 ? 92 : 88}
              height={40}
              fill={i === 0 ? theme.white : theme.cyan}
              stroke={theme.black}
              lineWidth={2}
            />
            <Txt
              ref={gpuTransferPacketLabelRefs[i]}
              text={i === 0 ? GPU_PACKET_MB_LABEL : GPU_PACKET_GB_LABEL}
              fontFamily={theme.bodyFont}
              fontSize={i === 0 ? 15 : 16}
              fontWeight={700}
              fill={theme.black}
            />
          </Layout>
        ))}

        <Layout
          ref={gpuVm1Ref}
          layout={false}
          x={-GPU.vmX}
          y={GPU.vmRowY}
        >
          <Rect width={GPU.vmW} height={GPU.vmH} fill={theme.black} x={3} y={3} />
          <Rect
            ref={gpuVm1BodyRef}
            width={GPU.vmW}
            height={GPU.vmH}
            fill={theme.yellow}
            stroke={theme.black}
            lineWidth={4}
          />
          <Txt
            ref={gpuVm1LabelRef}
            text="vGPU 1"
            fontFamily={theme.pixelFont}
            fontSize={24}
            fill={theme.black}
            y={-8}
          />
          <Rect
            ref={gpuVm1PortRef}
            width={22}
            height={22}
            y={-GPU.vmH / 2 + 20}
            fill={GPU_VM1_PLUG_COLOR}
            stroke={theme.black}
            lineWidth={2}
          />
          <Txt
            ref={gpuVm1ActiveLabelRef}
            text="activa"
            fontFamily={theme.bodyFont}
            fontSize={14}
            fontWeight={700}
            fill={theme.black}
            y={16}
          />
        </Layout>
        <Layout ref={gpuVm2Ref} layout={false} x={GPU.vmX} y={GPU.vmRowY}>
          <Rect width={GPU.vmW} height={GPU.vmH} fill={theme.black} x={3} y={3} />
          <Rect
            ref={gpuVm2BodyRef}
            width={GPU.vmW}
            height={GPU.vmH}
            fill={theme.white}
            stroke={theme.black}
            lineWidth={2}
            opacity={0.55}
          />
          <Txt
            ref={gpuVm2LabelRef}
            text="vGPU 2"
            fontFamily={theme.pixelFont}
            fontSize={24}
            fill={theme.black}
            y={0}
          />
          <Rect
            ref={gpuVm2PortRef}
            width={22}
            height={22}
            y={-GPU.vmH / 2 + 20}
            fill={GPU_VM2_PLUG_COLOR}
            stroke={theme.black}
            lineWidth={2}
            opacity={0}
          />
          <Txt
            ref={gpuVm2ActiveLabelRef}
            text="activa"
            fontFamily={theme.bodyFont}
            fontSize={14}
            fontWeight={700}
            fill={theme.black}
            y={16}
            opacity={0}
          />
          <Layout
            ref={gpuVm2TaskRef}
            layout={false}
            y={GPU.vmH / 2 + 36}
            opacity={0}
          >
            <Rect
              width={200}
              height={56}
              fill={theme.white}
              stroke={theme.black}
              lineWidth={2}
            />
            <Txt
              text="Quiere continuar tarea"
              fontFamily={theme.bodyFont}
              fontSize={13}
              fontWeight={600}
              fill={theme.black}
              y={-10}
            />
            <Txt
              text={`${GPU_VRAM_VM2_TASK_GB} GB VRAM`}
              fontFamily={theme.bodyFont}
              fontSize={15}
              fontWeight={700}
              fill={theme.cyan}
              y={12}
            />
          </Layout>
        </Layout>
      </Layout>

    </Layout>
  );
}
