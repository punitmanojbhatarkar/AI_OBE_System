/* ============================================================
   API.JS — Real Backend Bridge for OBE System
   Fetches ALL data from Python SQLite backend at startup,
   then hydrates localStorage so all pages work transparently.
   Also overrides all DB write methods to POST/PUT/DELETE to the backend.
   ============================================================ */

const API_BASE = 'http://127.0.0.1:8000';

/* ── Low-level fetch helper ── */
async function apiFetch(path, opts = {}) {
  try {
    const res = await fetch(API_BASE + path, {
      headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
      ...opts,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || res.statusText);
    }
    return await res.json();
  } catch (e) {
    console.error('[API]', path, e.message);
    throw e;
  }
}

/* ── Show loading overlay while syncing ── */
function showSyncOverlay() {
  const el = document.createElement('div');
  el.id = 'api-sync-overlay';
  el.style.cssText = `
    position:fixed;inset:0;background:rgba(15,23,42,0.85);z-index:99999;
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;
    font-family:'Plus Jakarta Sans',sans-serif;color:#fff;
  `;
  el.innerHTML = `
    <div style="width:48px;height:48px;border:4px solid rgba(255,255,255,0.2);border-top-color:#3B82F6;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
    <div style="font-size:18px;font-weight:700;">Connecting to database…</div>
    <div style="font-size:13px;color:rgba(255,255,255,0.6);" id="api-sync-msg">Loading data from backend</div>
    <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
  `;
  document.body.prepend(el);
  return {
    msg: (t) => { const m = document.getElementById('api-sync-msg'); if (m) m.textContent = t; },
    done: () => { const o = document.getElementById('api-sync-overlay'); if (o) o.remove(); }
  };
}

/* ── Show error overlay if backend is down ── */
function showOfflineError(err) {
  const el = document.getElementById('api-sync-overlay');
  if (el) {
    el.innerHTML = `
      <div style="font-size:40px;">⚠️</div>
      <div style="font-size:20px;font-weight:700;color:#EF4444;">Backend Not Running</div>
      <div style="font-size:14px;color:rgba(255,255,255,0.7);max-width:420px;text-align:center;">
        Could not connect to the Python backend at <strong>${API_BASE}</strong>.<br>
        Please start it by running:<br>
        <code style="background:rgba(255,255,255,0.1);padding:6px 12px;border-radius:6px;margin-top:8px;display:inline-block;">
          cd backend && .\\venv\\Scripts\\activate && uvicorn main:app --reload
        </code>
      </div>
      <button onclick="location.reload()" style="margin-top:16px;padding:10px 24px;background:#3B82F6;color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;">
        Retry
      </button>
    `;
  }
}

/* ── Transform backend course to match frontend data.js shape ── */
function normalizeCourse(c) {
  return {
    ...c,
    class: c.class || c.klass || '',
    examScheme: c.examScheme || { ia: 30, mse: 20, ese: 50 },
    attainmentLevels: c.attainmentLevels || { 1: 65, 2: 75, 3: 85 },
    directWeight: c.directWeight || 80,
    indirectWeight: c.indirectWeight || 20,
    status: c.status || 'active',
  };
}

/* ── Main sync function: load ALL data from backend into localStorage ── */
async function syncFromBackend() {
  const overlay = showSyncOverlay();

  try {
    overlay.msg('Loading configuration…');
    const config = await apiFetch('/api/config');
    // Merge iaQuestions into config for compatibility
    const storedCfg = { ...config };
    // Build iaQuestions in the format data.js expects
    const iaQGrouped = {};
    for (const item of (config.iaQuestions || [])) {
      const key = `${item.courseId}::${item.assessmentType}::${item.assessmentNo}`;
      if (!iaQGrouped[key]) {
        iaQGrouped[key] = { courseId: item.courseId, assessmentType: item.assessmentType, assessmentNo: item.assessmentNo, questions: [] };
      }
      // Each item from backend is already grouped
      if (item.questions) {
        iaQGrouped[key].questions.push(...item.questions);
      }
    }
    storedCfg.iaQuestions = Object.values(iaQGrouped);
    localStorage.setItem('obe_config', JSON.stringify(storedCfg));

    overlay.msg('Loading departments…');
    const depts = await apiFetch('/api/departments');
    localStorage.setItem('obe_departments', JSON.stringify(depts));

    overlay.msg('Loading users…');
    const users = await apiFetch('/api/users');
    localStorage.setItem('obe_users', JSON.stringify(users));

    overlay.msg('Loading courses…');
    const courses = await apiFetch('/api/courses');
    localStorage.setItem('obe_courses', JSON.stringify(courses.map(normalizeCourse)));

    overlay.msg('Loading course outcomes…');
    let allCOs = [];
    for (const c of courses) {
      const cos = await apiFetch(`/api/courses/${c.id}/cos`);
      allCOs = allCOs.concat(cos);
    }
    localStorage.setItem('obe_cos', JSON.stringify(allCOs));

    overlay.msg('Loading PO mappings…');
    let allPO = [];
    for (const c of courses) {
      const po = await apiFetch(`/api/courses/${c.id}/pomapping`);
      allPO = allPO.concat(po);
    }
    localStorage.setItem('obe_po_mapping', JSON.stringify(allPO));

    overlay.msg('Loading students…');
    let allStudents = [];
    for (const c of courses) {
      const sts = await apiFetch(`/api/courses/${c.id}/students`);
      allStudents = allStudents.concat(sts);
    }
    localStorage.setItem('obe_students', JSON.stringify(allStudents));

    overlay.msg('Loading marks…');
    let allIA = [], allMSE = [], allESE = [];
    for (const c of courses) {
      const ia = await apiFetch(`/api/courses/${c.id}/marks/ia`);
      const mse = await apiFetch(`/api/courses/${c.id}/marks/mse`);
      const ese = await apiFetch(`/api/courses/${c.id}/marks/ese`);
      allIA = allIA.concat(ia);
      allMSE = allMSE.concat(mse);
      allESE = allESE.concat(ese);
    }
    localStorage.setItem('obe_marks_ia', JSON.stringify(allIA));
    localStorage.setItem('obe_marks_mse', JSON.stringify(allMSE));
    localStorage.setItem('obe_marks_ese', JSON.stringify(allESE));
    localStorage.setItem('obe_marks_assign', JSON.stringify([]));

    overlay.msg('Loading IA questions…');
    let allIAQ = [];
    for (const c of courses) {
      const iaq = await apiFetch(`/api/courses/${c.id}/ia-questions`);
      allIAQ = allIAQ.concat(iaq);
    }
    // Merge with config.iaQuestions
    const mergedCfg = JSON.parse(localStorage.getItem('obe_config') || '{}');
    mergedCfg.iaQuestions = allIAQ;
    localStorage.setItem('obe_config', JSON.stringify(mergedCfg));

    overlay.msg('Loading assignments & syllabus…');
    let allAssignments = [];
    for (const c of courses) {
      const asgn = await apiFetch(`/api/courses/${c.id}/assignments`);
      allAssignments = allAssignments.concat(asgn);
    }
    localStorage.setItem('obe_assignments', JSON.stringify(allAssignments));
    localStorage.setItem('obe_submissions', JSON.stringify([]));

    // Surveys
    let allSurvey = [];
    for (const c of courses) {
      const sv = await apiFetch(`/api/courses/${c.id}/survey`);
      allSurvey = allSurvey.concat(sv);
    }
    localStorage.setItem('obe_survey', JSON.stringify(allSurvey));

    // Mark as initialized so data.js doesn't re-seed with demo data
    localStorage.setItem('obe_initialized_v2', '1');

    overlay.done();
    console.log('[API] Sync complete — all data loaded from backend.');
  } catch (e) {
    console.error('[API] Sync failed:', e);
    showOfflineError(e);
    throw e; // Prevent page from running without backend
  }
}

/* ════════════════════════════════════════════
   PATCH DB WRITE METHODS to also persist to backend
   These run AFTER data.js loads, so they wrap the original methods.
   ════════════════════════════════════════════ */
function patchDBWriteMethods() {
  if (typeof DB === 'undefined') { console.warn('[API] DB not found, skip patching'); return; }

  // ── Courses ──
  const _courseAdd = DB.courses.add.bind(DB.courses);
  DB.courses.add = async function(c) {
    const result = _courseAdd(c);
    try {
      await apiFetch('/api/courses', { method: 'POST', body: { ...c, klass: c.class } });
    } catch(e) { console.warn('[API] course add failed', e); }
    return result;
  };

  const _courseUpdate = DB.courses.update.bind(DB.courses);
  DB.courses.update = async function(c) {
    const result = _courseUpdate(c);
    try {
      await apiFetch(`/api/courses/${c.id}`, { method: 'PUT', body: { ...c, klass: c.class } });
    } catch(e) { console.warn('[API] course update failed', e); }
    return result;
  };

  const _courseDelete = DB.courses.delete.bind(DB.courses);
  DB.courses.delete = async function(id) {
    _courseDelete(id);
    try { await apiFetch(`/api/courses/${id}`, { method: 'DELETE' }); } catch(e) {}
  };

  // ── Course Outcomes ──
  const _coSaveAll = DB.cos.saveAll.bind(DB.cos);
  DB.cos.saveAll = async function(cid, list) {
    _coSaveAll(cid, list);
    try {
      await apiFetch('/api/cos/saveall', { method: 'POST', body: { courseId: cid, cos: list } });
    } catch(e) { console.warn('[API] co saveAll failed', e); }
  };

  // ── PO Mapping ──
  const _poSaveMatrix = DB.poMapping.saveMatrix.bind(DB.poMapping);
  DB.poMapping.saveMatrix = async function(cid, matrix) {
    _poSaveMatrix(cid, matrix);
    try {
      await apiFetch('/api/pomapping/save', { method: 'POST', body: { courseId: cid, matrix } });
    } catch(e) { console.warn('[API] po mapping save failed', e); }
  };

  // ── Students ──
  const _stSaveAll = DB.students.saveAll.bind(DB.students);
  DB.students.saveAll = async function(cid, list) {
    _stSaveAll(cid, list);
    try {
      await apiFetch('/api/students/saveall', { method: 'POST', body: { courseId: cid, students: list } });
    } catch(e) { console.warn('[API] students saveAll failed', e); }
  };

  // ── Marks IA ──
  const _marksIASave = DB.marks.saveIA.bind(DB.marks);
  DB.marks.saveIA = async function(cid, list) {
    _marksIASave(cid, list);
    try {
      await apiFetch('/api/marks/ia/save', { method: 'POST', body: { courseId: cid, marks: list } });
    } catch(e) { console.warn('[API] marks IA save failed', e); }
  };

  // ── Marks MSE ──
  const _marksMSESave = DB.marks.saveMSE.bind(DB.marks);
  DB.marks.saveMSE = async function(cid, list) {
    _marksMSESave(cid, list);
    try {
      await apiFetch('/api/marks/mse/save', { method: 'POST', body: { courseId: cid, marks: list } });
    } catch(e) { console.warn('[API] marks MSE save failed', e); }
  };

  // ── Marks ESE ──
  const _marksESESave = DB.marks.saveESE.bind(DB.marks);
  DB.marks.saveESE = async function(cid, list) {
    _marksESESave(cid, list);
    try {
      await apiFetch('/api/marks/ese/save', { method: 'POST', body: { courseId: cid, marks: list } });
    } catch(e) { console.warn('[API] marks ESE save failed', e); }
  };

  // ── Assignments ──
  const _asgnAdd = DB.assignments.add.bind(DB.assignments);
  DB.assignments.add = async function(a) {
    const result = _asgnAdd(a);
    try {
      await apiFetch('/api/assignments', { method: 'POST', body: a });
    } catch(e) { console.warn('[API] assignment add failed', e); }
    return result;
  };

  // ── Syllabus ──
  const _sylSave = DB.syllabus.save.bind(DB.syllabus);
  DB.syllabus.save = async function(cid, data) {
    _sylSave(cid, data);
    try {
      await apiFetch('/api/syllabus/save', { method: 'POST', body: { courseId: cid, ...data } });
    } catch(e) { console.warn('[API] syllabus save failed', e); }
  };

  // ── Users ──
  const _userAdd = DB.users.add.bind(DB.users);
  DB.users.add = async function(u) {
    const result = _userAdd(u);
    try { await apiFetch('/api/users', { method: 'POST', body: u }); } catch(e) {}
    return result;
  };

  const _userUpdate = DB.users.update.bind(DB.users);
  DB.users.update = async function(u) {
    const result = _userUpdate(u);
    try { await apiFetch(`/api/users/${u.id}`, { method: 'PUT', body: u }); } catch(e) {}
    return result;
  };

  const _userDelete = DB.users.delete.bind(DB.users);
  DB.users.delete = async function(id) {
    _userDelete(id);
    try { await apiFetch(`/api/users/${id}`, { method: 'DELETE' }); } catch(e) {}
  };

  // ── Departments ──
  const _deptAdd = DB.departments.add.bind(DB.departments);
  DB.departments.add = async function(d) {
    const result = _deptAdd(d);
    try { await apiFetch('/api/departments', { method: 'POST', body: d }); } catch(e) {}
    return result;
  };

  const _deptUpdate = DB.departments.update.bind(DB.departments);
  DB.departments.update = async function(d) {
    const result = _deptUpdate(d);
    try { await apiFetch(`/api/departments/${d.id}`, { method: 'PUT', body: d }); } catch(e) {}
    return result;
  };

  const _deptDelete = DB.departments.delete.bind(DB.departments);
  DB.departments.delete = async function(id) {
    _deptDelete(id);
    try { await apiFetch(`/api/departments/${id}`, { method: 'DELETE' }); } catch(e) {}
  };

  console.log('[API] DB write methods patched to persist to backend.');
}

/* ════════════════════════════════════════════
   BOOTSTRAP — exposes window._apiReady Promise
   All protected pages await this before init.
   ════════════════════════════════════════════ */
window._apiReady = (async function bootstrap() {
  const sessionRaw = sessionStorage.getItem('obe_session');
  if (!sessionRaw) {
    // Login page — no sync needed
    return;
  }

  // Force full sync from backend on every page load
  await syncFromBackend();

  // Patch write methods after DB is available
  patchDBWriteMethods();
})();
