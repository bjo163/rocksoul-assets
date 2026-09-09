import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
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

function mapFiles(files, ext) {
  const out = {};
  for (const file of files.filter((p) => p.toLowerCase().endsWith(ext))) {
    const key = path.basename(file, ext);
    out[key] = file;
  }
  return out;
}

function addFile(entry, file) {
  if (!entry.files.includes(file)) entry.files.push(file);
}

function deliveryFile(pathname) {
  if (/\.(svg|png|webm|wav|ogg|ico)$/i.test(pathname)) return true;
  return pathname.startsWith("moonwitness/runtime-motion-pack/lottie/") && pathname.endsWith(".json");
}

const index = JSON.parse(await readFile(path.join(root, "moonwitness/asset-packs.json"), "utf8"));
const classification = JSON.parse(await readFile(path.join(root, "moonwitness/asset-classification.json"), "utf8"));
const allMoonwitness = await walk("moonwitness");
const packs = {};

function classificationFor(collectionId) {
  const matches = classification.rules.filter((rule) => rule.collectionIds.includes(collectionId));
  if (matches.length !== 1) throw new Error(`Expected exactly one classification rule for ${collectionId}; found ${matches.length}`);
  const rule = matches[0];
  return {
    ruleId: rule.id,
    assetKind: rule.assetKind,
    intendedUsage: rule.intendedUsage,
    minimumDisplaySize: rule.minimumDisplaySize,
    accessibilityRole: rule.accessibilityRole,
  };
}

function isVisualDelivery(file) {
  return /\.(svg|png|ico|webm)$/i.test(file) || (file.includes("/lottie/") && file.endsWith(".json"));
}

async function inspectVisualFile(file, entry, policy) {
  const extension = file.includes("/lottie/") && file.endsWith(".json") ? "lottie" : path.extname(file).slice(1).toLowerCase();
  let source = file.endsWith(".svg") ? file : null;
  if (!source) {
    const basename = path.basename(file, path.extname(file));
    const sourceId = Object.keys(entry.svg ?? {}).sort((a, b) => b.length - a.length)
      .find((id) => basename === id || basename.startsWith(id + "-"));
    source = sourceId ? entry.svg[sourceId] : null;
  }
  let containsText = false;
  let themeBehavior = "fixed";
  if (source) {
    const raw = await readFile(path.join(root, source), "utf8");
    containsText = /<text\b/i.test(raw);
    if (file.endsWith(".svg")) {
      if (/currentColor/i.test(raw)) themeBehavior = "currentColor";
      else if (/var\(--[a-z0-9-]+/i.test(raw)) themeBehavior = "semantic-token";
    }
  }
  return {
    assetKind: policy.assetKind,
    intendedUsage: policy.intendedUsage,
    themeBehavior,
    minimumDisplaySize: policy.minimumDisplaySize,
    containsText,
    accessibilityRole: policy.accessibilityRole,
    format: extension,
    ...(source && source !== file ? { canonicalSource: source } : {}),
  };
}

async function classifyEntry(collectionId, entry) {
  const policy = classificationFor(collectionId);
  entry.classification = policy;
  entry.visualAssets = {};
  if (policy.assetKind === null) return;
  for (const file of entry.files.filter(isVisualDelivery)) {
    entry.visualAssets[file] = await inspectVisualFile(file, entry, policy);
  }
}

for (const pack of index.packs) {
  const manifest = JSON.parse(await readFile(path.join(root, pack.manifest), "utf8"));
  const packRoot = path.posix.dirname(pack.manifest);

  let svgRoot = null;
  if (manifest.root) svgRoot = path.posix.join(packRoot, manifest.root);
  else if (pack.id === "product-icons") svgRoot = "moonwitness/icons/svg";
  else if (pack.id === "dashboard") svgRoot = "moonwitness/dashboard-pack/widgets";
  else if (pack.id === "data-viz") svgRoot = "moonwitness/data-viz/charts";
  else if (pack.id === "hero-backgrounds") svgRoot = "moonwitness/hero-backgrounds/svg";
  else if (pack.id === "state-illustrations") svgRoot = "moonwitness/state-illustrations/svg";
  else if (pack.id === "motion") svgRoot = "moonwitness/motion/svg";

  const entry = {
    manifest: pack.manifest,
    count: pack.count,
    canonicalFormat: manifest.canonicalFormat ?? "svg",
    svg: {},
    png: {},
    webm: {},
    lottie: {},
    wav: {},
    ogg: {},
    ico: {},
    artifacts: {},
    files: [],
  };

  if (svgRoot) {
    const svgs = (await walk(svgRoot)).filter((p) => p.endsWith(".svg")).sort();
    for (const file of svgs) {
      entry.svg[path.basename(file, ".svg")] = file;
      addFile(entry, file);
    }

    const pngRoot = path.posix.join(packRoot, "png");
    try {
      const pngs = (await walk(pngRoot)).filter((p) => p.endsWith(".png")).sort();
      for (const file of pngs) {
        const key = path.basename(file, ".png");
        const sizeSegment = file.split("/png/")[1]?.split("/")[0];
        if (/^\d+$/.test(sizeSegment ?? "")) {
          entry.png[key] ??= {};
          entry.png[key][sizeSegment] = file;
        } else {
          entry.png[key] = file;
        }
        addFile(entry, file);
      }
    } catch {}
  }

  // Non-SVG/PNG runtime delivery lives beside canonical pack sources.
  const packFiles = allMoonwitness.filter((p) => p.startsWith(packRoot + "/"));
  for (const [ext, field] of [[".webm", "webm"], [".wav", "wav"], [".ogg", "ogg"], [".ico", "ico"]]) {
    for (const [key, file] of Object.entries(mapFiles(packFiles, ext))) {
      entry[field][key] = file;
      addFile(entry, file);
    }
  }

  // Lottie JSON is a delivery format only inside the runtime-motion lottie directory.
  const lottieFiles = packFiles.filter((p) => p.includes("/lottie/") && p.endsWith(".json")).sort();
  for (const file of lottieFiles) {
    entry.lottie[path.basename(file, ".json")] = file;
    addFile(entry, file);
  }

  // Developer-distribution artifacts live outside the pack root by design.
  for (const artifact of manifest.artifacts ?? []) {
    entry.artifacts[path.basename(artifact)] = artifact;
  }

  entry.files.sort();
  packs[pack.id] = entry;
}

// Foundation collections are delivery assets that predate the pack index but must still be fully browseable.
const brandFiles = allMoonwitness.filter((p) =>
  p.startsWith("moonwitness/brand/") &&
  (
    (p.split("/").length === 3 && p.endsWith(".svg")) ||
    (p.startsWith("moonwitness/brand/generated/") && /\.(png|ico)$/i.test(p))
  )
).sort();

const baselineFiles = allMoonwitness.filter((p) =>
  p.startsWith("moonwitness/ui/v1/screens/") && /\.(svg|png)$/i.test(p)
).sort();

function collectionEntry(id, files, manifest) {
  const entry = {
    manifest,
    count: files.filter((p) => p.endsWith(".svg")).length,
    canonicalFormat: "svg",
    svg: mapFiles(files, ".svg"),
    png: mapFiles(files, ".png"),
    webm: {},
    lottie: {},
    wav: {},
    ogg: {},
    ico: mapFiles(files, ".ico"),
    artifacts: {},
    files: [...files],
  };
  return entry;
}

const collections = {
  "brand-system": collectionEntry("brand-system", brandFiles, "moonwitness/brand/brand-assets.json"),
  "baseline-v1": collectionEntry("baseline-v1", baselineFiles, "moonwitness/ui/v1/screens/screens.json"),
};

for (const [id, entry] of Object.entries(packs)) await classifyEntry(id, entry);
for (const [id, entry] of Object.entries(collections)) await classifyEntry(id, entry);

// Repository-wide delivery coverage: every actual MoonWitness delivery file must be reachable from showcase registry.
const actualDelivery = allMoonwitness.filter(deliveryFile).sort();
const indexedDelivery = new Set();
for (const entry of [...Object.values(packs), ...Object.values(collections)]) {
  for (const file of entry.files ?? []) {
    if (deliveryFile(file)) indexedDelivery.add(file);
  }
}
const missing = actualDelivery.filter((file) => !indexedDelivery.has(file));
const extra = [...indexedDelivery].filter((file) => !actualDelivery.includes(file)).sort();
if (missing.length || extra.length) {
  throw new Error(
    [
      "Showcase delivery coverage mismatch.",
      missing.length ? "Missing from registry:\n" + missing.map((p) => "  - " + p).join("\n") : "",
      extra.length ? "Unknown registry delivery paths:\n" + extra.map((p) => "  - " + p).join("\n") : "",
    ].filter(Boolean).join("\n")
  );
}

const dist = {
  schemaVersion: 3,
  version: index.version,
  canonicalFormat: "svg",
  classificationSchemaVersion: classification.schemaVersion,
  packs,
  collections,
  coverage: {
    packFamilies: Object.keys(packs).length,
    foundationCollections: Object.keys(collections).length,
    showcaseCollections: Object.keys(packs).length + Object.keys(collections).length,
    deliveryFiles: actualDelivery.length,
    indexedDeliveryFiles: indexedDelivery.size,
    classifiedVisualFiles: [...Object.values(packs), ...Object.values(collections)]
      .reduce((sum, entry) => sum + Object.keys(entry.visualAssets ?? {}).length, 0),
    missingDeliveryFiles: 0,
    coveragePercent: 100,
    extensions: {
      svg: actualDelivery.filter((p) => p.endsWith(".svg")).length,
      png: actualDelivery.filter((p) => p.endsWith(".png")).length,
      ico: actualDelivery.filter((p) => p.endsWith(".ico")).length,
      webm: actualDelivery.filter((p) => p.endsWith(".webm")).length,
      wav: actualDelivery.filter((p) => p.endsWith(".wav")).length,
      ogg: actualDelivery.filter((p) => p.endsWith(".ogg")).length,
      lottie: actualDelivery.filter((p) => p.startsWith("moonwitness/runtime-motion-pack/lottie/") && p.endsWith(".json")).length,
    },
  },
};

await mkdir(path.join(root, "dist"), { recursive: true });
await writeFile(path.join(root, "dist/assets.json"), JSON.stringify(dist, null, 2) + "\n");
await writeFile(
  path.join(root, "dist/assets.ts"),
  `// Generated by tools/assets/build-dist.mjs\nexport const assets = ${JSON.stringify(dist, null, 2)} as const;\nexport type AssetRegistry = typeof assets;\n`
);

let css = "/* Generated MoonWitness asset path registry */\n:root {\n";
for (const [packId, pack] of Object.entries(packs)) {
  for (const [id, p] of Object.entries(pack.svg ?? {})) {
    css += `  --mw-${packId}-${id}: url("/${p}");\n`;
  }
}
for (const [collectionId, collection] of Object.entries(collections)) {
  for (const [id, p] of Object.entries(collection.svg ?? {})) {
    css += `  --mw-${collectionId}-${id}: url("/${p}");\n`;
  }
}
css += "}\n";
await writeFile(path.join(root, "dist/assets.css"), css);

// Product icon sprite only: reliable same-grid symbols.
const iconFiles = (await walk("moonwitness/icons/svg")).filter((p) => p.endsWith(".svg")).sort();
let symbols = "";
for (const p of iconFiles) {
  const raw = await readFile(path.join(root, p), "utf8");
  const vb = raw.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 24 24";
  const inner = raw.replace(/^.*?<svg[^>]*>/s, "").replace(/<\/svg>\s*$/s, "");
  const id = path.basename(p, ".svg");
  symbols += `<symbol id="mw-${id}" viewBox="${vb}">${inner}</symbol>`;
}
await writeFile(
  path.join(root, "dist/sprite.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg"><defs>${symbols}</defs></svg>\n`
);

console.log(JSON.stringify({
  version: index.version,
  packs: Object.keys(packs).length,
  collections: Object.keys(collections).length,
  deliveryFiles: actualDelivery.length,
  showcaseCoverage: "100%",
  icons: iconFiles.length,
}, null, 2));
