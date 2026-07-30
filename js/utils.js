/* ============================================================
   utils.js — shared helpers, no dependencies
   ============================================================ */

const Utils = (() => {

  function uid(prefix) {
    return (prefix ? prefix + '_' : '') + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
  }

  function todayISO() {
    return dateISO(new Date());
  }

  function dateISO(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function parseISO(s) {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function addDays(iso, n) {
    const d = parseISO(iso);
    d.setDate(d.getDate() + n);
    return dateISO(d);
  }

  // 0 = Monday ... 6 = Sunday (ISO weekday index, matches our schedule model)
  function isoWeekday(iso) {
    const jsDay = parseISO(iso).getDay(); // 0=Sun..6=Sat
    return (jsDay + 6) % 7;
  }

  function startOfWeek(iso) {
    return addDays(iso, -isoWeekday(iso));
  }

  function formatDateLong(iso, locale = 'nl-BE') {
    const d = parseISO(iso);
    return d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
  }

  function formatDateShort(iso, locale = 'nl-BE') {
    const d = parseISO(iso);
    return d.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  }

  function epley1RM(weight, reps) {
    if (!weight || !reps) return 0;
    return weight * (1 + reps / 30);
  }

  function round1(n) {
    return Math.round(n * 10) / 10;
  }

  function fmtKg(n) {
    if (n === null || n === undefined || isNaN(n)) return '–';
    return (Math.round(n * 10) / 10).toString().replace('.', ',') + ' kg';
  }

  function fmtNum(n, decimals = 1) {
    if (n === null || n === undefined || isNaN(n)) return '–';
    return n.toFixed(decimals).replace('.', ',');
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  function fmtDuration(sec) {
    sec = Math.round(sec);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function fmtDurationLong(sec) {
    const m = Math.round(sec / 60);
    if (m < 60) return `${m} min`;
    const h = Math.floor(m / 60);
    const rem = m % 60;
    return rem ? `${h} u ${rem} min` : `${h} u`;
  }

  function weekKey(iso) {
    return startOfWeek(iso);
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  return {
    uid, todayISO, dateISO, parseISO, addDays, isoWeekday, startOfWeek,
    formatDateLong, formatDateShort, epley1RM, round1, fmtKg, fmtNum,
    clamp, debounce, fmtDuration, fmtDurationLong, weekKey, escapeHtml
  };
})();
