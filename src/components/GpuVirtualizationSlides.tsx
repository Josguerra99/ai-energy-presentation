import {Layout, Line, Rect, Txt} from '@motion-canvas/2d';
import {theme} from '../theme';

function StackBox({
  w,
  h,
  fill,
  label,
  sub,
  y = 0,
  x = 0,
}: {
  w: number;
  h: number;
  fill: string;
  label: string;
  sub?: string;
  y?: number;
  x?: number;
}) {
  return (
    <Layout layout={false} x={x} y={y}>
      <Rect width={w} height={h} fill={theme.black} x={5} y={5} />
      <Rect
        width={w}
        height={h}
        fill={fill}
        stroke={theme.black}
        lineWidth={theme.border}
      />
      <Txt
        text={label}
        fontFamily={theme.pixelFont}
        fontSize={24}
        fill={theme.black}
        y={sub ? -10 : 0}
      />
      {sub ? (
        <Txt
          text={sub}
          fontFamily={theme.bodyFont}
          fontSize={17}
          fontWeight={600}
          fill={theme.black}
          y={16}
        />
      ) : null}
    </Layout>
  );
}

function BulletPanel({
  x,
  title,
  lines,
  fill = theme.white,
}: {
  x: number;
  title: string;
  lines: readonly string[];
  fill?: string;
}) {
  return (
    <Layout layout={false} x={x} y={0}>
      <Rect width={680} height={380} fill={theme.black} x={5} y={5} />
      <Rect
        width={680}
        height={380}
        fill={fill}
        stroke={theme.black}
        lineWidth={theme.border}
      />
      <Txt
        text={title}
        fontFamily={theme.pixelFont}
        fontSize={28}
        fill={theme.black}
        y={-150}
      />
      {lines.map((line, i) => (
        <Txt
          key={line}
          text={`· ${line}`}
          fontFamily={theme.bodyFont}
          fontSize={18}
          fontWeight={500}
          fill={theme.black}
          textAlign="left"
          width={620}
          lineHeight={28}
          y={-90 + i * 56}
        />
      ))}
    </Layout>
  );
}

/** MIG: partición física en perfiles fijos (no slider libre). */
export function MigVirtualizationSlide() {
  return (
    <Layout layout={false} width={'100%'} height={'100%'}>
      <Txt
        text="MIG: canales físicos en el silicio"
        fontFamily={theme.pixelFont}
        fontSize={52}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-380}
      />
      <Txt
        text="Partición de hardware · perfiles NVIDIA · no divides GB “a ojo”"
        fontFamily={theme.bodyFont}
        fontSize={26}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-315}
      />

      <Layout layout={false} y={-20}>
        <Rect width={720} height={200} fill={theme.black} x={5} y={5} />
        <Rect
          width={720}
          height={200}
          fill="#6E6E6E"
          stroke={theme.black}
          lineWidth={theme.border}
          x={-480}
        />
        <Txt
          text="GPU A100 (ej.), MIG enabled"
          fontFamily={theme.pixelFont}
          fontSize={24}
          fill={theme.white}
          x={-480}
          y={-70}
        />
        {[0, 1, 2].map(i => (
          <Rect
            key={`slice-${i}`}
            width={200}
            height={72}
            fill={[theme.cyan, theme.magenta, '#FFB900'][i]}
            stroke={theme.black}
            lineWidth={2}
            x={-580 + i * 220}
            y={20}
          />
        ))}
        <Txt
          text="GI 1"
          fontFamily={theme.bodyFont}
          fontSize={18}
          fontWeight={700}
          fill={theme.black}
          x={-580}
          y={20}
        />
        <Txt
          text="GI 2"
          fontFamily={theme.bodyFont}
          fontSize={18}
          fontWeight={700}
          fill={theme.black}
          x={-360}
          y={20}
        />
        <Txt
          text="GI 3"
          fontFamily={theme.bodyFont}
          fontSize={18}
          fontWeight={700}
          fill={theme.black}
          x={-140}
          y={20}
        />

        <BulletPanel
          x={200}
          title="vs vCPU / vGPU"
          fill={theme.yellow}
          lines={[
            'SM, VRAM, caché y ancho de banda asignados por diseño (aislamiento + QoS).',
            'Solo combinaciones de perfiles soportadas (p. ej. hasta ~7 instancias en A100).',
            'Reconfigurar layout suele requerir GPU idle / reset, no es ballooning.',
            'NCCL / multi-GPU P2P entre instancias: no, entrenamiento distribuido = GPU entera.',
          ]}
        />
      </Layout>

      <Txt
        text="Fuerte en inferencia multi-tenant y cargas que caben en una partición. Entrenamiento grande o multi-GPU: GPU completa(s). NVIDIA/AWS: reutilizar la misma GPU para inferencia cuando el entrenamiento no la usa."
        fontFamily={theme.bodyFont}
        fontSize={21}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        y={230}
        width={1500}
        lineHeight={32}
      />
    </Layout>
  );
}

