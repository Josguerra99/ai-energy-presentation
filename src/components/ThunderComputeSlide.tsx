import {Layout, Rect, Spline, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {theme} from '../theme';

export const THUNDER_POOL_GPU_COUNT = 4;

type ThunderComputeSlideProps = {
  titleRef: Reference<Txt>;
  subtitleRef: Reference<Txt>;
  statusRef: Reference<Txt>;
  vmRef: Reference<Layout>;
  cudaRef: Reference<Layout>;
  attachLineRef: Reference<Spline>;
  attachFlowRef: Reference<Spline>;
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
  attachLineRef,
  attachFlowRef,
  poolGpuRefs,
  poolGpuLabelRefs,
}: ThunderComputeSlideProps) {
  const attachPts: [number, number][] = [
    [-24, 28],
    [80, 28],
    [200, 28],
  ];

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

      <Txt
        text="Fabric del DC · TCP"
        fontFamily={theme.bodyFont}
        fontSize={15}
        fontWeight={700}
        fill={theme.black}
        x={80}
        y={-50}
      />

      <Layout layout={false} y={20}>
        <Spline
          ref={attachLineRef}
          points={attachPts}
          smoothness={0.42}
          stroke={theme.black}
          lineWidth={4}
          lineCap="round"
          end={1}
        />
        <Spline
          ref={attachFlowRef}
          points={attachPts}
          smoothness={0.42}
          stroke={theme.magenta}
          lineWidth={10}
          lineCap="round"
          lineDash={[14, 22]}
          lineDashOffset={0}
          opacity={0.55}
          end={1}
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
