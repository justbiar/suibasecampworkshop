// The shared workshop package is an allowlist, not a claim of verified identity.
export const PACKAGE_ID = '0x73795ef21ec3554a141ddcf8d8b6696245762c8a071eeec4bbda2b0818f694c7';
export const PROFILE_TYPE = `${PACKAGE_ID}::agent_profile::AgentProfileV2`;
export const GRAPHQL_URL = 'https://graphql.testnet.sui.io/graphql';
export const QUERY = `query WorkshopAgents($after: String) {
  objects(first: 24, after: $after, filter: {type: "${PROFILE_TYPE}"}) {
    nodes { address asMoveObject { contents { json type { repr } } } }
    pageInfo { hasNextPage endCursor }
  }
}`;
const address = value => typeof value === 'string' && /^0x[0-9a-f]{64}$/i.test(value);
const text = (value, max) => typeof value === 'string' && value.length <= max;

export function parseProfile(node) {
  const content = node?.asMoveObject?.contents;
  const fields = content?.json;
  if (content?.type?.repr !== PROFILE_TYPE || !address(node.address) || !fields ||
      !address(fields.owner) || !address(fields.wallet) ||
      !text(fields.suins_name, 256) || !text(fields.memory_namespace, 256) ||
      !text(fields.endpoint, 2048) || !text(fields.version, 128) ||
      !Array.isArray(fields.skills) || fields.skills.length > 100 ||
      !fields.skills.every(skill => text(skill, 128))) return null;
  return {
    id: node.address, name: fields.suins_name || 'Unnamed agent',
    wallet: fields.wallet, registrant: fields.owner, namespace: fields.memory_namespace,
    endpoint: fields.endpoint, version: fields.version, skills: fields.skills,
    network: 'testnet', profileUrl: `https://testnet.suivision.xyz/object/${node.address}`,
    walletUrl: `https://testnet.suivision.xyz/account/${fields.wallet}`,
  };
}

export async function getAgents(after = null, fetcher = fetch) {
  if (after !== null && (!text(after, 2048) || !after.length)) throw new Error('Invalid cursor');
  const response = await fetcher(GRAPHQL_URL, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY, variables: { after } }),
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error('Chain query unavailable');
  const payload = await response.json();
  const page = payload.data?.objects;
  if (payload.errors?.length || !Array.isArray(page?.nodes) || typeof page?.pageInfo?.hasNextPage !== 'boolean') {
    throw new Error('Invalid chain response');
  }
  const { hasNextPage, endCursor } = page.pageInfo;
  if (hasNextPage && (!text(endCursor, 2048) || !endCursor || endCursor === after)) throw new Error('Invalid pagination');
  const agents = page.nodes.map(parseProfile).filter(Boolean);
  return { agents, network: 'testnet', packageId: PACKAGE_ID, profileType: PROFILE_TYPE,
    checkedAt: new Date().toISOString(), pageInfo: { hasNextPage, endCursor: hasNextPage ? endCursor : null },
    omitted: page.nodes.length - agents.length };
}
