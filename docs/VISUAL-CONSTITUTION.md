# Visual Constitution & Golden Corpus

`rocksoul-assets` is the authority for Visual System V2 semantic grammar. UI and Platform consume this contract; they do not redefine its semantics.

## Canonical artifacts

- `moonwitness/visual-constitution/visual-constitution.json` — deterministic cross-signal composition, precedence, channel ownership, compression, and non-inference rules.
- `moonwitness/visual-golden-corpus.json` — synthetic canonical scenarios, invalid fixtures, surface coverage, and deterministic stress seed.
- `tools/assets/validate-visual-constitution.mjs` — fail-closed validation used by repository CI/contracts.

## Resolver boundary

The constitution resolves visual priority only. It does not decide factual truth, permissions, authenticity, approval, or business/research outcomes. Those remain domain concerns supplied as semantic input.

Signals using different visual channels may be double-encoded. A collision on the same channel resolves by salience; lower-salience meaning must remain inspectable. Compact mode compresses before dropping and cannot hide risk/evidence uncertainty behind brand or interaction state.

## Safety invariants

The contract explicitly keeps these meanings separate: permission/authenticity, trusted device/trusted evidence, reviewed/approved, stage/health, change type/importance, AI provenance/epistemic verification, tool success/factual correctness, confidential/forbidden, cross-border/critical, info/brand, selection/verification, and focus/criticality.

## Consumer contract

Consumers should pin an exact assets commit and verify the relevant blob identities. A release must be able to identify which Visual System V2 authority commit and contract blobs it consumed. Consumer-specific rendering remains local; semantic IDs, precedence and invalid inference rules remain upstream-owned.

Run `npm run validate:visual-constitution` before changing either canonical artifact. Changes that modify vocabulary, precedence, compression or invalid fixtures are contract changes and require explicit compatibility review.
