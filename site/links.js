/* The QR lands here, so this page is what registers the arrival in the room count.
   It only joins; the live total is shown on the deck's own slide. */
(function () {
  'use strict';
  var EVENT = 'basecamp-2026';
  var note = document.getElementById('lkNote');
  if (new URLSearchParams(location.search).get('join') !== EVENT) return;

  fetch('/api/attendance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: EVENT }),
    cache: 'no-store',
    signal: AbortSignal.timeout(10000)
  })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('unavailable')); })
    .then(function (data) {
      if (data.joined !== true) return;
      note.textContent = "You're counted. Welcome to the workshop.";
      note.setAttribute('data-joined', '');
      // Drop the parameter so a reload or a shared link does not read as a second arrival.
      var url = new URL(location.href);
      url.searchParams.delete('join');
      history.replaceState(null, '', url.pathname + url.search + url.hash);
    })
    .catch(function () { /* the count is not worth an error in the visitor's face */ });
})();
