import {Circle, Layout, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {Paso0ChapterTitleCard} from '../components/Paso0ChapterTitleCard';
import {TcoPieChart} from '../components/TcoPieChart';
import {tcoSlicesWithAngles} from '../data/tcoSlices';
import {theme} from '../theme';
import {servidorPueSection} from './sections/paso0-servidor-pue';
import {createPaso0Shell, loadPaso0Fonts} from './shared/paso0-shell';

export default makeScene2D(function* (view) {
  yield* loadPaso0Fonts();
  const ctx = createPaso0Shell(view);
  const {scrollTo, setFooter, contentW, contentH} = ctx;

  const infraChapterCard = createRef<Layout>();
  const infraChapterTitle = createRef<Txt>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout layout={false} width={contentW} height={contentH}>
        <Paso0ChapterTitleCard
          cardRef={infraChapterCard}
          titleRef={infraChapterTitle}
          title="La infraestructura"
          kicker="Parte 3"
          tagline="Costo del servidor, electricidad, PUE y consolidación"
        />
      </Layout>,
    );
  });
  setFooter([]);
  yield* all(
    infraChapterCard().opacity(1, 0.55, easeOutCubic),
    infraChapterCard().scale(1, 0.55, easeOutBack),
  );
  yield* beginSlide('infraestructura-inicio');

  const tcoSlices = tcoSlicesWithAngles();
  const pieSliceRefs = tcoSlices.map(() => createRef<Circle>());
  const questionTxt = createRef<Txt>();
  const serverLeadTxt = createRef<Txt>();
  const pieWrap = createRef<Layout>();
  const stage = createRef<Layout>();

  yield* scrollTo(panel => {
    panel.add(
      <Layout ref={stage} layout={false} width={contentW} height={contentH}>
        <Txt
          ref={questionTxt}
          text={'¿Cuánto cuesta correr un servidor?'}
          fontFamily={theme.bodyFont}
          fontSize={52}
          fontWeight={700}
          fill={theme.black}
          textAlign="center"
          x={0}
          y={0}
        />
        <Txt
          ref={serverLeadTxt}
          text="Ejemplo: compra ~$5,000 · TCO ~5 años"
          fontFamily={theme.bodyFont}
          fontSize={26}
          fontWeight={500}
          fill={theme.grey}
          textAlign="center"
          x={0}
          y={48}
        />
      </Layout>,
    );
  });
  setFooter(['ieeeTco', 'berkeley2024', 'microsoftTco', 'doe']);
  yield* beginSlide('servidor-costo');

  stage().add(
    <Layout ref={pieWrap} layout={false} opacity={0} x={0} y={80}>
      <TcoPieChart slices={tcoSlices} sliceRefs={pieSliceRefs} />
    </Layout>,
  );

  const pieDuration = 1;
  yield* all(
    questionTxt().y(-340, pieDuration, easeOutCubic),
    serverLeadTxt().y(-292, pieDuration, easeOutCubic),
    pieWrap().opacity(1, pieDuration * 0.85, easeOutCubic),
    pieWrap().y(40, pieDuration, easeOutCubic),
    ...tcoSlices.map((slice, i) =>
      pieSliceRefs[i]().endAngle(slice.endAngle, pieDuration, easeOutCubic),
    ),
  );
  yield* beginSlide('servidor-costo-listo');

  yield* servidorPueSection(ctx);
});
