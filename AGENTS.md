# AGENTS.md - memstruct

## Identity
- **Name:** memstruct (the memory standard, frozen at v1)
- **Repo:** dhaupin/memstruct
- **Core law:** refuse the envelope, carry the body
- The standard is a picture of what memory engines already do (vant's store, gistory's merge), not a re-design of them.

## Mechanical conventions (this repo)

- `spec/SPEC.md` is normative; everything in `src/` and `bin/` implements it. A conflict between the two is a bug in `src/`, never a reinterpretation of the spec.
- The linter and the audit are STRICT against spec norms and only those norms. If a check would flag something the spec says is fine, fix the spec or the check: never ship a check the spec does not promise.
- `schema/store-1.json` mirrors the spec's record envelope. `scripts/check-spec-consistency.cjs` refuses when the two drift, so the mirror cannot go stale silently.
- The gate is `npm test && npm run check` (`prepublishOnly`): `check` = `test` + `lint:language` (prose is English-only) + `lint:pins` (every Action ref is a SHA) + `lint:spec` (schema vs spec) + `lint:docs` (the docs truth gates) + `conform` (the merge case audit) + `memstruct check` (the standard's own battery). The registry cut cannot happen without it.
- **The standard carries its own battery.** `src/selfcheck.mjs` is the named battery `memstruct check` runs; `labs/battery.json` is its committed contract (`memstruct-battery@1`). Add a check and name it there in the same commit, or `test/status.test.mjs` refuses the drift. This is the receipt the family-status leg counts, so a silently-deleted check reads RED, never a smaller green.
- **The family-status@1 surface.** `web/scripts/build-status.mjs` emits `web/public/status.json` on every web build (the selfcheck and conformance legs); `web/src/pages/Status.jsx` + `FamilyStatusIsland.jsx` read the family's served files honestly; `docs/status.md` states the dialect. The generated file is gitignored - regeneration IS the freshness.
- **Pins, never floats.** Every GitHub Action `uses:` names a 40-hex commit SHA (tag in the trailing comment), never `@v4`/`@v1`. `npm run lint:pins` refuses a floating ref, so the rule is mechanical. New pins take the family canon SHA the sibling repos already carry.
- Fixtures under `conformance/cases/` carry both sides of every norm: a clean merge plus the conflict, tie, tombstone, and resurrection cases. A new merge norm ships with a case that breaks it, or it is not a norm.
- The merge is pure: `src/merge.mjs` has no I/O, no clock, no randomness. Same inputs, same output. Do not add a device or environment read to it.
- **A memory standard for all is language-neutral.** The interop surface is the CLI (JSON in, JSON out), never a JS import. Do not put a rule in the standard that only a JS implementation can satisfy.
- Generated files never travel: `node_modules/`, `*.tgz`.

## The four properties
- Convergence, determinism, tombstone semantics, monotonicity (SPEC section 4.1). They are normative. The LWW algorithm is the reference, not the requirement: a CRDT-class merge conforms if it satisfies all four.
- The reference tie-break is the record's canonical-JSON SHA-256, because it is a function of the record alone, so convergence holds for any number of devices. A device-id tie-break is legal only when the device id is recorded on the record.

## Release
- 0.9.x is the manual lane (`npm publish` by a human). 1.0.0 and later take the governed family ladder (tag `vX.Y.Z` -> publish/release/verify).
- CHANGELOG.md is Keep-a-Changelog; every PR adds an Unreleased item.

## The site (two faces, one package)
- `web/` is the landing (Cloudflare Pages: root `web`, build `npm run build`, output `dist`); `docs/` is the docs rig (GitHub Pages via the one freestruct lane). The CLI stays the root package; the site lives entirely under `web/`.
- Identity lives once in `site.config.js`. The non-JS surfaces (`docs/_config.yml`, `docs/freestruct.config.yml`, `web/public/robots.txt`, `web/public/site.webmanifest`) are GENERATED from it by the coreforge shell's `sync` verb. Edit `site.config.js`, never a generated surface; a hand edit there is drift.
- The docs truth gates (`npm run lint:docs`) and the landing build run in `test.yml`. `docs-deploy.yml` and `staging-ff-sync.yml` are thin callers of the family lanes.
- `scripts/ship-from-download.cjs` is the family's phone publish lane (the Termux recipe, scripted); `test/ship-from-download.test.cjs` proves it both ways.

## Branches
- `staging` is the permanent integration branch: work branches off it, PRs target it, and promotion to `main` is the only path out. Never delete it.
- Promote by FAST-FORWARD so drift cannot happen: `git push origin staging:main`.

## Family links
- **packstruct** binds memstruct through the `memory` and `sync` profiles (dhaupin/packstruct#84; shipped in SPEC v1.2.0 via dhaupin/packstruct#87).
- **vant** ships the store shape (the `memory` binding, dhaupin/vant#354). **gistory** ships the merge (the `sync` binding, dhaupin/gistory#69).
