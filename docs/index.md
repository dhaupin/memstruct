---
permalink: /
layout: default
title: memstruct docs
description: The memory standard - one record format and one merge contract, so any two memory systems exchange memory without a rewrite.
nav_order: 1
---

# memstruct docs

**A memory standard for all.** One record format and one merge contract, so any
two memory systems can exchange memory without a rewrite. This is the docs
head; the normative text lives in
[`spec/SPEC.md`](https://github.com/dhaupin/memstruct/blob/main/spec/SPEC.md).

## The layer trap

"How do we standardize memory" is two questions, not one:

- **What is a memory** (schema and verbs).
- **Where does it live and merge** (persistence and sync).

memstruct answers the first and freezes the merge, and it stays out of the
second: git answers *where memory lives and merges*, and memstruct answers
*what a memory is*. The two compose.

## The record format

Every record carries an envelope: `id`, `createdAt`, optional `updatedAt`,
optional `deletedAt`. The body is host-owned and **carried, never refused** -
refuse the envelope, carry the body. That is what lets a vant brain, a gistory
prompt library, and a store you have never seen sit in the same grammar.

```json
{ "memstruct": 1, "records": [
  { "id": "notes/hello", "createdAt": 1730000000, "updatedAt": 1730000500,
    "body": "any host-owned shape goes here" }
] }
```

## The merge contract

The merge is normative, stated as four observable properties so a richer merge
stays legal:

1. **Convergence** - same records, any order, any replica, same result.
2. **Determinism** - pure; same inputs, same output.
3. **Tombstone semantics** - a delete hides a record unless it was updated
   after the deletion, then the update resurrects it.
4. **Monotonicity** - never resurrect without a newer update; never drop a
   newer record for an older one.

LWW plus tombstones is the reference algorithm; a CRDT-class merge conforms if
it satisfies the properties.

## The CLI

```bash
npx memstruct lint my-store.json
npx memstruct merge --local mine.json --remote theirs.json
npx memstruct audit-merge conformance/cases
```

See [the CLI page](/cli/) for the full verb table, including `check` and
`doctor`.

<div class="crosslinks">
<p><strong>More in these docs:</strong>
<a href="{{ '/why/' | relative_url }}">why</a> ·
<a href="{{ '/what/' | relative_url }}">what</a> ·
<a href="{{ '/cli/' | relative_url }}">the CLI</a> ·
<a href="{{ '/status/' | relative_url }}">family status</a></p>
</div>

