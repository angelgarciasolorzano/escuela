const optionMenu = document.querySelector(".select-menu"), selectBtn = optionMenu.querySelector(".select-btn"),
options = optionMenu.querySelectorAll(".option"), 
text = optionMenu.querySelector(".sBtn-text");

const form = document.querySelector('form');
const emailInput = document.getElementById('login-usuario');
const passwordInput = document.getElementById('login-pass');
const cargoInput = document.getElementById('login-cargo');
const submitBtn = document.querySelector('.sesion');

selectBtn.addEventListener('click', () => optionMenu.classList.toggle("active"));

options.forEach(option => {
  option.addEventListener('click', () => {
    let selectedOption = option.querySelector(".option-text").innerText;

    text.value = selectedOption;
    console.log(selectedOption);
    optionMenu.classList.add("active")
  });
});

const showHiddenPass = (loginPass, loginEye) => {
  const input = document.getElementById(loginPass), iconEye = document.getElementById(loginEye);

  iconEye.addEventListener('click', () => {
    if (input.type === 'password') {
      input.type = 'text';
      iconEye.classList.add('ri-eye-line');
      iconEye.classList.remove('ri-eye-off-line');
    } else {
      input.type = 'password';
      iconEye.classList.remove('ri-eye-line');
      iconEye.classList.add('ri-eye-off-line');
    }
  });
};
showHiddenPass('login-pass', 'login-eye');

function showError(message) {
  if (document.querySelector('.error')) { return; }

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  errorDiv.innerHTML = `
    <div class="error__icon">
      <i class="bi bi-exclamation-circle-fill"></i>
    </div>
    <div class="error__title">${message}</div>
    <div class="error__close">
      <i class="bi bi-x-lg close-btn"></i>
    </div>`;
  form.insertBefore(errorDiv, submitBtn.nextSibling);

  const closeBtn = document.querySelector('.close-btn');
  closeBtn.addEventListener('click', () => { errorDiv.remove(); });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let isValid = true;

  if (emailInput.value === '' || passwordInput.value === '' || cargoInput.value === '') {
    isValid = false;
    showError('Todos los campos son requeridos.');
  } else { form.submit(); }
});

document.addEventListener('DOMContentLoaded', () => {
  optionMenu.classList.add("active");
});