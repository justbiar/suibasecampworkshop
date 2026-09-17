import { GRAPHQL_URL } from './agents.js';

const WALLET_RE = /^0x[0-9a-f]{64}$/i;
const text = (value, max) => typeof value === 'string' && value.length > 0 && value.length <= max;

export const ACTIVITY_QUERY = `query WorkshopAgentActivity($wallet: SuiAddress!) {
  transactions(last: 5, filter: { affectedAddress: $wallet }) {
    nodes { digest effects { status timestamp } }
  }
}`;

function parseTransaction(node) {
  const digest = node?.digest;
  const status = node?.effects?.status;
  const timestamp = node?.effects?.timestamp;
  if (!text(digest, 128) || (status !== 'SUCCESS' && status !== 'FAILURE')) return null;
  if (typeof timestamp !== 'string' || Number.isNaN(Date.parse(timestamp))) return null;
  return { digest, status, timestamp, url: `https://testnet.suivision.xyz/txblock/${digest}` };
}

export async function getActivity(wallet, fetcher = fetch) {
  if (!WALLET_RE.test(wallet)) throw new Error('Invalid wallet');
  const response = await fetcher(GRAPHQL_URL, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: ACTIVITY_QUERY, variables: { wallet } }),
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error('Chain query unavailable');
  const payload = await response.json();
  const nodes = payload.data?.transactions?.nodes;
  if (payload.errors?.length || !Array.isArray(nodes)) throw new Error('Invalid chain response');
  // The chain returns the last 5 oldest-first; reverse so the newest transaction leads the feed.
  const transactions = nodes.map(parseTransaction).filter(Boolean).reverse().slice(0, 5);
  return { wallet, network: 'testnet', checkedAt: new Date().toISOString(), transactions };
}
