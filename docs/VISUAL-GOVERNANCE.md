# Visual System Governance

Visual System 2.0 governance is fail-closed and machine-readable.

## Authority chain

Canonical governance follows this order:

visual freeze
→ contract/schema registry
→ stable semantic IDs
→ canonical token contract
→ rule registry
→ golden/negative fixtures
→ debt ratchet + waiver ledger
→ design provenance
→ impact graph
→ consumer contract
→ exact-SHA conformance certificate
→ release + post-release integrity audit

## Canonical sources

- moonwitness/tokens/visual-system-v2.json
- moonwitness/contracts/registry.json
- moonwitness/contracts/semantic-ids.json
- moonwitness/contracts/migrations.json
- moonwitness/contracts/dependencies.json
- moonwitness/governance/severity-model.json
- moonwitness/governance/visual-debt-policy.json
- moonwitness/governance/waivers.json
- moonwitness/governance/rule-registry.json
- moonwitness/governance/conformance-policy.json
- moonwitness/governance/manual-attestations.json
- moonwitness/governance/visual-freeze.json
- moonwitness/ai/contribution-policy.json
- moonwitness/fixtures/visual-golden-corpus/corpus.json
- moonwitness/fixtures/visual-governance-negative.json
- moonwitness/provenance/design-decisions.json

Generated evidence is never authoritative input.

## Token model

primitive → semantic → presentation alias

Presentation aliases must retain semanticSource. They cannot become new semantic meanings. In particular informational blue is not brand, selection is not brand, focus is not critical, and failure is not ROCKSOUL identity.

## Rule evidence

Every normative rule has:
- stable rule ID
- source
- owner
- severity
- enforcement type
- validator/manual gate
- fixture
- affected packs/surfaces
- exception eligibility

BLOCKER and ERROR rules require evidence coverage. Manual art-direction review remains manual and cannot be self-approved by automation.

## Debt and waivers

Debt is allowed only when explicitly budgeted. A debt count may decrease or remain within ceiling; it may not silently increase.

Waivers:
- are narrow
- have an owner
- have an approver
- expire
- point to rule IDs and remediation work
- cannot use wildcard/global scope
- cannot waive BLOCKER rules through normal automation

## Provenance

Provenance records observable facts only:
- stable artifact/contract ID
- source path
- semantic owner
- grammar family
- lifecycle
- authoring mode
- authorization reference
- concise rationale
- upstream contracts
- source SHA-256

Private model reasoning and hidden chain-of-thought are not provenance.

## AI contribution boundary

AI/local agents/0dev may implement approved work and run objective validation. They may not:
- self-approve waivers
- lower rule severity
- raise debt ceilings
- silently accept baselines
- delete released IDs without migration
- complete manual review
- invent a new pack when canonical ownership exists
- promote raw visual values over semantic authority

## Release conformance

The release gate derives an exact-SHA certificate.

FULL requires:
- zero BLOCKER findings
- zero ERROR findings
- debt within ceiling
- no expired or blocking waiver
- 100% BLOCKER/ERROR rule traceability
- 100% normative evidence coverage
- complete provenance for current canonical coverage
- registered canonical contracts
- production primitive integrity
- Visual System V2 consumer contract

Publish Release uploads the certificate. Post Release Integrity verifies certificate SHA = release target SHA = immutable tag SHA and verifies the same certificate is inside the deterministic bundle.

## Consumer contract

rocksoul-ui consumes:
- dist/contracts/visual-system.json
- dist/contracts/tokens.css
- dist/contracts/tokens.ts
- dist/contracts/visual-impact.json

Downstream runtime must not redefine upstream semantic truth.
