/* ============================================================
   app-dashboard.js — Today screen + More menu
   ============================================================ */

(() => {
  let selectedTime = null; // '15' | '25' | '45'
  let selectedMode = null; // 'gym' (manual override)

  const WORKOUT_LABELS = {
    push: 'Push', pull: 'Pull', legs: 'Legs',
    kbUpper: 'KB Upper', kbLower: 'KB Lower',
  };

  App.screens.today = async function () {
    const meta = await Store.getMeta();
    if (!meta.onboardingDone) { App.navigate('onboarding'); return; }
    App.applyTheme();

    const dateISO = Utils.todayISO();
    const settings = Store.getSettings();
    const plan = await Store.getPlanForDate(dateISO);
    const sessions = await Store.getSessionsForDate(dateISO);
    const weekSum = await Store.getWeekSummary(dateISO);
    const streak = await Store.getStreak();
    const lastBW = await Store.getLatestBodyweight();
    const photos = await Store.getAllPhotos();
    const lastPhoto = photos.length ? photos[photos.length - 1] : null;
    const recentRecords = getRecentRecords();

    selectedTime = selectedTime || null;
    selectedMode = null;

    const doneToday = sessions.filter(s => s.status === 'completed');
    const hasCompletedToday = doneToday.length > 0;

    App.render(`
      <div class="screen">
        <div class="topbar">
          <div>
            <div class="date-label">${Utils.formatDateLong(dateISO)}</div>
            <h1>Hallo${settings.name ? ', ' + App.esc(settings.name) : ''}</h1>
          </div>
          <button class="icon-btn" id="btnSettingsShortcut" aria-label="Instellingen">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09c0 .68.4 1.28 1 1.51.62.22 1.32.1 1.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06c-.43.5-.55 1.2-.33 1.82.22.6.82 1 1.51 1H21a2 2 0 010 4h-.09c-.68 0-1.28.4-1.51 1z"/></svg>
          </button>
        </div>

        ${renderHero(plan, dateISO, hasCompletedToday, doneToday)}

        <div class="stat-grid">
          <div class="stat-box"><div class="val num">${weekSum.strengthDone}/5</div><div class="label">Trainingen deze week</div></div>
          <div class="stat-box"><div class="val num">${streak}</div><div class="label">Dagenstreak</div></div>
          <div class="stat-box"><div class="val num">${lastBW ? Utils.fmtKg(lastBW.weight) : '–'}</div><div class="label">Laatste gewicht</div></div>
          <div class="stat-box"><div class="val num">${weekSum.complete ? '✓' : weekSum.strengthDone + '/5'}</div><div class="label">Weekdoel</div></div>
        </div>

        ${recentRecords.length ? `
        <div class="section-title">Recente records</div>
        <div class="card">
          ${recentRecords.map(r => `
            <div class="list-row">
              <div><div class="l-title">${App.esc(App.exerciseName(r.exerciseId))}</div>
              <div class="l-sub">${r.type === 'maxWeight' ? 'Zwaarste gewicht' : r.type === 'max1RM' ? 'Geschat 1RM' : 'Meeste volume'}</div></div>
              <div class="l-val">${Utils.fmtKg(r.value)}</div>
            </div>`).join('')}
        </div>` : ''}

        ${lastPhoto ? `
        <div class="section-title">Laatste voortgangsfoto <a href="#/photos" class="text-sm" style="color:var(--accent);font-weight:600;">Bekijk alle</a></div>
        <div class="card" style="padding:8px;">
          <div style="display:flex;gap:10px;align-items:center;">
            <div class="photo-thumb" style="width:70px;height:90px;flex:none;"><img src="${lastPhoto.dataUrl}" alt=""></div>
            <div><div class="l-title" style="font-size:13.5px;">${Utils.formatDateShort(lastPhoto.date)}</div>
            <div class="l-sub">${lastPhoto.angle || ''}${lastPhoto.weight ? ' · ' + Utils.fmtKg(lastPhoto.weight) : ''}</div></div>
          </div>
        </div>` : ''}

        <p class="text-muted text-sm" style="text-align:center;margin:26px 0 6px;">${motivationalText(weekSum, streak)}</p>
      </div>
    `);

    wireHero(plan, dateISO);
    App.$('#btnSettingsShortcut').onclick = () => App.navigate('settings');
  };

  function renderHero(plan, dateISO, hasCompletedToday, doneToday) {
    if (hasCompletedToday) {
      const s = doneToday[0];
      const typeLabel = s.type === 'gym' ? 'Gymsessie' : s.type === 'kettlebell' ? 'Kettlebellsessie' : 'Cardiosessie';
      return `
        <div class="hero-card">
          <div class="eyebrow">Voltooid vandaag</div>
          <h2>${App.esc(s.name || labelForPlan(plan))}</h2>
          <div class="meta">${typeLabel}${s.durationSec ? ' · ' + Utils.fmtDurationLong(s.durationSec) : ''}</div>
          <button class="start-btn" id="btnViewSummary">Bekijk samenvatting</button>
          <div class="override-row">
            <button class="chip-btn" id="btnLogAnother">+ Nog een sessie loggen</button>
          </div>
        </div>`;
    }

    if (plan.type === 'rest') {
      return `
        <div class="hero-card">
          <div class="eyebrow">Vandaag</div>
          <h2>Rustdag</h2>
          <div class="meta">Geen training gepland. Herstel is ook training.</div>
          <div class="override-row">
            <button class="chip-btn" id="btnAnyway">Toch trainen</button>
          </div>
        </div>`;
    }

    if (plan.type === 'cardio') {
      const t = plan.cardioTemplate;
      return `
        <div class="hero-card">
          <div class="eyebrow">Vandaag</div>
          <h2>Cardio</h2>
          <div class="meta">${t.durationMin[0]}–${t.durationMin[1]} min · hoofdzakelijk ${t.zone}</div>
          <div class="focus-tags"><span class="hero-tag">Fietsen</span><span class="hero-tag">Zwemmen</span><span class="hero-tag">Rustig lopen</span></div>
          <button class="start-btn" id="btnStartCardio">Start cardio</button>
          ${overrideRow()}
        </div>`;
    }

    // KB-only day (kbUpper / kbLower)
    if (plan.type === 'kettlebell_only') {
      const kbT = plan.kettlebell.standard;
      if (!kbT) return renderRestFallback();
      return `
        <div class="hero-card" style="--hero-accent: var(--kb, #7c5cbf);">
          <div class="eyebrow" style="color:var(--kb2, #a882f0);">Kettlebell dag</div>
          <h2>${App.esc(kbT.name)}</h2>
          <div class="meta">~${kbT.durationMin} min · ${kbT.items.length} oefeningen</div>
          <div class="focus-tags">
            ${kbT.items.slice(0, 4).map(it => {
              const ex = Store.getExercise(it.exerciseId);
              return ex ? `<span class="hero-tag" style="border-color:var(--kb-bg2,rgba(124,92,191,.22));color:var(--kb2,#a882f0);">${App.esc(ex.name)}</span>` : '';
            }).join('')}
          </div>
          <button class="start-btn" id="btnStartKB" style="background:var(--kb, #7c5cbf);">Start KB workout</button>
          ${overrideRow()}
        </div>`;
    }

    // Strength / gym day
    const gymT = plan.gymTemplate;
    return `
      <div class="hero-card">
        <div class="eyebrow">Vandaag</div>
        <h2>${App.esc(gymT.name)}</h2>
        <div class="meta">Hoeveel tijd heb je?</div>
        <div class="focus-tags">${gymT.focus.map(f => `<span class="hero-tag">${App.esc(f)}</span>`).join('')}</div>
        ${App.timePickerHtml(selectedTime)}
        <button class="start-btn" id="btnStart">Start workout</button>
        ${overrideRow()}
      </div>`;
  }

  function renderRestFallback() {
    return `<div class="hero-card"><div class="eyebrow">Vandaag</div><h2>Rustdag</h2><div class="meta">Geen data gevonden voor vandaag.</div></div>`;
  }

  function overrideRow() {
    return `<div class="override-row">
      <button class="chip-btn" id="btnSkip">Overslaan</button>
      <button class="chip-btn" id="btnMove">Verplaatsen</button>
      <button class="chip-btn" id="btnOtherWorkout">Andere training</button>
    </div>`;
  }

  function labelForPlan(plan) {
    if (plan.type === 'cardio') return 'Cardio';
    if (plan.type === 'strength' && plan.gymTemplate) return plan.gymTemplate.name;
    if (plan.type === 'kettlebell_only' && plan.kettlebell && plan.kettlebell.standard) return plan.kettlebell.standard.name;
    return 'Training';
  }

  function wireHero(plan, dateISO) {
    const timePick = App.$('#timePick');
    if (timePick) {
      timePick.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => {
          selectedTime = btn.dataset.t;
          timePick.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === btn));
        };
      });
    }

    const btnStart = App.$('#btnStart');
    if (btnStart) btnStart.onclick = () => {
      const day = plan.gymTemplate.day;
      const variants = Store.getGymTemplatesByDay(day);
      if (variants.length > 1) {
        App.openVariantPicker(dateISO, day, plan.gymTemplate.name);
      } else {
        App.navigate('workout', [plan.gymTemplate.id, '', dateISO]);
      }
    };

    const btnStartKB = App.$('#btnStartKB');
    if (btnStartKB) btnStartKB.onclick = () => {
      const tpl = plan.kettlebell.standard;
      App.navigate('kettlebell', [tpl.id]);
    };

    const btnCardio = App.$('#btnStartCardio');
    if (btnCardio) btnCardio.onclick = () => App.navigate('cardio-log', [dateISO]);

    const btnAnyway = App.$('#btnAnyway');
    if (btnAnyway) btnAnyway.onclick = () => App.openAdHocPicker(dateISO);
    const btnOtherWorkout = App.$('#btnOtherWorkout');
    if (btnOtherWorkout) btnOtherWorkout.onclick = () => App.openAdHocPicker(dateISO);

    const btnSkip = App.$('#btnSkip');
    if (btnSkip) btnSkip.onclick = async () => {
      const ok = await App.confirm('Training van vandaag overslaan?', { okLabel: 'Overslaan' });
      if (ok) { await Store.skipWorkout(dateISO, 'Overgeslagen'); App.showToast('Training overgeslagen'); App.screens.today(); }
    };
    const btnMove = App.$('#btnMove');
    if (btnMove) btnMove.onclick = () => openMoveSheet(dateISO, plan);

    const btnViewSummary = App.$('#btnViewSummary');
    if (btnViewSummary) btnViewSummary.onclick = async () => {
      const sessions = await Store.getSessionsForDate(dateISO);
      if (sessions[0]) App.navigate('summary', [sessions[0].id]);
    };
    const btnLogAnother = App.$('#btnLogAnother');
    if (btnLogAnother) btnLogAnother.onclick = () => App.openAdHocPicker(dateISO);
  }

  function openMoveSheet(dateISO, plan) {
    const options = [1, 2, 3, 4, 5].map(n => Utils.addDays(dateISO, n));
    App.openSheet(`
      <h3>Verplaats training</h3>
      <p class="text-muted text-sm mt-8">Kies een nieuwe dag voor "${App.esc(labelForPlan(plan))}".</p>
      <div class="card mt-16">
        ${options.map(d => `<div class="list-row" data-d="${d}" style="cursor:pointer;">
          <div class="l-title">${Utils.formatDateLong(d)}</div><div class="l-val">›</div>
        </div>`).join('')}
      </div>
    `);
    App.$$('.list-row[data-d]').forEach(row => row.onclick = async () => {
      await Store.moveWorkout(dateISO, row.dataset.d);
      App.closeSheet();
      App.showToast('Training verplaatst');
      App.screens.today();
    });
  }

  function getRecentRecords() {
    const all = Store.getAllRecords();
    const cutoff = Utils.addDays(Utils.todayISO(), -7);
    const out = [];
    all.forEach(r => {
      if (r.maxWeight && r.maxWeight.date >= cutoff) out.push({ exerciseId: r.exerciseId, type: 'maxWeight', value: r.maxWeight.value, date: r.maxWeight.date });
      if (r.maxVolumeSession && r.maxVolumeSession.date >= cutoff) out.push({ exerciseId: r.exerciseId, type: 'maxVolumeSession', value: r.maxVolumeSession.value, date: r.maxVolumeSession.date });
    });
    out.sort((a, b) => b.date.localeCompare(a.date));
    return out.slice(0, 3);
  }

  function motivationalText(weekSum, streak) {
    if (weekSum.complete) return 'Weekdoel gehaald — Push · Pull · Legs · KB Upper · KB Lower ✓';
    if (streak >= 5) return 'Mooie consistentie deze week.';
    if (weekSum.strengthDone === 0) return 'Eerste sessie van de week — gewoon beginnen.';
    if (weekSum.strengthDone >= 3) return 'Goed bezig. Nog ' + (5 - weekSum.strengthDone) + ' sessie(s) te gaan.';
    return 'Stap voor stap. Elke sessie telt.';
  }

  // ---------------------------------------------------------------- more
  App.screens.more = function () {
    const settings = Store.getSettings();
    App.render(`
      <div class="screen">
        <div class="topbar"><h1>Meer</h1></div>
        <div class="card" style="padding:4px 12px;">
          ${moreRow('exercises', 'Oefeningenbibliotheek', 'Bekijk en bewerk oefeningen')}
          ${moreRow('measurements', 'Lichaamsmaten & gewicht', 'Meetgeschiedenis')}
          ${moreRow('schedule', 'Trainingsschema', 'Dagen en volgorde aanpassen')}
          ${moreRow('settings', 'Instellingen', 'Profiel, eenheden, materiaal')}
          ${moreRow('dataio', 'Export & import', 'Back-up van al je data')}
        </div>
        <p class="text-muted text-sm" style="text-align:center;margin-top:24px;">${App.esc(settings.name || '')} · IJzer v2.0</p>
      </div>
    `);
    App.$$('.list-row[data-route]').forEach(row => row.onclick = () => App.navigate(row.dataset.route));
  };

  function moreRow(route, title, sub) {
    return `<div class="list-row" data-route="${route}" style="cursor:pointer;">
      <div><div class="l-title">${title}</div><div class="l-sub">${sub}</div></div>
      <div class="l-val" style="color:var(--text-faint);">›</div>
    </div>`;
  }
})();
