import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const registry = JSON.parse(await readFile(path.join(root, "dist/assets.json"), "utf8"));
const semanticRoot = path.join(root, "moonwitness/semantic-primitives-pack/svg");
const semanticFiles = (await readdir(semanticRoot)).filter((file) => file.endsWith(".svg")).sort();
const errors = [];

for (const [id, entry] of Object.entries(registry.packs)) {
  if (entry.classification?.assetKind !== "primitive") continue;
  for (const file of Object.values(entry.svg ?? {})) {
    const raw = await readFile(path.join(root, file), "utf8");
    if (!/viewBox="0 0 24 24"/.test(raw)) errors.push(`${file}: primitive must use a 24px grid`);
    if (!/currentColor/.test(raw)) errors.push(`${file}: primitive must use currentColor`);
    if (/<text\b/i.test(raw)) errors.push(`${file}: primitive must not contain embedded text`);
    if (/fill="#[0-9a-f]{3,8}"/i.test(raw) || /stroke="#[0-9a-f]{3,8}"/i.test(raw)) errors.push(`${file}: primitive contains a fixed color`);
  }
}

const semantic = registry.packs["semantic-primitives"];
if (!semantic || semantic.classification?.assetKind !== "primitive") errors.push("semantic-primitives: missing primitive registry entry");
if (semanticFiles.length !== 16) errors.push(`semantic-primitives: expected 16 SVGs; found ${semanticFiles.length}`);
for (const file of semanticFiles) {
  const id = path.basename(file, ".svg");
  const sizes = Object.keys(semantic?.png?.[id] ?? {}).sort();
  if (sizes.join(",") !== "16,20,24,32") errors.push(`${id}: missing 16/20/24/32 PNG optical-size delivery`);
}

const sprite = await readFile(path.join(root, "dist/sprite.svg"), "utf8");
const symbols = [...sprite.matchAll(/<symbol id="([^"]+)"/g)].map((match) => match[1]);
for (const file of semanticFiles) {
  const id = `mw-semantic-${path.basename(file, ".svg")}`;
  if (!symbols.includes(id)) errors.push(`${id}: missing from production sprite`);
}
if (/<text\b/i.test(sprite) || /(?:fill|stroke)="#[0-9a-f]{3,8}"/i.test(sprite)) errors.push("production sprite contains specimen text or fixed colors");
if (symbols.length !== 60) errors.push(`production sprite must contain 60 approved symbols; found ${symbols.length}`);

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  throw new Error(`Primitive validation failed with ${errors.length} error(s)`);
}

console.log(JSON.stringify({ semanticPrimitives: semanticFiles.length, spriteSymbols: symbols.length, opticalSizes: [16, 20, 24, 32], themeBehavior: "currentColor", status: "PASS" }, null, 2));
