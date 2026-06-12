# Submitter Handoff

Use this handoff when the account owner is ready to open the OpenAI Codex OSS support form. It is
not a public reviewer proof page; it is the last local checklist that separates paste-ready material
from account-owner-only decisions.

## Paste-Ready Inputs

Copy these fields from the checked application draft:

| Form field | Source |
| --- | --- |
| GitHub repository URL | `application/form-answers.md` |
| Interest | `Project API credits` in `application/form-answers.md` |
| Repository fit answer | First Korean answer block in `application/final-copy.md` |
| API credits plan | Second Korean answer block in `application/final-copy.md` |
| Additional information | Third Korean answer block in `application/final-copy.md` |
| Public evidence links | `examples/form-draft.sample.md` and `examples/public-evidence.sample.md` |

Run this before copying:

```bash
npm run final-copy:check
npm run form-answers:check
npm run form-draft:sample
npm run submitter:handoff
```

## Public Evidence Order

Keep these public links open in this order while filling the form:

1. `docs/application-status.md` for the current Ready/Manual/Blocked snapshot.
2. `docs/final-submission-checklist.md` for the full submit-time gate list.
3. `docs/application-evidence-matrix.md` for reviewer-question-to-proof mapping.
4. `docs/reviewer-quickstart.md` and `docs/signed-out-review.md` for fast public review.
5. The npm package, `v1.6.1` release, Node CI, and published smoke CI for installability proof.
6. `application/final-copy.md`, `application/form-answers.md`, and
   `examples/form-draft.sample.md` for paste-ready Korean copy.

Confirm the live package and workflow state before opening the form:

```bash
npm run npm:latest
npm run ci:latest
```

## Account-Owner-Only Inputs

The local tool and automation must not fill or guess these fields:

- Last name
- First name
- Email registered to the ChatGPT account
- GitHub username
- OpenAI organization ID from platform settings
- Terms review and final Submit

## Browser Order

1. Open https://openai.com/ko-KR/form/codex-for-oss/ in the account owner's browser session.
2. Fill the account-owner-only inputs above.
3. Paste the checked public repository URL and three Korean answer blocks.
4. Keep `docs/signed-out-review.md` open in a separate signed-out browser or private window.
5. Run `npm run submission:check`, `npm run npm:latest`, and `npm run ci:latest` one final time
   from the repository root.
6. Stop before pressing Submit unless every local gate passes and the account owner has reviewed the terms.

## Do Not Paste

Do not paste these into the form or public artifacts:

- Raw Codex rollout logs
- Prompts or terminal transcripts
- Source snippets from private workspaces
- Full local filesystem paths
- npm tokens, OpenAI API keys, session cookies, or organization secrets

## Abort Conditions

Do not submit if:

- `npm run submission:check` fails.
- `npm run evidence:links` fails.
- `npm run npm:latest` no longer matches the claimed release.
- `npm run ci:latest` reports red public CI.
- Public CI is red for the current `main` branch.
- npm latest no longer resolves to the claimed `codex-oss-lens@1.6.1` release or newer.
- The signed-out review checklist cannot be completed without private access.
- The account owner has not confirmed the OpenAI organization ID and terms in the submitting browser.
