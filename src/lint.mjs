// src/lint.mjs - validate a memstruct store against the record format.
//
// The envelope is the shared-facts column (spec/SPEC.md section 3): a
// conforming reader assigns meaning to memstruct, records, id, createdAt,
// updatedAt, deletedAt. Everything else is host-owned vocabulary and is
// carried through, never refused. additionalProperties is deliberate: an
// unknown field is data, not a violation.
const ENVELOPE_INT = ['createdAt', 'updatedAt', 'deletedAt', 'ttl']

function isInteger(v) {
  return typeof v === 'number' && Number.isInteger(v)
}

/** Validate one record. Returns a list of { norm, message }. */
export function lintRecord(record, where) {
  const v = []
  if (record === null || typeof record !== 'object' || Array.isArray(record)) {
    return [{ norm: 'record-shape', message: `${where}: record is not an object` }]
  }
  if (typeof record.id !== 'string' || record.id.length === 0) {
    v.push({ norm: 'record-id', message: `${where}: record.id must be a non-empty string` })
  }
  if (!isInteger(record.createdAt)) {
    v.push({ norm: 'record-created-at', message: `${where}: record.createdAt must be an integer (epoch ms)` })
  }
  for (const key of ENVELOPE_INT) {
    if (key === 'createdAt') continue
    const val = record[key]
    if (val !== undefined && val !== null && !isInteger(val)) {
      v.push({ norm: `record-${key.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())}`, message: `${where}: record.${key} must be an integer or null` })
    }
  }
  if (record.links !== undefined && !Array.isArray(record.links)) {
    v.push({ norm: 'record-links', message: `${where}: record.links must be an array of ids` })
  }
  return v
}

/** Validate a whole store. Returns { records, violations }. */
export function lintStore(store, where = 'store') {
  const violations = []
  if (store === null || typeof store !== 'object' || Array.isArray(store)) {
    return { records: 0, violations: [{ norm: 'store-shape', message: `${where}: store is not an object` }] }
  }
  if (store.memstruct !== 1) {
    violations.push({ norm: 'store-version', message: `${where}: store.memstruct must be 1 (have: ${JSON.stringify(store.memstruct)})` })
  }
  if (!Array.isArray(store.records)) {
    violations.push({ norm: 'store-records', message: `${where}: store.records must be an array` })
    return { records: 0, violations }
  }
  const seen = new Map()
  store.records.forEach((r, i) => {
    violations.push(...lintRecord(r, `${where}.records[${i}]`))
    if (r && typeof r === 'object' && typeof r.id === 'string') {
      if (seen.has(r.id)) {
        violations.push({ norm: 'record-id-duplicate', message: `${where}: duplicate record id ${JSON.stringify(r.id)} (first at index ${seen.get(r.id)})` })
      } else {
        seen.set(r.id, i)
      }
    }
  })
  return { records: store.records.length, violations }
}
