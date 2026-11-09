(function (D) {
  'use strict';
  D.storageKey = 'prototype-skills:event-registration:v1';
  D.createStore = function (storage) {
    function read() {
      var raw;
      try { raw = storage.getItem(D.storageKey); } catch (error) { throw new Error('当前浏览器暂时无法读取报名记录，请允许本地存储后重试。'); }
      if (raw === null) return [];
      var records;
      try { records = JSON.parse(raw); } catch (error) { throw new Error('报名记录暂时无法读取，请保留已有数据并稍后重试。'); }
      if (!Array.isArray(records) || records.some(function (row) { return !row || typeof row !== 'object' || typeof row.id !== 'string' || typeof row.eventId !== 'string'; })) {
        throw new Error('报名记录格式暂不兼容，请保留已有数据并稍后重试。');
      }
      return records;
    }
    return {
      all: read,
      find: function (id) { return read().find(function (record) { return record.id === id; }); },
      save: function (input) {
        var records = read();
        var existing = records.find(function (record) { return record.id === input.id; });
        if (existing) return existing;
        var record = { id: input.id, eventId: input.eventId, name: input.name, email: input.email, createdAt: input.createdAt };
        if (typeof input.phone === 'string') record.phone = input.phone;
        // Keep old records intact; adding a registration never rewrites their fields.
        try { storage.setItem(D.storageKey, JSON.stringify(records.concat([record]))); } catch (error) { throw new Error('当前浏览器暂时无法保存报名，请检查本地存储空间后重试。'); }
        return record;
      }
    };
  };
  try { D.store = D.createStore(window.localStorage); } catch (error) { D.store = null; }
})(window.WeekendDemo = window.WeekendDemo || {});
