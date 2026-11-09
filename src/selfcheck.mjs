// src/selfcheck.mjs - the memstruct self-checks. Zero dependencies.
//
// The standard's own truth battery: it proves the four normative merge
// properties directly, proves the linter bites on both sides (accepts valid,
// refuses broken), and proves the bundled conformance lane is honored. This is
// the named battery `memstruct check` runs and the one the family-status
// emitter counts (reconciled against labs/battery.json), so a check that
// silently disappears is caught, never a smaller green.
//
// Every check is a function of the shipped standard alone: pure data in, pure
// data out, no network, no host config. That is the same posture the CLI
// contract takes, so this battery grades the reference implementation exactly
// the way it grades any other.
import { mergeStores, pick, clock, isVisible, canonicalize } from './merge.mjs'
import { lintStore } from './lint.mjs'
import { auditMerge } from './audit-merge.mjs'

const store = (records) => ({ memstruct: 1, records })
const rec = (id, o = {}) => ({ id, createdAt: 100, ...o })
const same = (a, b) => canonicalize(a) === canonicalize(b)

/**
 * Run every self-check. Returns { ok, rows }, where each row is
 * { name, ok, detail }. The names are the committed contract in
 * labs/battery.json; a rename here without a matching edit there is caught by
 * the status emitter, never served as a smaller battery.
 */
export function runSelfChecks() {
  const rows = []
  const check = (name, fn) => {
    try {
      const detail = fn()
      rows.push({ name, ok: true, detail: detail ? String(detail) : '' })
    } catch (e) {
      rows.push({ name, ok: false, detail: e && e.message ? e.message : String(e) })
    }
  }
  const assert = (cond, message) => { if (!cond) throw new Error(message) }

  check('clock is max(updatedAt ?? createdAt, deletedAt ?? 0)', () => {
    assert(clock(rec('a')) === 100, 'createdAt clock wrong')
    assert(clock(rec('a', { updatedAt: 200 })) === 200, 'updatedAt clock wrong')
    assert(clock(rec('a', { updatedAt: 150, deletedAt: 180 })) === 180, 'deletedAt clock wrong')
    return 'three cases'
  })

  check('property 4 (monotonicity): the newer version wins, both orders', () => {
    const older = rec('a', { updatedAt: 100, body: 'old' })
    const newer = rec('a', { updatedAt: 200, body: 'new' })
    assert(same(pick(older, newer), newer), 'older won forward')
    assert(same(pick(newer, older), newer), 'older won backward')
    return 'newer wins both ways'
  })

  check('property 1 (convergence): merge is commutative', () => {
    const a = store([rec('a', { body: 'x' }), rec('b')])
    const b = store([rec('b', { updatedAt: 300, body: 'y' }), rec('c')])
    assert(same(mergeStores(a, b), mergeStores(b, a)), 'merge order changed the result')
    return 'both orders agree'
  })

  check('property 1 (convergence): merge is associative', () => {
    const a = store([rec('a', { body: 'x' })])
    const b = store([rec('b', { body: 'y' })])
    const c = store([rec('a', { updatedAt: 300, body: 'z' })])
    assert(same(mergeStores(mergeStores(a, b), c), mergeStores(a, mergeStores(b, c))), 'grouping changed the result')
    return 'both groupings agree'
  })

  check('property 2 (determinism): same inputs, same output', () => {
    const a = store([rec('a', { body: 'x' }), rec('d')])
    const b = store([rec('a', { updatedAt: 100, body: 'y' })])
    assert(same(mergeStores(a, b), mergeStores(a, b)), 'the same inputs differed')
    return 'stable'
  })

  check('equal-clock tie is deterministic (both orders agree)', () => {
    const p = rec('a', { updatedAt: 100, body: 'alpha' })
    const q = rec('a', { updatedAt: 100, body: 'beta' })
    assert(same(pick(p, q), pick(q, p)), 'tie-break was order-dependent')
    return 'content tie-break'
  })

  check('property 3 (tombstone): a delete hides, a later edit resurrects', () => {
    assert(isVisible(rec('a', { updatedAt: 150, deletedAt: 150 })) === false, 'tombstone did not hide')
    assert(isVisible(rec('a', { updatedAt: 200, deletedAt: 150 })) === true, 'later edit did not resurrect')
    assert(isVisible(rec('a')) === true, 'a live record was hidden')
    return 'hides, then resurrects'
  })

  check('a tombstone wins over an older record and propagates through a merge', () => {
    const alive = store([rec('a', { body: 'x' })])
    const dead = store([rec('a', { updatedAt: 150, deletedAt: 150 })])
    const merged = mergeStores(alive, dead)
    assert(merged.records[0].deletedAt === 150, 'the tombstone did not win')
    assert(isVisible(merged.records[0]) === false, 'the tombstone did not propagate')
    return 'propagated'
  })

  check('output is canonical: records sorted by id', () => {
    const merged = mergeStores(store([rec('z'), rec('a')]), store([rec('m')]))
    assert(JSON.stringify(merged.records.map((r) => r.id)) === '["a","m","z"]', 'records were not sorted by id')
    return 'sorted by id'
  })

  check('a clean store passes the linter', () => {
    assert(lintStore(store([rec('a', { body: 'x' })])).violations.length === 0, 'a clean store was refused')
    return 'clean'
  })

  check('unknown fields are carried, never refused', () => {
    const r = lintStore({ memstruct: 1, extra: true, records: [rec('a', { kind: 'lesson', weird: { deep: 1 } })] })
    assert(r.violations.length === 0, 'an unknown field was refused')
    return 'carried'
  })

  check('a missing id refuses as record-id', () => {
    const v = lintStore(store([{ createdAt: 100 }])).violations
    assert(v[0] && v[0].norm === 'record-id', 'a record with no id was accepted')
    return 'refused'
  })

  check('a non-integer createdAt refuses as record-created-at', () => {
    const v = lintStore(store([{ id: 'a', createdAt: 'yesterday' }])).violations
    assert(v[0] && v[0].norm === 'record-created-at', 'a non-integer createdAt was accepted')
    return 'refused'
  })

  check('a non-1 memstruct refuses as store-version', () => {
    const v = lintStore({ memstruct: 2, records: [] }).violations
    assert(v[0] && v[0].norm === 'store-version', 'a store claiming v2 was accepted')
    return 'refused'
  })

  check('a duplicate id refuses as record-id-duplicate', () => {
    const v = lintStore(store([rec('a'), rec('a')])).violations
    assert(v[0] && v[0].norm === 'record-id-duplicate', 'a duplicate id was accepted')
    return 'refused'
  })

  check('every bundled conformance case is honored', () => {
    const r = auditMerge(new URL('../conformance/cases', import.meta.url).pathname)
    assert(r.honored === r.caseCount, `${r.caseCount - r.honored} case(s) failed`)
    assert(r.caseCount >= 5, `expected at least 5 cases, saw ${r.caseCount}`)
    return `${r.honored}/${r.caseCount} honored`
  })

  check('the conformance lane runs the merge both ways (order independence)', () => {
    const r = auditMerge(new URL('../conformance/cases', import.meta.url).pathname)
    const orderDep = r.violations.some((v) => v.norm === 'merge-order-dependent')
    assert(!orderDep, 'a case was order-dependent')
    return 'order-independent'
  })

  return { ok: rows.every((r) => r.ok), rows }
}
