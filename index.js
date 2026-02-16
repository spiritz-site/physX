let authMode = 'register';
let lastEmail = '';
let lastPassword = '';
let isBusy = false;

const modal = document.getElementById('authModal');
const steps = ['stepEmail', 'stepReg'];
const toastWrap = document.getElementById('toastWrap');

window.addEventListener('load', () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  syncThemeIcons(savedTheme);
  initCustomSelects();
});

function showToast(message, type = 'info', timeout = 3000) {
  if(!toastWrap) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="left">
      <div class="dot"></div>
      <div class="msg">${escapeHtml(message)}</div>
    </div>
    <button class="close" aria-label="close">&times;</button>
  `;
  toastWrap.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  const closeBtn = toast.querySelector('.close');
  const remove = () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  };

  closeBtn.addEventListener('click', remove);
  setTimeout(remove, timeout);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
}

function syncThemeIcons(theme){
  const sun = document.querySelector('.sun-icon');
  const moon = document.querySelector('.moon-icon');
  if(!sun || !moon) return;
  sun.style.display = theme === 'dark' ? 'none' : 'block';
  moon.style.display = theme === 'dark' ? 'block' : 'none';
}

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  syncThemeIcons(next);
}

document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

function showStep(stepId) {
  steps.forEach(id => document.getElementById(id)?.classList.remove('active'));
  const target = document.getElementById(stepId);
  target?.classList.add('active');

  if(stepId === 'stepEmail') setTimeout(() => document.getElementById('emailInput')?.focus(), 50);
  if(stepId === 'stepReg')   setTimeout(() => document.getElementById('regName')?.focus(), 50);
}

function openModal(e) {
  if(e) e.preventDefault();
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  showStep('stepEmail');
  setAuthMode('register');
}

function closeModal() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  closeAllSelects();
}

document.getElementById('startLink')?.addEventListener('click', openModal);

modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

document.getElementById('modalCloseBtn')?.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && modal.classList.contains('active')) {
    if(document.querySelector('.cselect.open')) closeAllSelects();
    else closeModal();
  }
});

function setAuthMode(mode) {
  authMode = mode;

  const loginBtn = document.getElementById('authLoginBtn');
  const regBtn   = document.getElementById('authRegisterBtn');
  loginBtn?.classList.toggle('active', mode === 'login');
  regBtn?.classList.toggle('active', mode === 'register');

  const titleEl = document.querySelector('#stepEmail .modal-title');
  const descEl  = document.querySelector('#stepEmail .modal-desc');
  const mainBtn = document.getElementById('mainAuthBtn');
  const passwordInput = document.getElementById('passwordInput');

  if (!titleEl || !descEl || !mainBtn) return;

  if (mode === 'login') {
    titleEl.textContent = 'Кіру';
    descEl.textContent  = 'Жалғастыру үшін электронды поштаңызды енгізіңіз';
    mainBtn.textContent = 'Жалғастыру';
    if(passwordInput) passwordInput.placeholder = 'Құпиясөзіңізді енгізіңіз';
  } else {
    titleEl.textContent = 'Тіркелу';
    descEl.textContent  = 'Тіркелу үшін электронды пошта және құпиясөз енгізіңіз';
    mainBtn.textContent = 'Жалғастыру';
    if(passwordInput) passwordInput.placeholder = 'Құпиясөз ойлап табыңыз';
  }
}

document.getElementById('authLoginBtn')?.addEventListener('click', () => setAuthMode('login'));
document.getElementById('authRegisterBtn')?.addEventListener('click', () => setAuthMode('register'));

function togglePassword() {
  const input = document.getElementById('passwordInput');
  const icon = document.getElementById('eyeIcon');
  if(!input || !icon) return;

  if(input.type === 'password') {
    input.type = 'text';
    icon.textContent = '🙈';
  } else {
    input.type = 'password';
    icon.textContent = '👁️';
  }
}

document.getElementById('passwordToggleBtn')?.addEventListener('click', togglePassword);

function setBusy(btn, busy){
  isBusy = busy;
  if(!btn) return;
  btn.disabled = !!busy;
  btn.classList.toggle('btn-loading', !!busy);
}

function markInvalid(el){
  if(!el) return;
  el.style.borderColor = '#ff4444';
  el.style.backgroundColor = 'rgba(255, 68, 68, 0.08)';
  el.classList.add('shake');
  setTimeout(() => el.classList.remove('shake'), 420);
  setTimeout(() => { el.style.borderColor = ''; el.style.backgroundColor=''; }, 1800);
}

function isValidEmail(email){
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isValidPassword(password) {
  return password.length >= 6;
}

document.addEventListener('keydown', (e) => {
  if(!modal.classList.contains('active')) return;

  if(e.key === 'Enter'){
    const activeStep = steps.find(id => document.getElementById(id)?.classList.contains('active'));
    if(document.querySelector('.cselect.open')) return;

    if(activeStep === 'stepEmail') { e.preventDefault(); handleAuth(); }
    if(activeStep === 'stepReg')   { e.preventDefault(); finishRegistration(); }
  }
});

function handleAuth() {
  if(isBusy) return;

  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const email = (emailInput?.value || '').trim();
  const password = (passwordInput?.value || '').trim();

  if (!isValidEmail(email)) {
    markInvalid(emailInput);
    showToast("Email дұрыс жазыңыз", "warn");
    return;
  }

  if (!isValidPassword(password)) {
    markInvalid(passwordInput);
    showToast("Құпиясөз кемінде 6 символдан тұруы керек", "warn");
    return;
  }

  lastEmail = email;
  lastPassword = password;

  const btn = document.getElementById('mainAuthBtn');
  setBusy(btn, true);

  setTimeout(() => {
    setBusy(btn, false);

    if (authMode === 'login') {
      showToast("Сәтті кірдіңіз!", "success", 1200);
      try {
        // If user profile is not created yet (login without registration), create a minimal one
        if (!localStorage.getItem('physx_user')) {
          const guessName = (email.split('@')[0] || 'Оқушы');
          const g = localStorage.getItem('physx_selected_grade') || '8';
          localStorage.setItem('physx_user', JSON.stringify({ role: 'student', name: guessName, email, grade: g }));
        }
      } catch(e) {}
      setTimeout(() => window.location.href = "home.html", 600);
    } else {
      showToast("Құпиясөз қабылданды", "success");
      showStep('stepReg');
    }
  }, 650);
}

document.getElementById('mainAuthBtn')?.addEventListener('click', handleAuth);

function finishRegistration() {
  if(isBusy) return;

  const nameInput = document.getElementById('regName');
  const name = (nameInput?.value || '').trim();
  if (!name) {
    markInvalid(nameInput);
    showToast("Атыңызды жазыңыз", "warn");
    return;
  }

  const data = {
    role: 'student',
    name,
    email: lastEmail,
    password: lastPassword,
    grade: document.getElementById('regGrade')?.value || '',
    goal: document.getElementById('regGoal')?.value || ''
  };

  const btn = document.getElementById('finishRegBtn');
  setBusy(btn, true);

  setTimeout(() => {
    setBusy(btn, false);
    console.log("Registration Data:", data);
    try {
      localStorage.setItem('physx_user', JSON.stringify(data));
      localStorage.setItem('physx_selected_grade', data.grade || '8');
    } catch(e) {}
    showToast("Тіркелу сәтті аяқталды!", "success", 1200);
    setTimeout(() => window.location.href = "home.html", 700);
  }, 750);
}

document.getElementById('finishRegBtn')?.addEventListener('click', finishRegistration);

document.getElementById('termsLink')?.addEventListener('click', (e) => {
  e.preventDefault();
  showToast('Ережелерді кейін жеке бетке шығарасыз','info',3500);
});

function initCustomSelects(){
  const selects = document.querySelectorAll('.cselect');

  selects.forEach(cs => {
    const btn = cs.querySelector('.cselect-btn');
    const items = Array.from(cs.querySelectorAll('.cselect-item'));
    const searchInput = cs.querySelector('.cselect-search input');
    const targetId = cs.getAttribute('data-target');
    const target = document.getElementById(targetId);

    const selected = items.find(i => i.getAttribute('aria-selected') === 'true') || items[0];
    if(selected){
      setSelected(cs, selected, {silent:true});
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if(cs.classList.contains('open')) closeSelect(cs);
      else openSelect(cs);
    });

    items.forEach((it) => {
      it.addEventListener('click', () => {
        setSelected(cs, it);
        closeSelect(cs);
        btn.focus();
      });
    });

    if (searchInput) {
  searchInput.addEventListener('input', () => {
    const q = (searchInput.value || '').trim().toLowerCase();
    items.forEach(it => {
      const text = it.innerText.toLowerCase();
      it.style.display = text.includes(q) ? '' : 'none';
    });
    setActiveItem(cs, getVisibleItems(cs)[0]);
  });
}
    cs.addEventListener('keydown', (e) => {
      if(!cs.classList.contains('open')) return;

      const visible = getVisibleItems(cs);
      if(!visible.length) return;

      const active = cs.querySelector('.cselect-item.active') || visible[0];
      const idx = visible.indexOf(active);

      if(e.key === 'ArrowDown'){
        e.preventDefault();
        const next = visible[Math.min(idx + 1, visible.length - 1)];
        setActiveItem(cs, next);
        next.scrollIntoView({block:'nearest'});
      }

      if(e.key === 'ArrowUp'){
        e.preventDefault();
        const prev = visible[Math.max(idx - 1, 0)];
        setActiveItem(cs, prev);
        prev.scrollIntoView({block:'nearest'});
      }

      if(e.key === 'Enter'){
        e.preventDefault();
        setSelected(cs, active);
        closeSelect(cs);
        btn.focus();
      }

      if(e.key === 'Escape'){
        e.preventDefault();
        closeSelect(cs);
        btn.focus();
      }
    });

    document.addEventListener('click', (e) => {
      if(!cs.classList.contains('open')) return;
      if(!cs.contains(e.target)) closeSelect(cs);
    });

    function setSelected(root, item, opts={silent:false}){
      const all = Array.from(root.querySelectorAll('.cselect-item'));
      all.forEach(x => x.setAttribute('aria-selected','false'));
      item.setAttribute('aria-selected','true');

      const mainText = item.querySelector('span')?.textContent?.trim() || item.textContent.trim();
      const current = root.querySelector('[data-current]');
      if(current) current.textContent = mainText;

      const val = item.getAttribute('data-value') || '';
      if(target) target.value = val;

      setActiveItem(root, item);

      if(!opts.silent){
        showToast("Таңдалды: " + mainText, "success", 900);
      }
    }

    function openSelect(root){
      closeAllSelects(root);
      root.classList.add('open');
      root.querySelector('.cselect-btn')?.setAttribute('aria-expanded','true');

      const si = root.querySelector('.cselect-search input');
      if(si){
        si.value = '';
        Array.from(root.querySelectorAll('.cselect-item')).forEach(it => it.style.display='');
        setTimeout(() => si.focus(), 0);
      }

      const sel = root.querySelector('.cselect-item[aria-selected="true"]') || getVisibleItems(root)[0];
      setActiveItem(root, sel);
      sel?.scrollIntoView({block:'nearest'});
    }

    function closeSelect(root){
      root.classList.remove('open');
      root.querySelector('.cselect-btn')?.setAttribute('aria-expanded','false');
      Array.from(root.querySelectorAll('.cselect-item')).forEach(it => it.classList.remove('active'));
    }

    function setActiveItem(root, item){
      Array.from(root.querySelectorAll('.cselect-item')).forEach(it => it.classList.remove('active'));
      if(item) item.classList.add('active');
    }

    function getVisibleItems(root){
      return Array.from(root.querySelectorAll('.cselect-item')).filter(it => it.style.display !== 'none');
    }
  });
}

function closeAllSelects(except){
  document.querySelectorAll('.cselect.open').forEach(cs => {
    if(except && cs === except) return;
    cs.classList.remove('open');
    cs.querySelector('.cselect-btn')?.setAttribute('aria-expanded','false');
    cs.querySelectorAll('.cselect-item').forEach(it => it.classList.remove('active'));
  });
}
