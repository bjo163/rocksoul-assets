import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");

async function walk(dir) {
  const abs = path.join(root, dir);
  const entries = await readdir(abs, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const rel = path.posix.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(rel));
    else out.push(rel);
  }
  return out;
}

function deliveryFile(pathname) {
  if (/\.(svg|png|webm|wav|ogg|ico)$/i.test(pathname)) return true;
  return pathname.startsWith("moonwitness/runtime-motion-pack/lottie/") && pathname.endsWith(".json");
}

const dist = JSON.parse(await readFile(path.join(root, "dist/assets.json"), "utf8"));
const catalog = JSON.parse(await readFile(path.join(root, "showcase/catalog.json"), "utf8"));
const allFiles = await walk("moonwitness");
const actual = allFiles.filter(deliveryFile).sort();

const registryEntries = { ...(dist.packs ?? {}), ...(dist.collections ?? {}) };
const indexed = new Set();
for (const entry of Object.values(registryEntries)) {
  for (const file of entry.files ?? []) {
    if (deliveryFile(file)) indexed.add(file);
  }
}

const missing = actual.filter((file) => !indexed.has(file));
const extra = [...indexed].filter((file) => !actual.includes(file)).sort();
if (missing.length || extra.length) {
  console.error(JSON.stringify({ missing, extra }, null, 2));
  throw new Error(`Showcase file coverage failed: missing=${missing.length}, extra=${extra.length}`);
}

const registryIds = Object.keys(registryEntries).sort();
const catalogIds = Object.keys(catalog.entries ?? {}).sort();
const missingCatalog = registryIds.filter((id) => !catalogIds.includes(id));
const staleCatalog = catalogIds.filter((id) => !registryIds.includes(id));
if (missingCatalog.length || staleCatalog.length) {
  console.error(JSON.stringify({ missingCatalog, staleCatalog }, null, 2));
  throw new Error("Showcase catalog metadata coverage failed");
}

for (const id of registryIds) {
  const meta = catalog.entries[id];
  if (!meta?.label || !meta?.category || !meta?.description) {
    throw new Error(`Incomplete showcase catalog metadata for ${id}`);
  }
}

if (dist.coverage?.coveragePercent !== 100 || dist.coverage?.missingDeliveryFiles !== 0) {
  throw new Error("dist/assets.json does not report 100% delivery coverage");
}

console.log(JSON.stringify({
  showcaseCollections: registryIds.length,
  packFamilies: Object.keys(dist.packs ?? {}).length,
  foundationCollections: Object.keys(dist.collections ?? {}).length,
  deliveryFiles: actual.length,
  indexedDeliveryFiles: indexed.size,
  catalogEntries: catalogIds.length,
  coveragePercent: 100,
}, null, 2));
