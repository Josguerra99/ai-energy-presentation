import {Layout, Rect, Txt} from '@motion-canvas/2d';
import {theme} from '../theme';
import {formatSourceLine} from '../sources';

/** Pie de fuentes: siempre muestra la barra; el texto solo si hay IDs. */
export function SourceFooter({sourceIds}: {sourceIds: string[]}) {
  const text = sourceIds.length ? `FUENTES: ${formatSourceLine(sourceIds)}` : '';

  return (
    <Layout layout direction="column" gap={10} width={'100%'} height={48}>
      <Rect width={'100%'} height={2} fill={theme.black} />
      <Txt
        text={text}
        fontFamily={theme.bodyFont}
        fontSize={18}
        fontWeight={500}
        fill={theme.grey}
        textAlign="left"
        width={'100%'}
        opacity={sourceIds.length ? 1 : 0}
      />
    </Layout>
  );
}
