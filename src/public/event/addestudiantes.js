//TODO DATOS DEL ESTUDIANTE

const nombreEst = document.getElementById('add-nombre-est');
const apellidoEst = document.getElementById('add-apellidos-est');
const direccionEst = document.getElementById('add-direccion-est');
const fechaEst = document.getElementById('add-fecha-est');
const nivelEst = document.getElementById('add-nivel-est');
const gradoEst = document.getElementById('add-grado-est');
const modalidadEst = document.getElementById('add-modalidad-est');

//TODO DATOS DEL TUTOR

const nombreTutor = document.getElementById('add-nombre-tut');
const apellidoTutor = document.getElementById('add-apellido-tut');
const ocupacionTutor = document.getElementById('add-ocupacion-tut');
const cedulaTutor = document.getElementById('add-cedula-tut');
const telefonoTutor = document.getElementById('add-telefono-tut');

//TODO MENSAJE Y FILA (DATATABLE)

const mensaje = document.querySelector('.contenedor-alerta');
let select_row = '';

//TODO FUNCION PARA MOSTRAR MENSAJE DE ERROR

function showError(message) {
  const mensajeAnterior = document.querySelector('.mensaje');
  if (mensajeAnterior) { mensajeAnterior.remove(); }

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

//TODO VERIFICAR DATOS DEL FORMULARIO
$('#btn_tutor').on("click", function (e) {
  e.preventDefault();
  const formu = document.getElementById('form-tutor');

  const data = {
    nombre_tutor: nombreTutor.value.trim().toUpperCase(), 
    apellido_tutor: apellidoTutor.value.trim().toUpperCase(),
    cedula_tutor: cedulaTutor.value.trim(),
    telefono_tutor: telefonoTutor.value.trim(),
    ocupacion_tutor: ocupacionTutor.value.trim()
  };

  axios.post('/api/verificar_tutor', data)
  .then(response => {
    const dataErrors = response.data;
    console.log(dataErrors);

    if (dataErrors.status === true) {
      for (let i = 0; formu.children.length > i; i++) {
        for (let j = 0; dataErrors.errors.length > j; j++){
          if (dataErrors.errors[j].path === formu.children[i].children[1].getAttribute('name')) {
            formu.children[i].children[1].classList.add('is-invalid');
            formu.children[i].children[1].classList.replace('border-secondary','border-danger');
            formu.children[i].lastElementChild.innerHTML = dataErrors.errors[j].msg;
          }
        }
      } 
    } 
  }).catch(error => console.log('Error', error.message));

  $("input[type='text']").on('input', function () {
      this.classList.remove('is-invalid');
      this.classList.replace('border-danger', 'border-secondary');
  });
});

//TODO DATOS DEL MODAL

$(document).ready(function() {
  $('#exampleModal').on('show.bs.modal', function () {
    var url = '/api/tutores';

    var table = $('#datatable_estudiante').DataTable({
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
      $('#datatable_estudiante').on("click", "td:not(:first-child)", function() {
        select_row = table.row(this).data();

        if (typeof select_row != 'undefined')
          console.log(select_row);
      });
    }; 

    $('#btn-aceptar').on('click', function () {
      if (typeof select_row != 'undefined') {
        nombreTutor.value = select_row.nombre_Tutor, apellidoTutor.value = select_row.apellido_Tutor,
        telefonoTutor.value = select_row.telefono_Tutor, ocupacionTutor.value = select_row.ocupacion,
        cedulaTutor.value = select_row.cedula_Tutor;

        table.destroy();
      }
    });
  });
});