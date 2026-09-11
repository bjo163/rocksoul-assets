# Design Token Audit

Canonical authority: moonwitness/tokens/visual-system-v2.json.

| Metric | Count |
| --- | ---: |
| penpotLeaves | 131 |
| canonicalPrimitiveLeaves | 73 |
| semanticTokens | 11 |
| presentationAliases | 7 |
| sameNameDifferentValueGroups | 19 |
| sameValueAliasGroups | 27 |

## Alias model

primitive -> semantic -> presentation alias is mandatory. Presentation aliases preserve semanticSource and never create a new semantic meaning.

## Compatibility

Additive tokens or aliases are compatible. Semantic value corrections require review. Rename, removal, or semantic reinterpretation is breaking.
