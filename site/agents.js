(function () {
  'use strict';
  const grid = document.getElementById('agents');
  const status = document.getElementById('status');
  const search = document.getElementById('search');
  const refresh = document.getElementById('refresh');
  const more = document.getElementById('load-more');
  const count = document.getElementById('agent-count');
  let agents = [], cursor = null, busy = false, lastChecked = null, failed = false;
  // wallet -> { transactions, leadDigest }. Kept across re-renders so a pixel agent
  // only "reacts" when a genuinely new transaction shows up, not on every keystroke.
  const activityCache = new Map();
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
  // Small deterministic hash so the same agent always gets the same hue — a stable,
  // distinct-looking pixel character per profile rather than a random one on every render.
  function hue(seed) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return h % 360;
  }
  const PX = ['..####..', '.######.', '########', '##.##.##', '########', '########', '.######.', '..####..'];
  const EYES = [[3, 2], [3, 5]];
  function pixelAvatar(agent) {
    const wrap = element('div', 'agent-pixel');
    wrap.style.setProperty('--hue', [20, 340, 155, 42][hue(agent.id) % 4]);
    wrap.style.setProperty('--blink-delay', `-${(hue(agent.wallet) % 40) / 10}s`);
    wrap.style.setProperty('--blink-duration', `${3.4 + (hue(agent.id + agent.wallet) % 30) / 10}s`);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 8 8');
    svg.classList.add('pixel-bot');
    PX.forEach((row, y) => [...row].forEach((cell, x) => {
      if (cell !== '#') return;
      const rect = document.createElementNS(svg.namespaceURI, 'rect');
      rect.setAttribute('x', x); rect.setAttribute('y', y); rect.setAttribute('width', 1); rect.setAttribute('height', 1);
      rect.setAttribute('class', 'bot-body'); svg.append(rect);
    }));
    EYES.forEach(([y, x]) => {
      const eye = document.createElementNS(svg.namespaceURI, 'rect');
      eye.setAttribute('x', x); eye.setAttribute('y', y); eye.setAttribute('width', 1); eye.setAttribute('height', 1);
      eye.setAttribute('class', 'bot-eye'); svg.append(eye);
    });
    wrap.append(svg);
    return wrap;
  }
  // Brief bounce + eye-flash so the agent visibly "reacts"; the class removes itself.
  function react(pixelEl, kind) {
    if (!pixelEl) return;
    pixelEl.classList.remove('is-checking', 'is-excited');
    void pixelEl.offsetWidth; // restart the animation if it is still playing
    pixelEl.classList.add(kind);
    setTimeout(() => pixelEl.classList.remove(kind), 900);
  }
  function relativeTime(iso) {
    const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    const steps = [[60, 's'], [60, 'm'], [24, 'h'], [365, 'd']];
    let value = seconds, unit = 's';
    for (const [size, label] of steps) { if (value < size) { unit = label; break; } value /= size; unit = label; }
    return `${Math.max(1, Math.round(value))}${unit} ago`;
  }
  function renderActivity(listEl, transactions) {
    listEl.replaceChildren();
    if (!transactions.length) { listEl.append(element('li', 'activity-empty', 'No on-chain activity yet.')); return; }
    // The API already caps this at 5, but a hard slice keeps the panel readable either way.
    transactions.slice(0, 5).forEach(tx => {
      const row = element('li', `activity-row activity-${tx.status.toLowerCase()}`);
      row.append(element('span', 'activity-dot'));
      const a = link(tx.digest.slice(0, 8) + '…', tx.url, 'activity-digest');
      row.append(a, element('span', 'activity-time', relativeTime(tx.timestamp)));
      listEl.append(row);
    });
  }
  async function loadActivity(agent, pixelEl, listEl) {
    listEl.replaceChildren(element('li', 'activity-empty', 'Reading recent transactions…'));
    try {
      const response = await fetch(`/api/activity?wallet=${encodeURIComponent(agent.wallet)}`, { signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error('unavailable');
      const data = await response.json();
      if (!Array.isArray(data.transactions)) throw new Error('invalid');
      const previous = activityCache.get(agent.wallet);
      const leadDigest = data.transactions[0]?.digest || null;
      const isNew = previous && leadDigest && previous.leadDigest !== leadDigest;
      activityCache.set(agent.wallet, { transactions: data.transactions, leadDigest });
      renderActivity(listEl, data.transactions);
      react(pixelEl, isNew ? 'is-excited' : 'is-checking');
    } catch {
      listEl.replaceChildren(element('li', 'activity-empty', 'Recent activity is unavailable right now.'));
    }
  }
  const activityObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      activityObserver.unobserve(entry.target);
      const { agentWallet } = entry.target.dataset;
      const agent = agents.find(a => a.wallet === agentWallet);
      if (agent) loadActivity(agent, entry.target.querySelector('.agent-pixel'), entry.target.querySelector('.activity-list'));
    });
  }, { rootMargin: '120px' }) : null;
  function card(agent, recheck) {
    const node = element('article', 'agent-card');
    const top = element('div', 'agent-top');
    const pixel = pixelAvatar(agent);
    top.append(pixel, element('span', 'chain-badge', 'ON-CHAIN PROFILE'));
    node.append(top, element('h3', '', agent.name));
    const summary = element('p', 'agent-summary', `Version ${agent.version || 'unspecified'} · Sui testnet`); node.append(summary);
    const details = element('dl', 'agent-details');
    details.append(field('WALLET', agent.wallet), field('MEMORY NAMESPACE', agent.namespace), field('ENDPOINT', agent.endpoint)); node.append(details);
    node.append(element('p', 'small-label', 'REGISTERED CAPABILITIES'));
    const skills = element('ul', 'skill-list');
    agent.skills.forEach(skill => skills.append(element('li', '', skill)));
    if (!agent.skills.length) skills.append(element('li', '', 'No skills declared'));
    node.append(skills);
    node.append(element('p', 'small-label', 'RECENT ACTIVITY'));
    const activityList = element('ul', 'activity-list');
    activityList.append(element('li', 'activity-empty', 'Reading recent transactions…'));
    node.append(activityList);
    const footer = element('div', 'agent-card-footer');
    // Build links only from validated addresses; never navigate to a declared endpoint.
    footer.append(link('View profile ↗', `https://testnet.suivision.xyz/object/${agent.id}`, ''), link('Wallet ↗', `https://testnet.suivision.xyz/account/${agent.wallet}`, ''));
    node.append(footer);
    node.dataset.agentWallet = agent.wallet;
    const cached = activityCache.get(agent.wallet);
    if (cached && !recheck) renderActivity(activityList, cached.transactions);
    else if (cached && recheck) loadActivity(agent, pixel, activityList);
    else if (activityObserver) activityObserver.observe(node);
    else loadActivity(agent, pixel, activityList);
    return node;
  }
  function render(recheck) {
    const q = search.value.trim().toLowerCase();
    const shown = agents.filter(a => [a.name, a.wallet, ...a.skills].some(x => x.toLowerCase().includes(q)));
    grid.replaceChildren(...shown.map(agent => card(agent, recheck)));
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
      render(reset);
      if (data.omitted) status.textContent += ` · ${data.omitted} unsupported profile(s) omitted`;
    } catch {
      failed = true;
      status.textContent = agents.length ? 'Refresh failed. Showing previously loaded profiles; try again.' : 'Could not reach Sui testnet. Please try Refresh.';
    } finally {
      busy = false; refresh.disabled = false; more.disabled = false; grid.setAttribute('aria-busy', 'false');
    }
  }
  search.addEventListener('input', () => render(false));
  refresh.addEventListener('click', () => load(true)); more.addEventListener('click', () => load(false));
  load(true);
})();
