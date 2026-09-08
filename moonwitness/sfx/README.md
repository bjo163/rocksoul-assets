# MoonWitness SFX Pack

Short, restrained product sounds for confirmations, alerts, evidence linking, trace discovery, and AI completion.

Canonical source is procedural: `tools/assets/generate-sfx.py`.
Generated delivery formats are WAV + OGG under `generated/`.

SFX must always be optional and never carry semantic meaning without a visual/text equivalent.

OGG exports are generated with ffmpeg bit-exact flags, stripped metadata, and a fixed Ogg serial offset so release CI can verify byte reproducibility.
