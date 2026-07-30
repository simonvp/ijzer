/* ============================================================
   app-body.js — bodyweight & measurements tracking
   ============================================================ */

(() => {
  let tab = 'gewicht';
  let bwChart = null;

  const MEASURE_FIELDS = [
    ['waist', 'Taille'], ['chest', 'Borst'], ['hip', 'Heup'],
    ['armL', 'Bovenarm links'], ['armR', 'Bovenarm rechts'],
    ['thighL', 'Bovenbeen links'], ['thighR', 'Bovenbeen rechts'],
    ['calfL', 'Kuit links'], ['calfR', 'Kuit rechts'],
    ['neck', 'Nek'], ['shoulders', 'Schouders'],
  ];

  App.screens.measurements = async function () {
    App.render(`
      <div class="screen">
        <div class="topbar">
          <button class="icon-btn" id="btnBack"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
          <h1 style="font-size:19px;">Lichaam</h1>
        </div>
        <div class="seg">
          <button class="${tab === 'gewicht' ? 'active' : ''}" data-t="gewicht">Gewicht</button>
          <button class="${tab === 'maten' ? 'active' : ''}" data-t="maten">Maten</button>
        </div>
        <div id="bodyBody" class="mt-16"></div>
      </div>
    `);
    App.$('#btnBack').onclick = () => App.navigate('more');
    App.$$('.seg button').forEach(b => b.onclick = () => { tab = b.dataset.t; App.screens.measurements(); });
    const body = document.getElementById('bodyBody');
    if (tab === 'gewicht') body.innerHTML = await weightHtml();
    else body.innerHTML = await measureHtml();
    wireCommon();
    if (tab === 'gewicht') drawWeightChart(await Store.getAllBodyweight());
  };

  async function weightHtml() {
    const all = await Store.getAllBodyweight();
    const latest = all.length ? all[all.length - 1] : null;
    const weekAgo = Utils.addDays(Utils.todayISO(), -7);
    const last7 = all.filter(e => e.date >= weekAgo);
    const avg7 = last7.length ? Utils.round1(last7.reduce((a, e) => a + e.weight, 0) / last7.length) : null;
    const prevWeek = all.filter(e => e.date < weekAgo).slice(-7);
    const avgPrev = prevWeek.length ? Utils.round1(prevWeek.reduce((a, e) => a + e.weight, 0) / prevWeek.length) : null;
    const diffWeek = avg7 !== null && avgPrev !== null ? Utils.round1(avg7 - avgPrev) : null;
    const start = Store.getSettings().startWeightKg;
    const diffStart = latest && start ? Utils.round1(latest.weight - start) : null;

    return `
      <div class="stat-grid">
        <div class="stat-box"><div class="val num">${latest ? Utils.fmtKg(latest.weight) : '–'}</div><div class="label">Laatste meting</div></div>
        <div class="stat-box"><div class="val num">${avg7 ? Utils.fmtKg(avg7) : '–'}</div><div class="label">7-daags gemiddelde</div></div>
        <div class="stat-box"><div class="val num">${diffWeek !== null ? (diffWeek > 0 ? '+' : '') + Utils.fmtKg(diffWeek) : '–'}</div><div class="label">T.o.v. vorige week</div></div>
        <div class="stat-box"><div class="val num">${diffStart !== null ? (diffStart > 0 ? '+' : '') + Utils.fmtKg(diffStart) : '–'}</div><div class="label">T.o.v. start</div></div>
      </div>
      <div class="chart-wrap"><canvas id="bwChart" height="170"></canvas></div>
      <button class="btn primary block mt-16" id="btnAddWeight">+ Gewicht registreren</button>
      <div class="section-title">Metingen</div>
      <div class="card">
        ${all.length ? [...all].reverse().slice(0, 20).map(e => `
          <div class="list-row">
            <div><div class="l-title">${Utils.formatDateShort(e.date)}${e.fasted ? ' · nuchter' : ''}</div>${e.note ? `<div class="l-sub">${App.esc(e.note)}</div>` : ''}</div>
            <div style="display:flex;align-items:center;gap:10px;">
              <div class="l-val">${Utils.fmtKg(e.weight)}</div>
              <button class="icon-btn" style="width:28px;height:28px;" data-delbw="${e.id}">×</button>
            </div>
          </div>`).join('') : emptyState('Nog geen metingen', 'Voeg je eerste gewicht toe.')}
      </div>
    `;
  }

  async function measureHtml() {
    const all = await Store.getAllMeasurements();
    const latest = all.length ? all[all.length - 1] : null;
    const prev = all.length > 1 ? all[all.length - 2] : null;
    const first = all.length ? all[0] : null;

    return `
      <button class="btn primary block" id="btnAddMeasure">+ Nieuwe meting</button>
      <div class="card mt-16">
        ${MEASURE_FIELDS.map(([key, label]) => {
      if (!latest || latest[key] == null) return `<div class="list-row"><div class="l-title">${label}</div><div class="l-sub">–</div></div>`;
      const v = latest[key];
      const dPrev = prev && prev[key] != null ? Utils.round1(v - prev[key]) : null;
      const dFirst = first && first[key] != null ? Utils.round1(v - first[key]) : null;
      return `<div class="list-row">
            <div><div class="l-title">${label}</div><div class="l-sub">${dPrev !== null ? (dPrev >= 0 ? '+' : '') + dPrev + ' cm t.o.v. vorige' : ''}${dFirst !== null ? ' · ' + (dFirst >= 0 ? '+' : '') + dFirst + ' cm t.o.v. start' : ''}</div></div>
            <div class="l-val">${v} cm</div>
          </div>`;
    }).join('')}
      </div>
      <p class="text-muted text-sm mt-8">${latest ? 'Laatste meting: ' + Utils.formatDateLong(latest.date) : 'Nog geen metingen geregistreerd.'}</p>
    `;
  }

  function wireCommon() {
    const btnAddWeight = App.$('#btnAddWeight');
    if (btnAddWeight) btnAddWeight.onclick = openWeightSheet;
    const btnAddMeasure = App.$('#btnAddMeasure');
    if (btnAddMeasure) btnAddMeasure.onclick = openMeasureSheet;
    App.$$('[data-delbw]').forEach(b => b.onclick = async () => {
      await Store.deleteBodyweight(b.dataset.delbw);
      App.screens.measurements();
    });
  }

  function openWeightSheet() {
    App.openSheet(`
      <h3>Gewicht registreren</h3>
      <div class="field mt-16"><label>Datum</label><input id="wDate" type="date" value="${Utils.todayISO()}"></div>
      <div class="field"><label>Gewicht (kg)</label><input id="wVal" type="number" step="0.1" inputmode="decimal" autofocus></div>
      <div class="field"><label>Tijdstip</label><input id="wTime" type="time"></div>
      <div class="field-row" style="align-items:center;">
        <label style="flex:1;">Nuchter gewogen</label>
        <label class="switch"><input type="checkbox" id="wFasted"><span class="track"></span></label>
      </div>
      <div class="field"><label>Notitie</label><input id="wNote"></div>
      <button class="btn primary block" id="btnSaveWeight">Opslaan</button>
    `);
    App.$('#btnSaveWeight').onclick = async () => {
      const val = parseFloat(App.$('#wVal').value);
      if (!val) { App.showToast('Vul een gewicht in'); return; }
      await Store.addBodyweight({
        date: App.$('#wDate').value || Utils.todayISO(), weight: val,
        time: App.$('#wTime').value, fasted: App.$('#wFasted').checked, note: App.$('#wNote').value,
      });
      App.closeSheet();
      App.screens.measurements();
      App.showToast('Gewicht opgeslagen');
    };
  }

  function openMeasureSheet() {
    App.openSheet(`
      <h3>Nieuwe meting</h3>
      <div class="field mt-16"><label>Datum</label><input id="mDate" type="date" value="${Utils.todayISO()}"></div>
      ${MEASURE_FIELDS.map(([key, label]) => `<div class="field"><label>${label} (cm)</label><input id="m_${key}" type="number" step="0.1"></div>`).join('')}
      <button class="btn primary block" id="btnSaveMeasure">Opslaan</button>
    `);
    App.$('#btnSaveMeasure').onclick = async () => {
      const entry = { date: App.$('#mDate').value || Utils.todayISO() };
      MEASURE_FIELDS.forEach(([key]) => {
        const v = parseFloat(App.$('#m_' + key).value);
        entry[key] = isNaN(v) ? null : v;
      });
      await Store.addMeasurement(entry);
      App.closeSheet();
      App.screens.measurements();
      App.showToast('Meting opgeslagen');
    };
  }

  function drawWeightChart(all) {
    const canvas = document.getElementById('bwChart');
    if (!canvas) return;
    if (bwChart) bwChart.destroy();
    if (!all.length) return;
    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue('--accent').trim();
    const brass = styles.getPropertyValue('--brass').trim();
    const text = styles.getPropertyValue('--text-muted').trim();
    const grid = styles.getPropertyValue('--border').trim();

    const labels = all.map(e => Utils.formatDateShort(e.date));
    const weights = all.map(e => e.weight);
    const trend = all.map((e, i) => {
      const slice = all.slice(Math.max(0, i - 6), i + 1);
      return Utils.round1(slice.reduce((a, x) => a + x.weight, 0) / slice.length);
    });

    bwChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Gewicht', data: weights, borderColor: text, backgroundColor: 'transparent', pointRadius: 2, tension: 0.2 },
          { label: '7d gemiddelde', data: trend, borderColor: accent, backgroundColor: accent + '22', fill: true, pointRadius: 0, tension: 0.3 },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true, labels: { color: text, font: { size: 11 } } } },
        scales: {
          x: { ticks: { color: text, font: { size: 10 }, maxTicksLimit: 6 }, grid: { color: grid } },
          y: { ticks: { color: text, font: { size: 10 } }, grid: { color: grid } },
        },
      },
    });
  }

  function emptyState(title, sub) {
    return `<div class="empty-state"><h4>${App.esc(title)}</h4><p>${App.esc(sub)}</p></div>`;
  }
})();
