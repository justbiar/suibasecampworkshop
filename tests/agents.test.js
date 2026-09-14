import test from 'node:test';
import assert from 'node:assert/strict';
import { getAgents, parseProfile, PROFILE_TYPE } from '../lib/agents.js';
const id = '0x' + 'a'.repeat(64), wallet = '0x' + 'b'.repeat(64);
const node = { address: id, asMoveObject: { contents: { type: { repr: PROFILE_TYPE }, json: { owner: id, wallet, suins_name: 'agent.sui', memory_namespace: 'agent', endpoint: 'local://agent', version: '2.0.0', skills: ['recall'] } } } };
const reply = page => async () => ({ ok: true, json: async () => page });
const payload = (nodes, pageInfo = { hasNextPage: false, endCursor: null }) => ({ data: { objects: { nodes, pageInfo } } });
test('reads real fields without certifying identity or creating endpoint links', () => {
  const profile = parseProfile(node); assert.equal(profile.name, 'agent.sui'); assert.equal(profile.wallet, wallet); assert.equal(profile.endpoint, 'local://agent'); assert.equal(profile.verified, undefined);
});
test('foreign types, malformed fields and oversized metadata are omitted', () => {
  const wrong = structuredClone(node); wrong.asMoveObject.contents.type.repr = 'other'; assert.equal(parseProfile(wrong), null);
  const invalid = structuredClone(node); invalid.asMoveObject.contents.json.wallet = 'javascript:alert(1)'; assert.equal(parseProfile(invalid), null);
  const oversized = structuredClone(node); oversized.asMoveObject.contents.json.skills = Array(101).fill('x'); assert.equal(parseProfile(oversized), null);
});
test('pagination passes the cursor and preserves a supported empty result', async () => {
  let body;
  const result = await getAgents('cursor1', async (_, options) => { body = JSON.parse(options.body); return reply(payload([node], { hasNextPage: true, endCursor: 'cursor2' }))(); });
  assert.equal(body.variables.after, 'cursor1'); assert.equal(result.pageInfo.endCursor, 'cursor2'); assert.equal(result.agents.length, 1);
  assert.deepEqual((await getAgents(null, reply(payload([])))).agents, []);
});
test('transport and GraphQL errors cannot become a successful empty directory', async () => {
  await assert.rejects(getAgents(null, async () => ({ ok: false })));
  await assert.rejects(getAgents(null, reply({ errors: [{ message: 'offline' }], ...payload([]) })));
  await assert.rejects(getAgents(null, reply({ data: {} })));
});
test('invalid or stuck cursors fail closed', async () => {
  await assert.rejects(getAgents('x'.repeat(2049), reply(payload([]))));
  await assert.rejects(getAgents('same', reply(payload([], { hasNextPage: true, endCursor: 'same' }))));
});
test('untrusted metadata stays plain data and explorer URLs are built from addresses', async () => {
  const hostile = structuredClone(node); hostile.asMoveObject.contents.json.suins_name = '<img src=x onerror=alert(1)>';
  const result = await getAgents(null, reply(payload([hostile]))); assert.equal(result.agents[0].name, '<img src=x onerror=alert(1)>'); assert.equal(result.agents[0].profileUrl, `https://testnet.suivision.xyz/object/${id}`);
});
