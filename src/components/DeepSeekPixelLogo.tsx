import {Img, Layout, Rect, Txt} from '@motion-canvas/2d';
import deepseekLogo from '../assets/deepseek-logo.png';
import {theme} from '../theme';

type DeepSeekBrandProps = {
  x?: number;
  y?: number;
  /** Ancho del logo dentro del marco (px). */
  logoSize?: number;
};

/** Marco pixel + logo DeepSeek + V3. */
export function DeepSeekPixelLogo({
  x = 0,
  y = 0,
  logoSize = 200,
}: DeepSeekBrandProps) {
  const frameW = logoSize + 72;
  const frameH = logoSize + 120;

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
        src={deepseekLogo}
        width={logoSize}
        height={logoSize}
        y={-28}
        smoothing={true}
      />
      <Txt
        text="DeepSeek-V3"
        fontFamily={theme.pixelFont}
        fontSize={26}
        fill={theme.black}
        y={frameH / 2 - 36}
      />
    </Layout>
  );
}
