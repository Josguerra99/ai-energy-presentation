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

/** Layout legacy fase GPU (sin cambiar en este paso). */
const GPU_LAYOUT = {
  vmX: 260,
  vmY: -198,
  vmHalfH: 52,
  hypY: -92,
  hypH: 54,
  socketCaptionY: -38,
  siliconRowY: 72,
  dieX: -268,
  ramX: 268,
  siliconBoxH: 148,
  footnoteY: 228,
} as const;

function gpuVmDropStart() {
  return GPU_LAYOUT.vmY + GPU_LAYOUT.vmHalfH + 8;
}
function gpuVmDropEnd() {
  return GPU_LAYOUT.hypY - GPU_LAYOUT.hypH / 2;
}
function gpuHypLineStart() {
  return GPU_LAYOUT.hypY + GPU_LAYOUT.hypH / 2 + 14;
}

function VmBadge({
  label,
  sub,
  active,
}: {
  label: string;
  sub?: string;
  active?: boolean;
}) {
  return (
    <Layout layout={false}>
      <Rect width={148} height={sub ? 96 : 80} fill={theme.black} x={3} y={3} />
      <Rect
        width={148}
        height={sub ? 96 : 80}
        fill={active ? theme.yellow : theme.white}
        stroke={theme.black}
        lineWidth={active ? 4 : 2}
      />
      <Txt
        text={label}
        fontFamily={theme.pixelFont}
        fontSize={22}
        fill={theme.black}
        y={sub ? -10 : 0}
      />
      {sub ? (
        <Txt
          text={sub}
          fontFamily={theme.bodyFont}
          fontSize={13}
          fontWeight={600}
          fill={theme.grey}
          y={18}
        />
      ) : null}
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
  conclusionRef: Reference<Layout>;
  gpuVmARef: Reference<Layout>;
  gpuVmBRef: Reference<Layout>;
  gpuHypervisorRef: Reference<Layout>;
  gpuCoreRef: Reference<Layout>;
  gpuSpillGroupRef: Reference<Layout>;
  gpuSpillChunkRef: Reference<Rect>;
  gpuFootnoteRef: Reference<Txt>;
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
  conclusionRef,
  gpuVmARef,
  gpuVmBRef,
  gpuHypervisorRef,
  gpuCoreRef,
  gpuSpillGroupRef,
  gpuSpillChunkRef,
  gpuFootnoteRef,
}: VgpuContextSwitchSlideProps) {
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
      <Layout ref={gpuPhaseRef} layout={false} y={72} opacity={0}>
        <Layout
          ref={gpuVmARef}
          layout={false}
          x={-GPU_LAYOUT.vmX}
          y={GPU_LAYOUT.vmY}
          opacity={0.4}
        >
          <VmBadge label="VM A" sub="perfil vGPU" />
        </Layout>
        <Layout ref={gpuVmBRef} layout={false} x={GPU_LAYOUT.vmX} y={GPU_LAYOUT.vmY}>
          <VmBadge label="VM B" sub="perfil vGPU" active />
        </Layout>

        <Line
          points={[
            [-GPU_LAYOUT.vmX, gpuVmDropStart()],
            [-GPU_LAYOUT.vmX, gpuVmDropEnd()],
          ]}
          stroke={theme.black}
          lineWidth={2.5}
          endArrow
          arrowSize={14}
        />
        <Line
          points={[
            [GPU_LAYOUT.vmX, gpuVmDropStart()],
            [GPU_LAYOUT.vmX, gpuVmDropEnd()],
          ]}
          stroke={theme.black}
          lineWidth={2.5}
          endArrow
          arrowSize={14}
        />
        <Line
          points={[
            [-GPU_LAYOUT.vmX, gpuVmDropEnd()],
            [GPU_LAYOUT.vmX, gpuVmDropEnd()],
          ]}
          stroke={theme.black}
          lineWidth={2}
        />

        <Layout ref={gpuHypervisorRef} layout={false} y={GPU_LAYOUT.hypY}>
          <Rect
            width={720}
            height={GPU_LAYOUT.hypH}
            fill={theme.black}
            x={5}
            y={5}
          />
          <Rect
            width={720}
            height={GPU_LAYOUT.hypH}
            fill={theme.cyan}
            stroke={theme.black}
            lineWidth={theme.border}
          />
          <Txt
            text="Hypervisor · vGPU Manager"
            fontFamily={theme.bodyFont}
            fontSize={18}
            fontWeight={700}
            fill={theme.black}
          />
        </Layout>

        <Line
          points={[
            [0, gpuHypLineStart()],
            [0, GPU_LAYOUT.socketCaptionY - 16],
          ]}
          stroke={theme.black}
          lineWidth={2.5}
          endArrow
          arrowSize={14}
        />

        <Txt
          text="GPU"
          fontFamily={theme.pixelFont}
          fontSize={20}
          fill={theme.black}
          x={GPU_LAYOUT.dieX}
          y={GPU_LAYOUT.socketCaptionY}
        />
        <Txt
          text="RAM · PCIe"
          fontFamily={theme.pixelFont}
          fontSize={20}
          fill={theme.black}
          x={GPU_LAYOUT.ramX}
          y={GPU_LAYOUT.socketCaptionY}
        />

        <Layout
          ref={gpuCoreRef}
          layout={false}
          x={GPU_LAYOUT.dieX}
          y={GPU_LAYOUT.siliconRowY}
        >
          <Rect
            width={480}
            height={GPU_LAYOUT.siliconBoxH}
            fill={theme.black}
            x={6}
            y={6}
          />
          <Rect
            width={480}
            height={GPU_LAYOUT.siliconBoxH}
            fill="#5A5A5A"
            stroke={theme.black}
            lineWidth={theme.border}
          />
          <Rect
            width={420}
            height={40}
            fill={theme.cyan}
            stroke={theme.black}
            lineWidth={2}
            y={-44}
            opacity={0.95}
          />
          <Txt
            text="VRAM del tenant (perfil)"
            fontFamily={theme.bodyFont}
            fontSize={15}
            fontWeight={700}
            fill={theme.black}
            y={-44}
          />
          <Rect
            width={420}
            height={30}
            fill={theme.yellow}
            stroke={theme.black}
            lineWidth={2}
            y={-2}
          />
          <Txt
            text="colas · L2 / estado"
            fontFamily={theme.bodyFont}
            fontSize={13}
            fontWeight={600}
            fill={theme.black}
            y={-2}
          />
          <Rect
            width={420}
            height={36}
            fill="#333"
            stroke={theme.black}
            lineWidth={2}
            y={38}
          />
          <Txt
            text="SM · cómputo"
            fontFamily={theme.bodyFont}
            fontSize={13}
            fontWeight={600}
            fill={theme.white}
            y={38}
          />
        </Layout>

        <Layout
          layout={false}
          x={GPU_LAYOUT.ramX}
          y={GPU_LAYOUT.siliconRowY}
        >
          <Rect
            width={480}
            height={GPU_LAYOUT.siliconBoxH}
            fill={theme.black}
            x={4}
            y={4}
          />
          <Rect
            width={480}
            height={GPU_LAYOUT.siliconBoxH}
            fill="#E8E8E8"
            stroke={theme.black}
            lineWidth={theme.border}
          />
          <Txt
            text="RAM host"
            fontFamily={theme.pixelFont}
            fontSize={20}
            fill={theme.black}
            y={-36}
          />
          <Txt
            text="Evacuar VRAM por PCIe"
            fontFamily={theme.bodyFont}
            fontSize={15}
            fontWeight={600}
            fill={theme.grey}
            y={-6}
          />
          <Txt
            text="mucho más lento que HBM"
            fontFamily={theme.bodyFont}
            fontSize={14}
            fontWeight={600}
            fill={theme.magenta}
            y={24}
          />
        </Layout>

        <Layout ref={gpuSpillGroupRef} layout={false} opacity={0}>
          <Line
            points={[
              [GPU_LAYOUT.dieX + 40, GPU_LAYOUT.siliconRowY - 30],
              [GPU_LAYOUT.ramX - 40, GPU_LAYOUT.siliconRowY],
            ]}
            stroke={theme.magenta}
            lineWidth={5}
            lineCap="round"
            endArrow
          />
          <Txt
            text="lento vs HBM"
            fontFamily={theme.bodyFont}
            fontSize={16}
            fontWeight={700}
            fill={theme.magenta}
            x={0}
            y={GPU_LAYOUT.siliconRowY - 52}
          />
          <Rect
            ref={gpuSpillChunkRef}
            width={88}
            height={40}
            fill={theme.cyan}
            stroke={theme.black}
            lineWidth={2}
            x={GPU_LAYOUT.dieX + 40}
            y={GPU_LAYOUT.siliconRowY - 28}
          />
          <Txt
            text="VRAM"
            fontFamily={theme.bodyFont}
            fontSize={13}
            fontWeight={700}
            fill={theme.black}
            x={GPU_LAYOUT.dieX + 40}
            y={GPU_LAYOUT.siliconRowY - 28}
          />
        </Layout>

        <Txt
          ref={gpuFootnoteRef}
          text="En GPU, cambiar de VM puede mover mucha VRAM"
          fontFamily={theme.bodyFont}
          fontSize={18}
          fontWeight={600}
          fill={theme.black}
          y={GPU_LAYOUT.footnoteY}
          width={880}
          textAlign="center"
          opacity={0}
        />
      </Layout>

      <Layout ref={conclusionRef} layout={false} y={-20} opacity={0}>
        <Rect width={1480} height={300} fill={theme.black} x={6} y={6} />
        <Rect
          width={1480}
          height={300}
          fill={theme.white}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          text="Compartir en el tiempo funciona en CPU"
          fontFamily={theme.pixelFont}
          fontSize={30}
          fill={theme.black}
          y={-80}
        />
        <Txt
          text="En GPU el cambio de VM cuesta mucho más → por eso existe MIG"
          fontFamily={theme.bodyFont}
          fontSize={24}
          fontWeight={500}
          fill={theme.black}
          textAlign="center"
          width={1300}
          y={20}
        />
      </Layout>
    </Layout>
  );
}
