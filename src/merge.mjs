// src/merge.mjs - the memstruct reference merge. Zero dependencies.
//
// Pure, deterministic, tombstone-aware. The four normative properties live
// in spec/SPEC.md section 4; this file is the reference algorithm that holds
// them:
//
//   1. Convergence  - the merge is a per-id maximum over a TOTAL order, so
//                     it is commutative and associative and the result does
//                     not depend on order or device.
//   2. Determinism  - a pure function of the two stores. Same inputs, same
//                     output, every run.
//   3. Tombstones   - a record with deletedAt is hidden unless it was edited
//                     after the deletion, in which case the edit resurrects.
//   4. Monotonicity - an older version never displaces a newer one.
//
// The total order is (clock, contentHash). The clock is the record's version
// time; the content hash is the final tie-break. Both are functions of the
// record ALONE, which is what makes convergence hold for any number of
// devices and any merge order. gistory's shipped merge breaks equal-clock
// ties by sender device id; that is deterministic for a two-device push but
// depends on payload attribution, so the reference uses a content tie-break
// instead. An implementation MAY use a device-id tie-break if it records the
// device id on the record; the normative requirement is the four properties.
import { createHash } from 'node:crypto'

/** Canonical JSON: object keys sorted at every depth, no insignificant space. */
export function canonicalize(value) {
  if (value === undefined) return 'null'
  if (Array.isArray(value)) return '[' + value.map(canonicalize).join(',') + ']'
  if (value && typeof value === 'object') {
    return '{' + Object.keys(value).sort()
      .map((k) => JSON.stringify(k) + ':' + canonicalize(value[k]))
      .join(',') + '}'
  }
  return JSON.stringify(value)
}

/** Stable content hash of a record, used as the final tie-break. */
export function contentHash(record) {
  return createHash('sha256').update(canonicalize(record)).digest('hex')
}

/** The record's version time: the later of its last edit and its deletion. */
export function clock(record) {
  const edit = record.updatedAt ?? record.createdAt
  const del = record.deletedAt ?? 0
  return Math.max(edit, del)
}

/** A record is visible unless a tombstone hides it and no later edit lifts it. */
export function isVisible(record) {
  return record.deletedAt == null ||
    (typeof record.updatedAt === 'number' && record.updatedAt > record.deletedAt)
}

/** The winner of two versions of one record, under the total order. */
export function pick(a, b) {
  const ca = clock(a)
  const cb = clock(b)
  if (ca !== cb) return ca > cb ? a : b
  const ha = contentHash(a)
  const hb = contentHash(b)
  if (ha === hb) return a
  return ha > hb ? a : b
}

/**
 * Merge two stores. Records are keyed by id; each id resolves to the winner
 * of the total order. Tombstones are carried forward so deletions propagate.
 * Output records are sorted by id, so the serialization is canonical.
 */
export function mergeStores(local, remote) {
  const byId = new Map()
  for (const r of local.records ?? []) byId.set(r.id, r)
  for (const r of remote.records ?? []) {
    const cur = byId.get(r.id)
    byId.set(r.id, cur ? pick(cur, r) : r)
  }
  const records = [...byId.values()]
    .sort((x, y) => (x.id < y.id ? -1 : x.id > y.id ? 1 : 0))
  return { memstruct: 1, records }
}
