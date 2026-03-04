// ─── Storage helpers ──────────────────────────────────────────────────────────

function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function setSession(user) {
  sessionStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));
}

function getSession() {
  return JSON.parse(sessionStorage.getItem('currentUser') || 'null');
}

function clearSession() {
  sessionStorage.removeItem('currentUser');
}

// ─── Password hashing (SHA-256 via Web Crypto) ────────────────────────────────

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ─── Validation helpers ───────────────────────────────────────────────────────

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function getPasswordStrength(password) {
  return {
    length:  password.length >= 8,
    upper:   /[A-Z]/.test(password),
    number:  /[0-9]/.test(password),
  };
}

function setFieldState(input, errorEl, message) {
  if (message) {
    input.classList.add('invalid');
    input.classList.remove('valid');
    errorEl.textContent = message;
  } else {
    input.classList.remove('invalid');
    input.classList.add('valid');
    errorEl.textContent = '';
  }
}

function clearFieldState(input, errorEl) {
  input.classList.remove('invalid', 'valid');
  errorEl.textContent = '';
}

// ─── Toast ────────────────────────────────────────────────────────────────────

let toastTimer = null;

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.className = 'toast hidden';
  }, 3000);
}

// ─── View switcher ────────────────────────────────────────────────────────────

function showCard(id) {
  ['register-card', 'login-card', 'dashboard-card'].forEach(cardId => {
    const el = document.getElementById(cardId);
    if (cardId === id) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });
}

// ─── Password rules UI ────────────────────────────────────────────────────────

document.getElementById('reg-password').addEventListener('input', function () {
  const strength = getPasswordStrength(this.value);
  document.getElementById('rule-length').className = strength.length ? 'met' : '';
  document.getElementById('rule-upper').className  = strength.upper  ? 'met' : '';
  document.getElementById('rule-number').className = strength.number ? 'met' : '';

  document.getElementById('rule-length').textContent = (strength.length ? '✓' : '✗') + ' Al menos 8 caracteres';
  document.getElementById('rule-upper').textContent  = (strength.upper  ? '✓' : '✗') + ' Al menos una mayúscula';
  document.getElementById('rule-number').textContent = (strength.number ? '✓' : '✗') + ' Al menos un número';
});

// ─── Toggle password visibility ───────────────────────────────────────────────

document.querySelectorAll('.toggle-pw').forEach(btn => {
  btn.addEventListener('click', function () {
    const input = document.getElementById(this.dataset.target);
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    this.textContent = isHidden ? '🙈' : '👁';
  });
});

// ─── Navigation links ─────────────────────────────────────────────────────────

document.getElementById('go-login').addEventListener('click', e => {
  e.preventDefault();
  showCard('login-card');
});

document.getElementById('go-register').addEventListener('click', e => {
  e.preventDefault();
  showCard('register-card');
});

document.getElementById('logout-btn').addEventListener('click', () => {
  clearSession();
  showCard('login-card');
  showToast('Sesión cerrada correctamente');
});

// ─── Register form ────────────────────────────────────────────────────────────

document.getElementById('register-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nameInput     = document.getElementById('reg-name');
  const emailInput    = document.getElementById('reg-email');
  const pwInput       = document.getElementById('reg-password');
  const confirmInput  = document.getElementById('reg-confirm');

  const nameError    = document.getElementById('reg-name-error');
  const emailError   = document.getElementById('reg-email-error');
  const pwError      = document.getElementById('reg-password-error');
  const confirmError = document.getElementById('reg-confirm-error');

  let valid = true;

  // Name
  if (!nameInput.value.trim()) {
    setFieldState(nameInput, nameError, 'El nombre es obligatorio.');
    valid = false;
  } else if (nameInput.value.trim().length < 2) {
    setFieldState(nameInput, nameError, 'El nombre debe tener al menos 2 caracteres.');
    valid = false;
  } else {
    setFieldState(nameInput, nameError, '');
  }

  // Email
  if (!emailInput.value.trim()) {
    setFieldState(emailInput, emailError, 'El correo es obligatorio.');
    valid = false;
  } else if (!isValidEmail(emailInput.value)) {
    setFieldState(emailInput, emailError, 'Ingresa un correo válido.');
    valid = false;
  } else {
    setFieldState(emailInput, emailError, '');
  }

  // Password
  const strength = getPasswordStrength(pwInput.value);
  if (!pwInput.value) {
    setFieldState(pwInput, pwError, 'La contraseña es obligatoria.');
    valid = false;
  } else if (!strength.length || !strength.upper || !strength.number) {
    setFieldState(pwInput, pwError, 'La contraseña no cumple los requisitos.');
    valid = false;
  } else {
    setFieldState(pwInput, pwError, '');
  }

  // Confirm password
  if (!confirmInput.value) {
    setFieldState(confirmInput, confirmError, 'Confirma tu contraseña.');
    valid = false;
  } else if (confirmInput.value !== pwInput.value) {
    setFieldState(confirmInput, confirmError, 'Las contraseñas no coinciden.');
    valid = false;
  } else {
    setFieldState(confirmInput, confirmError, '');
  }

  if (!valid) return;

  // Check duplicate email
  const users = getUsers();
  if (users.find(u => u.email.toLowerCase() === emailInput.value.trim().toLowerCase())) {
    setFieldState(emailInput, emailError, 'Este correo ya está registrado.');
    return;
  }

  // Hash and save
  const hashed = await hashPassword(pwInput.value);
  const newUser = { name: nameInput.value.trim(), email: emailInput.value.trim().toLowerCase(), password: hashed };
  users.push(newUser);
  saveUsers(users);

  this.reset();
  ['reg-name','reg-email','reg-password','reg-confirm'].forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove('valid', 'invalid');
  });
  ['rule-length','rule-upper','rule-number'].forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove('met');
  });
  document.getElementById('rule-length').textContent = '✗ Al menos 8 caracteres';
  document.getElementById('rule-upper').textContent  = '✗ Al menos una mayúscula';
  document.getElementById('rule-number').textContent = '✗ Al menos un número';

  showToast('¡Registro exitoso! Ahora puedes iniciar sesión.');
  showCard('login-card');
});

// ─── Login form ───────────────────────────────────────────────────────────────

document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const emailInput = document.getElementById('log-email');
  const pwInput    = document.getElementById('log-password');
  const emailError = document.getElementById('log-email-error');
  const pwError    = document.getElementById('log-password-error');

  let valid = true;

  if (!emailInput.value.trim()) {
    setFieldState(emailInput, emailError, 'El correo es obligatorio.');
    valid = false;
  } else if (!isValidEmail(emailInput.value)) {
    setFieldState(emailInput, emailError, 'Ingresa un correo válido.');
    valid = false;
  } else {
    setFieldState(emailInput, emailError, '');
  }

  if (!pwInput.value) {
    setFieldState(pwInput, pwError, 'La contraseña es obligatoria.');
    valid = false;
  } else {
    setFieldState(pwInput, pwError, '');
  }

  if (!valid) return;

  const hashed = await hashPassword(pwInput.value);
  const users  = getUsers();
  const user   = users.find(
    u => u.email === emailInput.value.trim().toLowerCase() && u.password === hashed
  );

  if (!user) {
    setFieldState(pwInput, pwError, 'Correo o contraseña incorrectos.');
    return;
  }

  setSession(user);
  this.reset();
  clearFieldState(emailInput, emailError);
  clearFieldState(pwInput, pwError);

  // Show dashboard
  document.getElementById('dash-avatar').textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('dash-name').textContent   = user.name;
  document.getElementById('dash-email').textContent  = user.email;
  showCard('dashboard-card');
  showToast(`¡Hola, ${user.name.split(' ')[0]}!`);
});

// ─── Auto-restore session ─────────────────────────────────────────────────────

(function init() {
  const session = getSession();
  if (session) {
    document.getElementById('dash-avatar').textContent = session.name.charAt(0).toUpperCase();
    document.getElementById('dash-name').textContent   = session.name;
    document.getElementById('dash-email').textContent  = session.email;
    showCard('dashboard-card');
  } else {
    showCard('register-card');
  }
})();
