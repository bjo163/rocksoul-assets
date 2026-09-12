import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const constitutionPath = path.join(root, "moonwitness/visual-constitution/visual-constitution.json")
const corpusPath = path.join(root, "moonwitness/visual-golden-corpus.json")

const constitution = JSON.parse(await fs.readFile(constitutionPath, "utf8"))
const corpus = JSON.parse(await fs.readFile(corpusPath, "utf8"))

const requiredPrinciples = [
  "permission != authenticity",
  "trusted device != trusted evidence",
  "human reviewed != approved",
  "process stage != process health",
  "change type != change importance",
  "AI confidence != epistemic verification",
  "tool success != factual correctness",
  "confidential != forbidden",
  "cross-border != critical",
  "info color != brand color",
  "selection != verification",
  "focus != critical",
]

const signalCategory = {
  epistemic_status: "epistemic",
  trust_status: "trust",
  process_stage: "processStage",
  process_health: "processHealth",
  delta_status: "delta",
  continuity_status: "continuity",
  ai_provenance_status: "aiProvenance",
  human_review_status: "humanReview",
  temporal_state: "temporal",
  interaction: "interaction",
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function parseSignal(signal) {
  const split = signal.indexOf(":")
  assert(split > 0, `invalid signal syntax: ${signal}`)
  return [signal.slice(0, split), signal.slice(split + 1)]
}

function primaryCategory(signals) {
  const categories = new Set(signals.map((signal) => signalCategory[parseSignal(signal)[0]]))
  return constitution.precedence.find((category) => categories.has(category)) ?? null
}

assert(constitution.schema === "rocksoul.visual-constitution.v1", "constitution schema mismatch")
assert(constitution.status === "canonical", "constitution must be canonical")
assert(constitution.authority === "bjo163/rocksoul-assets", "constitution authority mismatch")
assert(constitution.visualSystemVersion === 2, "constitution must target Visual System V2")
for (const principle of requiredPrinciples) assert(constitution.principles.includes(principle), `missing principle: ${principle}`)

const dimensions = Object.keys(signalCategory)
assert(JSON.stringify(Object.keys(constitution.semanticDimensions)) === JSON.stringify(dimensions), "semantic dimension set drift")
assert(new Set(constitution.precedence).size === constitution.precedence.length, "precedence contains duplicates")
assert(constitution.resolver?.deterministic === true, "resolver must be deterministic")
for (const mode of ["compact", "standard", "expanded"]) assert(constitution.compression?.[mode], `missing compression mode ${mode}`)
assert(constitution.compression.invariants.includes("omitted-semantics-remain-inspectable"), "compression must preserve inspectability")
assert(constitution.highRiskScenarios.length >= 8, "high-risk scenario coverage too small")

assert(corpus.schema === "rocksoul.visual-golden-corpus.v1", "corpus schema mismatch")
assert(corpus.status === "canonical", "corpus must be canonical")
assert(corpus.syntheticOnly === true, "corpus must be synthetic-only")
assert(Number.isInteger(corpus.deterministicStressSeed), "corpus stress seed must be deterministic integer")
assert(corpus.scenarios.length >= 20, "corpus requires at least 20 valid scenarios")
assert(corpus.invalidFixtures.length >= 5, "corpus requires at least 5 invalid fixtures")

const requiredSurfaces = ["dashboard", "table-list", "research-trace", "evidence", "workspace", "document-editor", "graph", "timeline-calendar-gantt", "map-spatial", "operator-console", "ai-multimodal"]
for (const surface of requiredSurfaces) {
  assert(corpus.surfaces.includes(surface), `missing surface declaration: ${surface}`)
  assert(corpus.scenarios.some((scenario) => scenario.surface === surface), `surface has no scenario: ${surface}`)
}

const ids = new Set()
for (const scenario of corpus.scenarios) {
  assert(!ids.has(scenario.id), `duplicate corpus id: ${scenario.id}`)
  ids.add(scenario.id)
  assert(["compact", "standard", "expanded"].includes(scenario.density), `${scenario.id}: invalid density`)
  assert(corpus.surfaces.includes(scenario.surface), `${scenario.id}: invalid surface`)
  assert(Array.isArray(scenario.signals) && scenario.signals.length > 0, `${scenario.id}: signals required`)
  for (const signal of scenario.signals) {
    const [dimension, value] = parseSignal(signal)
    assert(dimensions.includes(dimension), `${scenario.id}: unknown dimension ${dimension}`)
    assert(constitution.semanticDimensions[dimension].includes(value), `${scenario.id}: unknown ${dimension} value ${value}`)
  }
  const actualPrimary = primaryCategory(scenario.signals)
  assert(scenario.expected?.primary === actualPrimary, `${scenario.id}: expected primary ${scenario.expected?.primary}, resolved ${actualPrimary}`)
}

for (const fixture of corpus.invalidFixtures) {
  assert(!ids.has(fixture.id), `duplicate fixture id: ${fixture.id}`)
  ids.add(fixture.id)
  assert(fixture.reason && fixture.forbiddenInference, `${fixture.id}: invalid fixture must state reason and forbiddenInference`)
  for (const signal of fixture.signals) {
    const [dimension, value] = parseSignal(signal)
    assert(constitution.semanticDimensions[dimension]?.includes(value), `${fixture.id}: invalid source signal ${signal}`)
  }
}

console.log(`Visual Constitution validated: ${dimensions.length} dimensions, ${constitution.precedence.length} precedence categories.`)
console.log(`Golden Corpus validated: ${corpus.scenarios.length} valid scenarios, ${corpus.invalidFixtures.length} invalid fixtures, ${corpus.surfaces.length} surfaces.`)
