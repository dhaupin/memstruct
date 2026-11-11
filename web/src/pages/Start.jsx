/**
 * pages/Start.jsx - the beginner on-ramp: lint a store, merge two, grade the
 * merge. Shell conventions kept (usePageMeta in the component body).
 */
import { Link } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta.js'
import site, { routeMeta } from '../site.js'

export default function Start() {
  const meta = routeMeta('/start')
  usePageMeta({ siteUrl: site.url, path: '/start', title: meta.title, description: meta.description })
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">start here</p>
          <h1>
            Three verbs, <span className="accent">zero dependencies.</span>
          </h1>
          <p className="lede">
            Never heard of memstruct? This is the five-minute on-ramp. It ends
            with a store you can validate, two stores you can reconcile, and a
            merge you can grade against the conformance lane.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href={`${site.docs.url}/start/`}>Full walkthrough</a>
            <a className="btn btn-ghost" href={`${site.docs.url}/cli/`}>The CLI</a>
          </div>
          <pre className="code"><span className="gp">$</span> npx memstruct <span className="k">lint</span> my-store.json</pre>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="section-title">1. Write a store</h2>
          <p className="lede" style={{ marginTop: 8 }}>
            A store is one JSON document. A record carries a four-field
            envelope; the body is yours. <code>kind</code>, <code>scope</code>,
            <code>body</code>, <code>links</code>, and <code>provenance</code>
            are host-owned - the format carries them and never refuses them.
          </p>
          <pre className="code">{'{ '}<span className="k">"memstruct"</span>: 1, <span className="k">"records"</span>: [{'\n'}  {'{ '}<span className="k">"id"</span>: <span className="cm">"notes/hello"</span>,{'\n'}    <span className="k">"createdAt"</span>: 1730000000000,{'\n'}    <span className="k">"updatedAt"</span>: 1730000500000,{'\n'}    <span className="k">"kind"</span>: <span className="cm">"lesson"</span>, <span className="k">"body"</span>: <span className="cm">"any host-owned shape goes here"</span> {'}'}{'\n'}] {'}'}</pre>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="section-title">2. Validate it</h2>
          <p className="lede" style={{ marginTop: 8 }}>
            <code>lint</code> checks the envelope - a missing <code>id</code>, a
            non-integer <code>createdAt</code>, a duplicate id - and nothing
            more. Unknown fields pass. Exit 0 clean, 1 violations, 2 usage.
          </p>
          <pre className="code"><span className="gp">$</span> npx memstruct <span className="k">lint</span> my-store.json{'\n'}<span className="cm"># memstruct lint: 1 record(s) checked in my-store.json</span></pre>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="section-title">3. Merge two stores</h2>
          <p className="lede" style={{ marginTop: 8 }}>
            <code>merge</code> reconciles two stores under the contract and
            prints a canonical result - records sorted by id, keys sorted - so
            it diffs cleanly against a golden. The same inputs always produce
            the same output.
          </p>
          <pre className="code"><span className="gp">$</span> npx memstruct <span className="k">merge</span> --local mine.json --remote theirs.json</pre>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="section-title">4. Grade the merge</h2>
          <p className="lede" style={{ marginTop: 8 }}>
            <code>audit-merge</code> runs a directory of cases, each with local,
            remote, and expected stores, in <strong>both</strong> input orders -
            the order-independence leg, which names a non-deterministic merge
            instead of passing it.
          </p>
          <pre className="code"><span className="gp">$</span> npx memstruct <span className="k">audit-merge</span> conformance/cases{'\n'}<span className="cm"># memstruct audit-merge: 5/5 case(s) honored</span>{'\n\n'}<span className="cm"># or prove the whole contract end to end:</span>{'\n'}<span className="gp">$</span> npx memstruct <span className="k">doctor</span></pre>
          <div className="cta-row" style={{ marginTop: 20 }}>
            <Link className="btn btn-primary" to="/what">What memstruct is</Link>
            <a className="btn btn-ghost" href={`${site.docs.url}/cli/`}>The CLI</a>
            <a className="btn btn-ghost" href={`${site.docs.url}/what/`}>The record format</a>
          </div>
        </div>
      </section>
    </>
  )
}
