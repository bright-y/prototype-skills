(function (D) {
  'use strict';
  var e = D.escape;
  function date(event) { return event.month + ' ' + event.day + ' 日（' + event.weekday + '）' + event.time; }
  D.renderEvents = function (records) {
    var featured = D.events[0];
    var next = D.events[1];
    return '<section class="intro"><p class="eyebrow">一起做点有意思的事</p><h1>周末，留一点时间<br>给好奇心。</h1><p>从一个小想法出发，遇见愿意一起尝试的人。</p></section>' +
      '<section aria-label="即将开始的活动"><article class="featured"><div class="event-copy"><p class="event-type">' + e(featured.category) + '</p><h2>' + e(featured.title) + '</h2><p>' + e(featured.note) + '</p><ul class="facts"><li>' + e(featured.time) + '</li><li>' + e(featured.location) + '</li><li>' + e(featured.capacity) + '</li></ul><a class="button" href="#register/' + featured.id + '">报名参加 <span aria-hidden="true">↗</span></a></div><div class="date-panel"><span>' + e(featured.month) + '</span><strong>' + e(featured.day) + '</strong><span>' + e(featured.weekday) + '</span><p>把一个下午，留给新想法</p></div></article>' +
      '<article class="next-event"><div><h3>' + e(next.title) + '</h3><p>' + e(date(next)) + ' · ' + e(next.category) + '</p></div><a class="button secondary" href="#register/' + next.id + '">查看报名</a></article></section>' +
      '<section class="bookings" id="bookings" tabindex="-1"><h2>我的报名</h2>' + (records.length ? '<ul class="booking-list">' + records.map(function (record) {
        var event = D.findEvent(record.eventId);
        return '<li class="booking-item"><div><strong>' + e(event ? event.title : '历史活动') + '</strong><span>' + e(record.name || '参与者') + ' · 已报名</span></div><a href="#success/' + encodeURIComponent(record.id) + '">查看报名</a></li>';
      }).join('') + '</ul>' : '<p class="empty-note">还没有报名记录。选一场感兴趣的活动，周末见。</p>') + '</section>';
  };
  D.renderRegistration = function (event, values, errors) {
    return '<a class="breadcrumb" href="#events">← 返回活动列表</a><div class="form-layout"><section><p class="eyebrow">预留一个位置</p><h1>为这个周末，留个位置。</h1><p class="lede">填写简单的信息，报名这场活动。</p><form id="registration-form" novalidate>' + D.renderFields(values, errors) +
      '<p class="hint">这是演示报名，请使用虚构信息；不会发送到服务器。</p><div class="button-row"><button class="button" type="submit">核对报名信息</button><a class="button secondary" href="#events">暂不报名</a></div></form></section><aside class="summary" aria-label="活动信息"><p class="summary-date">' + e(event.month + ' ' + event.day + ' 日 · ' + event.weekday) + '</p><h2>' + e(event.title) + '</h2><p>' + e(event.note) + '</p><hr><p>' + e(event.time) + '<br>' + e(event.location) + '<br>' + e(event.capacity) + '</p></aside></div>';
  };
  D.renderSuccess = function (record) {
    var event = D.findEvent(record.eventId);
    return '<section class="success"><div class="success-symbol" aria-hidden="true">✓</div><p class="eyebrow">位置已经留好</p><h1>报名成功，周末见。</h1><p class="lede">这条演示记录已保存在当前浏览器，刷新后仍可查看。</p><div class="success-card"><h2>' + e(event ? event.title : '历史活动') + '</h2><p class="hint">' + e(event ? date(event) : '活动信息暂不可用') + '</p>' + D.details(record) + '</div><div class="button-row"><a class="button" href="#events">继续看看活动</a><a class="button secondary" href="#bookings">我的报名</a></div></section>';
  };
  D.renderMissing = function () { return '<section class="success"><h1>暂时找不到这条记录。</h1><p class="lede">可能是在其他浏览器或其他演示版本中报名的。可以先返回活动列表查看。</p><a class="button" href="#events">返回活动列表</a></section>'; };
})(window.WeekendDemo = window.WeekendDemo || {});
