import {waitFor} from '@motion-canvas/core';

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Jersey+10&family=Space+Grotesk:wght@400;500;700&display=swap';

export function* loadPresentationFonts() {
  if (typeof document === 'undefined') {
    return;
  }

  const existing = document.querySelector(`link[data-presentation-fonts]`);
  if (!existing) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_HREF;
    link.setAttribute('data-presentation-fonts', 'true');
    document.head.appendChild(link);
  }

  yield waitFor(0.4);
}
