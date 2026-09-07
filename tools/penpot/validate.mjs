import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const file = path.join(root, "penpot/generated/moonwitness-mw-0042.penpot");

execFileSync("unzip", ["-t", file], { stdio: "inherit" });

const manifestText = execFileSync("unzip", ["-p", file, "manifest.json"], { encoding: "utf8" });
const manifest = JSON.parse(manifestText);

if (manifest.type !== "penpot/export-files") {
  throw new Error(`Unexpected manifest type: ${manifest.type}`);
}
if (manifest.version !== 1) {
  throw new Error(`Unexpected manifest version: ${manifest.version}`);
}
if (!Array.isArray(manifest.files) || manifest.files.length !== 1) {
  throw new Error("Expected exactly one exported Penpot file");
}

const listing = execFileSync("unzip", ["-Z1", file], { encoding: "utf8" })
  .split("\n")
  .filter(Boolean);

const pageFiles = listing.filter((p) => /\/pages\/[^/]+\.json$/.test(p));
const mediaFiles = listing.filter((p) => /\/media\/[^/]+\.json$/.test(p));

if (pageFiles.length !== 3) {
  throw new Error(`Expected 3 page metadata files, got ${pageFiles.length}`);
}
if (mediaFiles.length !== 21) {
  throw new Error(`Expected 21 media entries, got ${mediaFiles.length}`);
}

console.log(JSON.stringify({
  validZip: true,
  manifestType: manifest.type,
  formatVersion: manifest.version,
  fileCount: manifest.files.length,
  pageCount: pageFiles.length,
  mediaCount: mediaFiles.length
}, null, 2));
