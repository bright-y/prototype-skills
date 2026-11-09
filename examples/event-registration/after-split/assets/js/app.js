(function (D) {
  'use strict';
  var main = document.getElementById('main');
  var count = document.getElementById('booking-count');
  var activeEvent = null;
  var drafts = {};
  function valuesFrom(form) {
    var values = {};
    D.fields.forEach(function (field) { values[field.name] = String(new FormData(form).get(field.name) || '').trim(); });
    return values;
  }
  function render() {
    D.closeConfirmation();
    var parts = window.location.hash.slice(1).split('/');
    var route = parts[0] || 'events';
    activeEvent = null;
    var records = [];
    var warning = '';
    try {
      if (!D.store) throw new Error('当前浏览器暂时无法使用本地存储。仍可浏览活动，报名时请换用支持本地存储的浏览器。');
      records = D.store.all();
    } catch (problem) { warning = problem.message || '报名记录暂时无法读取。'; }
    count.textContent = String(records.length);
    if (route === 'register') {
      activeEvent = D.findEvent(parts[1]);
      main.innerHTML = activeEvent ? D.renderRegistration(activeEvent, drafts[activeEvent.id] || {}, {}) : D.renderMissing();
    } else if (route === 'success') {
      var record = records.find(function (row) { return row.id === parts[1]; });
      main.innerHTML = record ? D.renderSuccess(record) : D.renderMissing();
    } else {
      main.innerHTML = D.renderEvents(records);
    }
    if (warning) main.insertAdjacentHTML('afterbegin', '<p class="notice" role="alert">' + D.escape(warning) + '</p>');
    document.title = (route === 'register' ? '填写报名信息' : route === 'success' ? '报名记录' : '周末小聚') + ' · 活动报名';
    if (route === 'bookings') {
      var bookings = document.getElementById('bookings');
      if (bookings) { bookings.scrollIntoView(); bookings.focus(); }
    } else { window.scrollTo(0, 0); main.focus({ preventScroll: true }); }
  }
  main.addEventListener('input', function (event) {
    if (activeEvent && event.target.closest('#registration-form')) drafts[activeEvent.id] = valuesFrom(event.target.form);
  });
  main.addEventListener('submit', function (event) {
    if (event.target.id !== 'registration-form' || !activeEvent) return;
    event.preventDefault();
    var values = valuesFrom(event.target);
    var errors = D.validate(values);
    drafts[activeEvent.id] = values;
    if (Object.keys(errors).length) {
      main.innerHTML = D.renderRegistration(activeEvent, values, errors);
      document.getElementById('field-' + Object.keys(errors)[0]).focus();
      return;
    }
    D.fields.forEach(function (field) {
      var input = document.getElementById('field-' + field.name);
      var error = document.getElementById('error-' + field.name);
      input.setAttribute('aria-invalid', 'false');
      input.setAttribute('aria-describedby', 'hint-' + field.name);
      if (error) error.remove();
    });
    D.confirmRegistration(activeEvent.id, values);
  });
  window.addEventListener('hashchange', render);
  window.addEventListener('storage', function (event) { if (event.key === D.storageKey) render(); });
  render();
})(window.WeekendDemo = window.WeekendDemo || {});
