/**
 * pages/Home.jsx - the memstruct landing (the marketing pitch).
 *
 * The one-liner: one record format and one merge contract, so any two memory
 * systems exchange memory without a rewrite. This page sells that to four
 * readers at once - the engineer wiring an agent's memory, the platform team
 * tired of N bespoke exports, the spec author who wants interop to be real,
 * and the operator reconciling two devices that both edited offline.
 *
 * Every claim is grounded in the shipped standard: the record envelope and the
 * four merge properties in spec/SPEC.md, the verbs in bin/cli.mjs, and the
 * conformance lane in conformance/cases/. Receipts, not invention.
 *
 * Shell conventions kept: usePageMeta lives in the component BODY (calling it
 * inside another effect was an invalid hook call - keep it here). The .code
 * pre carries the token classes the docs Rouge output shares (.k/.cm/.gp);
 * CTAs compose .btn + a color modifier.
 */
import { Link } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta.js'
import site, { routeMeta } from '../site.js'

const SPEC = `${site.repo}/blob/main/spec/SPEC.md`

/** One "who it is for" card (an audience + the payoff). */
const AUDIENCE = [
  {
    glyph: '◧',
    title: 'Agent and app builders',
    body: 'Your brain writes memory in one grammar, so a second memory backend is a config change, not a second format to hand-map. Export, import, and merge ride the same three verbs.',
  },
  {
    glyph: '◨',
    title: 'Platform and infra teams',
    body: 'Stop writing an N-to-N adapter for every pair of memory systems. One interchange, one conformance lane, and any implementation in any language is graded against the same cases.',
  },
  {
    glyph: '⌘',
    title: 'Spec and standards authors',
    body: 'A frozen v1 that is small on purpose: a four-field envelope, a host-owned body, and a merge stated as four observable properties - so the standard does not need a committee for every field.',
  },
  {
    glyph: '⇄',
    title: 'Anyone syncing two stores',
    body: 'Two devices edited while offline; both now claim the same id. The merge is normative and deterministic, so the answer is the same on every replica, in any order - no bespoke reconciliation.',
  },
]

/** The four-field envelope plus the host-owned body. */
const ENVELOPE = [
  { glyph: '1', name: 'id', what: 'REQUIRED. Stable, unique in the store, opaque to the format - a ULID, a UUID, a path.' },
  { glyph: '2', name: 'createdAt', what: 'REQUIRED. Epoch milliseconds. When the record was born.' },
  { glyph: '3', name: 'updatedAt', what: 'OPTIONAL. Epoch milliseconds. The merge clock; absent means createdAt.' },
  { glyph: '4', name: 'deletedAt', what: 'OPTIONAL. Epoch milliseconds. The tombstone - a delete, not an erase.' },
]

/** The four normative merge properties. */
const PROPERTIES = [
  { glyph: '1', name: 'Convergence', sig: 'any order -> same result', what: 'the same records merge the same way on every replica, however they arrive' },
  { glyph: '2', name: 'Determinism', sig: 'same in -> same out', what: 'merge is a pure function of its inputs, on every device and every run' },
  { glyph: '3', name: 'Tombstone semantics', sig: 'delete hides, later edit resurrects', what: 'a delete hides a record unless it was updated after the deletion' },
  { glyph: '4', name: 'Monotonicity', sig: 'newer wins, always', what: 'an older version never displaces a newer one, and never resurrects a tombstone without a newer update' },
]

/** The four-step adoption path. */
const STEPS = [
  { n: '01', title: 'Adopt the envelope', body: 'Give every record an id, a createdAt, and optional updatedAt and deletedAt. Your kind, scope, body, links, and provenance ride along untouched.' },
  { n: '02', title: 'Keep your substrate', body: 'git, a database, a directory, a vector index - memstruct is the record grammar, not the store. Nothing about where memory lives changes.' },
  { n: '03', title: 'Reconcile with the contract', body: 'Merge two stores with the reference LWW-plus-tombstones algorithm, or any CRDT-class merge that satisfies the four properties. Run the CLI, never an import.' },
  { n: '04', title: 'Gate it', body: 'Run audit-merge in CI against the conformance cases. A non-deterministic or order-dependent merge fails the order-independence leg instead of passing quietly.' },
]

/** Why a dev adopts it. */
const WHY_ADOPT = [
  { glyph: '◍', title: 'One grammar, not N adapters', body: 'The value is combinatorial: with N systems, a shared format turns N squared translations into N. Every new system that adopts it interoperates with all the rest.' },
  { glyph: '◧◨', title: 'Refuse the envelope, carry the body', body: 'The envelope is the shared-facts column every reader assigns meaning to. Everything else is host-owned vocabulary, carried through and never refused - which is how a standard for all exists.' },
  { glyph: '⬡', title: 'The merge is the hard part, and it is normative', body: 'A shared shape only gets two systems to read each other. memstruct makes reconciliation normative, so convergence, determinism, tombstones, and monotonicity are the contract, not a hope.' },
  { glyph: '⌁', title: 'Zero dependencies', body: 'Plain ESM, Node 22+, no build step. The interop surface is a command with JSON in and JSON out, so a Python or Go implementation is graded by the same harness.' },
  { glyph: '⊞', title: 'A conformance lane, not a promise', body: 'Each case is a directory with local, remote, and expected stores, run in both input orders. Convergence is tested rather than asserted, and your implementation can be graded against it.' },
  { glyph: '✓', title: 'Grounded in shipped engines', body: 'Not invented: the store shape is vant, the merge is gistory. Two engines, two persistence stories, one grammar - and packstruct binds it through the memory and sync profiles.' },
]

export default function Home() {
  const meta = routeMeta('/')
  usePageMeta({ siteUrl: site.url, path: '/', title: meta.title, description: meta.description })
  return (
    <>
      {/* ---- hero ------------------------------------------------------- */}
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">
            {site.name} {site.badge} <span className="dot">·</span> MIT <span className="dot">·</span> zero dependencies
          </p>
          <h1>
            One record format. <span className="accent">One merge contract.</span><br />
            Every memory system, one grammar.
          </h1>
          <p className="lede">
            Every memory system invents its own record shape and its own merge,
            so moving memory between two of them is a rewrite every time.
            memstruct is the small frozen interchange that ends the rewrite: a
            language-neutral <strong>record format</strong>, a <strong>merge
            contract</strong> stated as observable properties, and a
            conformance lane any implementation can be graded against.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href={`${site.docs.url}/`}>Read the docs</a>
            <a className="btn btn-ghost" href={`${site.docs.url}/start/`}>Start in five minutes</a>
            <a className="btn btn-ghost" href={SPEC}>See the spec</a>
          </div>
          <pre className="code"><span className="gp">$</span> npx memstruct lint my-store.json{'\n'}<span className="gp">$</span> npx memstruct merge <span className="k">--local</span> mine.json <span className="k">--remote</span> theirs.json{'\n'}<span className="gp">$</span> npx memstruct audit-merge conformance/cases{'\n\n'}<span className="cm"># three verbs, JSON in, JSON out, zero dependencies</span></pre>
          <div className="chips">
            <span className="chip">language-neutral</span>
            <span className="chip">merge is normative</span>
            <span className="chip">conformance lane</span>
            <span className="chip">tombstone-aware</span>
            <span className="chip">MCP-friendly</span>
          </div>
        </div>
      </section>

      {/* ---- the thesis band ------------------------------------------- */}
      <section className="band thesis">
        <div className="wrap">
          <p className="band-kicker">The thesis</p>
          <p className="band-line">
            A brain, a prompt library, a notes app, and a vector store all keep
            memory in their <span className="accent">own</span> shape and merge
            it their <span className="accent">own</span> way. So every move
            between two of them is a one-off adapter that rots. That is not four
            problems. It is <span className="accent">one missing grammar.</span>
          </p>
        </div>
      </section>

      {/* ---- who it is for --------------------------------------------- */}
      <section className="section">
        <div className="wrap">
          <h2 className="section-title">Who it is for</h2>
          <p className="sub">
            The same interchange pays off four ways. Pick the one that is your job.
          </p>
          <div className="grid">
            {AUDIENCE.map((a) => (
              <div className="card" key={a.title}>
                <h3><span className="glyph">{a.glyph}</span>{a.title}</h3>
                <p>{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- why it is needed ------------------------------------------ */}
      <section className="section">
        <div className="wrap">
          <h2 className="section-title">Why it is needed</h2>
          <p className="sub">
            The drift between memory systems is one gap seen from three sides:
            the shape, the substrate, and the merge.
          </p>
          <div className="table-wrap">
            <table className="attacks">
              <thead>
                <tr><th>where it hurts</th><th>what you hit today</th><th>what memstruct gives you</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td className="mod">the shape</td>
                  <td><span className="what">Two systems name and nest their records differently.</span> <span className="why">Reading one from the other is a hand-written mapping that breaks on the next field.</span></td>
                  <td><span className="shipped">A four-field envelope</span> every conforming reader understands, with the body carried through untouched.</td>
                </tr>
                <tr>
                  <td className="mod">the substrate</td>
                  <td><span className="what">"Where does memory live" gets tangled with "what is a memory."</span> <span className="why">A shape standard that also dictates storage cannot ride git, a database, or a vector index at once.</span></td>
                  <td><span className="shipped">A grammar that rides any substrate</span> - git, a database, a directory, a vector index: the host's choice.</td>
                </tr>
                <tr>
                  <td className="mod">the merge</td>
                  <td><span className="what">Two devices edited offline; both now claim the same id.</span> <span className="why">A shape-only standard punts reconciliation to every implementation, so they disagree again.</span></td>
                  <td><span className="shipped">A normative merge</span> - convergence, determinism, tombstones, monotonicity - as four observable properties.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---- what you get ---------------------------------------------- */}
      <section className="section">
        <div className="wrap">
          <h2 className="section-title">What you get</h2>
          <p className="sub">
            One record format, one merge contract, three verbs, and a
            conformance lane any language can be graded against.
          </p>
          <div className="grid">
            {ENVELOPE.map((e) => (
              <div className="card" key={e.name}>
                <h3><span className="glyph">{e.glyph}</span>{e.name}</h3>
                <p>{e.what}</p>
              </div>
            ))}
          </div>
          <div className="grid" style={{ marginTop: 14 }}>
            {PROPERTIES.map((p) => (
              <div className="card" key={p.name}>
                <h3><span className="glyph">{p.glyph}</span>{p.name}</h3>
                <p><code>{p.sig}</code> - {p.what}.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- how it works ---------------------------------------------- */}
      <section className="section">
        <div className="wrap">
          <h2 className="section-title">How it works</h2>
          <p className="sub">
            Four steps from your own store to a merge any implementation can
            reproduce.
          </p>
          <div className="pipeline">
            {STEPS.map((s) => (
              <div className="pipe-step" key={s.n}>
                <span className="pipe-n">{s.n}</span>
                <div>
                  <strong>{s.title}</strong>{' '}
                  <span>{s.body}</span>
                </div>
              </div>
            ))}
          </div>
          <pre className="code" style={{ marginTop: 22 }}><span className="cm">// a store is one JSON document</span>{'\n'}{'{ '}<span className="k">"memstruct"</span>: 1, <span className="k">"records"</span>: [{'\n'}  {'{ '}<span className="k">"id"</span>: <span className="cm">"notes/hello"</span>, <span className="k">"createdAt"</span>: 1730000000000,{'\n'}    <span className="k">"updatedAt"</span>: 1730000500000, <span className="k">"body"</span>: <span className="cm">"any host-owned shape"</span> {'}'}{'\n'}] {'}'}</pre>
        </div>
      </section>

      {/* ---- the layer trap -------------------------------------------- */}
      <section className="section">
        <div className="wrap">
          <h2 className="section-title">The layer trap, avoided</h2>
          <p className="lede" style={{ marginTop: 8 }}>
            "How do we standardize memory" is <strong>two</strong> questions,
            not one: <em>what is a memory</em> (schema and verbs), and <em>where
            does it live and merge</em> (persistence and sync). Git answers the
            second superbly and has no opinion on the first.
          </p>
          <p className="lede" style={{ marginTop: 8 }}>
            So memstruct splits the concern. The record format is the standard,
            the substrate is yours, and the merge contract is where the
            semantics actually live. memstruct does not compete with git, or
            with MCP - it is the record grammar that rides them.
          </p>
          <div className="cta-row" style={{ marginTop: 20 }}>
            <Link className="btn btn-primary" to="/why">Why memstruct</Link>
            <a className="btn btn-ghost" href={`${site.docs.url}/what/`}>What it is</a>
            <a className="btn btn-ghost" href={`${site.docs.url}/cli/`}>The CLI</a>
          </div>
        </div>
      </section>

      {/* ---- grounded in shipped engines ------------------------------- */}
      <section className="section">
        <div className="wrap">
          <h2 className="section-title">Not invented - grounded in shipped engines</h2>
          <p className="sub">
            memstruct is a picture of what memory engines already do, frozen
            into a grammar. Two engines, two persistence stories, one standard.
          </p>
          <div className="grid">
            <div className="card">
              <h3><span className="glyph">◈</span> vant - the store shape</h3>
              <p>Markdown memory files in your own repository, where git history becomes the memory lineage. The record envelope and the store are vant's shape, formalized.</p>
            </div>
            <div className="card">
              <h3><span className="glyph">◆</span> gistory - the merge</h3>
              <p>A pure, deterministic, tombstone-aware last-write-wins merge. The reference algorithm in <code>src/merge.mjs</code> is gistory's, stated as four properties.</p>
            </div>
            <div className="card">
              <h3><span className="glyph">▦</span> packstruct - the binding</h3>
              <p>Two profiles - <code>memory</code> (the store binding) and <code>sync</code> (the replicated binding) - ship memstruct in the family's pack spec.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- why devs adopt -------------------------------------------- */}
      <section className="section">
        <div className="wrap">
          <h2 className="section-title">Why builders adopt it</h2>
          <p className="sub">
            Six reasons a team picks it up - and keeps it.
          </p>
          <div className="grid">
            {WHY_ADOPT.map((w) => (
              <div className="card" key={w.title}>
                <h3><span className="glyph">{w.glyph}</span>{w.title}</h3>
                <p>{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- proof / ecosystem ----------------------------------------- */}
      <section className="section">
        <div className="wrap">
          <h2 className="section-title">Rides the rails you already have</h2>
          <p className="sub">
            memstruct reinvents nothing. It sits on the protocols and formats
            the ecosystem already runs.
          </p>
          <div className="grid">
            <div className="card">
              <h3><span className="glyph">◇</span> MCP - the wire</h3>
              <p>The transport memstruct rides, never competes with. Memory moves as data over the protocol you already speak.</p>
            </div>
            <div className="card">
              <h3><span className="glyph">◇</span> W3C PROV-O - provenance</h3>
              <p>An optional <code>provenance</code> object SHOULD follow PROV-O, so lineage is interoperable where it matters.</p>
            </div>
            <div className="card">
              <h3><span className="glyph">◇</span> CRDTs - the richer road</h3>
              <p>An Automerge-style merge conforms if and only if it satisfies the four properties. The properties are normative; the algorithm is the reference.</p>
            </div>
          </div>
          <div className="cta-row" style={{ marginTop: 22 }}>
            <a className="btn btn-ghost" href={`${site.docs.url}/why/`}>Why memstruct</a>
            <a className="btn btn-ghost" href={`${site.docs.url}/what/`}>What it is</a>
            <Link className="btn btn-ghost" to="/status">Family status</Link>
          </div>
        </div>
      </section>

      {/* ---- final CTA ------------------------------------------------- */}
      <section className="band band-cta">
        <div className="wrap">
          <h2>Stop rewriting memory. Adopt one grammar.</h2>
          <p className="sub">
            A frozen v1 record format, a normative merge, and a conformance
            lane any language can be graded against. MIT-licensed, zero
            dependencies.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href={`${site.docs.url}/start/`}>Read the on-ramp</a>
            <a className="btn btn-ghost" href={SPEC}>The spec</a>
            <a className="btn btn-ghost" href={site.repo}>GitHub</a>
          </div>
        </div>
      </section>
    </>
  )
}
