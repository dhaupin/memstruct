---
permalink: why/
layout: default
title: Why memstruct
description: Every memory system invents its own record shape and its own merge, so moving memory between two of them is a rewrite. Why a small frozen interchange ends the rewrite.
nav_order: 8
---

# Why memstruct

Every memory system invents its own record shape and its own merge, so moving
memory between two of them is a rewrite every time. That is the xkcd-927 shape:
the answer is not a 50,001st memory system, it is a small frozen interchange
plus a conformance lane.

## The layer trap

"How do we standardize memory" is two questions, not one:

- **What is a memory** - schema and verbs.
- **Where does it live and merge** - persistence and sync.

Git answers the second superbly and has no opinion on the first. So memstruct
splits the concern: the record format is the standard, git (or a database, or a
directory, or a vector index) is the substrate, and the merge contract is where
the semantics actually live. memstruct does not compete with git, or with MCP.
It is the record grammar that rides them.

## Why the merge, not just the shape

A shared record shape gets two systems to *read* each other's memory. It does
not get them to *reconcile* two divergent copies, which is the hard part: two
devices, both edited while offline, both now claim the same id. A shape-only
standard punts that to every implementation, so every implementation invents its
own answer and they disagree again.

memstruct makes the merge normative and states it as four observable properties
rather than one algorithm. That is the deliberate move: it fixes *what must be
true* (convergence, determinism, tombstone semantics, monotonicity) while leaving
*how* open, so a timestamp merge and a CRDT-class merge both conform.

## Grounded in shipped engines

memstruct is grounded in two shipped engines, not invented:

- **vant** - markdown memory files in your own repository, "git history becomes
  the memory lineage." The store shape.
- **gistory** - a pure, deterministic, tombstone-aware LWW merge. The reference
  algorithm.

Two engines, two persistence stories, one grammar. packstruct binds memstruct
through two profiles: `memory` (the store binding) and `sync` (the replicated
binding), both shipped in packstruct SPEC v1.2.0.

<div class="crosslinks">
<p><strong>More in these docs:</strong>
<a href="{{ '/' | relative_url }}">overview</a> ·
<a href="{{ '/what/' | relative_url }}">what</a> ·
<a href="{{ '/cli/' | relative_url }}">the CLI</a> ·
<a href="{{ '/status/' | relative_url }}">family status</a></p>
</div>
