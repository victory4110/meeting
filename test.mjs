#!/usr/bin/env node
/**
 * test.mjs — checks the whole flow end to end, no manual scanning needed.
 *
 *  1. The redirect page forwards to whatever config.js says.
 *  2. A real Google-Form-looking link round-trips through config -> page.
 *  3. Swapping the link in config.js changes the destination but NOT the QR.
 *  4. The generated QR PNG decodes back to the hosted URL.
 */
import { JSDOM } from "jsdom";
import jsQR from "jsqr";
import { PNG } from "pngjs";
import { readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const CONFIG = path.join(here, "config.js");
const OUT = path.join(here, "out");
const HOSTED = "https://victoryogundipe.github.io/meeting/";

let failures = 0;
const original = readFileSync(CONFIG, "utf8");

function check(label, condition, detail = "") {
  if (condition) {
    console.log(`PASS  ${label}`);
  } else {
    failures++;
    console.log(`FAIL  ${label}${detail ? `\n        ${detail}` : ""}`);
  }
}

/** Load index.html + config.js the way a phone browser would. */
async function loadPage() {
  const dom = await JSDOM.fromFile(path.join(here, "index.html"), {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
  });
  await new Promise((r) => setTimeout(r, 400));
  return dom;
}

function decodePng(file) {
  const png = PNG.sync.read(readFileSync(file));
  const res = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  return res ? res.data : null;
}

function writeConfig(formUrl, title) {
  writeFileSync(
    CONFIG,
    `window.MEETING = {\n  formUrl: "${formUrl}",\n  title: "${title}",\n` +
      `  note: "Taking you to the registration form...",\n  buttonText: "Open the form",\n};\n`,
    "utf8",
  );
}

try {
  console.log("--- 1. redirect page wires config.js to the form ---\n");

  const FORM_A = "https://docs.google.com/forms/d/e/1FAIpQLSfaAaBbCcDd/viewform";
  writeConfig(FORM_A, "April Meetup");

  const dom = await loadPage();
  const doc = dom.window.document;
  const anchor = doc.getElementById("go");

  check("button points at the form URL", anchor?.href === FORM_A, `got ${anchor?.href}`);
  check("page title comes from config", doc.title === "April Meetup", `got ${doc.title}`);
  check("hostname is shown to the visitor", doc.getElementById("url").textContent.includes("docs.google.com"));

  console.log("\n--- 2. changing the link swaps the destination, page stays the same ---\n");

  const FORM_B = "https://docs.google.com/forms/d/e/1FAIpQLSzzYyXxWwVv/viewform";
  writeConfig(FORM_B, "May Meetup");
  const dom2 = await loadPage();
  check("same page now opens the new form", dom2.window.document.getElementById("go").href === FORM_B);

  console.log("\n--- 3. QR encodes the stable link, not the form ---\n");

  rmSync(CONFIG, { force: true });
  writeFileSync(CONFIG, original, "utf8");
  execFileSync(process.execPath, [path.join(here, "make-qr.mjs"), HOSTED, "--name=selftest"], {
    stdio: "pipe",
  });

  const png = path.join(OUT, "selftest.png");
  check("2048px PNG written", existsSync(png));
  check("SVG written", existsSync(path.join(OUT, "selftest.svg")));
  check("A4 poster written", existsSync(path.join(OUT, "selftest-poster.html")));
  check("QR decodes back to the stable link", decodePng(png) === HOSTED, `got ${decodePng(png)}`);

  console.log("\n--- 4. verify script ---\n");
  try {
    execFileSync(process.execPath, [path.join(here, "verify-qr.mjs")], { stdio: "pipe" });
    check("verify-qr.mjs passes", true);
  } catch (e) {
    check("verify-qr.mjs passes", false, String(e.stdout || e.message).trim());
  }
} finally {
  writeFileSync(CONFIG, original, "utf8");
  console.log("\nconfig.js restored to its original contents.");
}

console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed.");
process.exit(failures ? 1 : 0);
