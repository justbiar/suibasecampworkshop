const EVENT = 'basecamp-2026';
const COOKIE = 'sbc-participant';
const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function total(db) {
  const row = await db.prepare('SELECT COUNT(*) AS total FROM attendance WHERE event_id = ?').bind(EVENT).first();
  return Number(row.total);
}
export async function onRequestGet({ env }) {
  try {
    return Response.json({ total: await total(env.ATTENDANCE) }, { headers });
  } catch {
    return Response.json({ error: 'Attendance is temporarily unavailable.' }, { status: 503, headers });
  }
}
export async function onRequestPost({ request, env }) {
  const url = new URL(request.url);
  if (request.headers.get('Origin') !== url.origin) {
    return Response.json({ error: 'Same-origin request required.' }, { status: 403, headers });
  }
  let body;
  try { body = await request.json(); } catch { body = null; }
  if (body?.event !== EVENT) {
    return Response.json({ error: 'Invalid workshop.' }, { status: 400, headers });
  }
  const cookie = (request.headers.get('Cookie') || '').split(';').map(v => v.trim()).find(v => v.startsWith(COOKIE + '='));
  const existing = cookie?.slice(COOKIE.length + 1);
  const visitor = uuid.test(existing || '') ? existing : crypto.randomUUID();
  try {
    await env.ATTENDANCE.prepare('INSERT OR IGNORE INTO attendance (event_id, visitor_id) VALUES (?, ?)').bind(EVENT, visitor).run();
    return Response.json({ total: await total(env.ATTENDANCE), joined: true }, {
      headers: { ...headers, 'Set-Cookie': `${COOKIE}=${visitor}; Path=/; HttpOnly; SameSite=Lax; Max-Age=15552000${url.protocol === 'https:' ? '; Secure' : ''}` },
    });
  } catch {
    return Response.json({ error: 'Could not register attendance. Please retry.' }, { status: 503, headers });
  }
}
