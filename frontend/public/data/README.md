# Editing the data files

This site is fully static. To update its content, edit the JSON files in
`/public/data/` directly on GitHub. After your commit reaches the `main`
branch, the GitHub Action will rebuild and redeploy the site automatically
(usually within 1–2 minutes).

## Prosopography — `doctors.json`

Each entry is an object inside the top-level `doctors` array. The minimal
required fields are `id` (URL-safe slug, e.g. `"zabarella"`) and `name`.
All other fields are optional and may be omitted or left as empty strings /
empty arrays.

```json
{
  "id": "zabarella",
  "name": "Jacopo Zabarella",
  "latin_name": "Iacobus Zabarella",
  "birth_year": 1533,
  "death_year": 1589,
  "dates_label": "1533–1589",
  "nationality": "Italian",
  "affiliations": ["University of Padua"],
  "biography": "Plain prose. Line breaks are preserved.",
  "logical_works": ["Opera logica (1578)"],
  "medical_works": [],
  "notable_connections": ["Galileo Galilei"],
  "sources": ["Mikkeli, H. (1992). An Aristotelian Response to Renaissance Humanism."],
  "image_url": ""
}
```

The detail page URL of an entry is `/#/prosopography/<id>`.

## Bibliography — `bibliography.json`

Two arrays, `primary_sources` and `secondary_literature`. Each item:

```json
{
  "author": "Mikkeli, Heikki",
  "title": "An Aristotelian Response to Renaissance Humanism",
  "place": "Helsinki",
  "publisher": "Finnish Historical Society",
  "year": 1992,
  "notes": "Optional editorial note rendered in italics under the entry."
}
```

## Network graph

Place your interactive HTML file exported from R (visNetwork, networkD3,
etc.) or Gephi at:

```
/public/network/index.html
```

It will be displayed inside the Networks page automatically. If the file is
absent, the page shows a placeholder. Any additional assets the graph
depends on (CSS, JS, fonts) should be embedded inside the HTML file itself,
or placed alongside it in `/public/network/` and referenced with relative
paths.
