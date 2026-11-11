---
permalink: start/
layout: default
title: Start here
description: New to memstruct? Write a store, lint it, reconcile two stores, and grade the merge against the conformance lane - the beginner on-ramp, no prior knowledge assumed.
nav_order: 3
---

# Start here

This page assumes you have never heard of memstruct. It takes about five
minutes and ends with a store you can validate, two stores you can reconcile,
and a merge you can grade against the conformance lane.

## The idea in one sentence

Put your memory records in **one small frozen grammar** - a four-field envelope
plus a body you own - and any two systems that adopt the grammar can exchange
and reconcile memory without a hand-written adapter.

## 1. Write a store

A store is one JSON document. A record carries a four-field envelope; the body
is yours.

```json
{
  "memstruct": 1,
  "records": [
    { "id": "notes/hello", "createdAt": 1730000000000, "updatedAt": 1730000500000,
      "kind": "lesson", "body": "any host-owned shape goes here" }
  ]
}
```

`kind`, `scope`, `body`, `links`, `provenance`, `ttl`, and `meta` are host-owned
- the format carries them and never refuses them. The envelope (`id`,
`createdAt`, `updatedAt`, `deletedAt`) is the part every conforming reader
understands.

## 2. Lint it

`lint` checks the envelope and nothing else: a missing `id`, a non-integer
`createdAt`, a duplicate id. Unknown fields pass, because an unknown field is
data, not a violation.

```bash
npx memstruct lint my-store.json
```

Exit `0` clean, `1` violations, `2` usage.

## 3. Merge two stores

`merge` reconciles two stores under the contract and prints a canonical result
(records sorted by `id`, keys sorted), so it diffs cleanly against a golden.

```bash
npx memstruct merge --local mine.json --remote theirs.json
```

The same inputs always produce the same output, on every device and every run.

## 4. Grade the merge

`audit-merge` runs a directory of cases, each with local, remote, and expected
stores, in **both** input orders - the order-independence leg, which names a
non-deterministic merge instead of passing it.

```bash
npx memstruct audit-merge conformance/cases
npx memstruct doctor
```

`doctor` proves the merge end to end on a demo store and prints the result, so
the contract is shown rather than asserted.

You now have a store any conforming system can read, and a merge any conforming
system can reproduce. That is the whole on-ramp. Next: <a href="{{ '/contract/' | relative_url }}">the merge contract</a> for the normative rules, or <a href="{{ '/cli/' | relative_url }}">the CLI</a> for the full verb table.

<div class="crosslinks">
<p><strong>More in these docs:</strong>
<a href="{{ '/contract/' | relative_url }}">the merge contract</a> ·
<a href="{{ '/what/' | relative_url }}">what</a> ·
<a href="{{ '/cli/' | relative_url }}">the CLI</a> ·
<a href="{{ '/why/' | relative_url }}">why</a></p>
</div>
