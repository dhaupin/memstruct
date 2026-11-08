# labs/TASKS.md - memstruct

Last updated: 2026-11-08 (the first cut, built and promoted; the two bindings filed).

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
