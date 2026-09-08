import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, "../..")
const sourcePath = path.join(root, "moonwitness/ui/v2/research-domains.json")
const outputPath = path.join(root, "docs/visuals/research-domain-ownership.svg")
const check = process.argv.includes("--check")

const source = JSON.parse(await readFile(sourcePath, "utf8"))
const domains = source.domains ?? []
const relationship = source.relationshipLayer
if (domains.length !== 6 || !relationship) throw new Error("Expected six research domains and one relationship layer")

const positions = [
  { x: 84, y: 78 }, { x: 354, y: 54 }, { x: 624, y: 78 },
  { x: 84, y: 356 }, { x: 354, y: 380 }, { x: 624, y: 356 },
]
const center = { x: 372, y: 210, w: 216, h: 120 }
const esc = (value) => String(value).replace(/[&<>\"]/g, (ch) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" })[ch])
const nodeCenter = ({ x, y }) => ({ x: x + 126, y: y + 66 })

const lines = positions.map((pos) => {
  const p = nodeCenter(pos)
  return `<path d="M${center.x + center.w / 2} ${center.y + center.h / 2} L${p.x} ${p.y}"/>`
}).join("")

const nodes = domains.map((item, index) => {
  const { x, y } = positions[index]
  return `<g transform="translate(${x} ${y})"><rect width="252" height="132" rx="12" fill="#101010" stroke="#3A3A3A" stroke-width="2"/><text x="20" y="40" fill="#F7F4EC" font-family="Inter Tight,Inter,Arial,sans-serif" font-size="24" font-weight="800">${esc(item.domain)}</text><text x="20" y="72" fill="#A3A3A3" font-family="IBM Plex Mono,monospace" font-size="13">${esc(item.repository)}</text><text x="20" y="100" fill="#D1132A" font-family="IBM Plex Mono,monospace" font-size="12">${esc(item.prefix)} · ${esc(item.resource)}</text></g>`
}).join("")

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540" role="img" aria-labelledby="title desc"><title id="title">MoonWitness research domain ownership map</title><desc id="desc">Six canonical research domains connect through the Rocksoul Correlation relationship layer. Each domain remains owned by its source repository.</desc><defs><pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#262626" stroke-width="1"/></pattern></defs><rect width="960" height="540" fill="#0B0B0B"/><rect width="960" height="540" fill="url(#grid)" opacity=".7"/><g fill="none" stroke="#5B5B5B" stroke-width="2">${lines}</g>${nodes}<g transform="translate(${center.x} ${center.y})"><rect width="${center.w}" height="${center.h}" rx="14" fill="#111111" stroke="#D1132A" stroke-width="3"/><text x="108" y="38" text-anchor="middle" fill="#D1132A" font-family="IBM Plex Mono,monospace" font-size="11" font-weight="700" letter-spacing="2">RELATIONSHIP LAYER</text><text x="108" y="72" text-anchor="middle" fill="#F7F4EC" font-family="Inter Tight,Inter,Arial,sans-serif" font-size="25" font-weight="800">${esc(relationship.resource.toUpperCase())}</text><text x="108" y="98" text-anchor="middle" fill="#A3A3A3" font-family="IBM Plex Mono,monospace" font-size="10">${esc(relationship.repository)} · ${esc(relationship.prefix)}</text></g><text x="48" y="36" fill="#F7F4EC" font-family="Inter Tight,Inter,Arial,sans-serif" font-size="18" font-weight="800">MOONWITNESS × ROCKSOUL</text><text x="912" y="514" text-anchor="end" fill="#777" font-family="IBM Plex Mono,monospace" font-size="9">SEMANTIC DOMAIN ≠ REPOSITORY IDENTITY · RELATIONSHIPS REMAIN REVIEWED EDGES</text></svg>\n`

if (check) {
  const current = await readFile(outputPath, "utf8").catch(() => "")
  if (current !== svg) {
    console.error("Research-domain ownership visual is stale. Run generator and commit the result.")
    process.exit(1)
  }
  console.log("Research-domain ownership visual is current.")
} else {
  await writeFile(outputPath, svg, "utf8")
  console.log(`Generated ${path.relative(root, outputPath)}`)
}
