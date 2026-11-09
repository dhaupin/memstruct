---
permalink: what/
layout: default
title: What memstruct is
description: One record format, one merge contract, three verbs, zero dependencies. What ships in the box and the smallest surface two memory systems share.
nav_order: 9
---

# What memstruct is

memstruct is a zero-dependency ESM standard. It defines one record format and
one merge contract, and ships a reference implementation plus a conformance lane
any language can be graded against.

## The record format

A store is one JSON document. A record has a four-field envelope and a
host-owned body:

```json
{
  "memstruct": 1,
  "records": [
    { "id": "01H8Z...", "createdAt": 1730000000000, "kind": "lesson", "body": "..." }
  ]
}
```

The envelope is the shared-facts column every conforming reader assigns meaning
to:

| field | rules |
|-------|-------|
| `id` | REQUIRED string, non-empty. Stable and unique within a store. Opaque to the format. |
| `createdAt` | REQUIRED integer. Epoch milliseconds. |
| `updatedAt` | OPTIONAL integer. Epoch milliseconds. The merge clock. Absent means `createdAt`. |
| `deletedAt` | OPTIONAL integer or null. Epoch milliseconds. The tombstone. A delete is not an erase. |

Everything else (`kind`, `scope`, `body`, `links`, `provenance`, `ttl`, `meta`,
and any field the standard has never heard of) is host-owned vocabulary, carried
through unchanged. **Refuse the envelope, carry the body.**

## The merge contract

Reconciliation is the reason memstruct exists. A conforming merge satisfies four
observable properties:

1. **Convergence** - the same records merge to the same result on every replica, in any order.
2. **Determinism** - merge is a pure function of its inputs.
3. **Tombstone semantics** - a delete hides a record unless it was updated after the deletion, in which case the update resurrects it.
4. **Monotonicity** - an older version never displaces a newer one.

The reference algorithm is last-write-wins plus tombstones, over a total order of
`(clock, contentHash)` where `clock = max(updatedAt ?? createdAt, deletedAt ?? 0)`.
Because the winner is a per-id maximum over a total order, the merge is
commutative and associative. A CRDT-class merge conforms too, if it satisfies the
four properties.

## The verbs

Three commands, language-neutral by construction:

| verb | what it does |
|------|--------------|
| `memstruct lint <store.json>` | validate a store against the record format |
| `memstruct merge --local <a.json> --remote <b.json>` | reconcile two stores under the contract |
| `memstruct audit-merge <case-dir>` | run the merge conformance cases, both input orders |

`memstruct check` runs the standard's own battery and `memstruct doctor` proves
the merge end to end on a demo store. See [the CLI page](/cli/).

## What it is not

memstruct does not standardize the transport (MCP is the wire), the store (git,
a database, a directory: the host's choice), or the vocabulary (host-owned).
It is the record grammar that rides them.

<div class="crosslinks">
<p><strong>More in these docs:</strong>
<a href="{{ '/' | relative_url }}">overview</a> ·
<a href="{{ '/why/' | relative_url }}">why</a> ·
<a href="{{ '/cli/' | relative_url }}">the CLI</a> ·
<a href="{{ '/status/' | relative_url }}">family status</a></p>
</div>
