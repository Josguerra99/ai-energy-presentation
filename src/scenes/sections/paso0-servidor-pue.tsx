import {Circle, Latex, Layout, Line, Rect, Txt} from '@motion-canvas/2d';
import {
  all,
  beginSlide,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  type ThreadGenerator,
} from '@motion-canvas/core';
import {
  ElectricityBarDiagram,
  EXAMPLE_PUE,
  facilityLoads,
  IT_KW,
  kwHeight,
  TOTAL_KW,
} from '../../components/ElectricityBarDiagram';
import {PueTrendChart} from '../../components/PueTrendChart';
import {
  COMPARE_A,
  COMPARE_B,
  PueUtilizationCompare,
} from '../../components/PueUtilizationCompare';
import {
  ConsolidateWorkloads,
  CONSOL_APPS,
  CONSOL_END_X,
  CONSOL_END_Y,
} from '../../components/ConsolidateWorkloads';
import {DifferentOsSlide} from '../../components/DifferentOsSlide';
import {HypervisorVirtualizationSlide} from '../../components/VirtualizationSlides';
import {pueTrend} from '../../data/pueTrend';
import {theme} from '../../theme';
import type {Paso0SceneContext} from './paso0-scene-context';

/** TCO → electricidad sitio, PUE, consolidación, SO, hypervisor (acto servidor). */
export function* servidorPueSection(ctx: Paso0SceneContext): ThreadGenerator {
  const {scrollTo, setFooter, contentW, contentH} = ctx;

  const itBar = createRef<Rect>();
  const itLabel = createRef<Txt>();
  const segmentRefs = facilityLoads.map(() => createRef<Rect>());
  const labelRefs = facilityLoads.map(() => createRef<Txt>());
  const totalLabel = createRef<Txt>();
  const pueBlock = createRef<Layout>();
  const doeBench = createRef<Layout>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <ElectricityBarDiagram
          itBar={itBar}
          itLabel={itLabel}
          segmentRefs={segmentRefs}
          labelRefs={labelRefs}
          totalLabel={totalLabel}
        />
        <Layout ref={pueBlock} layout={false} x={340} y={0} opacity={0}>
          <Txt
            text="PUE - Power Usage Effectiveness"
            fontFamily={theme.pixelFont}
            fontSize={28}
            fill={theme.black}
            offsetX={-1}
            x={-220}
            y={-150}
          />
          <Latex
            tex="{\mathrm{PUE}} = \dfrac{\text{Total facility energy}}{\text{IT equipment energy}}"
            fill={theme.black}
            fontSize={28}
            x={-20}
            y={-30}
          />
          <Latex
            tex={`{\\mathrm{PUE}} = \\dfrac{${TOTAL_KW}\\,\\mathrm{kW}}{${IT_KW}\\,\\mathrm{kW}} = ${EXAMPLE_PUE.toFixed(2)}`}
            fill={theme.black}
            fontSize={26}
            x={-40}
            y={100}
          />
          <Layout ref={doeBench} layout={false} x={-40} y={200} opacity={0}>
            <Txt
              text="DOE · 1.6 estándar · 1.4 bueno · 1.1 mejor"
              fontFamily={theme.pixelFont}
              fontSize={26}
              fill={theme.black}
              textAlign="center"
            />
            <Txt
              text="PUE mide la infraestructura de soporte, no la eficiencia computacional."
              fontFamily={theme.bodyFont}
              fontSize={20}
              fill={theme.grey}
              textAlign="center"
              y={36}
            />
          </Layout>
        </Layout>
      </Layout>,
    );
  });
  setFooter(['doe', 'uptime2024']);
  yield* beginSlide('electricidad');

  yield* all(
    itBar().opacity(1, 0.01),
    itBar().height(kwHeight(IT_KW), 0.7, easeOutCubic),
    itLabel().opacity(1, 0.5),
  );
  yield* beginSlide('electricidad-it');

  for (let i = 0; i < facilityLoads.length; i++) {
    yield* all(
      segmentRefs[i]().opacity(1, 0.01),
      segmentRefs[i]().height(kwHeight(facilityLoads[i].kw), 0.35, easeOutCubic),
      labelRefs[i]().opacity(1, 0.3),
    );
  }
  yield* totalLabel().opacity(1, 0.45);
  yield* beginSlide('electricidad-barra');

  yield* pueBlock().opacity(1, 0.7, easeOutCubic);
  yield* beginSlide('pue');

  yield* doeBench().opacity(1, 0.5, easeOutCubic);
  yield* beginSlide('pue-doe');

  const pueLine = createRef<Line>();
  const puePointRefs = pueTrend.map(() => createRef<Circle>());
  const pueLabelRefs = pueTrend.map(() => createRef<Txt>());
  const noteRef = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <PueTrendChart
          lineRef={pueLine}
          pointRefs={puePointRefs}
          labelRefs={pueLabelRefs}
          noteRef={noteRef}
        />
      </Layout>,
    );
  });
  setFooter(['uptime2024', 'uptime2025', 'uptime2026']);
  yield* beginSlide('pue-tendencia');

  yield* pueLine().end(1, 1.6, easeOutCubic);
  for (let i = 0; i < pueTrend.length; i++) {
    yield* all(
      puePointRefs[i]().scale(1, 0.2, easeOutCubic),
      pueLabelRefs[i]().opacity(pueTrend[i].label ? 1 : 0, 0.2),
    );
  }
  yield* beginSlide('pue-tendencia-serie');

  yield* noteRef().opacity(1, 0.6);
  yield* beginSlide('pue-tendencia-nota');

  const countA = createRef<Txt>();
  const countB = createRef<Txt>();
  const gridA = createRef<Layout>();
  const gridB = createRef<Layout>();
  const statsA = createRef<Layout>();
  const statsB = createRef<Layout>();
  const fillA = Array.from({length: COMPARE_A.servers}, () => createRef<Rect>());
  const fillB = Array.from({length: COMPARE_B.servers}, () => createRef<Rect>());
  const winnerBox = createRef<Rect>();
  const winnerBadge = createRef<Layout>();
  const winnerChip = createRef<Rect>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <PueUtilizationCompare
          countA={countA}
          countB={countB}
          gridA={gridA}
          gridB={gridB}
          statsA={statsA}
          statsB={statsB}
          fillA={fillA}
          fillB={fillB}
          winnerBox={winnerBox}
          winnerBadge={winnerBadge}
          winnerChip={winnerChip}
        />
      </Layout>,
    );
  });
  setFooter(['doe', 'uptime2024']);
  yield* beginSlide('pue-vs-util');

  yield* all(
    countA().opacity(1, 0.55),
    countB().opacity(1, 0.55),
    gridA().opacity(1, 0.65),
    gridB().opacity(1, 0.65),
  );
  yield* beginSlide('pue-vs-util-servidores');

  const fillH_A = (COMPARE_A.gridCell - 4) * (COMPARE_A.cpuPct / 100);
  const fillH_B = (COMPARE_B.gridCell - 4) * (COMPARE_B.cpuPct / 100);
  yield* all(
    statsA().opacity(1, 0.55),
    statsB().opacity(1, 0.55),
    ...fillA.map(r => r().height(fillH_A, 0.7, easeOutCubic)),
    ...fillB.map(r => r().height(fillH_B, 0.7, easeOutCubic)),
  );
  yield* beginSlide('pue-vs-util-potencia');

  yield* all(
    winnerBox().stroke(theme.cyan, 0.45),
    winnerBox().lineWidth(6, 0.45),
    winnerBadge().opacity(1, 0.5),
    winnerChip().fill(theme.cyan, 0.45),
  );
  yield* beginSlide('pue-vs-util-ganador');

  const beforeLabel = createRef<Txt>();
  const afterLabel = createRef<Txt>();
  const hostRef = createRef<Layout>();
  const chassisRefs = CONSOL_APPS.map(() => createRef<Layout>());
  const utilRefs = CONSOL_APPS.map(() => createRef<Txt>());
  const serverRefs = CONSOL_APPS.map(() => createRef<Layout>());
  const consolPunch = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <ConsolidateWorkloads
          beforeLabel={beforeLabel}
          afterLabel={afterLabel}
          hostRef={hostRef}
          chassisRefs={chassisRefs}
          utilRefs={utilRefs}
          serverRefs={serverRefs}
          punchRef={consolPunch}
        />
      </Layout>,
    );
  });
  setFooter(['doe']);
  yield* beginSlide('consolidar');

  yield* all(
    beforeLabel().opacity(0, 0.35),
    afterLabel().opacity(1, 0.45),
    hostRef().opacity(1, 0.55),
    hostRef().scale(1, 0.7, easeOutCubic),
    ...serverRefs.map((r, i) =>
      all(
        r().x(CONSOL_END_X[i], 0.85, easeInOutCubic),
        r().y(CONSOL_END_Y, 0.85, easeInOutCubic),
      ),
    ),
    ...chassisRefs.map(r => r().opacity(0, 0.5)),
    ...utilRefs.map(r => r().opacity(0, 0.4)),
  );
  yield* beginSlide('consolidar-despues');

  yield* consolPunch().opacity(1, 0.5);
  yield* beginSlide('consolidar-punch');

  const osClash = createRef<Layout>();
  const osPunch = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <DifferentOsSlide clashRef={osClash} punchRef={osPunch} />
      </Layout>,
    );
  });
  setFooter(['doe']);
  yield* beginSlide('os-conflicto');

  yield* osClash().opacity(1, 0.45);
  yield* beginSlide('os-conflicto-neq');

  yield* osPunch().opacity(1, 0.5);
  yield* beginSlide('os-conflicto-virt');

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <HypervisorVirtualizationSlide />
      </Layout>,
    );
  });
  setFooter(['nistHypervisor125a', 'nistVmGlossary']);
  yield* beginSlide('virt-hypervisor');
  yield* beginSlide('virt-hypervisor-listo');
}
