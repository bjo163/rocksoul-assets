import * as penpot from "@penpot/library";
import { readFile, mkdir } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { Writable } from "node:stream";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const outDir = path.join(root, "penpot/generated");
const outFile = path.join(outDir, "moonwitness-mw-0042.penpot");

const breakpoints = {
  desktop: { width: 1440, height: 1024, page: "06 — Web / Desktop" },
  tablet:  { width: 768,  height: 1024, page: "10 — Responsive / Tablet" },
  mobile:  { width: 390,  height: 844,  page: "10 — Responsive / Mobile" }
};

const screenSlugs = [
  "01-overview",
  "02-evidence",
  "03-correlation",
  "04-aws-legal",
  "05-community",
  "06-platform-review",
  "07-platform-decision"
];

function filterSupportedTokens(node) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return node;
  if ("$value" in node) {
    return ["color", "dimension", "number"].includes(node.$type) ? node : undefined;
  }
  const out = {};
  for (const [key, value] of Object.entries(node)) {
    const filtered = filterSupportedTokens(value);
    if (filtered !== undefined && (typeof filtered !== "object" || Object.keys(filtered).length > 0)) {
      out[key] = filtered;
    }
  }
  return out;
}

async function addSvgBoard(context, { filePath, name, x, y, width, height }) {
  const svg = await readFile(filePath, "utf8");
  const blob = new Blob([svg], { type: "image/svg+xml" });

  const mediaId = context.addFileMedia(
    { name: `${name}.svg`, width, height },
    blob
  );
  const image = context.getMediaAsImage(mediaId);

  context.addBoard({
    name,
    x,
    y,
    width,
    height,
    fills: [{ fillColor: "#0B0B0B", fillOpacity: 1 }],
    strokes: [],
    showContent: true
  });

  context.addRect({
    name: `${name} / Visual Assembly`,
    x,
    y,
    width,
    height,
    fills: [{
      fillImage: { ...image, keepAspectRatio: true },
      fillOpacity: 1
    }],
    strokes: []
  });

  context.closeBoard();
}

await mkdir(outDir, { recursive: true });

const tokensRaw = JSON.parse(
  await readFile(path.join(root, "penpot/tokens/moonwitness.tokens.json"), "utf8")
);
const supportedTokens = filterSupportedTokens(tokensRaw);

const context = penpot.createBuildContext({ referer: "rocksoul-assets/moonwitness" });
context.addFile({ name: "MoonWitness Platform — MW-0042 Golden Slice" });
context.addTokensLib(supportedTokens);

for (const [kind, bp] of Object.entries(breakpoints)) {
  context.addPage({ name: bp.page, background: kind === "desktop" ? "#111111" : "#171717" });

  let y = 0;
  for (const slug of screenSlugs) {
    const svgPath = path.join(
      root,
      "penpot/golden-cases/mw-0042/visuals",
      kind,
      `${slug}.svg`
    );

    await addSvgBoard(context, {
      filePath: svgPath,
      name: `MW-0042 / ${kind.toUpperCase()} / ${slug}`,
      x: 0,
      y,
      width: bp.width,
      height: bp.height
    });

    y += bp.height + 120;
  }

  context.closePage();
}

context.closeFile();

const output = createWriteStream(outFile);
await penpot.exportStream(context, Writable.toWeb(output));

console.log(outFile);
