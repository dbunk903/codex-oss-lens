# Final Submission Checklist

Use this checklist immediately before submitting the OpenAI Codex open-source support form.

## Public evidence

- Repository: https://github.com/dbunk903/codex-oss-lens
- Latest release: https://github.com/dbunk903/codex-oss-lens/releases/tag/v1.6.1
- npm package: https://www.npmjs.com/package/codex-oss-lens
- Roadmap: https://github.com/dbunk903/codex-oss-lens/blob/main/ROADMAP.md
- Application status: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/application-status.md
- Reviewer quickstart: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/reviewer-quickstart.md
- Release provenance: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/release-provenance.md
- Adoption plan: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/adoption-plan.md
- API-credit workflow: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/api-credit-workflow.md
- Maintainer use cases: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/maintainer-use-cases.md
- Final checklist: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/final-submission-checklist.md
- Final copy: https://github.com/dbunk903/codex-oss-lens/blob/main/application/final-copy.md
- Form draft sample: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/form-draft.sample.md
- Public evidence sample: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/public-evidence.sample.md
- Dashboard preview: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/dashboard-preview.png
- Mobile dashboard preview: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/dashboard-mobile-preview.png
- Publish check sample: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/publish-check.sample.md
- Install smoke sample: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/install-smoke.sample.md
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
npm run reviewer:quickstart
npm run form-draft:sample
npm run publish:samples
npm run publish:docs
npm run dashboard:readiness
npm run ci:readiness
npm run contrib:readiness
npm run security:readiness
npm run support:readiness
npm run conduct:readiness
npm run license:readiness
npm run issue-routing:readiness
npm run release:provenance
npm run adoption:readiness
npm run public:redaction
npm run evidence:sample
npm run evidence:links
npm run readme:badges
npm run readme:readiness
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
- `npm run final-copy:check` confirms the paste-ready Korean answers are within the 500-character limits and the application drafts include reviewer evidence links.
- `npm run submission:versions` confirms release links and version mentions match `package.json`.
- `npm run application:status` confirms the status page and this checklist include every public evidence link and manual field.
- `npm run reviewer:quickstart` confirms the public quickstart includes every reviewer evidence link and signed-out review guidance.
- `npm run form-draft:sample` confirms the public form-draft sample includes every reviewer evidence link and manual submit field.
- `npm run publish:samples` confirms publish-check and install-smoke samples match the current package version and publish gates.
- `npm run publish:docs` confirms npm publishing docs and the publish checklist match the current package and release gates.
- `npm run dashboard:readiness` confirms the public dashboard evidence panel links to reviewer materials and current submit gates.
- `npm run ci:readiness` confirms GitHub Actions still runs the Node matrix, packaged CLI smoke, public evidence, and submission evidence gates.
- `npm run contrib:readiness` confirms CONTRIBUTING, the bug report template, and the PR template include validation and privacy guidance.
- `npm run security:readiness` confirms SECURITY.md and issue templates include vulnerability reporting and sensitive-data guidance.
- `npm run support:readiness` confirms SUPPORT.md, issue templates, README, and package contents include public support guidance.
- `npm run conduct:readiness` confirms CODE_OF_CONDUCT.md, SUPPORT.md, CONTRIBUTING.md, README, and package contents include community guidance.
- `npm run license:readiness` confirms MIT license text, package metadata, README license link, and package contents are aligned.
- `npm run issue-routing:readiness` confirms the GitHub issue chooser routes users to support, security, and conduct guidance before public posting.
- `npm run release:provenance` confirms release, npm, CI, privacy, and source-vs-published package evidence stay aligned.
- `npm run adoption:readiness` confirms the adoption plan and reviewer entry points explain the public validation loop for this young project.
- The dashboard preview PNGs remain `1440x1200` desktop and `500x1100` mobile artifacts.
- `npm run public:redaction` confirms public docs, samples, package metadata, license/support/conduct docs, and GitHub templates/workflows do not expose local paths, raw-log markers, or likely secrets.
- `npm run evidence:sample` confirms the generated public evidence sample matches the current canonical link map.
- `npm run evidence:links` passes without broken public evidence URLs and confirms the public
  preview PNG dimensions.
- `npm run readme:badges` confirms README status badges render.
- `npm run readme:readiness` confirms README submission guidance includes the current public reviewer entry points and local gates.
- `npm run submission:check` runs the submit-time local gates as one command.
- The application status page still reflects the latest public release and manual account-owner gates.
- The reviewer quickstart opens and matches the current public release.
- The npm package is still `codex-oss-lens@1.6.1` or newer.
- The form-draft sample has no TODO reviewer links and matches the current release.
- The publish check sample reflects that a later publish requires npm login plus a version bump.
- The install smoke sample reflects the current npm latest package and any source-vs-published gap.
- The latest Node CI and published smoke CI runs are green.
- The account owner has reviewed the form terms before pressing Submit.
