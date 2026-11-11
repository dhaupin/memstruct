/**
 * pages/Why.jsx - why memstruct exists: every memory system invents its own
 * shape and its own merge, so interop is a rewrite every time. Shell
 * conventions kept (usePageMeta in the component body).
 */
import { Link } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta.js'
import site, { routeMeta } from '../site.js'

export default function Why() {
  const meta = routeMeta('/why')
  usePageMeta({ siteUrl: site.url, path: '/why', title: meta.title, description: meta.description })
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">why</p>
          <h1>
            The same rewrite, <span className="accent">N squared times.</span>
          </h1>
          <p className="lede">
            Every memory system invents its own record shape and its own merge,
            so moving memory between two of them is a rewrite every time. That
            is the xkcd-927 shape: the answer is not a 50,001st memory system,
            it is a small frozen interchange plus a conformance lane.
          </p>
          <div className="cta-row">
            <Link className="btn btn-primary" to="/what">What memstruct is</Link>
            <a className="btn btn-ghost" href={`${site.docs.url}/`}>Read the docs</a>
            <a className="btn btn-ghost" href={site.repo}>See the repo</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="section-title">The problem: the rewrite never ends</h2>
          <p className="lede" style={{ marginTop: 8 }}>
            A brain, a prompt library, a notes app, and a vector store each keep
            memory in their own shape and merge it their own way. Reading one
            from the other is a hand-written mapping; with N systems that is N
            squared one-off adapters, and every one of them rots on the next
            field someone adds.
          </p>
          <p className="lede" style={{ marginTop: 8 }}>
            A shared shape collapses that to N: each system maps once to the
            interchange, and interoperates with all the rest for free. That is
            the whole reason a small frozen grammar is worth more than any
            single implementation.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="section-title">The layer trap: two questions, not one</h2>
          <p className="lede" style={{ marginTop: 8 }}>
            "How do we standardize memory" is two questions: <em>what is a
            memory</em> (schema and verbs), and <em>where does it live and
            merge</em> (persistence and sync). Git answers the second superbly
            and has no opinion on the first.
          </p>
          <p className="lede" style={{ marginTop: 8 }}>
            So memstruct splits the concern: the record format is the standard,
            git (or a database, a directory, a vector index) is the substrate,
            and the merge contract is where the semantics actually live.
            memstruct does not compete with git, or with MCP. It is the record
            grammar that rides them.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="section-title">Why the merge, not just the shape</h2>
          <p className="lede" style={{ marginTop: 8 }}>
            A shared record shape gets two systems to <em>read</em> each other's
            memory. It does not get them to <em>reconcile</em> two divergent
            copies, which is the hard part: two devices, both edited while
            offline, both now claim the same id. A shape-only standard punts
            that to every implementation, so every implementation invents its
            own answer and they disagree again.
          </p>
          <p className="lede" style={{ marginTop: 8 }}>
            memstruct makes the merge normative and states it as four observable
            properties rather than one algorithm - convergence, determinism,
            tombstone semantics, and monotonicity. That is the deliberate move:
            it fixes <em>what must be true</em> while leaving <em>how</em> open,
            so a timestamp merge and a CRDT-class merge both conform.
          </p>
          <div className="cta-row" style={{ marginTop: 20 }}>
            <Link className="btn btn-primary" to="/start">Start here</Link>
            <a className="btn btn-ghost" href={`${site.docs.url}/what/`}>The record format</a>
            <a className="btn btn-ghost" href={`${site.docs.url}/cli/`}>The CLI</a>
          </div>
        </div>
      </section>
    </>
  )
}
