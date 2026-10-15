import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function cleanText(s) {
  return s
    .replace(/«/g, '')
    .replace(/»/g, '')
    .replace(/\s—\s/g, ', ')
    .replace(/—/g, ', ');
}

/** Transform quoted / template string literals only. */
function transformSource(code) {
  let out = '';
  let i = 0;
  while (i < code.length) {
    const ch = code[i];
    if (ch === '/' && code[i + 1] === '/') {
      const end = code.indexOf('\n', i);
      const lineEnd = end === -1 ? code.length : end;
      out += code.slice(i, lineEnd);
      i = lineEnd;
      continue;
    }
    if (ch === '/' && code[i + 1] === '*') {
      const end = code.indexOf('*/', i + 2);
      const blockEnd = end === -1 ? code.length : end + 2;
      out += code.slice(i, blockEnd);
      i = blockEnd;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      const quote = ch;
      let j = i + 1;
      let inner = '';
      while (j < code.length) {
        const c = code[j];
        if (c === '\\') {
          inner += c + code[j + 1];
          j += 2;
          continue;
        }
        if (c === quote) {
          const cleaned = cleanText(inner);
          out += quote + cleaned + quote;
          j++;
          break;
        }
        inner += c;
        j++;
      }
      i = j;
      continue;
    }
    out += ch;
    i++;
  }
  return out;
}

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === 'dist') continue;
      walk(p, acc);
    } else if (/\.(tsx|ts)$/.test(name)) {
      acc.push(p);
    }
  }
  return acc;
}

const files = walk(path.join(root, 'src'));
let changed = 0;
for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  const after = transformSource(before);
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changed++;
    console.log(path.relative(root, file));
  }
}
console.log(`Updated ${changed} files.`);
