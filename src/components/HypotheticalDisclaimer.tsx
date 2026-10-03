import {Txt} from '@motion-canvas/2d';
import {theme} from '../theme';

/** Disclaimer para cifras ilustrativas en diapositivas. */
export function HypotheticalDisclaimer({
  x = 0,
  y = 0,
  fontSize = 18,
}: {
  x?: number;
  y?: number;
  fontSize?: number;
}) {
  return (
    <Txt
      text="(ejemplo simplificado - valores hipotéticos)"
      fontFamily={theme.bodyFont}
      fontSize={fontSize}
      fill={theme.grey}
      textAlign="center"
      x={x}
      y={y}
    />
  );
}
