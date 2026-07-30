/* ============================================================
   app-calendar.js — month calendar + day detail sheet
   ============================================================ */

(() => {
  let viewYear, viewMonth; // 0-indexed month

  App.screens.calendar = async function () {
    const today = Utils.parseISO(Utils.todayISO());
    if (viewYear === undefined) { viewYear = today.getFullYear(); viewMonth = today.getMonth(); }
    await renderMonth();
  };

  async function renderMonth() {
    const first = new Date(viewYear, viewMonth, 1);
    const last = new Date(viewYear, viewMonth + 1, 0);
    const startGrid = Utils.addDays(Utils.dateISO(first), -Utils.isoWeekday(Utils.dateISO(first)));
    const endGrid = Utils.addDays(Utils.dateISO(last), 6 - Utils.isoWeekday(Utils.dateISO(last)));

    const sessions = await Store.getSessionsInRange(startGrid, endGrid);
    const overrides = await Store.getOverridesInRange(startGrid, endGrid);
    const overrideMap = Object.fromEntries(overrides.map(o => [o.date, o]));
    const sessByDate = {};
    sessions.forEach(s => { (sessByDate[s.date] = sessByDate[s.date] || []).push(s); });

    const todayISO = Utils.todayISO();
    const cells = [];
    let d = startGrid;
    while (d <= endGrid) {
      cells.push(await buildCell(d, viewMonth, sessByDate[d] || [], overrideMap[d]));
      d = Utils.addDays(d, 1);
    }

    const monthLabel = first.toLocaleDateString('nl-BE', { month: 'long', year: 'numeric' });
    const dowLabels = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

    App.render(`
      <div class="screen">
        <div class="topbar">
          <h1 style="text-transform:capitalize;">${monthLabel}</h1>
          <div class="btn-row">
            <button class="icon-btn" id="prevMonth">‹</button>
            <button class="icon-btn" id="nextMonth">›</button>
          </div>
        </div>
        <div class="cal-grid">
          ${dowLabels.map(l => `<div class="cal-dow">${l}</div>`).join('')}
          ${cells.map(c => c.html).join('')}
        </div>
        <div class="legend">
          <span><span class="dot" style="background:var(--accent);"></span>Gym</span>
          <span><span class="dot" style="background:var(--success);"></span>Kettlebell</span>
          <span><span class="dot" style="background:var(--brass);"></span>Cardio</span>
          <span><span class="dot" style="background:var(--danger);"></span>Overgeslagen</span>
          <span><span class="dot" style="background:var(--text-faint);"></span>Gepland</span>
        </div>
      </div>
    `);

    App.$('#prevMonth').onclick = () => { viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } renderMonth(); };
    App.$('#nextMonth').onclick = () => { viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } renderMonth(); };
    App.$$('.cal-cell[data-date]').forEach(cell => cell.onclick = () => openDayDetail(cell.dataset.date));
  }

  async function buildCell(dateISO, currentMonth, sessions, override) {
    const isOtherMonth = Utils.parseISO(dateISO).getMonth() !== currentMonth;
    const isToday = dateISO === Utils.todayISO();
    const dayNum = Utils.parseISO(dateISO).getDate();

    let dots = [];
    const hasGym = sessions.some(s => s.type === 'gym' && (s.status === 'completed' || s.status === 'partial'));
    const hasKb = sessions.some(s => s.type === 'kettlebell' && (s.status === 'completed' || s.status === 'partial'));
    const hasCardio = sessions.some(s => s.type === 'cardio' && s.status === 'completed');
    if (hasGym) dots.push('done-gym');
    if (hasKb) dots.push('done-kb');
    if (hasCardio) dots.push('done-cardio');

    if (!dots.length) {
      if (override && override.skipped) {
        dots.push('skipped');
      } else {
        const plan = await Store.getPlanForDate(dateISO);
        if (plan.type !== 'rest') dots.push('planned');
      }
    }

    const html = `
      <div class="cal-cell ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}" data-date="${dateISO}">
        <div>${dayNum}</div>
        <div style="display:flex;gap:2px;">
          ${dots.map(cls => `<span class="dot ${cls}"></span>`).join('')}
        </div>
      </div>
    `;
    return { html };
  }

  async function openDayDetail(dateISO) {
    const plan = await Store.getPlanForDate(dateISO);
    const sessions = await Store.getSessionsForDate(dateISO);
    const label = planLabel(plan);

    App.openSheet(`
      <h3>${Utils.formatDateLong(dateISO)}</h3>
      <p class="text-muted text-sm mt-8">Gepland: ${App.esc(label)}${plan.overridden ? ' (aangepast)' : ''}</p>
      <div class="mt-16" id="sessionList">
        ${sessions.length ? sessions.map(s => sessionRow(s)).join('') : `<div class="empty-state" style="padding:20px 0;"><p>Nog geen sessies gelogd.</p></div>`}
      </div>
      <div class="btn-row mt-16">
        ${plan.type !== 'rest' && !sessions.length ? `<button class="btn primary block" id="btnLogThis">Loggen</button>` : ''}
        ${plan.type !== 'rest' && !sessions.length ? `<button class="btn block" id="btnSkipThis">Overslaan</button>` : ''}
      </div>
    `);

    App.$$('.list-row[data-sess]').forEach(row => {
      row.onclick = () => {
        App.closeSheet();
        App.navigate('summary', [row.dataset.sess]);
      };
    });
    App.$$('[data-del]').forEach(btn => btn.onclick = async (e) => {
      e.stopPropagation();
      const ok = await App.confirm('Deze sessie verwijderen?', { danger: true, okLabel: 'Verwijderen' });
      if (ok) { await Store.deleteSession(btn.dataset.del); App.closeSheet(); renderMonth(); App.showToast('Sessie verwijderd'); }
    });
    const btnLog = App.$('#btnLogThis');
    if (btnLog) btnLog.onclick = () => {
      App.closeSheet();
      if (plan.type === 'cardio') App.navigate('cardio-log', [dateISO]);
      else if (plan.type === 'strength') App.navigate('workout', [plan.gymTemplate.id]);
    };
    const btnSkip = App.$('#btnSkipThis');
    if (btnSkip) btnSkip.onclick = async () => {
      await Store.skipWorkout(dateISO, 'Overgeslagen');
      App.closeSheet();
      renderMonth();
    };
  }

  function sessionRow(s) {
    const typeLabel = s.type === 'gym' ? 'Gym' : s.type === 'kettlebell' ? 'Kettlebell' : 'Cardio';
    return `
      <div class="list-row" data-sess="${s.id}" style="cursor:pointer;">
        <div><div class="l-title">${App.esc(s.name || typeLabel)}</div><div class="l-sub">${typeLabel} · ${s.status === 'completed' ? 'Voltooid' : 'Gedeeltelijk'}</div></div>
        <button class="icon-btn" style="width:30px;height:30px;" data-del="${s.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6"/></svg>
        </button>
      </div>`;
  }

  function planLabel(plan) {
    if (plan.type === 'rest') return 'Rustdag';
    if (plan.type === 'cardio') return 'Cardio';
    if (plan.type === 'strength') return plan.gymTemplate.name;
    return '–';
  }
})();
