# Office

A living pixel-art office: people and tasks as characters and quests.

## Make it your own

```bash
npx @blkc-code/cli@latest new block my-office --from office
npx @blkc-code/cli@latest dev
```

Edit `example` in `block.json` for the team and quests, and add `cols`, `rows`, `rooms`, `doors` and `furniture` for the building. `render.web.tsx` is the page around the canvas. The drawing itself is in `@blkc-code/render-canvas`, so a fork can change the team and building but not the sprites yet.
