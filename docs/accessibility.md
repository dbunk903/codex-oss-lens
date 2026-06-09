# Accessibility Notes

Codex OSS Lens is a static local dashboard, so accessibility work focuses on the browser UI,
generated evidence pages, and the public reviewer screenshots.

## Current Baseline

- The dashboard uses semantic headings, buttons, links, tables, and lists.
- The document language is set to English and includes a responsive viewport meta tag.
- The main dashboard can be reached through a keyboard-visible skip link.
- Reviewer evidence links are grouped in a labelled navigation region.
- Submission gates are exposed as text, not color-only status.
- Desktop and mobile preview screenshots are checked at `1440x1200` and `500x1100`.

## Keyboard Expectations

- `Open report`, `Export weekly`, `API payload`, and `Demo data` must be reachable by tab order.
- The skip link must appear when focused and move focus to the main dashboard content.
- Reviewer evidence links must remain standard anchors so they can be opened, copied, or inspected
  by browser and assistive-technology tooling.

## Review Gate

Run:

```bash
npm run accessibility:readiness
```

That gate checks the accessibility notes, dashboard landmarks, skip link, labelled reviewer
navigation, keyboard-visible controls, mobile viewport support, public documentation links, and CI
wiring.

## Known Limits

- No automated WCAG scanner is bundled; the project remains dependency-free.
- Color contrast is guarded manually through the restrained palette and screenshot review.
- Generated Markdown evidence should still be reviewed in the target renderer before public
  submission if it is pasted into another system.
