const nombre = document.getElementById('add-nombre');
const apellido = document.getElementById('add-apellidos');
const direccion = document.getElementById('add-direccion');
const fechaNac = document.getElementById('add-fechaNac');
const form = document.querySelector('form');
const mensaje = document.querySelector('.contenedor-alerta');

function showError(message) {
  const mensajeAnterior = document.querySelector('.mensaje');
  if (mensajeAnterior) {
    mensajeAnterior.remove();
  }

  const errorDiv = document.createElement('div');
  errorDiv.className = 'mensaje';
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
  mensaje.parentNode.insertBefore(errorDiv, mensaje);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (nombre.value === '' || apellido.value === '' || direccion.value === '' || fechaNac.value === '') {
    isValid = false;
    showError('Todos los campos son requeridos.');
  } else { form.submit(); }
});