/**
 * pages/Home.jsx - memstruct's landing. Keeps the shell structure (eyebrow,
 * h1, lede, cta-row, code block): usePageMeta lives in the component BODY,
 * the .code pre carries the token classes the docs Rouge output shares
 * (.k/.cm), and CTAs compose .btn + a color modifier.
 */
import usePageMeta from '../hooks/usePageMeta.js'
import site, { routeMeta } from '../site.js'

export default function Home() {
  const meta = routeMeta('/')
  usePageMeta({ siteUrl: site.url, path: '/', title: meta.title, description: meta.description })
  return (
    <section className="hero">
      <div className="wrap">
        <p className="eyebrow">the memory standard</p>
        <h1>
          One record format, <span className="accent">one merge contract.</span>
        </h1>
        <p className="lede">
          Every memory system invents its own record shape and its own merge, so
          moving memory between two of them is a rewrite every time. memstruct is
          the small frozen interchange that ends the rewrite: a language-neutral
          record format, a merge contract stated as observable properties, and a
          conformance lane any implementation can be graded against.
        </p>
        <div className="cta-row">
          <a className="btn btn-primary" href={site.repo}>See the spec</a>
          <a className="btn btn-ghost" href={`${site.docs.url}/`}>Read the docs</a>
        </div>
        <pre className="code"><span className="cm"># three verbs, zero dependencies</span>{'\n'}npx memstruct <span className="k">lint</span> my-store.json{'\n'}npx memstruct <span className="k">merge</span> --local mine.json --remote theirs.json{'\n'}npx memstruct <span className="k">audit-merge</span> conformance/cases</pre>
      </div>
    </section>
  )
}
