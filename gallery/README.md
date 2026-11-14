# Gallery

A responsive grid of photos. Content — what the section says:

|| Prop | Type | Notes |
|| heading | string, 1-120 | required |
|| intro | string, ≤280 | optional |
|| images | [{ src, alt, caption?, title? }] | src required |
|| size | small · large | small |

Design — how it sits on the page:

|| Prop | Values | Default |
|| size | small, large | small |

Rendered by `GalleryBlock` in `@blkc-code/render-web`. See `block.json` for its attributes and an example.

Validate it with:

```sh
bun packages/cli/src/index.ts check external/blkc-community/blocks
```
