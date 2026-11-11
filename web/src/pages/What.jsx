/**
 * pages/What.jsx - what ships in the box: one record format, one merge
 * contract, three verbs, a conformance lane. Shell conventions kept
 * (usePageMeta in the component body).
 */
import { Link } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta.js'
import site, { routeMeta } from '../site.js'

const ENVELOPE = [
  { glyph: '1', name: 'id', what: 'REQUIRED string, non-empty. Stable and unique within a store, opaque to the format.' },
  { glyph: '2', name: 'createdAt', what: 'REQUIRED integer, epoch milliseconds. When the record was born.' },
  { glyph: '3', name: 'updatedAt', what: 'OPTIONAL integer, epoch milliseconds. The merge clock; absent means createdAt.' },
  { glyph: '4', name: 'deletedAt', what: 'OPTIONAL integer or null, epoch milliseconds. The tombstone - a delete, not an erase.' },
]

const PROPERTIES = [
  { glyph: '1', name: 'Convergence', what: 'the same records merge to the same result on every replica, in any order' },
  { glyph: '2', name: 'Determinism', what: 'merge is a pure function of its inputs - same inputs, same output, everywhere' },
  { glyph: '3', name: 'Tombstone semantics', what: 'a delete hides a record unless it was updated after the deletion, then the update resurrects it' },
  { glyph: '4', name: 'Monotonicity', what: 'an older version never displaces a newer one, and never resurrects a tombstone without a newer update' },
]

export default function What() {
  const meta = routeMeta('/what')
  usePageMeta({ siteUrl: site.url, path: '/what', title: meta.title, description: meta.description })
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">what</p>
          <h1>
            One format, <span className="accent">one merge.</span>
          </h1>
          <p className="lede">
            memstruct is a zero-dependency ESM standard. It defines one record
            format and one merge contract, and ships a reference implementation
            plus a conformance lane any language can be graded against.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href={site.repo}>See the repo</a>
            <a className="btn btn-ghost" href={`${site.docs.url}/what/`}>Read the docs</a>
          </div>
          <pre className="code"><span className="k">npx</span> memstruct <span className="cm"># lint | merge | audit-merge | check | doctor</span></pre>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="section-title">The record format</h2>
          <p className="sub">
            A store is one JSON document. A record has a four-field envelope and
            a host-owned body - <strong>refuse the envelope, carry the body</strong>.
          </p>
          <div className="grid">
            {ENVELOPE.map((e) => (
              <div className="card" key={e.name}>
                <h3><span className="glyph">{e.glyph}</span>{e.name}</h3>
                <p>{e.what}</p>
              </div>
            ))}
          </div>
          <p className="lede" style={{ marginTop: 18 }}>
            Everything else - <code>kind</code>, <code>scope</code>,{' '}
            <code>body</code>, <code>links</code>, <code>provenance</code>,{' '}
            <code>ttl</code>, <code>meta</code>, and any field the standard has
            never heard of - is host-owned vocabulary, carried through
            unchanged.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="section-title">The merge contract</h2>
          <p className="sub">
            Reconciliation is the reason memstruct exists. A conforming merge
            satisfies four observable properties - stated as properties, not as
            an algorithm, so a richer merge stays legal.
          </p>
          <div className="grid">
            {PROPERTIES.map((p) => (
              <div className="card" key={p.name}>
                <h3><span className="glyph">{p.glyph}</span>{p.name}</h3>
                <p>{p.what}.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="section-title">The verbs</h2>
          <p className="sub">
            Three interop commands, language-neutral by construction, plus two
            self-check verbs.
          </p>
          <div className="table-wrap">
            <table className="attacks">
              <thead>
                <tr><th>verb</th><th>what it does</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td className="mod">lint</td>
                  <td>validate a store against the record format. Unknown fields are carried, never refused.</td>
                </tr>
                <tr>
                  <td className="mod">merge</td>
                  <td>reconcile two stores under the merge contract. JSON in, JSON out.</td>
                </tr>
                <tr>
                  <td className="mod">audit-merge</td>
                  <td>run a whole case directory in both input orders, so convergence is tested rather than asserted.</td>
                </tr>
                <tr>
                  <td className="mod">check</td>
                  <td>run the standard's own battery - the four merge properties, the linter's refusals, and the conformance lane.</td>
                </tr>
                <tr>
                  <td className="mod">doctor</td>
                  <td>prove the merge end to end on a demo store and print the result, so the contract is shown, not asserted.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="section-title">The smallest surface</h2>
          <p className="sub">
            A store, a merge, a golden. Everything else is the host's choice.
          </p>
          <pre className="code">{'{ '}<span className="k">"memstruct"</span>: 1, <span className="k">"records"</span>: [{'\n'}  {'{ '}<span className="k">"id"</span>: <span className="cm">"notes/hello"</span>, <span className="k">"createdAt"</span>: 1730000000000,{'\n'}    <span className="k">"updatedAt"</span>: 1730000500000, <span className="k">"body"</span>: <span className="cm">"any host-owned shape"</span> {'}'}{'\n'}] {'}'}</pre>
          <div className="cta-row" style={{ marginTop: 20 }}>
            <Link className="btn btn-primary" to="/start">Start here</Link>
            <a className="btn btn-ghost" href={`${site.docs.url}/cli/`}>The CLI</a>
            <a className="btn btn-ghost" href={`${site.docs.url}/why/`}>Why memstruct</a>
          </div>
        </div>
      </section>
    </>
  )
}
