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

Si el layout se ve raro (texto encima, pie en tiras): lee [MOTION-CANVAS-LAYOUT.md](./MOTION-CANVAS-LAYOUT.md), Motion Canvas **hereda flex del padre**; no se comporta como HTML/CSS por defecto.

## Contenido actual (8 escenas en `project.ts`)

En **PRESENT**, elige la escena en el editor y avanza con **Espacio** dentro de ella. Al terminar un acto, salta al marcador `-listo` o abre la **siguiente escena**:

| Escena | Archivo | Cierre sugerido |
|--------|---------|-----------------|
| 1 · IA | `paso0-01-ia.tsx` | `presentacion-inicio` → `ia-inferencia-listo` |
| 2 · Paralelo (CPU/GPU) | `paso0-02-paralelo-costos.tsx` | `hardware-necesario-inicio` → `ia-gpu-paralelo` |
| 3 · Servidor | `paso0-03-servidor.tsx` | `infraestructura-inicio` → … → `virt-hypervisor-listo` |
| 4 · vGPU / GPU / MIG | `paso0-04-virt-gpu.tsx` | `virt-gpu-listo` |
| 5 · Costos LLM | `paso0-03-costos-llm.tsx` | `costos-inicio` → `ia-costos-train-vs-infer-deepseek-listo` |
| 6 · Uso energético | `paso0-04-uso-energetico.tsx` | … → `energia-carbon-aware-listo` |
| 7 · Agua (LBNL + operadores) | `paso0-03-agua.tsx` | `agua-calor-listo` … `agua-enfriamiento-tipos-listo` → `agua-evaporacion-local` → `agua-google-reutilizada` → `agua-microsoft-circuito-cerrado` → `agua-listo` |
| 8 · Recomendaciones | `paso0-05-recomendaciones.tsx` | `recomendaciones-inicio` → `recomendaciones-listo` |

Secciones: `sections/paso0-servidor-pue.tsx` (acto 3), `sections/paso0-gpu.tsx` (acto 4).

Shell compartido: `src/scenes/shared/paso0-shell.tsx`. Duraciones de ensayo: `src/scenes/shared/presentation-timing.ts`.

Las **fuentes** aparecen en un pie por diapositiva (`src/sources.ts` / `SOURCES.md`). Investigación IA: [hilo entrenamiento/inferencia](https://chatgpt.com/share/6abfe22c-cbe8-83e8-93c8-35b0aa003559).

## Próximos pasos sugeridos

- Añadir escenas Paso 1 (GPUs), carbon-aware computing, virtualización GPU.
- Exportar video con FFmpeg (`@motion-canvas/ffmpeg` ya configurado).
- Copiar assets pixel (sol, etc.) desde el sitio web si quieres decoración idéntica.
