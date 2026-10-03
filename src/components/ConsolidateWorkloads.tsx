import {Layout, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {theme} from '../theme';

export const CONSOL_APPS = [
  {id: 'A', label: 'App A', fill: theme.cyan, util: 12},
  {id: 'B', label: 'App B', fill: theme.magenta, util: 15},
  {id: 'C', label: 'App C', fill: theme.gold, util: 8},
  {id: 'D', label: 'App D', fill: theme.pie[2], util: 18},
] as const;

/** Posiciones iniciales (más separación). */
export const CONSOL_START_X = [-480, -160, 160, 480] as const;
/** Posiciones finales dentro del servidor compartido. */
export const CONSOL_END_X = [-195, -65, 65, 195] as const;
export const CONSOL_END_Y = 30;

type ConsolidateWorkloadsProps = {
  beforeLabel: Reference<Txt>;
  afterLabel: Reference<Txt>;
  hostRef: Reference<Layout>;
  chassisRefs: Reference<Layout>[];
  utilRefs: Reference<Txt>[];
  serverRefs: Reference<Layout>[];
  punchRef: Reference<Txt>;
};

/**
 * Antes de virtualización: 4 servidores → se unen en uno solo.
 */
export function ConsolidateWorkloads({
  beforeLabel,
  afterLabel,
  hostRef,
  chassisRefs,
  utilRefs,
  serverRefs,
  punchRef,
}: ConsolidateWorkloadsProps) {
  return (
    <Layout layout={false} width={1600} height={760}>
      <Txt
        text="Aprovechar el hardware que ya tienes"
        fontFamily={theme.pixelFont}
        fontSize={36}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-310}
      />

      <Txt
        ref={beforeLabel}
        text="ANTES · un servicio por máquina"
        fontFamily={theme.pixelFont}
        fontSize={26}
        fill={theme.black}
        y={-200}
      />
      <Txt
        ref={afterLabel}
        text="DESPUÉS · varias apps, un servidor"
        fontFamily={theme.pixelFont}
        fontSize={26}
        fill={theme.black}
        y={-200}
        opacity={0}
      />

      {/* Host compartido (aparece al unirse) */}
      <Layout ref={hostRef} layout={false} opacity={0} scale={0.85} y={20}>
        <Rect width={560} height={200} fill={theme.black} x={6} y={6} />
        <Rect
          width={560}
          height={200}
          fill={theme.black}
          stroke={theme.cyan}
          lineWidth={5}
        />
        <Txt
          text="Servidor compartido"
          fontFamily={theme.pixelFont}
          fontSize={24}
          fill={theme.white}
          y={-70}
        />
      </Layout>

      {/* Servidores individuales → se mueven al centro */}
      {CONSOL_APPS.map((app, i) => (
        <Layout
          key={`srv-${app.id}`}
          ref={serverRefs[i]}
          layout={false}
          x={CONSOL_START_X[i]}
          y={40}
        >
          <Layout ref={chassisRefs[i]} layout={false}>
            <Rect width={176} height={128} fill={theme.black} x={4} y={4} />
            <Rect
              width={176}
              height={128}
              fill={theme.black}
              stroke={theme.black}
              lineWidth={theme.border}
            />
            <Txt
              text={`Server ${app.id}`}
              fontFamily={theme.pixelFont}
              fontSize={20}
              fill={theme.white}
              y={-42}
            />
          </Layout>
          <Rect
            width={120}
            height={40}
            fill={app.fill}
            stroke={theme.black}
            lineWidth={2}
            y={4}
          />
          <Txt
            text={app.label}
            fontFamily={theme.bodyFont}
            fontSize={18}
            fontWeight={700}
            fill={theme.black}
            y={4}
          />
          <Txt
            ref={utilRefs[i]}
            text={`~${app.util}% CPU`}
            fontFamily={theme.bodyFont}
            fontSize={16}
            fill={theme.grey}
            y={48}
          />
        </Layout>
      ))}

      <Txt
        ref={punchRef}
        text="Menos máquinas encendidas → menos energía, CAPEX y OPEX."
        fontFamily={theme.bodyFont}
        fontSize={26}
        fontWeight={700}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={300}
        opacity={0}
      />
    </Layout>
  );
}
