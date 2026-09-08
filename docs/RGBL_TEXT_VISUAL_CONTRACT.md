# RGBL textual-intelligence visual contract

Status: design source for Rocksoul TEXT surfaces.

## Semantic hierarchy

```text
WORK → EXPRESSION → EDITION → ARTIFACT → PASSAGE → CONTENT
```

Every node is an independent canonical identity. A visual connection communicates containment/reference only; it does not collapse identities.

## Required visual surfaces

1. **Hierarchy trace** — render all available textual levels and explicitly mark missing levels.
2. **Parallel text lanes** — render exact text with `lang`, script/direction, representation, content ID, artifact and provenance.
3. **Source + rights** — expose dataset/artifact revision, checksum, rights, license and availability when declared.
4. **Relation trace** — visualize explicit alignment, variant, translation and evidence relations. Relation type and method must remain visible in the text equivalent.
5. **Provenance** — source history is inspectable and never inferred from visual resemblance.

## Guardrails

- textual presence ≠ universal authority
- translation ≠ source identity
- similarity ≠ equivalence
- assertion ≠ global fact
- missing ≠ false
- provenance is required

## Source files

Editable vector references live under `penpot/primitives/rgbl/`. Runtime implementations belong in `@rocksoul/ui` and must preserve accessible text equivalents.
