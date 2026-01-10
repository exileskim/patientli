# Tokens (Looks)

## Schema

Token schema v1 lives in:
- `src/modules/looks/domain/tokens.schema.ts`

Config documents reference token overrides and practice personalization:
- `src/modules/looks/domain/config.schema.ts`

## Mapping to CSS

The scoped preview mapping is implemented in:
- `src/modules/looks/ui/tokens.ts`

Previews inject CSS variables on a container:
- `style={cssVarsFromLookTokensV1(mergeLookTokensV1(base, overrides))}`

