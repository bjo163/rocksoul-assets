import { readFile } from "node:fs/promises"; import path from "node:path"
const root = path.resolve(new URL("../..", import.meta.url).pathname.replace(/^\/[A-Z]:/, (m) => m.slice(1))); const wf = await readFile(path.join(root, ".github/workflows/release-gate.yml"), "utf8")
for (const needle of ["Verify generated brand derivatives", "Verify generated secondary pack derivatives", "Verify generated SFX derivatives", "runtime-motion-pack/generated-manifest.json", "git diff --exit-code"]) if (!wf.includes(needle)) throw new Error(`missing freshness gate: ${needle}`)
console.log("freshnessContract brand=true secondary=true sfx=true motion=true failClosed=true")
