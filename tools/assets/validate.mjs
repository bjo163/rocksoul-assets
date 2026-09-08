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

async function validateRasterVectorPairs() {
  const allFiles = await walk("moonwitness");
  const rasters = allFiles.filter((name) => /\.(png|jpe?g)$/i.test(name)).sort();

  const generatedManifestPath = "moonwitness/brand/generated/manifest.json";
  const generated = await exists(generatedManifestPath)
    ? await readJson(generatedManifestPath)
    : { outputs: [] };
  const generatedSources = new Map(
    (generated.outputs ?? [])
      .filter((item) => /\.(png|jpe?g)$/i.test(item.path ?? ""))
      .map((item) => [item.path, item.source])
  );

  let baselinePairs = 0;
  let generatedPairs = 0;

  for (const raster of rasters) {
    const sameBase = raster.replace(/\.(png|jpe?g)$/i, ".svg");
    if (await exists(sameBase)) {
      await assertNativeSvg(sameBase);
      baselinePairs += 1;
      continue;
    }

    const source = generatedSources.get(raster);
    invariant(source, `Raster asset has no canonical SVG source: ${raster}`);
    await assertNativeSvg(source);
    generatedPairs += 1;
  }

  const baselineDir = "moonwitness/ui/v1/screens";
  const baselineRasters = rasters.filter((item) => item.startsWith(`${baselineDir}/`));
  invariant(baselineRasters.length === 16, `Expected 16 v1 raster baseline screens, got ${baselineRasters.length}`);

  return { total: rasters.length, baselinePairs, generatedPairs };
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
const manifest = await validateManifest();
const brandAssets = await validateBrand();
const applicationScreens = await validateApplicationV2();
const mobileGoldenScreens = await validateGoldenMobileBounds();
const assetPacks = await validateAssetPacks();

console.log(JSON.stringify({
  validAssets: true,
  rasterVectorPairs: rasterPairs,
  brandAssets,
  applicationScreens,
  mobileGoldenScreens,
  assetPacks,
  manifestVersion: manifest.schemaVersion
}, null, 2));
