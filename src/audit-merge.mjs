// src/audit-merge.mjs - the sync conformance case kind (spec/SPEC.md section 7).
//
// Each case is a directory carrying local.json, remote.json, and expected.json.
// The audit runs the merge BOTH ways (local+remote and remote+local) and
// asserts each equals the expected store. Running both orders is the
// order-independence leg: a merge that is not deterministic, or not
// commutative, is named instead of passing.
//
// The comparison is canonical, so key order and record order never color a
// verdict - only content does. This is the case kind the `sync` binding in a
// packstruct host is graded against, and because it is pure data in and pure
// data out, it grades a Python or Go implementation identically to a JS one.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { mergeStores, canonicalize } from './merge.mjs'
import { lintStore } from './lint.mjs'

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'))

/** Discover case directories under a root (each with the three files). */
export function discoverCases(root) {
  const cases = []
  for (const name of readdirSync(root)) {
    const dir = join(root, name)
    if (!statSync(dir).isDirectory()) continue
    cases.push({ name, dir })
  }
  return cases.sort((a, b) => (a.name < b.name ? -1 : 1))
}

/** Run one case. Returns { name, honored, violations }. */
export function runCase({ name, dir }) {
  const violations = []
  const local = readJson(join(dir, 'local.json'))
  const remote = readJson(join(dir, 'remote.json'))
  const expected = readJson(join(dir, 'expected.json'))

  for (const [label, store] of [['local', local], ['remote', remote], ['expected', expected]]) {
    const r = lintStore(store, `${name}/${label}.json`)
    for (const v of r.violations) violations.push({ pack: name, norm: v.norm, message: v.message })
  }
  if (violations.length) return { name, honored: false, violations }

  const forward = canonicalize(mergeStores(local, remote))
  const backward = canonicalize(mergeStores(remote, local))
  const want = canonicalize(expected)

  if (forward !== want) {
    violations.push({ pack: name, norm: 'merge-mismatch', message: `${name}: merge(local, remote) does not equal expected` })
  }
  if (backward !== want) {
    violations.push({ pack: name, norm: 'merge-order-dependent', message: `${name}: merge(remote, local) differs from merge(local, remote) or from expected (the order-independence leg)` })
  }
  return { name, honored: violations.length === 0, violations }
}

/** Run every case under a root. Returns { caseCount, honored, violations }. */
export function auditMerge(root) {
  const cases = discoverCases(root)
  const violations = []
  let honored = 0
  for (const c of cases) {
    const r = runCase(c)
    if (r.honored) honored++
    violations.push(...r.violations)
  }
  return { caseCount: cases.length, honored, violations }
}
