import {Layout, Line, Rect, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {LinuxIcon, WindowsIcon} from './DifferentOsSlide';
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
          fontWeight={600}
          fill={theme.black}
          y={18}
        />
      ) : null}
    </Layout>
  );
}

type VmCardProps = {
  x: number;
  vmId: string;
  osKind: 'windows' | 'linux' | 'legacy';
  osTitle: string;
  resources: string;
  appLabel: string;
  appFill: string;
};

function LegacyOsIcon({y = 0}: {y?: number}) {
  return (
    <Layout layout={false} y={y}>
      <Rect width={44} height={44} fill="#6B6B6B" stroke={theme.black} lineWidth={2} />
      <Txt
        text="OS"
        fontFamily={theme.pixelFont}
        fontSize={18}
        fill={theme.white}
      />
    </Layout>
  );
}

/** Altura de tarjeta VM (debe coincidir con `vmCardH` en HypervisorVirtualizationSlide). */
const VM_CARD_H = 240;

/** VM con SO invitado, recursos virtuales y carga de trabajo. */
function VmCard({
  x,
  vmId,
  osKind,
  osTitle,
  resources,
  appLabel,
  appFill,
}: VmCardProps) {
  const cardW = 220;
  const cardH = VM_CARD_H;
  const pad = 12;
  const topPad = 10;
  const headerH = 30;
  const headerY = -cardH / 2 + topPad + headerH / 2;
  const headerBottom = -cardH / 2 + topPad + headerH;
  const iconY = headerBottom + 42;
  return (
    <Layout layout={false} x={x} y={0}>
      <Rect width={cardW} height={cardH} fill={theme.black} x={4} y={4} />
      <Rect
        width={cardW}
        height={cardH}
        fill={theme.white}
        stroke={theme.black}
        lineWidth={theme.border}
      />
      <Rect
        width={cardW - pad * 2}
        height={headerH}
        fill={theme.yellow}
        stroke={theme.black}
        lineWidth={2}
        y={headerY}
      />
      <Txt
        text={vmId}
        fontFamily={theme.pixelFont}
        fontSize={20}
        fill={theme.black}
        y={headerY}
      />
      {osKind === 'windows' ? (
        <WindowsIcon y={iconY - 4} scale={1.85} nodeKey={`vm-${vmId}-win`} />
      ) : osKind === 'linux' ? (
        <LinuxIcon y={iconY} scale={1.2} nodeKey={`vm-${vmId}-linux`} />
      ) : (
        <LegacyOsIcon y={iconY} />
      )}
      <Txt
        text={osTitle}
        fontFamily={theme.bodyFont}
        fontSize={15}
        fontWeight={700}
        fill={theme.black}
        y={iconY + 44}
      />
      <Rect
        width={cardW - pad * 2 - 8}
        height={26}
        fill="#E8E8E8"
        stroke={theme.black}
        lineWidth={2}
        y={iconY + 72}
      />
      <Txt
        text={resources}
        fontFamily={theme.bodyFont}
        fontSize={14}
        fontWeight={600}
        fill={theme.black}
        y={iconY + 72}
      />
      <Rect
        width={cardW - pad * 2 - 8}
        height={36}
        fill={appFill}
        stroke={theme.black}
        lineWidth={2}
        y={iconY + 104}
      />
      <Txt
        text={appLabel}
        fontFamily={theme.bodyFont}
        fontSize={16}
        fontWeight={700}
        fill={theme.black}
        y={iconY + 104}
      />
    </Layout>
  );
}

const HYPERVISOR_VMS: readonly VmCardProps[] = [
  {
    x: -250,
    vmId: 'VM-1',
    osKind: 'windows',
    osTitle: 'Windows Server',
    resources: '4 vCPU · 16 GB RAM',
    appLabel: 'SQL + .NET',
    appFill: theme.cyan,
  },
  {
    x: 0,
    vmId: 'VM-2',
    osKind: 'linux',
    osTitle: 'Ubuntu Server',
    resources: '8 vCPU · 32 GB RAM',
    appLabel: 'API Node',
    appFill: theme.magenta,
  },
  {
    x: 250,
    vmId: 'VM-3',
    osKind: 'legacy',
    osTitle: 'RHEL (legacy)',
    resources: '2 vCPU · 8 GB RAM',
    appLabel: 'ERP Java',
    appFill: '#FFB900',
  },
];

type HypervisorSlideProps = {
  typeNoteRef?: Reference<Txt>;
  vmRowRef?: Reference<Layout>;
};

/** Hypervisor: varias VMs con SO invitado en un solo host. */
export function HypervisorVirtualizationSlide({
  typeNoteRef,
  vmRowRef,
}: HypervisorSlideProps) {
  const hostW = 960;
  const hypervisorY = -125;
  const hypervisorH = 58;
  const vmCardH = VM_CARD_H;
  const hypervisorBottom = hypervisorY + hypervisorH / 2;
  const vmRowY = hypervisorBottom + 28 + vmCardH / 2;
  const vmTop = vmRowY - vmCardH / 2;
  const vmSpanX = 250;

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
        text="Un host físico · varias máquinas virtuales · cada una con su propio SO"
        fontFamily={theme.bodyFont}
        fontSize={26}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-315}
      />

      <StackBox
        w={hostW}
        h={58}
        fill="#B0B0B0"
        label="Servidor físico"
        sub="16 núcleos / 32 hilos · 128 GB RAM · NIC · almacenamiento compartido"
        y={-200}
      />
      <StackBox
        w={hostW}
        h={58}
        fill={theme.cyan}
        label="Hypervisor (VMM)"
        sub="Asigna vCPU, memoria y E/S · Tipo 1 en DC (ESXi, Hyper-V, KVM)"
        y={hypervisorY}
      />

      <Line
        points={[
          [-vmSpanX, hypervisorBottom],
          [vmSpanX, hypervisorBottom],
        ]}
        stroke={theme.black}
        lineWidth={2}
        lineCap="round"
      />

      {HYPERVISOR_VMS.map(vm => (
        <Line
          key={`link-${vm.vmId}`}
          points={[
            [vm.x, hypervisorBottom],
            [vm.x, vmTop],
          ]}
          stroke={theme.black}
          lineWidth={2}
          lineCap="round"
        />
      ))}

      <Layout ref={vmRowRef} layout={false} y={vmRowY} opacity={1}>
        {HYPERVISOR_VMS.map(vm => (
          <Layout key={`vm-${vm.vmId}`} layout={false}>
            <VmCard
              x={vm.x}
              vmId={vm.vmId}
              osKind={vm.osKind}
              osTitle={vm.osTitle}
              resources={vm.resources}
              appLabel={vm.appLabel}
              appFill={vm.appFill}
            />
          </Layout>
        ))}
      </Layout>

      <Txt
        ref={typeNoteRef}
        text={
          'Cada VM ve hardware virtual propio: kernel invitado, drivers y apps aislados.\nConsolidar cargas en un rack → menos servidores ociosos (misma idea que DOE / PUE).'
        }
        fontFamily={theme.bodyFont}
        fontSize={22}
        fontWeight={600}
        fill={theme.black}
        textAlign="center"
        lineHeight={34}
        x={0}
        y={300}
        opacity={1}
      />
    </Layout>
  );
}
