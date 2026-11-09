(function (D) {
  'use strict';
  D.escape = function (value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  };
  D.fields = [
    { name: 'name', label: '怎么称呼你', type: 'text', autocomplete: 'name', placeholder: '填写姓名或昵称', maxLength: 40, hint: '方便活动当天互相认识。', validate: function (value) { return value.trim() ? '' : '请填写姓名或昵称。'; } },
    { name: 'email', label: '联系邮箱', type: 'email', autocomplete: 'email', placeholder: '例如 demo@example.com', maxLength: 120, hint: '本演示不会发送邮件。', validate: function (value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : '请填写完整的邮箱地址，例如 demo@example.com。'; } },
    { name: 'phone', label: '联系手机号', type: 'tel', autocomplete: 'tel', placeholder: '填写 11 位大陆手机号', maxLength: 11, hint: '本案例仅演示中国大陆手机号格式，不会拨打或发送短信。', validate: function (value) { return /^1[3-9]\d{9}$/.test(value.trim()) ? '' : '请填写 11 位中国大陆手机号。'; } }
  ];
  D.validate = function (values) {
    var errors = {};
    D.fields.forEach(function (field) {
      var value = String(values[field.name] || '');
      var error = value.length > field.maxLength ? '内容有点长，请缩短后重试。' : field.validate(value);
      if (error) errors[field.name] = error;
    });
    return errors;
  };
  D.renderFields = function (values, errors) {
    return D.fields.map(function (field) {
      var error = errors[field.name];
      return '<div class="field"><label for="field-' + field.name + '">' + D.escape(field.label) + '<span>必填</span></label>' +
        '<input id="field-' + field.name + '" name="' + field.name + '" type="' + field.type + '" autocomplete="' + field.autocomplete + '" placeholder="' + D.escape(field.placeholder) + '" maxlength="' + field.maxLength + '" required aria-invalid="' + Boolean(error) + '" aria-describedby="hint-' + field.name + (error ? ' error-' + field.name : '') + '" value="' + D.escape(values[field.name] || '') + '">' +
        '<p class="hint" id="hint-' + field.name + '">' + D.escape(field.hint) + '</p>' +
        (error ? '<p class="error" id="error-' + field.name + '" role="alert">' + D.escape(error) + '</p>' : '') + '</div>';
    }).join('');
  };
  D.details = function (values) {
    return '<dl class="details">' + D.fields.map(function (field) {
      return '<div><dt>' + D.escape(field.label) + '</dt><dd>' + D.escape(values[field.name] || '未填写（旧记录）') + '</dd></div>';
    }).join('') + '</dl>';
  };
})(window.WeekendDemo = window.WeekendDemo || {});
