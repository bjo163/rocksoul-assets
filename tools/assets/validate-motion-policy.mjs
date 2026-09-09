import { readFile, stat } from "node:fs/promises"; import path from "node:path"
const root = path.resolve(new URL("../..", import.meta.url).pathname.replace(/^\/[A-Z]:/, (m) => m.slice(1)))
const pack = JSON.parse(await readFile(path.join(root, "moonwitness/runtime-motion-pack/manifest.json"), "utf8")); const p = pack.policy
if (!p || !p.meaningByKind || !p.durationMs || !p.loop || !p.reducedMotionFallback || !p.criticality || !p.maxBytes) throw new Error("motion policy defaults incomplete")
for (const motion of pack.motions) { if (!p.meaningByKind[motion.kind]) throw new Error(`missing motion meaning: ${motion.id}`); const file = path.join(root, `moonwitness/runtime-motion-pack/svg/${motion.id}.svg`); if ((await stat(file)).size > p.maxBytes) throw new Error(`motion exceeds budget: ${motion.id}`) }
console.log(`motionPolicy motions=${pack.motions.length} reducedMotion=${p.reducedMotionFallback} maxBytes=${p.maxBytes}`)
