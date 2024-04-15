//TODO Obtener elementos del formulario
//*Datos del estudiante
const nombreEst = document.getElementById('add-nombre-est');
const apellidoEst = document.getElementById('add-apellidos-est');
const direccionEst = document.getElementById('add-direccion-est');
const fechaEst = document.getElementById('add-fecha-est');
const nivelEst = document.getElementById('add-nivel-est');
const gradoEst = document.getElementById('add-grado-est');
const modalidadEst = document.getElementById('add-modalidad-est');

//*Datos del Tutor
const nombreTutor = document.getElementById('add-nombre-tut');
const apellidoTutor = document.getElementById('add-apellido-tut');
const ocupacionTutor = document.getElementById('add-ocupacion-tut');
const cedulaTutor = document.getElementById('add-cedula-tut');
const telefonoTutor = document.getElementById('add-telefono-tut');

//*Clase para el mensaje y formulario
const form = document.querySelector('form');
const mensaje = document.querySelector('.contenedor-alerta');

//TODO Declarando funcion para crear mensaje
function showError(message) {
  //*Si el mensaje ya existe lo quitamos
  const mensajeAnterior = document.querySelector('.mensaje');
  if (mensajeAnterior) { mensajeAnterior.remove(); }

  //*Creando div para crera un contenedor del mensaje
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
  //*Insertando mensaje despues del titulo (Hoja de Matricula)
  mensaje.parentNode.insertBefore(errorDiv, mensaje);
};

//TODO Validando formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let isValid = true;

  //*Si los campos estan vacios, los datos no se envian al servidor
  if (nombreEst.value === '' || apellidoEst.value === '' || direccionEst.value === '' || fechaEst.value === '' 
  || nombreTutor.value === '' || apellidoTutor.value === '' || ocupacionTutor.value === '' || telefonoTutor.value === '' 
  || cedulaTutor.value === '') {
    isValid = false;
    showError('Todos los campos son requeridos.');
    
  //*Si los campos estan llenos, enviamos los datos al servidor
  } else { form.submit(); }
});