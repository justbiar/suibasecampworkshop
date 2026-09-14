(function () {
  'use strict';
  const grid = document.getElementById('agents');
  const status = document.getElementById('status');
  const search = document.getElementById('search');
  const refresh = document.getElementById('refresh');
  const more = document.getElementById('load-more');
  const count = document.getElementById('agent-count');
  let agents = [], cursor = null, busy = false, lastChecked = null, failed = false;
  function element(tag, className, text) {
    const node = document.createElement(tag); node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function link(text, href, className) {
    const node = element('a', className, text); node.href = href;
    node.target = '_blank'; node.rel = 'noopener noreferrer'; return node;
  }
  function field(label, value) {
    const row = element('div', 'agent-field'); row.append(element('dt', '', label), element('dd', '', value || 'Not specified')); return row;
  }
  function card(agent) {
    const node = element('article', 'agent-card');
    const top = element('div', 'agent-top');
    top.append(element('div', 'agent-avatar', agent.name.slice(0, 2).toUpperCase()), element('span', 'chain-badge', 'ON-CHAIN PROFILE'));
    node.append(top, element('h3', '', agent.name));
    const summary = element('p', 'agent-summary', `Version ${agent.version || 'unspecified'} · Sui testnet`); node.append(summary);
    const details = element('dl', 'agent-details');
    details.append(field('WALLET', agent.wallet), field('MEMORY NAMESPACE', agent.namespace), field('ENDPOINT', agent.endpoint)); node.append(details);
    node.append(element('p', 'small-label', 'REGISTERED CAPABILITIES'));
    const skills = element('ul', 'skill-list');
    agent.skills.forEach(skill => skills.append(element('li', '', skill)));
    if (!agent.skills.length) skills.append(element('li', '', 'No skills declared'));
    node.append(skills);
    const footer = element('div', 'agent-card-footer');
    // Build links only from validated addresses; never navigate to a declared endpoint.
    footer.append(link('View profile ↗', `https://testnet.suivision.xyz/object/${agent.id}`, ''), link('Wallet ↗', `https://testnet.suivision.xyz/account/${agent.wallet}`, ''));
    node.append(footer); return node;
  }
  function render() {
    const q = search.value.trim().toLowerCase();
    const shown = agents.filter(a => [a.name, a.wallet, ...a.skills].some(x => x.toLowerCase().includes(q)));
    grid.replaceChildren(...shown.map(card));
    count.textContent = agents.length ? `${agents.length}${cursor ? '+' : ''}` : '';
    if (!failed) status.textContent = !agents.length ? 'No profiles registered yet. Be the first to join.' :
      !shown.length ? 'No matching agents in the loaded profiles.' :
      `${shown.length} profile${shown.length === 1 ? '' : 's'} shown · Checked ${new Date(lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    more.hidden = !cursor;
  }
  async function load(reset) {
    if (busy) return;
    busy = true; refresh.disabled = true; more.disabled = true; grid.setAttribute('aria-busy', 'true');
    status.textContent = 'Reading on-chain profiles…'; failed = false;
    try {
      const response = await fetch('/api/agents' + (!reset && cursor ? '?after=' + encodeURIComponent(cursor) : ''), { signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error('Unavailable');
      const data = await response.json();
      if (!Array.isArray(data.agents) || !data.pageInfo || !data.checkedAt) throw new Error('Invalid data');
      const valid = data.agents.filter(a => /^0x[0-9a-f]{64}$/i.test(a.id) && /^0x[0-9a-f]{64}$/i.test(a.wallet));
      agents = [...new Map([...(reset ? [] : agents), ...valid].map(a => [a.id, a])).values()];
      cursor = data.pageInfo.hasNextPage ? data.pageInfo.endCursor : null; lastChecked = data.checkedAt;
      render();
      if (data.omitted) status.textContent += ` · ${data.omitted} unsupported profile(s) omitted`;
    } catch {
      failed = true;
      status.textContent = agents.length ? 'Refresh failed. Showing previously loaded profiles; try again.' : 'Could not reach Sui testnet. Please try Refresh.';
    } finally {
      busy = false; refresh.disabled = false; more.disabled = false; grid.setAttribute('aria-busy', 'false');
    }
  }
  search.addEventListener('input', render);
  refresh.addEventListener('click', () => load(true)); more.addEventListener('click', () => load(false));
  load(true);
})();
