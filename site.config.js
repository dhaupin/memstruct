/**
 * site.config.js - THE site identity, authored once, read everywhere.
 *
 * This is the one file that carries the site's identity. Everything else
 * derives from it: the JS surfaces import it directly (no generation, no
 * drift), and `npm run sync` fans the non-JS surfaces out of it
 * (web/ssr.config.js, docs/freestruct.config.yml, docs/_config.yml,
 * web/public/robots.txt, web/public/site.webmanifest).
 *
 * Named site.config.js, not memstruct.config.js, on purpose: the config is
 * named for the CONCERN (the site), never the tool. prestruct reads
 * web/ssr.config.js and freestruct discovers docs/freestruct.config.yml - both
 * engine-owned, both DERIVED here. The dependency points from shell to
 * engines, never the reverse.
 *
 * The docs identity (docs/_config.yml, freestruct.config.yml) and the landing
 * identity (ssr.config.js, robots, webmanifest) come from ONE block below, so
 * the two sites cannot disagree about who they are.
 */
export default {
  // --- identity -----------------------------------------------------------
  name: 'memstruct',
  wordmark: { accent: 'mem', rest: 'struct' },
  badge: 'beta',
  tagline: 'One record format, one merge contract.',
  description:
    'A memory standard for all: one record format and one merge contract, so any two memory systems exchange memory without a rewrite.',
  url: 'https://memstruct.creadev.org',
  repo: 'https://github.com/dhaupin/memstruct',
  author: 'dhaupin',
  license: 'MIT',
  keywords:
    'memstruct, memory, standard, spec, interchange, merge, last-write-wins, tombstone, crdt, mcp, sync, agent',

  // The maker line + org (footer + the docs layout's provenance row).
  maker: { label: 'dhaupin', url: 'https://github.com/dhaupin' },
  org: { name: 'dhaupin', url: 'https://github.com/dhaupin' },

  // --- docs ---------------------------------------------------------------
  // docsUrl is the full public docs URL; docsHost is the Jekyll `url` (the
  // freestruct layer reads host + path separately).
  docs: {
    title: 'memstruct docs',
    url: 'docs.creadev.org/memstruct',
    host: 'docs.creadev.org',
    baseurl: '/memstruct',
  },

  // --- theme --------------------------------------------------------------
  // The two axes as data. themeKey/schemeKey are protocol constants shared by
  // the pre-paint bootstrap, both switches, and the docs layout - they are NOT
  // brand, so they stay stable across rebrands.
  theme: {
    themeKey: 'site-theme',
    schemeKey: 'site-paint-scheme',
    defaultMode: 'dark',
    defaultScheme: 'petrol',
  },

  // --- nav vocabulary -----------------------------------------------------
  // ONE list the header, the burger sidebar, and the footer all render from.
  // 'site' = internal route (NavLink-active); 'out' = external surface (the
  // header GitHub icon replaces this entry's label there; the footer still
  // renders the text link).
  nav: [
    { label: 'Home', to: '/', end: true, group: 'site' },
    { label: 'GitHub', href: 'https://github.com/dhaupin/memstruct', group: 'out' },
  ],
  // Footer-only extras (legal + provenance). Keep legal labels smaller than
  // the nav; provenance links belong in the footer, not the header.
  footerExtras: [
    { label: 'Terms', href: '/terms' },
    { label: 'Privacy', href: '/privacy' },
  ],

  // --- routes -------------------------------------------------------------
  // One entry per Route in web/src/AppLayout.jsx; drives the sitemap, the
  // prerender list, and the per-page meta. `title`/`description` are the
  // canonical per-route meta; the page component may override via usePageMeta.
  routes: [
    {
      path: '/',
      priority: '1.0',
      changefreq: 'monthly',
      meta: {
        title: 'memstruct - the memory standard',
        description:
          'One record format and one merge contract, so any two memory systems exchange memory without a rewrite. A language-neutral standard with a CLI and a conformance lane.',
      },
    },
    {
      path: '/terms',
      priority: '0.3',
      changefreq: 'yearly',
      meta: {
        title: 'Terms | memstruct',
        description: 'Plain terms for the memstruct standard, CLI, and this site: they ship as is under MIT, and you run the tool on your own stores.',
      },
    },
    {
      path: '/privacy',
      priority: '0.3',
      changefreq: 'yearly',
      meta: {
        title: 'Privacy | memstruct',
        description: 'What the memstruct CLI and this site collect: nothing hidden, no tracking states to find.',
      },
    },
  ],

  // The static 404 the host serves every miss; the shape + copy match
  // pages/NotFound.jsx so the host-not-found and the hydrate-not-found read
  // as one page, not two.
  notFound: {
    heading: '404',
    body: 'That page does not exist here.',
    primaryCta: { label: 'Back home', href: '/' },
  },
}
