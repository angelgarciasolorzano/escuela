//TODO Datos del Estudiante

const nombreEst = document.getElementById('add-nombre-est');
const apellidoEst = document.getElementById('add-apellidos-est');
const direccionEst = document.getElementById('add-direccion-est');
const fechaEst = document.getElementById('add-fecha-est');
const generoEst = document.getElementById('add-genero-est');
const nivelEst = document.getElementById('add-nivel-est');
const gradoEst = document.getElementById('add-grado-est');
const modalidadEst = document.getElementById('add-modalidad-est');

//TODO Datos del Tutor

const nombreTutor = document.getElementById('add-nombre-tut');
const apellidoTutor = document.getElementById('add-apellido-tut');
const ocupacionTutor = document.getElementById('add-ocupacion-tut');
const cedulaTutor = document.getElementById('add-cedula-tut');
const telefonoTutor = document.getElementById('add-telefono-tut');

//TODO Mensaje Y Fila (DataTable)

const mensaje = document.querySelector('.contenedor-alerta');
let select_row = '';

//TODO Funcion para limpiar Inputs

function limpiarInputs() {
  const inputs = document.querySelectorAll('input');

  inputs.forEach(function(input) {
    if (input.type !== 'submit') { input.value = ''; }
  });
};

//TODO Funcion para mostrar mensajes de papeles Faltantes

function mensajePapeles() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  let documentosSeleccionados = [];

  checkboxes.forEach(function (checkbox) {
    if (checkbox.checked) { documentosSeleccionados.push(checkbox.value); }
  });

  const mensaje = document.getElementById('mensaje-error');

  if (documentosSeleccionados.length === checkboxes.length) { mensaje.style.display = 'none'; } 
  else {
    const documentosFaltantes = [];

    checkboxes.forEach(function (checkbox) {
      if (!checkbox.checked) { documentosFaltantes.push(checkbox.value); }
    });

    mensaje.textContent = `Debe seleccionar ${documentosFaltantes.join(', ')} para continuar`;
    mensaje.style.display = 'block';
  }
};

//TODO Funcion para verificar el total de check Seleccionados

function hayChecksPorSeleccionar() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  let hayChecksNoSeleccionados = false;

  checkboxes.forEach(function(checkbox) {
    if (!checkbox.checked) { hayChecksNoSeleccionados = true; }
  });

  return hayChecksNoSeleccionados;
};

//TODO Eventos DOM

document.querySelectorAll('input[type="checkbox"]').forEach(function (checkbox) {
  checkbox.addEventListener('change', mensajePapeles);
});

nivelEst.addEventListener('change', function() {
  this.classList.remove('is-invalid', 'border-danger');
  this.classList.add('border-secondary');
});

nivelEst.addEventListener('change', function() {
  const selectedNivel = nivelEst.value;
  gradoEst.placeholder = selectedNivel === 'Primaria' ? 'Ingresar Grado' : 'Ingresar Año';
});

//TODO Eventis JQuery

$("input[type='text']").on('input', function () {
  this.classList.remove('is-invalid');
  this.classList.replace('border-danger', 'border-secondary');
});

$("input[type='date']").on('input', function () {
  this.classList.remove('is-invalid');
  this.classList.replace('border-danger', 'border-secondary');
});

$("input[type='number']").on('input', function () {
  this.classList.remove('is-invalid');
  this.classList.replace('border-danger', 'border-secondary');
});

//TODO Funcion para mostrar Mensajes de Error / Exito

function showMensaje(mensajeDescrip, alertClass, mensajeAlert) {
  const mensajeAnterior = document.querySelector('.mensaje');
  if (mensajeAnterior) { mensajeAnterior.remove(); }

  const errorDiv = document.createElement('div');
  errorDiv.className = 'mensaje';
  errorDiv.innerHTML = `
    <div class="container w-50"> 
      <div class="alert ${ alertClass } alert-dismissible fade show" role="alert">
        <strong>${ mensajeAlert }</strong> ${ mensajeDescrip }.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    </div>`
  mensaje.parentNode.insertBefore(errorDiv, mensaje);
};

//TODO Funcion para verificar respuesta del Servidor

function respuestaServidor(respuesta) {
  const limpiarErrores = document.querySelectorAll('[name]');
  let errorMessages = {};

  respuesta.errors.forEach(error => {
    if (errorMessages[error.path] && errorMessages[error.path].shown) {
      document.querySelector(`[name="${error.path}"]`).nextElementSibling.innerHTML = '';
    }
  });

  limpiarErrores.forEach(elemento => {
    const erroresName = elemento.getAttribute('name');
  
    elemento.classList.remove('is-invalid');
    elemento.classList.replace('border-danger', 'border-secondary');

    errorMessages[erroresName] = { shown: false };
  });

  const elementosConNombre = document.querySelectorAll('[name]');

  elementosConNombre.forEach(elemento => {
    const nombreAtributo = elemento.getAttribute('name');
    const error = respuesta.errors.find(error => error.path === nombreAtributo);
  
    if (error) {
      elemento.classList.add('is-invalid');
      elemento.classList.replace('border-secondary', 'border-danger');
      elemento.nextElementSibling.innerHTML = error.msg;
    }
  });
};

//TODO Funcion para recibir respuesta de la Matricula

async function datosMatricula(datos) {
  try {
    const response = await axios.post('/secretaria/registro', datos);
    
    if (response.data.success) { limpiarInputs(); showMensaje(response.data.message, "alert-primary", "Aviso !"); } 
    else { showMensaje(response.data.message, "alert-danger"); }

  } catch (error) { console.log("Error:", error); }
};

//TODO Funcion para enviar datos al Servidor

async function enviarDatos(data) {
  try {
    const response = await axios.post('/api/verificarMatricula', data);
    const datosErrores = response.data;

    if (datosErrores.status === true || hayChecksPorSeleccionar()) { respuestaServidor(datosErrores); } 
    else { datosMatricula(data); }

  } catch (error) { console.log('Error', error.message); }
};

//TODO Funcion para quitar Clases

function modalDatosClases() {
  nombreTutor.classList.remove('is-invalid', 'border-danger');
  apellidoTutor.classList.remove('is-invalid', 'border-danger');
  cedulaTutor.classList.remove('is-invalid', 'border-danger');
  telefonoTutor.classList.remove('is-invalid', 'border-danger');
  ocupacionTutor.classList.remove('is-invalid', 'border-danger');

  nombreTutor.classList.add('border-secondary');
  apellidoTutor.classList.add('border-secondary');
  cedulaTutor.classList.add('border-secondary');
  telefonoTutor.classList.add('border-secondary');
  ocupacionTutor.classList.add('border-secondary');
};

//TODO Verficar datos del Formulario

$('#btn-aceptarMatricula').on('click', function (e) {
  e.preventDefault();

  const data = {
    nombre_est: nombreEst.value.trim(),
    apellidos_est: apellidoEst.value.trim(),
    direccion_est: direccionEst.value.trim(),
    fecha_est: fechaEst.value,
    genero_est: generoEst.value,
    nivel_est: nivelEst.value,
    grado_est: gradoEst.value,

    id_tutor: select_row.id_Tutor,
    nombre_tutor: nombreTutor.value.trim(), 
    apellido_tutor: apellidoTutor.value.trim(),
    cedula_tutor: cedulaTutor.value.trim(),
    telefono_tutor: telefonoTutor.value.trim(),
    ocupacion_tutor: ocupacionTutor.value.trim()
  };

  if(hayChecksPorSeleccionar) { mensajePapeles(); enviarDatos(data); } 
  else { enviarDatos(data); }
});

//TODO Datos del Modal

$(document).ready(function() {
  $('#modalTutores').on('show.bs.modal', function () {
    var url = '/api/tutores';

    var table = $('#datatableTutores').DataTable({
      processing: true,
      ajax: {
        url: url,
        dataSrc: ''
      },
      aaSorting : [],
      columns: [
        { data: "nombre_Tutor" },
        { data: "apellido_Tutor" },
        { data: "telefono_Tutor" }
      ],
      destroy: true,
      select: true,
      select: {
        style: 'single',
        toggleable: false,
        item: 'row',
        style: 'os',
        selector: 'td:not(:first-child)'
      },
      responsive: true,
      responsive: {
        breakpoints: [
          { name: 'bigdesktop', width: Infinity },
          { name: 'meddesktop', width: 1480 },
          { name: 'smalldesktop', width: 1280 },
          { name: 'medium', width: 1188 },
          { name: 'tablet-l', width: 1024 },
          { name: 'btwtabllandp', width: 848 },
          { name: 'tablet-p', width: 768 },
          { name: 'mobile-l', width: 480 },
          { name: 'mobile-p', width: 320 }
        ]
      },
      lengthMenu: [5, 6],
      pageLength: 5,
      language: {
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Tutor No Encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros ",
        infoEmpty: "Ningún Tutor Encontrado",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar:",
        loadingRecords: "Cargando...",
        paginate: {
          first: "Primero",
          last: "Último",
          next: "Siguiente",
          previous: "Anterior"
        },
        select: {
          rows: {
            _: ' %d Filas seleccionadas',
            1: ' 1 Fila Seleccionada'
          }
        }
      }
    });

    if (table) {
      $('#datatableTutores').on("click", "td:not(:first-child)", function() {
        select_row = table.row(this).data();
      });
    }

    $('#btn-aceptar').on('click', function () {
      if (typeof select_row !== 'undefined' && select_row !== '') {
        nombreTutor.value = select_row.nombre_Tutor, apellidoTutor.value = select_row.apellido_Tutor,
        telefonoTutor.value = select_row.telefono_Tutor, ocupacionTutor.value = select_row.ocupacion,
        cedulaTutor.value = select_row.cedula_Tutor;

        /*nombreTutor.disabled = true;
        apellidoTutor.disabled = true;
        ocupacionTutor.disabled = true;
        cedulaTutor.disabled = true;
        $('#modalAdvertencia').modal('hide');
        $('#modalAdvertencia').modal('show');*/

        modalDatosClases();
        table.destroy();
      }
    });
  });
});