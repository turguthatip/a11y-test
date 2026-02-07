document.querySelector('.js-sign-in-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const emailInput = document.getElementById('js-email');
  const passwordInput = document.getElementById('js-password');
  const emailError = document.getElementById('js-email-error');
  const passwordError = document.getElementById('js-password-error');

  let isValid = true;

  // Clear previous errors
  emailError.textContent = '';
  passwordError.textContent = '';
  emailInput.setAttribute('aria-invalid', 'false');
  passwordInput.setAttribute('aria-invalid', 'false');

  // Validate email
  if (!emailInput.value.trim()) {
    emailError.textContent = 'Email is required.';
    emailInput.setAttribute('aria-invalid', 'true');
    isValid = false;
    emailInput.focus();
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
    emailError.textContent = 'Please enter a valid email address.';
    emailInput.setAttribute('aria-invalid', 'true');
    isValid = false;
    emailInput.focus();
  }

  // Validate password
  if (isValid && !passwordInput.value.trim()) {
    passwordError.textContent = 'Password is required.';
    passwordInput.setAttribute('aria-invalid', 'true');
    isValid = false;
    passwordInput.focus();
  }

  if (isValid) {
    this.submit();
  }
});
