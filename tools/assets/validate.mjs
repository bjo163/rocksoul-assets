import { readFile, readdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

async function exists(relativePath) {
  try {
    await access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
}

async function assertNativeSvg(relativePath) {
  invariant(await exists(relativePath), `Missing SVG: ${relativePath}`);
  const svg = await readFile(path.join(root, relativePath), "utf8");
  invariant(/<svg\b/.test(svg), `Not an SVG document: ${relativePath}`);
  invariant(!/<image\b/i.test(svg), `Raster <image> embedding is not allowed in canonical vector source: ${relativePath}`);
  invariant(!/data:image\/(png|jpe?g|webp)/i.test(svg), `Embedded raster data is not allowed: ${relativePath}`);
  invariant(!/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);)/i.test(svg), `Unescaped XML ampersand in SVG: ${relativePath}`);
}

async function walk(relativeDir) {
  const absoluteDir = path.join(root, relativeDir);
  const entries = await readdir(absoluteDir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const child = path.posix.join(relativeDir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(child));
    else files.push(child);
  }
  return files;
}

async function collectRasterSourceMappings() {
  const allFiles = await walk("moonwitness");
  const mappings = new Map();

  const manifestPaths = allFiles.filter((name) =>
    name === "moonwitness/brand/generated/manifest.json" ||
    name.endsWith("/png/manifest.json")
  );
  for (const manifestPath of manifestPaths) {
    const data = await readJson(manifestPath);
    for (const item of data.outputs ?? []) {
      if (/\.(png|jpe?g)$/i.test(item.path ?? "") && item.source) mappings.set(item.path, item.source);
    }
  }

  // Immutable v1 baseline uses same-basename SVG/PNG pairs instead of generated manifests.
  for (const raster of allFiles.filter((name) => /\.(png|jpe?g)$/i.test(name))) {
    const sameBase = raster.replace(/\.(png|jpe?g)$/i, ".svg");
    if (await exists(sameBase)) mappings.set(raster, sameBase);
  }
  return { allFiles, mappings };
}

async function validateRasterVectorPairs() {
  const { allFiles, mappings } = await collectRasterSourceMappings();
  const rasters = allFiles.filter((name) => /\.(png|jpe?g)$/i.test(name)).sort();
  let baselinePairs = 0;
  let generatedPairs = 0;

  for (const raster of rasters) {
    const source = mappings.get(raster);
    invariant(source, `Raster asset has no canonical SVG source: ${raster}`);
    await assertNativeSvg(source);
    if (raster.startsWith("moonwitness/ui/v1/screens/")) baselinePairs += 1;
    else generatedPairs += 1;
  }

  const baselineRasters = rasters.filter((item) => item.startsWith("moonwitness/ui/v1/screens/"));
  invariant(baselineRasters.length === 16, `Expected 16 v1 raster baseline screens, got ${baselineRasters.length}`);
  return { total: rasters.length, baselinePairs, generatedPairs };
}

async function validateVectorRasterCoverage() {
  const { allFiles, mappings } = await collectRasterSourceMappings();
  const vectors = allFiles.filter((name) => name.endsWith(".svg")).sort();
  const covered = new Set(mappings.values());
  const missing = vectors.filter((svg) => !covered.has(svg));
  invariant(
    missing.length === 0,
    `MoonWitness delivery SVGs without PNG derivative: ${missing.join(", ")}`
  );
  return { totalVectors: vectors.length, coveredVectors: vectors.length, missing: 0 };
}

async function validateManifest() {
  const manifest = await readJson("manifest.json");
  invariant(manifest.schemaVersion >= 3, "manifest.json must use schemaVersion >= 3");
  invariant(manifest.brand?.manifest, "manifest.json missing brand manifest");
  invariant(manifest.application?.screens, "manifest.json missing v2 application screen contract");

  for (const screen of manifest.screens ?? []) {
    invariant(screen.path && screen.vector, `Screen ${screen.id} must define raster and vector paths`);
    invariant(await exists(screen.path), `Missing raster baseline: ${screen.path}`);
    await assertNativeSvg(screen.vector);
    invariant(
      path.basename(screen.path).replace(/\.(png|jpe?g)$/i, "") === path.basename(screen.vector, ".svg"),
      `Raster/vector basename mismatch for screen ${screen.id}`
    );
  }

  return manifest;
}

async function validateBrand() {
  const brand = await readJson("moonwitness/brand/brand-assets.json");
  invariant(Array.isArray(brand.assets) && brand.assets.length >= 10, "Brand asset inventory is unexpectedly small");

  for (const asset of brand.assets) {
    invariant(asset.path?.endsWith(".svg"), `Brand asset must point to SVG source: ${asset.id}`);
    await assertNativeSvg(path.posix.join("moonwitness/brand", asset.path));
  }

  const generated = await readJson("moonwitness/brand/generated/manifest.json");
  const covered = new Set((generated.outputs ?? []).map((item) => item.source));
  for (const asset of brand.assets) {
    const source = path.posix.join("moonwitness/brand", asset.path);
    invariant(covered.has(source), `Brand SVG has no generated raster derivative: ${source}`);
  }
  invariant(await exists("moonwitness/brand/site.webmanifest"), "Missing site.webmanifest");
  return brand.assets.length;
}

async function validateApplicationV2() {
  const screenContract = await readJson("moonwitness/ui/v2/screens.json");
  const navigation = await readJson("moonwitness/ui/v2/navigation.json");
  const states = await readJson("moonwitness/ui/v2/states.json");

  await assertNativeSvg("moonwitness/ui/v2/application-shell.svg");

  for (const screen of screenContract.screens ?? []) {
    await assertNativeSvg(path.posix.join("moonwitness/ui/v2", screen.path));
  }

  const ids = navigation.items.map((item) => item.id);
  const paths = navigation.items.map((item) => item.path);
  invariant(new Set(ids).size === ids.length, "Duplicate AutoMenu item IDs");
  invariant(new Set(paths).size === paths.length, "Duplicate AutoMenu routes");
  invariant(navigation.mode === "AutoMenu", "Resource navigation must remain AutoMenu-driven");

  for (const name of ["loading", "empty", "error", "offline", "forbidden"]) {
    invariant(states.states?.[name], `Missing system state contract: ${name}`);
  }

  const delivery = await readJson("moonwitness/ui/v2/manifest.json");
  invariant(delivery.count === screenContract.screens.length + 1, "V2 preview manifest must include shell + all screens");
  const generated = await readJson("moonwitness/ui/v2/png/manifest.json");
  invariant((generated.outputs ?? []).length === delivery.count, "V2 PNG preview count mismatch");
  return screenContract.screens.length;
}


async function validateAssetPacks() {
  const packs = [
    { id: "icons", dir: "moonwitness/icons/svg", manifest: "moonwitness/icons/icons.json", ext: ".svg", min: 44 },
    { id: "dashboard", dir: "moonwitness/dashboard-pack/widgets", manifest: "moonwitness/dashboard-pack/dashboard-pack.json", ext: ".svg", min: 20 },
    { id: "dataViz", dir: "moonwitness/data-viz/charts", manifest: "moonwitness/data-viz/data-viz.json", ext: ".svg", min: 16 },
    { id: "heroBackgrounds", dir: "moonwitness/hero-backgrounds/svg", manifest: "moonwitness/hero-backgrounds/backgrounds.json", ext: ".svg", min: 8 },
    { id: "stateIllustrations", dir: "moonwitness/state-illustrations/svg", manifest: "moonwitness/state-illustrations/states.json", ext: ".svg", min: 12 },
    { id: "motion", dir: "moonwitness/motion/svg", manifest: "moonwitness/motion/motion.json", ext: ".svg", min: 6 }
  ];
  const result = {};
  for (const pack of packs) {
    invariant(await exists(pack.manifest), `Missing asset pack manifest: ${pack.manifest}`);
    const files = (await walk(pack.dir)).filter((name) => name.endsWith(pack.ext)).sort();
    invariant(files.length >= pack.min, `${pack.id} expected at least ${pack.min} assets, got ${files.length}`);
    for (const file of files) await assertNativeSvg(file);
    result[pack.id] = files.length;
  }

  const sfx = await readJson("moonwitness/sfx/sounds.json");
  invariant(Object.keys(sfx.usage ?? {}).length >= 10, "SFX pack must define at least 10 sounds");
  if (await exists("moonwitness/sfx/generated/manifest.json")) {
    const generated = await readJson("moonwitness/sfx/generated/manifest.json");
    invariant((generated.sounds ?? []).length >= 10, "Generated SFX manifest must contain at least 10 sounds");
    result.sfx = generated.sounds.length;
  } else {
    result.sfx = Object.keys(sfx.usage ?? {}).length;
  }
  return result;
}

async function validateSecondaryAssetPacks() {
  const manifestFiles = (await walk("moonwitness")).filter((name) =>
    name.endsWith("/manifest.json") &&
    name.includes("-pack/") &&
    !name.includes("/generated/") &&
    !name.includes("/png/")
  );
  const packs = {};
  for (const manifestPath of manifestFiles) {
    const data = await readJson(manifestPath);
    const packRoot = path.posix.dirname(manifestPath);
    if (data.root) {
      const svgRoot = path.posix.join(packRoot, data.root);
      const svgs = (await walk(svgRoot)).filter((name) => name.endsWith(".svg"));
      invariant(svgs.length === data.count, `${data.pack}: manifest count ${data.count} != SVG count ${svgs.length}`);
      for (const file of svgs) await assertNativeSvg(file);
      packs[data.pack] = svgs.length;
    } else if (data.canonicalFormat === "generated-registry") {
      invariant(Array.isArray(data.artifacts) && data.artifacts.length === data.count, `${data.pack}: artifact count mismatch`);
      packs[data.pack] = data.count;
    }
  }
  invariant(Object.keys(packs).length >= 33, `Expected at least 33 modular asset packs, got ${Object.keys(packs).length}`);
  return packs;
}

async function validateGlobalPackIndex() {
  const index = await readJson("moonwitness/asset-packs.json");
  const version = (await readFile(path.join(root, "VERSION"), "utf8")).trim();
  invariant(index.version === version, `asset-packs.json version must match VERSION (${version})`);
  invariant(index.packs.length >= 42, `Expected at least 42 pack families, got ${index.packs.length}`);
  const ids=index.packs.map((p)=>p.id);
  invariant(new Set(ids).size===ids.length,"Duplicate asset pack ids");
  for(const p of index.packs) invariant(await exists(p.manifest), `Missing indexed pack manifest: ${p.manifest}`);
  return index.packs.length;
}

async function validateDeveloperDist() {
  for (const file of ["dist/assets.json","dist/assets.ts","dist/assets.css","dist/sprite.svg"]) {
    invariant(await exists(file), `Missing developer distribution artifact: ${file}`);
  }
  const dist=await readJson("dist/assets.json");
  const version = (await readFile(path.join(root, "VERSION"), "utf8")).trim();
  invariant(dist.version===version,"Developer dist version mismatch");
  invariant(Object.keys(dist.packs??{}).length>=42,"Developer dist missing pack families");
  return Object.keys(dist.packs).length;
}

async function validateRuntimeMotion() {
  const m=await readJson("moonwitness/runtime-motion-pack/manifest.json");
  invariant(m.count===12,"Runtime motion pack must define 12 motions");
  for(const motion of m.motions??[]) await assertNativeSvg(`moonwitness/runtime-motion-pack/svg/${motion.id}.svg`);
  if(await exists("moonwitness/runtime-motion-pack/generated-manifest.json")){
    const generated=await readJson("moonwitness/runtime-motion-pack/generated-manifest.json");
    invariant((generated.outputs??[]).length===12,"Runtime generated manifest must contain 12 motions");
    for(const item of generated.outputs){
      invariant(await exists(item.apng),`Missing APNG: ${item.apng}`);
      invariant(await exists(item.webm),`Missing WebM: ${item.webm}`);
      invariant(await exists(item.lottie),`Missing Lottie: ${item.lottie}`);
    }
  }
  return m.count;
}

function numeric(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function attr(tag, name) {
  return tag.match(new RegExp(`\\b${name}="([0-9.]+)"`))?.[1] ?? null;
}

async function validateGoldenMobileBounds() {
  const dir = path.join(root, "penpot/golden-cases/mw-0042/visuals/mobile");
  const names = (await readdir(dir)).filter((name) => name.endsWith(".svg")).sort();

  for (const name of names) {
    const relativePath = `penpot/golden-cases/mw-0042/visuals/mobile/${name}`;
    const svg = await readFile(path.join(root, relativePath), "utf8");
    const rootTag = svg.match(/<svg\b[^>]*>/)?.[0] ?? "";
    const width = numeric(attr(rootTag, "width"));
    const height = numeric(attr(rootTag, "height"));
    invariant(width === 390 && height === 844, `Unexpected mobile canvas in ${relativePath}`);

    let maxX = 0;
    let maxY = 0;
    for (const match of svg.matchAll(/<(rect|text|line|circle|ellipse|foreignObject)\b[^>]*>/g)) {
      const tag = match[0];
      const x = numeric(attr(tag, "x"));
      const y = numeric(attr(tag, "y"));
      const w = numeric(attr(tag, "width"));
      const h = numeric(attr(tag, "height"));

      if (x !== null) maxX = Math.max(maxX, x + (w ?? 0));
      if (y !== null) maxY = Math.max(maxY, y + (h ?? 0));

      for (const key of ["x1", "x2", "cx"]) {
        const value = numeric(attr(tag, key));
        if (value !== null) maxX = Math.max(maxX, value);
      }
      for (const key of ["y1", "y2", "cy"]) {
        const value = numeric(attr(tag, key));
        if (value !== null) maxY = Math.max(maxY, value);
      }
    }

    invariant(maxX <= width, `Horizontal overflow in ${relativePath}: ${maxX} > ${width}`);
    invariant(maxY <= height, `Vertical overflow in ${relativePath}: ${maxY} > ${height}`);
  }

  return names.length;
}

const rasterPairs = await validateRasterVectorPairs();
const vectorRasterCoverage = await validateVectorRasterCoverage();
const manifest = await validateManifest();
const brandAssets = await validateBrand();
const applicationScreens = await validateApplicationV2();
const mobileGoldenScreens = await validateGoldenMobileBounds();
const assetPacks = await validateAssetPacks();
const secondaryAssetPacks = await validateSecondaryAssetPacks();
const globalPackCount = await validateGlobalPackIndex();
const developerDistPacks = await validateDeveloperDist();
const runtimeMotions = await validateRuntimeMotion();

console.log(JSON.stringify({
  validAssets: true,
  rasterVectorPairs: rasterPairs,
  vectorRasterCoverage,
  brandAssets,
  applicationScreens,
  mobileGoldenScreens,
  assetPacks,
  secondaryAssetPacks,
  globalPackCount,
  developerDistPacks,
  runtimeMotions,
  manifestVersion: manifest.schemaVersion
}, null, 2));
