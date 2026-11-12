# labs/TASKS.md - memstruct

Last updated: 2026-11-11 (the thesis band lands on the content grid; the family gitignore hygiene block).

## Now

- [ ] Manual 0.9.0 npm publish (the 0.x manual lane). The name is free (`npm view memstruct` = E404). `npm publish` runs `prepublishOnly` = `npm run check`, so the battery gates the cut. One-time setup for the 1.x ladder: npmjs.com -> memstruct -> Settings -> Trusted Publisher (repo `dhaupin/memstruct`, workflow `publish.yml`).
- [ ] Fold the maintainer answers on the two bindings: dhaupin/gistory#69 (the equal-timestamp tie-break: sender device id, or content?) and dhaupin/vant#354 (the `id` choice).

## Next (M1)

- [x] The packstruct bindings: the `memory` and `sync` profiles that point at memstruct (dhaupin/packstruct#84; shipped in SPEC v1.2.0, dhaupin/packstruct#87).
- [ ] A `memstruct diff` verb (the JSON Patch / RFC 7386 shape) once a delta payload is asked for.
- [ ] A second-language conformance run: a Python `audit-merge` over the same `conformance/cases/`, to prove the lane is language-neutral in practice, not only in principle.

## Later (M2+)

- [ ] CRDT-class conformance: a case suite that a richer merge (Automerge-style) is graded against, proving the four properties are the norm and LWW is only the reference.
- [ ] Adoption surface: a one-page "how to conform" for a foreign memory system.

---

## 2026-11-08 - the first cut (memstruct minted)

**Trigger.** A public thread asked how to standardize ~50,000 memory systems onto one spec, with git suggested as the substrate. The framing that resolved it: the layer trap - *what is a memory* (schema + verbs) is a different question from *where it lives and merges* (persistence + sync). Git answers the second superbly and is silent on the first.

**Ruling.** The standard is for ALL memory systems, not just the family, so it splits out from the packstruct ESM-default-export binding and takes its own name: **memstruct** (confirmed free on npm).

**Built.** The record format (envelope `id`/`createdAt`/`updatedAt`/`deletedAt`; body host-owned, carried not refused) and the merge contract as four normative properties (convergence, determinism, tombstone semantics, monotonicity). The reference merge is LWW + tombstones over a total order of `(clock, contentHash)`. A language-neutral CLI (`lint`, `merge`, `audit-merge`) and a merge conformance lane. Gate green: 16 merge/lint cases + 16 `node:test` cases; language, action pins, spec/schema, conformance 5/5.

**Receipts, not invention.** The record shape is vant's (`models/public|private/<brain>/`, "git history becomes the memory lineage"). The merge is gistory's (`src/sync/merge.ts`, pure + deterministic + tombstone-aware; `src/lib/models.ts`, optional fields keep old payloads mergeable). The reference swaps gistory's device-id tie-break for a content tie-break, because convergence should be a function of the record alone; the device-id form stays legal when the device id is on the record.

**Shape from a sibling.** Aligned to coreforge's `templates/adopter` canon, not packstruct's older pins: checkout@v7 + setup-node@v7, node 22, and the family release ladder (publish -> release -> verify) with the reusable `release-notes.cjs` / `verify-release.cjs`.

**Filed.** dhaupin/gistory#69 (the `sync` binding), dhaupin/vant#354 (the `memory` binding). Resolution comment on dhaupin/packstruct#84.

**Merge trail.** PR #1 (the first cut) -> PR #2 (canon align) -> PR #3 (receipt links). main == staging == `e41ff4b` at last check.

## 2026-11-08 (later) - the binding ships

The packstruct half landed: **dhaupin/packstruct#87** (`feat/memory-sync-profiles`) merged to staging and promoted to main by fast-forward (`main` == `staging` == `4d3ce64`). packstruct SPEC v1.2.0 declares the two profiles - `memory` (vant's store) and `sync` (gistory's merge) - each LINKING memstruct rather than copying it (the one-address rule). No `schemaVersion` move, no manifest field. The separation of concerns is now the shipped shape: packstruct owns the pack, memstruct owns the record grammar and the merge contract.

Also: the two adoption issues are filed on the engines - **dhaupin/vant#354** (`memory`), **dhaupin/gistory#69** (`sync`) - and the docket row **dhaupin/packstruct#84** carries the resolution + the shipped receipt.

## 2026-11-08 (evening) - the site half ships

The memstruct CF Pages project was looking for a `/web` build and finding none. The answer, from receipts: coreforge's `create` stamps BOTH site halves plus the release/CI plumbing, and the family already has the shape for "published CLI that also ships a site" (crashtest, packstruct). memstruct was missing exactly that: `web/`, `docs/`, and the docs-deploy caller.

**Built.** Stamped the coreforge shell into memstruct (`coreforge create` -> 49 files, skipping the 4 memstruct already owned: `.gitignore`, `publish.yml`, `test.yml`, `package.json`), then rebranded and adapted:

- `web/` - the landing (prestruct prerender -> Cloudflare Pages: root `web`, build `npm run build`, output `dist`). Home, Terms, and Privacy rewritten in the family's plain-language legal canon; `site.config.js` carries the identity; `web/ssr.config.js` sets the ogImage object form so the SEO audit runs clean.
- `docs/` - the docs rig (Jekyll -> GitHub Pages via the one freestruct lane). `index.md` / `cli.md` / `discussions/index.md` / `_data/nav.yml` written from the SPEC's own shape; the four-field frontmatter law (crashtest's variant, not packstruct's five-field) holds.
- `.github/workflows/docs-deploy.yml` (thin caller of `dhaupin/freestruct` docs-lane @ `7dfb1722`) and `staging-ff-sync.yml`.
- `scripts/ship-from-download.cjs` + `test/ship-from-download.test.cjs` - the family's phone publish lane (byte-identical to the family canon, 21 tests pass).
- The docs truth gates (`check-docs-*`, `check-fiction-signatures`, `check-jekyll-filters`) copied from crashtest and wired as `lint:docs`, added to `check`.
- `DEPLOY.md` (the runbook), README "The site" section, AGENTS "The site" section, CHANGELOG Unreleased entry.

**Brand fix.** The shell stamp copies coreforge's own logo and `brand-mark.json` (a known shell behavior - coreforge's fiction gate reads its own files). Replaced with a memstruct mark: two stores converging to one (the merge contract as a glyph), on the petrol/iris palette. PNG ladder + OG card regenerated from it; the leaked coreforge `brand/logo.jpg` removed.

**Verified.** `npm run check` green (37 tests, language, pins, spec, docs, conformance 5/5). `coreforge check` green on memstruct (brand census, theme parity, birth gate; the one fiction hit is the shell gate reading memstruct's own `check-docs-style.cjs` signature line - the same hit crashtest trips, not memstruct's CI gate). `coreforge sync --check` clean. Web build: 3/3 pages rendered, 0 failures, 0 warnings.

**Open (dashboard-side, not in-repo).** Point the existing Cloudflare Pages project at root `web` / build `npm run build` / output `dist`. Set the Pages custom domain `docs.creadev.org` once in the repo's Pages settings. Both are runbook steps in `DEPLOY.md`.

**Follow-up (fix/docs-url).** The docs lane's strict link check failed on the staging push: `docs.creadev.org/memstruct/...` resolved as a path. Root cause: `site.config.js`'s `docs.host`/`docs.url` carried no scheme, so the generated Jekyll `url` and freestruct `site.url` were scheme-less absolute URLs. Siblings (govstruct, packstruct) carry `https://`; memstruct's stamp had it wrong. Fixed both to `https://docs.creadev.org`, re-synced the two generated surfaces.

## 2026-11-03 - the family-canon gap-fill (self-check battery, version truth, family-status@1)

**Trigger.** A speed-run sibling (gamestruct, v1.0.0) showed the family-canon shape in a row; the more-complete siblings (crashtest, packstruct) confirmed which surfaces are canon. memstruct had the core (SPEC, `lint`/`merge`/`audit-merge`, conformance, gates, site, release ladder) but was the only member NOT legible to the family via `family-status@1`, and carried no self-check battery or version-truth census. This session filled those gaps from the siblings, not from memory.

**Built.**

- **The self-check battery.** `src/selfcheck.mjs` - 17 zero-dependency checks proving the four merge properties directly (convergence both ways, associativity, determinism, monotonicity, the tombstone hide/resurrect), the linter's refusals on both sides, and the bundled conformance lane. `labs/battery.json` is its committed contract (`memstruct-battery@1`). New CLI verbs `memstruct check` (runs it) and `memstruct doctor` (proves the merge end to end on a demo store).
- **Version truth.** `test/version-truth.mjs` - package.json is THE single truth; the web rig and the site badge must derive, never hand-copy. It caught two pre-existing drifts on its first run: `web/package.json` carried its own `version: 0.9.0`, and `site.config.js` carried `badge: 'beta'`. Both fixed (the web rig drops the field; the badge derives as `'v' + pkg.version`).
- **The family-status@1 surface.** `web/scripts/build-status.mjs` emits `web/public/status.json` on every web build from two legs: `selfcheck` (the live battery reconciled against `labs/battery.json` - a missing committed check reads MISSING/RED, an unlisted live check reads UNLISTED) and `conformance` (each bundled case, both orders). `web/src/pages/Status.jsx` + `FamilyStatusIsland.jsx` + the `/status` route read the family's served files honestly; `docs/status.md` states the dialect. `test/status.test.mjs` pins the emitter both ways (5 tests).
- **Docs completion.** `why.md`, `what.md`, `about.md`, `search.md` (plus `status.md`), nav rows, and the `check`/`doctor` verbs in `cli.md`.

**Model receipts.** Shape from gamestruct (`lib/selfcheck.mjs`, `labs/battery.json`, `web/scripts/build-status.mjs`, `tests/version-truth.mjs`, the Status page/island, the docs set); the emitter's temp-dir-testable `build(root)` and the dialect fields from packstruct (`test/status.test.mjs`); the badge-derivation rule from gamestruct's `site.config.js`.

**Doctrine check (receipts, not invention).** The gap table was verified against the actual sibling trees, not assumed. Two candidate surfaces were DROPPED as not-canon: `.github/ISSUE_TEMPLATE/` (only packstruct has it; crashtest and gamestruct do not) and `horcrux/` + `scripts/unwrap-prose.cjs` (only crashtest + packstruct; gamestruct lacks both). memstruct's brand census also caught the first nav draft (`Why memstruct`, `What memstruct is` are identity literals in a structural surface); relabelled to the generic `Why` / `What` so `coreforge check` stays green, matching memstruct's own baseline.

**Verified.** `npm run check` green (42 node:test cases + 16 merge/lint cases, language, pins, spec, docs, conformance 5/5, `memstruct check` 17/17). `coreforge sync --check` clean. `coreforge check` green (brand census back to PASS after the nav relabel). Web build: 4/4 pages rendered, 0 failures, 0 warnings.

---

**2026-11-10 - the adopter sweep: #48 / #49 / #35 (coreforge#52 propagation).**

Propagated the coreforge adopter-sweep fixes to this stamped site.

- **#48** - the `.gitignore` docs block now ignores the in-tree Jekyll + pagefind products (`docs/.jekyll-cache/`, `docs/.jekyll-metadata`, `docs/pagefind/`, `docs/pagefind*`), so a local `npm run docs` build leaves no untracked noise.
- **#49** - `docs-deploy.yml` now triggers on `site.config.js`. The docs identity (`docs/_config.yml`, `docs/freestruct.config.yml`) is GENERATED from it by `coreforge sync`, so an identity-only edit is a real docs change the old filter missed.
- **#35** - `test.yml` gains the arm-gated eyestruct row (pinned `eyestruct@1.1.0`, gated on `labs/.eyes/manifest.yml` existing) running the browserless, read-only `eyestruct gate`. Canon stays CI-cut; the battery only refuses drift.
- **Latent gap closed.** `docs/_config.yml` + `docs/freestruct.config.yml` both say "run `npm run sync`", but the script did not exist. Added `sync` / `sync:check` via the pinned `coreforge` CLI, wired `sync:check` into `npm run check`, and declared `coreforge` as a devDependency.

**Receipts.** `npm test` 42/42, `npm run check` green (incl. `sync:check` PASS), edited YAML parses. No version bump; 0.9.0 still held.

---

### 2026-11-03 - session: breadcrumbs on (engine + this site)

Google Search Console showed the family's properties under a breadcrumbs enhancement with 0 results. Recon split the fleet: the docs sites run freestruct (auto BreadcrumbList since 1.1.0); the product sites run prestruct, whose `buildJsonLd()` is site-wide by contract and could never emit a per-route trail. prestruct gained engine-level `breadcrumb: true` (injectMeta already owns the route path); this repo turned the discovery surface on.

- `web/ssr.config.js` - `breadcrumb: true`. `docs/freestruct.config.yml` is generated by the published `coreforge sync` (^0.9.0), so its breadcrumb rides the next coreforge cut; not hand-edited.
- Receipts: docs config validates against the pinned engine; docs sync:check PASS where generated; prestruct's own `example/` build proves emission (BreadcrumbList on a sub-route, none on `/`).
- No version bump; a discovery-surface opt-in.

---

### 2026-11-10 - light mode by default (web + docs)

Owner directive: the family defaults to light. The product sites and docs sites shipped dark-first (a persisted `light` was the opt-in); now light is the first paint and a persisted `dark` theme is the opt-in. Shape: `<html>` pins `data-theme="light"`, the pre-paint bootstrap applies only a persisted `dark`, and the `theme-color` meta flips to the light paper. The CSS token blocks are untouched (the light block is already the second half of one set), so no palette, toggle handler, or gate changed.

- `web/index.html` - `<html data-theme="light">`; two-axis bootstrap applies a persisted `dark`; `theme-color` light (`#edf3f2`); `site.config.js` `defaultMode` dark -> light.
- `docs/_layouts/default.html` - `<html data-theme="light">`; bootstrap inverted; `color-scheme` `light dark`.
- `docs/freestruct.config.yml` and `web/public/site.webmanifest` are generated by the PUBLISHED `coreforge sync` (^0.9.0), so their light defaults ride the next coreforge cut; not hand-edited here.
- Receipts: `npm test` 42/42; `npm run check` green.

## 2026-11-10 - the marketing lander + the docs parity pass

Owner directive: memstruct's product site was a bare hero and the docs were missing the pages its siblings carry. Give it a home lander that markets the standard, and bring web + docs to family parity.

**What shipped.**

- **The lander** (`web/src/pages/Home.jsx`): the bare hero becomes a full marketing page in the family's lander shape - hero + capability chips, a thesis band, who-it-is-for, a why-it-is-needed table (shape / substrate / merge), what-you-get (the four-field envelope + the four merge properties), how-it-works (four steps), the layer trap, grounded-in-shipped-engines (vant / gistory / packstruct), why-builders-adopt, rides-the-rails (MCP / PROV-O / CRDTs), and a final CTA. Every claim cites the shipped standard.
- **Four web pages**: `Start.jsx`, `Why.jsx`, `What.jsx`, `About.jsx` (About carries the Creadev.org link). Routes in `AppLayout.jsx`; nav + route meta in `site.config.js`.
- **The marketing CSS** ported byte-for-byte from the family shell into `web/src/styles.css`: `.band`/`.band-thesis`/`.band-cta`, `.band-kicker`/`.band-line`, `.chips`/`.chip`/`.dot`, `.section-title`, and the inline-code chip rule.
- **Four docs pages**: `start.md`, `contract.md`, `ci.md`, `faq.md`; `docs/index.md` gains a Start-here hub table; `docs/_data/nav.yml` links them all.
- **Root docs**: `README.md` points to the site + docs up top and carries the Creadev.org link; fixed the Node drift (README said Node 20+, `engines` requires >=22). `CONTRIBUTING.md` battery line names the full chain.
- **Fixed a latent gate drift**: `scripts/check-docs-links.cjs` still carried crashtest's `SITE_PREFIX = '/crashtest'`; now `/memstruct`.

**Receipts.** `npm run check` green (17/17 self-checks, docs gates 12 pages, conformance 5/5, sync:check PASS, spec consistency PASS); `npm run build --prefix web` **8/8 pages rendered** (was 4), 0 SEO-audit failures. No version bump (0.9.0); the standard is unchanged (`memstruct@1`).

**Note on the family shape.** The lander/page set is ported from gamestruct's shell (the same family template); the copy is memstruct's own, grounded in `spec/SPEC.md`, `bin/cli.mjs`, and `conformance/cases/`. Receipts, not invention.

## 2026-11-11 - the thesis band lands on the content grid (mobile) + the gitignore hygiene block

Owner report: the thesis band (the accent-ruled pull-quote below the hero) read as a full-bleed bar on mobile - bold text, block edge-to-edge, no margin, "might be missing a css parent container." Owner is mobile-first.

**Root cause (measured).** The accent was a `border-left` on `.band.thesis .wrap`, and `.wrap` is content-box. Desktop centres a 960px `.wrap`, so the rule landed on the grid by luck; a narrow `.wrap` fills the width, so its left border sat flush at x=0 - a full-height 3px bar on the screen edge. Receipt: 390px headless screenshot, accent-column scan found the rule at x=0,1,2.

**Fix (`web/src/styles.css`).** `.band.thesis { padding-left/right: 20px }` gives the band the gutter (rule can never reach the edge; the full-bleed background is untouched since padding is inside the background box), and `.band.thesis .wrap { padding-left: 17px }` keeps `3px border + 17px pad = 20px`, so the band box stays the same 1000px as every section.

**Receipts.** Rebuilt web 8/8 pages, 0 audit failures. Probe: 1280px band `.wrap` x=133 w=1000 == section `.wrap` (`RULE ON GRID: true, BOX MATCH: true`); 390px rule at x=20 (was 0), no horizontal overflow.

**Parity.** gamestruct ships the same defect + markup (it is the sibling the lander CSS was ported from); the identical fix lands there.

**Gitignore.** `.gitignore` gains the family hygiene block (`coverage/`, `.npm/`, `*.log`, `*.swp`, `Thumbs.db`, `.env`/`.env.*` + `!.env.example`). Earlier "status.json untracked leak" flags were a misread of `!!` in `git status --ignored`; `web/public/status.json` was already ignored (line 26). No tracked file is affected. The coreforge template's `.gitignore` still lacks the `status.json` line - flagged for the template pass.

---

## 2026-11-11 - the mobile nav fits the viewport

Owner report (mobile-first): the header overflowed the phone screen and the burger - the only menu control below 640px - sat off-screen. Measured at 390px (headless probe): `document.scrollWidth` 431 vs `clientWidth` 375; the burger at x=397..431. The right cluster (GitHub icon + paint-scheme select + theme switch + burger) needs ~200px against ~144px free after the wordmark.

- **Fix (`web/src/styles.css`, the 640px block).** The decorative badge hides, the gaps tighten (`.nav-inner` 22->8px, `.nav-right` 8->4px), and the wordmark may shrink (`.brand { min-width: 0; overflow: hidden; white-space: nowrap }`). Every control is kept; the row can always fit, so the burger is always reachable.
- **Receipts.** Rebuilt dist probed at 320/360/375/390/414px - no overflow at any width, burger on-screen, all controls present. `npm run check` green.
- **Fleet.** The same defect + fix landed in all 9 sites carrying the family shell (coreforge, crashtest, govstruct, monoforge, poststruct, eyestruct, packstruct, memstruct, gamestruct); coreforge's `templates/site/` carries the same block, so a stamped repo inherits it.
