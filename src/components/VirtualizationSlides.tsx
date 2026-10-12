import {Layout, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {theme} from '../theme';

function StackBox({
  w,
  h,
  fill,
  label,
  sub,
  y = 0,
}: {
  w: number;
  h: number;
  fill: string;
  label: string;
  sub?: string;
  y?: number;
}) {
  return (
    <Layout layout={false} y={y}>
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
        fontSize={26}
        fill={theme.black}
        y={sub ? -12 : 0}
      />
      {sub ? (
        <Txt
          text={sub}
          fontFamily={theme.bodyFont}
          fontSize={18}
          fontWeight={500}
          fill={theme.grey}
          y={18}
        />
      ) : null}
    </Layout>
  );
}

function MiniVm({x, osLabel}: {x: number; osLabel: string}) {
  return (
    <Layout layout={false} x={x} y={0}>
      <Rect width={200} height={220} fill={theme.black} x={4} y={4} />
      <Rect
        width={200}
        height={220}
        fill={theme.white}
        stroke={theme.black}
        lineWidth={3}
      />
      <Txt
        text="VM"
        fontFamily={theme.pixelFont}
        fontSize={22}
        fill={theme.black}
        y={-70}
      />
      <Rect
        width={150}
        height={36}
        fill={theme.cyan}
        stroke={theme.black}
        lineWidth={2}
        y={-20}
      />
      <Txt
        text="Guest OS"
        fontFamily={theme.bodyFont}
        fontSize={16}
        fontWeight={700}
        fill={theme.black}
        y={-20}
      />
      <Txt
        text={osLabel}
        fontFamily={theme.bodyFont}
        fontSize={15}
        fill={theme.grey}
        y={20}
      />
      <Rect
        width={120}
        height={32}
        fill={theme.magenta}
        stroke={theme.black}
        lineWidth={2}
        y={70}
      />
      <Txt
        text="App"
        fontFamily={theme.bodyFont}
        fontSize={16}
        fontWeight={700}
        fill={theme.black}
        y={70}
      />
    </Layout>
  );
}

type HypervisorSlideProps = {
  typeNoteRef?: Reference<Txt>;
  vmRowRef?: Reference<Layout>;
};

/** Hypervisor: varias VMs con SO invitado en un solo host. */
export function HypervisorVirtualizationSlide({
  typeNoteRef,
  vmRowRef,
}: HypervisorSlideProps) {
  return (
    <Layout layout={false} width={'100%'} height={'100%'}>
      <Txt
        text="Virtualización con hypervisor"
        fontFamily={theme.pixelFont}
        fontSize={52}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-380}
      />
      <Txt
        text="Un hypervisor reparte CPU, RAM y red · cada VM lleva su propio sistema operativo"
        fontFamily={theme.bodyFont}
        fontSize={26}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-315}
      />

      <StackBox
        w={720}
        h={56}
        fill="#B0B0B0"
        label="Hardware físico (servidor)"
        y={-180}
      />
      <StackBox
        w={720}
        h={64}
        fill={theme.cyan}
        label="Hypervisor"
        sub="Tipo 1: sobre el metal · Tipo 2: sobre un SO anfitrión"
        y={-95}
      />

      <Layout ref={vmRowRef} layout={false} y={80} opacity={1}>
        <MiniVm x={-240} osLabel="Windows / Linux" />
        <MiniVm x={0} osLabel="Linux" />
        <MiniVm x={240} osLabel="Otro SO" />
      </Layout>

      <Txt
        ref={typeNoteRef}
        text={
          'En el datacenter suele usarse Tipo 1 (ESXi, Hyper-V, KVM).\nCada VM cree tener su propia máquina → varios SO en el mismo rack.'
        }
        fontFamily={theme.bodyFont}
        fontSize={22}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        lineHeight={34}
        x={0}
        y={280}
        opacity={1}
      />
    </Layout>
  );
}

function MiniContainer({x, name}: {x: number; name: string}) {
  return (
    <Layout layout={false} x={x} y={0}>
      <Rect width={160} height={140} fill={theme.black} x={3} y={3} />
      <Rect
        width={160}
        height={140}
        fill={theme.yellow}
        stroke={theme.black}
        lineWidth={3}
      />
      <Txt
        text={name}
        fontFamily={theme.bodyFont}
        fontSize={17}
        fontWeight={700}
        fill={theme.black}
        y={-30}
      />
      <Txt
        text="proceso aislado"
        fontFamily={theme.bodyFont}
        fontSize={14}
        fill={theme.grey}
        y={10}
      />
      <Txt
        text="imagen"
        fontFamily={theme.bodyFont}
        fontSize={14}
        fontWeight={600}
        fill={theme.black}
        y={45}
      />
    </Layout>
  );
}

type ContainerSlideProps = {
  dockerRef?: Reference<Layout>;
  noteRef?: Reference<Txt>;
};

/** Contenedores: kernel compartido; Docker como empaquetado habitual. */
export function ContainersDockerSlide({dockerRef, noteRef}: ContainerSlideProps) {
  return (
    <Layout layout={false} width={'100%'} height={'100%'}>
      <Txt
        text="Contenedores (y Docker)"
        fontFamily={theme.pixelFont}
        fontSize={52}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-380}
      />
      <Txt
        text="Virtualización a nivel de aplicación · un solo kernel del SO anfitrión"
        fontFamily={theme.bodyFont}
        fontSize={26}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-315}
      />

      <StackBox
        w={680}
        h={52}
        fill="#B0B0B0"
        label="Servidor · SO anfitrión (Linux / Windows)"
        y={-170}
      />
      <Layout ref={dockerRef} layout={false} y={-70} opacity={1}>
        <StackBox
          w={680}
          h={48}
          fill={theme.cyan}
          label="Motor de contenedores (p. ej. Docker Engine)"
          sub="crea, ejecuta y aísla contenedores"
        />
      </Layout>

      <Layout layout={false} y={100}>
        <MiniContainer x={-270} name="API" />
        <MiniContainer x={-90} name="Worker" />
        <MiniContainer x={90} name="DB client" />
        <MiniContainer x={270} name="Batch" />
      </Layout>

      <Txt
        ref={noteRef}
        text={
          'Imagen = app + dependencias empaquetadas · contenedor = instancia en ejecución.\nMismo kernel → arranque rápido y menos RAM que muchas VMs completas.'
        }
        fontFamily={theme.bodyFont}
        fontSize={22}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        lineHeight={34}
        x={0}
        y={290}
        opacity={1}
      />
    </Layout>
  );
}

/** VM vs contenedor + por qué importa para escala y energía. */
export function VirtualizationCompareSlide() {
  const rows = [
    {
      label: 'Qué virtualiza',
      vm: 'Hardware → SO invitado + apps',
      ctr: 'App empaquetada sobre kernel compartido',
    },
    {
      label: 'Aislamiento',
      vm: 'Fuerte (SO completo por VM)',
      ctr: 'Proceso + namespaces / cgroups',
    },
    {
      label: 'Cuándo encaja',
      vm: 'SO distintos, cargas legacy, multi-tenant clásico',
      ctr: 'Microservicios, CI/CD, escalar réplicas',
    },
    {
      label: 'En el datacenter',
      vm: 'Consolidar servidores físicos → menos chasis ociosos',
      ctr: 'Más densidad por host · orquestación (K8s, Swarm)',
    },
  ] as const;

  return (
    <Layout layout={false} width={'100%'} height={'100%'}>
      <Txt
        text="VM · contenedor · escala"
        fontFamily={theme.pixelFont}
        fontSize={52}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-380}
      />
      <Txt
        text="No compiten: se combinan · el objetivo común es usar mejor el hardware"
        fontFamily={theme.bodyFont}
        fontSize={26}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-315}
      />

      <Layout layout={false} y={-40}>
        <Rect width={1480} height={420} fill={theme.black} x={6} y={6} />
        <Rect
          width={1480}
          height={420}
          fill={theme.white}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          text="VM (hypervisor)"
          fontFamily={theme.pixelFont}
          fontSize={24}
          fill={theme.black}
          x={-120}
          y={-170}
        />
        <Txt
          text="Contenedor"
          fontFamily={theme.pixelFont}
          fontSize={24}
          fill={theme.black}
          x={420}
          y={-170}
        />
        {rows.map((row, i) => (
          <Layout key={row.label} layout={false} y={-100 + i * 82}>
            <Rect
              width={1420}
              height={68}
              fill={i % 2 === 0 ? theme.yellow : theme.white}
              stroke={theme.black}
              lineWidth={2}
              opacity={0.95}
            />
            <Txt
              text={row.label}
              fontFamily={theme.bodyFont}
              fontSize={20}
              fontWeight={700}
              fill={theme.black}
              x={-620}
            />
            <Txt
              text={row.vm}
              fontFamily={theme.bodyFont}
              fontSize={19}
              fill={theme.black}
              x={-120}
              textWrap="pre"
              width={480}
            />
            <Txt
              text={row.ctr}
              fontFamily={theme.bodyFont}
              fontSize={19}
              fill={theme.black}
              x={420}
              textWrap="pre"
              width={480}
            />
          </Layout>
        ))}
      </Layout>

      <Txt
        text="Menos servidores subutilizados → menos energía de soporte (PUE) por unidad de trabajo útil"
        fontFamily={theme.bodyFont}
        fontSize={24}
        fontWeight={700}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={320}
      />
    </Layout>
  );
}
