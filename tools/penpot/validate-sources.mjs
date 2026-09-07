import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

async function readJson(relativePath) {
  const absolutePath = path.join(root, relativePath);
  const text = await readFile(absolutePath, "utf8");
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid JSON in ${relativePath}: ${error.message}`);
  }
}

async function mustExist(relativePath) {
  try {
    await access(path.join(root, relativePath));
  } catch {
    throw new Error(`Missing required file: ${relativePath}`);
  }
}

function normalizeRelative(absolutePath) {
  return path.relative(root, absolutePath).split(path.sep).join("/");
}

function svgDimensions(svg, relativePath) {
  const rootTag = svg.match(/<svg\b[^>]*>/)?.[0];
  invariant(rootTag, `Missing <svg> root in ${relativePath}`);

  const width = Number(rootTag.match(/\bwidth="([0-9.]+)"/)?.[1]);
  const height = Number(rootTag.match(/\bheight="([0-9.]+)"/)?.[1]);

  invariant(Number.isFinite(width), `Missing numeric SVG width in ${relativePath}`);
  invariant(Number.isFinite(height), `Missing numeric SVG height in ${relativePath}`);

  return { width, height };
}

const [
  manifest,
  screens,
  responsive,
  visuals,
  goldenCase,
  flow,
  componentStates
] = await Promise.all([
  readJson("manifest.json"),
  readJson("penpot/screens/screens.json"),
  readJson("penpot/responsive/responsive.json"),
  readJson("penpot/golden-cases/mw-0042/visuals/manifest.json"),
  readJson("penpot/golden-cases/mw-0042/case.json"),
  readJson("penpot/golden-cases/mw-0042/flow.json"),
  readJson("penpot/golden-cases/mw-0042/component-states.json")
]);

for (const requiredPath of Object.values(manifest.penpot ?? {})) {
  await mustExist(requiredPath);
}

invariant(Array.isArray(manifest.screens), "manifest.json screens must be an array");
invariant(Array.isArray(screens.screens), "penpot/screens/screens.json screens must be an array");
invariant(manifest.screens.length === 16, `Expected 16 manifest screens, got ${manifest.screens.length}`);
invariant(screens.screens.length === 16, `Expected 16 Penpot screens, got ${screens.screens.length}`);

const expectedIds = Array.from({ length: 16 }, (_, index) => String(index + 1).padStart(2, "0"));
const manifestIds = manifest.screens.map((screen) => screen.id);
const screenIds = screens.screens.map((screen) => screen.id);

invariant(new Set(manifestIds).size === manifestIds.length, "Duplicate screen IDs in manifest.json");
invariant(new Set(screenIds).size === screenIds.length, "Duplicate screen IDs in penpot/screens/screens.json");
invariant(JSON.stringify(manifestIds) === JSON.stringify(expectedIds), "manifest.json screen IDs must be ordered 01 through 16");
invariant(JSON.stringify(screenIds) === JSON.stringify(expectedIds), "Penpot screen IDs must be ordered 01 through 16");

const targetPages = new Set(screens.pages ?? []);
const screenConfigById = new Map(screens.screens.map((screen) => [screen.id, screen]));

for (const screen of manifest.screens) {
  const config = screenConfigById.get(screen.id);
  invariant(config, `Missing Penpot screen config for ID ${screen.id}`);
  invariant(config.slug === screen.slug, `Slug mismatch for screen ${screen.id}`);
  invariant(config.surface === screen.surface, `Surface mismatch for screen ${screen.id}`);
  invariant((config.domain ?? null) === (screen.domain ?? null), `Domain mismatch for screen ${screen.id}`);
  invariant(targetPages.has(config.targetPage), `Unknown target page for screen ${screen.id}: ${config.targetPage}`);

  const expectedFileName = `${screen.id}-${screen.slug}.png`;
  invariant(path.basename(screen.path) === expectedFileName, `Unexpected filename for screen ${screen.id}: ${screen.path}`);
  await mustExist(screen.path);

  const referenceAbsolute = path.resolve(root, "penpot/screens", config.reference);
  invariant(
    normalizeRelative(referenceAbsolute) === screen.path,
    `Reference mismatch for screen ${screen.id}: ${config.reference} -> ${normalizeRelative(referenceAbsolute)}`
  );
}

const referenceFiles = (await readdir(path.join(root, "moonwitness/ui/v1/screens")))
  .filter((name) => name.toLowerCase().endsWith(".png"))
  .sort();

const manifestFiles = manifest.screens.map((screen) => path.basename(screen.path)).sort();
invariant(
  JSON.stringify(referenceFiles) === JSON.stringify(manifestFiles),
  "Visual reference directory and manifest.json screen list are out of sync"
);

const caseIds = [
  goldenCase.case?.id,
  flow.caseId,
  componentStates.caseId,
  visuals.caseId
];
invariant(caseIds.every((id) => id === "MW-0042"), `Golden-case ID mismatch: ${caseIds.join(", ")}`);

invariant(Array.isArray(flow.steps) && flow.steps.length === 7, `Expected 7 MW-0042 flow steps, got ${flow.steps?.length ?? 0}`);
invariant(Array.isArray(visuals.flow) && visuals.flow.length === 7, `Expected 7 visual flow entries, got ${visuals.flow?.length ?? 0}`);

const breakpointToResponsiveFrame = {
  desktop: "wide",
  tablet: "tablet",
  mobile: "mobile"
};

for (const [breakpoint, responsiveFrame] of Object.entries(breakpointToResponsiveFrame)) {
  const dimensions = visuals.breakpoints?.[breakpoint];
  const frame = responsive.frames?.[responsiveFrame];

  invariant(dimensions, `Missing visual breakpoint: ${breakpoint}`);
  invariant(frame, `Missing responsive frame: ${responsiveFrame}`);
  invariant(
    dimensions.width === frame.width,
    `Width mismatch for ${breakpoint}: visuals=${dimensions.width}, responsive=${frame.width}`
  );

  const files = visuals.files?.[breakpoint];
  invariant(Array.isArray(files), `Missing visual file list for ${breakpoint}`);
  invariant(files.length === visuals.flow.length, `Expected ${visuals.flow.length} ${breakpoint} SVGs, got ${files.length}`);

  for (let index = 0; index < visuals.flow.length; index += 1) {
    const relativePath = files[index];
    const expectedSlug = visuals.flow[index];
    invariant(
      path.basename(relativePath) === `${expectedSlug}.svg`,
      `Unexpected ${breakpoint} flow file at index ${index}: ${relativePath}`
    );

    await mustExist(relativePath);
    const svg = await readFile(path.join(root, relativePath), "utf8");
    const actual = svgDimensions(svg, relativePath);

    invariant(
      actual.width === dimensions.width && actual.height === dimensions.height,
      `SVG dimension mismatch in ${relativePath}: expected ${dimensions.width}x${dimensions.height}, got ${actual.width}x${actual.height}`
    );
  }
}

console.log(JSON.stringify({
  validSources: true,
  screenCount: manifest.screens.length,
  goldenCase: "MW-0042",
  responsiveBreakpoints: Object.keys(breakpointToResponsiveFrame),
  visualBoards: visuals.flow.length * Object.keys(breakpointToResponsiveFrame).length
}, null, 2));
