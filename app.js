/* ================================================================
   HOSTEL PORTAL — app.js
   Modules: Data, State, UI, Auth, Directory, Profile
================================================================ */

/* ── 1. EXECUTIVE DATA ────────────────────────────────────────────
   To add a custom photo for an executive, set the `photo` field to
   the relative or absolute URL of the image file.
   Example: photo: 'images/president.jpg'
   Leave photo as null to show the default SVG avatar.
──────────────────────────────────────────────────────────────── */
const EXECUTIVES = [
  {
    id: 'exec-1',
    name: 'Abdullahi Issah',
    role: 'President',
    phone: '0244000001',
    email: 'president@hostel.edu.gh',
    room: 'A-001',
    photo: null,         // ← replace null with 'images/president.jpg'
    initials: 'AI',
    color: '#1B4332',
  },
  {
    id: 'exec-2',
    name: 'Fatima Yakubu',
    role: 'Vice President',
    phone: '0244000002',
    email: 'vp@hostel.edu.gh',
    room: 'A-002',
    photo: null,         // ← replace null with 'images/vp.jpg'
    initials: 'FY',
    color: '#2D6A4F',
  },
  {
    id: 'exec-3',
    name: 'Kwame Asante',
    role: 'Secretary',
    phone: '0244000003',
    email: 'secretary@hostel.edu.gh',
    room: 'B-010',
    photo: null,         // ← replace null with 'images/secretary.jpg'
    initials: 'KA',
    color: '#40916C',
  },
  {
    id: 'exec-4',
    name: 'Ama Owusu',
    role: 'Organizing Secretary',
    phone: '0244000004',
    email: 'organizing@hostel.edu.gh',
    room: 'B-015',
    photo: null,         // ← replace null with 'images/org-sec.jpg'
    initials: 'AO',
    color: '#52B788',
  },
  {
    id: 'exec-5',
    name: 'Ibrahim Moro',
    role: 'Financial Secretary',
    phone: '0244000005',
    email: 'finance@hostel.edu.gh',
    room: 'C-003',
    photo: null,         // ← replace null with 'images/fin-sec.jpg'
    initials: 'IM',
    color: '#1B4332',
  },
];

/* ── 2. STORAGE HELPERS ────────────────────────────────────────── */
const Store = {
  getResidents: () => JSON.parse(localStorage.getItem('hostel_residents') || '[]'),
  saveResidents: (list) => localStorage.setItem('hostel_residents', JSON.stringify(list)),
  getSession: () => JSON.parse(localStorage.getItem('hostel_session') || 'null'),
  saveSession: (user) => localStorage.setItem('hostel_session', JSON.stringify(user)),
  clearSession: () => localStorage.removeItem('hostel_session'),
};

/* ── 3. TOAST NOTIFICATION ────────────────────────────────────── */
let toastTimer = null;
function showToast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show ' + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.className = 'toast'; }, 3000);
}

/* ── 4. TAB / VIEW NAVIGATION ─────────────────────────────────── */
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabId);
  });
  document.querySelectorAll('.view').forEach(v => {
    v.classList.toggle('active', v.id === 'view-' + tabId);
  });
}

function showProfileView() {
  // Hide tab nav when showing profile
  document.getElementById('tabNav').style.display = 'none';
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-profile').classList.add('active');
}

function showTabNav() {
  document.getElementById('tabNav').style.display = 'flex';
}

document.getElementById('tabNav').addEventListener('click', (e) => {
  const btn = e.target.closest('.tab-btn');
  if (btn) switchTab(btn.dataset.tab);
});

// link-btn inside forms (e.g. "Already registered? Sign in")
document.querySelectorAll('.link-btn[data-goto]').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.goto));
});

/* ── 5. RESIDENT COUNT ─────────────────────────────────────────── */
function refreshCount() {
  document.getElementById('residentCount').textContent = Store.getResidents().length;
}

/* ── 6. EXECUTIVE CARD SVG AVATAR ─────────────────────────────── */
function defaultAvatarSVG(initials, color) {
  return `
    <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="22" r="22" fill="${color}" opacity=".15"/>
      <text x="22" y="27" text-anchor="middle"
        font-family="'Sora',system-ui,sans-serif"
        font-size="14" font-weight="700" fill="${color}">${initials}</text>
    </svg>`;
}

/* ── 7. RENDER EXECUTIVE DIRECTORY ───────────────────────────── */
function renderDirectory() {
  const grid = document.getElementById('execGrid');
  grid.innerHTML = EXECUTIVES.map(exec => {
    const avatarHTML = exec.photo
      ? `<img src="${exec.photo}" alt="${exec.name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />`
      : defaultAvatarSVG(exec.initials, exec.color);

    return `
      <div class="exec-card">
        <div class="exec-avatar">${avatarHTML}</div>
        <span class="exec-role">${exec.role}</span>
        <span class="exec-name">${exec.name}</span>
        <span class="exec-room">Room ${exec.room}</span>
        <div class="exec-actions">
          <a href="tel:${exec.phone}" class="btn-call" title="Call ${exec.name}">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 2h2.5l1 3L5 6.5a8.5 8.5 0 0 0 4.5 4.5L11 9.5l3 1V13a1 1 0 0 1-1 1C5.373 14 2 8.627 2 3a1 1 0 0 1 1-1z"/>
            </svg>
            Call
          </a>
          <a href="mailto:${exec.email}" class="btn-email" title="Email ${exec.name}">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="3" width="14" height="10" rx="1.5"/>
              <path d="M1 4l7 5 7-5"/>
            </svg>
            Email
          </a>
        </div>
      </div>`;
  }).join('');
}

/* ── 8. RENDER EXEC QUICK GRID (profile page) ─────────────────── */
function renderQuickGrid() {
  const grid = document.getElementById('execQuickGrid');
  grid.innerHTML = EXECUTIVES.map(exec => `
    <div class="exec-quick-card">
      <span class="exec-quick-role">${exec.role}</span>
      <span class="exec-quick-name">${exec.name}</span>
      <div class="exec-quick-btns">
        <a href="tel:${exec.phone}" class="btn-call">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;">
            <path d="M3 2h2.5l1 3L5 6.5a8.5 8.5 0 0 0 4.5 4.5L11 9.5l3 1V13a1 1 0 0 1-1 1C5.373 14 2 8.627 2 3a1 1 0 0 1 1-1z"/>
          </svg>
          Call
        </a>
        <a href="mailto:${exec.email}" class="btn-email">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;">
            <rect x="1" y="3" width="14" height="10" rx="1.5"/>
            <path d="M1 4l7 5 7-5"/>
          </svg>
          Email
        </a>
      </div>
    </div>`).join('');
}

/* ── 9. PASSWORD STRENGTH ─────────────────────────────────────── */
document.getElementById('reg-password').addEventListener('input', function () {
  const val = this.value;
  const fill = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const levels = [
    { pct: '0%',   bg: 'transparent', text: '' },
    { pct: '25%',  bg: '#C0392B',     text: 'Weak' },
    { pct: '50%',  bg: '#E67E22',     text: 'Fair' },
    { pct: '75%',  bg: '#F4A623',     text: 'Good' },
    { pct: '100%', bg: '#52B788',     text: 'Strong' },
  ];
  const l = val.length === 0 ? levels[0] : levels[Math.max(1, score)];
  fill.style.width = l.pct;
  fill.style.background = l.bg;
  label.textContent = l.text;
  label.style.color = l.bg;
});

/* ── 10. FIELD VALIDATION HELPERS ────────────────────────────── */
function setErr(id, msg) {
  const el = document.getElementById('err-' + id);
  const input = document.getElementById(id.replace('reg-', 'reg-').replace('login-', 'login-'));
  if (el) el.textContent = msg;
  if (input) input.classList.toggle('input-error', !!msg);
}
function clearErrs(ids) { ids.forEach(id => setErr(id, '')); }

/* ── 11. REGISTER FORM ────────────────────────────────────────── */
document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name      = document.getElementById('reg-name').value.trim();
  const id        = document.getElementById('reg-id').value.trim();
  const room      = document.getElementById('reg-room').value.trim();
  const phone     = document.getElementById('reg-phone').value.trim();
  const emergency = document.getElementById('reg-emergency').value.trim();
  const password  = document.getElementById('reg-password').value;
  const confirm   = document.getElementById('reg-confirm').value;

  clearErrs(['reg-name','reg-id','reg-room','reg-phone','reg-emergency','reg-password','reg-confirm']);

  let valid = true;
  if (!name)                            { setErr('reg-name', 'Full name is required.');          valid = false; }
  if (!id)                              { setErr('reg-id',   'Student ID is required.');          valid = false; }
  if (!room)                            { setErr('reg-room', 'Room number is required.');          valid = false; }
  if (!/^0\d{9}$/.test(phone.replace(/\s/g,'')))
                                        { setErr('reg-phone','Enter a valid Ghanaian phone number.'); valid = false; }
  if (!emergency)                       { setErr('reg-emergency', 'Emergency contact is required.'); valid = false; }
  if (password.length < 8)             { setErr('reg-password', 'Password must be at least 8 characters.'); valid = false; }
  if (password !== confirm)            { setErr('reg-confirm', 'Passwords do not match.');        valid = false; }
  if (!valid) return;

  const residents = Store.getResidents();
  if (residents.find(r => r.id === id)) {
    setErr('reg-id', 'A resident with this Student ID already exists.');
    return;
  }

  const newResident = { name, id, room, phone: phone.replace(/\s/g,''), emergency, password };
  residents.push(newResident);
  Store.saveResidents(residents);
  refreshCount();

  this.reset();
  document.getElementById('strengthFill').style.width = '0%';
  document.getElementById('strengthLabel').textContent = '';

  showToast('Account created! You can now sign in.', 'success');
  switchTab('login');
});

/* ── 12. LOGIN FORM ───────────────────────────────────────────── */
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const id       = document.getElementById('login-id').value.trim();
  const password = document.getElementById('login-password').value;

  clearErrs(['login-id','login-password','login-global']);

  let valid = true;
  if (!id)       { setErr('login-id',       'Student ID is required.');  valid = false; }
  if (!password) { setErr('login-password', 'Password is required.');     valid = false; }
  if (!valid) return;

  const residents = Store.getResidents();
  const user = residents.find(r => r.id === id && r.password === password);

  if (!user) {
    setErr('login-global', 'Incorrect Student ID or password. Please try again.');
    return;
  }

  Store.saveSession(user);
  this.reset();
  loadProfile(user);
});

/* ── 13. LOAD PROFILE VIEW ────────────────────────────────────── */
function loadProfile(user) {
  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
  document.getElementById('profileAvatar').textContent = initials;
  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileId').textContent = '🎓 ' + user.id;
  document.getElementById('profileRoom').textContent = '🚪 Room ' + user.room;
  document.getElementById('profilePhone').textContent = '📞 ' + user.phone;
  renderQuickGrid();
  showProfileView();
  showToast('Welcome back, ' + user.name.split(' ')[0] + '!', 'success');
}

/* ── 14. LOGOUT ───────────────────────────────────────────────── */
document.getElementById('logoutBtn').addEventListener('click', () => {
  Store.clearSession();
  showTabNav();
  switchTab('directory');
  showToast('Signed out successfully.');
});

/* ── 15. INIT ─────────────────────────────────────────────────── */
function init() {
  renderDirectory();
  refreshCount();

  // Restore session if one exists
  const session = Store.getSession();
  if (session) {
    loadProfile(session);
  } else {
    switchTab('directory');
  }
}

init();
