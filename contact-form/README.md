# Contact form

A form that sends messages to your email. Content — what the section says:

|| Prop | Type | Notes |
|| heading | string, 1-120 | required |
|| subheading | string, ≤280 | optional |
|| submitLabel | string, ≤40 | default "Send message" |
|| successMessage | string, ≤280 | default "Thanks! We'll be in touch." |
|| recipientEmail | email | where the messages are sent |

Rendered by `ContactFormBlock` in `@blkc-code/render-web`. See `block.json` for its attributes and an example.

Validate it with:

```sh
bun packages/cli/src/index.ts check external/blkc-community/blocks
```
