# wedding

Wedding invitation: a photo-booth save-the-date page and a personalised invitation, hosted on Cloudflare Pages with a D1 database.

- `src/` – static site (Vietnamese by default, English toggle; the choice is kept in `localStorage`)
- `functions/api/` – Pages Functions: `guest` (name for a guest token) and `reply` (read/save a guest's reply)
- `migrations/` – D1 schema
- `scripts/add-guests.mjs` – add guests and generate their personal links

## Setup

1. `npx wrangler login`
2. `npx wrangler d1 create wedding`, then put the returned id in `wrangler.toml` (`database_id`). Don't commit the real id.
3. `npx wrangler d1 migrations apply DB --remote` (use `--local` for development)
4. Create `guests.txt` with one guest name per line, then:
   `node scripts/add-guests.mjs guests.txt --base-url https://<your-domain> --remote`
   This writes `links.csv` (name and personal link). `guests.txt`, `guests.sql` and `links.csv` are gitignored: they hold the guests' names and tokens.
5. `npx wrangler pages project create <name> --production-branch main`, then `npx wrangler pages deploy src --project-name <name>`

Local development: `npx wrangler pages dev src`.
