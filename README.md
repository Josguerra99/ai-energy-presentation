# Presentación: energía e IA (Motion Canvas)

Animación en español para **modo presentación** de [Motion Canvas](https://motioncanvas.io/). Estilo visual alineado con [carbon-aware-computing-website](https://github.com/) (amarillo, negro, tipografía pixel `Jersey 10` + `Space Grotesk`).

## Inicio rápido

```bash
cd ai-energy-presentation
npm install
npm run serve
```

Abre el editor (por defecto `http://localhost:9000/`).

## Modo presentación (proyector)

1. En el editor, pestaña **Video Settings**.
2. Junto a **RENDER**, elige **PRESENT**.
3. Pulsa el botón de presentación (o abre `?present` en la URL del editor).
4. **Espacio** reanuda hasta el **próximo** `beginSlide` (pausa). Cada bloque tiene un marcador de entrada (`gancho-tco`) y uno de cierre (`gancho-tco-listo`): un Espacio reproduce la animación; **otro Espacio** pasa a montar la siguiente diapositiva. En el panel izquierdo puedes saltar directo al marcador `-listo` si ya mostraste la animación.

Pantalla **1920×1080**, fondo amarillo y texto negro pensados para buen contraste en proyector.

En **Video Settings**, deja **Size** en `1920 × 1080` y **Resolution scale** en `1`. El layout usa `width/height: 100%` para encajar en pantalla completa; si subes el tamaño de escena (p. ej. 4K) sin escala, el contenido se verá más pequeño pero dentro del marco.

Si el layout se ve raro (texto encima, pie en tiras): lee [MOTION-CANVAS-LAYOUT.md](./MOTION-CANVAS-LAYOUT.md) — Motion Canvas **hereda flex del padre**; no se comporta como HTML/CSS por defecto.

## Contenido actual

Escena `src/scenes/paso0-servidores.tsx` — bloque inicial:

0. **Qué pasa detrás de la IA** → entrenamiento / inferencia / escala
1. **Entrenamiento (ventanas)** → corpus → token a token (teacher forcing) → pesos
2. **Entrenamiento (classic)** → copia del demo anterior (para editar después)
3. **Escala + costos** → Llama 3.1 GPU-hours + estimaciones Stanford/Epoch
4. ¿Cuánto cuesta un servidor de $5,000? → pie chart TCO (`src/data/tcoSlices.ts`)
5. PUE (100 kW → 156 kW)
6. Utilización vs PUE
7. Consolidación / SO distintos → puente a virtualización

Las **fuentes** aparecen en un pie por diapositiva (`src/sources.ts` / `SOURCES.md`). Investigación IA: [hilo entrenamiento/inferencia](https://chatgpt.com/share/6abfe22c-cbe8-83e8-93c8-35b0aa003559).

## Próximos pasos sugeridos

- Añadir escenas Paso 1 (GPUs), carbon-aware computing, virtualización GPU.
- Exportar video con FFmpeg (`@motion-canvas/ffmpeg` ya configurado).
- Copiar assets pixel (sol, etc.) desde el sitio web si quieres decoración idéntica.
