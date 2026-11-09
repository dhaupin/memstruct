#!/usr/bin/env node
/**
 * scripts/build-status.mjs - the family-status@1 emitter, memstruct's member
 * side.
 *
 * Generates web/public/status.json from memstruct's own committed battery
 * contract (labs/battery.json) plus a LIVE run of the standard's self-checks
 * (src/selfcheck.mjs - the same checks `memstruct check` runs), and a
 * conformance leg over the bundled merge cases (conformance/cases/). Zero
 * deps, zero hand-editing: regenerated on every web build, so the served
 * dialect can never lag the code.
 *
 * The dialect (family-status@1, the family contract):
 *   { schema:1, contract:"family-status@1", repo, site, docs, asOf,
 *     legs:[{leg, verdict, cases, counts, ledger}],
 *     packs:[{name, spec, manifest, cases}] }
 *
 * Verdict rule (additive-first): every live check verdict is PASSED or
 * REFUSED -> "PASS". A check that fails, a committed check that did not run,
 * or a live check not in the contract -> "RED". Verdicts come from the live
 * run reconciled against the committed list, never from prose.
 *
 * memstruct ships no packstruct@1 packs, so `packs` is [] - honestly empty,
 * not omitted.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(HERE, '..', '..')
const OUT_PATH = join(REPO_ROOT, 'web', 'public', 'status.json')

const REPO = 'dhaupin/memstruct'
const SITE = 'https://memstruct.creadev.org/status'
const DOCS = 'https://docs.creadev.org/memstruct/status'

function legOf(rows, { leg, ledger }) {
  const counts = {}
  let verdict = 'PASS'
  for (const row of rows) {
    const v = row.verdict
    if (v === undefined || v === null) {
      verdict = 'RED'
      continue
    }
    if (v !== 'PASSED' && v !== 'REFUSED') verdict = 'RED'
    counts[v] = (counts[v] || 0) + 1
  }
  return { leg, verdict, cases: rows.length, counts, ledger }
}

/**
 * The selfcheck leg: run the standard's own battery and reconcile the live
 * result against labs/battery.json. A committed check that did not run reads
 * MISSING (a silently-shrunk battery is a smaller green, refused); a live
 * check not in the contract reads UNLISTED (unaccounted-for coverage).
 */
async function selfcheckLeg(root) {
  const contractPath = join(root, 'labs', 'battery.json')
  let contract
  try {
    contract = JSON.parse(readFileSync(contractPath, 'utf8'))
  } catch (err) {
    throw new Error(`labs/battery.json unreadable (${err.message}) - the selfcheck leg refuses a status it cannot count`)
  }
  const committed = Array.isArray(contract.checks) ? contract.checks : null
  if (!committed || !committed.length) {
    throw new Error('labs/battery.json carries no check list - the selfcheck leg refuses an empty contract')
  }

  const { runSelfChecks } = await import(join(root, 'src', 'selfcheck.mjs'))
  const res = runSelfChecks()
  const live = new Map(res.rows.map((r) => [r.name, r.ok]))

  const rows = []
  for (const name of committed) {
    if (!live.has(name)) rows.push({ id: name, verdict: 'MISSING' })
    else rows.push({ id: name, verdict: live.get(name) ? 'PASSED' : 'FAILED' })
  }
  const committedSet = new Set(committed)
  for (const [name, ok] of live) {
    if (!committedSet.has(name)) rows.push({ id: name, verdict: ok ? 'UNLISTED' : 'FAILED' })
  }

  return legOf(rows, { leg: 'selfcheck', ledger: 'labs/battery.json' })
}

/**
 * The conformance leg: run every bundled merge case both ways (the same
 * order-independence leg `memstruct audit-merge` runs) and count each case as
 * PASSED when honored, REFUSED when the merge disagrees with its golden. A
 * case whose merge is order-dependent is the RED class the lane exists to
 * catch.
 */
async function conformanceLeg(root) {
  const { discoverCases, runCase } = await import(join(root, 'src', 'audit-merge.mjs'))
  const casesRoot = join(root, 'conformance', 'cases')
  let cases
  try {
    cases = discoverCases(casesRoot)
  } catch (err) {
    throw new Error(`conformance/cases unreadable (${err.message}) - the conformance leg refuses a status it cannot count`)
  }
  if (!cases.length) {
    throw new Error('conformance/cases carries no cases - the conformance leg refuses an empty lane')
  }
  const rows = cases.map((c) => {
    const r = runCase(c)
    return { id: c.name, verdict: r.honored ? 'PASSED' : 'REFUSED' }
  })
  return legOf(rows, { leg: 'conformance', ledger: 'conformance/cases' })
}

export async function build(root = REPO_ROOT) {
  const legs = [await selfcheckLeg(root), await conformanceLeg(root)]
  let asOf = 'worktree'
  try {
    asOf = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    // no git context (zip download): say worktree, never a fake sha
  }
  return {
    schema: 1,
    contract: 'family-status@1',
    repo: REPO,
    site: SITE,
    docs: DOCS,
    asOf,
    legs,
    packs: [],
  }
}

// CLI: write the file when run directly.
const invokedDirectly = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (invokedDirectly) {
  try {
    const status = await build()
    mkdirSync(dirname(OUT_PATH), { recursive: true })
    writeFileSync(OUT_PATH, JSON.stringify(status, null, 2) + '\n')
    const red = status.legs.some((l) => l.verdict !== 'PASS')
    console.log(`wrote web/public/status.json (${status.legs.map((l) => `${l.leg} ${l.cases} ${l.verdict}`).join(', ')})`)
    process.exit(red ? 1 : 0)
  } catch (err) {
    console.error(`build-status: FAIL (${err.message})`)
    process.exit(1)
  }
}
