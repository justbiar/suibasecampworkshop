import { getActivity } from '../../lib/activity.js';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
};
const WALLET_RE = /^0x[0-9a-f]{64}$/i;

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const wallet = url.searchParams.get('wallet');
  if (!wallet || !WALLET_RE.test(wallet)) {
    return Response.json({ error: 'Invalid wallet address.' }, { status: 400, headers });
  }
  try {
    const data = await getActivity(wallet);
    return Response.json(data, { headers: { ...headers, 'Cache-Control': 'public, max-age=20, s-maxage=30' } });
  } catch {
    return Response.json({ error: 'Sui testnet is temporarily unavailable. Please try again.' }, {
      status: 503, headers: { ...headers, 'Cache-Control': 'no-store' },
    });
  }
}
