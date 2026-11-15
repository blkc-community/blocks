# Video

A video section. Content — what the section says:

|| Prop | Type | Notes |
|| heading | string, ≤120 | optional |
|| text | string, ≤280 | optional |
|| url | uri | YouTube, Vimeo or a link ending in .mp4 |
|| caption | string, ≤200 | optional |

Rendered by `VideoBlock` in `@blkc-code/render-web`. See `block.json` for its attributes and an example.

Validate it with:

```sh
bun packages/cli/src/index.ts check external/blkc-community/blocks
```
