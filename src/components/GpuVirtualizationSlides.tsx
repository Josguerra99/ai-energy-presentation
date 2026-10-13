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
          text="GPU A100 (ej.) — MIG enabled"
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
            'Reconfigurar layout suele requerir GPU idle / reset — no es ballooning.',
            'NCCL / multi-GPU P2P entre instancias: no — entrenamiento distribuido = GPU entera.',
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

/** Ejemplo: varios modelos de inferencia en paralelo en una GPU con MIG. */
export function MigUseCaseExampleSlide() {
  const cases = [
    {
      part: 'MIG 1',
      fill: theme.cyan,
      title: 'LLM chat',
      sub: 'Inferencia tokens · PyTorch/vLLM',
    },
    {
      part: 'MIG 2',
      fill: theme.magenta,
      title: 'Whisper / ASR',
      sub: 'Transcripción · batch pequeño',
    },
    {
      part: 'MIG 3',
      fill: '#FFB900',
      title: 'Embeddings',
      sub: 'RAG · latencia estable',
    },
  ] as const;

  return (
    <Layout layout={false} width={'100%'} height={'100%'}>
      <Txt
        text="Problema que MIG ayuda a resolver"
        fontFamily={theme.pixelFont}
        fontSize={52}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-380}
      />
      <Txt
        text="Una GPU cara al 15 % · tres servicios distintos necesitan aislamiento de VRAM"
        fontFamily={theme.bodyFont}
        fontSize={26}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-315}
      />

      <Layout layout={false} y={-40}>
        {cases.map((c, i) => (
          <Layout key={c.part} layout={false} x={-320 + i * 320} y={0}>
            <Rect width={280} height={220} fill={theme.black} x={4} y={4} />
            <Rect
              width={280}
              height={220}
              fill={theme.white}
              stroke={theme.black}
              lineWidth={theme.border}
            />
            <Rect
              width={240}
              height={40}
              fill={c.fill}
              stroke={theme.black}
              lineWidth={2}
              y={-78}
            />
            <Txt
              text={c.part}
              fontFamily={theme.pixelFont}
              fontSize={22}
              fill={theme.black}
              y={-78}
            />
            <Txt
              text={c.title}
              fontFamily={theme.bodyFont}
              fontSize={22}
              fontWeight={700}
              fill={theme.black}
              y={-20}
            />
            <Txt
              text={c.sub}
              fontFamily={theme.bodyFont}
              fontSize={17}
              fontWeight={500}
              fill={theme.grey}
              y={20}
            />
          </Layout>
        ))}
      </Layout>

      <Rect width={1480} height={88} fill={theme.yellow} stroke={theme.black} lineWidth={2} y={160} />
      <Txt
        text="Válido para inferencia concurrente (NVIDIA: distintos modelos/frameworks en instancias MIG). No sustituye un job de entrenamiento que necesite toda la GPU o varias GPUs enlazadas."
        fontFamily={theme.bodyFont}
        fontSize={20}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        y={160}
        width={1440}
        lineHeight={28}
      />

      <Txt
        text="Sin MIG: reservar 3 GPUs “por si acaso” · Con MIG: un A100/H100 partido con QoS — mejor utilización del mismo silicio."
        fontFamily={theme.bodyFont}
        fontSize={22}
        fontWeight={700}
        fill={theme.black}
        textAlign="center"
        y={280}
        width={1500}
      />
    </Layout>
  );
}

/** GPUs ociosas tras entrenamiento · acceso remoto / pooling (Thunder Compute). */
export function GpuIdleAndRemoteAccessSlide() {
  return (
    <Layout layout={false} width={'100%'} height={'100%'}>
      <Txt
        text="El problema que MIG no resuelve solo"
        fontFamily={theme.pixelFont}
        fontSize={50}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-380}
      />
      <Txt
        text="Entrenamiento terminado · instancia sigue pagando · GPU al 0 % mientras lees logs o ajustas código"
        fontFamily={theme.bodyFont}
        fontSize={24}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-315}
      />

      <Layout layout={false} x={-380} y={-30}>
        <BulletPanel
          x={0}
          title="En el datacenter"
          lines={[
            'MIG optimiza compartir una GPU entre cargas que corren a la vez.',
            'No evita que el chip quede reservado 24/7 a una VM “de entrenamiento”.',
            'Passthrough / instancia dedicada: máximo rendimiento, mínima utilización media.',
            'Objetivo sostenible: más trabajo útil por kWh — menos GPUs apagadas en papel pero pagadas.',
          ]}
        />
      </Layout>

      <Layout layout={false} x={380} y={-30}>
        <Rect width={680} height={380} fill={theme.black} x={5} y={5} />
        <Rect
          width={680}
          height={380}
          fill={theme.cyan}
          stroke={theme.black}
          lineWidth={theme.border}
          opacity={0.25}
        />
        <Rect
          width={680}
          height={380}
          fill={theme.white}
          stroke={theme.black}
          lineWidth={theme.border}
          opacity={0.95}
        />
        <Txt
          text="Acceso remoto (ej. Thunder Compute)"
          fontFamily={theme.pixelFont}
          fontSize={26}
          fill={theme.black}
          y={-150}
        />
        {[
          'GPU-over-TCP: intercepta CUDA en userspace; el chip puede estar en otro nodo.',
          'Mientras el proceso no usa GPU, puede soltarse — re-adjuntar ~10–20 ms (vendor).',
          'Durante el job: tenancy dedicada al proceso (VRAM completa mientras corre).',
          'Complementa MIG/vGPU: pooling y desacoplar “mi VM” de “GPU pegada 24 h”.',
        ].map((line, i) => (
          <Txt
            key={line}
            text={`· ${line}`}
            fontFamily={theme.bodyFont}
            fontSize={17}
            fontWeight={500}
            fill={theme.black}
            textAlign="left"
            width={620}
            lineHeight={26}
            y={-85 + i * 58}
          />
        ))}
      </Layout>

      <Txt
        text="Matiz: red añade latencia — mejor alineado a batch/inferencia/dev que a gráficos interactivos; entrenamiento puede ser más lento que GPU local (Thunder Compute lo documenta)."
        fontFamily={theme.bodyFont}
        fontSize={19}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        y={300}
        width={1500}
        lineHeight={28}
      />
    </Layout>
  );
}
