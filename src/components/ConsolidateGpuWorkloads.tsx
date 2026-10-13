import {Layout, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {theme} from '../theme';

export const GPU_CONSOL_APPS = [
  {id: '1', label: 'LLM chat', fill: theme.cyan, util: 14},
  {id: '2', label: 'Whisper / ASR', fill: theme.magenta, util: 11},
  {id: '3', label: 'Embeddings', fill: '#FFB900', util: 9},
] as const;

export const GPU_CONSOL_START_X = [-520, 0, 520] as const;
export const GPU_CONSOL_END_X = [-280, 0, 280] as const;
export const GPU_CONSOL_END_Y = 24;

const HOST_W = 980;
const HOST_H = 280;
const CHIP_W = 228;
const CHIP_H = 178;
const HOST_LABEL_W = 380;
const HOST_LABEL_H = 36;

type ConsolidateGpuWorkloadsProps = {
  titleRef?: Reference<Txt>;
  beforeLabel: Reference<Txt>;
  afterLabel: Reference<Txt>;
  hostRef: Reference<Layout>;
  chipRefs: Reference<Layout>[];
  utilRefs: Reference<Txt>[];
  workloadRefs: Reference<Layout>[];
};

/**
 * Antes: una app por GPU dedicada → después: varias apps en una GPU física compartida.
 */
export function ConsolidateGpuWorkloads({
  titleRef,
  beforeLabel,
  afterLabel,
  hostRef,
  chipRefs,
  utilRefs,
  workloadRefs,
}: ConsolidateGpuWorkloadsProps) {
  const gpuTitleY = -CHIP_H / 2 + 26;
  const modelY = 18;
  const utilY = 62;

  return (
    <Layout layout={false} width={1600} height={760}>
      <Txt
        ref={titleRef}
        text="Qué resuelve la GPU virtualizada"
        fontFamily={theme.pixelFont}
        fontSize={52}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-380}
      />

      <Txt
        ref={beforeLabel}
        text="ANTES · una app por GPU"
        fontFamily={theme.pixelFont}
        fontSize={26}
        fill={theme.black}
        y={-240}
      />
      <Txt
        ref={afterLabel}
        text="DESPUÉS · varias apps, una GPU física"
        fontFamily={theme.pixelFont}
        fontSize={26}
        fill={theme.black}
        y={-240}
        opacity={0}
      />

      <Layout ref={hostRef} layout={false} opacity={0} scale={0.88} y={10}>
        <Rect
          width={HOST_LABEL_W}
          height={HOST_LABEL_H}
          y={-HOST_H / 2 - 28}
          fill={theme.black}
          radius={4}
        />
        <Txt
          text="GPU física compartida"
          fontFamily={theme.pixelFont}
          fontSize={20}
          fill={theme.white}
          y={-HOST_H / 2 - 28}
        />
        <Rect width={HOST_W} height={HOST_H} fill={theme.black} x={6} y={6} />
        <Rect
          width={HOST_W}
          height={HOST_H}
          fill="#4A4A4A"
          stroke={theme.cyan}
          lineWidth={5}
        />
      </Layout>

      {GPU_CONSOL_APPS.map((app, i) => (
        <Layout
          key={`gpu-wl-${app.id}`}
          ref={workloadRefs[i]}
          layout={false}
          x={GPU_CONSOL_START_X[i]}
          y={20}
        >
          <Layout ref={chipRefs[i]} layout={false}>
            <Rect width={CHIP_W} height={CHIP_H} fill={theme.black} x={4} y={4} />
            <Rect
              width={CHIP_W}
              height={CHIP_H}
              fill="#4A4A4A"
              stroke={theme.black}
              lineWidth={theme.border}
            />
            <Txt
              text={`GPU ${app.id}`}
              fontFamily={theme.pixelFont}
              fontSize={18}
              fill={theme.white}
              y={gpuTitleY}
            />
          </Layout>
          <Rect
            width={200}
            height={48}
            fill={app.fill}
            stroke={theme.black}
            lineWidth={2}
            y={modelY}
          />
          <Txt
            text={app.label}
            fontFamily={theme.bodyFont}
            fontSize={20}
            fontWeight={700}
            fill={theme.black}
            y={modelY}
          />
          <Txt
            ref={utilRefs[i]}
            text={`~${app.util}% GPU`}
            fontFamily={theme.bodyFont}
            fontSize={16}
            fill={theme.grey}
            y={utilY}
          />
        </Layout>
      ))}
    </Layout>
  );
}
