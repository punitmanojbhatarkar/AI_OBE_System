
  const user = Auth.requireAuth(['faculty', 'hod']);
  if (!user) throw new Error('Not authorized');
  Auth.populateSidebar(user);

  let allCourses = [];
  let editingId  = null;
  let activeFilter = 'all';

  document.addEventListener('DOMContentLoaded', () => {
    loadCourses();
    setupFilters();
    setupSearch();
  });

  function loadCourses() {
    allCourses = DB.courses.byFaculty(user.id);
    renderCourses(allCourses);
  }

  function renderCourses(courses) {
    const filtered = activeFilter === 'all' ? courses : courses.filter(c => (c.status || 'active') === activeFilter);
    document.getElementById('course-count').textContent = filtered.length;
    const grid = document.getElementById('courses-grid');
    const empty = document.getElementById('empty-state');

    if (!filtered.length) {
      grid.innerHTML  = '';
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');
    grid.innerHTML = filtered.map(c => buildCourseCard(c)).join('');
  }

  function buildCourseCard(c) {
    const students = DB.students.byCourse(c.id).length;
    const cos      = DB.cos.byCourse(c.id).filter(x => x.text).length;
    const dept     = DB.departments.byId(c.deptId);
    const statusColor = (c.status||'active') === 'active' ? 'badge-success' : 'badge-muted';
    return `
      <div class="course-card" id="card-${c.id}">
        <div class="course-card-header">
          <span class="course-code-badge">${c.code}</span>
          <span class="badge ${statusColor}">${c.status || 'active'}</span>
        </div>
        <div>
          <div class="course-name">${c.name}</div>
          <div class="course-meta">
            <span class="meta-tag">📅 Sem ${c.semester}</span>
            <span class="meta-tag">🏛️ ${dept ? dept.code : '—'}</span>
            <span class="meta-tag">🎓 ${c.class || '—'}</span>
            <span class="meta-tag">📁 Div ${c.division || '—'}</span>
            <span class="meta-tag">📅 ${c.year || '—'}</span>
          </div>
        </div>
        <div class="course-stats">
          <div class="course-stat-item">
            <div class="course-stat-val">${students}</div>
            <div class="course-stat-lbl">Students</div>
          </div>
          <div class="course-stat-item">
            <div class="course-stat-val">${cos}</div>
            <div class="course-stat-lbl">Active COs</div>
          </div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;padding-top:4px;">
          <span style="font-size:11px;color:var(--text-muted)">IA:${c.examScheme?.ia||30} | MSE:${c.examScheme?.mse||20} | ESE:${c.examScheme?.ese||50}</span>
        </div>
        <div class="course-actions">
          <button class="btn btn-primary btn-sm" style="flex:1" onclick="selectAndGo('${c.id}','course-setup.html')">⚙️ Setup</button>
          <button class="btn btn-secondary btn-sm" onclick="selectAndGo('${c.id}','outcomes.html')">🎯 COs</button>
          <button class="btn btn-secondary btn-sm" onclick="selectAndGo('${c.id}','students.html')">👥 Students</button>
          <button class="btn btn-ghost btn-sm" onclick="openEditModal('${c.id}')">✏️</button>
          <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="deleteCourse('${c.id}','${c.name.replace(/'/g, "\\'")}')">🗑️</button>
        </div>
      </div>`;
  }

  function selectAndGo(cid, page) {
    sessionStorage.setItem('selected_course_id', cid);
    window.location.href = page;
  }

  function setupFilters() {
    document.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        renderCourses(allCourses);
      });
    });
  }

  function setupSearch() {
    document.getElementById('course-search').addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      const filtered = allCourses.filter(c =>
        c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
      );
      renderCourses(filtered);
    });
  }

  function deleteCourse(id, name) {
    confirmDelete(name, () => {
      DB.courses.delete(id);
      Toast.success(`"${name}" deleted successfully.`);
      loadCourses();
    });
  }

  /* ── ADD / EDIT MODAL ── */
  function openAddModal() {
    editingId = null;
    showCourseModal(null);
  }

  function openEditModal(id) {
    editingId = id;
    showCourseModal(DB.courses.byId(id));
  }

  function showCourseModal(course) {
    const depts = DB.departments.all();
    const isEdit = !!course;
    const v = course || {};
    const examScheme = v.examScheme || { ia:30, mse:20, ese:50 };

    const html = `
      <div class="modal-header">
        <h3 class="modal-title">${isEdit ? '✏️ Edit Course' : '➕ Add New Course'}</h3>
        <button class="modal-close" onclick="Modal.close()">✕</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Course Code *</label>
          <input class="form-control" id="f-code" placeholder="e.g. 230331T" value="${v.code||''}">
        </div>
        <div class="form-group">
          <label class="form-label">Short Name</label>
          <input class="form-control" id="f-short" placeholder="e.g. EDA" value="${v.shortName||''}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Course Name *</label>
        <input class="form-control" id="f-name" placeholder="Full course name" value="${v.name||''}">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Department</label>
          <select class="form-control" id="f-dept">
            ${depts.map(d => `<option value="${d.id}" ${v.deptId===d.id?'selected':''}>${d.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Semester</label>
          <select class="form-control" id="f-sem">
            ${['I','II','III','IV','V','VI','VII','VIII'].map(s => `<option ${v.semester===s?'selected':''}>${s}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Academic Year</label>
          <input class="form-control" id="f-year" placeholder="2025-26" value="${v.year||'2025-26'}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Class</label>
          <input class="form-control" id="f-class" placeholder="TY BTech" value="${v.class||''}">
        </div>
        <div class="form-group">
          <label class="form-label">Division</label>
          <input class="form-control" id="f-div" placeholder="A" value="${v.division||''}">
        </div>
        <div class="form-group">
          <label class="form-label">Batch</label>
          <input class="form-control" id="f-batch" placeholder="A1, A2" value="${v.batch||''}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">IA Marks</label>
          <input class="form-control" id="f-ia" type="number" min="0" max="100" value="${examScheme.ia}">
        </div>
        <div class="form-group">
          <label class="form-label">MSE Marks</label>
          <input class="form-control" id="f-mse" type="number" min="0" max="100" value="${examScheme.mse}">
        </div>
        <div class="form-group">
          <label class="form-label">ESE Marks</label>
          <input class="form-control" id="f-ese" type="number" min="0" max="100" value="${examScheme.ese}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Champion / HOD</label>
          <select class="form-control" id="f-champ">
            <option value="">— Select HOD —</option>
            ${DB.users.byRole('hod').map(h => `<option value="${h.name}" ${v.champion===h.name?'selected':''}>${h.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-control" id="f-status">
            <option value="active" ${(v.status||'active')==='active'?'selected':''}>Active</option>
            <option value="inactive" ${v.status==='inactive'?'selected':''}>Inactive</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group" style="flex:1">
          <label class="form-label">Syllabus File (PDF/Image)</label>
          <input type="file" class="form-control" id="f-syl-file" accept=".pdf,image/*">
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px">
            ${v.syllabusFile ? 'Currently attached: <strong>' + v.syllabusFile + '</strong>' : 'No file attached.'}
          </div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group" style="flex:1">
          <label class="form-label">Syllabus Text Context</label>
          <textarea class="form-control" id="f-syl-text" rows="3" placeholder="Paste syllabus content here for AI context...">${v.syllabusText||''}</textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
        <button class="btn btn-primary" onclick="saveCourse()">${isEdit ? 'Update Course' : 'Add Course'}</button>
      </div>`;

    Modal.open(html, { wide: true });
  }

  function saveCourse() {
    const code  = document.getElementById('f-code').value.trim();
    const name  = document.getElementById('f-name').value.trim();
    if (!code || !name) { Toast.error('Course Code and Name are required.'); return; }

    const ia  = parseInt(document.getElementById('f-ia').value) || 30;
    const mse = parseInt(document.getElementById('f-mse').value) || 20;
    const ese = parseInt(document.getElementById('f-ese').value) || 50;
    if (ia + mse + ese !== 100) { Toast.warning(`IA(${ia}) + MSE(${mse}) + ESE(${ese}) should total 100.`); }

    const fileInput = document.getElementById('f-syl-file');
    const newFileName = fileInput.files.length > 0 ? fileInput.files[0].name : undefined;

    const obj = {
      id         : editingId || undefined,
      code, name,
      shortName  : document.getElementById('f-short').value.trim() || code,
      deptId     : document.getElementById('f-dept').value,
      semester   : document.getElementById('f-sem').value,
      year       : document.getElementById('f-year').value.trim(),
      class      : document.getElementById('f-class').value.trim(),
      division   : document.getElementById('f-div').value.trim(),
      batch      : document.getElementById('f-batch').value.trim(),
      champion   : document.getElementById('f-champ').value.trim(),
      status     : document.getElementById('f-status').value,
      facultyId  : user.id,
      examScheme : { ia, mse, ese },
      attainmentLevels: { 1:65, 2:75, 3:85 },
      directWeight: 80, indirectWeight: 20,
      syllabusText: document.getElementById('f-syl-text').value.trim()
    };

    if (newFileName) {
      obj.syllabusFile = newFileName;
    } else if (editingId) {
      // Retain existing filename if not uploading a new one
      const existing = DB.courses.byId(editingId);
      if (existing && existing.syllabusFile) obj.syllabusFile = existing.syllabusFile;
    }

    if (editingId) {
      DB.courses.update(obj);
      Toast.success(`"${name}" updated successfully!`);
    } else {
      DB.courses.add(obj);
      Toast.success(`"${name}" added successfully!`);
    }
    Modal.close();
    loadCourses();
  }
