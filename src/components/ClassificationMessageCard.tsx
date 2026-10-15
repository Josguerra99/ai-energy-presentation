import {Rect, Txt} from '@motion-canvas/2d';
import {theme} from '../theme';

const msgW = 420;
const msgH = 128;

/** Tarjeta de correo usada en demos de clasificación. */
export function ClassificationMessageCard() {
  return (
    <>
      <Rect width={msgW} height={msgH} fill={theme.black} x={5} y={5} />
      <Rect
        width={msgW}
        height={msgH}
        fill={theme.white}
        stroke={theme.black}
        lineWidth={theme.border}
      />
      <Txt
        text="Correo recibido"
        fontFamily={theme.pixelFont}
        fontSize={18}
        fill={theme.grey}
        textAlign="left"
        offsetX={-1}
        x={-msgW / 2 + 22}
        y={-msgH / 2 + 28}
      />
      <Txt
        text="De: jefe@empresa.com"
        fontFamily={theme.bodyFont}
        fontSize={17}
        fontWeight={700}
        fill={theme.black}
        textAlign="left"
        offsetX={-1}
        width={msgW - 44}
        x={-msgW / 2 + 22}
        y={-8}
      />
      <Txt
        text="Necesito el informe antes de las 17:00"
        fontFamily={theme.bodyFont}
        fontSize={16}
        fontWeight={500}
        fill={theme.black}
        textAlign="left"
        offsetX={-1}
        width={msgW - 44}
        lineHeight={22}
        x={-msgW / 2 + 22}
        y={28}
      />
    </>
  );
}
