(function (D) {
  'use strict';
  var dialog = document.getElementById('confirmation');
  var details = document.getElementById('confirmation-details');
  var error = document.getElementById('dialog-error');
  var saveButton = document.getElementById('save-registration');
  var pending = null;
  var busy = false;
  function close() { dialog.close(); pending = null; busy = false; saveButton.disabled = false; }
  D.closeConfirmation = function () { if (dialog.open) close(); };
  D.confirmRegistration = function (eventId, values) {
    var id = window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : 'demo-' + Date.now() + '-' + Math.random().toString(36).slice(2);
    pending = Object.assign({ id: id, eventId: eventId, createdAt: new Date().toISOString() }, values);
    error.textContent = '';
    details.innerHTML = D.details(values);
    busy = false;
    saveButton.disabled = false;
    dialog.showModal();
    document.getElementById('cancel-confirmation').focus();
  };
  // Register each listener once; page rendering never binds dialog listeners again.
  document.getElementById('cancel-confirmation').addEventListener('click', close);
  dialog.addEventListener('cancel', function (event) { event.preventDefault(); close(); });
  saveButton.addEventListener('click', function () {
    if (!pending || busy) return;
    busy = true;
    saveButton.disabled = true;
    try {
      if (!D.store) throw new Error('当前浏览器暂时无法保存报名，请允许本地存储后重试。');
      var record = D.store.save(pending);
      close();
      window.location.hash = '#success/' + encodeURIComponent(record.id);
    } catch (problem) {
      error.textContent = '暂时没有保存成功。' + (problem.message || '请稍后重新尝试。');
      busy = false;
      saveButton.disabled = false;
    }
  });
})(window.WeekendDemo = window.WeekendDemo || {});
