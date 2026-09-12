# iconfor.ai

Free library of AI tool icons. Search, copy as URL / img tag / React component.
113 tools, 124 statically generated pages, zero running cost.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # generates every static page
```

## Deploy free

1. Push this folder to a GitHub repo
2. Go to vercel.com, import the repo, hit Deploy
3. Live in ~60 seconds on a free .vercel.app subdomain

## Adding a tool

Open `lib/tools.js` and add one row to `raw`:

```js
["Tool name", "domain.com", "category", "One line on what it does."],
```

Its detail page, category listing, search entry, related-icons strip and
sitemap row all appear on the next build. Categories live in `CATEGORIES`
in the same file.

## Before going live

- Change `SITE` in `lib/tools.js` to your real domain
- Update `public/robots.txt` with the same domain
- Submit `/sitemap.xml` in Google Search Console

## How the icons work

Icons are fetched live from Google's favicon endpoint, so nothing is
stored or served by this site. No API key, no storage cost, and no
redistribution of brand files.

Next upgrade: hand-curated SVGs for the top 50 tools, stored in
`public/svg/{slug}.svg`, with the live fetch as the fallback.

## Icon generator (/create)

Describe a shape, pick a style and colour, get real SVG back. It asks a
text model to write SVG markup directly, which is the right tool for
logos — a diffusion model would hand you pixels that don't scale.

Set three env vars (copy `.env.example` to `.env.local`, and add the same
ones in Vercel's project settings):

```
GEN_BASE_URL=https://api.deepseek.com/v1
GEN_API_KEY=your-key
GEN_MODEL=deepseek-chat
```

Any OpenAI-compatible provider works — DeepSeek, Groq, OpenRouter,
Together. Without a key the page still loads and the button explains
what's missing, so the rest of the site is unaffected.

Model output is never trusted: `sanitizeSvg` in `lib/generator.js`
strips scripts, event handlers, external references and anything that
isn't plain geometry before it reaches the page. Requests are capped at
6 per minute per IP and 200 characters per prompt.

## Routes

| Route | What it is |
|---|---|
| `/` | Search and the full contact sheet |
| `/icons/[slug]` | One page per tool — the SEO engine |
| `/categories` | Category index |
| `/categories/[cat]` | Every tool in a category |
| `/create` | Icon generator |
| `/api/generate` | SVG generation endpoint |
| `/sitemap.xml` | Auto-generated from `lib/tools.js` |
