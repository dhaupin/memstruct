// test/status.test.mjs - the family-status@1 dialect battery.
//
// The emitter's behavior is pinned both ways: the committed battery contract
// must reconcile against the live self-checks (a missing or unlisted check
// degrades the leg), and the real tree's emitted counts are re-derived against
// the live battery and the bundled conformance cases so the dialect sits under
// CI the same way every other count here does. Behavior-only, no network.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from '../web/scripts/build-status.mjs'
import { runSelfChecks } from '../src/selfcheck.mjs'

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

test('status: the dialect fields are the family contract', async () => {
  const s = await build(REPO_ROOT)
  assert.equal(s.schema, 1)
  assert.equal(s.contract, 'family-status@1')
  assert.equal(s.repo, 'dhaupin/memstruct')
  assert.equal(s.site, 'https://memstruct.creadev.org/status')
  assert.equal(s.docs, 'https://docs.creadev.org/memstruct/status')
  assert.ok(s.asOf, 'asOf must be present')
  assert.deepEqual(s.packs, [], 'memstruct ships no packs - honestly empty, not omitted')
})

test('status: the selfcheck leg reconciles the live battery against the committed contract', async () => {
  const s = await build(REPO_ROOT)
  const leg = s.legs.find((l) => l.leg === 'selfcheck')
  assert.ok(leg, 'the selfcheck leg must be present')
  assert.equal(leg.ledger, 'labs/battery.json')
  const live = runSelfChecks()
  assert.equal(leg.cases, live.rows.length)
  assert.equal(leg.verdict, 'PASS')
  assert.deepEqual(leg.counts, { PASSED: live.rows.length })
})

test('status: the conformance leg counts every bundled case as PASSED', async () => {
  const s = await build(REPO_ROOT)
  const leg = s.legs.find((l) => l.leg === 'conformance')
  assert.ok(leg, 'the conformance leg must be present')
  assert.equal(leg.ledger, 'conformance/cases')
  assert.ok(leg.cases >= 5, `expected at least 5 cases, saw ${leg.cases}`)
  assert.equal(leg.verdict, 'PASS')
})

test('status: a committed check missing from the live run degrades the leg to RED', async () => {
  // Rebuild a scratch repo whose battery contract names a check the live run
  // does not have. The emitter must refuse it (MISSING -> RED), never serve a
  // smaller green.
  const root = mkdtempSync(join(tmpdir(), 'memstruct-status-'))
  try {
    for (const dir of ['labs', 'conformance', 'src', 'web/scripts']) {
      mkdirSync(join(root, dir), { recursive: true })
    }
    // Symlink the real sources so the live run works against the scratch root.
    const { symlinkSync } = await import('node:fs')
    symlinkSync(join(REPO_ROOT, 'src', 'selfcheck.mjs'), join(root, 'src', 'selfcheck.mjs'))
    symlinkSync(join(REPO_ROOT, 'src', 'merge.mjs'), join(root, 'src', 'merge.mjs'))
    symlinkSync(join(REPO_ROOT, 'src', 'lint.mjs'), join(root, 'src', 'lint.mjs'))
    symlinkSync(join(REPO_ROOT, 'src', 'audit-merge.mjs'), join(root, 'src', 'audit-merge.mjs'))
    symlinkSync(join(REPO_ROOT, 'conformance', 'cases'), join(root, 'conformance', 'cases'))
    symlinkSync(join(REPO_ROOT, 'web', 'scripts', 'build-status.mjs'), join(root, 'web', 'scripts', 'build-status.mjs'))
    writeFileSync(join(root, 'labs', 'battery.json'), JSON.stringify({
      contract: 'memstruct-battery@1',
      checks: ['a check that does not exist'],
    }))
    const s = await build(root)
    const leg = s.legs.find((l) => l.leg === 'selfcheck')
    assert.equal(leg.verdict, 'RED', 'a missing committed check must degrade the leg')
    assert.equal(leg.counts.MISSING, 1)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('status: the committed contract names exactly the live checks', async () => {
  const contract = JSON.parse(readFileSync(join(REPO_ROOT, 'labs', 'battery.json'), 'utf8'))
  const live = runSelfChecks().rows.map((r) => r.name)
  assert.deepEqual(
    [...contract.checks].sort(),
    [...live].sort(),
    'labs/battery.json must name exactly the live self-checks (add the name in the same commit)',
  )
})
