const form = document.querySelector('form');
const emailInput = document.getElementById('login-usuario');
const passwordInput = document.getElementById('login-pass');
const cargoInput = document.getElementById('login-cargo');

function showError(message) {
  const mensajeAnterior = document.querySelector('.error');
  if (mensajeAnterior) {
    mensajeAnterior.remove();
  }

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  errorDiv.innerHTML = `
  <div class="container p-2">
    <div class="row">
      <div class="col-md-5 mx-auto">
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Advertencia!</strong> ${ message }.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      </di>
    </div>
  </div>`;

  const navbar = document.querySelector('.navbar');
  navbar.after(errorDiv);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let isValid = true;

  if (emailInput.value === '' || passwordInput.value === '' || cargoInput.value === '') {
    isValid = false;
    showError('Todos los campos son requeridos.');
  } else { form.submit(); }
});