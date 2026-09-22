#!/usr/bin/env node
/** serve.mjs — preview the page locally: node serve.mjs  (then open http://localhost:5173) */
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = here;
const PORT = Number(process.env.PORT || 5173);
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png" };

createServer((req, res) => {
  const rel = req.url === "/" ? "index.html" : decodeURIComponent(req.url.split("?")[0].slice(1));
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT) || !existsSync(file)) {
    res.writeHead(404).end("Not found");
    return;
  }
  res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
}).listen(PORT, () => console.log(`Preview: http://localhost:${PORT}`));
