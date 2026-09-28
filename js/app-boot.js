/* ============================================================
   app-boot.js — application entry point
   ============================================================ */

(async function boot() {
  try {
    await Store.init();
  } catch (err) {
    console.error('Kon lokale database niet initialiseren', err);
    document.getElementById('screen-root').innerHTML = `
      <div class="screen">
        <div class="empty-state">
          <h4>Kon niet opstarten</h4>
          <p>Fout: <code style="font-size:12px;word-break:break-all;">${String(err && err.message ? err.message : err)}</code></p>
          <p style="margin-top:8px;font-size:13px;color:var(--text-muted);">Stack: <code style="font-size:11px;word-break:break-all;">${String(err && err.stack ? err.stack.split('\n').slice(0,3).join(' | ') : '')}</code></p>
          <p style="margin-top:12px;">Als dit een IndexedDB-fout is: probeer de app via een lokale server te openen in plaats van als bestand (file://), of gebruik een andere browser.</p>
        </div>
      </div>`;
    return;
  }

  App.applyTheme();

  const meta = await Store.getMeta();
  if (!meta.onboardingDone && !window.location.hash) {
    window.location.hash = '#/onboarding';
  }

  window.__renderRoute();

  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('sw.js');
    } catch (e) {
      // Offline support unavailable (e.g. running from file://); app still works online.
      console.warn('Service worker registratie mislukt:', e.message);
    }
  }
})();
