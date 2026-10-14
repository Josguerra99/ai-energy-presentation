import type {Layout} from '@motion-canvas/2d';
import type {ThreadGenerator} from '@motion-canvas/core';

/**
 * @deprecated No usar waitFor para pacing en presentación: cada beat debe ser
 * `yield* beginSlide('…')` y el siguiente Espacio corre hasta el próximo marcador.
 */
export const VGPU_TIMELINE_PAD = 0.5;

export type Paso0SceneContext = {
  contentW: number;
  contentH: number;
  scrollTo: (fill: (panel: Layout) => void) => ThreadGenerator;
  setFooter: (sourceIds: string[]) => void;
};
