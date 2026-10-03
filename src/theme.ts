/** Paleta de carbon-aware-computing-website + extras del timeline (proyector). */
export const theme = {
  yellow: '#FFF200',
  black: '#111111',
  cyan: '#00E5FF',
  magenta: '#FF2BD6',
  gold: '#C4B400',
  grey: '#8A8A8A',
  white: '#FFFFFF',
  /** Escala monocromática cyan (sitio: #00E5FF). */
  pie: [
    '#006B7A', // cyan muy oscuro — hardware
    '#0094A8', // cyan oscuro — energía
    '#00B8D4', // cyan medio — refrigeración
    '#00E5FF', // cyan sitio — red
    '#4DEEFF', // cyan claro — facility
    '#8AF5FF', // cyan pálido — ops
    '#C4FAFF', // casi blanco-cyan — idle
  ] as const,
  bodyFont: 'Space Grotesk, sans-serif',
  pixelFont: 'Jersey 10, sans-serif',
  border: 3,
  shadow: 6,
} as const;

export const slide = {
  width: 1920,
  height: 1080,
  paddingX: 96,
  paddingY: 72,
  footerHeight: 88,
} as const;
