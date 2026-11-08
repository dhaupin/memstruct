/**
 * pages/Terms.jsx - memstruct's terms, in the family's plain-language shape
 * (crashtest + poststruct canon: eyebrow, dated web version, surface facts,
 * no theater). Short by design: the MIT license in the repository carries
 * the real legal weight; this page states the surface facts in plain
 * language.
 */
import { Link } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta.js'

const SITE_URL = 'https://memstruct.creadev.org'

export default function Terms() {
  usePageMeta({
    siteUrl: SITE_URL,
    path: '/terms',
    title: 'Terms | memstruct',
    description: 'Plain terms: the standard, CLI, and docs ship as is under MIT; you run the tool on your own stores and own the decisions it gates.',
  })
  return (
    <section className="section" style={{ paddingTop: 56 }}>
      <div className="wrap legal">
        <p className="eyebrow">Plain language, no theater</p>
        <h1>Terms of Use</h1>
        <p className="sub">Web version 2026-11-08 - the long-form lives in the <a href="https://github.com/dhaupin/memstruct">repo</a>.</p>

        <h3>Use of the site and tool</h3>
        <p>
          memstruct is an open standard with an open-source reference tool,
          distributed under the{' '}
          <a href="https://github.com/dhaupin/memstruct/blob/main/LICENSE">MIT license</a>{' '}
          (the family ships MIT; the LICENSE file in the repository is the
          governing text). The spec, the CLI, the conformance lane, and this
          site are provided as is, without warranty of any kind. You run the
          tool on your own stores; you own the decisions it gates and the
          fixes you apply.
        </p>

        <h3>What it is for</h3>
        <p>
          memstruct validates and reconciles memory stores against a frozen
          record format and merge contract. It reads the files you point it at
          and reports what does not conform. Point it at data you are entitled
          to read: your own store, your team's, or a project you audit under an
          agreement with its owner.
        </p>

        <h3>What you own</h3>
        <p>
          Every store you lint and every merge you run belongs to <strong>you</strong>.
          We see nothing, hold nothing, and collect nothing (see{' '}
          <Link to="/privacy">privacy</Link>).
        </p>

        <h3>Fair use of the site</h3>
        <p>
          This site is documentation. Do not attack it, do not drown it, and
          do not represent yourself as{' '}
          <a href="https://creadev.org" target="_blank" rel="noopener">Creadev</a>{' '}
          unless you are. Site code is MIT like the package.
        </p>

        <h3>Changes</h3>
        <p>
          These terms may be adjusted as the project grows - material changes
          land with a date bump, and the repo history keeps every prior
          version.
        </p>

        <p style={{ marginTop: 26 }}>
          <Link to="/" className="btn btn-ghost">Back home</Link>
        </p>

        <p className="legal-family">
          The same plain-language legal form ships on these struct-family
          sites:
          <a href="https://crashtest.creadev.org/terms">crashtest</a> ·
          <a href="https://packstruct.creadev.org/terms">packstruct</a> ·
          <a href="https://monoforge.creadev.org/terms">monoforge</a> ·
          <a href="https://poststruct.creadev.org/terms">poststruct</a>
        </p>
      </div>
    </section>
  )
}
