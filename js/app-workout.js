/* ============================================================
   app-workout.js — gym workout logging, rest timer, cardio log,
   and post-session summary
   ============================================================ */

(() => {
  let session = null;       // in-progress session object
  let template = null;      // active gym template (post 80%-filter)
  let fullTemplate = null;  // original template (unfiltered)
  let is80 = false;
  let startedAt = null;
  let restInterval = null;
  let restRemaining = 0;
  let restTotal = 0;
  let editingExistingId = null;

  // ---------------------------------------------------------------- entry
  App.screens.workout = async function (params) {
    const [templateId, sessionId] = params;
    fullTemplate = Store.getGymTemplate(templateId);
    if (!fullTemplate) { App.navigate('today'); return; }
    is80 = false;
    template = fullTemplate;
    editingExistingId = sessionId || null;

    if (sessionId) {
      session = await Store.getSession(sessionId);
    } else {
      session = newSessionFromTemplate(fullTemplate);
      startedAt = Date.now();
    }
    render();
  };

  function newSessionFromTemplate(tpl) {
    return {
      id: null,
      date: Utils.todayISO(),
      type: 'gym',
      templateId: tpl.id,
      name: tpl.name,
      variant: 'full',
      status: 'in_progress',
      workoutNote: '',
      rpe: null,
      exercises: tpl.exercises.map(te => ({
        exerciseId: te.exerciseId,
        target: te,
        sets: Array.from({ length: te.sets }).map((_, i) => ({
          setIndex: i + 1, weight: null, reps: null, rir: null, completed: false, skipped: false, note: '',
        })),
      })),
    };
  }

  function applyEssentialFilter(makeIt80) {
    is80 = makeIt80;
    if (makeIt80) {
      session.exercises = session.exercises.filter(e => e.target.essential !== false);
      session.variant = '80';
    } else {
      // rebuild full list, keep already-entered data for exercises still present
      const existingById = Object.fromEntries(session.exercises.map(e => [e.exerciseId, e]));
      session.exercises = fullTemplate.exercises.map(te => existingById[te.exerciseId] || {
        exerciseId: te.exerciseId, target: te,
        sets: Array.from({ length: te.sets }).map((_, i) => ({ setIndex: i + 1, weight: null, reps: null, rir: null, completed: false, skipped: false, note: '' })),
      });
      session.variant = 'full';
    }
  }

  function getPreviousPerformance(exerciseId) {
    const historyPromise = Store.getSessionsForExercise(exerciseId);
    return historyPromise;
  }

  // ---------------------------------------------------------------- render
  async function render() {
    const settings = Store.getSettings();
    const prevMap = {};
    for (const ex of session.exercises) {
      const hist = await Store.getSessionsForExercise(ex.exerciseId);
      const prior = hist.filter(h => h.session.id !== session.id && h.session.status === 'completed');
      prevMap[ex.exerciseId] = prior.length ? prior[prior.length - 1] : null;
    }

    App.render(`
      <div class="screen">
        <div class="topbar">
          <button class="icon-btn" id="btnBack">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div style="text-align:right;">
            <div class="date-label">${Utils.formatDateShort(session.date)}</div>
            <h1 style="font-size:19px;">${App.esc(template.name)}</h1>
          </div>
        </div>

        <div class="btn-row mt-8" style="margin-bottom:16px;">
          <button class="btn sm ${!is80 ? 'primary' : ''}" id="btnFull">Volledige training</button>
          <button class="btn sm ${is80 ? 'primary' : ''}" id="btn80">80%-versie</button>
        </div>

        <div id="exList">
          ${session.exercises.map((ex, i) => renderExerciseCard(ex, i, prevMap[ex.exerciseId])).join('')}
        </div>

        <div class="card mt-16">
          <label>Workoutnotitie</label>
          <textarea id="workoutNote" rows="2" placeholder="bv. slechte nachtrust, toch alles afgewerkt">${App.esc(session.workoutNote || '')}</textarea>
        </div>

        <button class="btn primary block mt-16" id="btnFinish" style="padding:15px;font-size:15.5px;">Training afronden</button>
        <button class="btn block mt-8" id="btnCancel" style="color:var(--text-muted);">Annuleren</button>
      </div>
    `);

    wireExerciseInputs(prevMap);
    App.$('#btnBack').onclick = () => history.back();
    App.$('#btnCancel').onclick = async () => {
      const ok = await App.confirm('Deze training annuleren? Ingevoerde data gaat verloren.', { okLabel: 'Annuleren training', danger: true });
      if (ok) App.navigate('today');
    };
    App.$('#btnFull').onclick = () => { applyEssentialFilter(false); render(); };
    App.$('#btn80').onclick = () => { applyEssentialFilter(true); render(); };
    App.$('#btnFinish').onclick = finishWorkout;
  }

  function renderExerciseCard(ex, idx, prevEntry) {
    const meta = Store.getExercise(ex.exerciseId);
    const t = ex.target;
    const unitLabel = App.weightUnitLabel(meta);
    const prevText = prevEntry
      ? 'Vorige: ' + prevEntry.entry.sets.filter(s => s.completed).map(s => `${Utils.fmtKg(s.weight)}×${s.reps}`).join(', ')
      : 'Geen eerdere data';
    const bestRec = Store.getRecord(ex.exerciseId);
    const prLine = bestRec && bestRec.maxWeight ? `PR: ${Utils.fmtKg(bestRec.maxWeight.value)} × ${bestRec.maxWeight.reps}` : '';

    return `
      <div class="card ex-card" data-ex="${idx}">
        <div class="ex-head">
          <div>
            <div class="ex-name">${App.esc(meta.name)}</div>
            <div class="ex-sub">${meta.primaryMuscle}${unitLabel ? ' · ' + unitLabel : ''} · ${t.repsMin}-${t.repsMax} reps · RIR ${t.rir}</div>
            <div class="ex-prev">${App.esc(prevText)}</div>
          </div>
          <div style="display:flex;gap:6px;flex:none;">
            <button class="icon-btn" style="width:30px;height:30px;" data-info="${ex.exerciseId}" title="Uitleg">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            </button>
            <button class="icon-btn" style="width:30px;height:30px;" data-swap="${idx}" title="Alternatief">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>
            </button>
          </div>
        </div>
        ${prLine ? `<div class="pr-badge">🏅 ${prLine}</div>` : ''}
        <div class="set-table">
          <div class="set-head"><span>#</span><span>${meta.weightUnit === 'bodyweight' ? 'Reps' : 'Gewicht'}</span><span>Reps</span><span>RIR</span><span></span></div>
          ${ex.sets.map((s, si) => renderSetRow(ex, idx, s, si, meta)).join('')}
        </div>
        <button class="btn sm ghost mt-8" data-addset="${idx}">+ Set toevoegen</button>
      </div>
    `;
  }

  function renderSetRow(ex, exIdx, s, si, meta) {
    const isBW = meta.weightUnit === 'bodyweight';
    return `
      <div class="set-row" data-ex="${exIdx}" data-set="${si}">
        <div class="set-idx">${si + 1}</div>
        ${isBW ? `<div class="set-idx text-muted">BW</div>` : `<input type="number" step="0.5" inputmode="decimal" placeholder="kg" value="${s.weight ?? ''}" data-field="weight">`}
        <input type="number" inputmode="numeric" placeholder="reps" value="${s.reps ?? ''}" data-field="reps">
        <input type="text" inputmode="numeric" placeholder="${ex.target.rir}" value="${s.rir ?? ''}" data-field="rir">
        <div class="set-done ${s.completed ? 'on' : ''}" data-field="done">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
      </div>
    `;
  }

  function wireExerciseInputs(prevMap) {
    App.$$('.set-row').forEach(row => {
      const exIdx = +row.dataset.ex, si = +row.dataset.set;
      const set = session.exercises[exIdx].sets[si];
      row.querySelectorAll('input').forEach(inp => {
        inp.addEventListener('input', () => {
          const field = inp.dataset.field;
          set[field] = field === 'rir' ? inp.value : (inp.value === '' ? null : parseFloat(inp.value));
        });
      });
      const doneBtn = row.querySelector('.set-done');
      doneBtn.addEventListener('click', () => {
        set.completed = !set.completed;
        doneBtn.classList.toggle('on', set.completed);
        if (set.completed) {
          const t = session.exercises[exIdx].target;
          openRestTimer(t.restSec || 90);
        }
      });
    });

    App.$$('[data-addset]').forEach(btn => btn.onclick = () => {
      const exIdx = +btn.dataset.addset;
      const ex = session.exercises[exIdx];
      ex.sets.push({ setIndex: ex.sets.length + 1, weight: null, reps: null, rir: null, completed: false, skipped: false, note: '' });
      render();
    });

    App.$$('[data-swap]').forEach(btn => btn.onclick = () => openSwapSheet(+btn.dataset.swap));
    App.$$('[data-info]').forEach(btn => btn.onclick = () => App.openExerciseInfo(btn.dataset.info));

    const noteEl = App.$('#workoutNote');
    if (noteEl) noteEl.addEventListener('input', () => { session.workoutNote = noteEl.value; });
  }

  function openSwapSheet(exIdx) {
    const ex = session.exercises[exIdx];
    const current = Store.getExercise(ex.exerciseId);
    const alts = (current.alternatives || []).map(id => Store.getExercise(id)).filter(Boolean);
    if (!alts.length) { App.showToast('Geen alternatieven ingesteld voor deze oefening'); return; }
    App.openSheet(`
      <h3>Vervang oefening</h3>
      <p class="text-muted text-sm mt-8">Historiek van "${App.esc(current.name)}" blijft bewaard.</p>
      <div class="card mt-16">
        ${alts.map(a => `<div class="list-row" data-alt="${a.id}" style="cursor:pointer;">
          <div class="l-title">${App.esc(a.name)}</div><div class="l-val">›</div></div>`).join('')}
      </div>
    `);
    App.$$('.list-row[data-alt]').forEach(row => row.onclick = () => {
      const newId = row.dataset.alt;
      const newMeta = Store.getExercise(newId);
      ex.exerciseId = newId;
      ex.sets.forEach(s => { s.weight = null; s.reps = null; s.completed = false; });
      App.closeSheet();
      render();
    });
  }

  // ------------------------------------------------------------ rest timer
  function openRestTimer(seconds) {
    clearInterval(restInterval);
    restTotal = seconds;
    restRemaining = seconds;
    const root = document.getElementById('overlay-root');
    const el = document.createElement('div');
    el.className = 'rest-overlay';
    el.id = 'restOverlay';
    el.innerHTML = `
      <div class="rest-panel">
        <div class="text-muted text-sm">Rust</div>
        <div class="big-timer num" id="restBig">${Utils.fmtDuration(restRemaining)}</div>
        <div class="rest-controls">
          <button class="btn sm" id="restMinus">-15s</button>
          <button class="btn sm" id="restPause">Pauze</button>
          <button class="btn sm" id="restPlus">+15s</button>
        </div>
        <button class="btn ghost block mt-16" id="restSkip">Overslaan</button>
      </div>
    `;
    root.appendChild(el);
    let paused = false;
    tickRest();
    restInterval = setInterval(tickRest, 1000);

    function tickRest() {
      if (paused) return;
      restRemaining--;
      const big = document.getElementById('restBig');
      if (!big) { clearInterval(restInterval); return; }
      if (restRemaining <= 0) {
        big.textContent = "0:00";
        clearInterval(restInterval);
        if (navigator.vibrate) navigator.vibrate([200, 80, 200]);
        setTimeout(closeRest, 500);
        return;
      }
      big.textContent = Utils.fmtDuration(restRemaining);
    }
    function closeRest() {
      clearInterval(restInterval);
      const overlay = document.getElementById('restOverlay');
      if (overlay) overlay.remove();
    }
    document.getElementById('restMinus').onclick = () => { restRemaining = Math.max(0, restRemaining - 15); document.getElementById('restBig').textContent = Utils.fmtDuration(restRemaining); };
    document.getElementById('restPlus').onclick = () => { restRemaining += 15; document.getElementById('restBig').textContent = Utils.fmtDuration(restRemaining); };
    document.getElementById('restPause').onclick = (e) => { paused = !paused; e.target.textContent = paused ? 'Hervat' : 'Pauze'; };
    document.getElementById('restSkip').onclick = closeRest;
  }

  // -------------------------------------------------------------- finish
  async function finishWorkout() {
    const totalSets = session.exercises.reduce((a, e) => a + e.sets.length, 0);
    const doneSets = session.exercises.reduce((a, e) => a + e.sets.filter(s => s.completed).length, 0);
    if (doneSets === 0) {
      App.showToast('Registreer minstens één set voor je afrondt');
      return;
    }
    session.durationSec = startedAt ? Math.round((Date.now() - startedAt) / 1000) : (session.durationSec || 0);
    session.status = doneSets >= totalSets ? 'completed' : 'partial';
    session.completedAt = new Date().toISOString();

    const { newRecords } = await Store.saveSession(session);
    App.navigate('summary', [session.id]);
  }

  // ---------------------------------------------------------------------
  // Cardio logging
  // ---------------------------------------------------------------------
  App.screens['cardio-log'] = function (params) {
    const dateISO = params[0] || Utils.todayISO();
    const settings = Store.getSettings();
    App.render(`
      <div class="screen">
        <div class="topbar">
          <button class="icon-btn" id="btnBack"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
          <h1 style="font-size:19px;">Cardio loggen</h1>
        </div>
        <div class="card">
          <div class="field">
            <label>Type</label>
            <select id="cType">
              ${['Fietsen', 'Indoor cycling', 'Spinning', 'Zwemmen', 'Rustig lopen', 'Wandelen met helling', 'Vrije cardio'].map(t =>
      `<option ${t.toLowerCase() === settings.cardioFavorite ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
          </div>
          <div class="field-row">
            <div class="field"><label>Duur (min)</label><input id="cDur" type="number" placeholder="60"></div>
            <div class="field"><label>Afstand (${settings.distanceUnit})</label><input id="cDist" type="number" step="0.1"></div>
          </div>
          <div class="field-row">
            <div class="field"><label>Gem. hartslag</label><input id="cAvgHr" type="number"></div>
            <div class="field"><label>Max hartslag</label><input id="cMaxHr" type="number"></div>
          </div>
          <div class="field-row">
            <div class="field"><label>Gem. vermogen (W)</label><input id="cPower" type="number"></div>
            <div class="field"><label>Calorieën</label><input id="cCal" type="number"></div>
          </div>
          <div class="field"><label>RPE (1-10)</label><input id="cRpe" type="number" min="1" max="10"></div>
          <div class="field"><label>Notities</label><textarea id="cNote" rows="2"></textarea></div>
        </div>
        <button class="btn primary block mt-16" id="btnSaveCardio" style="padding:15px;">Cardio opslaan</button>
      </div>
    `);
    App.$('#btnBack').onclick = () => history.back();
    App.$('#btnSaveCardio').onclick = async () => {
      const s = {
        id: null, date: dateISO, type: 'cardio', name: 'Cardio', status: 'completed',
        cardio: {
          activityType: App.$('#cType').value,
          durationMin: parseFloat(App.$('#cDur').value) || null,
          distanceKm: parseFloat(App.$('#cDist').value) || null,
          avgHr: parseFloat(App.$('#cAvgHr').value) || null,
          maxHr: parseFloat(App.$('#cMaxHr').value) || null,
          avgPower: parseFloat(App.$('#cPower').value) || null,
          calories: parseFloat(App.$('#cCal').value) || null,
          rpe: parseFloat(App.$('#cRpe').value) || null,
          note: App.$('#cNote').value,
        },
        durationSec: (parseFloat(App.$('#cDur').value) || 0) * 60,
        completedAt: new Date().toISOString(),
      };
      const { session: saved } = await Store.saveSession(s);
      App.navigate('summary', [saved.id]);
    };
  };

  // ---------------------------------------------------------------------
  // Summary screen (works for gym / kettlebell / cardio)
  // ---------------------------------------------------------------------
  App.screens.summary = async function (params) {
    const id = params[0];
    const s = await Store.getSession(id);
    if (!s) { App.navigate('today'); return; }

    let body = '';
    if (s.type === 'gym') body = await renderGymSummary(s);
    else if (s.type === 'kettlebell') body = renderKbSummary(s);
    else body = renderCardioSummary(s);

    App.render(`
      <div class="screen">
        <div class="topbar">
          <button class="icon-btn" id="btnClose"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
          <h1 style="font-size:19px;">Samenvatting</h1>
        </div>
        <div class="hero-card" style="background:linear-gradient(160deg, var(--success) 0%, #2c6b46 100%);">
          <div class="eyebrow">${s.status === 'completed' ? 'Voltooid' : 'Deels voltooid'}</div>
          <h2>${App.esc(s.name || 'Training')}</h2>
          <div class="meta">${Utils.formatDateLong(s.date)}${s.durationSec ? ' · ' + Utils.fmtDurationLong(s.durationSec) : ''}</div>
        </div>
        ${body}
        <button class="btn primary block mt-20" id="btnDone" style="padding:14px;">Terug naar vandaag</button>
      </div>
    `);
    App.$('#btnClose').onclick = () => App.navigate('today');
    App.$('#btnDone').onclick = () => App.navigate('today');
  };

  async function renderGymSummary(s) {
    let totalVolume = 0, doneSets = 0, totalSets = 0, rirSum = 0, rirCount = 0;
    const prLines = [];
    for (const ex of s.exercises) {
      totalSets += ex.sets.length;
      const meta = Store.getExercise(ex.exerciseId);
      const rec = Store.getRecord(ex.exerciseId);
      for (const set of ex.sets) {
        if (set.completed) {
          doneSets++;
          if (set.weight && set.reps) totalVolume += set.weight * set.reps;
          const rirNum = parseFloat(set.rir);
          if (!isNaN(rirNum)) { rirSum += rirNum; rirCount++; }
        }
      }
      if (rec && rec.maxWeight && rec.maxWeight.date === s.date) {
        prLines.push(`${meta.name}: ${Utils.fmtKg(rec.maxWeight.value)} × ${rec.maxWeight.reps}`);
      }
    }
    const suggestion = buildProgressionSuggestions(s);
    return `
      <div class="stat-grid">
        <div class="stat-box"><div class="val num">${doneSets}/${totalSets}</div><div class="label">Sets voltooid</div></div>
        <div class="stat-box"><div class="val num">${Math.round(totalVolume)}</div><div class="label">Totaalvolume (kg)</div></div>
        <div class="stat-box"><div class="val num">${rirCount ? Utils.round1(rirSum / rirCount) : '–'}</div><div class="label">Gem. RIR</div></div>
        <div class="stat-box"><div class="val num">${s.exercises.length}</div><div class="label">Oefeningen</div></div>
      </div>
      ${prLines.length ? `<div class="section-title">Nieuwe records</div><div class="card">${prLines.map(l => `<div class="pr-badge" style="display:flex;">🏅 ${App.esc(l)}</div>`).join('')}</div>` : ''}
      ${suggestion.length ? `<div class="section-title">Progressiesuggesties</div><div class="card">${suggestion.map(l => `<div class="list-row"><div class="l-title">${App.esc(l.name)}</div><div class="l-sub">${App.esc(l.msg)}</div></div>`).join('')}</div>` : ''}
    `;
  }

  function buildProgressionSuggestions(s) {
    const out = [];
    for (const ex of s.exercises) {
      const meta = Store.getExercise(ex.exerciseId);
      const t = ex.target;
      const doneSets = ex.sets.filter(x => x.completed && x.reps != null);
      if (!doneSets.length) continue;
      const allAtTop = doneSets.every(x => x.reps >= t.repsMax);
      const allBelowMin = doneSets.every(x => x.reps < t.repsMin);
      const lower = meta.category === 'Squat' || meta.category === 'Hinge' || meta.category === 'Unilateraal';
      if (allAtTop) {
        out.push({ name: meta.name, msg: `Volgende keer +${lower ? '2,5 tot 5' : '2 tot 2,5'} kg proberen` });
      } else if (allBelowMin) {
        out.push({ name: meta.name, msg: 'Gewicht behouden of licht verlagen — reps bleven onder doel' });
      } else {
        out.push({ name: meta.name, msg: 'Gewicht behouden, probeer volgende keer meer reps' });
      }
    }
    return out;
  }

  function renderKbSummary(s) {
    const k = s.kettlebell || {};
    return `
      <div class="stat-grid">
        <div class="stat-box"><div class="val num">${k.rounds ?? '–'}</div><div class="label">Rondes</div></div>
        <div class="stat-box"><div class="val num">${k.weightKg ?? '–'} kg</div><div class="label">Kettlebell</div></div>
        <div class="stat-box"><div class="val num">${k.rpe ?? '–'}</div><div class="label">RPE</div></div>
        <div class="stat-box"><div class="val num">${s.durationSec ? Utils.fmtDurationLong(s.durationSec) : '–'}</div><div class="label">Duur</div></div>
      </div>
      ${k.note ? `<div class="card mt-12"><div class="card-title">Notitie</div><p class="mt-8">${App.esc(k.note)}</p></div>` : ''}
    `;
  }

  function renderCardioSummary(s) {
    const c = s.cardio || {};
    return `
      <div class="stat-grid">
        <div class="stat-box"><div class="val num">${c.durationMin ?? '–'}</div><div class="label">Minuten</div></div>
        <div class="stat-box"><div class="val num">${c.distanceKm ?? '–'}</div><div class="label">Afstand</div></div>
        <div class="stat-box"><div class="val num">${c.avgHr ?? '–'}</div><div class="label">Gem. hartslag</div></div>
        <div class="stat-box"><div class="val num">${c.rpe ?? '–'}</div><div class="label">RPE</div></div>
      </div>
      ${c.note ? `<div class="card mt-12"><div class="card-title">Notitie</div><p class="mt-8">${App.esc(c.note)}</p></div>` : ''}
    `;
  }
})();
