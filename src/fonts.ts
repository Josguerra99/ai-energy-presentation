import {waitFor} from '@motion-canvas/core';
import {theme} from './theme';

const FONT_LOAD_SPECS = [
  `56px ${theme.pixelFont}`,
  `400 16px ${theme.bodyFont}`,
  `500 16px ${theme.bodyFont}`,
  `700 16px ${theme.bodyFont}`,
] as const;

/** Espera a que el canvas pueda medir texto con las fuentes del proyecto. */
export function* loadPresentationFonts() {
  if (typeof document === 'undefined') {
    return;
  }

  yield waitFor(0);

  yield Promise.all(FONT_LOAD_SPECS.map(spec => document.fonts.load(spec))).then(
    () => document.fonts.ready,
  );
}
