# Changelog

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- The site half: a landing (`web/`, prestruct prerender -> Cloudflare Pages) and a docs rig (`docs/`, Jekyll -> GitHub Pages), stamped from the coreforge shell and rebranded. Identity lives once in `site.config.js`; the non-JS surfaces derive from it via the shell's `sync` verb.
- `scripts/ship-from-download.cjs` - the family's phone publish lane (the Termux recipe, scripted), with `test/ship-from-download.test.cjs`.
- The docs truth gates (`lint:docs`) and the two thin workflow callers (`docs-deploy.yml`, `staging-ff-sync.yml`).
- `DEPLOY.md` - the deploy + release runbook (two faces, one package).

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
