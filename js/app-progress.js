/* ============================================================
   app-progress.js — stats overview, exercise charts, PR list
   ============================================================ */

(() => {
  let activeTab = 'overzicht';
  let chartInstance = null;

  App.screens.progress = async function () {
    App.render(`
      <div class="screen">
        <div class="topbar"><h1>Progressie</h1></div>
        <div class="chip-row">
          ${tab('overzicht', 'Overzicht')}${tab('oefeningen', 'Oefeningen')}${tab('records', 'Records')}${tab('consistentie', 'Consistentie')}
        </div>
        <div id="progBody" class="mt-16"></div>
      </div>
    `);
    App.$$('.chip[data-tab]').forEach(c => c.onclick = () => { activeTab = c.dataset.tab; App.screens.progress(); });
    const body = document.getElementById('progBody');
    if (activeTab === 'overzicht') body.innerHTML = await overviewHtml();
    if (activeTab === 'oefeningen') body.innerHTML = exerciseListHtml();
    if (activeTab === 'records') body.innerHTML = recordsHtml();
    if (activeTab === 'consistentie') body.innerHTML = await consistencyHtml();
    wireExerciseList();
  };

  function tab(key, label) {
    return `<button class="chip ${activeTab === key ? 'active' : ''}" data-tab="${key}">${label}</button>`;
  }

  async function overviewHtml() {
    const allSessions = await Store.getAllSessions();
    const gym = allSessions.filter(s => s.type === 'gym').length;
    const kb = allSessions.filter(s => s.type === 'kettlebell').length;
    const cardio = allSessions.filter(s => s.type === 'cardio').length;
    const totalDurationSec = allSessions.reduce((a, s) => a + (s.durationSec || 0), 0);
    const streak = await Store.getStreak();
    const weekSum = await Store.getWeekSummary(Utils.todayISO());

    return `
      <div class="stat-grid">
        <div class="stat-box"><div class="val num">${gym + kb}</div><div class="label">Krachttrainingen totaal</div></div>
        <div class="stat-box"><div class="val num">${cardio}</div><div class="label">Cardiosessies totaal</div></div>
        <div class="stat-box"><div class="val num">${gym}/${kb}</div><div class="label">Gym / Kettlebell</div></div>
        <div class="stat-box"><div class="val num">${Utils.fmtDurationLong(totalDurationSec)}</div><div class="label">Totale trainingstijd</div></div>
        <div class="stat-box"><div class="val num">${streak}</div><div class="label">Huidige streak (dagen)</div></div>
        <div class="stat-box"><div class="val num">${weekSum.strengthDone}/4</div><div class="label">Deze week (kracht)</div></div>
      </div>
    `;
  }

  function exerciseListHtml() {
    const exercises = Store.getAllExercises().filter(e => e.status === 'actief' && e.type !== 'cardio');
    const grouped = {};
    exercises.forEach(e => { (grouped[e.primaryMuscle] = grouped[e.primaryMuscle] || []).push(e); });
    return Object.keys(grouped).sort().map(muscle => `
      <div class="section-title">${muscle}</div>
      <div class="card">
        ${grouped[muscle].map(e => {
      const rec = Store.getRecord(e.id);
      return `<div class="list-row" data-exid="${e.id}" style="cursor:pointer;">
            <div><div class="l-title">${App.esc(e.name)}</div><div class="l-sub">${rec && rec.max1RM ? 'Geschat 1RM: ' + Utils.fmtKg(rec.max1RM.value) : 'Nog geen data'}</div></div>
            <div class="l-val" style="color:var(--text-faint);">›</div>
          </div>`;
    }).join('')}
      </div>
    `).join('');
  }

  function wireExerciseList() {
    App.$$('.list-row[data-exid]').forEach(row => row.onclick = () => App.navigate('exercise-detail', [row.dataset.exid]));
  }

  function recordsHtml() {
    const all = Store.getAllRecords().filter(r => r.max1RM);
    all.sort((a, b) => (b.max1RM ? b.max1RM.date : '').localeCompare(a.max1RM ? a.max1RM.date : ''));
    if (!all.length) return emptyState('Nog geen records', 'Voltooi een training om je eerste records te zetten.');
    return `<div class="card">${all.map(r => {
      const meta = Store.getExercise(r.exerciseId);
      return `<div class="list-row">
        <div><div class="l-title">${App.esc(meta.name)}</div><div class="l-sub">Zwaarste: ${Utils.fmtKg(r.maxWeight.value)} × ${r.maxWeight.reps} · ${Utils.formatDateShort(r.maxWeight.date)}</div></div>
        <div class="l-val">${Utils.fmtKg(r.max1RM.value)}</div>
      </div>`;
    }).join('')}</div>`;
  }

  async function consistencyHtml() {
    const now = Utils.todayISO();
    let rows = '';
    for (let i = 0; i < 6; i++) {
      const ref = Utils.addDays(now, -7 * i);
      const w = await Store.getWeekSummary(ref);
      rows += `<div class="list-row">
        <div><div class="l-title">Week van ${Utils.formatDateShort(w.start)}</div><div class="l-sub">${w.strengthDone}/4 kracht · ${w.cardioDone}/1 cardio</div></div>
        <div class="l-val" style="color:${w.complete ? 'var(--success)' : 'var(--text-faint)'};">${w.complete ? '✓' : ''}</div>
      </div>`;
    }
    return `<div class="card">${rows}</div>`;
  }

  function emptyState(title, sub) {
    return `<div class="empty-state"><h4>${App.esc(title)}</h4><p>${App.esc(sub)}</p></div>`;
  }

  // ---------------------------------------------------------- exercise detail
  let detailFilter = '3m';

  App.screens.exerciseDetail = async function (params) {
    const exerciseId = params[0];
    const meta = Store.getExercise(exerciseId);
    if (!meta) { App.navigate('progress'); return; }
    const history = await Store.getSessionsForExercise(exerciseId);
    const completed = history.filter(h => h.session.status === 'completed' || h.session.status === 'partial');

    App.render(`
      <div class="screen">
        <div class="topbar">
          <button class="icon-btn" id="btnBack"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
          <h1 style="font-size:19px;">${App.esc(meta.name)}</h1>
        </div>
        <div class="chip-row">
          ${['4w', '3m', '6m', '1j', 'alles'].map(k => `<button class="chip ${detailFilter === k ? 'active' : ''}" data-f="${k}">${k}</button>`).join('')}
        </div>
        <div class="seg mt-12" id="metricSeg">
          <button class="active" data-m="weight">Beste gewicht</button>
          <button data-m="e1rm">Geschat 1RM</button>
          <button data-m="volume">Volume</button>
        </div>
        <div class="chart-wrap"><canvas id="progChart" height="180"></canvas></div>
        ${meta.instructions || meta.cues || meta.mistakes ? `
        <div class="section-title">Uitleg</div>
        <div class="card">
          ${meta.instructions ? `<p>${App.esc(meta.instructions)}</p>` : ''}
          ${meta.cues ? `<p class="text-muted text-sm mt-8">💡 ${App.esc(meta.cues)}</p>` : ''}
          ${meta.mistakes ? `<p class="text-muted text-sm mt-8">⚠️ ${App.esc(meta.mistakes)}</p>` : ''}
          <a href="${App.youtubeSearchUrl(meta.name)}" target="_blank" rel="noopener noreferrer" class="btn sm block mt-12" style="text-decoration:none;">▶ Bekijk uitleg op YouTube</a>
        </div>` : ''}
        <div class="section-title">Historiek</div>
        <div class="card" id="historyList">${historyRows(completed)}</div>
        <div class="section-title">Notitie</div>
        <div class="card"><textarea id="exNote" rows="2" placeholder="bv. volgende keer bank één stand lager"></textarea></div>
      </div>
    `);

    Store.getExerciseNote(exerciseId).then(n => { const el = document.getElementById('exNote'); if (el) el.value = n; });
    App.$('#exNote').addEventListener('blur', () => Store.setExerciseNote(exerciseId, App.$('#exNote').value));

    App.$('#btnBack').onclick = () => App.navigate('progress');
    App.$$('.chip[data-f]').forEach(c => c.onclick = () => { detailFilter = c.dataset.f; drawChart(completed, currentMetric()); App.screens.exerciseDetail(params); });
    App.$$('#metricSeg button').forEach(b => b.onclick = () => {
      App.$$('#metricSeg button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      drawChart(completed, b.dataset.m);
    });

    drawChart(completed, 'weight');
  };

  function currentMetric() {
    const active = document.querySelector('#metricSeg button.active');
    return active ? active.dataset.m : 'weight';
  }

  function filterByRange(completed) {
    if (detailFilter === 'alles') return completed;
    const days = { '4w': 28, '3m': 90, '6m': 182, '1j': 365 }[detailFilter];
    const cutoff = Utils.addDays(Utils.todayISO(), -days);
    return completed.filter(h => h.session.date >= cutoff);
  }

  function historyRows(completed) {
    if (!completed.length) return emptyState('Geen historiek', 'Log deze oefening om data te zien.');
    const rev = [...completed].reverse().slice(0, 12);
    return rev.map(h => {
      const sets = h.entry.sets.filter(s => s.completed).map(s => `${Utils.fmtKg(s.weight)}×${s.reps}`).join(', ');
      return `<div class="list-row"><div><div class="l-title">${Utils.formatDateShort(h.session.date)}</div><div class="l-sub">${sets || '–'}</div></div></div>`;
    }).join('');
  }

  function drawChart(completed, metric) {
    const filtered = filterByRange(completed);
    const labels = filtered.map(h => Utils.formatDateShort(h.session.date));
    const data = filtered.map(h => {
      const doneSets = h.entry.sets.filter(s => s.completed && s.weight && s.reps);
      if (!doneSets.length) return null;
      if (metric === 'weight') return Math.max(...doneSets.map(s => s.weight));
      if (metric === 'e1rm') return Utils.round1(Math.max(...doneSets.map(s => Utils.epley1RM(s.weight, s.reps))));
      if (metric === 'volume') return Utils.round1(doneSets.reduce((a, s) => a + s.weight * s.reps, 0));
      return null;
    });

    const ctx = document.getElementById('progChart');
    if (!ctx) return;
    if (chartInstance) chartInstance.destroy();
    if (!filtered.length) {
      const c2d = ctx.getContext('2d');
      c2d.clearRect(0, 0, ctx.width, ctx.height);
      return;
    }
    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue('--accent').trim();
    const text = styles.getPropertyValue('--text-muted').trim();
    const grid = styles.getPropertyValue('--border').trim();

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data, borderColor: accent, backgroundColor: accent + '22',
          fill: true, tension: 0.3, pointRadius: 3, pointBackgroundColor: accent,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: text, font: { size: 10 } }, grid: { color: grid } },
          y: { ticks: { color: text, font: { size: 10 } }, grid: { color: grid } },
        },
      },
    });
  }
})();
