// GET /api/guest?g=<token> -> { name }
// Tokens are random and unguessable; there is deliberately no way to list guests.
const TOKEN = /^[A-Za-z0-9_-]{22}$/;

export async function onRequestGet({ request, env }) {
  const token = new URL(request.url).searchParams.get("g");
  const miss = () => new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
  if (!token || !TOKEN.test(token)) return miss();

  const row = await env.DB.prepare("SELECT name FROM guests WHERE token = ?").bind(token).first();
  if (!row) return miss();

  return Response.json(
    { name: row.name },
    { headers: { "Cache-Control": "private, max-age=86400" } }
  );
}
