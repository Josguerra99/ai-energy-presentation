import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = fs.readFileSync(
  path.join(root, 'src/scenes/paso0-servidores.tsx'),
  'utf8',
);
const lines = src.split(/\r?\n/);

const header = lines.slice(0, 124).join('\n');
const headerNoGpu = header
  .split('\n')
  .filter(l => !l.includes("gpuSection") && !l.includes('./sections/paso0-gpu'))
  .join('\n');

const acts = [
  {
    file: 'paso0-01-ia.tsx',
    start: 202,
    end: 1187,
    imports: headerNoGpu,
    extra: '',
  },
  {
    file: 'paso0-02-paralelo-costos.tsx',
    start: 1189,
    end: 1592,
    imports: headerNoGpu,
    extra: '',
  },
  {
    file: 'paso0-03-servidor-pue.tsx',
    start: 1594,
    end: 1855,
    imports: headerNoGpu,
    extra: "\n  yield* beginSlide('virt-hypervisor-listo');\n",
  },
  {
    file: 'paso0-05-ambiente.tsx',
    start: 1864,
    end: 2045,
    imports: headerNoGpu,
    extra: "\n  yield* beginSlide('uso-ia-pesados-listo');\n",
  },
];

const sceneWrapper = (imports, body, extra) => `${imports.replace(
  "import {Circle, Img, Latex, Layout, Line, Rect, Spline, Txt, makeScene2D} from '@motion-canvas/2d';",
  "import {Circle, Img, Latex, Layout, Line, Rect, Spline, Txt, makeScene2D} from '@motion-canvas/2d';\nimport {setupPaso0Presentation} from './shared/paso0-shell';",
).replace(
  /^import \{slide, theme\} from '\.\.\/theme';$/m,
  "import {theme} from '../theme';",
)}

export default makeScene2D(function* (view) {
  const {scrollTo, setFooter, contentW, contentH} =
    yield* setupPaso0Presentation(view);

${body
  .replace(/\bCONTENT_W\b/g, 'contentW')
  .replace(/\bCONTENT_H\b/g, 'contentH')}${extra}});\n`;

for (const act of acts) {
  const body = lines.slice(act.start - 1, act.end).join('\n');
  const out = sceneWrapper(act.imports, body, act.extra);
  const outPath = path.join(root, 'src/scenes', act.file);
  fs.writeFileSync(outPath, out);
  console.log('Wrote', act.file);
}
