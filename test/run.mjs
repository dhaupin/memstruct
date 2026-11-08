// test/run.mjs - the memstruct battery. Zero dependencies.
//
// Proves the four normative merge properties directly, and proves the linter
// bites on both sides (accepts valid, refuses broken). A check that never
// fails proves nothing, so every refusal norm has a case that trips it.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { mergeStores, pick, clock, isVisible, canonicalize } from '../src/merge.mjs'
import { lintStore } from '../src/lint.mjs'
import { auditMerge } from '../src/audit-merge.mjs'

let pass = 0
let fail = 0
const cases = []
function test(name, fn) {
  try {
    fn()
    pass++
    console.log(`  ok   ${name}`)
  } catch (e) {
    fail++
    console.log(`  FAIL ${name}\n       ${e.message}`)
  }
}

const store = (records) => ({ memstruct: 1, records })
const rec = (id, o = {}) => ({ id, createdAt: 100, ...o })
const eq = (a, b) => assert.equal(canonicalize(a), canonicalize(b))

console.log('merge properties')

test('clock is max(updatedAt ?? createdAt, deletedAt ?? 0)', () => {
  assert.equal(clock(rec('a')), 100)
  assert.equal(clock(rec('a', { updatedAt: 200 })), 200)
  assert.equal(clock(rec('a', { updatedAt: 150, deletedAt: 180 })), 180)
})

test('property 4 (monotonicity): the newer version wins, both orders', () => {
  const older = rec('a', { updatedAt: 100, body: 'old' })
  const newer = rec('a', { updatedAt: 200, body: 'new' })
  eq(pick(older, newer), newer)
  eq(pick(newer, older), newer)
})

test('property 1 (convergence): merge is commutative', () => {
  const a = store([rec('a', { body: 'x' }), rec('b')])
  const b = store([rec('b', { updatedAt: 300, body: 'y' }), rec('c')])
  eq(mergeStores(a, b), mergeStores(b, a))
})

test('property 1 (convergence): merge is associative', () => {
  const a = store([rec('a', { body: 'x' })])
  const b = store([rec('b', { body: 'y' })])
  const c = store([rec('a', { updatedAt: 300, body: 'z' })])
  eq(mergeStores(mergeStores(a, b), c), mergeStores(a, mergeStores(b, c)))
})

test('property 2 (determinism): same inputs, same output', () => {
  const a = store([rec('a', { body: 'x' }), rec('d')])
  const b = store([rec('a', { updatedAt: 100, body: 'y' })])
  eq(mergeStores(a, b), mergeStores(a, b))
})

test('equal-clock tie is deterministic (both orders agree)', () => {
  const p = rec('a', { updatedAt: 100, body: 'alpha' })
  const q = rec('a', { updatedAt: 100, body: 'beta' })
  eq(pick(p, q), pick(q, p))
})

test('property 3 (tombstone): a delete hides, a later edit resurrects', () => {
  assert.equal(isVisible(rec('a', { updatedAt: 150, deletedAt: 150 })), false)
  assert.equal(isVisible(rec('a', { updatedAt: 200, deletedAt: 150 })), true)
  assert.equal(isVisible(rec('a')), true)
})

test('a tombstone wins over an older record and propagates through a merge', () => {
  const alive = store([rec('a', { body: 'x' })])
  const dead = store([rec('a', { updatedAt: 150, deletedAt: 150 })])
  const merged = mergeStores(alive, dead)
  assert.equal(merged.records[0].deletedAt, 150)
  assert.equal(isVisible(merged.records[0]), false)
})

test('output is canonical: records sorted by id', () => {
  const merged = mergeStores(store([rec('z'), rec('a')]), store([rec('m')]))
  assert.deepEqual(merged.records.map((r) => r.id), ['a', 'm', 'z'])
})

console.log('lint')

test('a clean store passes', () => {
  assert.equal(lintStore(store([rec('a', { body: 'x' })])).violations.length, 0)
})

test('unknown fields are carried, never refused', () => {
  const r = lintStore({ memstruct: 1, extra: true, records: [rec('a', { kind: 'lesson', weird: { deep: 1 } })] })
  assert.equal(r.violations.length, 0)
})

test('a missing id refuses as record-id', () => {
  const v = lintStore(store([{ createdAt: 100 }])).violations
  assert.equal(v[0].norm, 'record-id')
})

test('a non-integer createdAt refuses as record-created-at', () => {
  const v = lintStore(store([{ id: 'a', createdAt: 'yesterday' }])).violations
  assert.equal(v[0].norm, 'record-created-at')
})

test('a non-1 memstruct refuses as store-version', () => {
  const v = lintStore({ memstruct: 2, records: [] }).violations
  assert.equal(v[0].norm, 'store-version')
})

test('a duplicate id refuses as record-id-duplicate', () => {
  const v = lintStore(store([rec('a'), rec('a')])).violations
  assert.equal(v[0].norm, 'record-id-duplicate')
})

console.log('conformance')

test('every bundled merge case is honored', () => {
  const r = auditMerge(new URL('../conformance/cases', import.meta.url).pathname)
  assert.equal(r.honored, r.caseCount)
  assert.ok(r.caseCount >= 5, `expected at least 5 cases, saw ${r.caseCount}`)
})

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
