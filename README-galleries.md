# Galleries & scorecards

Photo gallery (`/gallery`), scorecard archive (`/scores`), and admin (`/admin`) backed by Cloudflare R2 + JSON manifests. No database.

## Routes

| Path | Purpose | Public? |
|---|---|---|
| `/gallery` | Masonry grid of photos with lightbox | ✅ |
| `/scores` | Scorecards grouped by season with lightbox | ✅ |
| `/admin` | Password-gated upload + manage UI | 🔒 (unlinked from nav) |
| `/api/r2/get-upload-url` | `POST` — admin-only, returns pre-signed PUT URL | 🔒 |
| `/api/r2/manifest?gallery=photos\|scores` | `GET` public · `POST/PATCH/DELETE` admin | mixed |

`/` gains two teasers (`#gallery-teaser`, `#scores-teaser`) showing the 6 most recent of each, linking to the full pages.

## Storage

Cloudflare R2 bucket `easton-bowls-media` (EU jurisdiction), served publicly at `https://media.eastonbowlsclub.com`.

```
photos/
  manifest.json
  YYYY/MM/DD/<timestamp>_<sanitised-filename>.jpg
scores/
  manifest.json
  YYYY/MM/DD/<timestamp>_<sanitised-filename>.jpg
```

Each manifest is an array of entries:

```json
[
  {
    "key": "photos/2026/06/15/1718456789_open-day.jpg",
    "url": "https://media.eastonbowlsclub.com/photos/2026/06/15/...",
    "caption": "Open Day 2026",
    "uploadedAt": "2026-06-15T14:30:00Z"
  }
]
```

Score entries additionally carry `date`, `opponent`, `homeAway` (`home`/`away`), `result` (e.g. `W 98–72`). The `W`/`L`/`D` prefix drives the colour chip in the UI.

Newest-first ordering: the API prepends new entries on `POST`.

## Environment variables

All set in Vercel (production, preview, development):

```
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET=easton-bowls-media
R2_ENDPOINT=https://7ed3b7848ffa70612b9f01c82719d6c7.eu.r2.cloudflarestorage.com
R2_PUBLIC_BASE=https://media.eastonbowlsclub.com
ADMIN_UPLOAD_PASSWORD
```

⚠ The `.eu.` in `R2_ENDPOINT` is **required** because the bucket is in EU jurisdiction. Without it R2 returns a bare `AccessDenied` with no useful error.

For local dev, mirror these into `.env.local`. R2 CORS already allows `localhost:3000`.

## Upload flow (browser → R2 direct)

1. Admin picks file(s) at `/admin`.
2. Client compresses with `browser-image-compression` (≤ 1600 px long edge, ~200 KB target, forced JPEG).
3. Client `POST`s `{ filename, contentType, gallery, ... }` to `/api/r2/get-upload-url` with `X-Admin-Password` header.
4. Server verifies password with `crypto.timingSafeEqual`, signs a PUT URL (15-min expiry) with the **exact same `contentType`** the client sent, returns `{ uploadUrl, publicUrl, key }`.
5. Client `PUT`s the compressed blob to `uploadUrl` with the same `Content-Type`. (Mismatch ⇒ `SignatureDoesNotMatch`.)
6. Client `POST`s the full entry to `/api/r2/manifest?gallery=...`. Server prepends, writes manifest back.
7. UI updates optimistically.

Bytes do not pass through Vercel.

## Admin auth

Single-password, deliberately minimal:

- `ADMIN_UPLOAD_PASSWORD` env var.
- `/admin` prompts on mount, stores password in `sessionStorage` (cleared when the tab closes).
- Every write call sends `X-Admin-Password`.
- Server compares with `timingSafeEqual` (constant-time).
- Public reads need no auth.

**Rotate**: change `ADMIN_UPLOAD_PASSWORD` in Vercel → redeploy. Open tabs will fall back to the prompt the next time they POST.

## Nav behaviour

`src/components/Nav.js` is rendered once in `app/layout.js` and is pathname-aware:

- On `/`: anchor links (`Home`, `About`, …, `Contact`) scroll within the page. Scroll-spy underlines the active section. Background is transparent over the hero, cream-blur after 60 px.
- On any other route (`/gallery`, `/scores`, `/admin`): anchor links push to `/#section`. The homepage then reads `window.location.hash` on mount and scrolls with the same 80 px offset. Background is cream-blur from first paint (no transparent-over-nothing flash).
- `Admin` does **not** appear in nav.

## Inner page headers

`/gallery` and `/scores` use a small sage→cream banner (`InnerHeader.js`) with a `SectionTitle`-style stack — no dark mini-hero. Matches the homepage teaser language so click-through feels continuous.

## Adding placeholder content

Pages render fine with empty manifests (the API auto-treats a missing key as an empty array, and the UI shows a polite empty state). The simplest way to populate:

1. Visit `/admin` in dev (`npm run dev`), enter `ADMIN_UPLOAD_PASSWORD`, upload one image to each tab.
2. Or seed a `manifest.json` manually via the R2 dashboard with the shape above and a `url` pointing at any object already in the bucket.

## Gotchas (so I don't get bitten twice)

1. **`Content-Type` must match exactly** between sign-time and `PUT`. The route always signs with whatever the client sent; the client always `PUT`s the same value. Don't hardcode `image/jpeg` anywhere downstream.
2. **`.eu.` in the endpoint is mandatory.** Already in `R2_ENDPOINT`; don't reconstruct from account ID.
3. **CORS is on the bucket already.** Configured for `eastonbowlsclub.com`, `www.eastonbowlsclub.com`, `*.vercel.app`, `localhost:3000`. Methods GET/PUT/HEAD, allowed header `Content-Type`. Don't try to set CORS from code.
4. **Filename sanitisation**: lowercase, `[a-z0-9._-]` only, max 60 chars, timestamp prefix. Done in `lib/r2.js#buildKey`.
5. **Manifest concurrency**: not handled. Single admin, a few writes per week — fine. If this ever matters, switch the write path to use `If-Match` on the manifest's ETag.
6. **`media.eastonbowlsclub.com` must be in `next.config.mjs#images.remotePatterns`** for `next/image` to optimise it. Already added.

## File map

```
src/lib/r2.js                              S3 client, sign helpers, manifest read/write, verifyAdmin
src/app/api/r2/get-upload-url/route.js     POST → pre-signed PUT URL
src/app/api/r2/manifest/route.js           GET (public) · POST/PATCH/DELETE (admin)

src/app/gallery/page.js                    Server component; reads manifest, renders <GalleryGrid>
src/app/scores/page.js                     Server component; reads manifest, renders <ScoreList>
src/app/admin/page.js                      Client; <AdminAuth> + tabbed upload/manage UI

src/components/Nav.js                      Rewritten — pathname-aware, scroll-spy on / only
src/components/InnerHeader.js              Sage→cream banner for inner pages
src/components/Lightbox.js                 No-library fixed-overlay modal, keyboard nav
src/components/GalleryGrid.js              CSS-columns masonry, opens Lightbox on click
src/components/ScoreList.js                Grouped by season, opens Lightbox on click
src/components/ScoreCard.js                Single row (used by ScoreList + ScoresTeaser)
src/components/AdminAuth.js                Password prompt + sessionStorage + sign-out chip
src/components/UploadForm.js               Compress → sign → PUT → manifest POST
src/components/GalleryTeaser.js            Homepage strip: 6 latest photos
src/components/ScoresTeaser.js             Homepage strip: 6 latest scorecards

src/app/layout.js                          Lifts <Nav /> and <Footer /> to global
src/app/page.js                            Now a server component; includes both teasers
next.config.mjs                            Adds images.remotePatterns for media.eastonbowlsclub.com
```

## Out of scope (v1)

- Cloudflare Images variants / per-size optimisation (we lean on `next/image` + the compressed source).
- Multi-admin auth, user accounts, password reset.
- Comments, likes, social sharing.
- EXIF stripping (`browser-image-compression` re-encodes to JPEG which drops most metadata, but not guaranteed — worth doing properly later for privacy).
- ETag-based optimistic concurrency on manifest writes.
