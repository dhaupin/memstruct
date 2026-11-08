#!/usr/bin/env node
// bin/cli.mjs - the memstruct CLI, zero dependencies.
//
//   memstruct lint <store.json> [--json]
//   memstruct merge --local <a.json> --remote <b.json> [--json]
//   memstruct audit-merge <case-dir> [--json]
//
// The merge verb is the interop surface: JSON in, JSON out, no network, no
// host config, exit 0. It is invoked (never imported) so a Python or Go
// implementation is graded by the same harness as this one. Exit ladder is
// shared: 0 clean, 1 violations or mismatch, 2 usage.
import { readFileSync } from 'node:fs'
import { lintStore } from '../src/lint.mjs'
import { mergeStores } from '../src/merge.mjs'
import { auditMerge } from '../src/audit-merge.mjs'

let args = process.argv.slice(2)

if (args[0] === '--version') {
  console.log(JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version)
  process.exit(0)
}
if (args[0] === '--help' || args[0] === '-h' || args.length === 0) {
  console.log('Usage: memstruct <lint|merge|audit-merge> ...')
  console.log('  memstruct lint <store.json> [--json]')
  console.log('  memstruct merge --local <a.json> --remote <b.json> [--json]')
  console.log('  memstruct audit-merge <case-dir> [--json]')
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

exitUsage(`unknown verb "${verb}"`, 'memstruct <lint|merge|audit-merge> ...')
