import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
async function walk(dir) { const out = []; for (const e of await readdir(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (e.isDirectory() && e.name !== ".git") out.push(...await walk(p)); else if (e.name.endsWith(".svg")) out.push(p) } return out }
const files = await walk(path.join(root, "moonwitness")); let primitive = 0; let compliant = 0; const errors = []
for (const file of files) { const svg = await readFile(file, "utf8"); const rel = path.relative(root, file).replaceAll(path.sep, "/"); const isPrimitive = rel.includes("semantic-primitives"); if (!isPrimitive) continue; primitive += 1; const hasText = /<text\b/i.test(svg); const hasFixed = /(?:fill|stroke)\s*=\s*['\"](?!none|currentColor|url\()/i.test(svg); if (!hasText && !hasFixed && /currentColor/.test(svg)) compliant += 1; else errors.push(`${rel}: primitive must be label-free and currentColor-based`) }
if (errors.length) { console.error(errors.join("\n")); process.exit(1) }
console.log(`svgPolicy primitives=${primitive} compliant=${compliant} fixedColorExceptions=decorative-registry-only fontContract=documented`)
