// GET  /api/reply?g=<token>  -> the guest's saved reply, or 404 if none yet
// POST /api/reply            -> (errors are codes the page translates) save (or replace) the reply: { g, name, attending, guests, message }
// A reply is only accepted for a token that exists in `guests`; one reply per guest.
const TOKEN = /^[A-Za-z0-9_-]{22}$/;
const NO_STORE = { "Cache-Control": "no-store" };

const json = (body, status = 200) => Response.json(body, { status, headers: NO_STORE });
const empty = (status) => new Response(null, { status, headers: NO_STORE });

export async function onRequestGet({ request, env }) {
  const token = new URL(request.url).searchParams.get("g");
  if (!token || !TOKEN.test(token)) return empty(404);

  const row = await env.DB.prepare("SELECT name, attending, guests, message FROM replies WHERE token = ?")
    .bind(token)
    .first();
  if (!row) return empty(404);
  return json({ name: row.name, attending: row.attending === 1, guests: row.guests, message: row.message });
}

export async function onRequestPost({ request, env }) {
  if (!(request.headers.get("Content-Type") || "").startsWith("application/json")) return empty(415);
  let body;
  try {
    body = await request.json();
  } catch {
    return empty(400);
  }

  const token = body && body.g;
  if (typeof token !== "string" || !TOKEN.test(token)) return empty(404);

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const attending = body.attending;
  if (!name || name.length > 100) return json({ error: "name_required" }, 400);
  if (typeof attending !== "boolean") return json({ error: "attending_required" }, 400);
  if (message.length > 1000) return json({ error: "message_too_long" }, 400);

  let guests = 0;
  if (attending) {
    guests = Number(body.guests);
    if (!Number.isInteger(guests) || guests < 1 || guests > 10) {
      return json({ error: "guests_invalid" }, 400);
    }
  }

  const guest = await env.DB.prepare("SELECT 1 FROM guests WHERE token = ?").bind(token).first();
  if (!guest) return empty(404);

  await env.DB.prepare(
    `INSERT INTO replies (token, name, attending, guests, message) VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(token) DO UPDATE SET
       name = excluded.name, attending = excluded.attending, guests = excluded.guests,
       message = excluded.message, updated_at = datetime('now')`
  )
    .bind(token, name, attending ? 1 : 0, guests, message)
    .run();

  return json({ ok: true });
}
