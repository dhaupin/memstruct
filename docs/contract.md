---
permalink: contract/
layout: default
title: The contract
description: The normative record format (the four-field envelope) and the merge contract (four observable properties) - the part of memstruct a conforming implementation must honor.
nav_order: 4
---

# The contract

memstruct standardizes two things, and only two: **the record format** (what a
memory record is) and **the merge contract** (what it means to reconcile two
stores). This page is the short form; the normative text is
<a href="https://github.com/dhaupin/memstruct/blob/main/spec/SPEC.md">`spec/SPEC.md`</a>,
and `src/` and `bin/` implement it.

## The record format

A store is one JSON document. It is the unit of exchange.

```json
{
  "memstruct": 1,
  "records": [
    { "id": "01H8Z...", "createdAt": 1730000000000, "kind": "lesson", "body": "..." }
  ]
}
```

`memstruct` is REQUIRED and is the integer `1`. `records` is REQUIRED and is an
array of records. Duplicate `id` values within one store are a violation: a
store is a set keyed by id.

### The envelope

The envelope is the shared-facts column: every conforming reader assigns it
meaning.

| field | rules |
|-------|-------|
| `id` | REQUIRED string, non-empty. Stable and unique within a store. Opaque to the format: a ULID, a UUID, a hash, a path. |
| `createdAt` | REQUIRED integer. Epoch milliseconds. |
| `updatedAt` | OPTIONAL integer. Epoch milliseconds. The merge clock. Absent means `createdAt`. |
| `deletedAt` | OPTIONAL integer or null. Epoch milliseconds. The tombstone. A record carrying `deletedAt` is deleted, not erased. |

### The body

Everything else is host-owned vocabulary. A conforming reader MUST carry each of
these through unchanged, and MUST NOT refuse a record for carrying them:

- `kind` (string): the implementation's own taxonomy.
- `scope` (string): the implementation's own visibility or partition label.
- `body` (string): the payload, typically markdown. A record with no `body` is legal.
- `links` (array of strings): optional graph edges, each an id.
- `provenance` (object): optional; SHOULD follow W3C PROV-O.
- `ttl` (integer or null): optional expiry hint. The format assigns no behavior.
- `meta` (object): optional, host-owned escape hatch.

Any field not listed is also carried through and never refused. That is the
design rule, stated once: **refuse the envelope, carry the body.** It is what
lets a standard for all exist without a committee for every field.

## The merge contract

Reconciliation is the reason memstruct exists. This part is normative, and it is
what makes the standard worth more than a naming convention.

### The four normative properties

A conforming merge MUST satisfy all four. They are stated as properties, not as
an algorithm, so an implementation is free to use a richer merge.

1. **Convergence.** Given the same set of records, the merged result is the same
   on every replica, regardless of the order in which records arrive or stores
   are merged.
2. **Determinism.** Merge is a pure function of its inputs. The same inputs
   produce the same output, on every device, on every run.
3. **Tombstone semantics.** A record with `deletedAt` is hidden from the visible
   set unless it was updated after the deletion (`updatedAt > deletedAt`), in
   which case the update resurrects it.
4. **Monotonicity.** Applying a payload never resurrects a tombstoned record
   without a newer update, and never displaces a newer version of a record with
   an older one.

### The reference algorithm

Each record version carries a **clock**: the later of its last edit and its
deletion, `max(updatedAt ?? createdAt, deletedAt ?? 0)`. The winner of two
versions of one record is decided by a total order:

1. The higher clock wins.
2. Equal clocks break by a deterministic tie-break that is a function of the
   record content alone (the reference uses the lexicographically greater
   canonical-JSON SHA-256), so every replica picks the same winner.

Because the winner is a per-id maximum over a total order, the merge is
commutative and associative: it converges for any number of stores in any order.
The reference lives in
<a href="https://github.com/dhaupin/memstruct/blob/main/src/merge.mjs">`src/merge.mjs`</a>.

### The richer road

A CRDT-class merge (operation-based or state-based, Automerge-style) conforms if
and only if it satisfies all four properties. The properties are normative; the
LWW algorithm is the reference, not the requirement. An implementation MAY break
equal-clock ties by a recorded sender device id, provided the device id is part
of the record, so the tie-break remains a function of the inputs.

## The CLI contract

The interop surface is a command, never an import, so the harness grades any
language identically.

```text
memstruct lint <store.json>                                 # validate; exit 0 / 1 / 2
memstruct merge --local <a.json> --remote <b.json>          # merged store on stdout; exit 0
memstruct audit-merge <case-dir>                            # run the merge cases; exit 0 / 1 / 2
```

An implementation in any language conforms when those three commands exist with
this contract. See <a href="{{ '/cli/' | relative_url }}">the CLI page</a> for the
full verb table, including `check` and `doctor`.

## Versioning

- The format id is `memstruct@<MAJOR>`; this standard is `memstruct@1`. A store
  declares `"memstruct": 1`.
- Additive-first: a new optional field is a MINOR revision and does not move the
  major. Removing, renaming, or changing the meaning of an envelope field is a
  MAJOR bump with a migration note.

<div class="crosslinks">
<p><strong>More in these docs:</strong>
<a href="{{ '/start/' | relative_url }}">start here</a> ·
<a href="{{ '/what/' | relative_url }}">what</a> ·
<a href="{{ '/cli/' | relative_url }}">the CLI</a> ·
<a href="{{ '/status/' | relative_url }}">family status</a></p>
</div>
