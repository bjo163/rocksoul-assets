import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const file = path.join(root, "penpot/generated/moonwitness-mw-0042.penpot");

// `unzip` is standard on Linux CI, while Windows ships `tar` with ZIP support.
// Keep the archive verification portable so release validation is identical for
// maintainers on either platform.
const useUnzip = (() => {
  try { execFileSync("unzip", ["-v"], { stdio: "ignore" }); return true; }
  catch { return false; }
})();
const archive = {
  test: () => useUnzip
    ? execFileSync("unzip", ["-t", file], { stdio: "inherit" })
    : execFileSync("tar", ["-tf", file], { stdio: "ignore" }),
  read: (entry) => useUnzip
    ? execFileSync("unzip", ["-p", file, entry], { encoding: "utf8" })
    : execFileSync("tar", ["-xOf", file, entry], { encoding: "utf8" }),
  list: () => useUnzip
    ? execFileSync("unzip", ["-Z1", file], { encoding: "utf8" })
    : execFileSync("tar", ["-tf", file], { encoding: "utf8" }),
};

archive.test();

const manifestText = archive.read("manifest.json");
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

const listing = archive.list()
  .split("\n")
  .map((entry) => entry.trim())
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
