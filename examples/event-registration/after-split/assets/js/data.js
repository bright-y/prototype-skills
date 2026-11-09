(function (D) {
  'use strict';
  D.events = [
    { id: 'prototype-workshop', title: '把想法做成原型', category: '动手工作坊', month: '11 月', day: '21', weekday: '周六', time: '14:00–16:30', location: '青禾共享空间 · 二楼', note: '带上你的电脑和一个想法，一起把它变成能点击的小原型。没有设计或编程经验也可以参加。', capacity: '小班交流 · 免费参与' },
    { id: 'city-walk', title: '在街角，发现新的灵感', category: '城市漫步', month: '11 月', day: '28', weekday: '周六', time: '09:30–11:30', location: '青禾书店门口集合', note: '用两小时走一条熟悉又陌生的路线，聊聊日常生活里的设计。', capacity: '轻松步行 · 免费参与' }
  ];
  D.findEvent = function (id) { return D.events.find(function (event) { return event.id === id; }); };
})(window.WeekendDemo = window.WeekendDemo || {});
