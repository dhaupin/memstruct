# The memstruct spec, version 1

memstruct is a memory standard for all: one record format and one merge contract, so any two memory systems can exchange memory without a rewrite. It is language-neutral by construction. The normative surface is data plus a CLI; nothing here requires JavaScript, or any particular store, transport, or database.

This document is normative. `src/` and `bin/` implement it, and a conflict between the two is a bug in `src/`, not a reinterpretation of this document.

## 1. What this standardizes, and what it does not

It standardizes two things:

- **the record format** (section 3): what a memory record is, and what a store of records is;
- **the merge contract** (section 4): what it means to reconcile two stores, stated as four observable properties.

It does not standardize, and never will at v1:

- the transport. MCP is the wire this rides; memstruct is the record grammar, not a competing protocol.
- the store. git, a database, a vector index, a flat directory: the implementation's choice.
- the vocabulary. `kind`, `scope`, `body`, `provenance`, `ttl`, `meta` are host-owned. Two conforming systems may use entirely different taxonomies and still interoperate, because the envelope is what moves.

The design rule throughout: **refuse the envelope, carry the body.** A missing `id` or a non-integer `createdAt` is a violation. An unknown field is data, carried through unchanged, never refused.

## 2. Versioning

- The format id is `memstruct@<MAJOR>`; this document is `memstruct@1`. A store declares `"memstruct": 1`.
- Additive-first: a new optional field is a MINOR revision and does not move the major. Removing, renaming, or changing the meaning of an envelope field is a MAJOR bump with a migration note.
- A host or implementation acknowledges the version it implements with `implements: memstruct@1` (or an exact pin), following the family's `implements` discipline.
- The record format and the reference tool decouple: a new `memstruct lint` check under the same frozen schema is a TOOL version bump that leaves this document's `1` alone.

## 3. The record format

### 3.1 A record

A record is a JSON object. The envelope is the shared-facts column: every conforming reader assigns it meaning.

| Field | Rules |
|---|---|
| `id` | REQUIRED string, non-empty. Stable and unique within a store. Opaque to the format: a ULID, a UUID, a hash, a path. |
| `createdAt` | REQUIRED integer. Epoch milliseconds. |
| `updatedAt` | OPTIONAL integer. Epoch milliseconds. The merge clock. Absent means `createdAt` (the `updatedAt ?? createdAt` rule). |
| `deletedAt` | OPTIONAL integer or null. Epoch milliseconds. The tombstone. A record carrying `deletedAt` is deleted, not erased. |

The body is host-owned. A conforming reader MUST carry every one of these fields through unchanged and MUST NOT refuse a record for carrying them:

- `kind` (string): the implementation's own taxonomy.
- `scope` (string): the implementation's own visibility or partition label.
- `body` (string): the payload, typically markdown. A record with no `body` is legal (a link or index record).
- `links` (array of strings): optional graph edges, each an id.
- `provenance` (object): optional; SHOULD follow W3C PROV-O.
- `ttl` (integer or null): optional expiry hint. The store's policy decides what to do with it; the format assigns no behavior.
- `meta` (object): optional, host-owned escape hatch. Carried through, never refused.

Any field not listed here is also carried through and never refused (`additionalProperties: true`). This is the property that lets a standard for all exist without a committee for every field.

### 3.2 A store

A store is one JSON document. It is the unit of exchange.

```json
{
  "memstruct": 1,
  "records": [
    { "id": "01H8Z...", "createdAt": 1730000000000, "kind": "lesson", "body": "..." }
  ]
}
```

- `memstruct` REQUIRED, integer `1`.
- `records` REQUIRED, array of records. MAY be empty.
- Duplicate `id` values within one store are a violation (`record-id-duplicate`): a store is a set keyed by id.

The normative shape is `schema/store-1.json` (JSON Schema 2020-12). The prose here governs; the schema is the machine-readable mirror.

### 3.3 What is NOT a violation

- an unknown field at the store level or the record level;
- a record with no `body`;
- a `kind`, `scope`, `ttl`, or `provenance` the reader does not recognize;
- an empty `records` array.

## 4. The merge contract

Reconciliation is the reason memstruct exists. This section is normative and is the part that makes the standard worth more than a naming convention. memstruct owns this contract, so a defect in it is a spec defect.

### 4.1 The four normative properties

A conforming merge MUST satisfy all four. They are stated as properties, not as an algorithm, so an implementation is free to use a richer merge (section 4.3).

1. **Convergence.** Given the same set of records, the merged result is the same on every replica, regardless of the order in which records arrive or stores are merged.
2. **Determinism.** Merge is a pure function of its inputs. The same inputs produce the same output, on every device, on every run.
3. **Tombstone semantics.** A record with `deletedAt` is hidden from the visible set unless the record was updated after the deletion (`updatedAt > deletedAt`), in which case the update resurrects it.
4. **Monotonicity.** Applying a payload never resurrects a tombstoned record without a newer update, and never displaces a newer version of a record with an older one.

### 4.2 The reference algorithm (LWW plus tombstones)

The algorithm every implementation can copy, and the one the family's shipped engines already hold.

Each record version carries a **clock**: the later of its last edit and its deletion, `max(updatedAt ?? createdAt, deletedAt ?? 0)`. The winner of two versions of one record is decided by a **total order**:

1. The higher clock wins.
2. Equal clocks break by a deterministic tie-break that is a function of the record content alone (the reference uses the lexicographically greater canonical-JSON SHA-256), so every replica picks the same winner without needing to know which device sent what.

Because the winner is a per-id maximum over a total order, the merge is commutative and associative: it converges for any number of stores in any order. Tombstones are ordinary records in the same space, so deletion propagates by the same rule, and property 3 follows from the clock definition (a deletion sets `deletedAt`, raising the clock; a later edit raises it again and wins).

The reference merge is `src/merge.mjs`. Its output is canonical: records sorted by `id`, keys sorted, so a merged store diffs cleanly against a golden.

### 4.3 The richer road

A CRDT-class merge (operation-based or state-based, Automerge-style) conforms if and only if it satisfies all four properties of section 4.1. The properties are normative; the LWW algorithm is the reference, not the requirement. This admits the academic answer to concurrent semantic writes without freezing every implementation on timestamps.

An implementation MAY break equal-clock ties by a recorded sender device id (the family's shipped merge does) provided the device id is part of the record, so the tie-break remains a function of the inputs and convergence holds.

## 5. The CLI contract

The interop surface is a command, never an import, so the harness grades any language identically.

```text
memstruct lint <store.json>                                   # validate; exit 0 / 1 / 2
memstruct merge --local <a.json> --remote <b.json>            # merged store on stdout; exit 0
memstruct audit-merge <case-dir>                              # run the merge conformance cases; exit 0 / 1 / 2
```

- `merge` reads two stores and writes one merged store to stdout. JSON in, JSON out. No network. No host config. Exit 0.
- The exit ladder is shared across verbs: `0` clean, `1` violations or mismatch, `2` usage error.
- An implementation in any language conforms if these three commands exist with this contract.

## 6. Conformance

Two commands grade an implementation, both language-neutral.

- `memstruct lint <store.json>` grades the record format: envelope fields present and typed, no duplicate ids, unknown fields carried rather than refused.
- `memstruct audit-merge <case-dir>` grades the merge contract. Each case is a directory carrying `local.json`, `remote.json`, and `expected.json`. The audit runs the merge **both ways** (`merge(local, remote)` and `merge(remote, local)`) and asserts each equals `expected`. Running both orders is the order-independence leg: a merge that is not deterministic, or not commutative, is named instead of passing.

Bundled cases under `conformance/cases/`: a clean merge; a conflict resolved by the clock; a tie broken deterministically; a tombstone that hides a record; a tombstone plus a later update that resurrects. Because the case kind is pure data in and pure data out, it grades a Python or Go implementation identically to the JS reference.

A packstruct host's `sync` binding is graded against this same case kind.

## 7. Receipts

Every clause above cites a shipped engine, not a future requirement.

- **The store shape is shipped by vant.** vant's README: "The files are plain markdown in your own repository, so git history becomes the memory lineage. Any agent on any stack can use it, because the memory is files and the tool interface is MCP." Brain at `models/public/<brain>/` and `models/private/<brain>/`; a key-value plus documents store with TTL, per-brain scoped, sandbox-gated writes (`vant/README.md`, rows "The brain" and "The memory store"). This is the packstruct `memory` binding, where git already is the persistence and provenance tier.
- **The merge is shipped by gistory.** `gistory/src/sync/merge.ts` is pure, deterministic, tombstone-aware, and states its rules in its own header: later timestamp wins (`updatedAt ?? createdAt`); equal timestamps break by sender device id (lexicographically larger wins) so every device converges; deletions ride as tombstones (`id -> deletedAt`) and a tombstone hides an item unless the item was edited after the deletion, in which case the edit resurrects it. This is the reference algorithm of section 4.2, and the packstruct `sync` binding.
- **The record shape is shipped by gistory.** `gistory/src/lib/models.ts`: every record carries `id` + `createdAt` + optional `updatedAt`, and later fields are optional by house rule so "payloads saved before this field existed stay mergeable." This is the optionality discipline of section 3.

Two engines, two persistence stories, one grammar.

## 8. Prior art

The answer to fragmentation is not a new system; it is a small frozen interchange that rides existing rails. memstruct cites and reuses:

- **MCP (Model Context Protocol)** is the wire. memstruct is the record grammar that rides MCP, not a competing transport.
- **Letta / MemGPT (memory blocks), Mem0, Zep / Graphiti (temporal graph)** are record-shape and lifecycle prior art.
- **W3C PROV-O** is the provenance ontology the optional `provenance` field SHOULD follow.
- **RFC 6902 (JSON Patch) and RFC 7386 (JSON Merge Patch)** are patch prior art for a future delta payload.
- **CRDTs / Automerge / Yjs** are the richer-merge family section 4.3 admits.
- **ActivityStreams / ActivityPub** are the governance prior art: how a standard object plus federation is shaped, versioned, and adopted.
- **Obsidian, Roam, markdown-in-git** are the files tier that already converged; memstruct is compatible with it by construction.
