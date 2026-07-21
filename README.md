# Abbode Style Guides

Internal site for Abbode's embroidery style guides. Three sections — **Products**
(a guide per item), **Templates** (specs grouped by design family), and **Matrix**
(the product × template coverage grid, where a live cell opens a merged guide).

All content lives in one Google Sheet in the **STYLE GUIDE BACKEND** shared drive.
Edit the Sheet, and the site updates within about a minute. No content is authored
in code.

## Stack

- Next.js 14 (App Router) · React 18 · TypeScript · Tailwind
- Real Abbode fonts (New York / Berlin), served locally
- `next-auth` gates the whole site to `@shopabbode.com` accounts
- A Google **service account** reads the Sheet and streams product images from the
  Assets folder

## The two Google credentials

The app needs two separate things from Google Cloud (project: `abbode-style-guides`).

### 1. Service account — reads the Sheet + Assets

1. In the GCP project, enable the **Google Sheets API** and **Google Drive API**.
2. Create a **service account**, then create a **JSON key** for it.
3. Add the service account's email (`…@….iam.gserviceaccount.com`) as a **member
   of the STYLE GUIDE BACKEND shared drive**. Viewer is enough (the app only reads).
   This is what lets it read the Sheet and the Assets folder.
4. Provide the key to the app:
   - **Local:** save the JSON file as `google-credentials.json` in the project root
     (already gitignored).
   - **Production:** set `GOOGLE_SERVICE_ACCOUNT_EMAIL` and
     `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`.

### 2. OAuth client — who can sign in

1. Configure the **OAuth consent screen** (Internal, shopabbode.com).
2. Create an **OAuth 2.0 Client ID** (Web application).
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (local)
   - `https://<your-vercel-domain>/api/auth/callback/google` (production)
4. Set `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET`.

Also set `AUTH_SECRET` (generate with `openssl rand -base64 32`).

## Local development

```bash
cp .env.local.example .env.local     # then fill it in
npm install
npm run dev                          # http://localhost:3000
```

For local dev you can skip the two `GOOGLE_SERVICE_ACCOUNT_*` vars if you've placed
`google-credentials.json` in the root.

## Deploy (Vercel)

1. Push this repo to GitHub (`abbode-style-guides`).
2. Import it in Vercel.
3. Add every variable from `.env.local.example` in Vercel's project settings.
   Paste the service-account private key as-is; the app converts `\n` to real
   newlines.
4. Add the production redirect URI (step 2.3 above) to the OAuth client.
5. Deploy. The site is private: `middleware.ts` forces sign-in, and only
   `@shopabbode.com` accounts are allowed. (Optionally add an `Access` tab with an
   `email` column to allow specific external addresses.)

## Editing content

Everything is the Sheet (`Abbode Style Guides Data`, in STYLE GUIDE BACKEND).

- **Add an item:** new row in **Products**.
- **Add a design family / spec:** rows in **Templates** and **Specs**.
- **Offer a template on an item / set its character limit:** a row in **Matrix**.
  Set `live = yes` to light the cell up and open its merged guide.
- **Shared rules:** the **Rules** tab. Rule text can contain `{braces}` (e.g.
  `{max_text_width}`, `{overflow_floor}`, `{text_size}`); they fill from the row
  being rendered.
- **Product images:** drop a file in the **Assets** folder named to match a
  product's `image` column (e.g. `canvas-tote.png`).

Changes appear within `SHEET_REVALIDATE_SECONDS` (default 60), no redeploy needed.

## Project map

```
app/
  page.tsx                         landing (3 buttons)
  login/                           Google sign-in
  products/                        list + [product] guide
  templates/                       families + [spec] sheet
  matrix/                          grid + [product]/[template] merged cell
  api/asset/[name]/                streams an image from the Assets folder
  api/auth/[...nextauth]/          NextAuth handlers
lib/
  sheets.ts                        reads each tab (cached), + sign-in allowlist
  data.ts                          joins tabs into page data
  rules.ts                         fills {braces}
  google.ts                        service-account Sheets + Drive clients
  config.ts / types.ts / assets.ts
components/                        Guide UI, brand SVGs, image component
```

## Not yet built

- Per-page and whole-guide PDF export, and print
- Search
