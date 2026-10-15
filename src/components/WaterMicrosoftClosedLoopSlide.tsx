import {Circle, Layout, Line, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {WATER_SLIDE_LAYOUT_H} from './WaterDcHeatIntroSlide';
import {theme} from '../theme';

const TITLE_Y = -318;
const SUBTITLE_Y = -262;

const FRAME_X = -408;
const FRAME_Y = -8;
const FRAME_W = 500;
const FRAME_H = 340;

const RACK_X = -72;
const RACK_Y = 24;
const SIDEKICK_X = 118;
const SIDEKICK_Y = 32;
const SIDEKICK_W = 108;
const SIDEKICK_H = 82;
const LOOP_EAST = SIDEKICK_X + SIDEKICK_W / 2;

const LOOP_POINTS: [number, number][] = [
  [RACK_X, -56],
  [RACK_X, 118],
  [LOOP_EAST, 118],
  [LOOP_EAST, -56],
  [RACK_X, -56],
];

const TIMELINE_X = 220;
const TIMELINE_TOP = -88;
const TIMELINE_STEP = 86;

/** De arriba abajo: pasado → futuro (la charla es ~2026). */
const milestones = [
  {
    tag: 'Ago 2024',
    title: 'Nuevo diseño de DC propios',
    detail: 'Refrigeración sin evaporación; fluido en lazo cerrado.',
    accent: theme.magenta,
  },
  {
    tag: 'Parque hoy',
    title: 'Sidekick + cold plates',
    detail: 'Lazo cerrado junto a racks IA (p. ej. Maia) en sitios ya operativos.',
    accent: theme.cyan,
  },
  {
    tag: '2026',
    title: 'Pilotos en construcción',
    detail: 'Phoenix (AZ) y Mount Pleasant (WI).',
    accent: theme.pie[1],
  },
  {
    tag: '2027+',
    title: 'Sitios nuevos online',
    detail: 'Más capacidad con el diseño; flota antigua sigue mix aire / agua.',
    accent: theme.pie[0],
  },
] as const;

const STAT_Y = 278;
const CAPTION_Y = 358;

export type WaterMicrosoftClosedLoopSlideProps = {
  frameRef: Reference<Layout>;
  loopTrackRef: Reference<Line>;
  loopFlowRef: Reference<Line>;
  timelineMilestoneRefs: Reference<Layout>[];
  statGroupRef: Reference<Layout>;
  captionRef: Reference<Txt>;
};

export function WaterMicrosoftClosedLoopSlide({
  frameRef,
  loopTrackRef,
  loopFlowRef,
  timelineMilestoneRefs,
  statGroupRef,
  captionRef,
}: WaterMicrosoftClosedLoopSlideProps) {
  return (
    <Layout layout={false} width={1680} height={WATER_SLIDE_LAYOUT_H}>
      <Txt
        text="Microsoft, refrigeración en circuito cerrado"
        fontFamily={theme.pixelFont}
        fontSize={34}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={TITLE_Y}
        width={1500}
      />
      <Txt
        text="Menos evaporación en sitio · adopción gradual del parque (fuente: Microsoft, 2024–2025)"
        fontFamily={theme.bodyFont}
        fontSize={21}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={SUBTITLE_Y}
        width={1300}
      />

      {/* Diagrama — todo el grupo comparte opacidad (incl. sombra). */}
      <Layout ref={frameRef} layout={false} x={FRAME_X} y={FRAME_Y} opacity={0}>
        <Rect
          width={FRAME_W}
          height={FRAME_H}
          fill={theme.black}
          x={theme.shadow}
          y={theme.shadow}
        />
        <Rect
          width={FRAME_W}
          height={FRAME_H}
          fill="#f5f5f0"
          stroke={theme.black}
          lineWidth={3}
        />
        <Txt
          text="Esquema (lazo cerrado)"
          fontFamily={theme.bodyFont}
          fontSize={14}
          fontWeight={700}
          fill={theme.black}
          textAlign="left"
          offsetX={-1}
          x={-FRAME_W / 2 + 20}
          y={-FRAME_H / 2 + 22}
        />

        <Rect
          width={108}
          height={128}
          fill="#1a1a1a"
          stroke={theme.black}
          lineWidth={3}
          x={RACK_X}
          y={RACK_Y}
        />
        <Txt
          text="Rack IA"
          fontFamily={theme.pixelFont}
          fontSize={16}
          fill={theme.white}
          x={RACK_X}
          y={RACK_Y - 12}
        />
        <Txt
          text="cold plate"
          fontFamily={theme.bodyFont}
          fontSize={11}
          fontWeight={700}
          fill={theme.cyan}
          x={RACK_X}
          y={RACK_Y + 14}
        />

        <Rect
          width={SIDEKICK_W}
          height={SIDEKICK_H}
          fill={theme.white}
          stroke={theme.black}
          lineWidth={3}
          x={SIDEKICK_X}
          y={SIDEKICK_Y}
        />
        <Txt
          text="Sidekick"
          fontFamily={theme.bodyFont}
          fontSize={12}
          fontWeight={700}
          fill={theme.black}
          textAlign="center"
          width={SIDEKICK_W - 8}
          x={SIDEKICK_X}
          y={SIDEKICK_Y - 8}
        />
        <Txt
          text="intercambiador"
          fontFamily={theme.bodyFont}
          fontSize={11}
          fontWeight={600}
          fill={theme.pie[0]}
          textAlign="center"
          width={SIDEKICK_W - 8}
          x={SIDEKICK_X}
          y={SIDEKICK_Y + 10}
        />

        <Line
          ref={loopTrackRef}
          points={LOOP_POINTS}
          stroke={theme.black}
          lineWidth={5}
          lineCap="round"
          lineJoin="round"
          end={1}
          opacity={0}
        />
        <Line
          ref={loopFlowRef}
          points={LOOP_POINTS}
          stroke={theme.pie[0]}
          lineWidth={5}
          lineCap="round"
          lineJoin="round"
          lineDash={[14, 10]}
          lineDashOffset={0}
          end={1}
          opacity={0}
        />

        <Layout layout={false} x={-168} y={88} opacity={0.45}>
          <Rect width={56} height={56} fill="#cbd5e1" stroke={theme.black} lineWidth={2} />
          <Txt text="~" fontFamily={theme.bodyFont} fontSize={28} x={0} y={-8} />
          <Txt
            text="Torre evaporativa"
            fontFamily={theme.bodyFont}
            fontSize={10}
            fontWeight={600}
            fill={theme.black}
            textAlign="center"
            width={90}
            y={38}
          />
          <Txt
            text="menos en diseño nuevo"
            fontFamily={theme.bodyFont}
            fontSize={9}
            fontWeight={700}
            fill={theme.pie[0]}
            textAlign="center"
            width={100}
            y={52}
          />
        </Layout>

        <Txt
          text="Sin reposición continua por evaporación"
          fontFamily={theme.bodyFont}
          fontSize={13}
          fontWeight={600}
          fill={theme.pie[0]}
          textAlign="center"
          width={FRAME_W - 40}
          y={FRAME_H / 2 - 28}
        />
      </Layout>

      {/* Línea de tiempo */}
      <Layout layout={false} x={TIMELINE_X} y={0}>
        <Line
          points={[
            [0, TIMELINE_TOP],
            [0, TIMELINE_TOP + (milestones.length - 1) * TIMELINE_STEP],
          ]}
          stroke={theme.black}
          lineWidth={3}
          lineCap="round"
          opacity={0.35}
        />
        {milestones.map((m, i) => {
          const y = TIMELINE_TOP + i * TIMELINE_STEP;
          const cardX = 248;
          const cardW = 428;
          const cardH = 82;
          const textX = cardX - cardW / 2 + 22;
          const textW = cardW - 48;
          return (
            <Layout ref={timelineMilestoneRefs[i]} layout={false} y={y} opacity={0}>
              <Circle
                x={0}
                y={0}
                width={22}
                height={22}
                fill={m.accent}
                stroke={theme.black}
                lineWidth={2}
              />
              <Rect
                width={cardW}
                height={cardH}
                fill={theme.white}
                stroke={theme.black}
                lineWidth={2}
                x={cardX}
                y={0}
              />
              <Txt
                text={m.tag}
                fontFamily={theme.pixelFont}
                fontSize={16}
                fill={m.accent}
                textAlign="left"
                offsetX={-1}
                x={textX}
                y={-16}
              />
              <Txt
                text={m.title}
                fontFamily={theme.bodyFont}
                fontSize={14}
                fontWeight={700}
                fill={theme.black}
                textAlign="left"
                offsetX={-1}
                width={textW}
                x={textX}
                y={-2}
              />
              <Txt
                text={m.detail}
                fontFamily={theme.bodyFont}
                fontSize={11}
                fontWeight={500}
                fill={theme.black}
                textAlign="left"
                offsetX={-1}
                width={textW}
                lineHeight={16}
                x={textX}
                y={24}
              />
            </Layout>
          );
        })}
      </Layout>

      <Layout ref={statGroupRef} layout={false} opacity={0}>
        <Rect
          width={960}
          height={68}
          fill={theme.black}
          x={theme.shadow}
          y={STAT_Y + theme.shadow}
        />
        <Rect
          width={960}
          height={68}
          fill={theme.cyan}
          stroke={theme.black}
          lineWidth={3}
          x={0}
          y={STAT_Y}
        />
        <Txt
          text={'~125 millones L/año de agua de refrigeración evitados por site (Microsoft, diseño nuevo)'}
          fontFamily={theme.bodyFont}
          fontSize={15}
          fontWeight={700}
          fill={theme.black}
          textAlign="center"
          width={900}
          lineHeight={20}
          x={0}
          y={STAT_Y}
        />
      </Layout>

      <Txt
        ref={captionRef}
        text="Matiz: agua sigue en baños/cocinas; puede subir PUE vs evaporativo en clima seco. Nature (2025): cold plates ~30–50 % menos agua en ciclo de vida que solo aire."
        fontFamily={theme.bodyFont}
        fontSize={15}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        width={1100}
        lineHeight={22}
        y={CAPTION_Y}
        opacity={0}
      />
    </Layout>
  );
}

export const MICROSOFT_LOOP_FLOW_DASH = 28;
export const MICROSOFT_LOOP_FLOW_STEP = 0.34;
