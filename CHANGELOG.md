# Changelog

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 2026-11-13 - the release posts were invisible to the SEO pipeline (permalink shape)

Every `docs/discussions/announcing-vX.Y.Z.md` carried a dotted, slashless permalink (`permalink: discussions/announcing-vX.Y.Z`). Jekyll reads the `.0` as a file extension and emits the page EXTENSIONLESS on disk; freestruct's page scanner matches only `.html`/`.htm`, so the posts were invisible to the post-build layer - no sitemap `<loc>`, no og/canonical - though they served 200. The live sitemap listed none of them. The trailing-slash form (`discussions/announcing-vX.Y.Z/`) emits `<slug>/index.html` and is seen. The index is rebuilt: every row links the slash form, ordered newest first, and the stale "staged for the tag" markers are corrected against the registry. Two biting tests in `test/docs-post-permalinks.test.mjs`. Ported from eyestruct (the same bug, fixed there first).


### 2026-11-13 - the /web family matrix (React 19 + Vite 8, prestruct ^1.5.0)

The landing site moves onto the matrix prestruct 1.5.0 published: `react`/`react-dom` `^18.3.1 -> ^19.3.1`, `vite` `^5.4.0 -> ^8.3.7`, `@vitejs/plugin-react` `^4.3.1 -> ^6.3.0`, `prestruct` `^1.3.0 -> ^1.5.0`. The site bakes 8/8 pages with a clean audit on the new matrix.

- **vite 8 is rolldown-based.** `web/vite.config.js` carries `manualChunks` as a FUNCTION (the object form vite <=7 accepted is rejected) and drops `minify: 'esbuild'` (esbuild is unbundled; oxc is the default).
- **The web lane declares a Node floor** (`web/package.json` `engines.node >=20.19`, vite 8's floor). The repo's own battery still runs on Node 18/20; only the site build needs the newer floor.

No version bump; the repo's own landing site, not the shipped surface.


## [1.0.0] - 2026-11-12

### 2026-11-12 - the Dependabot flow lands (railyard#31)

`.github/dependabot.yml` now carries the family flow: a weekly (Monday) pass, grouped minor/patch updates in one pull request, majors alone, and the `github-actions` ecosystem so the SHA-pinned refs move without a hand-edit. npm directories `/`, `/web`. The config header names the family caveat - a tool whose output is committed as canon can have a "minor" release that changes the canon (the eyestruct 1.1.0 overlay case), so a bump arrives as a pull request that runs CI. The shape is proved and guarded on the parent (`dhaupin/creadev` PR #38; `dhaupin/railyard#31`). No version bump.

### 2026-11-12 - the family status grid lights up (CSP connect-src)

Owner report: the `/status` family grid showed a row of "not serving the dialect (Failed to fetch)" for every sibling. **Root cause (measured, not guessed):** each sibling's `/status.json` answered `200` with `access-control-allow-origin: *`, so the server half was correct; the page's own `Content-Security-Policy` carried `connect-src 'self' https://cloudflareinsights.com`, which governs `fetch()` *before* any CORS header is consulted. The browser refused every cross-origin read and the island rendered the refusal as "Failed to fetch". Receipt: headless chromium on `/status` logged `Refused to connect because it violates the document's Content Security Policy` for each sibling.

- `web/public/_headers` - `connect-src` now lists the family member origins the island fetches (`web/src/components/FamilyStatusIsland.jsx`), self excluded. `tests/status.test.mjs` pins the subset, so the island's table and the served CSP can never drift apart silently again (a missing origin now fails by name).

### 2026-11-11 - the mobile nav fits the viewport

Owner report (mobile-first): the header overflowed the phone screen and the burger - the only menu control below 640px - sat off-screen. Measured at 390px (headless probe): `document.scrollWidth` 431 vs `clientWidth` 375, the burger at x=397..431. The right cluster (GitHub icon + paint-scheme select + theme switch + burger) needs ~200px against ~144px free after the wordmark, so the row could not shrink.

- `web/src/styles.css` (the 640px block) - the badge (decorative) hides first, the gaps tighten (`.nav-inner` 22->8px, `.nav-right` 8->4px), and the wordmark may shrink (`.brand { min-width: 0; overflow: hidden; white-space: nowrap }`) so the row always fits; the burger can never land off-screen. Every control is kept.
- Receipts: rebuilt web dist probed at 320/360/375/390/414px - no horizontal overflow at any width, burger on-screen, all controls present; `npm run check` green.

### 2026-11-11 - the thesis band lands on the content grid (mobile)

Owner report: the thesis band - the accent-ruled pull-quote below the hero - rendered as a full-bleed bar on mobile. The text was bold and the block ran edge to edge with no margin, as if the rule were missing its parent container. Owner note: "I'm in mobile more."

**The defect (measured, not guessed).** `.band.thesis .wrap` carried the accent as a `border-left` on `.wrap`, and `.wrap` is content-box. On desktop `.wrap` is capped at 960px and centred, so the rule sat on the content grid by luck. On a narrow viewport `.wrap` fills the width, so its left border landed flush at the viewport edge (x=0) - a 3px accent bar hugging the screen edge for the full height of the band, with the text pushed in by the pad. Rendered at 390px in headless chromium: the rule ran the band's full height at x=0,1,2 (receipt: `--window-size=390,5200` screenshot; accent-column scan found the vertical rule at x=0).

**The fix (`web/src/styles.css`).** Two geometry rules keep the rule on the content grid at every width:
- `.band.thesis { padding-left: 20px; padding-right: 20px; }` - the band carries the `.wrap` gutter on both sides, so the rule can never sit flush against the viewport edge on narrow screens. The band's full-bleed background is unaffected (padding sits inside the background box).
- `.band.thesis .wrap { border-left: 3px solid var(--accent); padding-left: 17px; }` - `3px border + 17px pad = the 20px gutter` every section's `.wrap` uses, so the band box is the same 1000px as its siblings (the old 24px pad made the box 7px wider and nudged the rule off the grid).

**Receipts.** Rebuilt web (8/8 pages, 0 SEO-audit failures). Headless probe at 1280px: band `.wrap` x=133 w=1000, matching section `.wrap` x=133 w=1000 - `RULE ON GRID: true, BOX MATCH: true`. At 390px: the accent rule sits at x=20 (was x=0); no horizontal overflow (`scrollWidth == clientWidth`).

**Also:** `.gitignore` gains the family hygiene block (`coverage/`, `.npm/`, `*.log`, `*.swp`, `Thumbs.db`, `.env`/`.env.*` with `!.env.example`); no tracked file is affected (`git ls-files | git check-ignore --stdin` empty).

**Parity.** The same defect and the same markup ship in gamestruct (the sibling the lander CSS was ported from), so the identical fix lands there too. No version bump (0.9.0); no standard change.

### 2026-11-10 - the marketing lander + the docs parity pass

Owner directive: give memstruct a home lander that markets the standard and fills the web/docs gaps so memstruct is in parity with its siblings. The product site was a bare hero (one page) while every sibling shipped a full lander plus What/Why/About; the docs were missing the on-ramp and reference pages the family carries. This session closes both.

**The lander (`web/src/pages/Home.jsx`).** The bare hero becomes a full marketing page, in the family's lander shape: hero with capability chips, a thesis band, who-it-is-for, a why-it-is-needed table (the shape / the substrate / the merge), what-you-get (the four-field envelope + the four merge properties), how-it-works (four steps), the layer-trap section, a grounded-in-shipped-engines band (vant, gistory, packstruct), why-builders-adopt, a rides-the-rails section (MCP, PROV-O, CRDTs), and a final CTA. Every claim cites the shipped standard (the envelope and the four properties in `spec/SPEC.md`, the verbs in `bin/cli.mjs`, the lane in `conformance/cases/`).

**Four web pages to sibling parity.** `Start.jsx` (the five-minute on-ramp: write, lint, merge, grade), `Why.jsx` (N-squared rewrites and the layer trap), `What.jsx` (the record format, the merge contract, the verbs), and `About.jsx` (the struct family + license, with the Creadev.org link). Routes wired in `AppLayout.jsx`; nav and route meta added in `site.config.js`. The marketing CSS (`.band`, `.chips`, `.section-title`, inline-code chips) is ported byte-for-byte from the family shell into `web/src/styles.css`. Web build green: **8/8 pages rendered** (was 4), SEO audit clean.

**Four docs pages to sibling parity.** `docs/start.md` (the on-ramp), `docs/contract.md` (the normative record format + merge contract), `docs/ci.md` (the check battery, the two deploy lanes, the release ladder), and `docs/faq.md`. `docs/index.md` gains a Start-here hub table; `docs/_data/nav.yml` links every new page.

**Root docs.** `README.md` now points to the site and docs up top and carries the Creadev.org link (top and license); fixed the Node version drift (README said Node 20+, `engines` requires >=22). `CONTRIBUTING.md`'s battery line now names the full chain.

**Fixed a latent gate drift.** `scripts/check-docs-links.cjs` still carried crashtest's `SITE_PREFIX = '/crashtest'` (a port residue); it is now `/memstruct`, so a bad `/memstruct/...` permalink link is actually caught.

- Receipts: `npm run check` green (17/17 self-checks, docs gates 12 pages, conformance 5/5, sync:check PASS, spec consistency PASS); `npm run build --prefix web` 8/8 pages, 0 audit failures.
- No version bump (0.9.0); the standard is unchanged (format `memstruct@1`).

### 2026-11-10 - light mode by default (web + docs)

Owner directive: the family defaults to light. The product sites and docs sites shipped dark-first (a persisted `light` was the opt-in); now light is the first paint and a persisted `dark` theme is the opt-in. Shape: `<html>` pins `data-theme="light"`, the pre-paint bootstrap applies only a persisted `dark`, and the `theme-color` meta flips to the light paper. The CSS token blocks are untouched (the light block is already the second half of one set), so no palette, toggle handler, or gate changed.

- `web/index.html` - `<html data-theme="light">`; two-axis bootstrap applies a persisted `dark`; `theme-color` light (`#edf3f2`); `site.config.js` `defaultMode` dark -> light.
- `docs/_layouts/default.html` - `<html data-theme="light">`; bootstrap inverted; `color-scheme` `light dark`.
- `docs/freestruct.config.yml` and `web/public/site.webmanifest` are generated by the PUBLISHED `coreforge sync` (^0.9.0), so their light defaults ride the next coreforge cut; not hand-edited here.
- Receipts: `npm test` 42/42; `npm run check` green.


### 2026-11-03 - breadcrumbs on (engine + this site)

Google Search Console showed the family's properties under a breadcrumbs enhancement with 0 results. Recon split the fleet: the docs sites run freestruct (auto BreadcrumbList since 1.1.0); the product sites run prestruct, whose `buildJsonLd()` is site-wide by contract and could never emit a per-route trail. prestruct gained engine-level `breadcrumb: true` (injectMeta owns the route path), and this repo turned the discovery surface on in its configs.

- `web/ssr.config.js` - `breadcrumb: true` (active once the prestruct engine feature ships).
- `docs/freestruct.config.yml` is generated by the PUBLISHED `coreforge sync` (^0.9.0), so its `breadcrumb: true` rides the next coreforge cut (the template now carries it); not hand-edited here.
- Receipts: docs config validates against the pinned engine; docs sync:check PASS where generated.
- No version bump; a discovery-surface opt-in.


### Added

- The family-status@1 surface: `web/scripts/build-status.mjs` emits `web/public/status.json` on every web build from memstruct's committed battery and conformance cases; `web/src/components/FamilyStatusIsland.jsx` and the `/status` route read the family's served files honestly; `docs/status.md` states the dialect. memstruct is now legible to the family like every sibling.
- The self-check battery: `src/selfcheck.mjs` (17 checks proving the four merge properties, the linter's refusals on both sides, and the bundled conformance lane) with the committed contract `labs/battery.json`; the `memstruct check` and `memstruct doctor` CLI verbs.
- `test/version-truth.mjs` - the version-truth census (package.json is the single truth; the web rig and the site badge must not hand-copy it).
- `test/status.test.mjs` - the family-status dialect battery (the selfcheck leg reconciles live vs committed; a missing committed check degrades the leg to RED).
- The docs completion: `why.md`, `what.md`, `about.md`, `search.md`, plus `status.md`, and the nav rows that link them.
- The site half: a landing (`web/`, prestruct prerender -> Cloudflare Pages) and a docs rig (`docs/`, Jekyll -> GitHub Pages), stamped from the coreforge shell and rebranded. Identity lives once in `site.config.js`; the non-JS surfaces derive from it via the shell's `sync` verb.
- `scripts/ship-from-download.cjs` - the family's phone publish lane (the Termux recipe, scripted), with `test/ship-from-download.test.cjs`.
- The docs truth gates (`lint:docs`) and the two thin workflow callers (`docs-deploy.yml`, `staging-ff-sync.yml`).
- `DEPLOY.md` - the deploy + release runbook (two faces, one package).

### Changed

- `site.config.js` badge now DERIVES from `package.json` (`badge: 'v' + pkg.version`) instead of a hand-copied literal, so the header cannot drift on a cut.
- `web/package.json` drops its own `version` field (the side package rides the root version; drift is refused, not remembered).
- `docs/cli.md` documents the `check` and `doctor` verbs; `npm run check` now runs `memstruct check` as a final leg.
- The docs identity now has a real sync verb (the coreforge adopter sweep, #48/#49/#35). `docs/_config.yml` and `docs/freestruct.config.yml` already named `npm run sync`, but the script did not exist; `sync` / `sync:check` (via the pinned `coreforge` CLI) are added, `sync:check` is wired into `npm run check`, and `coreforge` is declared as a devDependency. `docs-deploy.yml` now triggers on `site.config.js` (the identity the generated files derive from, issue #49).

### Fixed

- The version-truth census caught two pre-existing drifts in one pass: a hand-copied `version` in `web/package.json` and a hand-copied `badge: 'beta'` in `site.config.js`.
- The `.gitignore` docs block missed the in-tree pagefind products (issue #48); it now carries `docs/pagefind/` and `docs/pagefind*` alongside the Jekyll cache lines.

## [0.9.0] - 2026-11-08

The first cut: the record format, the merge contract, and the conformance lane.

### Added

- `spec/SPEC.md` - the normative standard: the record format (section 3), the merge contract as four observable properties (section 4), the CLI contract (section 5), and conformance (section 6).
- `schema/store-1.json` - the JSON Schema mirror of the record envelope.
- `memstruct lint <store.json>` - validates a store against the record format; unknown fields are carried, never refused.
- `memstruct merge --local <a> --remote <b>` - the reference merge (LWW + tombstones over a total order of `(clock, contentHash)`).
- `memstruct audit-merge <case-dir>` - the sync conformance case kind: runs the merge both ways and asserts order-independence against a golden.
- `conformance/cases/` - five bundled cases: clean, clock-wins, deterministic tie, tombstone-hides, resurrection.
- `test/run.mjs` - the battery: the four merge properties proven directly, plus the linter's refusals on both sides.
- Gates: `scripts/check-language.cjs`, `scripts/check-action-pins.cjs`, `scripts/check-spec-consistency.cjs`.
