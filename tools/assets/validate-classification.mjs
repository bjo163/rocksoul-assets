import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const config = JSON.parse(await readFile(path.join(root, "moonwitness/asset-classification.json"), "utf8"));
let registrySource;
if (process.argv.includes("--registry-stdin")) {
  registrySource = "";
  for await (const chunk of process.stdin) registrySource += chunk;
} else {
  registrySource = await readFile(path.join(root, "dist/assets.json"), "utf8");
}
const registry = JSON.parse(registrySource);
const catalog = JSON.parse(await readFile(path.join(root, "showcase/catalog.json"), "utf8"));
const entries = { ...(registry.packs ?? {}), ...(registry.collections ?? {}) };
const errors = [];
const allowedKinds = new Set(config.assetKinds);
const allowedThemes = new Set(config.themeBehaviors);
const allowedRoles = new Set(config.accessibilityRoles);
const ruleMatches = new Map();

for (const id of Object.keys(entries)) {
  const matches = config.rules.filter((rule) => rule.collectionIds.includes(id));
  ruleMatches.set(id, matches);
  if (matches.length !== 1) errors.push(`${id}: expected exactly one classification rule; found ${matches.length}`);
  if (!catalog.entries?.[id]) errors.push(`${id}: missing showcase catalog entry`);
}

for (const rule of config.rules) {
  for (const id of rule.collectionIds) {
    if (!entries[id]) errors.push(`${rule.id}: unknown collection ${id}`);
  }
}

let visualFiles = 0;
let primitives = 0;
let illustrations = 0;
let specimens = 0;
let screenReferences = 0;

for (const [id, entry] of Object.entries(entries)) {
  const rule = ruleMatches.get(id)?.[0];
  if (!rule) continue;
  const visualPaths = (entry.files ?? []).filter((file) =>
    /\.(svg|png|ico|webm)$/i.test(file) || (file.includes("/lottie/") && file.endsWith(".json"))
  );
  const metadata = entry.visualAssets ?? {};
  if (rule.assetKind === null) {
    if (visualPaths.length) errors.push(`${id}: non-visual rule covers ${visualPaths.length} visual delivery files`);
    continue;
  }
  if (!allowedKinds.has(rule.assetKind)) errors.push(`${id}: invalid assetKind ${rule.assetKind}`);
  if (!Array.isArray(rule.intendedUsage) || !rule.intendedUsage.length) errors.push(`${id}: intendedUsage must be non-empty`);
  if (!Number.isInteger(rule.minimumDisplaySize) || rule.minimumDisplaySize <= 0) errors.push(`${id}: invalid minimumDisplaySize`);
  if (!allowedRoles.has(rule.accessibilityRole)) errors.push(`${id}: invalid accessibilityRole ${rule.accessibilityRole}`);
  if (Object.keys(metadata).length !== visualPaths.length) errors.push(`${id}: metadata=${Object.keys(metadata).length}, visual files=${visualPaths.length}`);

  for (const file of visualPaths) {
    visualFiles++;
    const meta = metadata[file];
    if (!meta) { errors.push(`${file}: missing visual metadata`); continue; }
    if (!allowedKinds.has(meta.assetKind) || meta.assetKind !== rule.assetKind) errors.push(`${file}: incompatible assetKind`);
    if (!allowedThemes.has(meta.themeBehavior)) errors.push(`${file}: invalid themeBehavior ${meta.themeBehavior}`);
    if (!allowedRoles.has(meta.accessibilityRole) || meta.accessibilityRole !== rule.accessibilityRole) errors.push(`${file}: incompatible accessibilityRole`);
    if (!Array.isArray(meta.intendedUsage) || !meta.intendedUsage.length) errors.push(`${file}: missing intendedUsage`);
    if (!Number.isInteger(meta.minimumDisplaySize) || meta.minimumDisplaySize <= 0) errors.push(`${file}: invalid minimumDisplaySize`);
    if (typeof meta.containsText !== "boolean") errors.push(`${file}: containsText must be boolean`);
    if (meta.assetKind === "primitive" && meta.minimumDisplaySize > 64) errors.push(`${file}: primitive minimum size exceeds 64px`);
    if (meta.assetKind === "specimen" && meta.minimumDisplaySize < 120) errors.push(`${file}: specimen minimum size is below 120px`);
    if (meta.assetKind === "screen-reference" && meta.minimumDisplaySize < 320) errors.push(`${file}: screen reference minimum size is below 320px`);
    if (file.endsWith(".svg")) {
      const raw = await readFile(path.join(root, file), "utf8");
      const containsText = /<text\b/i.test(raw);
      const themeBehavior = /currentColor/i.test(raw) ? "currentColor" : /var\(--[a-z0-9-]+/i.test(raw) ? "semantic-token" : "fixed";
      if (meta.containsText !== containsText) errors.push(`${file}: containsText does not match SVG source`);
      if (meta.themeBehavior !== themeBehavior) errors.push(`${file}: themeBehavior does not match SVG source`);
    }
    if (meta.assetKind === "primitive") primitives++;
    if (meta.assetKind === "illustration") illustrations++;
    if (meta.assetKind === "specimen") specimens++;
    if (meta.assetKind === "screen-reference") screenReferences++;
  }
}

if (registry.classificationSchemaVersion !== config.schemaVersion) errors.push("registry classification schema version is stale");
if (registry.coverage?.classifiedVisualFiles !== visualFiles) errors.push("registry classifiedVisualFiles count is stale");
if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  throw new Error(`Asset classification validation failed with ${errors.length} error(s)`);
}

console.log(JSON.stringify({
  classificationSchemaVersion: config.schemaVersion,
  collections: Object.keys(entries).length,
  visualFiles,
  byKind: { primitive: primitives, illustration: illustrations, specimen: specimens, "screen-reference": screenReferences },
  status: "PASS",
}, null, 2));
