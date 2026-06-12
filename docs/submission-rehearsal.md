# Submission Rehearsal

Use this page for the final dry run before the account owner opens the OpenAI Codex OSS support
form. It separates machine-checkable evidence from fields that must remain manual.

## Machine Checks

Run these from the repository root:

```bash
npm run submission:check
npm run evidence:links
npm run npm:latest
npm run ci:latest
npm run submission:rehearsal
```

Expected signals:

- Public reviewer links open from a signed-out browser.
- `application/final-copy.md` still contains three Korean answers under 500 characters.
- `examples/form-draft.sample.md` has no TODO reviewer links.
- Dashboard preview PNGs remain `1440x1200` desktop and `500x1100` mobile artifacts.
- `npm run npm:latest` confirms the live npm dist-tag still matches `package.json`.
- `npm run ci:latest` confirms the latest public Node CI and published smoke CI are green.
- npm latest demo works without private Codex logs through `docs/demo-walkthrough.md`.

## Manual Fields

The CLI must not fill these:

- Last name
- First name
- Email registered to the ChatGPT account
- GitHub username
- OpenAI organization ID from platform settings
- Terms review and final submit

## Browser Rehearsal

1. Open https://openai.com/ko-KR/form/codex-for-oss/ in the account owner's browser session.
2. Fill the manual account fields.
3. Paste the repository URL `https://github.com/dbunk903/codex-oss-lens`.
4. Select `Project API credits`.
5. Paste the three Korean answers from `application/final-copy.md`.
6. Keep `docs/submitter-handoff.md` open to follow the public evidence order in another tab.
7. Stop before pressing Submit unless the account owner has reviewed the terms.

## Abort Conditions

Do not submit if:

- `npm run submission:check` fails.
- `npm run npm:latest` no longer matches the claimed release.
- `npm run ci:latest` reports red public CI.
- Any public evidence link requires a signed-in GitHub session.
- npm latest is not `codex-oss-lens@1.6.1` or newer.
- The account owner has not confirmed the OpenAI organization ID.
- The terms have not been reviewed in the same browser session that will submit the form.
