import {Img, Layout, Rect, Txt} from '@motion-canvas/2d';
import llamaLogo from '../assets/llama-logo.png';
import {theme} from '../theme';

/** Tamaño nativo del PNG en `src/assets/llama-logo.png`. */
const LOGO_SRC_W = 82;
const LOGO_SRC_H = 100;
const LOGO_SCALE = 1.15;

type LlamaBrandLogoProps = {
  x?: number;
  y?: number;
  subtitle: string;
};

/** Marco pixel + PNG Llama tal cual (sin recortes ni filtros). */
export function LlamaBrandLogo({x = 0, y = 0, subtitle}: LlamaBrandLogoProps) {
  const logoW = LOGO_SRC_W * LOGO_SCALE;
  const logoH = LOGO_SRC_H * LOGO_SCALE;
  const frameW = Math.max(208, logoW + 48);
  const frameH = logoH + 130;

  return (
    <Layout layout={false} x={x} y={y}>
      <Rect width={frameW} height={frameH} fill={theme.black} x={5} y={5} />
      <Rect
        width={frameW}
        height={frameH}
        fill={theme.white}
        stroke={theme.black}
        lineWidth={theme.border}
      />
      <Img
        src={llamaLogo}
        width={logoW}
        height={logoH}
        y={-58}
        smoothing={true}
      />
      <Txt
        text="Llama"
        fontFamily={theme.pixelFont}
        fontSize={26}
        fill={theme.black}
        y={logoH / 2 - 8}
      />
      <Txt
        text={subtitle}
        fontFamily={theme.bodyFont}
        fontSize={19}
        fontWeight={700}
        fill={theme.grey}
        y={logoH / 2 + 28}
      />
    </Layout>
  );
}
