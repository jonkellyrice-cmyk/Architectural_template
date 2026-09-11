import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative, resolve, sep } from "node:path";

const ROOT = resolve(process.cwd());
const SOURCE_ROOTS = [resolve(ROOT, "src"), resolve(ROOT, "app")];

const layerRules = {
  kernel: new Set(["kernel"]),
  domain: new Set(["kernel", "domain"]),
  application: new Set(["kernel", "domain", "application"]),
  infrastructure: new Set(["kernel", "domain", "application", "infrastructure"]),
  presentation: new Set(["kernel", "domain", "application", "presentation"]),
  config: new Set(["config"]),
  composition: new Set(["kernel", "domain", "application", "infrastructure", "presentation", "config", "composition"]),
  app: new Set(["app", "composition", "presentation"]),
};

const importPattern = /\b(?:import|export)\s+(?:type\s+)?(?:[^"'`]*?\s+from\s+)?["']([^"']+)["']/g;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) paths.push(...(await walk(path)));
    else if ([".ts", ".tsx"].includes(extname(entry.name))) paths.push(path);
  }
  return paths;
}

function sourceLayer(file) {
  const path = relative(ROOT, file).split(sep);
  if (path[0] === "app") return "app";
  return path[0] === "src" ? path[1] : undefined;
}

function importedLayer(specifier) {
  if (!specifier.startsWith("@/")) return undefined;
  const parts = specifier.slice(2).split("/");
  if (parts[0] === "app") return "app";
  return parts[0] === "src" ? parts[1] : undefined;
}

const files = (await Promise.all(SOURCE_ROOTS.map(async (root) => {
  try { return await walk(root); } catch { return []; }
}))).flat();

const violations = [];
for (const file of files) {
  const from = sourceLayer(file);
  const allowed = layerRules[from];
  if (!allowed) continue;
  const source = await readFile(file, "utf8");
  for (const match of source.matchAll(importPattern)) {
    const specifier = match[1];
    const to = importedLayer(specifier);
    if (to && !allowed.has(to)) {
      violations.push(`${relative(ROOT, file)}: ${from} may not import ${to} via ${specifier}`);
    }
  }
}

if (violations.length > 0) {
  console.error("Architecture boundary violations:\n");
  console.error(violations.map((line) => `- ${line}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Architecture boundaries OK (${files.length} source files scanned).`);
}
