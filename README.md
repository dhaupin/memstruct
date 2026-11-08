# memstruct

**A memory standard for all.** One record format and one merge contract, so any two memory systems can exchange memory without a rewrite.

Every memory system invents its own record shape and its own merge, so moving memory between two of them is a rewrite every time. That is the xkcd-927 shape: the answer is not a 50,001st memory system, it is a small frozen interchange plus a conformance lane. memstruct is that interchange.

```text
npx memstruct lint  my-store.json
npx memstruct merge --local mine.json --remote theirs.json
npx memstruct audit-merge conformance/cases
```

Zero dependencies. Node 20+.

## The layer trap

"How do we standardize memory" is two questions, not one:

- **What is a memory** (schema and verbs).
- **Where does it live and merge** (persistence and sync).

Git answers the second superbly and has no opinion on the first. So memstruct splits the concern: the **record format** is the standard, git (or a database, or a directory, or a vector index) is the substrate, and the **merge contract** is where the semantics actually live. memstruct does not compete with git, or with MCP. It is the record grammar that rides them.

## The record format

A store is one JSON document. A record has a four-field envelope and a host-owned body:

```json
{
  "memstruct": 1,
  "records": [
    {
      "id": "01H8Z...",
      "createdAt": 1730000000000,
      "updatedAt": 1730000000000,
      "deletedAt": null,
      "kind": "lesson",
      "scope": "private",
      "body": "markdown or plain text",
      "links": ["01H8Z..."],
      "provenance": {},
      "ttl": null,
      "meta": {}
    }
  ]
}
```

The envelope (`id`, `createdAt`, `updatedAt`, `deletedAt`) is the shared-facts column: every conforming reader assigns it meaning. Everything else is host-owned vocabulary, carried through and never refused. **Refuse the envelope, carry the body.** An unknown field is data, not a violation, which is how a standard for all exists without a committee for every field.

The normative shape is [`schema/store-1.json`](schema/store-1.json); the prose in [`spec/SPEC.md`](spec/SPEC.md) governs.

## The merge contract

Reconciliation is the reason memstruct exists, and it is normative. A conforming merge satisfies four observable properties:

1. **Convergence** - the same records merge to the same result on every replica, in any order.
2. **Determinism** - merge is a pure function of its inputs.
3. **Tombstone semantics** - a delete hides a record unless it was updated after the deletion, in which case the update resurrects it.
4. **Monotonicity** - an older version never displaces a newer one.

The **reference algorithm** is last-write-wins plus tombstones, over a total order of `(clock, contentHash)` where the clock is `max(updatedAt ?? createdAt, deletedAt ?? 0)`. Because the winner is a per-id maximum over a total order, the merge is commutative and associative, so it converges for any number of stores in any order. The reference lives in [`src/merge.mjs`](src/merge.mjs).

The **richer road** is open: a CRDT-class merge (Automerge-style) conforms if and only if it satisfies the four properties. The properties are normative; the algorithm is the reference, not the requirement.

## The CLI

The interop surface is a command, never an import, so the harness grades any language identically.

```text
memstruct lint <store.json>                          # validate; exit 0 / 1 / 2
memstruct merge --local <a.json> --remote <b.json>   # merged store on stdout; exit 0
memstruct audit-merge <case-dir>                     # run the merge conformance cases; exit 0 / 1 / 2
```

## Conformance

`memstruct audit-merge` grades the merge contract. Each case is a directory with `local.json`, `remote.json`, and `expected.json`. The audit runs the merge **both ways** and asserts each equals `expected` - the order-independence leg, which names a non-deterministic merge instead of passing it. Bundled cases cover a clean merge, a clock conflict, a deterministic tie, a tombstone, and a resurrection. See [`conformance/cases/`](conformance/cases/).

An implementation in any language conforms when the three commands exist with this contract.

## Where it came from

memstruct is grounded in two shipped engines, not invented:

- **vant** - markdown memory files in your own repository, "git history becomes the memory lineage." The store shape.
- **gistory** - a pure, deterministic, tombstone-aware LWW merge. The reference algorithm.

Two engines, two persistence stories, one grammar. packstruct binds memstruct through two profiles, `memory` (the store binding) and `sync` (the replicated binding).

## Prior art

memstruct rides existing rails instead of reinventing them: **MCP** (the wire), **Letta/MemGPT, Mem0, Zep/Graphiti** (record shape), **W3C PROV-O** (provenance), **RFC 6902/7386** (patch), **CRDTs / Automerge / Yjs** (the richer road), **ActivityStreams/ActivityPub** (governance shape), and **markdown-in-git** (the files tier).

## Status

0.9.0 - the manual lane. The format is `memstruct@1`; the four merge properties and the record envelope are frozen for v1.

## Commands

```text
npm test                # the battery: merge properties, lint refusals, conformance
npm run check           # test + language gate + action pins + spec/schema + conformance
```

## License

MIT.