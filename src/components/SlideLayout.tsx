import {Layout} from '@motion-canvas/2d';
import type {LayoutProps} from '@motion-canvas/2d/lib/components/Layout';

/** Flex column — requiere `layout` en Motion Canvas o todo se superpone en (0,0). */
export function VStack({gap = 24, ...props}: LayoutProps) {
  return (
    <Layout
      layout
      direction="column"
      alignItems="start"
      justifyContent="start"
      gap={gap}
      {...props}
    />
  );
}

export function HStack({gap = 24, ...props}: LayoutProps) {
  return (
    <Layout
      layout
      direction="row"
      alignItems="center"
      justifyContent="start"
      gap={gap}
      {...props}
    />
  );
}
