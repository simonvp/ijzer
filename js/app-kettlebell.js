/* ============================================================
   app-kettlebell.js — timer-based kettlebell session screen
   ============================================================ */

(() => {
  let tpl = null;
  let weightKg = 12;
  let exerciseWeights = {}; // exerciseId -> kg used
  let totalSeconds = 0;
  let remaining = 0;
  let elapsed = 0;
  let rounds = 0;
  let paused = false;
  let timerHandle = null;
  let startedAt = null;
  let finished = false;

  App.screens.kettlebell = function (params) {
    const [templateId] = params;
    tpl = Store.getKbTemplatesByDayOrId ? null : findTemplate(templateId);
    if (!tpl) { App.navigate('today'); return; }
    const settings = Store.getSettings();
    weightKg = settings.defaultKettlebellWeight || (settings.kettlebells && settings.kettlebells[0]) || 12;
    exerciseWeights = {};
    tpl.items.forEach(it => { exerciseWeights[it.exerciseId] = weightKg; });
    totalSeconds = tpl.durationMin * 60;
    remaining = totalSeconds;
    elapsed = 0;
    rounds = 0;
    paused = false;
    finished = false;
    startedAt = Date.now();
    clearInterval(timerHandle);
    render();
    timerHandle = setInterval(tick, 1000);
  };

  function findTemplate(id) {
    // search all kb templates in store cache via exposed getter workaround
    const all = [];
    ['upperA', 'lowerA', 'upperB', 'lowerB'].forEach(day => {
      const pair = Store.getKbTemplatesByDay(day);
      if (pair.standard) all.push(pair.standard);
      if (pair.express) all.push(pair.express);
    });
    return all.find(t => t.id === id);
  }

  function tick() {
    if (paused || finished) return;
    remaining--;
    elapsed++;
    if (remaining <= 0) {
      remaining = 0;
      clearInterval(timerHandle);
      if (navigator.vibrate) navigator.vibrate([250, 100, 250]);
      openFinishSheet(true);
    }
    updateTimerDom();
  }

  function updateTimerDom() {
    const big = document.getElementById('kbBigTimer');
    if (big) big.textContent = Utils.fmtDuration(remaining);
    const roundsEl = document.getElementById('kbRounds');
    if (roundsEl) roundsEl.textContent = rounds;
  }

  function allSameWeight() {
    const vals = Object.values(exerciseWeights);
    if (!vals.length) return null;
    return vals.every(v => v === vals[0]) ? vals[0] : null;
  }

  function render() {
    const settings = Store.getSettings();
    const weights = settings.kettlebells && settings.kettlebells.length ? settings.kettlebells : [6, 12];
    App.render(`
      <div class="screen">
        <div class="topbar">
          <button class="icon-btn" id="btnBack"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
          <div style="text-align:right;">
            <div class="date-label">${tpl.variant === 'express' ? 'Express' : 'Standaard'}</div>
            <h1 style="font-size:19px;">${App.esc(tpl.name)}</h1>
          </div>
        </div>

        <div class="field mt-8">
          <label>Snel instellen voor alle oefeningen</label>
          <div class="seg mt-8">
            ${weights.map(w => `<button class="${allSameWeight() === w ? 'active' : ''}" data-w="${w}">${w} kg</button>`).join('')}
          </div>
        </div>

        <div class="kb-timer-wrap">
          <div class="text-muted text-sm">Resterende tijd</div>
          <div class="big-timer num" id="kbBigTimer">${Utils.fmtDuration(remaining)}</div>
          <div class="btn-row" style="justify-content:center;">
            <button class="btn sm" id="btnPause">${paused ? 'Hervat' : 'Pauze'}</button>
          </div>
        </div>

        <div class="card" style="text-align:center;">
          <div class="card-title">Voltooide rondes</div>
          <div style="display:flex;align-items:center;justify-content:center;gap:20px;margin-top:8px;">
            <button class="icon-btn" id="roundMinus">–</button>
            <div class="num" id="kbRounds" style="font-size:32px;font-weight:700;">${rounds}</div>
            <button class="icon-btn" id="roundPlus">+</button>
          </div>
        </div>

        <div class="section-title">Oefeningen (per ronde)</div>
        <p class="text-muted text-sm" style="margin-top:-6px;">Tik op het gewicht om het per oefening aan te passen.</p>
        <div class="kb-list">
          ${tpl.items.map(it => `
            <div class="kb-item">
              <div style="flex:1;cursor:pointer;" data-info="${it.exerciseId}">
                <div class="name">${App.esc(App.exerciseName(it.exerciseId))}</div>
                <div class="reps">${App.esc(it.reps)}</div>
              </div>
              <button class="chip active" data-wcycle="${it.exerciseId}" style="flex:none;">${exerciseWeights[it.exerciseId]} kg</button>
            </div>`).join('')}
        </div>

        <div class="kb-controls">
          <button class="btn block" id="btnEndEarly" style="color:var(--text-muted);">Vroegtijdig afronden</button>
        </div>
      </div>
    `);

    App.$('#btnBack').onclick = async () => {
      const ok = await App.confirm('Kettlebellsessie verlaten? Voortgang gaat verloren.', { danger: true, okLabel: 'Verlaten' });
      if (ok) { clearInterval(timerHandle); App.navigate('today'); }
    };
    App.$$('.seg button[data-w]').forEach(b => b.onclick = () => {
      weightKg = parseFloat(b.dataset.w);
      tpl.items.forEach(it => { exerciseWeights[it.exerciseId] = weightKg; });
      render();
    });
    App.$('#btnPause').onclick = (e) => { paused = !paused; e.target.textContent = paused ? 'Hervat' : 'Pauze'; };
    App.$('#roundPlus').onclick = () => { rounds++; updateTimerDom(); };
    App.$('#roundMinus').onclick = () => { rounds = Math.max(0, rounds - 1); updateTimerDom(); };
    App.$('#btnEndEarly').onclick = () => { clearInterval(timerHandle); openFinishSheet(false); };
    App.$$('[data-info]').forEach(el => el.onclick = () => App.openExerciseInfo(el.dataset.info));
    App.$$('[data-wcycle]').forEach(btn => btn.onclick = () => {
      const exId = btn.dataset.wcycle;
      const settings = Store.getSettings();
      const weights = settings.kettlebells && settings.kettlebells.length ? settings.kettlebells : [12];
      const idx = weights.indexOf(exerciseWeights[exId]);
      exerciseWeights[exId] = weights[(idx + 1) % weights.length];
      render();
    });
  }

  function openFinishSheet(timeUp) {
    finished = true;
    const summaryLine = Object.entries(exerciseWeights)
      .map(([exId, w]) => `${App.exerciseName(exId)}: ${w} kg`).join(' · ');
    App.openSheet(`
      <h3>${timeUp ? 'Tijd voorbij' : 'Sessie afronden'}</h3>
      <div class="field mt-16"><label>Aantal rondes</label><input id="fRounds" type="number" value="${rounds}"></div>
      <div class="field"><label>Totale duur (min)</label><input id="fDuration" type="number" value="${Math.round(elapsed / 60)}"></div>
      <p class="text-muted text-sm">Gebruikte gewichten: ${App.esc(summaryLine)}</p>
      <div class="field mt-12"><label>RPE (1-10)</label><input id="fRpe" type="number" min="1" max="10"></div>
      <div class="field"><label>Opmerkingen</label><textarea id="fNote" rows="2"></textarea></div>
      <button class="btn primary block" id="btnSaveKb">Opslaan</button>
    `, { onClose: () => { if (!document.getElementById('kbSaved')) finished = false; } });

    App.$('#btnSaveKb').onclick = async () => {
      const uniform = allSameWeight();
      const s = {
        id: null, date: Utils.todayISO(), type: 'kettlebell', name: tpl.name, templateId: tpl.id,
        variant: tpl.variant, status: 'completed',
        durationSec: (parseFloat(App.$('#fDuration').value) || 0) * 60,
        kettlebell: {
          rounds: parseInt(App.$('#fRounds').value) || 0,
          weightKg: uniform, // overall weight if consistent across exercises, else null
          exerciseWeights: { ...exerciseWeights },
          rpe: parseFloat(App.$('#fRpe').value) || null,
          note: App.$('#fNote').value,
        },
        completedAt: new Date().toISOString(),
      };
      const marker = document.createElement('div'); marker.id = 'kbSaved'; document.body.appendChild(marker);
      const { session: saved } = await Store.saveSession(s);
      App.closeSheet();
      App.navigate('summary', [saved.id]);
    };
  }
})();
