import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sourceRoot = path.join(root, "moonwitness/semantic-primitives-pack/svg");
const files = (await readdir(sourceRoot)).filter((file) => file.endsWith(".svg")).sort();
const sizes = [16, 20, 24, 32];
const width = 880;
const rowHeight = 72;
const height = 92 + files.length * rowHeight;
let content = `<rect width="${width}" height="${height}" fill="#F7F4EC"/><rect x="440" width="440" height="${height}" fill="#0B0B0B"/>`;
content += `<g font-family="Arial,sans-serif" font-size="12" font-weight="700"><text x="24" y="34" fill="#0B0B0B">LIGHT / currentColor</text><text x="464" y="34" fill="#F7F4EC">DARK / currentColor</text></g>`;
for (let row = 0; row < files.length; row++) {
  const file = files[row];
  const id = path.basename(file, ".svg");
  const raw = await readFile(path.join(sourceRoot, file), "utf8");
  const inner = raw.replace(/^.*?<svg[^>]*>/s, "").replace(/<\/svg>\s*$/s, "");
  const y = 66 + row * rowHeight;
  content += `<text x="24" y="${y + 22}" fill="#0B0B0B" font-family="monospace" font-size="10">${id}</text>`;
  content += `<text x="464" y="${y + 22}" fill="#F7F4EC" font-family="monospace" font-size="10">${id}</text>`;
  for (const [themeOffset, color] of [[0, "#0B0B0B"], [440, "#F7F4EC"]]) {
    sizes.forEach((size, index) => {
      const x = themeOffset + 196 + index * 58;
      content += `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 24 24" color="${color}">${inner}</svg>`;
    });
  }
}
const output = path.join(root, "docs/generated/semantic-primitives-contact-sheet.svg");
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Semantic primitive optical-size contact sheet">${content}</svg>\n`);
console.log(JSON.stringify({ output: path.relative(root, output).replaceAll("\\", "/"), primitives: files.length, sizes, themes: ["light", "dark"] }, null, 2));
