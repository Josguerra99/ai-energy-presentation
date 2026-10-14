/**
 * Perfil ilustrativo de intensidad de carbono (0 = limpio, 1 = sucio) en 24 h.
 * Mañana sucia → ventana más limpia por la tarde (p. ej. solar); noche otra subida (gas pico).
 */
export const GRID_CARBON_HOURLY = [
  0.55, 0.52, 0.5, 0.48, 0.5, 0.55,
  0.68, 0.76, 0.82, 0.78, 0.72, 0.65,
  0.58, 0.5, 0.42, 0.35, 0.38, 0.45,
  0.62, 0.75, 0.84, 0.8, 0.68, 0.58,
] as const;

let bestHour = 0;
let bestVal: number = GRID_CARBON_HOURLY[0];
for (let h = 1; h < GRID_CARBON_HOURLY.length; h++) {
  const v = GRID_CARBON_HOURLY[h];
  if (v < bestVal) {
    bestVal = v;
    bestHour = h;
  }
}
/** Ventana didáctica más limpia (tarde). */
export const GRID_CARBON_BEST_HOUR = bestHour;

/** El batch flexible llegaría pronto (mañana, mix más sucio). */
export const GRID_CARBON_PEAK_REQUEST_HOUR = 8;

export function gridCarbonBarFill(intensity: number): string {
  if (intensity <= 0.45) return '#22C55E';
  if (intensity <= 0.65) return '#FACC15';
  if (intensity <= 0.78) return '#FB923C';
  return '#DC2626';
}
