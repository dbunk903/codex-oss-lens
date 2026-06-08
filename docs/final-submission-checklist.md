# Final Submission Checklist

Use this checklist immediately before submitting the OpenAI Codex open-source support form.

## Public evidence

- Repository: https://github.com/dbunk903/codex-oss-lens
- Latest release: https://github.com/dbunk903/codex-oss-lens/releases/tag/v1.6.1
- npm package: https://www.npmjs.com/package/codex-oss-lens
- Roadmap: https://github.com/dbunk903/codex-oss-lens/blob/main/ROADMAP.md
- Application status: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/application-status.md
- Reviewer quickstart: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/reviewer-quickstart.md
- API-credit workflow: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/api-credit-workflow.md
- Maintainer use cases: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/maintainer-use-cases.md
- Node CI: https://github.com/dbunk903/codex-oss-lens/actions/workflows/test.yml
- Published smoke CI: https://github.com/dbunk903/codex-oss-lens/actions/workflows/published-smoke.yml

## Local verification

```bash
npm run submission:check
```

Equivalent expanded gates:

```bash
npm test
npm run pack:check
npm run pack:smoke
node src/cli.js public-evidence --markdown public-evidence.md
npm run final-copy:check
npm run submission:versions
npm run application:status
npm run public:redaction
npm run evidence:links
npm run readme:badges
npm exec --yes --package codex-oss-lens@latest -- codex-oss-lens demo
```

## Form fields

- Last name: account owner fills manually.
- First name: account owner fills manually.
- Email: ChatGPT account email.
- GitHub username: `dbunk903`
- GitHub repository URL: `https://github.com/dbunk903/codex-oss-lens`
- Role: Primary maintainer.
- Interest: Project API credits.
- OpenAI organization ID: account owner fills from platform settings.

## Submit gate

- All public links open in a signed-out browser.
- `npm run final-copy:check` confirms the paste-ready Korean answers are within the 500-character limits.
- `npm run submission:versions` confirms release links and version mentions match `package.json`.
- `npm run application:status` confirms the status page includes every public evidence link and manual field.
- `npm run public:redaction` confirms public docs and samples do not expose local paths, raw-log markers, or likely secrets.
- `npm run evidence:links` passes without broken public evidence URLs.
- `npm run readme:badges` confirms README status badges render.
- `npm run submission:check` runs the submit-time local gates as one command.
- The application status page still reflects the latest public release and manual account-owner gates.
- The reviewer quickstart opens and matches the current public release.
- The npm package is still `codex-oss-lens@1.6.1` or newer.
- The publish check sample reflects that a later publish requires npm login plus a version bump.
- The install smoke sample reflects the current npm latest package and any source-vs-published gap.
- The latest Node CI and published smoke CI runs are green.
- The account owner has reviewed the form terms before pressing Submit.
