import {Circle, Layout, Rect, Spline, Txt} from '@motion-canvas/2d';
import {
  all,
  beginSlide,
  chain,
  createRef,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  linear,
  loopFor,
  waitFor,
  type ThreadGenerator,
} from '@motion-canvas/core';
import {
  ConsolidateGpuWorkloads,
  GPU_CONSOL_APPS,
  GPU_CONSOL_END_X,
  GPU_CONSOL_END_Y,
} from '../../components/ConsolidateGpuWorkloads';
import {
  GpuTrainingProblemSlide,
  TRAIN_GPU_BASE_HUES,
  TRAIN_GPU_COLS,
  TRAIN_GPU_COUNT,
  TRAIN_GPU_EMPTY_FILL,
  TRAIN_GPU_LOOP_SEC,
  TRAIN_GPU_POST_ACTIVE,
  TRAIN_GPU_PULSE_HUES,
  TRAIN_GPU_ROWS,
  TRAIN_GPU_TICK_SEC,
} from '../../components/GpuTrainingProblemSlide';
import {VgpuMigParadigmsSlide} from '../../components/VgpuMigParadigmsSlide';
import {
  THUNDER_POOL_GPU_COUNT,
  ThunderComputeSlide,
} from '../../components/ThunderComputeSlide';
import {
  CPU_PLUG_COUNT,
  CPU_PLUG_FLOW_DASH_CYCLE,
  CPU_PLUG_FLOW_STEP_SEC,
  CPU_PLUG_FLOW_DURATION_SEC,
  CPU_PLUG_FLOW_RECONNECT_SEC,
  CPU_CONTEXT_PACKET_COUNT,
  CPU_CONTEXT_PACKET_PCPUS,
  CPU_INITIAL_PLUG_COUNT,
  CPU_PREEMPT_PLUG_INDICES,
  CPU_SWAP_PLUG_GREEN,
  CPU_SWAP_PLUG_ORANGE,
  CPU_POST_SWAP_FLOW_PLUGS,
  CPU_POST_RESTORE_FLOW_PLUGS,
  CPU_TEAL_PLUG_INDEX,
  CPU_TEAL_SAVE_PCPU,
  CPU_TEAL_VCPU_COLOR,
  CPU_VM_B_CYAN_PLUG_INDEX,
  CPU_VM_B_LIGHT_CYAN,
  CPU_PLUG_FLOW_LAYER_OPACITY,
  CPU_PLUG_FLOW_LINE_WIDTH,
  cpuPlugFlowLineDash,
  cpuContextPacketPositions,
  cpuContextPacketPositionsFromRam,
  cpuPlugRoute,
  GPU_PACKET_MOVE_GB_SEC,
  GPU_PACKET_MOVE_MB_SEC,
  GPU_PACKET_MB_LABEL,
  GPU_PACKET_FREEZE_LABEL,
  GPU_PACKET_VRAM_20_LABEL,
  GPU_PACKET_VRAM_40_LABEL,
  GPU_VRAM_PARTIAL_EVAC_GB,
  GPU_TRANSFER_PACKET_COUNT,
  GPU_VRAM_CAPACITY_GB,
  GPU_VRAM_USED_GB,
  GPU_VRAM_VM2_TASK_GB,
  GPU_VM_PLUG_FLOW_SEC,
  gpuTransferPacketRoute,
  gpuTransferPacketRouteRamToVram,
  gpuVm2PlugRoute,
  gpuVramFillMetrics,
  VgpuContextSwitchSlide,
} from '../../components/VgpuContextSwitchSlide';
import {theme} from '../../theme';
import type {Paso0SceneContext} from './paso0-scene-context';
import {VGPU_TIMELINE_PAD} from './paso0-scene-context';

/** Virtualización GPU: vGPU · MIG · consolidación · entrenamiento. */
export function* gpuSection(ctx: Paso0SceneContext): ThreadGenerator {
  const {scrollTo, setFooter, contentW: CONTENT_W, contentH: CONTENT_H} = ctx;
  const vgpuTitle = createRef<Txt>();
  const vgpuSubtitle = createRef<Txt>();
  const vgpuCpuPhase = createRef<Layout>();
  const vgpuGpuPhase = createRef<Layout>();
  const vgpuCpuVmA = createRef<Layout>();
  const vgpuCpuVmB = createRef<Layout>();
  const vgpuCpuHypervisor = createRef<Layout>();
  const vgpuCpuDie = createRef<Layout>();
  const vgpuCpuRam = createRef<Layout>();
  const vgpuCpuPlugBaseRefs = Array.from({length: CPU_PLUG_COUNT}, () =>
    createRef<Spline>(),
  );
  const vgpuCpuPlugFlowRefs = Array.from({length: CPU_PLUG_COUNT}, () =>
    createRef<Spline>(),
  );
  const vgpuCpuPcpuFillRefs = Array.from({length: 4}, () => createRef<Rect>());
  const vgpuCpuBusJointRefs = Array.from({length: CPU_PLUG_COUNT}, () =>
    createRef<Circle>(),
  );
  const vgpuCpuContextPackets = Array.from(
    {length: CPU_CONTEXT_PACKET_COUNT},
    () => createRef<Rect>(),
  );
  const vgpuGpuCore = createRef<Layout>();
  const vgpuGpuRam = createRef<Layout>();
  const vgpuGpuTransferPackets = Array.from(
    {length: GPU_TRANSFER_PACKET_COUNT},
    () => createRef<Layout>(),
  );
  const vgpuGpuTransferPacketLabels = Array.from(
    {length: GPU_TRANSFER_PACKET_COUNT},
    () => createRef<Txt>(),
  );
  const vgpuGpuVramFill = createRef<Rect>();
  const vgpuGpuVramUsage = createRef<Txt>();
  const vgpuGpuVm1 = createRef<Layout>();
  const vgpuGpuVm2 = createRef<Layout>();
  const vgpuGpuVm1Body = createRef<Rect>();
  const vgpuGpuVm1Port = createRef<Rect>();
  const vgpuGpuVm1ActiveLabel = createRef<Txt>();
  const vgpuGpuVm1Label = createRef<Txt>();
  const vgpuGpuVm2Body = createRef<Rect>();
  const vgpuGpuVm2Port = createRef<Rect>();
  const vgpuGpuVm2ActiveLabel = createRef<Txt>();
  const vgpuGpuVm2Label = createRef<Txt>();
  const vgpuGpuVm2Task = createRef<Layout>();
  const vgpuGpuPlugBase = createRef<Spline>();
  const vgpuGpuPlugFlow = createRef<Spline>();
  const vgpuGpuBusJoint = createRef<Circle>();
  const vgpuGpuPlug2Base = createRef<Spline>();
  const vgpuGpuPlug2Flow = createRef<Spline>();
  const vgpuGpuBusJoint2 = createRef<Circle>();
  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={CONTENT_W} height={CONTENT_H}>
        <VgpuContextSwitchSlide
          titleRef={vgpuTitle}
          subtitleRef={vgpuSubtitle}
          cpuPhaseRef={vgpuCpuPhase}
          gpuPhaseRef={vgpuGpuPhase}
          cpuVmARef={vgpuCpuVmA}
          cpuVmBRef={vgpuCpuVmB}
          cpuHypervisorRef={vgpuCpuHypervisor}
          cpuDieRef={vgpuCpuDie}
          cpuRamRef={vgpuCpuRam}
          cpuPlugBaseRefs={vgpuCpuPlugBaseRefs}
          cpuPlugFlowRefs={vgpuCpuPlugFlowRefs}
          cpuPcpuFillRefs={vgpuCpuPcpuFillRefs}
          cpuBusJointRefs={vgpuCpuBusJointRefs}
          cpuContextPacketRefs={vgpuCpuContextPackets}
          gpuCoreRef={vgpuGpuCore}
          gpuRamRef={vgpuGpuRam}
          gpuVramFillRef={vgpuGpuVramFill}
          gpuVramUsageRef={vgpuGpuVramUsage}
          gpuTransferPacketRefs={vgpuGpuTransferPackets}
          gpuTransferPacketLabelRefs={vgpuGpuTransferPacketLabels}
          gpuVm1Ref={vgpuGpuVm1}
          gpuVm2Ref={vgpuGpuVm2}
          gpuVm1BodyRef={vgpuGpuVm1Body}
          gpuVm1PortRef={vgpuGpuVm1Port}
          gpuVm1ActiveLabelRef={vgpuGpuVm1ActiveLabel}
          gpuVm1LabelRef={vgpuGpuVm1Label}
          gpuVm2BodyRef={vgpuGpuVm2Body}
          gpuVm2PortRef={vgpuGpuVm2Port}
          gpuVm2ActiveLabelRef={vgpuGpuVm2ActiveLabel}
          gpuVm2LabelRef={vgpuGpuVm2Label}
          gpuVm2TaskRef={vgpuGpuVm2Task}
          gpuPlugBaseRef={vgpuGpuPlugBase}
          gpuPlugFlowRef={vgpuGpuPlugFlow}
          gpuBusJointRef={vgpuGpuBusJoint}
          gpuPlug2BaseRef={vgpuGpuPlug2Base}
          gpuPlug2FlowRef={vgpuGpuPlug2Flow}
          gpuBusJoint2Ref={vgpuGpuBusJoint2}
        />
      </Layout>,
    );
  });
  setFooter(['nvidiaVgpuScheduling', 'ubuntuKvmGpuVirt', 'nistHypervisor125a']);

  for (const ref of vgpuCpuPlugFlowRefs) {
    ref().lineDashOffset(0);
  }
  vgpuGpuPlug2Base().end(0);
  vgpuGpuPlug2Flow().end(0);
  vgpuGpuPlug2Flow().lineDashOffset(0);
  vgpuGpuBusJoint2().opacity(0);

  yield* beginSlide('virt-gpu-cpu-titulo');

  yield* loopFor(CPU_PLUG_FLOW_DURATION_SEC, function* () {
    yield* all(
      ...vgpuCpuPlugFlowRefs
        .slice(0, CPU_INITIAL_PLUG_COUNT)
        .map(ref =>
          ref().lineDashOffset(
            -CPU_PLUG_FLOW_DASH_CYCLE,
            CPU_PLUG_FLOW_STEP_SEC,
            linear,
          ),
        ),
    );
    for (let i = 0; i < CPU_INITIAL_PLUG_COUNT; i++) {
      vgpuCpuPlugFlowRefs[i]().lineDashOffset(0);
    }
  });

  yield* beginSlide('virt-gpu-cpu-preempt');
  yield* waitFor(VGPU_TIMELINE_PAD);

  yield* vgpuCpuHypervisor().scale(1.12, 0.18, easeOutBack);
  yield* vgpuCpuHypervisor().scale(1, 0.16, easeOutCubic);

  const pktPurple = cpuContextPacketPositions(CPU_CONTEXT_PACKET_PCPUS[0], 0);
  const pktB1 = cpuContextPacketPositions(CPU_CONTEXT_PACKET_PCPUS[1], 1);
  vgpuCpuContextPackets[0]().x(pktPurple.from[0]);
  vgpuCpuContextPackets[0]().y(pktPurple.from[1]);
  vgpuCpuContextPackets[1]().x(pktB1.from[0]);
  vgpuCpuContextPackets[1]().y(pktB1.from[1]);
  vgpuCpuContextPackets[0]().opacity(1);
  vgpuCpuContextPackets[1]().opacity(1);
  yield* all(
    chain(
      waitFor(0),
      all(
        vgpuCpuContextPackets[0]().x(pktPurple.to[0], 0.55, easeInOutCubic),
        vgpuCpuContextPackets[0]().y(pktPurple.to[1], 0.55, easeInOutCubic),
      ),
    ),
    chain(
      waitFor(0.12),
      all(
        vgpuCpuContextPackets[1]().x(pktB1.to[0], 0.55, easeInOutCubic),
        vgpuCpuContextPackets[1]().y(pktB1.to[1], 0.55, easeInOutCubic),
      ),
    ),
    vgpuCpuRam().scale(1.07, 0.22, easeOutBack),
  );
  yield* all(
    vgpuCpuContextPackets[0]().opacity(0, 0.15, easeOutCubic),
    vgpuCpuContextPackets[1]().opacity(0, 0.15, easeOutCubic),
    vgpuCpuRam().scale(1, 0.14, easeOutCubic),
  );
  vgpuCpuContextPackets[0]().x(pktPurple.from[0]);
  vgpuCpuContextPackets[0]().y(pktPurple.from[1]);
  vgpuCpuContextPackets[1]().x(pktB1.from[0]);
  vgpuCpuContextPackets[1]().y(pktB1.from[1]);

  yield* beginSlide('virt-gpu-cpu-schedule');
  yield* waitFor(VGPU_TIMELINE_PAD);

  yield* all(
    ...CPU_PREEMPT_PLUG_INDICES.map(i =>
      vgpuCpuPlugBaseRefs[i]().end(0, 0.3, easeOutCubic),
    ),
    ...CPU_PREEMPT_PLUG_INDICES.map(i =>
      vgpuCpuPlugFlowRefs[i]().end(0, 0.3, easeOutCubic),
    ),
    ...CPU_PREEMPT_PLUG_INDICES.map(i =>
      vgpuCpuPlugFlowRefs[i]().opacity(0, 0.18, easeOutCubic),
    ),
    vgpuCpuPcpuFillRefs[2]().fill('#FFFFFF', 0.22, easeOutCubic),
    vgpuCpuPcpuFillRefs[3]().fill('#FFFFFF', 0.22, easeOutCubic),
    vgpuCpuBusJointRefs[2]().opacity(0, 0.18, easeOutCubic),
    vgpuCpuBusJointRefs[3]().opacity(0, 0.18, easeOutCubic),
  );

  yield* beginSlide('virt-gpu-cpu-cola');
  yield* waitFor(VGPU_TIMELINE_PAD);

  const orangePts = cpuPlugRoute('a', 3, 2);
  const greenPts = cpuPlugRoute('b', 0, 3);
  vgpuCpuPlugBaseRefs[CPU_SWAP_PLUG_ORANGE]().points(orangePts);
  vgpuCpuPlugFlowRefs[CPU_SWAP_PLUG_ORANGE]().points(orangePts);
  vgpuCpuPlugBaseRefs[CPU_SWAP_PLUG_GREEN]().points(greenPts);
  vgpuCpuPlugFlowRefs[CPU_SWAP_PLUG_GREEN]().points(greenPts);

  const flowDash = cpuPlugFlowLineDash();
  for (const i of [CPU_SWAP_PLUG_ORANGE, CPU_SWAP_PLUG_GREEN] as const) {
    vgpuCpuPlugFlowRefs[i]().lineDash(flowDash);
    vgpuCpuPlugFlowRefs[i]().lineWidth(CPU_PLUG_FLOW_LINE_WIDTH);
    vgpuCpuPlugFlowRefs[i]().opacity(CPU_PLUG_FLOW_LAYER_OPACITY);
    vgpuCpuPlugFlowRefs[i]().lineDashOffset(0);
  }

  yield* all(
    vgpuCpuPlugBaseRefs[CPU_SWAP_PLUG_ORANGE]().end(1, 0.34, easeOutCubic),
    vgpuCpuPlugFlowRefs[CPU_SWAP_PLUG_ORANGE]().end(1, 0.34, easeOutCubic),
    vgpuCpuPlugBaseRefs[CPU_SWAP_PLUG_GREEN]().end(1, 0.34, easeOutCubic),
    vgpuCpuPlugFlowRefs[CPU_SWAP_PLUG_GREEN]().end(1, 0.34, easeOutCubic),
    vgpuCpuPcpuFillRefs[2]().fill('#FF6B35', 0.32, easeOutCubic),
    vgpuCpuPcpuFillRefs[3]().fill('#006B7A', 0.32, easeOutCubic),
    vgpuCpuBusJointRefs[CPU_SWAP_PLUG_ORANGE]().opacity(1, 0.22, easeOutCubic),
    vgpuCpuBusJointRefs[CPU_SWAP_PLUG_GREEN]().opacity(1, 0.22, easeOutCubic),
    loopFor(CPU_PLUG_FLOW_RECONNECT_SEC, function* () {
      yield* all(
        ...CPU_POST_SWAP_FLOW_PLUGS.map(i =>
          vgpuCpuPlugFlowRefs[i]().lineDashOffset(
            -CPU_PLUG_FLOW_DASH_CYCLE,
            CPU_PLUG_FLOW_STEP_SEC,
            linear,
          ),
        ),
      );
      for (const i of CPU_POST_SWAP_FLOW_PLUGS) {
        vgpuCpuPlugFlowRefs[i]().lineDashOffset(0);
      }
    }),
  );

  yield* beginSlide('virt-gpu-cpu-teal-off');
  yield* waitFor(VGPU_TIMELINE_PAD);

  yield* vgpuCpuHypervisor().scale(1.12, 0.18, easeOutBack);
  yield* vgpuCpuHypervisor().scale(1, 0.16, easeOutCubic);

  yield* all(
    vgpuCpuPlugBaseRefs[CPU_TEAL_PLUG_INDEX]().end(0, 0.3, easeOutCubic),
    vgpuCpuPlugFlowRefs[CPU_TEAL_PLUG_INDEX]().end(0, 0.3, easeOutCubic),
    vgpuCpuPlugFlowRefs[CPU_TEAL_PLUG_INDEX]().opacity(0, 0.18, easeOutCubic),
    vgpuCpuBusJointRefs[CPU_TEAL_PLUG_INDEX]().opacity(0, 0.18, easeOutCubic),
  );

  yield* beginSlide('virt-gpu-cpu-ram-b');
  yield* waitFor(VGPU_TIMELINE_PAD);

  const pktTealRam = cpuContextPacketPositions(CPU_TEAL_SAVE_PCPU, 0);
  vgpuCpuContextPackets[0]().fill(CPU_TEAL_VCPU_COLOR);
  vgpuCpuContextPackets[0]().x(pktTealRam.from[0]);
  vgpuCpuContextPackets[0]().y(pktTealRam.from[1]);
  vgpuCpuContextPackets[0]().opacity(1);
  yield* all(
    vgpuCpuContextPackets[0]().x(pktTealRam.to[0], 0.55, easeInOutCubic),
    vgpuCpuContextPackets[0]().y(pktTealRam.to[1], 0.55, easeInOutCubic),
    vgpuCpuPcpuFillRefs[CPU_TEAL_SAVE_PCPU]().fill('#FFFFFF', 0.4, easeOutCubic),
    vgpuCpuRam().scale(1.07, 0.22, easeOutBack),
  );
  yield* all(
    vgpuCpuContextPackets[0]().opacity(0, 0.15, easeOutCubic),
    vgpuCpuRam().scale(1, 0.14, easeOutCubic),
  );
  vgpuCpuContextPackets[0]().x(pktTealRam.from[0]);
  vgpuCpuContextPackets[0]().y(pktTealRam.from[1]);

  const pktCyanBack = cpuContextPacketPositionsFromRam(CPU_TEAL_SAVE_PCPU, 1);
  vgpuCpuContextPackets[1]().fill(CPU_VM_B_LIGHT_CYAN);
  vgpuCpuContextPackets[1]().x(pktCyanBack.from[0]);
  vgpuCpuContextPackets[1]().y(pktCyanBack.from[1]);
  vgpuCpuContextPackets[1]().opacity(1);
  yield* all(
    vgpuCpuContextPackets[1]().x(pktCyanBack.to[0], 0.55, easeInOutCubic),
    vgpuCpuContextPackets[1]().y(pktCyanBack.to[1], 0.55, easeInOutCubic),
    vgpuCpuRam().scale(1.06, 0.2, easeOutBack),
  );
  yield* all(
    vgpuCpuContextPackets[1]().opacity(0, 0.15, easeOutCubic),
    vgpuCpuRam().scale(1, 0.14, easeOutCubic),
    vgpuCpuPcpuFillRefs[CPU_TEAL_SAVE_PCPU]().fill(
      CPU_VM_B_LIGHT_CYAN,
      0.28,
      easeOutCubic,
    ),
  );
  vgpuCpuContextPackets[1]().x(pktCyanBack.from[0]);
  vgpuCpuContextPackets[1]().y(pktCyanBack.from[1]);

  yield* beginSlide('virt-gpu-cpu-cola-b');
  yield* waitFor(VGPU_TIMELINE_PAD);

  const vmBCyanPts = cpuPlugRoute('b', 1, 3);
  vgpuCpuPlugBaseRefs[CPU_VM_B_CYAN_PLUG_INDEX]().points(vmBCyanPts);
  vgpuCpuPlugFlowRefs[CPU_VM_B_CYAN_PLUG_INDEX]().points(vmBCyanPts);
  vgpuCpuPlugFlowRefs[CPU_VM_B_CYAN_PLUG_INDEX]().lineDash(flowDash);
  vgpuCpuPlugFlowRefs[CPU_VM_B_CYAN_PLUG_INDEX]().lineWidth(
    CPU_PLUG_FLOW_LINE_WIDTH,
  );
  vgpuCpuPlugFlowRefs[CPU_VM_B_CYAN_PLUG_INDEX]().opacity(
    CPU_PLUG_FLOW_LAYER_OPACITY,
  );
  vgpuCpuPlugFlowRefs[CPU_VM_B_CYAN_PLUG_INDEX]().lineDashOffset(0);

  yield* all(
    vgpuCpuPlugBaseRefs[CPU_VM_B_CYAN_PLUG_INDEX]().end(1, 0.34, easeOutCubic),
    vgpuCpuPlugFlowRefs[CPU_VM_B_CYAN_PLUG_INDEX]().end(1, 0.34, easeOutCubic),
    vgpuCpuBusJointRefs[CPU_VM_B_CYAN_PLUG_INDEX]().opacity(
      1,
      0.22,
      easeOutCubic,
    ),
    loopFor(CPU_PLUG_FLOW_RECONNECT_SEC, function* () {
      yield* all(
        ...CPU_POST_RESTORE_FLOW_PLUGS.map(i =>
          vgpuCpuPlugFlowRefs[i]().lineDashOffset(
            -CPU_PLUG_FLOW_DASH_CYCLE,
            CPU_PLUG_FLOW_STEP_SEC,
            linear,
          ),
        ),
      );
      for (const i of CPU_POST_RESTORE_FLOW_PLUGS) {
        vgpuCpuPlugFlowRefs[i]().lineDashOffset(0);
      }
    }),
  );

  yield* beginSlide('virt-gpu-cpu-rapido');
  yield* waitFor(VGPU_TIMELINE_PAD);

  vgpuSubtitle().text('GPU: miles de SM + 80 GB VRAM (HBM)');
  vgpuGpuCore().scale(0.92);
  vgpuGpuPlugFlow().lineDashOffset(0);
  const vram60Initial = gpuVramFillMetrics(GPU_VRAM_USED_GB);
  vgpuGpuVramFill().width(vram60Initial.width);
  vgpuGpuVramFill().x(vram60Initial.x);
  vgpuGpuVramFill().y(vram60Initial.y);
  vgpuGpuVramUsage().text(
    `${GPU_VRAM_USED_GB} / ${GPU_VRAM_CAPACITY_GB} GB en uso`,
  );
  yield* all(
    vgpuCpuPhase().opacity(0, 0.35, easeOutCubic),
    vgpuGpuPhase().opacity(1, 0.45, easeOutCubic),
    vgpuGpuCore().scale(1, 0.5, easeOutBack),
  );
  yield* waitFor(VGPU_TIMELINE_PAD);
  yield* loopFor(GPU_VM_PLUG_FLOW_SEC, function* () {
    yield* vgpuGpuPlugFlow().lineDashOffset(
      -CPU_PLUG_FLOW_DASH_CYCLE,
      CPU_PLUG_FLOW_STEP_SEC,
      linear,
    );
    vgpuGpuPlugFlow().lineDashOffset(0);
  });

  yield* beginSlide('virt-gpu-vgpu-vm2-tarea');
  yield* waitFor(VGPU_TIMELINE_PAD);
  vgpuSubtitle().text(
    `vGPU 2 quiere continuar una tarea · ${GPU_VRAM_VM2_TASK_GB} GB de VRAM`,
  );
  yield* all(
    vgpuGpuVm2().scale(1.07, 0.38, easeOutBack),
    vgpuGpuVm2Task().opacity(1, 0.32, easeOutCubic),
    vgpuGpuVm2Body().opacity(0.85, 0.32, easeOutCubic),
  );
  yield* waitFor(0.55);
  yield* vgpuGpuVm2().scale(1, 0.28, easeOutCubic);

  yield* beginSlide('virt-gpu-vgpu-arquitectura');
  yield* waitFor(VGPU_TIMELINE_PAD);

  vgpuSubtitle().text(
    'Analogía CPU: parecería que el estado (SM) va a RAM del host por PCIe',
  );
  vgpuGpuTransferPacketLabels[0]().text(GPU_PACKET_MB_LABEL);
  const pktGpuCtxRam = gpuTransferPacketRoute('sm-context-host');
  vgpuGpuTransferPackets[0]().x(pktGpuCtxRam.from[0]);
  vgpuGpuTransferPackets[0]().y(pktGpuCtxRam.from[1]);
  vgpuGpuTransferPackets[0]().opacity(1);
  yield* all(
    vgpuGpuTransferPackets[0]().x(
      pktGpuCtxRam.to[0],
      GPU_PACKET_MOVE_MB_SEC,
      easeInOutCubic,
    ),
    vgpuGpuTransferPackets[0]().y(
      pktGpuCtxRam.to[1],
      GPU_PACKET_MOVE_MB_SEC,
      easeInOutCubic,
    ),
  );
  yield* all(
    vgpuGpuTransferPackets[0]().opacity(0, 0.18, easeOutCubic),
    vgpuGpuRam().scale(1.05, 0.2, easeOutBack),
  );
  vgpuGpuTransferPackets[0]().x(pktGpuCtxRam.from[0]);
  vgpuGpuTransferPackets[0]().y(pktGpuCtxRam.from[1]);
  yield* vgpuGpuRam().scale(1, 0.14, easeOutCubic);
  yield* waitFor(VGPU_TIMELINE_PAD);

  yield* beginSlide('virt-gpu-vgpu-contexto-vram');
  yield* waitFor(VGPU_TIMELINE_PAD);
  vgpuSubtitle().text(
    'En GPU: el congelamiento va a VRAM (driver) — no hace falta RAM del host',
  );
  vgpuGpuTransferPacketLabels[0]().text(GPU_PACKET_FREEZE_LABEL);
  const pktGpuFreeze = gpuTransferPacketRoute('sm-context-vram');
  vgpuGpuTransferPackets[0]().x(pktGpuFreeze.from[0]);
  vgpuGpuTransferPackets[0]().y(pktGpuFreeze.from[1]);
  vgpuGpuTransferPackets[0]().opacity(1);
  yield* all(
    vgpuGpuTransferPackets[0]().x(
      pktGpuFreeze.to[0],
      GPU_PACKET_MOVE_MB_SEC,
      easeInOutCubic,
    ),
    vgpuGpuTransferPackets[0]().y(
      pktGpuFreeze.to[1],
      GPU_PACKET_MOVE_MB_SEC,
      easeInOutCubic,
    ),
    vgpuGpuCore().scale(1.02, GPU_PACKET_MOVE_MB_SEC * 0.45, easeOutCubic),
  );
  yield* all(
    vgpuGpuTransferPackets[0]().opacity(0, 0.18, easeOutCubic),
    vgpuGpuCore().scale(1, 0.2, easeOutCubic),
  );
  vgpuGpuTransferPackets[0]().x(pktGpuFreeze.from[0]);
  vgpuGpuTransferPackets[0]().y(pktGpuFreeze.from[1]);
  yield* waitFor(VGPU_TIMELINE_PAD);

  yield* beginSlide('virt-gpu-vgpu-vram-uso');
  yield* waitFor(VGPU_TIMELINE_PAD);

  vgpuSubtitle().text('vGPU 1 ya ocupa 60 GB de VRAM del perfil');

  yield* beginSlide('virt-gpu-vgpu-vram-20');
  yield* waitFor(VGPU_TIMELINE_PAD);

  vgpuSubtitle().text(
    `Sacar ${GPU_VRAM_PARTIAL_EVAC_GB} GB por PCIe (working set parcial, no todo el perfil)`,
  );
  const vramAfterEvac = gpuVramFillMetrics(
    GPU_VRAM_USED_GB - GPU_VRAM_PARTIAL_EVAC_GB,
  );
  const pktGpu20 = gpuTransferPacketRoute('vram-gb');
  vgpuGpuTransferPacketLabels[1]().text(GPU_PACKET_VRAM_20_LABEL);
  vgpuGpuTransferPackets[1]().x(pktGpu20.from[0]);
  vgpuGpuTransferPackets[1]().y(pktGpu20.from[1]);
  vgpuGpuTransferPackets[1]().opacity(1);
  vgpuGpuVramUsage().text(
    `${GPU_VRAM_USED_GB - GPU_VRAM_PARTIAL_EVAC_GB} / ${GPU_VRAM_CAPACITY_GB} GB en uso`,
  );
  yield* all(
    vgpuGpuTransferPackets[1]().x(
      pktGpu20.to[0],
      GPU_PACKET_MOVE_GB_SEC * 0.75,
      easeInOutCubic,
    ),
    vgpuGpuTransferPackets[1]().y(
      pktGpu20.to[1],
      GPU_PACKET_MOVE_GB_SEC * 0.75,
      easeInOutCubic,
    ),
    vgpuGpuVramFill().width(vramAfterEvac.width, 0.45, easeOutCubic),
    vgpuGpuVramFill().x(vramAfterEvac.x, 0.45, easeOutCubic),
  );
  yield* all(
    vgpuGpuTransferPackets[1]().opacity(0, 0.2, easeOutCubic),
    vgpuGpuRam().scale(1.06, 0.22, easeOutBack),
  );
  vgpuGpuTransferPackets[1]().x(pktGpu20.from[0]);
  vgpuGpuTransferPackets[1]().y(pktGpu20.from[1]);
  yield* vgpuGpuRam().scale(1, 0.16, easeOutCubic);
  yield* waitFor(VGPU_TIMELINE_PAD);

  yield* beginSlide('virt-gpu-vgpu-vm-swap');
  yield* waitFor(VGPU_TIMELINE_PAD);
  vgpuSubtitle().text(
    `Desconectar vGPU 1 · enchufar vGPU 2 · ${GPU_VRAM_VM2_TASK_GB} GB → VRAM`,
  );

  const vm2PlugPts = gpuVm2PlugRoute();
  vgpuGpuPlug2Base().points(vm2PlugPts);
  vgpuGpuPlug2Flow().points(vm2PlugPts);
  vgpuGpuPlug2Flow().lineDashOffset(0);
  vgpuGpuPlug2Flow().opacity(0.6);

  const vramGbAfterRamLoad =
    GPU_VRAM_USED_GB -
    GPU_VRAM_PARTIAL_EVAC_GB +
    GPU_VRAM_VM2_TASK_GB;
  const vramAfterRamLoad = gpuVramFillMetrics(vramGbAfterRamLoad);
  const pktRam40 = gpuTransferPacketRouteRamToVram();
  vgpuGpuTransferPacketLabels[1]().text(GPU_PACKET_VRAM_40_LABEL);

  yield* all(
    vgpuGpuPlugBase().end(0, 0.3, easeOutCubic),
    vgpuGpuPlugFlow().end(0, 0.3, easeOutCubic),
    vgpuGpuPlugFlow().opacity(0, 0.25, easeOutCubic),
    vgpuGpuBusJoint().opacity(0, 0.25, easeOutCubic),
    vgpuGpuVm1Body().fill(theme.white, 0.32, easeOutCubic),
    vgpuGpuVm1Body().opacity(0.55, 0.32, easeOutCubic),
    vgpuGpuVm1Body().lineWidth(2, 0.32, easeOutCubic),
    vgpuGpuVm1Label().y(0, 0.32, easeOutCubic),
    vgpuGpuVm1Port().opacity(0, 0.28, easeOutCubic),
    vgpuGpuVm1ActiveLabel().opacity(0, 0.28, easeOutCubic),
    vgpuGpuVm2Task().opacity(0, 0.22, easeOutCubic),
    vgpuGpuVm2Body().fill(theme.yellow, 0.35, easeOutCubic),
    vgpuGpuVm2Body().opacity(1, 0.35, easeOutCubic),
    vgpuGpuVm2Body().lineWidth(4, 0.35, easeOutCubic),
    vgpuGpuVm2Label().y(-8, 0.35, easeOutCubic),
    vgpuGpuVm2Port().opacity(1, 0.35, easeOutCubic),
    vgpuGpuVm2ActiveLabel().opacity(1, 0.35, easeOutCubic),
    vgpuGpuPlug2Base().end(1, 0.34, easeOutCubic),
    vgpuGpuPlug2Flow().end(1, 0.34, easeOutCubic),
    vgpuGpuBusJoint2().opacity(1, 0.28, easeOutCubic),
  );

  vgpuGpuTransferPackets[1]().x(pktRam40.from[0]);
  vgpuGpuTransferPackets[1]().y(pktRam40.from[1]);
  vgpuGpuTransferPackets[1]().opacity(1);
  yield* all(
    vgpuGpuTransferPackets[1]().x(
      pktRam40.to[0],
      GPU_PACKET_MOVE_GB_SEC * 0.9,
      easeInOutCubic,
    ),
    vgpuGpuTransferPackets[1]().y(
      pktRam40.to[1],
      GPU_PACKET_MOVE_GB_SEC * 0.9,
      easeInOutCubic,
    ),
  );
  vgpuGpuVramUsage().text(
    `${vramGbAfterRamLoad} / ${GPU_VRAM_CAPACITY_GB} GB en uso`,
  );
  yield* all(
    vgpuGpuVramFill().width(vramAfterRamLoad.width, 0.5, easeOutCubic),
    vgpuGpuVramFill().x(vramAfterRamLoad.x, 0.5, easeOutCubic),
    vgpuGpuVramFill().y(vramAfterRamLoad.y, 0.5, easeOutCubic),
  );
  yield* all(
    vgpuGpuTransferPackets[1]().opacity(0, 0.2, easeOutCubic),
    vgpuGpuRam().scale(1.05, 0.22, easeOutBack),
    loopFor(GPU_VM_PLUG_FLOW_SEC, function* () {
      yield* vgpuGpuPlug2Flow().lineDashOffset(
        -CPU_PLUG_FLOW_DASH_CYCLE,
        CPU_PLUG_FLOW_STEP_SEC,
        linear,
      );
      vgpuGpuPlug2Flow().lineDashOffset(0);
    }),
  );
  vgpuGpuTransferPackets[1]().x(pktRam40.from[0]);
  vgpuGpuTransferPackets[1]().y(pktRam40.from[1]);
  yield* vgpuGpuRam().scale(1, 0.16, easeOutCubic);

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={CONTENT_W} height={CONTENT_H}>
        <VgpuMigParadigmsSlide />
      </Layout>,
    );
  });
  setFooter(['nvidiaVgpuScheduling', 'nvidiaMigGuide', 'awsEksMig']);
  yield* beginSlide('virt-gpu-paradigms');

  const gpuConsolBefore = createRef<Txt>();
  const gpuConsolAfter = createRef<Txt>();
  const gpuConsolHost = createRef<Layout>();
  const gpuConsolChipRefs = GPU_CONSOL_APPS.map(() => createRef<Layout>());
  const gpuConsolUtilRefs = GPU_CONSOL_APPS.map(() => createRef<Txt>());
  const gpuConsolWorkloadRefs = GPU_CONSOL_APPS.map(() => createRef<Layout>());

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={CONTENT_W} height={CONTENT_H}>
        <ConsolidateGpuWorkloads
          beforeLabel={gpuConsolBefore}
          afterLabel={gpuConsolAfter}
          hostRef={gpuConsolHost}
          chipRefs={gpuConsolChipRefs}
          utilRefs={gpuConsolUtilRefs}
          workloadRefs={gpuConsolWorkloadRefs}
        />
      </Layout>,
    );
  });
  setFooter(['nvidiaMigBlog', 'nvidiaMigGuide']);
  yield* beginSlide('virt-gpu-mig-ejemplo');

  yield* beginSlide('virt-gpu-mig-ejemplo-unir');
  yield* all(
    gpuConsolBefore().opacity(0, 0.35),
    gpuConsolAfter().opacity(1, 0.45),
    gpuConsolHost().opacity(1, 0.55),
    gpuConsolHost().scale(1, 0.7, easeOutCubic),
    ...gpuConsolWorkloadRefs.map((r, i) =>
      all(
        r().x(GPU_CONSOL_END_X[i], 0.85, easeInOutCubic),
        r().y(GPU_CONSOL_END_Y, 0.85, easeInOutCubic),
      ),
    ),
    ...gpuConsolChipRefs.map(r => r().opacity(0, 0.5)),
    ...gpuConsolUtilRefs.map(r => r().opacity(0, 0.4)),
  );
  yield* beginSlide('virt-gpu-mig-ejemplo-despues');

  const rackTrainTitle = createRef<Txt>();
  const rackTrainStatus = createRef<Txt>();
  const rackTrainCount = createRef<Txt>();
  const rackTrainServer = createRef<Layout>();
  const rackTrainGpuCells = Array.from({length: TRAIN_GPU_COUNT}, () =>
    createRef<Rect>(),
  );
  const rackTrainPostActive = new Set(TRAIN_GPU_POST_ACTIVE);

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={CONTENT_W} height={CONTENT_H}>
        <GpuTrainingProblemSlide
          titleRef={rackTrainTitle}
          statusRef={rackTrainStatus}
          countRef={rackTrainCount}
          serverRef={rackTrainServer}
          cellRefs={rackTrainGpuCells}
        />
      </Layout>,
    );
  });
  setFooter(['nvidiaMigGuide', 'awsEksMig']);
  yield* beginSlide('virt-gpu-entrenamiento');
  yield* waitFor(VGPU_TIMELINE_PAD);
  rackTrainStatus().text('Entrenando · todas las GPUs activas');
  yield* all(
    ...rackTrainGpuCells.map((ref, i) =>
      all(
        ref().fill(
          TRAIN_GPU_BASE_HUES[i % TRAIN_GPU_BASE_HUES.length],
          0.55,
          easeOutCubic,
        ),
        ref().opacity(1, 0.55, easeOutCubic),
        ref().scale(1, 0.55, easeOutCubic),
      ),
    ),
  );

  let rackTrainTick = 0;
  yield* loopFor(TRAIN_GPU_LOOP_SEC, function* () {
    const tick = rackTrainTick;
    yield* all(
      ...rackTrainGpuCells.map((ref, i) => {
        const col = i % TRAIN_GPU_COLS;
        const row = Math.floor(i / TRAIN_GPU_COLS);
        const hueIdx =
          (tick * 3 + col + row * 2) % TRAIN_GPU_PULSE_HUES.length;
        const opacity = 0.55 + ((tick + col + row) % 5) * 0.11;
        const scale = 0.9 + ((tick + i) % 3) * 0.07;
        return all(
          ref().fill(TRAIN_GPU_PULSE_HUES[hueIdx], TRAIN_GPU_TICK_SEC, linear),
          ref().opacity(opacity, TRAIN_GPU_TICK_SEC, linear),
          ref().scale(scale, TRAIN_GPU_TICK_SEC, linear),
        );
      }),
    );
    rackTrainTick++;
  });
  for (const ref of rackTrainGpuCells) {
    ref().scale(1);
  }

  yield* beginSlide('virt-gpu-entrenamiento-post');
  rackTrainStatus().text(
    'Job terminado · casi todo el silicio en reposo · la instancia sigue reservada',
  );
  rackTrainCount().text(
    `${TRAIN_GPU_POST_ACTIVE.length} / ${TRAIN_GPU_COUNT} GPUs con trabajo útil`,
  );
  yield* all(
    ...rackTrainGpuCells.map((ref, i) =>
      rackTrainPostActive.has(i)
        ? all(
            ref().fill(theme.cyan, 0.45, easeOutCubic),
            ref().opacity(1, 0.45, easeOutCubic),
          )
        : all(
            ref().fill(TRAIN_GPU_EMPTY_FILL, 0.5, easeOutCubic),
            ref().opacity(0.22, 0.5, easeOutCubic),
          ),
    ),
  );

  const thunderTitle = createRef<Txt>();
  const thunderSubtitle = createRef<Txt>();
  const thunderStatus = createRef<Txt>();
  const thunderVm = createRef<Layout>();
  const thunderCuda = createRef<Layout>();
  const thunderAttachLine = createRef<Spline>();
  const thunderAttachFlow = createRef<Spline>();
  const thunderPoolGpus = Array.from({length: THUNDER_POOL_GPU_COUNT}, () =>
    createRef<Rect>(),
  );
  const thunderPoolLabels = Array.from({length: THUNDER_POOL_GPU_COUNT}, () =>
    createRef<Txt>(),
  );

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={CONTENT_W} height={CONTENT_H}>
        <ThunderComputeSlide
          titleRef={thunderTitle}
          subtitleRef={thunderSubtitle}
          statusRef={thunderStatus}
          vmRef={thunderVm}
          cudaRef={thunderCuda}
          attachLineRef={thunderAttachLine}
          attachFlowRef={thunderAttachFlow}
          poolGpuRefs={thunderPoolGpus}
          poolGpuLabelRefs={thunderPoolLabels}
        />
      </Layout>,
    );
  });
  setFooter(['thunderComputeGpuTcp', 'nvidiaMigGuide']);
  yield* beginSlide('virt-gpu-thunder-compute');

  thunderAttachFlow().lineDashOffset(0);
  thunderPoolGpus[0]().fill(theme.cyan);
  thunderPoolLabels[0]().text('GPU 1 · en uso');
  yield* loopFor(2.2, function* () {
    yield* thunderAttachFlow().lineDashOffset(
      -CPU_PLUG_FLOW_DASH_CYCLE,
      CPU_PLUG_FLOW_STEP_SEC,
      linear,
    );
    thunderAttachFlow().lineDashOffset(0);
  });

  yield* beginSlide('virt-gpu-thunder-idle');
  thunderSubtitle().text(
    'Tras entrenar: lees logs / ajustas código → la GPU puede volver al pool sin pagar chip ocioso',
  );
  thunderStatus().text(
    'Idle: suelta la GPU · otro workload del pool puede usarla · ~10–20 ms al volver a reclamar',
  );
  yield* all(
    thunderAttachLine().end(0, 0.35, easeOutCubic),
    thunderAttachFlow().end(0, 0.35, easeOutCubic),
    thunderAttachFlow().opacity(0, 0.3, easeOutCubic),
    thunderVm().opacity(0.72, 0.35, easeOutCubic),
    thunderPoolGpus[0]().fill('#2d2d2d', 0.4, easeOutCubic),
    thunderPoolGpus[1]().fill(theme.cyan, 0.4, easeOutCubic),
  );
  thunderPoolLabels[0]().text('GPU 1 · libre');
  thunderPoolLabels[1]().text('GPU 2 · otro job');
  yield* beginSlide('virt-gpu-listo');
}