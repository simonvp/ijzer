/* ============================================================
   db.js — thin promise wrapper around IndexedDB
   Stores:
     settings        (key: 'app')            -> single settings object
     exercises       (key: id)                -> exercise library
     workoutTemplates(key: id)                -> gym/kettlebell templates
     schedule        (key: 'app')             -> weekly schedule config
     sessions        (key: id, idx: date)     -> logged workout sessions
     bodyweight      (key: id, idx: date)     -> bodyweight entries
     measurements    (key: id, idx: date)     -> body measurement entries
     photos          (key: id, idx: date)     -> progress photo blobs + meta
     records         (key: exerciseId)        -> personal records per exercise
     meta            (key: 'app')             -> onboarding flag, streaks cache
   ============================================================ */

const DB = (() => {
  const DB_NAME = 'workoutTrackerDB';
  const DB_VERSION = 1;
  let _db = null;

  function open() {
    if (_db) return Promise.resolve(_db);
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'key' });
        if (!db.objectStoreNames.contains('exercises')) db.createObjectStore('exercises', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('workoutTemplates')) db.createObjectStore('workoutTemplates', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('schedule')) db.createObjectStore('schedule', { keyPath: 'key' });
        if (!db.objectStoreNames.contains('sessions')) {
          const s = db.createObjectStore('sessions', { keyPath: 'id' });
          s.createIndex('by_date', 'date');
        }
        if (!db.objectStoreNames.contains('bodyweight')) {
          const s = db.createObjectStore('bodyweight', { keyPath: 'id' });
          s.createIndex('by_date', 'date');
        }
        if (!db.objectStoreNames.contains('measurements')) {
          const s = db.createObjectStore('measurements', { keyPath: 'id' });
          s.createIndex('by_date', 'date');
        }
        if (!db.objectStoreNames.contains('photos')) {
          const s = db.createObjectStore('photos', { keyPath: 'id' });
          s.createIndex('by_date', 'date');
          s.createIndex('by_angle', 'angle');
        }
        if (!db.objectStoreNames.contains('records')) db.createObjectStore('records', { keyPath: 'exerciseId' });
        if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'key' });
        if (!db.objectStoreNames.contains('overrides')) db.createObjectStore('overrides', { keyPath: 'date' });
        if (!db.objectStoreNames.contains('exerciseNotes')) db.createObjectStore('exerciseNotes', { keyPath: 'exerciseId' });
      };
      req.onsuccess = (e) => { _db = e.target.result; resolve(_db); };
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async function tx(storeName, mode, fn) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const t = db.transaction(storeName, mode);
      const store = t.objectStore(storeName);
      let result;
      Promise.resolve(fn(store)).then(r => { result = r; }).catch(reject);
      t.oncomplete = () => resolve(result);
      t.onerror = () => reject(t.error);
      t.onabort = () => reject(t.error);
    });
  }

  function reqToPromise(req) {
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  const put = (store, value) => tx(store, 'readwrite', (s) => reqToPromise(s.put(value)));
  const get = (store, key) => tx(store, 'readonly', (s) => reqToPromise(s.get(key)));
  const del = (store, key) => tx(store, 'readwrite', (s) => reqToPromise(s.delete(key)));
  const getAll = (store) => tx(store, 'readonly', (s) => reqToPromise(s.getAll()));
  const clear = (store) => tx(store, 'readwrite', (s) => reqToPromise(s.clear()));

  const getAllByIndex = (store, index, range) => tx(store, 'readonly', (s) =>
    reqToPromise(s.index(index).getAll(range)));

  const getAllRange = (store, range) => tx(store, 'readonly', (s) => reqToPromise(s.getAll(range)));

  async function bulkPut(store, values) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const t = db.transaction(store, 'readwrite');
      const s = t.objectStore(store);
      values.forEach(v => s.put(v));
      t.oncomplete = () => resolve();
      t.onerror = () => reject(t.error);
    });
  }

  async function clearAllStores() {
    const stores = ['settings', 'exercises', 'workoutTemplates', 'schedule', 'sessions',
      'bodyweight', 'measurements', 'photos', 'records', 'meta', 'overrides', 'exerciseNotes'];
    for (const s of stores) await clear(s);
  }

  return { open, put, get, del, getAll, clear, getAllByIndex, getAllRange, bulkPut, clearAllStores };
})();
