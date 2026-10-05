# Midland Madness Roleplay — Website & Store

The website for the Midland Madness FiveM server (home, rules, how to join) plus a custom webstore at `/store`, built with Next.js 15, Tailwind CSS v4 and the **Tebex Headless API**.
Tebex handles all payments. This site shows the catalog, manages the basket and sends players to Tebex checkout.

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in TEBEX_PUBLIC_TOKEN
npm run dev                  # http://localhost:3000
```

| Variable | What it is |
|---|---|
| `TEBEX_PUBLIC_TOKEN` | Tebex Creator Panel → Integrations → Headless API → public token. Leave empty to run the built-in demo catalog. |
| `NEXT_PUBLIC_SITE_URL` | The public URL of the site. Tebex sends players back here after login and checkout. |
| `NEXT_PUBLIC_DISCORD_URL` | Discord invite. Its live member/online counts show on the home page. Use a **never-expiring** invite. |
| `NEXT_PUBLIC_CONNECT_URL` | Your `cfx.re/join/...` link. When set, the site shows a "Play now" button that opens FiveM and the live player count. |

In the Tebex panel, add your site's domain to the Headless API allowed origins / return URLs if your account requires it.

## How the purchase flow works

1. A player clicks **Add to basket**. `/api/basket` creates a Tebex basket and keeps its id in an httpOnly cookie.
2. FiveM stores need a Cfx.re login. If the basket has no user yet, the player goes to Tebex's Cfx.re login and comes back to the same page. The package is then added automatically.
3. **Secure checkout** sends the player to the basket's Tebex checkout link. After paying, they land on `/checkout/complete`.

## Artwork & copy

Prices, names and descriptions always come from Tebex. `src/lib/catalog.ts` matches packages **by name** to the poster art in
`public/packages/` and adds a tagline and perk bullets. If you rename a package in Tebex, update the `match` regex there.
Packages that don't match fall back to the image uploaded in Tebex.

Packages in a category where every package is a subscription use the wide "membership" layout. Every other category uses the card grid.
The most expensive one-off package is shown as the featured pack on the store page.

## Project layout

```
src/app/page.tsx              Server home: hero, live stats, features, store teaser, how to join, Discord
src/app/rules/page.tsx        City rules (edit the RULES array at the top)
src/app/store/page.tsx        Store: featured pack, categories, how-it-works, FAQ
src/app/store/[id]/page.tsx   Package detail page
src/app/api/basket/route.ts   Basket proxy (create, login, add/remove, quantity, coupons)
src/app/checkout/complete     Post-payment thank-you page
src/app/terms                 Terms & refund policy
src/lib/site.ts               Discord / connect links
src/lib/community.ts          Live Discord + FiveM server stats
src/lib/tebex.ts              Tebex Headless API client
src/lib/catalog.ts            Artwork mapping + demo catalog
src/components/               Header, basket drawer, cards, etc.
```

## SEO

Built in: per-page titles/descriptions, canonical URLs, Open Graph + Twitter share cards (`src/app/opengraph-image.jpg`),
`/sitemap.xml` (includes every package), `/robots.txt`, a web manifest, and JSON-LD structured data
(Organization + WebSite on home, Product + Breadcrumb on package pages, ItemList + FAQ on the store).
Keywords and the main description live in `src/lib/site.ts`.

**`NEXT_PUBLIC_SITE_URL` must be your real domain in production.** Canonical links, the sitemap and share images are built from it.

After launch: add the site to Google Search Console and submit `https://yourdomain/sitemap.xml`, and link the site from
your Discord, your FiveM server listing and socials so Google finds it.

## Deploy

Deploys anywhere that runs Next.js (Vercel, Netlify, a Node VPS with `npm run build && npm start`). Set the same env vars there.
