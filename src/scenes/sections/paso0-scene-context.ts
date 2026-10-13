import type {Layout} from '@motion-canvas/2d';
import type {ThreadGenerator} from '@motion-canvas/core';

/** Relleno de timeline entre beats vGPU (misma diapositiva). */
export const VGPU_TIMELINE_PAD = 0.5;

export type Paso0SceneContext = {
  contentW: number;
  contentH: number;
  scrollTo: (fill: (panel: Layout) => void) => ThreadGenerator;
  setFooter: (sourceIds: string[]) => void;
};
