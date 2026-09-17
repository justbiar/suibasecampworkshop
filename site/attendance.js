/* A QR arrival joins once per browser cookie; all viewers read the shared count. */
(function () {
  'use strict';
  var event = 'basecamp-2026';
  var joining = new URLSearchParams(location.search).get('join') === event;
  var busy = false;
  var lastTotal = null;
  var retry = document.getElementById('attendance-retry');
  function status(key) {
    ['loading', 'live', 'joined', 'error'].forEach(function (name) {
      document.getElementById('attendance-' + name).hidden = name !== key;
    });
    retry.hidden = key !== 'error';
  }
  async function refresh() {
    if (busy || document.hidden) return;
    busy = true;
    try {
      var options = joining ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: event }) } : {};
      var response = await fetch('/api/attendance', { ...options, cache: 'no-store', signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error('Attendance unavailable');
      var data = await response.json();
      if (!Number.isSafeInteger(data.total) || data.total < 0 || (joining && data.joined !== true)) throw new Error('Invalid count');
      if (joining) {
        joining = false;
        var url = new URL(location.href);
        url.searchParams.delete('join');
        history.replaceState(null, '', url.pathname + url.search + url.hash);
      }
      lastTotal = data.total;
      window.dispatchEvent(new CustomEvent('attendance:change', { detail: { total: lastTotal, available: true } }));
      status(data.joined ? 'joined' : 'live');
    } catch (e) {
      window.dispatchEvent(new CustomEvent('attendance:change', { detail: { total: lastTotal, available: false } }));
      status('error');
    } finally { busy = false; }
  }
  retry.addEventListener('click', refresh);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) refresh(); });
  setInterval(refresh, 5000);
  refresh();
})();
