import {Layout, Rect, Txt} from '@motion-canvas/2d';
import {theme} from '../theme';

const LLAMA_ROWS: {model: string; hours: string; highlight?: boolean}[] = [
  {model: 'Llama 3.1 8B', hours: '1.46 M'},
  {model: 'Llama 3.1 70B', hours: '7.0 M'},
  {model: 'Llama 3.1 405B', hours: '30.84 M', highlight: true},
];

const COST_ROWS = [
  {model: 'GPT-3', cost: '~$4.3 M'},
  {model: 'Llama 2 70B', cost: '~$3.9 M'},
  {model: 'GPT-4', cost: '~$78 M'},
  {model: 'Gemini Ultra', cost: '~$191 M'},
] as const;

/**
 * Escala real del entrenamiento: GPU-hours Llama 3.1 + costos estimados $.
 */
export function TrainingCostsSlide() {
  return (
    <Layout layout={false} width={'100%'} height={'100%'}>
      <Txt
        text="Eso, pero a escala industrial"
        fontFamily={theme.pixelFont}
        fontSize={56}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-380}
      />
      <Txt
        text="Una sola ronda es barata. Entrenar frontier no."
        fontFamily={theme.bodyFont}
        fontSize={28}
        fontWeight={500}
        fill={theme.black}
        textAlign="center"
        x={0}
        y={-310}
      />

      {/* Panel Llama */}
      <Layout layout={false} x={-420} y={40}>
        <Rect width={760} height={520} fill={theme.black} x={6} y={6} />
        <Rect
          width={760}
          height={520}
          fill={theme.yellow}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          text="EJEMPLO: Llama 3.1 (Meta)"
          fontFamily={theme.pixelFont}
          fontSize={36}
          fill={theme.black}
          x={0}
          y={-210}
        />
        <Txt
          text="405B parámetros · >15 billones de tokens · >16,000 H100"
          fontFamily={theme.bodyFont}
          fontSize={22}
          fill={theme.black}
          x={0}
          y={-155}
        />
        <Txt
          text="GPU-hours (H100)"
          fontFamily={theme.bodyFont}
          fontSize={22}
          fontWeight={700}
          fill={theme.grey}
          x={0}
          y={-100}
        />
        {LLAMA_ROWS.map((row, i) => (
          <Layout key={row.model} layout={false} y={-40 + i * 70}>
            <Rect
              width={680}
              height={56}
              fill={row.highlight ? theme.cyan : theme.white}
              stroke={theme.black}
              lineWidth={2}
            />
            <Txt
              text={row.model}
              fontFamily={theme.bodyFont}
              fontSize={26}
              fontWeight={row.highlight ? 700 : 500}
              fill={theme.black}
              x={-200}
            />
            <Txt
              text={row.hours}
              fontFamily={theme.bodyFont}
              fontSize={26}
              fontWeight={700}
              fill={theme.black}
              x={220}
            />
          </Layout>
        ))}
        <Txt
          text="30.84 M h × 700 W ≈ 21.6 GWh\n(orden de magnitud con TDP, no factura exacta)"
          fontFamily={theme.bodyFont}
          fontSize={18}
          fill={theme.grey}
          textAlign="center"
          x={0}
          y={200}
        />
      </Layout>

      {/* Panel costos */}
      <Layout layout={false} x={420} y={40}>
        <Rect width={720} height={520} fill={theme.black} x={6} y={6} />
        <Rect
          width={720}
          height={520}
          fill={theme.yellow}
          stroke={theme.black}
          lineWidth={theme.border}
        />
        <Txt
          text="¿CUÁNTO DINERO?"
          fontFamily={theme.pixelFont}
          fontSize={36}
          fill={theme.black}
          x={0}
          y={-210}
        />
        <Txt
          text="Estimaciones cloud (Stanford AI Index / Epoch)"
          fontFamily={theme.bodyFont}
          fontSize={20}
          fill={theme.grey}
          x={0}
          y={-155}
        />
        {COST_ROWS.map((row, i) => (
          <Layout key={row.model} layout={false} y={-70 + i * 70}>
            <Txt
              text={row.model}
              fontFamily={theme.bodyFont}
              fontSize={28}
              fontWeight={500}
              fill={theme.black}
              x={-160}
            />
            <Txt
              text={row.cost}
              fontFamily={theme.bodyFont}
              fontSize={28}
              fontWeight={700}
              fill={theme.black}
              x={160}
            />
          </Layout>
        ))}
        <Txt
          text="No son facturas internas de OpenAI/Google.\nEl hardware se reutiliza: comprarlo ≠ costo de entrenar."
          fontFamily={theme.bodyFont}
          fontSize={18}
          fill={theme.grey}
          textAlign="center"
          x={0}
          y={200}
        />
      </Layout>
    </Layout>
  );
}
