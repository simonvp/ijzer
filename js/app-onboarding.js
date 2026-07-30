/* ============================================================
   app-onboarding.js — short 5-step onboarding
   ============================================================ */

(() => {
  let ob = {};

  App.screens.onboarding = function () {
    const s = Store.getSettings();
    ob = {
      name: s.name, heightCm: s.heightCm, startWeightKg: s.startWeightKg,
      days: { ...Store.getSchedule().days },
      equipment: { gym: true, kb6: true, kb12: true, mat: true, bands: false },
      goal: s.goal || 'spiermassa',
    };
    renderStep(1);
  };

  function shell(step, total, innerHtml) {
    const dots = Array.from({ length: total }).map((_, i) =>
      `<span class="${i < step ? 'done' : ''}"></span>`).join('');
    App.render(`
      <div class="onboard-wrap">
        <div class="onboard-progress">${dots}</div>
        <div class="onboard-step">${innerHtml}</div>
      </div>
    `);
  }

  function renderStep(step) {
    if (step === 1) {
      shell(1, 5, `
        <h2>Welkom</h2>
        <p class="hint">Even je basisgegevens, zodat we alles goed instellen.</p>
        <div class="field"><label>Naam</label><input id="obName" value="${App.esc(ob.name || '')}"></div>
        <div class="field-row">
          <div class="field"><label>Lengte (cm)</label><input id="obHeight" type="number" value="${ob.heightCm || ''}"></div>
          <div class="field"><label>Gewicht (kg)</label><input id="obWeight" type="number" step="0.1" value="${ob.startWeightKg || ''}"></div>
        </div>
        <button class="btn primary block mt-16" id="obNext">Volgende</button>
      `);
      App.$('#obNext').onclick = () => {
        ob.name = App.$('#obName').value.trim() || 'Sporter';
        ob.heightCm = parseFloat(App.$('#obHeight').value) || null;
        ob.startWeightKg = parseFloat(App.$('#obWeight').value) || null;
        renderStep(2);
      };
    }

    if (step === 2) {
      const dayLabels = { mon: 'Ma', tue: 'Di', wed: 'Wo', thu: 'Do', fri: 'Vr', sat: 'Za', zon: 'Zo', sun: 'Zo' };
      shell(2, 5, `
        <h2>Trainingsdagen</h2>
        <p class="hint">Dit is het standaardschema — je kan het later altijd aanpassen.</p>
        <div class="card">
          ${Store.DAY_KEYS.map(dk => `
            <div class="settings-row">
              <span class="s-label">${dayLabels[dk]}</span>
              <span class="s-val">${labelForWorkoutKey(ob.days[dk])}</span>
            </div>`).join('')}
        </div>
        <p class="text-muted text-sm mt-12">Aanpasbaar via Meer → Schema.</p>
        <button class="btn primary block mt-16" id="obNext2">Volgende</button>
      `);
      App.$('#obNext2').onclick = () => renderStep(3);
    }

    if (step === 3) {
      shell(3, 5, `
        <h2>Beschikbaar materiaal</h2>
        <p class="hint">Wat heb je thuis en in de gym?</p>
        <div class="choice-grid">
          ${equipCard('gym', 'Gym-toegang', 'Losse gewichten, machines')}
          ${equipCard('kb6', 'Kettlebell 6 kg', 'Thuis')}
          ${equipCard('kb12', 'Kettlebell 12 kg', 'Thuis')}
          ${equipCard('mat', 'Fitnessmat', 'Thuis')}
          ${equipCard('bands', 'Weerstandsbanden', 'Optioneel')}
        </div>
        <p class="text-muted text-sm mt-12">Ander gewicht? Voeg dat later toe via Instellingen → Materiaal.</p>
        <button class="btn primary block mt-20" id="obNext3">Volgende</button>
      `);
      App.$$('.choice-card').forEach(c => c.onclick = () => {
        const k = c.dataset.k;
        ob.equipment[k] = !ob.equipment[k];
        c.classList.toggle('selected', ob.equipment[k]);
      });
      App.$('#obNext3').onclick = () => renderStep(4);
    }

    if (step === 4) {
      const goals = [
        { k: 'spiermassa', t: 'Spiermassa', s: 'Hypertrofie-focus' },
        { k: 'kracht', t: 'Kracht', s: 'Progressieve overload' },
        { k: 'conditie', t: 'Conditie behouden', s: 'Onderhoud naast cardio' },
      ];
      shell(4, 5, `
        <h2>Hoofddoel</h2>
        <p class="hint">Bepaalt de toon van suggesties na elke training.</p>
        <div class="choice-grid">
          ${goals.map(g => `
            <div class="choice-card ${ob.goal === g.k ? 'selected' : ''}" data-g="${g.k}">
              <div class="c-title">${g.t}</div><div class="c-sub">${g.s}</div>
            </div>`).join('')}
        </div>
        <button class="btn primary block mt-20" id="obNext4">Volgende</button>
      `);
      App.$$('.choice-card').forEach(c => c.onclick = () => {
        ob.goal = c.dataset.g;
        App.$$('.choice-card').forEach(x => x.classList.toggle('selected', x.dataset.g === ob.goal));
      });
      App.$('#obNext4').onclick = () => renderStep(5);
    }

    if (step === 5) {
      shell(5, 5, `
        <h2>Klaar</h2>
        <p class="hint">Optioneel: een startfoto en -meting kan je later toevoegen via Foto's en Lichaamsmaten.</p>
        <div class="card">
          <p><strong>${App.esc(ob.name)}</strong></p>
          <p class="text-muted text-sm mt-8">${ob.heightCm ? ob.heightCm + ' cm · ' : ''}${ob.startWeightKg ? ob.startWeightKg + ' kg' : ''}</p>
        </div>
        <button class="btn primary block mt-20" id="obFinish">Start met trainen</button>
      `);
      App.$('#obFinish').onclick = async () => {
        const kbList = [ob.equipment.kb6 ? 6 : null, ob.equipment.kb12 ? 12 : null].filter(Boolean);
        await Store.updateSettings({
          name: ob.name, heightCm: ob.heightCm, startWeightKg: ob.startWeightKg,
          goal: ob.goal, kettlebells: kbList.length ? kbList : [12],
        });
        if (ob.startWeightKg) {
          await Store.addBodyweight({ date: Utils.todayISO(), weight: ob.startWeightKg, fasted: false, note: 'Startgewicht' });
        }
        await Store.updateMeta({ onboardingDone: true });
        App.applyTheme();
        App.navigate('today');
      };
    }
  }

  function equipCard(key, title, sub) {
    const on = ob.equipment[key];
    return `<div class="choice-card ${on ? 'selected' : ''}" data-k="${key}">
      <div class="c-title">${title}</div><div class="c-sub">${sub}</div>
    </div>`;
  }

  function labelForWorkoutKey(k) {
    const map = { upperA: 'Upper A', lowerA: 'Lower A', upperB: 'Upper B', lowerB: 'Lower B', cardio: 'Cardio', rest: 'Rust' };
    return map[k] || 'Rust';
  }
})();
