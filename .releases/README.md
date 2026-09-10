# Immutable Release Evidence

Canonical release evidence is published as GitHub Release assets for each version: deterministic bundle, SHA-256 checksum, generated inventory, and sealed release metadata. Existing semantic tags are never moved.

`.releases/exceptions.json` records only pre-contract migration exceptions. New releases must not be added as exceptions.
