import {Layout, Rect, Txt} from '@motion-canvas/2d';
import {theme} from '../theme';

/** Entrenamiento: cómputo publicado y costo (reportado o cloud-equivalente). */
const TRAIN_ROWS = [
  {
    model: 'GPT-3 175B',
    when: '2020',
    hw: 'V100 (cluster)',
    compute: '3.14×10²³ FLOP',
    cost: 'no publicado (~$4M est.)',
  },
  {
    model: 'BLOOM 176B',
    when: '2022',
    hw: '384× A100 80GB',
    compute: '~1.16 M GPU-h',
    cost: '$2–5 M cloud-equiv.',
  },
  {
    model: 'Llama 2 70B',
    when: '2023',
    hw: 'A100 80GB',
    compute: '1.72 M GPU-h',
    cost: 'Meta no publica $',
  },
  {
    model: 'Llama 3.1 405B',
    when: '2024',
    hw: '>16 000 H100',
    compute: '30.84 M H100-h',
    cost: 'cloud-equiv., no factura',
    highlight: true,
  },
  {
    model: 'DeepSeek-V3',
    when: '2024',
    hw: '2 048× H800',
    compute: '2.79 M GPU-h',
    cost: '~$5.6 M cómputo*',
  },
] as const;

/** Precio API: 1 000 tokens entrada + 1 000 salida (lo que nos cobran). */
const PROMPT_ROWS = [
  {model: 'Gemini 2.5 Flash', perChat: '$0.0028', x100: '$0.28'},
  {model: 'GPT-5.4 mini', perChat: '$0.0053', x100: '$0.53'},
  {model: 'GPT-5.4', perChat: '$0.0175', x100: '$1.75', highlight: true},
  {model: 'Claude Sonnet 4.6', perChat: '$0.0180', x100: '$1.80'},
] as const;

function Panel({
  x,
  y,
  w,
  h,
  fill = theme.yellow,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
  children?: unknown;
}) {
  return (
    <Layout layout={false} x={x} y={y}>
      <Rect width={w} height={h} fill={theme.black} x={6} y={6} />
      <Rect
        width={w}
        height={h}
        fill={fill}
        stroke={theme.black}
        lineWidth={theme.border}
      />
      {children}
    </Layout>
  );
}

/** Slide 1: costos de entrenamiento a escala industrial. */
export function LlmTrainingCostSlide() {
  return (
    <Layout layout={false} width={'100%'} height={'100%'}>
      <Txt
        text="A escala industrial: entrenar"
        fontFamily={theme.pixelFont}
        fontSize={56}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-380}
      />
      <Txt
        text="Cómputo publicado · costo reportado o equivalente cloud (no siempre la factura real)"
        fontFamily={theme.bodyFont}
        fontSize={24}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-310}
      />

      <Panel x={0} y={20} w={1500} h={520}>
        <Txt
          text="MODELO"
          fontFamily={theme.bodyFont}
          fontSize={18}
          fontWeight={700}
          fill={theme.grey}
          x={-620}
          y={-200}
        />
        <Txt
          text="AÑO"
          fontFamily={theme.bodyFont}
          fontSize={18}
          fontWeight={700}
          fill={theme.grey}
          x={-320}
          y={-200}
        />
        <Txt
          text="HARDWARE"
          fontFamily={theme.bodyFont}
          fontSize={18}
          fontWeight={700}
          fill={theme.grey}
          x={-80}
          y={-200}
        />
        <Txt
          text="CÓMPUTO"
          fontFamily={theme.bodyFont}
          fontSize={18}
          fontWeight={700}
          fill={theme.grey}
          x={220}
          y={-200}
        />
        <Txt
          text="COSTO"
          fontFamily={theme.bodyFont}
          fontSize={18}
          fontWeight={700}
          fill={theme.grey}
          x={520}
          y={-200}
        />
        {TRAIN_ROWS.map((row, i) => (
          <Layout key={row.model} layout={false} y={-140 + i * 72}>
            <Rect
              width={1420}
              height={58}
              fill={'highlight' in row && row.highlight ? theme.cyan : theme.white}
              stroke={theme.black}
              lineWidth={2}
              opacity={0.95}
            />
            <Txt
              text={row.model}
              fontFamily={theme.bodyFont}
              fontSize={24}
              fontWeight={700}
              fill={theme.black}
              x={-620}
            />
            <Txt
              text={row.when}
              fontFamily={theme.bodyFont}
              fontSize={22}
              fill={theme.black}
              x={-320}
            />
            <Txt
              text={row.hw}
              fontFamily={theme.bodyFont}
              fontSize={20}
              fill={theme.black}
              x={-80}
            />
            <Txt
              text={row.compute}
              fontFamily={theme.bodyFont}
              fontSize={20}
              fontWeight={600}
              fill={theme.black}
              x={220}
            />
            <Txt
              text={row.cost}
              fontFamily={theme.bodyFont}
              fontSize={20}
              fontWeight={700}
              fill={theme.black}
              x={520}
            />
          </Layout>
        ))}
        <Txt
          text="* DeepSeek: costo de cómputo según autores ($2/H800-h); no incluye I+D ni hardware propio.\nLlama 3.1: Meta posee clusters — alquiler cloud ≠ lo que pagó Meta."
          fontFamily={theme.bodyFont}
          fontSize={17}
          fill={theme.grey}
          textAlign="center"
          x={0}
          y={210}
        />
      </Panel>
    </Layout>
  );
}

/** Slide 2: costo por prompt (precio API al cliente). */
export function LlmPromptCostSlide() {
  return (
    <Layout layout={false} width={'100%'} height={'100%'}>
      <Txt
        text="¿Cuánto cuesta un prompt?"
        fontFamily={theme.pixelFont}
        fontSize={56}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-380}
      />
      <Txt
        text="Precio que nos cobran los proveedores · ejemplo: 1 000 tokens in + 1 000 out"
        fontFamily={theme.bodyFont}
        fontSize={26}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-310}
      />

      <Panel x={0} y={30} w={1100} h={480}>
        <Txt
          text="MODELO"
          fontFamily={theme.bodyFont}
          fontSize={20}
          fontWeight={700}
          fill={theme.grey}
          x={-380}
          y={-180}
        />
        <Txt
          text="1 CONVERSACIÓN"
          fontFamily={theme.bodyFont}
          fontSize={20}
          fontWeight={700}
          fill={theme.grey}
          x={80}
          y={-180}
        />
        <Txt
          text="× 100"
          fontFamily={theme.bodyFont}
          fontSize={20}
          fontWeight={700}
          fill={theme.grey}
          x={320}
          y={-180}
        />
        {PROMPT_ROWS.map((row, i) => (
          <Layout key={row.model} layout={false} y={-100 + i * 78}>
            <Rect
              width={980}
              height={64}
              fill={'highlight' in row && row.highlight ? theme.cyan : theme.white}
              stroke={theme.black}
              lineWidth={2}
            />
            <Txt
              text={row.model}
              fontFamily={theme.bodyFont}
              fontSize={26}
              fontWeight={600}
              fill={theme.black}
              x={-380}
            />
            <Txt
              text={row.perChat}
              fontFamily={theme.bodyFont}
              fontSize={28}
              fontWeight={700}
              fill={theme.black}
              x={80}
            />
            <Txt
              text={row.x100}
              fontFamily={theme.bodyFont}
              fontSize={28}
              fontWeight={700}
              fill={theme.black}
              x={320}
            />
          </Layout>
        ))}
        <Txt
          text="≈ $0.003 – $0.02 por chat corto · precio ≠ costo energético interno del proveedor"
          fontFamily={theme.bodyFont}
          fontSize={22}
          fontWeight={600}
          fill={theme.black}
          textAlign="center"
          x={0}
          y={200}
        />
      </Panel>

      <Layout layout={false} x={620} y={80}>
        <Rect width={380} height={360} fill={theme.black} x={4} y={4} />
        <Rect
          width={380}
          height={360}
          fill={theme.white}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          text="Ojo"
          fontFamily={theme.pixelFont}
          fontSize={32}
          fill={theme.black}
          y={-130}
        />
        <Txt
          text={
            'No sabemos cuánto\nles cuesta a ellos\nejecutar ese prompt.\n\nSolo vemos\nla factura API.'
          }
          fontFamily={theme.bodyFont}
          fontSize={22}
          fontWeight={500}
          fill={theme.black}
          textAlign="center"
          lineHeight={32}
          y={20}
        />
      </Layout>
    </Layout>
  );
}

/** Slide 3: entrenamiento vs inferencia + escala. */
export function LlmCostCompareScaleSlide() {
  return (
    <Layout layout={false} width={'100%'} height={'100%'}>
      <Txt
        text="Dos escalas distintas"
        fontFamily={theme.pixelFont}
        fontSize={56}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-380}
      />
      <Txt
        text="Entrenar una vez · usar millones de veces"
        fontFamily={theme.bodyFont}
        fontSize={28}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-310}
      />

      <Panel x={-400} y={40} w={720} h={500} fill={theme.yellow}>
        <Txt
          text="ENTRENAMIENTO"
          fontFamily={theme.pixelFont}
          fontSize={36}
          fill={theme.black}
          y={-190}
        />
        <Txt
          text="Millones – decenas de millones $"
          fontFamily={theme.bodyFont}
          fontSize={28}
          fontWeight={700}
          fill={theme.black}
          y={-120}
        />
        <Txt
          text={
            '· Una (o pocas) corridas enormes\n· Millones de GPU-h\n· Llama 3.1 familia: 39.3 M H100-h\n· Miles de GPUs en paralelo\n  → semanas, no siglos'
          }
          fontFamily={theme.bodyFont}
          fontSize={22}
          fill={theme.black}
          lineHeight={36}
          x={-20}
          y={30}
        />
      </Panel>

      <Panel x={400} y={40} w={720} h={500} fill={theme.cyan}>
        <Txt
          text="INFERENCIA (API)"
          fontFamily={theme.pixelFont}
          fontSize={36}
          fill={theme.black}
          y={-190}
        />
        <Txt
          text="Milésimas de dólar por prompt"
          fontFamily={theme.bodyFont}
          fontSize={28}
          fontWeight={700}
          fill={theme.black}
          y={-120}
        />
        <Txt
          text={
            '· Cada pregunta es barata\n· Pero se repite × millones / día\n· El impacto total = uso × escala\n· Para energía: importa el volumen,\n  no solo el precio de una llamada'
          }
          fontFamily={theme.bodyFont}
          fontSize={22}
          fill={theme.black}
          lineHeight={36}
          x={-20}
          y={30}
        />
      </Panel>

      <Txt
        text="Precio API  ≠  costo computacional  ≠  costo energético"
        fontFamily={theme.pixelFont}
        fontSize={32}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={320}
      />
    </Layout>
  );
}
