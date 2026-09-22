#!/usr/bin/env node
/**
 * verify-qr.mjs — proves a generated QR actually decodes to the expected URL.
 *
 *   node verify-qr.mjs                       # checks every PNG in out/ against out/expected.json
 *   node verify-qr.mjs out/foo.png <url>     # one-off check
 */
import { readFileSync, existsSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import jsQR from "jsqr";
import { PNG } from "pngjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(here, "out");
const manifest = path.join(OUT, "expected.json");

function decode(file) {
  const png = PNG.sync.read(readFileSync(file));
  const res = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  return res ? res.data : null;
}

const [, , fileArg, urlArg] = process.argv;

if (fileArg) {
  const got = decode(fileArg);
  const ok = got === urlArg;
  console.log(`${ok ? "PASS" : "FAIL"} ${fileArg}\n  expected: ${urlArg}\n  decoded:  ${got}`);
  process.exit(ok ? 0 : 1);
}

if (!existsSync(manifest)) {
  console.error(`No manifest at ${manifest}. Generate a QR first with make-qr.mjs.`);
  process.exit(1);
}

const expected = JSON.parse(readFileSync(manifest, "utf8"));
let failures = 0;

for (const [name, url] of Object.entries(expected)) {
  const file = path.join(OUT, `${name}.png`);
  if (!existsSync(file)) {
    console.log(`FAIL ${name}.png missing`);
    failures++;
    continue;
  }
  const got = decode(file);
  if (got === url) {
    console.log(`PASS ${name}.png decodes to the expected URL`);
  } else {
    failures++;
    console.log(`FAIL ${name}.png\n  expected: ${url}\n  decoded:  ${got}`);
  }
}

// Every PNG in out/ must be accounted for, so nothing untested ships.
const strays = readdirSync(OUT)
  .filter((f) => f.endsWith(".png") && !(`${f.replace(/\.png$/, "")}` in expected));
if (strays.length) {
  console.log(`FAIL untested PNGs in out/: ${strays.join(", ")}`);
  failures++;
}

console.log(failures ? `\n${failures} failed` : "\nAll QR codes verified.");
process.exit(failures ? 1 : 0);
