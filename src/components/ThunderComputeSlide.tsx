import {Circle, Layout, Rect, Spline, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {theme} from '../theme';
import {
  CPU_PLUG_FLOW_LAYER_OPACITY,
  CPU_PLUG_FLOW_LINE_WIDTH,
  cpuPlugFlowLineDash,
} from './VgpuContextSwitchSlide';

export const THUNDER_POOL_GPU_COUNT = 4;

/** Cable VM ↔ shim CUDA (contraste sobre blanco / amarillo PyTorch). */
export const THUNDER_VM_CUDA_PLUG_COLOR = theme.pie[0];
/** Cable CUDA ↔ pool por TCP. */
export const THUNDER_ATTACH_PLUG_COLOR = theme.magenta;

/** Misma cadencia que desconexión vCPU → pCPU. */
export const THUNDER_PLUG_DISCONNECT_SEC = 0.3;
export const THUNDER_PLUG_FLOW_FADE_SEC = 0.18;
export const THUNDER_PLUG_CONNECT_SEC = 0.34;

export function thunderPlugRoutePoints(
  from: [number, number],
  to: [number, number],
): [number, number][] {
  return [from, to];
}

export function thunderVmCudaPlugRoute(): [number, number][] {
  return thunderPlugRoutePoints([-330, 28], [-220, 28]);
}

export function thunderAttachPlugRoute(): [number, number][] {
  return thunderPlugRoutePoints([-20, 28], [260, 44]);
}

/** Punto de acento en el cable (mitad del segmento recto). */
export function thunderPlugBusJoint(
  pts: [number, number][],
): [number, number] | null {
  if (pts.length < 2) return null;
  const [x0, y0] = pts[0];
  const [x1, y1] = pts[pts.length - 1];
  return [(x0 + x1) / 2, (y0 + y1) / 2];
}

type ThunderComputeSlideProps = {
  titleRef: Reference<Txt>;
  subtitleRef: Reference<Txt>;
  statusRef: Reference<Txt>;
  vmRef: Reference<Layout>;
  cudaRef: Reference<Layout>;
  vmCudaLineRef: Reference<Spline>;
  vmCudaFlowRef: Reference<Spline>;
  vmCudaBusJointRef: Reference<Circle>;
  attachLineRef: Reference<Spline>;
  attachFlowRef: Reference<Spline>;
  attachBusJointRef: Reference<Circle>;
  poolGpuRefs: Reference<Rect>[];
  poolGpuLabelRefs: Reference<Txt>[];
};

/**
 * Modelo didáctico según Thunder Compute: CUDA interceptado → TCP → pool de GPUs.
 * @see https://www.thundercompute.com/blog/how-thunder-compute-works-gpu-over-tcp
 */
export function ThunderComputeSlide({
  titleRef,
  subtitleRef,
  statusRef,
  vmRef,
  cudaRef,
  vmCudaLineRef,
  vmCudaFlowRef,
  vmCudaBusJointRef,
  attachLineRef,
  attachFlowRef,
  attachBusJointRef,
  poolGpuRefs,
  poolGpuLabelRefs,
}: ThunderComputeSlideProps) {
  const plugFlowDash = cpuPlugFlowLineDash();
  const vmCudaPts = thunderVmCudaPlugRoute();
  const attachPts = thunderAttachPlugRoute();
  const vmCudaJoint = thunderPlugBusJoint(vmCudaPts)!;
  const attachJoint = thunderPlugBusJoint(attachPts)!;

  return (
    <Layout layout={false} width={'100%'} height={'100%'}>
      <Txt
        ref={titleRef}
        text="Pooling de GPU en red (Thunder Compute)"
        fontFamily={theme.pixelFont}
        fontSize={48}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-380}
      />
      <Txt
        ref={subtitleRef}
        text="La GPU no va en PCIe local: el runtime CUDA habla por TCP con un pool del datacenter"
        fontFamily={theme.bodyFont}
        fontSize={24}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        width={1500}
        lineHeight={32}
        x={0}
        y={-310}
      />

      <Layout ref={vmRef} layout={false} x={-440} y={20}>
        <Rect width={220} height={200} fill={theme.black} x={4} y={4} />
        <Rect
          width={220}
          height={200}
          fill={theme.white}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          text="Tu instancia (VM)"
          fontFamily={theme.pixelFont}
          fontSize={20}
          fill={theme.black}
          y={-72}
        />
        <Rect
          width={180}
          height={44}
          fill={theme.yellow}
          stroke={theme.black}
          lineWidth={2}
          y={-24}
        />
        <Txt
          text="PyTorch · device=&quot;cuda&quot;"
          fontFamily={theme.bodyFont}
          fontSize={15}
          fontWeight={700}
          fill={theme.black}
          y={-24}
        />
        <Txt
          text="Mismo código · pip install tnr"
          fontFamily={theme.bodyFont}
          fontSize={14}
          fontWeight={600}
          fill={theme.grey}
          y={28}
        />
        <Txt
          text="CPU + RAM del host"
          fontFamily={theme.bodyFont}
          fontSize={14}
          fill={theme.black}
          y={58}
        />
      </Layout>

      <Layout ref={cudaRef} layout={false} x={-120} y={20}>
        <Rect width={200} height={120} fill={theme.black} x={4} y={4} />
        <Rect
          width={200}
          height={120}
          fill={theme.cyan}
          stroke={theme.black}
          lineWidth={theme.border}
          opacity={0.35}
        />
        <Rect
          width={200}
          height={120}
          fill={theme.white}
          stroke={theme.black}
          lineWidth={theme.border}
          opacity={0.92}
        />
        <Txt
          text="Virtualización CUDA"
          fontFamily={theme.pixelFont}
          fontSize={18}
          fill={theme.black}
          y={-36}
        />
        <Txt
          text="Traduce llamadas CUDA"
          fontFamily={theme.bodyFont}
          fontSize={14}
          fontWeight={600}
          fill={theme.black}
          y={-8}
        />
        <Txt
          text="→ gRPC / TCP (LD_PRELOAD)"
          fontFamily={theme.bodyFont}
          fontSize={13}
          fontWeight={700}
          fill={theme.magenta}
          y={18}
        />
      </Layout>

      <Layout layout={false} x={380} y={20}>
        <Rect width={400} height={220} fill={theme.black} x={4} y={4} />
        <Rect
          width={400}
          height={220}
          fill="#4A4A4A"
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          text="Pool de GPUs físicas"
          fontFamily={theme.pixelFont}
          fontSize={20}
          fill={theme.white}
          y={-88}
        />
        {Array.from({length: THUNDER_POOL_GPU_COUNT}, (_, i) => {
          const x = -120 + i * 80;
          return (
            <Layout key={`pool-gpu-${i}`} layout={false} x={x} y={12}>
              <Rect
                ref={poolGpuRefs[i]}
                width={64}
                height={72}
                fill="#2d2d2d"
                stroke={theme.black}
                lineWidth={2}
              />
              <Txt
                ref={poolGpuLabelRefs[i]}
                text={`GPU ${i + 1}`}
                fontFamily={theme.bodyFont}
                fontSize={12}
                fontWeight={700}
                fill={theme.white}
                y={-22}
              />
            </Layout>
          );
        })}
        <Txt
          text="Tenancy dedicada mientras corre el proceso"
          fontFamily={theme.bodyFont}
          fontSize={13}
          fontWeight={600}
          fill={theme.grey}
          y={72}
        />
      </Layout>

      <Txt
        text="Fabric del DC · TCP"
        fontFamily={theme.bodyFont}
        fontSize={15}
        fontWeight={700}
        fill={theme.black}
        x={80}
        y={-50}
      />

      {/* Enchufes encima de las cajas (mismo criterio que fase CPU en VgpuContextSwitchSlide). */}
      <Layout layout={false} zIndex={40}>
        <Spline
          ref={vmCudaLineRef}
          points={vmCudaPts}
          smoothness={0}
          stroke={THUNDER_VM_CUDA_PLUG_COLOR}
          lineWidth={4}
          lineCap="round"
          lineJoin="miter"
          end={0}
        />
        <Spline
          ref={vmCudaFlowRef}
          points={vmCudaPts}
          smoothness={0}
          stroke={THUNDER_VM_CUDA_PLUG_COLOR}
          lineWidth={CPU_PLUG_FLOW_LINE_WIDTH}
          lineCap="round"
          lineDash={plugFlowDash}
          lineDashOffset={0}
          opacity={0}
          end={0}
        />
        <Circle
          ref={vmCudaBusJointRef}
          x={vmCudaJoint[0]}
          y={vmCudaJoint[1]}
          width={14}
          height={14}
          fill={THUNDER_VM_CUDA_PLUG_COLOR}
          stroke={theme.black}
          lineWidth={2}
          opacity={0}
        />
        <Spline
          ref={attachLineRef}
          points={attachPts}
          smoothness={0}
          stroke={THUNDER_ATTACH_PLUG_COLOR}
          lineWidth={4}
          lineCap="round"
          lineJoin="miter"
          end={0}
        />
        <Spline
          ref={attachFlowRef}
          points={attachPts}
          smoothness={0}
          stroke={THUNDER_ATTACH_PLUG_COLOR}
          lineWidth={CPU_PLUG_FLOW_LINE_WIDTH}
          lineCap="round"
          lineDash={plugFlowDash}
          lineDashOffset={0}
          opacity={0}
          end={0}
        />
        <Circle
          ref={attachBusJointRef}
          x={attachJoint[0]}
          y={attachJoint[1]}
          width={14}
          height={14}
          fill={THUNDER_ATTACH_PLUG_COLOR}
          stroke={theme.black}
          lineWidth={2}
          opacity={0}
        />
      </Layout>

      <Layout layout={false} y={200}>
        <Rect width={920} height={72} fill={theme.white} stroke={theme.black} lineWidth={2} />
        <Txt
          ref={statusRef}
          text="Activo: una GPU completa (VRAM + SM) para tu proceso · al terminar o quedar idle → vuelve al pool"
          fontFamily={theme.bodyFont}
          fontSize={18}
          fontWeight={600}
          fill={theme.black}
          textAlign="center"
          width={880}
          lineHeight={26}
        />
      </Layout>

      <Txt
        text="Re-conectar ~10–20 ms · VRAM se limpia entre inquilinos (según vendor)"
        fontFamily={theme.bodyFont}
        fontSize={16}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        y={280}
        width={1200}
      />
    </Layout>
  );
}
