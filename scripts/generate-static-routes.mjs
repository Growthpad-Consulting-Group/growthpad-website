// Walks src/app/(site) for page.tsx files and writes the result to
// src/generated/static-routes.json. Runs at build time because the
// Cloudflare Worker bundle doesn't ship the source tree — sitemap.ts can't
// call fs.readdirSync on `src/app/(site)` at request time in production.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const siteDir = path.join(rootDir, "src/app/(site)");
const outFile = path.join(rootDir, "src/generated/static-routes.json");

const EXCLUDED = new Set(["studio"]);

function walk(dir, segments, routes) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const isDynamic = segments.some((segment) => segment.startsWith("["));
  const isExcluded = segments.some((segment) => EXCLUDED.has(segment));

  const pageEntry = entries.find((e) => e.isFile() && e.name === "page.tsx");
  if (pageEntry && !isDynamic && !isExcluded) {
    routes.push({
      route: segments.length === 0 ? "" : segments.join("/"),
      lastModified: fs.statSync(path.join(dir, pageEntry.name)).mtime.toISOString(),
    });
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      walk(path.join(dir, entry.name), [...segments, entry.name], routes);
    }
  }
}

const routes = [];
walk(siteDir, [], routes);

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(routes, null, 2) + "\n");

console.log(`Generated ${routes.length} static route(s) -> ${path.relative(rootDir, outFile)}`);
