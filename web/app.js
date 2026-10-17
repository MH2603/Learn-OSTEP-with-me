'use strict';

const STATE_KEY = 'ostep.progress.v1';
const DAY_MS = 86400000;

let ROADMAP = null;
let state = null;
let noteTimer = null;

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const esc = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[ch]));

const inline = (value) => esc(value).replace(/`([^`]+)`/g, '<code>$1</code>');

const pad2 = (n) => String(n).padStart(2, '0');

const formatNumber = (value) => (Number.isInteger(value) ? String(value) : value.toFixed(1));

function todayISO() {
  const now = new Date();
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
}

function setText(selector, text) {
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
}

function setWidth(selector, pct) {
  const el = document.querySelector(selector);
  if (el) el.style.width = `${pct}%`;
}

let toastTimer = null;
function toast(message) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

/* ------------------------------------------------------------------ */
/* state                                                               */
/* ------------------------------------------------------------------ */

function defaultState() {
  return { version: 1, startDate: todayISO(), done: {}, notes: {} };
}

function normalizeState(raw) {
  const next = defaultState();
  if (!raw || typeof raw !== 'object') return next;
  if (typeof raw.startDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.startDate)) {
    next.startDate = raw.startDate;
  }
  if (raw.done && typeof raw.done === 'object') {
    for (const [id, value] of Object.entries(raw.done)) {
      if (value) next.done[id] = true;
    }
  }
  if (raw.notes && typeof raw.notes === 'object') {
    for (const [weekId, text] of Object.entries(raw.notes)) {
      if (typeof text === 'string' && text.trim()) next.notes[weekId] = text;
    }
  }
  return next;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    return raw ? normalizeState(JSON.parse(raw)) : defaultState();
  } catch (err) {
    console.warn('Không đọc được tiến độ đã lưu, dùng tiến độ mới.', err);
    return defaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error(err);
    toast('Không lưu được vào localStorage');
  }
}

/* ------------------------------------------------------------------ */
/* progress                                                            */
/* ------------------------------------------------------------------ */

function weekTasks(week) {
  return [
    ...week.concepts.map((item) => ({ ...item, kind: 'concept' })),
    ...week.exercises.map((item) => ({ ...item, kind: 'exercise' })),
    ...(week.requirements || []).map((item) => ({ ...item, kind: 'requirement' })),
    ...week.criteria.map((item) => ({ ...item, kind: 'criteria' })),
  ];
}

function weekProgress(week) {
  const critDone = week.criteria.filter((item) => state.done[item.id]).length;
  const tasks = weekTasks(week);
  const doneCount = tasks.filter((item) => state.done[item.id]).length;
  const total = week.criteria.length || tasks.length;
  const done = week.criteria.length ? critDone : doneCount;
  return {
    critDone,
    critTotal: week.criteria.length,
    tasksDone: doneCount,
    tasksTotal: tasks.length,
    pct: total ? Math.round((done / total) * 100) : 0,
  };
}

function overallProgress() {
  let done = 0;
  let total = 0;
  for (const week of ROADMAP.weeks) {
    done += week.criteria.filter((item) => state.done[item.id]).length;
    total += week.criteria.length;
  }
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

function weeksDone() {
  return ROADMAP.weeks.filter((week) => weekProgress(week).pct === 100).length;
}

function currentWeekNumber() {
  const start = new Date(`${state.startDate}T00:00:00`);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const days = Math.floor((now - start) / DAY_MS);
  if (!Number.isFinite(days) || days < 0) return 1;
  return Math.min(ROADMAP.meta.weekCount, Math.floor(days / 7) + 1);
}

function finalChecklistProgress() {
  const items = (ROADMAP.finalChecklist || []).flatMap((group) => group.items);
  return {
    done: items.filter((item) => state.done[item.id]).length,
    total: items.length,
  };
}

function weekDays(week) {
  return (week.plan && week.plan.days) || [];
}

function minuteLabel(day) {
  const raw = String(day.minutesLabel || day.minutes || '');
  const parts = raw.split('+').map((part) => part.trim()).filter(Boolean);
  return parts.map((part) => `${part}'`).join(' + ');
}

function dayProgress(week) {
  const days = weekDays(week);
  const done = days.filter((day) => state.done[day.id]).length;
  return { done, total: days.length, pct: days.length ? Math.round((done / days.length) * 100) : 0 };
}

function weekHours(week) {
  const days = weekDays(week);
  const minutes = (filterDone) =>
    days.filter((day) => (filterDone ? state.done[day.id] : true)).reduce((sum, day) => sum + (day.minutes || 0), 0);
  return { done: minutes(true) / 60, total: minutes(false) / 60 };
}

function planTotals() {
  let done = 0;
  let total = 0;
  let minutesDone = 0;
  let minutesTotal = 0;
  for (const week of ROADMAP.weeks) {
    for (const day of weekDays(week)) {
      total += 1;
      minutesTotal += day.minutes || 0;
      if (state.done[day.id]) {
        done += 1;
        minutesDone += day.minutes || 0;
      }
    }
  }
  return {
    done,
    total,
    minutesDone,
    minutesTotal,
    hoursDone: minutesDone / 60,
    hoursTotal: minutesTotal / 60,
  };
}

// getDay(): 0 = Chủ nhật … 6 = Thứ 7
const WEEKDAY_NAMES = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

function todayDayName() {
  return WEEKDAY_NAMES[new Date().getDay()];
}

function todayPlan() {
  const week = ROADMAP.weeks.find((item) => item.number === currentWeekNumber());
  if (!week) return null;
  const day = weekDays(week).find((item) => item.day === todayDayName());
  return day ? { week, day } : null;
}

function remainingDays(week) {
  return weekDays(week).filter((day) => !state.done[day.id]);
}

/* ------------------------------------------------------------------ */
/* rendering                                                           */
/* ------------------------------------------------------------------ */

function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, '');
  if (hash.startsWith('week/')) {
    return { view: 'week', id: hash.slice('week/'.length) };
  }
  return { view: 'dashboard' };
}

function renderTopbar() {
  const container = document.getElementById('topProgress');
  if (!container) return;
  const overall = overallProgress();
  container.innerHTML = `
    <div class="mini-bar"><span style="width:${overall.pct}%"></span></div>
    <span class="mini-label">${overall.done}/${overall.total} tiêu chí · ${overall.pct}%</span>`;
}

function statusBadge(week) {
  const progress = weekProgress(week);
  if (progress.pct === 100) return '<span class="badge is-done">Đã xong</span>';
  if (week.number === currentWeekNumber()) return '<span class="badge is-current">Tuần này</span>';
  if (progress.tasksDone > 0) return '<span class="badge is-progress">Đang học</span>';
  return '<span class="badge">Chưa học</span>';
}

function renderTodayCard() {
  const today = todayPlan();
  if (!today) {
    return `<section class="today-card">
      <p class="eyebrow">Hôm nay</p>
      <p class="today-task muted">Tuần này chưa có kế hoạch theo ngày. Mở tuần để xem checklist.</p>
    </section>`;
  }
  const { week, day } = today;
  const done = !!state.done[day.id];
  return `<section class="today-card ${done ? 'is-done' : ''}">
    <div class="today-head">
      <span class="today-day">Hôm nay · ${esc(day.day)} · Tuần ${pad2(week.number)}</span>
      <span class="today-min">${minuteLabel(day)}</span>
    </div>
    <p class="today-task">${inline(day.task)}</p>
    ${day.doneWhen ? `<p class="today-done-when">Xong khi: ${inline(day.doneWhen)}</p>` : ''}
    <div class="today-foot">
      <label class="check ${done ? 'is-done' : ''}">
        <input type="checkbox" data-task-id="${esc(day.id)}" ${done ? 'checked' : ''}>
        <span>Đánh dấu đã xong hôm nay</span>
      </label>
      <a class="btn" href="#/week/${week.id}">Mở tuần ${pad2(week.number)} →</a>
    </div>
  </section>`;
}

function renderDashboard() {
  const meta = ROADMAP.meta;
  const current = currentWeekNumber();
  const currentWeek = ROADMAP.weeks.find((week) => week.number === current) ?? ROADMAP.weeks[0];
  const overall = overallProgress();
  const finalProgress = finalChecklistProgress();
  const plan = planTotals();
  const weekPlan = dayProgress(currentWeek);
  const left = remainingDays(currentWeek);
  const subline = [meta.rhythmShort || meta.rhythm, `${meta.totalHours} giờ cả khóa`]
    .filter(Boolean)
    .join(' · ');

  const weekCards = ROADMAP.weeks
    .map((week) => {
      const progress = weekProgress(week);
      const days = dayProgress(week);
      const status = statusBadge(week);
      return `
        <a class="week-card ${progress.pct === 100 ? 'is-done' : ''}" href="#/week/${week.id}">
          <div class="week-card-head">
            <span class="week-num">TUẦN ${pad2(week.number)}</span>
            ${status}
          </div>
          <h3>${esc(week.title)}</h3>
          <div class="bar"><span style="width:${progress.pct}%"></span></div>
          <p class="muted small">${days.done}/${days.total} ngày · ${progress.critDone}/${progress.critTotal} tiêu chí</p>
        </a>`;
    })
    .join('');

  const leftHtml = left.length
    ? `<ul class="day-list compact">${left
        .map(
          (day) => `
        <li>
          <a class="day-row ${day.day === todayDayName() ? 'is-today' : ''}" href="#/week/${currentWeek.id}">
            <span class="day-name">${esc(day.day)}</span>
            <span class="day-body">
              <span class="day-task">${inline(day.task)}</span>
            </span>
            <span class="task-week">${minuteLabel(day)}</span>
          </a>
        </li>`
        )
        .join('')}</ul>`
    : '<p class="empty">Đã xong cả 7 ngày của tuần này. Sang tuần sau, hoặc dùng thời gian dư để viết glossary/báo cáo.</p>';

  const finalHtml = (ROADMAP.finalChecklist || [])
    .map(
      (group) => `
      <div class="final-group">
        <h3>${esc(group.title)}</h3>
        ${group.items
          .map(
            (item) => `
          <label class="check ${state.done[item.id] ? 'is-done' : ''}">
            <input type="checkbox" data-task-id="${esc(item.id)}" ${state.done[item.id] ? 'checked' : ''}>
            <span>${esc(item.text)}</span>
          </label>`
          )
          .join('')}
      </div>`
    )
    .join('');

  document.getElementById('app').innerHTML = `
    <section class="hero">
      <div>
        <p class="eyebrow">Tuần hiện tại</p>
        <h1>Tuần ${pad2(current)} · ${esc(currentWeek.title)}</h1>
        <p class="hero-sub">${esc(meta.hoursPerWeek)} giờ/tuần · ${esc(subline)}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#/week/${currentWeek.id}">Vào tuần ${pad2(current)}</a>
          <a class="btn" href="${esc(meta.ostepIndex)}" target="_blank" rel="noopener">OSTEP online ↗</a>
        </div>
      </div>
      <div class="ring" id="ring" style="--pct:${overall.pct}">
        <span>${overall.pct}%<small>tiêu chí</small></span>
      </div>
    </section>

    ${renderTodayCard()}

    <div class="stats">
      <div class="stat">
        <div class="stat-label">Tiêu chí hoàn thành</div>
        <div class="stat-value" id="statCriteria">${overall.done}/${overall.total}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Tuần đã xong</div>
        <div class="stat-value" id="statWeeks">${weeksDone()}/${meta.weekCount}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Ngày đã xong</div>
        <div class="stat-value" id="statDays">${plan.done}/${plan.total}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Giờ theo kế hoạch</div>
        <div class="stat-value"><span id="statHours">${plan.hoursDone.toFixed(1)}h</span> <small id="statHoursTotal">/ ${Math.round(plan.hoursTotal)}h</small></div>
      </div>
      <div class="stat">
        <div class="stat-label">Ngày bắt đầu</div>
        <input type="date" id="startDate" value="${esc(state.startDate)}">
      </div>
    </div>

    <div class="section-head">
      <h2>12 tuần</h2>
      <span class="muted small">Thanh tiến độ = tiêu chí hoàn thành</span>
    </div>
    <div class="week-grid">${weekCards}</div>

    <div class="section-head">
      <h2>Còn lại trong tuần ${pad2(current)}</h2>
      <span class="muted small">${weekPlan.done}/${weekPlan.total} ngày · ${formatNumber(weekHours(currentWeek).done)}h/${formatNumber(weekHours(currentWeek).total)}h</span>
    </div>
    ${leftHtml}

    <div class="section-head">
      <h2>Đánh giá sau 12 tuần</h2>
      <span class="muted small" id="finalSummaryCount">${finalProgress.done}/${finalProgress.total}</span>
    </div>
    <details class="final">
      <summary>Checklist tổng kết</summary>
      ${finalHtml}
    </details>`;
}

function checklistCard(title, items) {
  if (!items.length) return '';
  return `
    <section class="card">
      <h2>${esc(title)}</h2>
      ${items
        .map(
          (item) => `
        <label class="check ${state.done[item.id] ? 'is-done' : ''}">
          <input type="checkbox" data-task-id="${esc(item.id)}" ${state.done[item.id] ? 'checked' : ''}>
          <span>${esc(item.text)}</span>
        </label>`
        )
        .join('')}
    </section>`;
}

function dayList(week) {
  const days = weekDays(week);
  if (!days.length) return '';
  const isCurrentWeek = week.number === currentWeekNumber();
  const today = todayDayName();
  return `<ul class="day-list">${days
    .map((day) => {
      const done = !!state.done[day.id];
      const todayClass = isCurrentWeek && day.day === today ? ' is-today' : '';
      return `
      <li>
        <label class="check day-row ${done ? 'is-done' : ''}${todayClass}">
          <input type="checkbox" data-task-id="${esc(day.id)}" ${done ? 'checked' : ''}>
          <span class="day-body">
            <span class="day-line">
              <span class="day-name">${esc(day.day)}</span>
              <span class="day-min">${minuteLabel(day)}</span>
              <span class="day-task">${inline(day.task)}</span>
            </span>
            ${day.doneWhen ? `<span class="day-done-when">Xong khi: ${inline(day.doneWhen)}</span>` : ''}
          </span>
        </label>
      </li>`;
    })
    .join('')}</ul>`;
}

function renderWeek(week) {
  const meta = ROADMAP.meta;
  const progress = weekProgress(week);
  const days = dayProgress(week);
  const plan = week.plan || {};
  const index = ROADMAP.weeks.indexOf(week);
  const prev = ROADMAP.weeks[index - 1];
  const next = ROADMAP.weeks[index + 1];

  const planCard = dayList(week)
    ? `<section class="card">
        <h2>Kế hoạch 7 ngày</h2>
        ${plan.deliverable ? `<p class="deliverable"><span class="tag">DELIVERABLE</span> ${inline(plan.deliverable)}</p>` : ''}
        ${dayList(week)}
        ${(plan.notes || [])
          .map(
            (note) => `<div class="callout is-warn">
              <span class="callout-title">Ghi chú kế hoạch</span>${inline(note)}
            </div>`
          )
          .join('')}
      </section>`
    : '';

  const resources = week.resources.length
    ? `<section class="card">
        <h2>Chương &amp; tài liệu</h2>
        <ul class="resource-list">
          ${week.resources
            .map((resource) =>
              resource.kind === 'chapter'
                ? `<li><a href="${esc(resource.url)}" target="_blank" rel="noopener">
                     <span class="tag">PDF</span>${esc(resource.label)}<span class="arrow">↗</span>
                   </a></li>`
                : `<li><span class="plain">${esc(resource.label)}</span></li>`
            )
            .join('')}
          <li><a href="${esc(meta.localPdfHref)}" target="_blank" rel="noopener">
            <span class="tag">LOCAL</span>Mở bản PDF offline<span class="arrow">↗</span>
          </a></li>
        </ul>
      </section>`
    : '';

  const projectCallout = week.project
    ? `<div class="callout">
         <span class="callout-title">Mini-project</span>
         <strong>${esc(week.project)}</strong>${week.goal ? ` — ${esc(week.goal)}` : ''}
       </div>`
    : '';

  const gameCallout = week.game
    ? `<div class="callout">
         <span class="callout-title">Liên hệ với game</span>${esc(week.game)}
       </div>`
    : '';

  const noteCallout = week.note
    ? `<div class="callout is-warn">
         <span class="callout-title">Lưu ý</span>${esc(week.note)}
       </div>`
    : '';

  document.getElementById('app').innerHTML = `
    <a class="back" href="#/">← Tất cả các tuần</a>
    <header class="week-head">
      <p class="eyebrow">Tuần ${pad2(week.number)} / ${meta.weekCount}</p>
      <h1>${esc(week.title)}</h1>
      <div class="week-meter">
        <div class="bar"><span id="weekDayBarFill" style="width:${days.pct}%"></span></div>
        <span class="meter-text" id="weekDayText">${days.done}/${days.total} ngày</span>
      </div>
      <div class="week-meter">
        <div class="bar"><span id="weekBarFill" style="width:${progress.pct}%"></span></div>
        <span class="meter-text" id="weekPctText">${progress.critDone}/${progress.critTotal} tiêu chí · ${progress.pct}%</span>
      </div>
    </header>

    ${projectCallout}

    <div class="cols" ${week.project ? 'style="margin-top:12px"' : ''}>
      <div class="col-main">
        ${planCard}
        ${resources}
        ${checklistCard('Kiến thức cần nắm', week.concepts)}
        ${checklistCard('Bài tập', week.exercises)}
        ${checklistCard('Yêu cầu', week.requirements || [])}
        ${checklistCard('Tiêu chí hoàn thành', week.criteria)}
      </div>
      <aside>
        <section class="card">
          <h2>Ghi chú tuần ${pad2(week.number)}</h2>
          <textarea id="weekNotes" placeholder="Tóm tắt bằng lời của mình, số liệu benchmark, câu hỏi còn mở…">
${esc(state.notes[week.id] ?? '')}</textarea>
          <p class="save-hint" id="saveHint">Lưu tự động khi bạn ngừng gõ</p>
        </section>
        ${gameCallout}
        ${noteCallout}
      </aside>
    </div>

    <nav class="week-nav">
      ${prev ? `<a href="#/week/${prev.id}"><span>Tuần trước</span>← ${esc(prev.title)}</a>` : '<span></span>'}
      ${next ? `<a href="#/week/${next.id}" style="text-align:right"><span>Tuần sau</span>${esc(next.title)} →</a>` : '<span></span>'}
    </nav>`;
}

function renderError(message) {
  document.getElementById('app').innerHTML = `
    <section class="card">
      <h2>Không tải được lộ trình</h2>
      <p class="muted">${esc(message)}</p>
      <p class="muted small">
        Website cần đọc <code>data/roadmap.json</code> qua HTTP (không dùng được <code>file://</code>).
        Chạy từ thư mục gốc repo:
      </p>
      <p><code>python3 -m http.server 8000</code> → mở <code>http://localhost:8000/web/</code></p>
      <p class="muted small">Nếu thiếu file dữ liệu: <code>python3 web/tools/gen_roadmap.py</code></p>
    </section>`;
}

function render() {
  if (!ROADMAP) return;
  renderTopbar();
  const route = currentRoute();
  if (route.view === 'week') {
    const week = ROADMAP.weeks.find((item) => item.id === route.id);
    if (!week) {
      location.hash = '#/';
      return;
    }
    renderWeek(week);
    document.title = `Tuần ${pad2(week.number)} · ${week.title}`;
  } else {
    renderDashboard();
    document.title = 'OSTEP Learning Tracker';
  }
  window.scrollTo({ top: 0 });
}

/* ------------------------------------------------------------------ */
/* progress refresh (không render lại toàn trang khi tick checkbox)     */
/* ------------------------------------------------------------------ */

function refreshProgress() {
  renderTopbar();
  const overall = overallProgress();
  setText('#statCriteria', `${overall.done}/${overall.total}`);
  setText('#statWeeks', `${weeksDone()}/${ROADMAP.meta.weekCount}`);
  const ring = document.getElementById('ring');
  if (ring) {
    ring.style.setProperty('--pct', overall.pct);
    const label = ring.querySelector('span');
    if (label) label.innerHTML = `${overall.pct}%<small>tiêu chí</small>`;
  }
  const plan = planTotals();
  setText('#statDays', `${plan.done}/${plan.total}`);
  setText('#statHours', `${plan.hoursDone.toFixed(1)}h`);
  const hoursTotal = document.getElementById('statHoursTotal');
  if (hoursTotal) hoursTotal.textContent = `/ ${Math.round(plan.hoursTotal)}h`;

  const finalProgress = finalChecklistProgress();
  setText('#finalSummaryCount', `${finalProgress.done}/${finalProgress.total}`);

  const route = currentRoute();
  if (route.view === 'week') {
    const week = ROADMAP.weeks.find((item) => item.id === route.id);
    if (week) {
      const progress = weekProgress(week);
      setText('#weekPctText', `${progress.critDone}/${progress.critTotal} tiêu chí · ${progress.pct}%`);
      setWidth('#weekBarFill', progress.pct);
      const days = dayProgress(week);
      setText('#weekDayText', `${days.done}/${days.total} ngày`);
      setWidth('#weekDayBarFill', days.pct);
    }
  }
}

/* ------------------------------------------------------------------ */
/* export / import                                                     */
/* ------------------------------------------------------------------ */

function exportState() {
  const payload = {
    app: 'ostep-tracker',
    exportedAt: new Date().toISOString(),
    roadmap: ROADMAP.meta.source,
    version: state.version,
    startDate: state.startDate,
    done: state.done,
    notes: state.notes,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ostep-progress-${todayISO()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toast('Đã tải file tiến độ');
}

async function importState(file) {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object' || !parsed.done) {
      throw new Error('File không giống file tiến độ của OSTEP Tracker.');
    }
    const confirmed = window.confirm(
      'Import sẽ thay thế toàn bộ tiến độ hiện tại trong trình duyệt. Tiếp tục?'
    );
    if (!confirmed) return;
    state = normalizeState(parsed);
    saveState();
    render();
    toast('Đã nạp tiến độ từ file');
  } catch (err) {
    console.error(err);
    toast(`Import thất bại: ${err.message}`);
  }
}

/* ------------------------------------------------------------------ */
/* events                                                              */
/* ------------------------------------------------------------------ */

function flushNote(weekId, value, hint) {
  clearTimeout(noteTimer);
  if (value.trim()) state.notes[weekId] = value;
  else delete state.notes[weekId];
  saveState();
  if (hint) {
    const now = new Date();
    hint.textContent = `Đã lưu lúc ${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
  }
}

function scheduleNoteSave(weekId, value, hint) {
  clearTimeout(noteTimer);
  if (hint) hint.textContent = 'Đang lưu…';
  noteTimer = setTimeout(() => flushNote(weekId, value, hint), 450);
}

function bindEvents() {
  document.addEventListener('change', (event) => {
    const target = event.target;

    if (target.matches('input[type="checkbox"][data-task-id]')) {
      const id = target.dataset.taskId;
      if (target.checked) state.done[id] = true;
      else delete state.done[id];
      saveState();
      const label = target.closest('.check');
      if (label) label.classList.toggle('is-done', target.checked);
      refreshProgress();
      return;
    }

    if (target.id === 'startDate') {
      state.startDate = target.value || todayISO();
      saveState();
      render();
      return;
    }

    // textarea phát 'change' khi blur -> lưu ngay, không đợi debounce
    if (target.id === 'weekNotes') {
      const route = currentRoute();
      if (route.view === 'week') {
        flushNote(route.id, target.value, document.getElementById('saveHint'));
      }
    }
  });

  document.addEventListener('input', (event) => {
    const target = event.target;
    if (target.id !== 'weekNotes') return;
    const route = currentRoute();
    if (route.view !== 'week') return;
    scheduleNoteSave(route.id, target.value, document.getElementById('saveHint'));
  });

  document.getElementById('exportBtn').addEventListener('click', exportState);

  const importInput = document.getElementById('importInput');
  document.getElementById('importBtn').addEventListener('click', () => importInput.click());
  importInput.addEventListener('change', () => {
    const file = importInput.files && importInput.files[0];
    importInput.value = '';
    if (file) importState(file);
  });

  window.addEventListener('hashchange', render);
}

/* ------------------------------------------------------------------ */
/* boot                                                                */
/* ------------------------------------------------------------------ */

async function boot() {
  try {
    const response = await fetch('data/roadmap.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status} khi đọc data/roadmap.json`);
    ROADMAP = await response.json();
  } catch (err) {
    console.error(err);
    renderError(err.message);
    return;
  }
  state = loadState();
  bindEvents();
  render();
}

boot();
