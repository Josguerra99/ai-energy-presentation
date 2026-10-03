import {Layout, Rect, Txt} from '@motion-canvas/2d';
import type {ComponentChildren} from '@motion-canvas/2d/lib/components/types';
import {theme} from '../theme';
import {VStack} from './SlideLayout';

type PixelPanelProps = {
  width: number;
  height: number;
  children?: ComponentChildren;
  shadow?: number;
};

export function PixelPanel({width, height, children, shadow = theme.shadow}: PixelPanelProps) {
  return (
    <Layout width={width} height={height}>
      <Rect
        width={width}
        height={height}
        fill={theme.black}
        x={shadow}
        y={shadow}
      />
      <Rect
        width={width}
        height={height}
        fill={theme.yellow}
        stroke={theme.black}
        lineWidth={theme.border}
      />
      <VStack
        padding={32}
        width={width - theme.border * 2}
        height={height - theme.border * 2}
        gap={16}
      >
        {children}
      </VStack>
    </Layout>
  );
}

export function PixelKicker({text}: {text: string}) {
  return (
    <Txt
      text={text}
      fontFamily={theme.pixelFont}
      fontSize={42}
      fill={theme.black}
    />
  );
}

export function Mark({text}: {text: string}) {
  return (
    <Txt
      text={text}
      fontFamily={theme.bodyFont}
      fontSize={36}
      fontWeight={700}
      fill={theme.black}
      padding={[0, 6]}
      cache
    />
  );
}
