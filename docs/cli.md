---
permalink: cli/
layout: default
title: The memstruct CLI
description: The lint, merge, and audit-merge verbs - how a store is validated, reconciled, and graded against the conformance lane.
nav_order: 2
---

# The memstruct CLI

memstruct ships one command, `memstruct`, with three verbs. The tool is
language-neutral by construction: data in, data out, no network. That is what
lets the same conformance lane grade a Python or Go implementation of the
standard identically to this JavaScript one.

The format lives in the standard, not in the tool. `lint` validates a store
against the record format, `merge` reconciles two stores under the merge
contract, and `audit-merge` runs a whole case directory so the merge has a
standing receipt.

## The verbs

| verb | what it does |
| ---- | ------------ |
| `memstruct lint <store.json>` | validate a store against the record format. Unknown fields are carried, never refused. Exit 0 clean, 1 violations, 2 usage. |
| `memstruct merge --local <a.json> --remote <b.json>` | reconcile two stores under the merge contract. JSON in, JSON out. |
| `memstruct audit-merge <case-dir>` | run every case in a directory and compare the merged result to its golden, in both input orders (the order-independence leg). |

Every verb takes `--json` for machine-readable output.

## Validating a store

```bash
npx memstruct lint my-store.json
```

The envelope is fixed (`id`, `createdAt`, `updatedAt`, `deletedAt`); the body
is host-owned. A store that carries fields the standard does not know about is
still conformant - refuse the envelope, carry the body.

## Reconciling two stores

```bash
npx memstruct merge --local mine.json --remote theirs.json
```

The merge is a pure function: the same inputs produce the same output on every
device and every run. The result is canonical (records sorted by `id`, keys
sorted), so a merged store diffs cleanly against a golden.

## Grading a merge

```bash
npx memstruct audit-merge conformance/cases
```

The bundled lane covers the cases the contract names: `clean`, `clock-wins`,
`tie`, `tombstone`, and `resurrection`. Each case is run in both input orders,
so convergence is tested rather than asserted. Point the verb at your own case
directory to grade your implementation against the same standard.

## The exit contract

`0` clean, `1` violations or mismatch, `2` usage. The merge verb never opens a
socket and never writes outside the paths you name.
