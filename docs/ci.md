---
permalink: ci/
layout: default
title: CI and the release ladder
description: What runs on every push, the check battery behind the publish gate, and the two deploy lanes - the landing to Cloudflare Pages and the docs to GitHub Pages.
nav_order: 6
---

# CI and the release ladder

memstruct runs its gates on every push, and the same battery is the publish
gate. A red battery blocks a PR and a publish alike.

## On every push

<a href="https://github.com/dhaupin/memstruct/blob/main/.github/workflows/test.yml">`.github/workflows/test.yml`</a>
runs on pushes and pull requests to `main` and `staging`:

| step | what it proves |
|------|----------------|
| `npm test` | the battery: version truth, the merge property tests, the linter's refusals, and the family-status dialect |
| `npm run check` | the full gate below - the same command `prepublishOnly` runs |
| lint bites both ways | a valid store passes and a broken one refuses, so the check has teeth |
| web build | the landing builds (prestruct prerender), so a broken site red-lights the PR |
| eyestruct gate | armed but parked: it wakes only when a visual home (`labs/.eyes/`) is committed |

## The check battery

`npm run check` is the one gate, and it is what `prepublishOnly` runs before a
publish:

```text
npm test              # the property tests, the linter, the dialect
lint:language         # contributor-facing prose is English-only
lint:pins             # every GitHub Action ref is a 40-hex SHA, never @v4
lint:spec             # schema/store-1.json mirrors spec/SPEC.md
lint:docs             # the docs truth gates (frontmatter, links, style, fiction, Liquid)
conform               # the merge conformance audit, both input orders
sync:check            # the generated surfaces match site.config.js
memstruct check       # the standard's own battery (the four properties + the lane)
```

The linter and the audit are strict against the spec's norms and only those
norms: if a check would flag something the spec says is fine, the spec or the
check is fixed, never shipped as a false gate.

## The two deploy lanes

memstruct is one package with two faces, and each has its own deploy lane.

| face | host | path |
|------|------|------|
| the landing (`web/`) | Cloudflare Pages | <https://memstruct.creadev.org> |
| the docs (`docs/`) | GitHub Pages | <https://docs.creadev.org/memstruct> |

The docs lane is a thin caller of the family's one docs lane
(<a href="https://github.com/dhaupin/freestruct">freestruct</a>); the landing
builds with the <a href="https://github.com/dhaupin/prestruct">prestruct</a>
prerender. Identity lives once in `site.config.js`, and the generated surfaces
(`docs/_config.yml`, `docs/freestruct.config.yml`, `web/public/robots.txt`,
`web/public/site.webmanifest`) are fanned out from it by the shell's `sync`
verb - a hand edit there is drift, refused by `sync:check`.

## The release ladder

0.9.x is the manual lane: a human runs `npm publish`, and `prepublishOnly` runs
the whole battery first, so a red battery cannot mint a tarball. 1.0.0 and later
take the governed family ladder: a `vX.Y.Z` tag drives publish (npm Trusted
Publishing over OIDC, no publish token anywhere), release (the GitHub release
notes extracted from the CHANGELOG's own `[version]` section), and verify.

<div class="crosslinks">
<p><strong>More in these docs:</strong>
<a href="{{ '/cli/' | relative_url }}">the CLI</a> ·
<a href="{{ '/contract/' | relative_url }}">the contract</a> ·
<a href="{{ '/status/' | relative_url }}">family status</a> ·
<a href="{{ '/faq/' | relative_url }}">FAQ</a></p>
</div>
