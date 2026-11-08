// check-spec-consistency.cjs - the schema and the SPEC must agree.
//
// The prose governs (SPEC section 3.2) and schema/store-1.json mirrors it. A
// mirror that drifts is worse than no mirror, so this guard refuses when the
// two disagree on the envelope: the schema's required record fields and the
// store-level required keys must all be named in the SPEC's field table, and
// every envelope field the SPEC names must appear in the schema.
//
// No dependencies: reads the schema JSON and greps the SPEC.
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const schema = JSON.parse(fs.readFileSync(path.join(ROOT, 'schema', 'store-1.json'), 'utf8'));
const spec = fs.readFileSync(path.join(ROOT, 'spec', 'SPEC.md'), 'utf8');

const problems = [];

// Store-level required keys must be named in the SPEC.
for (const key of schema.required) {
  if (!new RegExp('`' + key + '`').test(spec)) problems.push(`schema requires store key "${key}" but the SPEC never names it`);
}

// The record envelope the SPEC declares (section 3.1 table rows) must match the
// schema's record properties.
const recordProps = Object.keys(schema.properties.records.items.properties);
for (const key of recordProps) {
  if (!new RegExp('`' + key + '`').test(spec)) problems.push(`schema declares record field "${key}" but the SPEC never names it`);
}

// The SPEC's envelope rows are the ones between the section 3.1 table header
// and the body list; every one must be a schema property.
const envelopeSection = spec.split('### 3.1 A record')[1]?.split('The body is host-owned')[0] ?? '';
const specFields = [...envelopeSection.matchAll(/^\| `([a-zA-Z]+)` \|/gm)].map((m) => m[1]);
for (const key of specFields) {
  if (!recordProps.includes(key)) problems.push(`SPEC names envelope field "${key}" but the schema omits it`);
}
if (specFields.length < 4) problems.push(`SPEC envelope table parsed only ${specFields.length} field(s) - the table shape changed`);

if (problems.length) {
  console.error(`SPEC CONSISTENCY: FAIL (${problems.length} drift(s) between spec/SPEC.md and schema/store-1.json)`);
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}
console.log(`SPEC CONSISTENCY: PASS (schema and SPEC agree on ${recordProps.length} record field(s) + ${schema.required.length} store key(s))`);
