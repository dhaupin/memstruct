#!/usr/bin/env node
// bin/cli.mjs - the memstruct CLI, zero dependencies.
//
//   memstruct lint <store.json> [--json]
//   memstruct merge --local <a.json> --remote <b.json> [--json]
//   memstruct audit-merge <case-dir> [--json]
//   memstruct check
//   memstruct doctor
//
// The merge verb is the interop surface: JSON in, JSON out, no network, no
// host config, exit 0. It is invoked (never imported) so a Python or Go
// implementation is graded by the same harness as this one. Exit ladder is
// shared: 0 clean, 1 violations or mismatch, 2 usage.
//
// `check` runs the standard's own battery (src/selfcheck.mjs); `doctor` proves
// the merge end to end on a demo store and prints the result, so a reader sees
// the contract hold rather than taking the word for it.
import { readFileSync } from 'node:fs'
import { lintStore } from '../src/lint.mjs'
import { mergeStores } from '../src/merge.mjs'
import { auditMerge } from '../src/audit-merge.mjs'
import { runSelfChecks } from '../src/selfcheck.mjs'

let args = process.argv.slice(2)

if (args[0] === '--version') {
  console.log(JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version)
  process.exit(0)
}
if (args[0] === '--help' || args[0] === '-h' || args.length === 0) {
  console.log('Usage: memstruct <lint|merge|audit-merge|check|doctor> ...')
  console.log('  memstruct lint <store.json> [--json]')
  console.log('  memstruct merge --local <a.json> --remote <b.json> [--json]')
  console.log('  memstruct audit-merge <case-dir> [--json]')
  console.log('  memstruct check')
  console.log('  memstruct doctor')
  process.exit(args.length === 0 ? 2 : 0)
}

const verb = args[0]
args = args.slice(1)

const exitUsage = (msg, usage) => {
  if (msg) console.error(msg)
  console.error(`Usage: ${usage}`)
  process.exit(2)
}

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'))

if (verb === 'lint') {
  const USAGE = 'memstruct lint <store.json> [--json]'
  const positional = []
  for (const a of args) {
    if (a === '--json') continue
    if (a.startsWith('-')) exitUsage(`unknown flag "${a}" (have: --json)`, USAGE)
    positional.push(a)
  }
  const file = positional[0]
  if (!file) exitUsage(undefined, USAGE)
  if (positional.length > 1) exitUsage(`lint takes one store (got ${positional.length})`, USAGE)
  const r = lintStore(readJson(file), file)
  if (args.includes('--json')) {
    console.log(JSON.stringify({ schema: 1, mode: 'lint', file, records: r.records, violations: r.violations }, null, 2))
  } else {
    console.log(`memstruct lint: ${r.records} record(s) checked in ${file}`)
    for (const v of r.violations) console.log(`  VIOLATION [${v.norm}]: ${v.message}`)
  }
  process.exit(r.violations.length ? 1 : 0)
}

if (verb === 'merge') {
  const USAGE = 'memstruct merge --local <a.json> --remote <b.json> [--json]'
  const flagValue = (name) => {
    const i = args.indexOf(name)
    if (i === -1) return undefined
    const v = args[i + 1]
    if (v === undefined || v.startsWith('-')) exitUsage(`${name} needs a value (a JSON store path)`, USAGE)
    return v
  }
  const local = flagValue('--local')
  const remote = flagValue('--remote')
  for (const a of args) {
    if (a === '--json' || a === '--local' || a === '--remote') continue
    if (a.startsWith('-')) exitUsage(`unknown flag "${a}" (have: --local <a>, --remote <b>, --json)`, USAGE)
  }
  if (!local || !remote) exitUsage(undefined, USAGE)
  const merged = mergeStores(readJson(local), readJson(remote))
  // The merged store is the output, canonical (records sorted by id), so a
  // caller can diff it against a golden without key-order noise.
  console.log(JSON.stringify(merged, null, 2))
  process.exit(0)
}

if (verb === 'audit-merge') {
  const USAGE = 'memstruct audit-merge <case-dir> [--json]'
  const positional = []
  for (const a of args) {
    if (a === '--json') continue
    if (a.startsWith('-')) exitUsage(`unknown flag "${a}" (have: --json)`, USAGE)
    positional.push(a)
  }
  const dir = positional[0]
  if (!dir) exitUsage(undefined, USAGE)
  const r = auditMerge(dir)
  if (args.includes('--json')) {
    console.log(JSON.stringify({ schema: 1, mode: 'audit-merge', dir, cases: r.caseCount, honored: r.honored, violations: r.violations }, null, 2))
  } else {
    console.log(`memstruct audit-merge: ${r.honored}/${r.caseCount} case(s) honored over ${dir}`)
    for (const v of r.violations) console.log(`  AUDIT ${v.pack} [${v.norm}]: ${v.message}`)
  }
  process.exit(r.violations.length ? 1 : 0)
}

if (verb === 'check') {
  const res = runSelfChecks()
  for (const row of res.rows) {
    console.log((row.ok ? '  PASS  ' : '  FAIL  ') + row.name + (row.detail ? '  ' + row.detail : ''))
  }
  console.log('')
  console.log(res.ok ? `OK - ${res.rows.length} checks` : `FAILED - ${res.rows.filter((r) => !r.ok).length} of ${res.rows.length}`)
  process.exit(res.ok ? 0 : 1)
}

if (verb === 'doctor') {
  // Prove the merge end to end on a demo store, and show the tombstone rule
  // holding: an older live record loses to a newer tombstone. A reader sees
  // the contract, rather than taking the word for it.
  const mine = { memstruct: 1, records: [
    { id: 'notes/hello', createdAt: 1730000000000, updatedAt: 1730000500000, body: 'the store on this device' },
    { id: 'notes/gone', createdAt: 1730000000000, body: 'deleted on the other device' },
  ] }
  const theirs = { memstruct: 1, records: [
    { id: 'notes/hello', createdAt: 1730000000000, updatedAt: 1730000600000, body: 'the newer edit on the other device' },
    { id: 'notes/gone', createdAt: 1730000000000, updatedAt: 1730000700000, deletedAt: 1730000700000 },
  ] }
  console.log('=== MERGE (mine <- theirs) ===')
  console.log(JSON.stringify(mergeStores(mine, theirs), null, 2))
  console.log('')
  console.log('=== BOTH ORDERS AGREE (convergence) ===')
  const forward = JSON.stringify(mergeStores(mine, theirs))
  const backward = JSON.stringify(mergeStores(theirs, mine))
  console.log('merge(mine, theirs) === merge(theirs, mine):', forward === backward)
  console.log('')
  const audit = auditMerge(new URL('../conformance/cases', import.meta.url).pathname)
  console.log(`=== CONFORMANCE (${audit.honored}/${audit.caseCount} honored) ===`)
  for (const v of audit.violations) console.log(`  AUDIT ${v.pack} [${v.norm}]: ${v.message}`)
  process.exit(audit.violations.length ? 1 : 0)
}

exitUsage(`unknown verb "${verb}"`, 'memstruct <lint|merge|audit-merge|check|doctor> ...')
