# PRD: memstruct (a memory standard for all)

**Status:** v0.1 - the first cut (2026-11-08) · Owner: dhaupin
**Role:** the memory standard. It owns the record grammar and the merge contract that any memory system exchanges under.
**Package:** `memstruct` @ 0.9.0 (node >=22, ESM, zero runtime deps). NOT yet on npm (`npm view memstruct` = E404); the 0.9.x manual publish is the one outstanding M0 item.
**Core law:** refuse the envelope, carry the body. The envelope is the shared-facts column; everything else is host-owned and never refused.
**Family:** vant ships the store shape (`memory`), gistory ships the merge (`sync`), packstruct binds both. railyard routes; the forges do the work.

---

## 1. One-line pitch

One record format and one merge contract, so any two memory systems exchange memory without a rewrite.

## 2. The problem

Every memory system invents its own record shape and its own merge, so moving memory between two of them is a rewrite every time. That is the xkcd-927 shape: the answer is not a 50,001st memory system, it is a small frozen interchange plus a conformance lane.

## 3. The layer trap

"What is a memory" is two questions:

- **schema and verbs** - what a record is;
- **persistence and sync** - where it lives and how it merges.

Git answers the second superbly and has no opinion on the first. memstruct splits the concern: the record format is the standard, the substrate (git, a database, a directory, a vector index) is the implementation's choice, and the merge contract is where the semantics live. memstruct does not compete with git or MCP; it is the record grammar that rides them.

## 4. Scope

**Standardized (v1, frozen):**

- the record format: envelope `id`, `createdAt`, `updatedAt`, `deletedAt`; store `{ memstruct: 1, records: [...] }`;
- the merge contract: four normative properties.

**Not standardized, ever at v1:** the transport (MCP is the wire), the store, the vocabulary (`kind`, `scope`, `body`, `provenance`, `ttl`, `meta` are host-owned).

## 5. The four normative merge properties

1. **Convergence** - the same records merge to the same result on every replica, in any order.
2. **Determinism** - merge is a pure function of its inputs.
3. **Tombstone semantics** - a delete hides a record unless it was updated after the deletion, in which case the update resurrects it.
4. **Monotonicity** - an older version never displaces a newer one.

The reference algorithm is LWW + tombstones over a total order of `(clock, contentHash)`, `clock = max(updatedAt ?? createdAt, deletedAt ?? 0)`. A CRDT-class merge conforms if it satisfies the four properties (the richer road).

## 6. The interop surface

A CLI, never an import, so the harness grades any language identically: `memstruct lint`, `memstruct merge`, `memstruct audit-merge`. JSON in, JSON out, exit ladder 0/1/2.

## 7. Conformance

`audit-merge` runs each case (`local.json`, `remote.json`, `expected.json`) **both ways** and asserts order-independence. Bundled cases: clean, clock-wins, tie, tombstone, resurrection. Pure data in, pure data out, so it grades a Python or Go implementation identically to the JS reference.

## 8. Milestones

- **M0 (done):** the first cut. Format, merge, CLI, conformance lane, gates. Built and promoted; the 0.9.0 manual publish outstanding.
- **M1:** the packstruct `memory`/`sync` profile bindings; a `diff` verb (RFC 7386 shape); a second-language conformance run.
- **M2+:** a CRDT-class conformance suite; a "how to conform" page for a foreign memory system.

## 9. Receipts

- **vant** - the store shape ("git history becomes the memory lineage"; `models/public|private/<brain>/`).
- **gistory** - the merge (`src/sync/merge.ts`; `src/lib/models.ts`).
- Bindings filed: dhaupin/gistory#69 (`sync`), dhaupin/vant#354 (`memory`).
