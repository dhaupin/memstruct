/**
 * pages/About.jsx - who builds memstruct, the struct family it belongs to,
 * and the MIT license terms. Shell conventions kept (usePageMeta in the body).
 */
import { Link } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta.js'
import site, { routeMeta } from '../site.js'

const FAMILY = [
  { name: 'packstruct', what: 'the shared /packs spec + lint CLI, and the home of the memory + sync profiles', href: 'https://github.com/dhaupin/packstruct' },
  { name: 'crashtest', what: 'the adversarial lane', href: 'https://github.com/dhaupin/crashtest' },
  { name: 'eyestruct', what: 'the committed visual memory', href: 'https://github.com/dhaupin/eyestruct' },
  { name: 'poststruct', what: 'the baked-artifact audit', href: 'https://github.com/dhaupin/poststruct' },
  { name: 'govstruct', what: 'the family governance layer', href: 'https://github.com/dhaupin/govstruct' },
  { name: 'monoforge', what: 'the factory that stamps new members', href: 'https://github.com/dhaupin/monoforge' },
  { name: 'vant', what: 'the store shape (the memory binding)', href: 'https://github.com/dhaupin/vant' },
  { name: 'gistory', what: 'the merge (the sync binding)', href: 'https://github.com/dhaupin/gistory' },
]

export default function About() {
  const meta = routeMeta('/about')
  usePageMeta({ siteUrl: site.url, path: '/about', title: meta.title, description: meta.description })
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">about</p>
          <h1>
            One arm of <span className="accent">the struct family.</span>
          </h1>
          <p className="lede">
            memstruct is built by {site.maker.label} and by AI agents working in
            the open. Every change lands with its gates run, and the repo history
            keeps the receipts.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href={site.repo}>See the repo</a>
            <a className="btn btn-ghost" href="https://creadev.org">Creadev.org</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="section-title">The struct family</h2>
          <p className="sub">
            Small, zero-dependency tools that keep a suite of repos honest about
            itself. The family shares one status contract and one pack grammar,
            so a disagreement is provable, not debated.
          </p>
          <div className="table-wrap">
            <table className="attacks">
              <thead>
                <tr><th>member</th><th>what it carries</th></tr>
              </thead>
              <tbody>
                {FAMILY.map((f) => (
                  <tr key={f.name}>
                    <td><a href={f.href} target="_blank" rel="noreferrer">{f.name}</a></td>
                    <td>{f.what}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="sub" style={{ marginTop: 18 }}>
            memstruct is the family's memory standard: the record grammar the
            <code>memory</code> and <code>sync</code> profiles bind. Its engine
            receipts are <a href="https://github.com/dhaupin/vant" target="_blank" rel="noreferrer">vant</a> (the
            store shape) and <a href="https://github.com/dhaupin/gistory" target="_blank" rel="noreferrer">gistory</a> (the merge).
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="section-title">License and provenance</h2>
          <p className="sub">
            memstruct is MIT-licensed. The standard, the CLI, and the site are
            all open source, so the honest summary is: read the code.
          </p>
          <div className="cta-row">
            <a className="btn btn-ghost" href={`${site.repo}/blob/main/LICENSE`}>MIT License</a>
            <a className="btn btn-ghost" href={`${site.repo}/blob/main/spec/SPEC.md`}>SPEC.md</a>
            <Link className="btn btn-ghost" to="/status">Family status</Link>
          </div>
        </div>
      </section>
    </>
  )
}
