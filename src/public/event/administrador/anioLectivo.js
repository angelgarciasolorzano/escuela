const anio_lectivo = document.getElementById('anio-lectivo');
const fecha_inicial = document.getElementById('fecha-inicial');
const fecha_final = document.getElementById('fecha-final');
const fecha_inicial_ma = document.getElementById('fecha-inicial-matricula');
const fecha_final_ma = document.getElementById('fecha-final-matricula');
const fecha_inicial_rep = document.getElementById('fecha-inicial-reparacion');
const fecha_final_rep = document.getElementById('fecha-final-reparacion');

// Obtener el año siguiente
const nextYear = new Date().getFullYear() + 1;
fecha_inicial.min = `${nextYear}-01-01`; // Fecha mínima: 1 de enero del año siguiente
fecha_inicial.max = `${nextYear}-12-31`; // Fecha máxima: 31 de diciembre del próximo año
fecha_final.min = `${nextYear}-01-01`; // Fecha mínima: 1 de enero del año siguiente
fecha_final.max = `${nextYear}-12-31`; // Fecha máxima: 31 de diciembre del próximo año
fecha_inicial_ma.min = `${nextYear}-01-01`; // Fecha mínima: 1 de enero del año siguiente
fecha_inicial_ma.max = `${nextYear}-12-31`; // Fecha máxima: 31 de diciembre del próximo año
fecha_final_ma.min = `${nextYear}-01-01`; // Fecha mínima: 1 de enero del año siguiente
fecha_final_ma.max = `${nextYear}-12-31`; // Fecha máxima: 31 de diciembre del próximo año
fecha_inicial_rep.min = `${nextYear}-01-01`; // Fecha mínima: 1 de enero del año siguiente
fecha_inicial_rep.max = `${nextYear}-12-31`; // Fecha máxima: 31 de diciembre del próximo año
fecha_final_rep.min = `${nextYear}-01-01`; // Fecha mínima: 1 de enero del año siguiente
fecha_final_rep.max = `${nextYear}-12-31`; // Fecha máxima: 31 de diciembre del próximo año


$('#fecha-inicial').on('change', function () {
  if (fecha_inicial.value) {
    const anio = fecha_inicial.value.split('-')[0];
    anio_lectivo.value = anio;
  }
});//Añadimos el año lectivo al input anio lectivo

$('#btn-crearAnio').on('click', function () {
  const formAnioLectivo = {
    anio_lectivo: anio_lectivo.value,
    fecha_inicial: fecha_inicial.value,
    fecha_final: fecha_final.value,
    fecha_inicial_ma: fecha_inicial_ma.value,
    fecha_inicial_rep: fecha_inicial_rep.value,
    fecha_final_rep: fecha_final_rep.value,
    fecha_final_ma: fecha_final_ma.value
  };//Body para mandarlo con el axios
  verificarForms(formAnioLectivo);
  $('#fecha-inicial, #fecha-final, #fecha-inicial-matricula, #fecha-final-matricula, #fecha-inicial-reparacion, #fecha-final-reparacion').on('change', limpiarErrores);
});//evento click para inicializar el año lectivo


//Datatable años lectivos recientes
var url = '/api/anioslectivos_recientes';
var tabla_aniosLectivos = new DataTable('#dt-aniosLectivos', {
  processing: true,
  serverSide: true,
  deferRender: true,
  ajax: {
    url: url,
    type: 'GET'
  },
  aaSorting: [],
  ordering: false,
  columns: [
    { data: "anio" },
    { data: "estado" },
    { data: "fecha_inicial" },
    { data: "fecha_final" },
    { defaultContent: `<button type="button" class="finalizar btn btn-danger"><i class="fa-solid fa-arrow-right-to-bracket"></i></button>` }
  ],
  columnDefs: [
    {
      className: "text-center", targets: [0, 1, 2, 3, 4]
    },
    {
      className: "dt-items-center", targets: [0, 1, 2, 3, 4]
    }
  ],
  destroy: true,
  responsive: {
    breakpoints: [
      { name: 'desktop', width: Infinity },
      { name: 'tablet-l', width: 1024 },
      { name: 'tablet-p', width: 768 },
      { name: 'mobile-l', width: 480 },
      { name: 'mobile-p', width: 320 }
    ]
  },
  lengthMenu: [5, 10, 15, 20],
  pageLength: 5,
  language: {
    lengthMenu: "Mostrar _MENU_ registros por página",
    emptyTable: "A la espera de búsqueda...",
    zeroRecords: "Ningún año lectivo encontrado",
    info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
    infoEmpty: "Ningún año lectivo encontrado",
    infoFiltered: "(filtrados desde _MAX_ registros totales)",
    search: "Buscar:",
    loadingRecords: "Cargando...",
    paginate: {
      first: "Primero",
      last: "Último",
      next: "Siguiente",
      previous: "Anterior"
    }
  }
});

$('#dt-aniosLectivos tbody').on("click", "button.finalizar", function () {
  var data_aniosLectivos = tabla_aniosLectivos.row($(this).parents("tr")).data();
  finalizarAniosLectivos(data_aniosLectivos.id_aniolectivo);
});

async function verificarForms(formAniolectivo) {
  try {
    const response = await axios.post('/api/verificar_aniolectivo', formAniolectivo);
    const datosErrores = response.data;
    if (datosErrores.status === true) {
      mostrarErrores(datosErrores);
    }
    else { crearAnioLectivo(formAniolectivo); }
  } catch (error) { console.log('Error', error.message); }
};//Evalua que los datos ingresados sean los correctos
function crearAnioLectivo(formAniolectivo) {
  crearModal('crearAnioLectivo', 'btn-aceptar-crearAnioLectivo', '¿Deseas crear este año lectivo?');
  $("#crearAnioLectivo").modal("show");
  $("#btn-aceptar-crearAnioLectivo").on("click", function (e) {
    e.preventDefault();
    $("#crearAnioLectivo").modal('hide')
    axios.post('/api/crear_aniolectivo', formAniolectivo)
      .then(response => {
        const result = response.data;
        if (result.success == true) {
          showToast('success', 'fa-solid fa-circle-check', result.msg);
          limpiar_formAnioLectivo();
          tabla_aniosLectivos.ajax.url(url).load();
        } else {
          showToast('danger', 'bi bi-exclamation-circle-fill', result.msg);
        }
      })
      .catch(err => console.log('Error', err.message));
  });
}
function finalizarAniosLectivos(id_aniolectivo) {
  crearModal('finalizarAnioLectivo', 'btn-aceptar-finalizar', '¿Deseas finalizar este año lectivo?');
  $("#finalizarAnioLectivo").modal("show");
  $("#btn-aceptar-finalizar").on("click", function (e) {
    e.preventDefault();
    $("#finalizarAnioLectivo").modal('hide')
    axios.post('/api/finalizar_aniolectivo', { id_aniolectivo: id_aniolectivo })
      .then(response => {
        const result = response.data;
        if (result.success == true) {
          showToast('success', 'fa-solid fa-circle-check', result.msg);
          tabla_aniosLectivos.ajax.url(url).load();
        } else {
          showToast('danger', 'bi bi-exclamation-circle-fill', result.msg);
        }
      })
      .catch(err => console.log('Error', err.message));
  });
}//Funcion que permite finalizar el año lectivo mediante su id
function limpiarErrores() {
  $(this).removeClass('is-invalid');
  $(this).removeClass('border-danger');
  $(this).addClass('border-secondary');
};//Funcion para eliminar los inputs y selects
function limpiar_formAnioLectivo() {
  const elements = ['#fecha-inicial, #fecha-final, #fecha-inicial-matricula, #fecha-final-matricula, #fecha-inicial-reparacion, #fecha-final-reparacion'];
  elements.forEach(selector => {
    $(selector).val('');
  });
  anio_lectivo.value = '';
};//Limpia los inputs
function mostrarErrores(dataErrors) {
  if (dataErrors.status === true) {
    const { errors } = dataErrors;
    for (const error of errors) {
      const inputName = error.path;
      const inputElement = document.querySelector(`[name="${inputName}"]`);
      if (inputElement) {
        inputElement.classList.add('is-invalid');
        inputElement.classList.replace('border-secondary', 'border-danger');
        inputElement.nextElementSibling.innerHTML = error.msg;
      }
      inputElement.focus();
    }
    return false;
  } else {
    return true;
  }
};//Funcion para mostrar los errores en caso de que existan
//componentes
function showToast(tipo, icono, mensaje) {
  const messageDiv = document.getElementById('toast-notificacion');
  messageDiv.innerHTML = '';
  messageDiv.innerHTML = `
    <div class="toast-container position-fixed top-5 end-0 p-3">
        <div class="toast align-items-center text-bg-${tipo}" id="toast-message" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <div class="d-flex flex-row align-items-center">
                        <div class="pe-4">
                            <i class="${icono}"></i>
                        </div>
                        <h6 class="pe-4">${mensaje}</h6>
                    </div>
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    </div>`;
  $('#toast-message').toast('show');
  const toast = document.getElementById('toast-message');
  setTimeout(() => {
    toast.remove();
  }, 4000);
};//Componente reutilizable que muestra un toast de notificacion
function crearModal(id_modal, id_btn_aceptar, mensaje) {
  const crearModal = document.getElementById('crearModal');
  crearModal.innerHTML = '';
  crearModal.innerHTML = `<div class="modal" tabindex="-1" id="${id_modal}" data-bs-backdrop="static" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm" style="border-radius: 2px;">
      <div class="modal-content">
        <div class="modal-body border border-secondary" style="background-color: #17171c;">
          <div class="container-fluid">
            <div class="row">
              <div class="text-center">
                <i class="fa-solid fa-triangle-exclamation" style="color: rgb(244, 197, 5); font-size: 80px;"></i>
              </div>
              <div class="py-3" style="color: white;">
                <div class="text-center">
                  <h2>¿Estás Seguro?</h2>
                </div>
                <div class="text-center">
                  <strong>${mensaje}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer border border-secondary" style="background-color:  #5dade2">
          <button type="button" class="btn btn-danger mx-auto w-30px" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-primary mx-auto w-30px" id="${id_btn_aceptar}">Aceptar</button>
        </div>
      </div>
    </div>
  </div>`;
};//Funcion que permite crear un modal personalizado
