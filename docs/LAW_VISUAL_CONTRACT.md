# LAW / AWS visual applicability contract

Status: canonical visual semantics for Rocksoul LAW surfaces.

## Principle

> **LEGAL TEXT ≠ APPLICABLE LAW**

Finding a legal text, treaty, regulation, judgment, or other authority is not itself a conclusion that the rule applies to a specific actor, place, time, subject matter, or dispute.

The machine-readable source is:

`moonwitness/ui/v2/legal-intelligence.json`

The generated reference vector is:

`docs/visuals/legal-applicability-system.svg`

## Reviewed result vocabulary

The visual system exposes five possible reviewed result labels:

- `PERMITTED`
- `RESTRICTED`
- `PROHIBITED`
- `DISPUTED`
- `UNRESOLVED`

These are result vocabulary, not automatic classifications. Discovery, retrieval, observability, or a source match must never emit a legal verdict by itself.

## Applicability axes

Every legal applicability surface keeps four axes independently inspectable:

1. **Temporal** — was the instrument or rule in force at the relevant time?
2. **Territorial** — did the rule extend to the relevant place, conduct, forum, or effects?
3. **Personal** — was the relevant actor/entity within the rule's personal scope?
4. **Subject-matter** — did the rule govern the conduct, object, offense, right, or obligation at issue?

A consumer must not collapse these axes into one opaque score.

## Review pipeline

```text
SOURCE → AUTHORITY → APPLICABILITY → COMPETING CLAIMS → HUMAN REVIEW
```

The pipeline keeps provenance, authority, scope, competing positions, exceptions, defenses, and uncertainty visible before a reviewed result is approved.

## Guardrails

- legal text presence does not establish applicability;
- authority does not imply universal scope;
- source discovery does not produce an automatic verdict;
- observability is operational metadata, not legal evidence;
- reviewed legal analysis remains distinct from Mizan and evidence reconstruction.

## Consumer contract

`@rocksoul/ui` mirrors the JSON contract byte-for-byte and exposes reusable legal-applicability components. Product applications consume the UI contract instead of maintaining their own legal state or applicability arrays.

The generated SVG is a reference visualization and documentation artifact. Live product semantics remain accessible HTML/data and must not be encoded only into imagery.
