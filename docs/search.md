---
permalink: search/
layout: default
title: Search
description: Static full-text search over the memstruct docs, powered by Pagefind indexing the final baked HTML.
nav_order: 26
---

# Search

<div id="search"></div>
<link href="{{ '/pagefind/pagefind-ui.css' | relative_url }}" rel="stylesheet">
<script src="{{ '/pagefind/pagefind-ui.js' | relative_url }}"></script>
<script>
  new PagefindUI({ element: '#search', showSubResults: true })
</script>

<div class="crosslinks">
<p><strong>More in these docs:</strong>
<a href="{{ '/' | relative_url }}">home</a> ·
<a href="{{ '/cli/' | relative_url }}">the CLI</a> ·
<a href="{{ '/what/' | relative_url }}">what</a> ·
<a href="{{ '/status/' | relative_url }}">family status</a></p>
</div>
