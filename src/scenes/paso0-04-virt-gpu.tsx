import {makeScene2D} from '@motion-canvas/2d';
import {beginSlide} from '@motion-canvas/core';
import {gpuSection} from './sections/paso0-gpu';
import {createPaso0Shell, loadPaso0Fonts} from './shared/paso0-shell';

export default makeScene2D(function* (view) {
  yield* loadPaso0Fonts();
  const ctx = createPaso0Shell(view);

  yield* gpuSection(ctx);
  yield* beginSlide('virt-gpu-listo');
});
