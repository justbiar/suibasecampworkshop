import { getAgents } from '../../lib/agents.js';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
};
export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const after = url.searchParams.get('after');
  if (after !== null && (!after.length || after.length > 2048)) {
    return Response.json({ error: 'Invalid pagination cursor.' }, { status: 400, headers });
  }
  try {
    const data = await getAgents(after);
    return Response.json(data, { headers: { ...headers, 'Cache-Control': 'public, max-age=30, s-maxage=60' } });
  } catch {
    return Response.json({ error: 'Sui testnet is temporarily unavailable. Please try again.' }, {
      status: 503, headers: { ...headers, 'Cache-Control': 'no-store' },
    });
  }
}
