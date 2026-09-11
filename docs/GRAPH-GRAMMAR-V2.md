# ROCKSOUL Visual System 2.0 — Graph Grammar

Status: **Phase 4 canonical grammar**. Machine-readable source: `moonwitness/visual-system-v2.json`.

## Principles

MoonWitness graphs are evidence/provenance instruments, not generic node-editor decoration. Geometry, line weight, interruption, direction, dash rhythm, markers, halo, negative space, and layering carry meaning. Color may reinforce a semantic but cannot be the only carrier. Every grammar must remain understandable in grayscale, light/dark modes, and compact views.

## Node grammar

| Semantic | Geometry | Distinguishing treatment |
| --- | --- | --- |
| canonical record | rectangle | solid anchor, strong boundary |
| evidence | diamond | evidence notch |
| source | document tab | source fold |
| person | circle | identity ring |
| event | hexagon | time index |
| story | rounded rectangle | narrative band |
| RGBL text | bracketed rectangle | text frame |
| legal state | cut-corner rectangle | legal boundary, strong cut |
| external reference | open square | outbound marker |
| unresolved record | ghost anchor | fragmented outline |
| inferred/candidate | dashed circle | candidate halo |
| missing record | broken diamond | negative-space break |
| system/provider/resource | stacked rectangle | infrastructure stack |

Node labels, status, and accessible descriptions remain live consumer data. SVG specimens may demonstrate the grammar but may not replace runtime accessible text.

## Edge grammar

| Semantic | Line logic | Marker/rhythm |
| --- | --- | --- |
| supports | solid | forward marker, continuous |
| contradicts | double interruption | opposed marker, cut rhythm |
| references | hairline | open arrow |
| temporal | ribbon | time chevron, directional |
| identity | paired line | identity link |
| legal | boundary line | legal cut |
| provenance | trace/path | trace dot/path rhythm |
| dependency | stepped orthogonal | dependency arrow |
| routes-to | directed line | filled arrow |
| unresolved/candidate | fragmented | ghost end, broken rhythm |

## Strength, confidence, and uncertainty

Correlation strength is encoded through line weight, density, or halo—not hue alone. Uncertainty uses fragmentation, ghosting, dash rhythm, and negative space. Candidate/inferred records must never look identical to canonical records.

## Grayscale contract

A grayscale screenshot must still allow a reviewer to distinguish canonical vs candidate vs missing nodes, support vs contradiction vs provenance edges, and legal boundaries. Any canonical graph asset that fails this test is not Visual System 2.0 compliant.

## Compact contract

At compact size, reduce detail before reducing semantic distinction. Remove decorative texture first; preserve silhouette, line rhythm, direction markers, and state boundary.

## Migration targets

The first canonical assets to refactor after this grammar are event topology, cross-domain relations, provenance chain, correlation network, evidence timeline, evidence matrix, graph nodes/edges, historicity/uncertainty, repository health, activity sparkline, status ring, and architecture topology. Redesign must change composition/geometry where needed, not merely recolor v1 assets.
