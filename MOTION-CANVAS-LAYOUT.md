# Motion Canvas — notas de layout (este proyecto)

En la web, un `div` con hijos absolutos o un flex mal puesto suele “verse bien”. En **Motion Canvas 2D**, el layout es **flexbox explícito** y tiene reglas que explican la mayoría de los bugs que vimos.

## 0. Cómo evitar pelear con flex

Para slides con gráficos (pie, overlays, animaciones de posición):

```tsx
<Layout layout={false} width={1100} height={520}>
  <Circle x={-280} y={40} size={300} />
  <Txt x={220} y={-160} offsetX={-1} text="..." />
</Layout>
```

`layout={false}` = posicionamiento absoluto como un canvas. No hay gap, row, column ni herencia flex.
Usa esto para pies, overlays y “slide up”. Reserva `layout={true}` solo para listas de texto simples.

## 1. Herencia de `layout`

Un `Layout` con `layout={true}` activa flex. Si un hijo **no** pone `layout`, hereda del padre:

```ts
layoutEnabled() = this.layout() ?? parent.layoutEnabled() ?? false
```

Solo `null`/`undefined` heredan. **`layout={false}` desactiva flex en ese nodo** aunque el padre tenga row/column.

**Pie chart roto:** contenedor dentro de `direction="row"` → hijos `Circle` en **fila** → sectores como triángulos verticales.  
**Fix:** contenedor del pie con `layout={false}` y todos los `Circle` en `(0,0)`.

## 2. Sin `layout={true}` no hay gap ni column

Hijos sin flex se apilan en el origen del padre → texto superpuesto. Usar `VStack`/`HStack` (wrapper con `layout={true}`) o posiciones `x`/`y`/`top`.

## 3. Origen y posición

El origen del nodo suele ser el **centro**. `x={-960+padding}` no es “esquina izquierda” como en CSS.

**Centrar una pregunta y luego subirla:** contenedor `stage` con `layout={false}`, `width/height: 100%`, texto en **`y={0}`** (centro del área de contenido). Al revelar, animar `question.y` hacia arriba (p. ej. `-280`) en paralelo con respuesta + pie en `y` positivos. Evitar `offsetY={-1}` + valores a mano: suele verse ya “arriba” antes de animar.

## 4. Presentación (`beginSlide`)

- Un **Espacio** ejecuta hasta el **siguiente** `beginSlide`.
- Poner `beginSlide('…-listo')` **antes** de `clearContent()` de la siguiente slide.
- No mezclar “animar slide N” y “montar slide N+1” en el mismo tramo sin pausa intermedia.

## 5. Checklist anti-solapamiento (obligatorio en slides nuevos)

Antes de dar por hecho un slide con gráfica:

1. ¿Cada `Txt` de leyenda tiene `textAlign="left"` y `offsetX={-1}`?
2. ¿Pie / barras / líneas a la **izquierda** y leyenda a la **derecha** con hueco medible (p. ej. pie termina en `PIE_X + PIE_R`, leyenda empieza en `LEGEND_X`)?
3. ¿Título, subtítulo, cuerpo y caption tienen **y** en bandas distintas (no comparten fila)?
4. ¿El contenedor del gráfico usa `layout={false}`?

Regla Cursor: `.cursor/rules/motion-canvas-no-overlap.mdc`.

## Referencia

- [Layout](https://motioncanvas.io/docs/layout)
- [Presentation](https://motioncanvas.io/docs/presentation)
- Sectores: `Circle` con `startAngle`, `endAngle`, `closed={true}`
