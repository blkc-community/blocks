# Story

A heading and rich text beside an optional image.

Rendered by `StoryBlock` in `@blkc-code/render-web`. See `block.json` for its attributes and an example.

## Make it your own

```bash
npx @blkc-code/cli@latest new block my-story --from story
npx @blkc-code/cli@latest dev
```

Edit `blocks/my-story/render.web.tsx` and save. To use it on a Kit page, list `my-story` in the Kit's `blocks`.
