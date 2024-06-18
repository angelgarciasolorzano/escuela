document.addEventListener('DOMContentLoaded', (event) => {

  const grupos = document.getElementById('grupos');
  const profesor = document.getElementById('profesor');
  var datos_formGrupoGuia = {};

  mostrarGruposDisponibles('grupos');
  mostrarProfesoresDisponibles('profesor');

  $('#btn-asignarGrupo').on('click', function (e) {
    e.preventDefault();
    if (validarAsignar() === 0) {
      datos_formGrupoGuia = { id_grupos: grupos.value, id_profesores: profesor.value };
      agregarGrupoGuia(datos_formGrupoGuia);
    }

    const elements = ['#grupos', '#profesor'];
    elements.forEach(selector => {
      $(selector).on('change', function () {
        this.classList.remove('is-invalid');
        this.classList.replace('border-danger', 'border-secondary');
      });
    });//Para limpiar los errores de mi select en agregar profesor guia
  });

});
function agregarGrupoGuia(datos_formGrupoGuia) {
  axios.post('/api/asignar_gruposGuia', datos_formGrupoGuia)
    .then(response => {
      const result = response.data;
      if (result.success == true) {
        showToast('success', 'fa-solid fa-circle-check', 'El profesor se asigno con exito!');
        limpiar_FormGrupoGuia();
        tabla_grupoGuia.ajax.url(url).load();
      } else {
        showToast('danger', 'bi bi-exclamation-circle-fill', 'Error en el servidor 500!');
      }
    })
    .catch(err => console.log('Error', err.message));
}
function eliminarAsignacion(data_grupoGuia) {
  const data = { id_detallegrupo: data_grupoGuia.id_detallegrupo };
  crearModal('eliminar-grupoGuia', 'btn-aceptar-eliminar-grupo', '¿Deseas eliminar este grupo?');
  $("#eliminar-grupoGuia").modal("show");
  $("#btn-aceptar-eliminar-grupo").on("click", function () {
    axios.post('/api/eliminar_gruposGuia', data)
      .then(response => {
        const result = response.data;
        if (result.success == true) {
          showToast('success', 'fa-solid fa-circle-check', 'El profesor elimino con exito!');
          limpiar_FormGrupoGuia();
          tabla_grupoGuia.ajax.url(url).load();
        } else {
          showToast('danger', 'bi bi-exclamation-circle-fill', 'Error en el servidor 500!');
        }
      })
      .catch(err => console.log('Error', err.message));
  });
}

var url = '/api/gruposGuia_recientes';
var tabla_grupoGuia = new DataTable('#dt-grupoGuia', {
  processing: true,
  serverSide: true,
  deferRender: true,
  ajax: {
    url: url,
    type: 'GET'
  },
  aaSorting: [],
  columns: [
    { data: "id_detallegrupo" },
    { data: "Grupo" },
    { data: "Profesor" },
    { defaultContent: `<button type="button" class="eliminar btn btn-danger"><i class="fa-solid fa-trash"></i></button>` }
  ],
  columnDefs: [
    {
      className: "text-center", targets: [0, 3,]
    },
    {
      className: "dt-items-center", targets: [0, 1]
    }
  ],
  destroy: true,
  responsive: true,
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
    emptyTable: "No hay grupos ingresados...",
    zeroRecords: "Ninguna Grupo encontrado",
    info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
    infoEmpty: "Ninguna Grupo encontrado",
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

$('#dt-grupoGuia tbody').on("click", "button.eliminar", function () {
  var data_grupoGuia = tabla_grupoGuia.row($(this).parents("tr")).data();
  eliminarAsignacion(data_grupoGuia);
});

//Funciones
function validarAsignar() {
  // declaramos las variables
  const form_grupoGuia = [grupos, profesor];
  var aux = 0;
  //Validados que los campos esten correctos
  Array.from(form_grupoGuia).forEach(select => {
    if (!select.checkValidity()) {
      select.classList.add('is-invalid');
      select.classList.replace('border-secondary', 'border-danger');
      aux++;
    } else {
      select.classList.remove('is-invalid');
      select.classList.replace('border-danger', 'border-secondary');
    }
  });
  return aux;
};//Validar Form
function limpiar_FormGrupoGuia() {
  const elements = ['#grupos', '#profesor'];
  elements.forEach(selector => {
    $(selector).val('');
  });
  datos_formGrupoGuia = '';
  mostrarGruposDisponibles('grupos');
  mostrarProfesoresDisponibles('profesor');
};//Limpia los inputs de matricula de reingreso
function mostrarGruposDisponibles(id_select) {
  const grupoView = document.getElementById(id_select);
  axios.get('/api/mostrar_gruposGuia')
    .then(response => {
      const grupo = response.data;
      grupoView.innerHTML = '<option selected disabled value="">Elegir...</option>';
      for (let i = 0; i < grupo.length; i++) {
        grupoView.innerHTML += `
              <option value=${grupo[i].id_detallegrupo}>${grupo[i].Grupo}</option>`;
      };
    })
    .catch(err => console.log('Error', err.message));
}//Mostramos que los grupos disponibles sin asignar
function mostrarProfesoresDisponibles(id_select) {
  const profesorView = document.getElementById(id_select);
  axios.get('/api/mostrar_profesorGuia')
    .then(response => {
      const profesor = response.data;
      profesorView.innerHTML = '<option selected disabled value="">Elegir...</option>';
      for (let i = 0; i < profesor.length; i++) {
        profesorView.innerHTML += `
              <option value=${profesor[i].id_usuario}>${profesor[i].Profesor}</option>`;
      };
    })
    .catch(err => console.log('Error', err.message));
}//Mostramos que los grupos disponibles sin asignar

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
        <button type="button" class="btn btn-primary mx-auto w-30px" data-bs-dismiss="modal" id="${id_btn_aceptar}">Aceptar</button>
      </div>
    </div>
  </div>
</div>`
};//Funcion que permite crear un modal personalizado