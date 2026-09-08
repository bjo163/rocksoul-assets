import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, "../..")
const contractPath = path.join(root, "moonwitness/ui/v2/legal-intelligence.json")
const outputPath = path.join(root, "docs/visuals/legal-applicability-system.svg")
const check = process.argv.includes("--check")

const contract = JSON.parse(await readFile(contractPath, "utf8"))
const esc = (value) => String(value).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch])
const wrap = (value, max = 58) => {
  const words = String(value).split(/\s+/)
  const lines = []
  let line = ""
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (next.length > max && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines.slice(0, 3)
}

function render() {
  const stateX = [60, 282, 504, 726, 948]
  const states = contract.legalResultStates.map((state, index) => `
    <g transform="translate(${stateX[index]} 132)">
      <rect width="192" height="70" rx="10" fill="#111111" stroke="#3A3A3A" stroke-width="2"/>
      <text x="96" y="30" text-anchor="middle" fill="#F7F4EC" font-family="Inter Tight,Inter,Arial,sans-serif" font-size="18" font-weight="800">${esc(state.label)}</text>
      <text x="96" y="51" text-anchor="middle" fill="#A3A3A3" font-family="IBM Plex Mono,monospace" font-size="10">${esc(state.id)}</text>
    </g>`).join("")

  const axisPositions = [[60, 270], [620, 270], [60, 398], [620, 398]]
  const axes = contract.applicabilityAxes.map((axis, index) => {
    const lines = wrap(axis.question)
    const tspans = lines.map((line, lineIndex) => `<tspan x="22" dy="${lineIndex === 0 ? 0 : 18}">${esc(line)}</tspan>`).join("")
    return `
    <g transform="translate(${axisPositions[index][0]} ${axisPositions[index][1]})">
      <rect width="520" height="104" rx="12" fill="#101010" stroke="#D1132A" stroke-width="2"/>
      <text x="22" y="31" fill="#D1132A" font-family="IBM Plex Mono,monospace" font-size="12" font-weight="700" letter-spacing="1.5">${esc(axis.label.toUpperCase())}</text>
      <text x="22" y="59" fill="#F7F4EC" font-family="Inter,Arial,sans-serif" font-size="14">${tspans}</text>
    </g>`
  }).join("")

  const pipelineX = [60, 276, 492, 708, 924]
  const pipeline = contract.reviewPipeline.map((step, index) => `
    <g transform="translate(${pipelineX[index]} 570)">
      <rect width="192" height="66" rx="10" fill="#111111" stroke="#3A3A3A" stroke-width="2"/>
      <text x="96" y="28" text-anchor="middle" fill="#F7F4EC" font-family="IBM Plex Mono,monospace" font-size="11" font-weight="700">${esc(step.label)}</text>
      <text x="96" y="48" text-anchor="middle" fill="#777777" font-family="IBM Plex Mono,monospace" font-size="9">${esc(step.id)}</text>
    </g>`).join("")

  const arrows = pipelineX.slice(0, -1).map((x) => `<path d="M${x + 192} 603 H${x + 216}" stroke="#D1132A" stroke-width="2"/>`).join("")
  const desc = [
    contract.principle,
    ...contract.applicabilityAxes.map((axis) => `${axis.label}: ${axis.question}`),
    ...contract.legalResultStates.map((state) => `${state.label}: ${state.meaning}`),
    ...contract.guardrails,
  ].join(" ")

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720" role="img" aria-labelledby="title desc">
  <title id="title">MoonWitness LAW applicability system</title>
  <desc id="desc">${esc(desc)}</desc>
  <defs>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#232323" stroke-width="1"/></pattern>
  </defs>
  <rect width="1200" height="720" fill="#090909"/>
  <rect width="1200" height="720" fill="url(#grid)" opacity=".7"/>
  <text x="60" y="48" fill="#F7F4EC" font-family="Inter Tight,Inter,Arial,sans-serif" font-size="24" font-weight="900">LAW / ANGEL WITH SHOTGUN</text>
  <text x="60" y="82" fill="#D1132A" font-family="IBM Plex Mono,monospace" font-size="16" font-weight="700" letter-spacing="2">${esc(contract.principle)}</text>
  <text x="60" y="112" fill="#777777" font-family="IBM Plex Mono,monospace" font-size="10">RESULT VOCABULARY · REVIEWED CONCLUSION ONLY</text>
  ${states}
  <text x="60" y="246" fill="#777777" font-family="IBM Plex Mono,monospace" font-size="10">APPLICABILITY AXES · EACH AXIS MUST REMAIN INSPECTABLE</text>
  ${axes}
  <text x="60" y="548" fill="#777777" font-family="IBM Plex Mono,monospace" font-size="10">REVIEW PIPELINE · DISCOVERY ≠ VERDICT</text>
  <g fill="none">${arrows}</g>
  ${pipeline}
  <text x="60" y="681" fill="#777777" font-family="IBM Plex Mono,monospace" font-size="10">SOURCE AUTHORITY ≠ UNIVERSAL SCOPE · OBSERVABILITY ≠ EVIDENCE · HUMAN REVIEW REMAINS REQUIRED</text>
</svg>\n`
}

const svg = render()
if (check) {
  const current = await readFile(outputPath, "utf8").catch(() => "")
  const required = [
    "MoonWitness LAW applicability system",
    contract.principle,
    ...contract.legalResultStates.flatMap((state) => [state.id, state.label]),
    ...contract.applicabilityAxes.flatMap((axis) => [axis.label, axis.question]),
    ...contract.reviewPipeline.flatMap((step) => [step.id, step.label]),
    ...contract.guardrails,
  ].map(esc)
  const missing = required.filter((token) => !current.includes(token))
  if (!current.includes('data-contract="moonwitness-law-v1"') || missing.length) {
    console.error("LAW applicability visual is stale or semantically incomplete.")
    missing.forEach((token) => console.error(`- missing: ${token}`))
    process.exit(1)
  }
  console.log("LAW applicability visual matches the canonical semantic contract.")
} else {
  await writeFile(outputPath, svg.replace("<svg ", '<svg data-contract="moonwitness-law-v1" '), "utf8")
  console.log(`Generated ${path.relative(root, outputPath)}`)
}
