/* ============================================================
   store.js — business logic on top of DB + Seed
   ============================================================ */

const Store = (() => {
  const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  let cache = {
    settings: null,
    schedule: null,
    exercises: null,   // map id -> exercise
    gymTemplates: null, // map id -> template
    kbTemplates: null,  // map id -> template
    cardioTemplate: null,
    records: null,      // map exerciseId -> record
  };

  // ---------------------------------------------------------------- init
  async function init() {
    await DB.open();
    const settings = await DB.get('settings', 'app');
    if (!settings) {
      await seedAll();
    }
    await loadCache();
  }

  async function seedAll() {
    await DB.put('settings', Seed.defaultSettings);
    await DB.put('schedule', Seed.defaultSchedule);
    await DB.bulkPut('exercises', Seed.exercises);
    await DB.bulkPut('workoutTemplates', [...Seed.gymTemplates, ...Seed.kettlebellTemplates, Seed.cardioTemplate]);
    await DB.put('meta', { key: 'app', onboardingDone: false, createdAt: Utils.todayISO() });
  }

  async function loadCache() {
    cache.settings = await DB.get('settings', 'app');
    cache.schedule = await DB.get('schedule', 'app');
    const allEx = await DB.getAll('exercises');
    cache.exercises = Object.fromEntries(allEx.map(e => [e.id, e]));
    const allTpl = await DB.getAll('workoutTemplates');
    cache.gymTemplates = Object.fromEntries(allTpl.filter(t => t.type === 'gym').map(t => [t.id, t]));
    cache.kbTemplates = Object.fromEntries(allTpl.filter(t => t.type === 'kettlebell').map(t => [t.id, t]));
    cache.cardioTemplate = allTpl.find(t => t.type === 'cardio') || Seed.cardioTemplate;
    const allRecords = await DB.getAll('records');
    cache.records = Object.fromEntries(allRecords.map(r => [r.exerciseId, r]));
  }

  // ------------------------------------------------------------ settings
  function getSettings() { return cache.settings; }
  async function updateSettings(patch) {
    cache.settings = { ...cache.settings, ...patch };
    await DB.put('settings', cache.settings);
    return cache.settings;
  }

  async function getMeta() {
    return (await DB.get('meta', 'app')) || { key: 'app', onboardingDone: false };
  }
  async function updateMeta(patch) {
    const m = await getMeta();
    const updated = { ...m, ...patch };
    await DB.put('meta', updated);
    return updated;
  }

  // ------------------------------------------------------------- schedule
  function getSchedule() { return cache.schedule; }
  async function updateSchedule(patch) {
    cache.schedule = { ...cache.schedule, ...patch };
    await DB.put('schedule', cache.schedule);
    return cache.schedule;
  }
  async function setDayWorkout(dayKey, workoutKey) {
    const days = { ...cache.schedule.days, [dayKey]: workoutKey };
    return updateSchedule({ days });
  }

  // ------------------------------------------------------------ exercises
  function getExercise(id) { return cache.exercises[id]; }
  function getAllExercises() { return Object.values(cache.exercises); }
  async function saveExercise(ex) {
    cache.exercises[ex.id] = ex;
    await DB.put('exercises', ex);
    return ex;
  }
  async function archiveExercise(id, status) {
    const ex = cache.exercises[id];
    if (!ex) return;
    ex.status = status;
    await saveExercise(ex);
  }

  async function getExerciseNote(exerciseId) {
    const n = await DB.get('exerciseNotes', exerciseId);
    return n ? n.note : '';
  }
  async function setExerciseNote(exerciseId, note) {
    await DB.put('exerciseNotes', { exerciseId, note, updatedAt: Utils.todayISO() });
  }

  // ------------------------------------------------------------ templates
  function getGymTemplate(id) { return cache.gymTemplates[id]; }
  function getGymTemplateByDay(dayKeyName) {
    return Object.values(cache.gymTemplates).find(t => t.day === dayKeyName);
  }
  function getKbTemplatesByDay(dayKeyName) {
    const items = Object.values(cache.kbTemplates).filter(t => t.day === dayKeyName);
    return {
      standard: items.find(t => t.variant === 'standard'),
      express: items.find(t => t.variant === 'express'),
    };
  }
  function getCardioTemplate() { return cache.cardioTemplate; }

  // --------------------------------------------------------- plan resolve
  // Returns the resolved plan for a given ISO date, accounting for overrides.
  async function getPlanForDate(dateISO) {
    const dayIdx = Utils.isoWeekday(dateISO);
    const dayKey = DAY_KEYS[dayIdx];
    const override = await DB.get('overrides', dateISO);

    let workoutKey;
    let overridden = false;
    let skipped = false;

    if (override) {
      overridden = true;
      if (override.skipped) {
        skipped = true;
        workoutKey = null;
      } else {
        workoutKey = override.workoutKey;
      }
    } else {
      workoutKey = cache.schedule.days[dayKey];
    }

    const plan = {
      date: dateISO, dayKey, workoutKey, overridden, skipped,
      note: override ? override.note : null,
    };

    if (!workoutKey || workoutKey === 'rest') {
      plan.type = 'rest';
      return plan;
    }
    if (workoutKey === 'cardio') {
      plan.type = 'cardio';
      plan.cardioTemplate = getCardioTemplate();
      return plan;
    }
    plan.type = 'strength';
    plan.gymTemplate = getGymTemplateByDay(workoutKey);
    plan.kettlebell = getKbTemplatesByDay(workoutKey);
    return plan;
  }

  async function getOverridesInRange(fromISO, toISO) {
    const range = IDBKeyRange.bound(fromISO, toISO);
    return DB.getAllRange('overrides', range);
  }

  async function setOverride(dateISO, { workoutKey = undefined, skipped = false, note = '' } = {}) {
    const override = { date: dateISO, workoutKey: workoutKey || null, skipped, note };
    await DB.put('overrides', override);
    return override;
  }
  async function clearOverride(dateISO) {
    await DB.del('overrides', dateISO);
  }
  async function moveWorkout(fromDateISO, toDateISO) {
    const fromPlan = await getPlanForDate(fromDateISO);
    if (fromPlan.type === 'rest') return;
    await setOverride(fromDateISO, { skipped: true, note: `Verplaatst naar ${toDateISO}` });
    await setOverride(toDateISO, { workoutKey: fromPlan.workoutKey, note: `Verplaatst vanaf ${fromDateISO}` });
  }
  async function skipWorkout(dateISO, note = '') {
    await setOverride(dateISO, { skipped: true, note });
  }

  // -------------------------------------------------------------- records
  function getRecord(exerciseId) { return cache.records[exerciseId] || null; }
  function getAllRecords() { return Object.values(cache.records); }

  async function _updateRecordFromSet(exerciseId, weight, reps, dateISO) {
    if (!weight || !reps) return null;
    const est1RM = Utils.epley1RM(weight, reps);
    let rec = cache.records[exerciseId] || { exerciseId };
    let broke = [];

    if (!rec.maxWeight || weight > rec.maxWeight.value) {
      rec.maxWeight = { value: weight, reps, date: dateISO };
      broke.push('maxWeight');
    }
    if (!rec.max1RM || est1RM > rec.max1RM.value) {
      rec.max1RM = { value: est1RM, date: dateISO };
      broke.push('max1RM');
    }
    cache.records[exerciseId] = rec;
    await DB.put('records', rec);
    return broke;
  }

  async function _updateVolumeRecord(exerciseId, totalVolume, dateISO) {
    let rec = cache.records[exerciseId] || { exerciseId };
    let broke = false;
    if (!rec.maxVolumeSession || totalVolume > rec.maxVolumeSession.value) {
      rec.maxVolumeSession = { value: totalVolume, date: dateISO };
      broke = true;
    }
    cache.records[exerciseId] = rec;
    await DB.put('records', rec);
    return broke;
  }

  // -------------------------------------------------------------- sessions
  async function saveSession(session) {
    if (!session.id) session.id = Utils.uid('sess');
    await DB.put('sessions', session);

    // Update PRs for gym-style logged sets
    const newRecords = [];
    if (session.exercises) {
      for (const exEntry of session.exercises) {
        let volume = 0;
        for (const set of exEntry.sets) {
          if (set.completed && set.weight && set.reps) {
            volume += set.weight * set.reps;
            const broke = await _updateRecordFromSet(exEntry.exerciseId, set.weight, set.reps, session.date);
            if (broke && broke.length) newRecords.push({ exerciseId: exEntry.exerciseId, broke });
          }
        }
        if (volume > 0) await _updateVolumeRecord(exEntry.exerciseId, volume, session.date);
      }
    }
    return { session, newRecords };
  }

  async function getSession(id) { return DB.get('sessions', id); }
  async function deleteSession(id) { return DB.del('sessions', id); }
  async function getAllSessions() { return DB.getAll('sessions'); }
  async function getSessionsForDate(dateISO) {
    const all = await DB.getAllByIndex('sessions', 'by_date', IDBKeyRange.only(dateISO));
    return all;
  }
  async function getSessionsInRange(fromISO, toISO) {
    const range = IDBKeyRange.bound(fromISO, toISO);
    return DB.getAllByIndex('sessions', 'by_date', range);
  }
  async function getSessionsForExercise(exerciseId) {
    const all = await DB.getAll('sessions');
    const out = [];
    for (const s of all) {
      if (!s.exercises) continue;
      const entry = s.exercises.find(e => e.exerciseId === exerciseId);
      if (entry) out.push({ session: s, entry });
    }
    out.sort((a, b) => a.session.date.localeCompare(b.session.date));
    return out;
  }

  // ------------------------------------------------------- weekly progress
  async function getWeekSummary(dateInWeekISO) {
    const start = Utils.startOfWeek(dateInWeekISO);
    const end = Utils.addDays(start, 6);
    const sessions = await getSessionsInRange(start, end);
    const strengthDone = sessions.filter(s => s.type === 'gym' || s.type === 'kettlebell').length;
    const cardioDone = sessions.filter(s => s.type === 'cardio').length;
    return {
      start, end, sessions,
      strengthDone, cardioDone,
      strengthTarget: 4, cardioTarget: 1,
      complete: strengthDone >= 4 && cardioDone >= 1,
    };
  }

  async function getStreak() {
    // Count consecutive weeks (ending with the most recent fully-elapsed week or current week)
    // Simplified: count consecutive days going backward from today where a planned strength/cardio
    // session was either completed or the day was a rest day.
    let streak = 0;
    let d = Utils.todayISO();
    for (let i = 0; i < 365; i++) {
      const plan = await getPlanForDate(d);
      if (plan.type === 'rest') { d = Utils.addDays(d, -1); continue; }
      const sessions = await getSessionsForDate(d);
      const done = sessions.some(s => s.status === 'completed' || s.status === 'partial');
      if (done) {
        streak++;
        d = Utils.addDays(d, -1);
      } else if (d === Utils.todayISO()) {
        // today not done yet, doesn't break the streak
        d = Utils.addDays(d, -1);
      } else {
        break;
      }
    }
    return streak;
  }

  // ------------------------------------------------------------ bodyweight
  async function addBodyweight(entry) {
    entry.id = entry.id || Utils.uid('bw');
    await DB.put('bodyweight', entry);
    return entry;
  }
  async function getAllBodyweight() {
    const all = await DB.getAll('bodyweight');
    return all.sort((a, b) => a.date.localeCompare(b.date));
  }
  async function deleteBodyweight(id) { return DB.del('bodyweight', id); }
  async function getLatestBodyweight() {
    const all = await getAllBodyweight();
    return all.length ? all[all.length - 1] : null;
  }

  // ----------------------------------------------------------- measurements
  async function addMeasurement(entry) {
    entry.id = entry.id || Utils.uid('meas');
    await DB.put('measurements', entry);
    return entry;
  }
  async function getAllMeasurements() {
    const all = await DB.getAll('measurements');
    return all.sort((a, b) => a.date.localeCompare(b.date));
  }
  async function deleteMeasurement(id) { return DB.del('measurements', id); }

  // ---------------------------------------------------------------- photos
  async function addPhoto(entry) {
    entry.id = entry.id || Utils.uid('photo');
    await DB.put('photos', entry);
    return entry;
  }
  async function getAllPhotos() {
    const all = await DB.getAll('photos');
    return all.sort((a, b) => a.date.localeCompare(b.date));
  }
  async function deletePhoto(id) { return DB.del('photos', id); }
  async function deleteAllPhotos() {
    const all = await getAllPhotos();
    for (const p of all) await deletePhoto(p.id);
  }

  // --------------------------------------------------------- export/import
  async function exportAll() {
    const [settings, schedule, exercises, templates, sessions, bodyweight, measurements,
      photos, records, meta, overrides, exerciseNotes] = await Promise.all([
        DB.get('settings', 'app'), DB.get('schedule', 'app'), DB.getAll('exercises'),
        DB.getAll('workoutTemplates'), DB.getAll('sessions'), DB.getAll('bodyweight'),
        DB.getAll('measurements'), DB.getAll('photos'), DB.getAll('records'),
        DB.get('meta', 'app'), DB.getAll('overrides'), DB.getAll('exerciseNotes'),
      ]);

    // Convert photo blobs to base64 for portable JSON export
    const photosPortable = await Promise.all(photos.map(async p => {
      let dataUrl = p.dataUrl;
      if (!dataUrl && p.blob) dataUrl = await blobToDataUrl(p.blob);
      return { ...p, blob: undefined, dataUrl };
    }));

    return {
      exportedAt: new Date().toISOString(),
      version: 1,
      settings, schedule, exercises, templates, sessions, bodyweight, measurements,
      photos: photosPortable, records, meta, overrides, exerciseNotes,
    };
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  }

  async function importAll(data) {
    await DB.clearAllStores();
    if (data.settings) await DB.put('settings', data.settings);
    if (data.schedule) await DB.put('schedule', data.schedule);
    if (data.exercises) await DB.bulkPut('exercises', data.exercises);
    if (data.templates) await DB.bulkPut('workoutTemplates', data.templates);
    if (data.sessions) await DB.bulkPut('sessions', data.sessions);
    if (data.bodyweight) await DB.bulkPut('bodyweight', data.bodyweight);
    if (data.measurements) await DB.bulkPut('measurements', data.measurements);
    if (data.photos) await DB.bulkPut('photos', data.photos);
    if (data.records) await DB.bulkPut('records', data.records);
    if (data.meta) await DB.put('meta', data.meta);
    if (data.overrides) await DB.bulkPut('overrides', data.overrides);
    if (data.exerciseNotes) await DB.bulkPut('exerciseNotes', data.exerciseNotes);
    await loadCache();
  }

  async function wipeAll() {
    await DB.clearAllStores();
    await seedAll();
    await loadCache();
  }

  return {
    init, loadCache,
    getSettings, updateSettings, getMeta, updateMeta,
    getSchedule, updateSchedule, setDayWorkout, DAY_KEYS,
    getExercise, getAllExercises, saveExercise, archiveExercise, getExerciseNote, setExerciseNote,
    getGymTemplate, getGymTemplateByDay, getKbTemplatesByDay, getCardioTemplate,
    getPlanForDate, getOverridesInRange, setOverride, clearOverride, moveWorkout, skipWorkout,
    getRecord, getAllRecords,
    saveSession, getSession, deleteSession, getAllSessions, getSessionsForDate,
    getSessionsInRange, getSessionsForExercise,
    getWeekSummary, getStreak,
    addBodyweight, getAllBodyweight, deleteBodyweight, getLatestBodyweight,
    addMeasurement, getAllMeasurements, deleteMeasurement,
    addPhoto, getAllPhotos, deletePhoto, deleteAllPhotos,
    exportAll, importAll, wipeAll, blobToDataUrl,
  };
})();
