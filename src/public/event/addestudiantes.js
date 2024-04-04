const nombre = document.getElementById('add-nombre');
const apellido = document.getElementById('add-apellido');
const barrio = document.getElementById('add-barrio');
const departamento = document.getElementById('add-departamento');
const edad = document.getElementById('add-edad');
const form = document.querySelector('form');
const botonEstudiantes = document.querySelector('.contenedor-todo');

function showError(message) {
  if (document.querySelector('.mensaje')) { return; }

  const errorDiv = document.createElement('div');
  errorDiv.className = 'mensaje';
  errorDiv.innerHTML = `
    <div class="error">
      <div class="error__icon">
        <i class="bi bi-exclamation-circle-fill"></i>
      </div>
      <div class="error__title">${message}</div>
      <div class="error__close">
        <i class="bi bi-x-lg close-btn"></i>
      </div>
    </div>`;
  botonEstudiantes.parentNode.insertBefore(errorDiv, botonEstudiantes.nextSibling);

  const closeBtn = document.querySelector('.close-btn');
  closeBtn.addEventListener('click', () => { errorDiv.remove(); });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let isValid = true;

  if (nombre.value === '' || apellido.value === '' || barrio.value === '' || departamento.value === '' || edad.value === '') {
    isValid = false;
    showError('Todos los campos son requeridos.');
  } else { form.submit(); }
});