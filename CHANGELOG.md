# Changelog

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

### Fixed

- The version-truth census caught two pre-existing drifts in one pass: a hand-copied `version` in `web/package.json` and a hand-copied `badge: 'beta'` in `site.config.js`.

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
