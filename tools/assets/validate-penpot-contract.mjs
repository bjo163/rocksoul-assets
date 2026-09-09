import { readFile } from "node:fs/promises"; import path from "node:path"
const root = path.resolve(new URL("../..", import.meta.url).pathname.replace(/^\/[A-Z]:/, (m) => m.slice(1)))
const primitives = JSON.parse(await readFile(path.join(root, "penpot/primitives/primitives.json"), "utf8")); const components = JSON.parse(await readFile(path.join(root, "penpot/components/components.json"), "utf8"))
const modes = Object.keys(primitives.density ?? {}); if (!["public","community","platform"].every((m) => modes.includes(m))) throw new Error("density modes incomplete")
if (!components.typography?.proposedFamilies?.display || !components.typography?.proposedFamilies?.body || !components.typography?.proposedFamilies?.mono || components.typography.status !== "frozen" || !components.typography.licensing) throw new Error("typography contract incomplete")
if (!Array.isArray(components.components) || components.components.length < 10) throw new Error("component inventory incomplete")
console.log(`penpotContract components=${components.components.length} density=${modes.join(",")} typography=display/body/mono generatedBoards=separate`)
