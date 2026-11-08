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
- The gate is `npm test && npm run check` (`prepublishOnly`): `check` = `test` + `lint:language` (prose is English-only) + `lint:pins` (every Action ref is a SHA) + `lint:spec` (schema vs spec) + `conform` (the merge case audit). The registry cut cannot happen without it.
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

## Branches
- `staging` is the permanent integration branch: work branches off it, PRs target it, and promotion to `main` is the only path out. Never delete it.
- Promote by FAST-FORWARD so drift cannot happen: `git push origin staging:main`.

## Family links
- **packstruct** binds memstruct through the `memory` and `sync` profiles (dhaupin/packstruct#84).
- **vant** ships the store shape (the `memory` binding). **gistory** ships the merge (the `sync` binding).
