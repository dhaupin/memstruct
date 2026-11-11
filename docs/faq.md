---
permalink: faq/
layout: default
title: FAQ
description: Short answers to the questions memstruct raises - is it a memory system, does it replace git or MCP, must the record shape change, and what is frozen at v1.
nav_order: 7
---

# FAQ

The questions memstruct raises, answered short.

## What it is and is not

<details open>
<summary>Is memstruct a memory system?</summary>
No. It is a memory <em>standard</em>: one record format and one merge contract.
It does not store your memory, rank it, embed it, or query it. It is the grammar
two memory systems share so they can exchange and reconcile memory without a
hand-written adapter.
</details>

<details>
<summary>Does memstruct replace git, or MCP?</summary>
Neither. Git answers where memory lives and merges at the file layer; MCP is the
wire. memstruct is the record grammar that rides them. The design rule is
"refuse the envelope, carry the body": the envelope is shared, the vocabulary is
yours.
</details>

<details>
<summary>Do I have to change my record shape?</summary>
You adopt the four-field envelope (<code>id</code>, <code>createdAt</code>,
optional <code>updatedAt</code> and <code>deletedAt</code>). Everything else -
<code>kind</code>, <code>scope</code>, <code>body</code>, <code>links</code>,
<code>provenance</code>, <code>ttl</code>, <code>meta</code>, and any field the
standard has never heard of - is carried through unchanged and never refused.
</details>

<details>
<summary>Can two systems with different vocabularies interoperate?</summary>
Yes. That is the point. Two conforming systems may use entirely different
taxonomies and still interoperate, because the envelope is what moves. An
unknown field is data, not a violation.
</details>

## The merge

<details>
<summary>What happens when two devices edit the same record offline?</summary>
The merge reconciles them by the contract, not by chance. Each version carries a
clock (<code>max(updatedAt ?? createdAt, deletedAt ?? 0)</code>); the higher
clock wins, and equal clocks break by a deterministic tie-break that is a
function of the record content alone. The result is the same on every replica,
in any order.
</details>

<details>
<summary>Can I use a CRDT instead of the reference merge?</summary>
Yes. A CRDT-class merge conforms if and only if it satisfies the four
properties: convergence, determinism, tombstone semantics, and monotonicity. The
properties are normative; the last-write-wins algorithm is the reference, not
the requirement.
</details>

<details>
<summary>Is a delete an erase?</summary>
No. A delete is a tombstone: the record keeps a <code>deletedAt</code> and is
hidden from the visible set. If the record is updated after the deletion, the
update resurrects it. That is what makes deletion propagate through a merge
instead of losing to an older live copy.
</details>

## Adoption

<details>
<summary>What languages can implement memstruct?</summary>
Any. The interop surface is a command with JSON in and JSON out, never a JS
import, so a Python or Go implementation is graded by the same conformance lane
as the reference. Nothing in the standard requires JavaScript.
</details>

<details>
<summary>How do I prove my implementation conforms?</summary>
Run <code>memstruct audit-merge</code> against the bundled cases, or point it at
your own case directory. Each case is a directory with <code>local.json</code>,
<code>remote.json</code>, and <code>expected.json</code>, run in both input
orders. See <a href="{{ '/cli/' | relative_url }}">the CLI page</a>.
</details>

<details>
<summary>Is the format stable?</summary>
The format id is <code>memstruct@1</code>; the record envelope and the four merge
properties are frozen for v1. Additive-first: a new optional field is a MINOR
revision, while removing, renaming, or changing an envelope field is a MAJOR
bump with a migration note.
</details>

<details>
<summary>Is memstruct open source?</summary>
Yes, MIT-licensed. The standard, the CLI, and the site are all on
<a href="https://github.com/dhaupin/memstruct">GitHub</a>. The normative text is
<a href="https://github.com/dhaupin/memstruct/blob/main/spec/SPEC.md">spec/SPEC.md</a>.
</details>

<div class="crosslinks">
<p><strong>More in these docs:</strong>
<a href="{{ '/start/' | relative_url }}">start here</a> ·
<a href="{{ '/contract/' | relative_url }}">the contract</a> ·
<a href="{{ '/cli/' | relative_url }}">the CLI</a> ·
<a href="{{ '/why/' | relative_url }}">why</a></p>
</div>
