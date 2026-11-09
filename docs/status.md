---
permalink: status/
layout: default
title: Family status
description: The family-status@1 contract - memstruct serves /status.json generated from its committed battery and conformance cases, and the /status page reads the family's files back honestly.
nav_order: 25
---

# Family status

The members of the struct family each carry legs whose verdicts live in
**committed inputs**, reconciled on every push. The `family-status@1` contract
makes those verdicts readable *across* the family, without a server, without a
dashboard product, and without any trust beyond "the committing repo's own CI ran
its own battery":

1. every member serves a machine-readable status file at the fixed path
   `/status.json` on its site;
2. that file is **generated, never hand-edited**, by the member's own web build,
   straight from committed inputs;
3. every member's status page reads the others' files and renders their numbers
   (or their absence) honestly.

Humans read `/status`; agents and machines read `/status.json`. Both get the
same numbers, because both read the same generated file.

## memstruct's legs

memstruct serves the dialect from the two receipts it actually has:

| leg | input | meaning |
|-----|-------|---------|
| `selfcheck` | `runSelfChecks()` (`src/selfcheck.mjs`, the same 17 checks `memstruct check` runs) | the four merge properties, the linter's refusals on both sides, and the bundled conformance lane |
| `conformance` | `conformance/cases/`, the bundled merge lane | each case run both ways, so convergence is tested rather than asserted |

The emitter runs the self-checks at web-build time and reconciles the live count
against the committed contract (`labs/battery.json`). A verdict is `PASS` only
when the live battery matches the committed shape and every check passes; a
check that silently disappears reads `MISSING` (RED, never a smaller green) and
a live check the contract does not list reads `UNLISTED` too.

## The dialect: `family-status@1`

One JSON object per repo. `schema` is `1`; `contract` is the string
`family-status@1` - a reader that sees either field missing or renamed refuses
and shows "not serving the dialect", never a guessed row.

| field | shape | meaning |
|-------|-------|---------|
| `schema` | `1` | the dialect's schema pin, additive-first |
| `contract` | `"family-status@1"` | the contract name a reader matches |
| `repo` | string | the source repo |
| `site` | string | this member's own status page URL |
| `docs` | string | the docs status page URL |
| `asOf` | string | the git short sha the emitter ran at (or `worktree` with no git context) |
| `legs` | array | `{leg, verdict, cases, counts, ledger}` per leg |
| `packs` | array | the member's packstruct@1 packs, if any |

memstruct ships no packs yet, so `packs` is empty - honestly, not omitted.

## The selfcheck contract

`labs/battery.json` is the committed shape of the standard's own battery
(`contract: memstruct-battery@1`). The emitter reconciles the live run against
that list, so the served dialect can never shrink quietly. Add a check to
`src/selfcheck.mjs` and name it in `labs/battery.json` in the same commit;
`test/status.test.mjs` refuses a contract that does not match the live run.

<div class="crosslinks">
<p><strong>More in these docs:</strong>
<a href="{{ '/' | relative_url }}">home</a> ·
<a href="{{ '/cli/' | relative_url }}">the CLI</a> ·
<a href="{{ '/why/' | relative_url }}">why</a> ·
<a href="{{ '/what/' | relative_url }}">what</a></p>
</div>
