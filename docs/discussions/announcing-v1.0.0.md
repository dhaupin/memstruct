---
permalink: discussions/announcing-v1.0.0/
layout: default
title: Announcing memstruct v1.0.0
description: memstruct v1.0.0 freezes the record envelope and the four merge properties, ships the self-check battery and the check/doctor CLI verbs, and stands the package up as its own landing plus docs rig.
version: 1.0.0
---

# Announcing memstruct v1.0.0

memstruct is the record grammar and merge contract the struct family binds by link: a durable markdown store and a pure `merge(local, remote)` with four proven properties. v1.0.0 is the first stable cut - the format is `memstruct@1`, the record envelope and the four merge properties are frozen for v1, and the package now ships a landing site, a docs rig, and a battery that proves the contract bites. This post ships with the v1.0.0 tag: npm has the tarball by the time you read it.

```bash
npm i -g memstruct
```

## What landed

**The self-check battery, and the `check` / `doctor` verbs.** `src/selfcheck.mjs` carries 17 checks proving the four merge properties, the linter's refusals on both sides, and the bundled conformance lane, with the committed contract in `labs/battery.json`. The `memstruct check` and `memstruct doctor` CLI verbs run it, so a consumer can prove the contract on their own tree instead of trusting the prose.

**The family-status@1 surface.** `web/scripts/build-status.mjs` emits `web/public/status.json` on every web build from memstruct's committed battery and conformance cases; `web/src/components/FamilyStatusIsland.jsx` and the `/status` route read the family's served files honestly, and `docs/status.md` states the dialect. memstruct is now legible to the family like every sibling.

**The two faces of one package.** A landing (`web/`, prestruct prerender to Cloudflare Pages) and a docs rig (`docs/`, Jekyll to GitHub Pages), stamped from the coreforge shell and rebranded. Identity lives once in `site.config.js`; the non-JS surfaces derive from it via the shell's `sync` verb. `DEPLOY.md` is the deploy and release runbook.

**The version-truth census, and two drifts it caught.** `test/version-truth.mjs` holds `package.json` as the single version truth: the web rig must not hand-copy it, and the site badge must derive (`badge: 'v' + pkg.version`), never a literal. On its first run it caught two pre-existing drifts in one pass - a hand-copied `version` in `web/package.json` and a hand-copied `badge: 'beta'` in `site.config.js`.

## Also in this round

`scripts/ship-from-download.cjs` brings the family's phone publish lane (the Termux recipe, scripted), the docs truth gates run as `lint:docs`, and the `.gitignore` docs block carries the in-tree pagefind products.

## Links

- Repo and docs: https://github.com/dhaupin/memstruct / https://docs.creadev.org/memstruct
- Release posts: https://docs.creadev.org/memstruct/discussions
- Changelog: https://github.com/dhaupin/memstruct/blob/main/CHANGELOG.md
- Issues: https://github.com/dhaupin/memstruct/issues
