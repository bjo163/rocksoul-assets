# ROCKSOUL Visual System 2.0 — Data Visualization Grammar

Status: **Phase 4/5 chart contract**. Machine-readable source: `moonwitness/visual-system-v2.json`.

Charts communicate measurements; graphs communicate relationships. They share tokens but not visual grammar.

## Global rules

- Axes and gridlines use subordinate hairline optical weight.
- Status colors remain semantic; crimson never represents ordinary magnitude.
- Confidence and uncertainty are separate concepts and use separate encodings.
- Every chart has monochrome/forced-color fallback.
- Annotation and measurement metadata use the canonical mono role.
- Direct labels are preferred over legends when density permits.
- Threshold/boundary lines are visually distinct from data series.

## Chart families

| Family | V2 rule |
| --- | --- |
| line | stable optical line weight; direct labels preferred |
| area | low-opacity fill; uncertainty band remains visible |
| bar | explicit baseline; crimson only for semantic exception |
| stacked bar | stable segment ordering between views |
| heat strip | texture or labels backstop hue |
| donut | limited categories; textual totals required |
| time series | explicit temporal axis and event annotations |
| threshold/boundary | boundary is not styled as a normal value series |
| confidence/uncertainty | interval/band/hatch/fragmentation separate from confidence color |

## ROCKSOUL intervention

ROCKSOUL annotation may add a deliberate handwritten/xerox/tape-style callout in editorial or cinematic presentations, but the underlying measurement marks remain MoonWitness-clean. Operator and forensic charts do not receive decorative grunge.

## Accessibility

Value, status, threshold, and uncertainty cannot rely only on hue. Provide labels, patterns, line styles, or textual equivalents. Motion cannot be required to understand a trend.

## Relationship to graph grammar

Do not use graph node silhouettes as chart markers unless the data point actually represents that semantic entity. Do not use chart color scales to encode provenance or identity edges. `docs/GRAPH-GRAMMAR-V2.md` remains authoritative for relationships.
