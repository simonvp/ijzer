/* ============================================================
   app-settings.js — settings, exercise library, schedule, data io
   ============================================================ */

(() => {
  // ------------------------------------------------------------- settings
  App.screens.settings = function () {
    const s = Store.getSettings();
    App.render(`
      <div class="screen">
        <div class="topbar">
          <button class="icon-btn" id="btnBack"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
          <h1 style="font-size:19px;">Instellingen</h1>
        </div>

        <div class="section-title">Profiel</div>
        <div class="card">
          <div class="field"><label>Naam</label><input id="sName" value="${App.esc(s.name || '')}"></div>
          <div class="field-row">
            <div class="field"><label>Lengte (cm)</label><input id="sHeight" type="number" value="${s.heightCm || ''}"></div>
            <div class="field"><label>Doelgewicht (kg)</label><input id="sGoalW" type="number" step="0.1" value="${s.goalWeightKg || ''}"></div>
          </div>
        </div>

        <div class="section-title">Eenheden</div>
        <div class="card">
          <div class="settings-row"><span class="s-label">Gewicht</span>
            <select id="sWeightUnit" style="width:auto;"><option value="kg" ${s.weightUnit === 'kg' ? 'selected' : ''}>kg</option><option value="lb" ${s.weightUnit === 'lb' ? 'selected' : ''}>lb</option></select>
          </div>
          <div class="settings-row"><span class="s-label">Afstand</span>
            <select id="sDistUnit" style="width:auto;"><option value="km" ${s.distanceUnit === 'km' ? 'selected' : ''}>km</option><option value="miles" ${s.distanceUnit === 'miles' ? 'selected' : ''}>miles</option></select>
          </div>
          <div class="settings-row"><span class="s-label">Eerste dag van de week</span>
            <select id="sFirstDay" style="width:auto;"><option value="mon" ${s.firstDayOfWeek === 'mon' ? 'selected' : ''}>Maandag</option><option value="sun" ${s.firstDayOfWeek === 'sun' ? 'selected' : ''}>Zondag</option></select>
          </div>
        </div>

        <div class="section-title">Training</div>
        <div class="card">
          <div class="field"><label>Standaard gymduur (min)</label><input id="sGymDur" type="number" value="${s.defaultGymDurationMin || 60}"></div>
          <div class="field"><label>Standaard kettlebellgewicht (kg)</label><input id="sKbWeight" type="number" value="${s.defaultKettlebellWeight || 12}"></div>
          <div class="field"><label>Beschikbare kettlebells (komma-gescheiden, kg)</label><input id="sKettlebells" value="${(s.kettlebells || [12, 16]).join(', ')}"></div>
          <div class="field">
            <label>Cardiofavoriet</label>
            <select id="sCardioFav">
              ${['fietsen', 'indoor cycling', 'spinning', 'zwemmen', 'rustig lopen', 'wandelen met helling', 'vrije cardio'].map(o => `<option value="${o}" ${s.cardioFavorite === o ? 'selected' : ''}>${cap(o)}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="section-title">Materiaal</div>
        <div class="card">
          <div class="field"><label>Beschikbare dumbbellstappen (kg)</label><input id="sDumbbells" value="${(s.dumbbellSteps || []).join(', ')}"></div>
          <div class="field"><label>Beschikbare halterschijven (kg)</label><input id="sPlates" value="${(s.plateSteps || []).join(', ')}"></div>
          <div class="field"><label>Machinegewichtstap (kg)</label><input id="sMachineStep" type="number" value="${s.machineStep || 5}"></div>
        </div>

        <div class="section-title">Weergave</div>
        <div class="card">
          <div class="settings-row"><span class="s-label">Dark mode</span>
            <label class="switch"><input type="checkbox" id="sDark" ${s.darkMode ? 'checked' : ''}><span class="track"></span></label>
          </div>
          <div class="settings-row"><span class="s-label">Foto's standaard verborgen</span>
            <label class="switch"><input type="checkbox" id="sPhotosHidden" ${s.photosHiddenByDefault ? 'checked' : ''}><span class="track"></span></label>
          </div>
        </div>

        <button class="btn primary block mt-20" id="btnSaveSettings" style="padding:14px;">Instellingen opslaan</button>
        <button class="btn block mt-8" id="btnWipe" style="color:var(--danger);">Alle data wissen</button>
      </div>
    `);
    App.$('#btnBack').onclick = () => App.navigate('more');
    App.$('#sDark').addEventListener('change', (e) => {
      Store.updateSettings({ darkMode: e.target.checked }).then(App.applyTheme);
    });
    App.$('#btnSaveSettings').onclick = async () => {
      await Store.updateSettings({
        name: App.$('#sName').value.trim(),
        heightCm: parseFloat(App.$('#sHeight').value) || null,
        goalWeightKg: parseFloat(App.$('#sGoalW').value) || null,
        weightUnit: App.$('#sWeightUnit').value,
        distanceUnit: App.$('#sDistUnit').value,
        firstDayOfWeek: App.$('#sFirstDay').value,
        defaultGymDurationMin: parseInt(App.$('#sGymDur').value) || 60,
        defaultKettlebellWeight: parseFloat(App.$('#sKbWeight').value) || 12,
        kettlebells: App.$('#sKettlebells').value.split(',').map(x => parseFloat(x.trim())).filter(Boolean),
        cardioFavorite: App.$('#sCardioFav').value,
        dumbbellSteps: App.$('#sDumbbells').value.split(',').map(x => parseFloat(x.trim())).filter(Boolean),
        plateSteps: App.$('#sPlates').value.split(',').map(x => parseFloat(x.trim())).filter(Boolean),
        machineStep: parseFloat(App.$('#sMachineStep').value) || 5,
        photosHiddenByDefault: App.$('#sPhotosHidden').checked,
      });
      App.showToast('Instellingen opgeslagen');
    };
    App.$('#btnWipe').onclick = async () => {
      const ok = await App.confirm('Alle trainingsdata, foto\'s en instellingen wissen? Dit kan niet ongedaan gemaakt worden.', { danger: true, okLabel: 'Alles wissen' });
      if (ok) {
        await Store.wipeAll();
        App.showToast('Alle data gewist');
        App.navigate('onboarding');
      }
    };
  };

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // ----------------------------------------------------------- exercises
  let exFilter = 'actief';

  App.screens.exercises = function () {
    const all = Store.getAllExercises();
    const filtered = exFilter === 'alle' ? all : all.filter(e => e.status === exFilter);
    App.render(`
      <div class="screen">
        <div class="topbar">
          <button class="icon-btn" id="btnBack"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
          <h1 style="font-size:19px;">Oefeningen</h1>
          <button class="icon-btn" id="btnAddEx"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></button>
        </div>
        <div class="chip-row">
          ${['actief', 'alternatief', 'gearchiveerd', 'alle'].map(k => `<button class="chip ${exFilter === k ? 'active' : ''}" data-f="${k}">${cap(k)}</button>`).join('')}
        </div>
        <div class="card mt-12">
          ${filtered.map(e => `<div class="list-row" data-exid="${e.id}" style="cursor:pointer;">
            <div><div class="l-title">${App.esc(e.name)}</div><div class="l-sub">${e.primaryMuscle} · ${e.location === 'gym' ? 'Gym' : e.location === 'thuis' ? 'Thuis' : 'Beide'}</div></div>
            <div class="l-val" style="color:var(--text-faint);">›</div>
          </div>`).join('')}
        </div>
      </div>
    `);
    App.$('#btnBack').onclick = () => App.navigate('more');
    App.$('#btnAddEx').onclick = () => openExerciseEditor(null);
    App.$$('.chip[data-f]').forEach(c => c.onclick = () => { exFilter = c.dataset.f; App.screens.exercises(); });
    App.$$('.list-row[data-exid]').forEach(row => row.onclick = () => openExerciseEditor(row.dataset.exid));
  };

  function openExerciseEditor(id) {
    const ex = id ? Store.getExercise(id) : {
      id: Utils.uid('ex'), name: '', category: '', primaryMuscle: '', secondaryMuscles: [],
      equipment: '', location: 'gym', type: 'compound', weightUnit: 'per_dumbbell',
      defaultReps: '8-12', instructions: '', cues: '', mistakes: '', status: 'actief', alternatives: [],
    };
    App.openSheet(`
      <h3>${id ? 'Oefening bewerken' : 'Nieuwe oefening'}</h3>
      <div class="field mt-16"><label>Naam</label><input id="eName" value="${App.esc(ex.name)}"></div>
      <div class="field-row">
        <div class="field"><label>Categorie</label><input id="eCat" value="${App.esc(ex.category || '')}"></div>
        <div class="field"><label>Primaire spiergroep</label><input id="eMuscle" value="${App.esc(ex.primaryMuscle || '')}"></div>
      </div>
      <div class="field"><label>Materiaal</label><input id="eEquip" value="${App.esc(ex.equipment || '')}"></div>
      <div class="field-row">
        <div class="field"><label>Locatie</label>
          <select id="eLoc"><option value="gym" ${ex.location === 'gym' ? 'selected' : ''}>Gym</option><option value="thuis" ${ex.location === 'thuis' ? 'selected' : ''}>Thuis</option><option value="beide" ${ex.location === 'beide' ? 'selected' : ''}>Beide</option></select>
        </div>
        <div class="field"><label>Gewichtsregistratie</label>
          <select id="eWeightUnit">
            <option value="per_dumbbell" ${ex.weightUnit === 'per_dumbbell' ? 'selected' : ''}>Per dumbbell</option>
            <option value="totaal" ${ex.weightUnit === 'totaal' ? 'selected' : ''}>Totaal</option>
            <option value="barbell" ${ex.weightUnit === 'barbell' ? 'selected' : ''}>Barbell</option>
            <option value="machine" ${ex.weightUnit === 'machine' ? 'selected' : ''}>Machine</option>
            <option value="kettlebell" ${ex.weightUnit === 'kettlebell' ? 'selected' : ''}>Kettlebell</option>
            <option value="bodyweight" ${ex.weightUnit === 'bodyweight' ? 'selected' : ''}>Lichaamsgewicht</option>
          </select>
        </div>
      </div>
      <div class="field"><label>Standaard rep range</label><input id="eReps" value="${App.esc(ex.defaultReps || '')}"></div>
      <div class="field"><label>Instructies</label><textarea id="eInstr" rows="2">${App.esc(ex.instructions || '')}</textarea></div>
      <div class="field"><label>Cues</label><textarea id="eCues" rows="2">${App.esc(ex.cues || '')}</textarea></div>
      <div class="field"><label>Veelgemaakte fouten</label><textarea id="eMistakes" rows="2">${App.esc(ex.mistakes || '')}</textarea></div>
      <div class="field"><label>Status</label>
        <select id="eStatus">
          <option value="actief" ${ex.status === 'actief' ? 'selected' : ''}>Actief</option>
          <option value="alternatief" ${ex.status === 'alternatief' ? 'selected' : ''}>Alternatief</option>
          <option value="gearchiveerd" ${ex.status === 'gearchiveerd' ? 'selected' : ''}>Gearchiveerd</option>
        </select>
      </div>
      <button class="btn primary block" id="btnSaveEx">Opslaan</button>
    `);
    App.$('#btnSaveEx').onclick = async () => {
      const updated = {
        ...ex,
        name: App.$('#eName').value.trim(),
        category: App.$('#eCat').value.trim(),
        primaryMuscle: App.$('#eMuscle').value.trim(),
        equipment: App.$('#eEquip').value.trim(),
        location: App.$('#eLoc').value,
        weightUnit: App.$('#eWeightUnit').value,
        defaultReps: App.$('#eReps').value.trim(),
        instructions: App.$('#eInstr').value.trim(),
        cues: App.$('#eCues').value.trim(),
        mistakes: App.$('#eMistakes').value.trim(),
        status: App.$('#eStatus').value,
      };
      if (!updated.name) { App.showToast('Naam is verplicht'); return; }
      await Store.saveExercise(updated);
      App.closeSheet();
      App.screens.exercises();
      App.showToast('Oefening opgeslagen');
    };
  }

  // ------------------------------------------------------------- schedule
  App.screens.schedule = function () {
    const sched = Store.getSchedule();
    const dayLabels = { mon: 'Maandag', tue: 'Dinsdag', wed: 'Woensdag', thu: 'Donderdag', fri: 'Vrijdag', sat: 'Zaterdag', sun: 'Zondag' };
    const opts = [
      ['upperA', 'Upper A'], ['lowerA', 'Lower A'], ['upperB', 'Upper B'], ['lowerB', 'Lower B'],
      ['cardio', 'Cardio'], ['rest', 'Rust'],
    ];
    App.render(`
      <div class="screen">
        <div class="topbar">
          <button class="icon-btn" id="btnBack"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
          <h1 style="font-size:19px;">Trainingsschema</h1>
        </div>
        <p class="text-muted text-sm">Pas je standaardweek aan. Eenmalige wijzigingen kan je per dag doen via de kalender.</p>
        <div class="card mt-12">
          ${Store.DAY_KEYS.map(dk => `
            <div class="settings-row">
              <span class="s-label">${dayLabels[dk]}</span>
              <select data-day="${dk}" style="width:auto;">
                ${opts.map(([k, l]) => `<option value="${k}" ${sched.days[dk] === k ? 'selected' : ''}>${l}</option>`).join('')}
              </select>
            </div>`).join('')}
        </div>
        <button class="btn primary block mt-16" id="btnSaveSched">Schema opslaan</button>
      </div>
    `);
    App.$('#btnBack').onclick = () => App.navigate('more');
    App.$('#btnSaveSched').onclick = async () => {
      const days = {};
      App.$$('select[data-day]').forEach(sel => { days[sel.dataset.day] = sel.value; });
      await Store.updateSchedule({ days });
      App.showToast('Schema opgeslagen');
      App.navigate('more');
    };
  };

  // ------------------------------------------------------------- data io
  App.screens.dataio = function () {
    App.render(`
      <div class="screen">
        <div class="topbar">
          <button class="icon-btn" id="btnBack"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
          <h1 style="font-size:19px;">Export &amp; import</h1>
        </div>
        <div class="card">
          <p class="text-sm">Exporteer al je data — workouts, gewicht, metingen en foto's — als één JSON-bestand. Handig als back-up of om over te zetten naar een ander toestel.</p>
          <button class="btn primary block mt-16" id="btnExport">Exporteer alle data</button>
        </div>
        <div class="card mt-12">
          <p class="text-sm">Importeren overschrijft alle huidige data in deze app.</p>
          <button class="btn block mt-16" id="btnImport">Importeer bestand</button>
          <input type="file" id="importFile" accept="application/json" style="display:none;">
        </div>
      </div>
    `);
    App.$('#btnBack').onclick = () => App.navigate('more');
    App.$('#btnExport').onclick = async () => {
      App.showToast('Data wordt voorbereid…');
      const data = await Store.exportAll();
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ijzer-export-${Utils.todayISO()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    };
    App.$('#btnImport').onclick = () => App.$('#importFile').click();
    App.$('#importFile').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const ok = await App.confirm('Huidige data overschrijven met dit bestand?', { danger: true, okLabel: 'Importeren' });
      if (!ok) { e.target.value = ''; return; }
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        await Store.importAll(data);
        App.applyTheme();
        App.showToast('Import voltooid');
        App.navigate('today');
      } catch (err) {
        App.showToast('Kon bestand niet importeren');
      }
    });
  };
})();
