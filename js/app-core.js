/* ============================================================
   app-core.js — shell, router, shared UI helpers
   All screen modules attach render functions onto App.screens
   ============================================================ */

const App = {
  screens: {},
  state: {
    todayISO: Utils.todayISO(),
  },
};

// ---------------------------------------------------------------- routing
App.routes = {
  'today': () => App.screens.today(),
  'calendar': () => App.screens.calendar(),
  'progress': () => App.screens.progress(),
  'photos': () => App.screens.photos(),
  'more': () => App.screens.more(),
  'exercises': () => App.screens.exercises(),
  'measurements': () => App.screens.measurements(),
  'settings': () => App.screens.settings(),
  'schedule': () => App.screens.schedule(),
  'dataio': () => App.screens.dataio(),
  'onboarding': () => App.screens.onboarding(),
  'workout': (p) => App.screens.workout(p),
  'kettlebell': (p) => App.screens.kettlebell(p),
  'cardio-log': (p) => App.screens['cardio-log'](p),
  'summary': (p) => App.screens.summary(p),
  'exercise-detail': (p) => App.screens.exerciseDetail(p),
};

function parseHash() {
  const raw = (window.location.hash || '#/today').replace(/^#\/?/, '');
  const [route, ...rest] = raw.split('/');
  return { route: route || 'today', params: rest };
}

App.navigate = function (route, params = []) {
  const suffix = params.length ? '/' + params.join('/') : '';
  window.location.hash = `#/${route}${suffix}`;
};

App.currentParams = [];

function renderRoute() {
  const { route, params } = parseHash();
  App.currentParams = params;
  App.closeSheet();
  const fn = App.routes[route] || App.routes['today'];
  document.getElementById('screen-root').scrollTop = 0;
  window.scrollTo(0, 0);
  fn(params);
  updateNavActive(route);
}

function updateNavActive(route) {
  const topLevel = ['today', 'calendar', 'progress', 'photos'];
  const navRoute = topLevel.includes(route) ? route : 'more';
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.route === navRoute);
  });
}

window.addEventListener('hashchange', renderRoute);

// ------------------------------------------------------------- rendering
App.render = function (html) {
  document.getElementById('screen-root').innerHTML = html;
  window.scrollTo(0, 0);
};

App.$ = (sel, root) => (root || document).querySelector(sel);
App.$$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
App.esc = Utils.escapeHtml;

// ------------------------------------------------------------------ toast
let toastTimer = null;
App.showToast = function (msg, ms = 2200) {
  const root = document.getElementById('overlay-root');
  let el = document.getElementById('toastEl');
  if (el) el.remove();
  el = document.createElement('div');
  el.id = 'toastEl';
  el.className = 'toast';
  el.textContent = msg;
  root.appendChild(el);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.remove(), ms);
};

// -------------------------------------------------------------- bottom sheet
App.openSheet = function (innerHtml, opts = {}) {
  App.closeSheet();
  const root = document.getElementById('overlay-root');
  const overlay = document.createElement('div');
  overlay.className = 'sheet-overlay';
  overlay.id = 'activeSheet';
  overlay.innerHTML = `<div class="sheet"><div class="sheet-handle"></div>${innerHtml}</div>`;
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) App.closeSheet();
  });
  root.appendChild(overlay);
  if (opts.onOpen) opts.onOpen(overlay);
  App._sheetOnClose = opts.onClose || null;
};
App.closeSheet = function () {
  const el = document.getElementById('activeSheet');
  if (el) el.remove();
  if (App._sheetOnClose) { const cb = App._sheetOnClose; App._sheetOnClose = null; cb(); }
};

// ------------------------------------------------------------ confirm dialog
App.confirm = function (message, { title = 'Bevestigen', okLabel = 'Bevestigen', danger = false } = {}) {
  return new Promise((resolve) => {
    App.openSheet(`
      <h3>${App.esc(title)}</h3>
      <p class="text-muted" style="margin-bottom:18px;">${App.esc(message)}</p>
      <div class="btn-row">
        <button class="btn block" id="confirmNo">Annuleren</button>
        <button class="btn block ${danger ? 'danger' : 'primary'}" id="confirmYes">${App.esc(okLabel)}</button>
      </div>
    `);
    App.$('#confirmNo').onclick = () => { App.closeSheet(); resolve(false); };
    App.$('#confirmYes').onclick = () => { App.closeSheet(); resolve(true); };
  });
};

// ------------------------------------------------------------------- theme
App.applyTheme = function () {
  const dark = Store.getSettings().darkMode;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? '#0f1114' : '#f5f6f8');
};

// -------------------------------------------------------------- nav clicks
document.getElementById('mainNav').addEventListener('click', (e) => {
  const btn = e.target.closest('.nav-item');
  if (!btn) return;
  App.navigate(btn.dataset.route);
});

// ------------------------------------------------------------- misc widgets
App.timePickerHtml = function (selected) {
  const opts = [
    { key: '15', label: '15 min' },
    { key: '25', label: '25 min' },
    { key: '45', label: '45+ min' },
  ];
  return `<div class="time-pick" id="timePick">
    ${opts.map(o => `<button data-t="${o.key}" class="${selected === o.key ? 'selected' : ''}">${o.label}</button>`).join('')}
  </div>`;
};

App.suggestFromTime = function (t) {
  if (t === '15') return 'express';
  if (t === '25') return 'kettlebell';
  return 'gym';
};

App.exerciseName = (id) => (Store.getExercise(id) || {}).name || id;

App.weightUnitLabel = function (ex) {
  switch (ex.weightUnit) {
    case 'per_dumbbell': return 'per dumbbell';
    case 'totaal': return 'totaal';
    case 'kettlebell': return 'kettlebell';
    case 'bodyweight': return 'lichaamsgewicht';
    default: return '';
  }
};

// ----------------------------------------------------- exercise info sheet
App.youtubeSearchUrl = function (name) {
  return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(name + ' how to exercise');
};

// --------------------------------------------------- ad-hoc workout picker
// Lets the person pick ANY split day for a given date, regardless of what's
// scheduled — used for catching up a missed session on another day.
App.openAdHocPicker = function (dateISO) {
  const days = [
    ['upperA', 'Upper A'], ['lowerA', 'Lower A'], ['upperB', 'Upper B'], ['lowerB', 'Lower B'],
  ];
  App.openSheet(`
    <h3>Training kiezen</h3>
    <p class="text-muted text-sm mt-8">Voor ${Utils.formatDateLong(dateISO)} — kies eender welke training, ongeacht wat er gepland staat.</p>
    <div class="card mt-16">
      ${days.map(([key, label]) => `<div class="list-row" data-day="${key}" data-label="${label}" style="cursor:pointer;">
        <div class="l-title">${label}</div><div class="l-val" style="color:var(--text-faint);">›</div></div>`).join('')}
      <div class="list-row" data-cardio="1" style="cursor:pointer;">
        <div class="l-title">Cardio</div><div class="l-val" style="color:var(--text-faint);">›</div></div>
    </div>
  `);
  App.$$('.list-row[data-day]').forEach(row => row.onclick = () => {
    App.openVariantPicker(dateISO, row.dataset.day, row.dataset.label);
  });
  const cardioRow = App.$('.list-row[data-cardio]');
  if (cardioRow) cardioRow.onclick = () => { App.closeSheet(); App.navigate('cardio-log', [dateISO]); };
};

App.openVariantPicker = function (dateISO, dayKey, label) {
  const gymTpl = Store.getGymTemplateByDay(dayKey);
  const kbTpls = Store.getKbTemplatesByDay(dayKey);
  App.openSheet(`
    <h3>${App.esc(label)}</h3>
    <p class="text-muted text-sm mt-8">${Utils.formatDateLong(dateISO)}</p>
    <div class="card mt-16">
      <div class="list-row" data-variant="gym" style="cursor:pointer;">
        <div><div class="l-title">Volledige gymsessie</div><div class="l-sub">50-70 min</div></div><div class="l-val" style="color:var(--text-faint);">›</div></div>
      <div class="list-row" data-variant="kb-std" style="cursor:pointer;">
        <div><div class="l-title">Kettlebell (standaard)</div><div class="l-sub">~${kbTpls.standard ? kbTpls.standard.durationMin : 25} min</div></div><div class="l-val" style="color:var(--text-faint);">›</div></div>
      <div class="list-row" data-variant="kb-exp" style="cursor:pointer;">
        <div><div class="l-title">Kettlebell (express)</div><div class="l-sub">~${kbTpls.express ? kbTpls.express.durationMin : 15} min</div></div><div class="l-val" style="color:var(--text-faint);">›</div></div>
    </div>
    <button class="btn ghost block mt-12" id="btnBackToDayPick">‹ Terug</button>
  `);
  App.$('[data-variant="gym"]').onclick = () => { App.closeSheet(); App.navigate('workout', [gymTpl.id, '', dateISO]); };
  App.$('[data-variant="kb-std"]').onclick = () => { App.closeSheet(); App.navigate('kettlebell', [kbTpls.standard.id, dateISO]); };
  App.$('[data-variant="kb-exp"]').onclick = () => { App.closeSheet(); App.navigate('kettlebell', [kbTpls.express.id, dateISO]); };
  App.$('#btnBackToDayPick').onclick = () => App.openAdHocPicker(dateISO);
};

App.openExerciseInfo = function (exerciseId) {
  const ex = Store.getExercise(exerciseId);
  if (!ex) return;
  App.openSheet(`
    <h3>${App.esc(ex.name)}</h3>
    <p class="text-muted text-sm mt-8">${App.esc(ex.primaryMuscle || '')}${ex.equipment ? ' · ' + App.esc(ex.equipment) : ''}</p>
    ${ex.instructions ? `<div class="card mt-16"><div class="card-title">Uitvoering</div><p class="mt-8">${App.esc(ex.instructions)}</p></div>` : ''}
    ${ex.cues ? `<div class="card mt-12"><div class="card-title">Technische tip</div><p class="mt-8">${App.esc(ex.cues)}</p></div>` : ''}
    ${ex.mistakes ? `<div class="card mt-12"><div class="card-title">Veelgemaakte fout</div><p class="mt-8">${App.esc(ex.mistakes)}</p></div>` : ''}
    ${!ex.instructions && !ex.cues && !ex.mistakes ? `<p class="text-muted text-sm mt-16">Nog geen beschrijving ingevuld.</p>` : ''}
    <a href="${App.youtubeSearchUrl(ex.name)}" target="_blank" rel="noopener noreferrer" class="btn block mt-16" style="text-decoration:none;display:flex;align-items:center;justify-content:center;gap:8px;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8zM9.6 15.5v-7l6.3 3.5-6.3 3.5z"/></svg>
      Bekijk uitleg op YouTube
    </a>
    <button class="btn ghost block mt-8" id="infoEditBtn">Oefening bewerken</button>
  `);
  const editBtn = App.$('#infoEditBtn');
  if (editBtn) editBtn.onclick = () => {
    App.closeSheet();
    if (App.openExerciseEditor) App.openExerciseEditor(exerciseId);
  };
};

App.gotoRoute = null; // placeholder, real router used via App.navigate

renderRoute.__isCore = true;
window.__renderRoute = renderRoute;
