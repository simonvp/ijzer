/* ============================================================
   app-photos.js — progress photo upload, grid, compare, slider
   ============================================================ */

(() => {
  let angleFilter = 'alle';
  let compareMode = false;
  let compareSel = [];

  const ANGLES = ['voorkant', 'zijkant links', 'zijkant rechts', 'achterkant', 'vrij'];

  App.screens.photos = async function () {
    const all = await Store.getAllPhotos();
    const filtered = angleFilter === 'alle' ? all : all.filter(p => p.angle === angleFilter);

    App.render(`
      <div class="screen">
        <div class="topbar">
          <h1>Foto's</h1>
          <button class="icon-btn" id="btnUpload">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
        <p class="text-muted text-sm">Foto's blijven volledig lokaal op dit toestel opgeslagen (IndexedDB) en worden nooit verzonden.</p>
        <div class="chip-row mt-12">
          <button class="chip ${angleFilter === 'alle' ? 'active' : ''}" data-angle="alle">Alle</button>
          ${ANGLES.map(a => `<button class="chip ${angleFilter === a ? 'active' : ''}" data-angle="${a}">${cap(a)}</button>`).join('')}
        </div>
        <div class="btn-row mt-12">
          <button class="btn sm ${compareMode ? 'primary' : ''}" id="btnCompareToggle">${compareMode ? 'Klaar met vergelijken' : 'Vergelijk foto\'s'}</button>
        </div>
        ${compareMode ? compareArea() : ''}
        <div class="photo-grid mt-12" id="photoGrid">
          ${filtered.length ? filtered.map(p => photoThumb(p)).join('') : ''}
        </div>
        ${!filtered.length ? `<div class="empty-state"><h4>Nog geen foto's</h4><p>Voeg je eerste voortgangsfoto toe.</p></div>` : ''}
        <input type="file" id="fileInput" accept="image/*" style="display:none;">
      </div>
    `);

    App.$('#btnUpload').onclick = () => App.$('#fileInput').click();
    App.$('#fileInput').addEventListener('change', handleUpload);
    App.$$('.chip[data-angle]').forEach(c => c.onclick = () => { angleFilter = c.dataset.angle; App.screens.photos(); });
    App.$('#btnCompareToggle').onclick = () => { compareMode = !compareMode; compareSel = []; App.screens.photos(); };

    App.$$('.photo-thumb[data-id]').forEach(el => {
      el.onclick = () => {
        if (compareMode) toggleCompareSelect(el.dataset.id, filtered);
        else openPhotoDetail(el.dataset.id, filtered);
      };
    });
  };

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function photoThumb(p) {
    const selected = compareSel.includes(p.id);
    return `
      <div class="photo-thumb" data-id="${p.id}" style="${selected ? 'outline:2px solid var(--accent);' : ''}">
        <img src="${p.dataUrl}" alt="">
        <div class="p-meta">${Utils.formatDateShort(p.date)}${p.weight ? ' · ' + Utils.fmtKg(p.weight) : ''}</div>
      </div>`;
  }

  function compareArea() {
    if (compareSel.length < 2) {
      return `<p class="text-muted text-sm mt-8">Selecteer twee foto's om te vergelijken (${compareSel.length}/2).</p>`;
    }
    return `<div class="text-muted text-sm mt-8">Vergelijking klaar — bekijk hieronder.</div>`;
  }

  function toggleCompareSelect(id, filtered) {
    if (compareSel.includes(id)) compareSel = compareSel.filter(x => x !== id);
    else {
      compareSel.push(id);
      if (compareSel.length > 2) compareSel.shift();
    }
    if (compareSel.length === 2) {
      openCompareView(filtered);
    } else {
      App.screens.photos();
    }
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    openUploadMetaSheet(dataUrl);
    e.target.value = '';
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  function openUploadMetaSheet(dataUrl) {
    App.openSheet(`
      <h3>Foto toevoegen</h3>
      <div style="border-radius:12px;overflow:hidden;margin:12px 0;max-height:220px;"><img src="${dataUrl}" style="width:100%;display:block;object-fit:cover;"></div>
      <div class="field"><label>Datum</label><input id="pDate" type="date" value="${Utils.todayISO()}"></div>
      <div class="field">
        <label>Hoek</label>
        <select id="pAngle">${ANGLES.map(a => `<option value="${a}">${cap(a)}</option>`).join('')}</select>
      </div>
      <div class="field"><label>Lichaamsgewicht (kg, optioneel)</label><input id="pWeight" type="number" step="0.1"></div>
      <div class="field"><label>Label (optioneel)</label><input id="pLabel" placeholder="bv. start, week 8"></div>
      <div class="field"><label>Notitie</label><input id="pNote"></div>
      <button class="btn primary block" id="btnSavePhoto">Opslaan</button>
    `);
    App.$('#btnSavePhoto').onclick = async () => {
      await Store.addPhoto({
        date: App.$('#pDate').value || Utils.todayISO(),
        angle: App.$('#pAngle').value,
        weight: parseFloat(App.$('#pWeight').value) || null,
        label: App.$('#pLabel').value,
        note: App.$('#pNote').value,
        dataUrl,
      });
      App.closeSheet();
      App.showToast('Foto opgeslagen');
      App.screens.photos();
    };
  }

  function openPhotoDetail(id, filtered) {
    const p = filtered.find(x => x.id === id);
    if (!p) return;
    App.openSheet(`
      <div style="border-radius:14px;overflow:hidden;"><img src="${p.dataUrl}" style="width:100%;display:block;"></div>
      <div class="mt-16">
        <div class="l-title">${Utils.formatDateLong(p.date)}</div>
        <div class="l-sub">${cap(p.angle || '')}${p.weight ? ' · ' + Utils.fmtKg(p.weight) : ''}${p.label ? ' · ' + App.esc(p.label) : ''}</div>
        ${p.note ? `<p class="mt-8 text-sm">${App.esc(p.note)}</p>` : ''}
      </div>
      <button class="btn danger block mt-16" id="btnDelPhoto">Foto verwijderen</button>
    `);
    App.$('#btnDelPhoto').onclick = async () => {
      const ok = await App.confirm('Deze foto definitief verwijderen?', { danger: true, okLabel: 'Verwijderen' });
      if (ok) { await Store.deletePhoto(p.id); App.closeSheet(); App.screens.photos(); }
    };
  }

  function openCompareView(filtered) {
    const [a, b] = compareSel.map(id => filtered.find(p => p.id === id)).filter(Boolean);
    if (!a || !b) return;
    const ordered = a.date <= b.date ? [a, b] : [b, a];
    App.openSheet(`
      <h3>Vergelijken</h3>
      <div class="compare-wrap">
        <div class="compare-slot"><img src="${ordered[0].dataUrl}"></div>
        <div class="compare-slot"><img src="${ordered[1].dataUrl}"></div>
      </div>
      <div class="flex-between text-sm text-muted mt-8">
        <span>${Utils.formatDateShort(ordered[0].date)}${ordered[0].weight ? ' · ' + Utils.fmtKg(ordered[0].weight) : ''}</span>
        <span>${Utils.formatDateShort(ordered[1].date)}${ordered[1].weight ? ' · ' + Utils.fmtKg(ordered[1].weight) : ''}</span>
      </div>
      <div class="section-title">Before / After slider</div>
      <div class="slider-wrap" id="sliderWrap">
        <img src="${ordered[0].dataUrl}">
        <img src="${ordered[1].dataUrl}" class="after-clip" id="afterImg">
      </div>
      <input type="range" min="0" max="100" value="50" id="sliderRange" class="mt-12" style="width:100%;">
    `, { onClose: () => { compareSel = []; App.screens.photos(); } });

    App.$('#sliderRange').addEventListener('input', (e) => {
      App.$('#afterImg').style.clipPath = `inset(0 0 0 ${e.target.value}%)`;
    });
  }
})();
