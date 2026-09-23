/* Percentages use the room's headcount; groups may overlap. */
(function () {
  'use strict';
  if (!document.getElementById('audiencePoll')) return;
  var names = ['vibe', 'high', 'low'];
  var inputs = names.map(function (name) { return document.getElementById('poll-' + name); });
  var totalInput = document.getElementById('poll-total');
  var allInputs = inputs;
  var available = false;
  var sharedTotal = 0;
  var manual = false;
  var manualKey = 'sbc-manual-total-v1';
  try {
    var storedManual = localStorage.getItem(manualKey);
    if (storedManual !== null && valid(Number(storedManual))) {
      manual = true; totalInput.value = Number(storedManual);
    }
  } catch (e) {}
  var storageKey = 'sbc-audience-percentages-v1';
  function valid(n) { return Number.isInteger(n) && n >= 0 && n <= 9999; }
  try {
    var saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && valid(saved.total) && Array.isArray(saved.counts) && saved.counts.length === 3 && saved.counts.every(valid)) {

      inputs.forEach(function (input, i) { input.value = saved.counts[i]; });
    } else {
      var old = JSON.parse(localStorage.getItem('sbc-audience-counts-v1'));
      if (Array.isArray(old) && old.length === 3 && old.every(valid)) {
        inputs.forEach(function (input, i) { input.value = old[i]; });
      }
    }
  } catch (e) { /* The poll also works without storage. */ }
  function read(input) { return input.validity.badInput ? NaN : Number(input.value); }
  function render() {
    var total = manual ? read(totalInput) : sharedTotal;
    var totalValid = manual ? valid(total) : available && Number.isSafeInteger(total) && total >= 0;
    var counts = inputs.map(read);
    var hasError = manual && !totalValid;
    if (!manual) totalInput.value = available ? total : '';
    totalInput.setAttribute('aria-invalid', String(manual && !totalValid));
    document.getElementById('poll-manual').hidden = !manual;
    document.getElementById('poll-auto').hidden = !manual; 
    names.forEach(function (name, i) {
      var ok = valid(counts[i]) && (!totalValid || total === 0 || counts[i] <= total);
      inputs[i].setAttribute('aria-invalid', String(!ok));
      hasError = hasError || !ok;
      var ready = totalValid && total > 0 && ok;
      var percent = ready ? counts[i] / total * 100 : 0;
      document.getElementById('count-' + name).textContent = ready ? Number(percent.toFixed(1)) + '%' : '·';
      document.getElementById('bar-' + name).style.width = percent + '%';
    });
    document.getElementById('poll-empty').hidden = totalValid && total > 0;
    document.getElementById('poll-error').hidden = !hasError;
    if (!hasError) {
      try { localStorage.setItem(storageKey, JSON.stringify({ total: total, counts: counts })); } catch (e) {}
    }
  }
  totalInput.addEventListener('input', function () {
    manual = true;
    var value = read(totalInput);
    try {
      if (valid(value)) localStorage.setItem(manualKey, String(value));
    } catch (e) {}
    render();
  });
  document.getElementById('poll-auto').addEventListener('click', function () {
    manual = false;
    try { localStorage.removeItem(manualKey); } catch (e) {}
    render();
  });
  allInputs.forEach(function (input) {
    input.addEventListener('input', render);
    input.addEventListener('blur', function () {
      if (input.value === '' && !input.validity.badInput) input.value = 0;
    });
  });
  document.getElementById('poll-reset').addEventListener('click', function () {
    totalInput.addEventListener('input', function () {
    manual = true;
    var value = read(totalInput);
    try {
      if (valid(value)) localStorage.setItem(manualKey, String(value));
    } catch (e) {}
    render();
  });
  document.getElementById('poll-auto').addEventListener('click', function () {
    manual = false;
    try { localStorage.removeItem(manualKey); } catch (e) {}
    render();
  });
  allInputs.forEach(function (input) { input.value = 0; });
    render();
  });
  window.addEventListener('attendance:change', function (e) {
    available = e.detail.available;
    sharedTotal = e.detail.total;
    render();
  });
  render();
})();
