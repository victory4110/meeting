#!/usr/bin/env node
/**
 * make-qr.mjs — print-ready QR codes for the meeting registration page.
 *
 *   node make-qr.mjs <stable-url>            # the URL you host the redirect at
 *   node make-qr.mjs <stable-url> --name=meeting-april
 *   node make-qr.mjs --from-config           # QR -> Google Form link directly
 *
 * Writes out/<name>.png (2048px), out/<name>.svg, out/<name>-poster.html
 */
import QRCode from "qrcode";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(here, "out");

const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith("--")));
const positional = argv.filter((a) => !a.startsWith("--"));
const nameFlag = argv.find((a) => a.startsWith("--name="));
const name = nameFlag ? nameFlag.split("=")[1] : "meeting-qr";

function readConfig() {
  const src = readFileSync(path.join(here, "config.js"), "utf8");
  const grab = (key) => {
    const m = src.match(new RegExp(`${key}\\s*:\\s*"([^"]*)"`));
    return m ? m[1].trim() : "";
  };
  return { formUrl: grab("formUrl"), title: grab("title") };
}

const config = readConfig();
const url = positional[0] || (flags.has("--from-config") ? config.formUrl : "");

if (!url || url.includes("PASTE-YOUR-FORM-ID")) {
  console.error(
    [
      "No URL to encode.",
      "",
      "Usage:",
      "  node make-qr.mjs https://your-site.example/meeting/",
      "  node make-qr.mjs --from-config     (encodes the Google Form link itself)",
      "",
      "Add --name=april-meet to change the output file names.",
    ].join("\n"),
  );
  process.exit(1);
}

try {
  const parsed = new URL(url);
  if (!/^https?:$/.test(parsed.protocol)) throw new Error("not http(s)");
} catch {
  console.error(`Not a valid web address: ${url}`);
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

const opts = { errorCorrectionLevel: "H", margin: 3, color: { dark: "#000000", light: "#ffffff" } };

const pngPath = path.join(OUT, `${name}.png`);
const svgPath = path.join(OUT, `${name}.svg`);
const posterPath = path.join(OUT, `${name}-poster.html`);

await QRCode.toFile(pngPath, url, { ...opts, width: 2048 });
const svg = await QRCode.toString(url, { ...opts, type: "svg", width: 640 });
writeFileSync(svgPath, svg, "utf8");

const posterTitle = config.title || "Meeting Registration";
const poster = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<title>${posterTitle} — QR poster</title>
<style>
  @page { size: A4; margin: 16mm; }
  body { margin:0; font:16px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; color:#111827; }
  .sheet { height:265mm; display:flex; flex-direction:column; align-items:center;
           justify-content:center; text-align:center; gap:18px; }
  h1 { font-size:42px; margin:0; letter-spacing:-.02em; }
  .sub { font-size:20px; color:#4b5563; margin:0; }
  .qr { width:110mm; height:110mm; }
  .qr svg { width:100%; height:100%; display:block; }
  .rule { width:60mm; height:4px; background:#2563eb; border-radius:2px; }
  footer { position:absolute; bottom:14mm; left:0; right:0; text-align:center;
           font-size:14px; color:#9ca3af; }
</style></head>
<body><div class="sheet">
  <div class="rule"></div>
  <h1>${posterTitle}</h1>
  <p class="sub">Scan to register</p>
  <div class="qr">${svg}</div>
  <p class="sub">Point your phone camera at the code.</p>
  <footer>${url}</footer>
</div></body></html>`;
writeFileSync(posterPath, poster, "utf8");

// Manifest so `node verify-qr.mjs` can prove every PNG decodes to the right URL.
const manifestPath = path.join(OUT, "expected.json");
const manifest = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, "utf8"))
  : {};
manifest[name] = url;
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

console.log(`Encoded: ${url}`);
console.log(`  ${path.relative(process.cwd(), pngPath)}   (2048px PNG, screens & chat)`);
console.log(`  ${path.relative(process.cwd(), svgPath)}   (vector, resize freely)`);
console.log(`  ${path.relative(process.cwd(), posterPath)}   (A4 poster, open & print)`);
