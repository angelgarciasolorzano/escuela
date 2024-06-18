//Materia
const nombre_materia = document.getElementById('nombre-materia');
const tituloAccion = document.getElementById('txt-accion');
const form_materia = document.getElementById('form-materia');
const nombre_materia_edit = document.getElementById('nombre-materia-edit');
//Materia

//Materia
$('#btn-agregarMateria').on('click', function (e) {
    e.preventDefault();
    if (validarMateria(nombre_materia) === true) {
        ingresarMateria(nombre_materia.value);
    }
});
//Materia

//Funciones Materia
function validarMateria(nombre_materia) {
    //Validados que los campos esten correctos
    if (nombre_materia.value.trim() === "") {
        $('#nombre-materia').addClass('is-invalid').remove('border-secondary').addClass('border-danger');
        limpiarErrores();
        return false;
    } else {
        $('#nombre-materia').remove('is-invalid').remove('border-danger').addClass('border-secondary');
        return true
    }
}
function ingresarMateria(nombre_materia) {
    axios.post('/api/agregar_materia', { nombre_materia: nombre_materia })
        .then(response => {
            const result = response.data;
            if (result.success == true) {
                showToast('success', 'fa-solid fa-circle-check', 'La materia se registro con exito!');
                $("input[type='text']").val('');
                tabla_materia.ajax.url(url).load();
            } else {
                showToast('danger', 'bi bi-exclamation-circle-fill', 'La materia ya esta registrado!');
            }
        })
        .catch(err => console.log('Error', err.message));
}
// function iniciarEditarMateria(data_materia) {
//     $('#nombre-materia-edit').val(data_materia.nombre_materia);
//     $('#btn-aceptar-editMateria').on('click', function () {
//         crearModal2('editar_materia', 'btn-aceptar-editar-materia', '¿Deseas guardar estos cambios?');
//         $("#btn-aceptar-editar-materia").on("click", function (e) {
//             e.preventDefault();
//             $("#editar_materia").modal("hide");
//             $("#editMateriaModal").modal("hide");
//             $('body').removeClass('modal-open');
//             $('.modal-backdrop').remove();
//             datos_materiaEdit = {
//                 id_materia: data_materia.id_materia,
//                 nombre_materia: nombre_materia_edit.value
//             }
//             editarMateria(datos_materiaEdit);
//         });//Evento del boton aceptar modal para permitir el ingreso los datos editados de materia
//         $("#btn_cerrar_modal").on("click", function (e) {
//             e.preventDefault();
//             $("#editar_materia").modal("hide");
//             $('body').removeClass('modal-open');
//             $('.modal-backdrop').remove();
//         });//cierra el modal notificacion --> "¿Estas seguro?"
//     });
// }
function editarMateria(datos_materiaEdit) {
    axios.post('/api/editar_materia', datos_materiaEdit)
        .then(response => {
            const result = response.data;
            if (result.success == true) {
                showToast('success', 'fa-solid fa-circle-check', 'Materia modificada con exito!');
                tabla_materia.ajax.url(url).load();
            } else {
                showToast('danger', 'bi bi-exclamation-circle-fill', 'Error 500 server!');
            }
        })
        .catch(err => console.log('Error', err.message));
}
function eliminarMateria(id_materia) {
    crearModal('eliminar-Materia', 'btn-aceptar-eliminar-materia', '¿Deseas eliminar este materia?');
    $("#eliminar-Materia").modal("show");
    $("#btn-aceptar-eliminar-materia").on("click", function () {
        axios.post('/api/eliminar_materia', { id_materia: id_materia })
            .then(response => {
                const result = response.data;
                if (result.success == true) {
                    showToast('success', 'fa-solid fa-circle-check', 'Materia eliminada con exito!');
                    tabla_materia.ajax.url(url).load();
                } else {
                    showToast('danger', 'bi bi-exclamation-circle-fill', 'Error esta materia ya ha sido asignada!');
                }
            })
            .catch(err => console.log('Error', err.message));
    });
}

function limpiarErrores() {
    $("input[type='text']").on('input', function () {
        this.classList.remove('is-invalid');
        this.classList.replace('border-danger', 'border-secondary');
    });
};//Funcion para eliminar los inputs y selects al momento de modificar formulario de materia

var url = '/api/materias_recientes';
var tabla_materia = new DataTable('#dt-materia', {
    processing: true,
    serverSide: true,
    deferRender: true,
    ajax: {
        url: url,
        type: 'GET'
    },
    aaSorting: [],
    columns: [
        { data: "id_materia" },
        { data: "nombre_materia" },
        { data: "fechaReg" },
        { defaultContent: `<button type="button" class="editar btn btn-warning text-white"><i class="fa-solid fa-square-pen"></i></button> <button type="button" class="eliminar btn btn-danger"><i class="fa-solid fa-trash"></i></button>` }
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
        emptyTable: "A la espera de búsqueda...",
        zeroRecords: "Ninguna Materia encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ninguna Materia encontrado",
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

$('#dt-materia tbody').on("click", "button.editar", function () {
    var data_materia = tabla_materia.row($(this).parents("tr")).data();
    $("#editMateriaModal").modal("show");
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    $('#nombre-materia-edit').val(data_materia.nombre_materia);
    $('#btn-aceptar-editMateria').on('click', function () {
        crearModal2('editar_materia', 'btn-aceptar-editar-materia', '¿Deseas guardar estos cambios?');
        $("#editar_materia").modal("show");
        $("#btn-aceptar-editar-materia").on("click", function (e) {
            e.preventDefault();
            $("#editar_materia").modal("hide");
            $("#editMateriaModal").modal("hide");
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            datos_materiaEdit = {
                id_materia: data_materia.id_materia,
                nombre_materia: nombre_materia_edit.value
            }
            editarMateria(datos_materiaEdit);
        });//Evento del boton aceptar modal para permitir el ingreso los datos editados de materia
        $("#btn_cerrar_modal").on("click", function (e) {
            e.preventDefault();
            $("#editar_materia").modal("hide");
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        });//cierra el modal notificacion --> "¿Estas seguro?"
    });
});
$('#dt-materia tbody').on("click", "button.eliminar", function () {
    var data_materia = tabla_materia.row($(this).parents("tr")).data();
    eliminarMateria(data_materia.id_materia);
});
//Otras funciones
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
function crearModal2(id_modal, id_btn_aceptar, mensaje) {
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
          <button type="button" class="btn btn-danger mx-auto w-30px" id="btn_cerrar_modal">Cancelar</button>
          <button type="button" class="btn btn-primary mx-auto w-30px" id="${id_btn_aceptar}">Aceptar</button>
        </div>
      </div>
    </div>
  </div>`;
};//Funcion que permite crear un modal personalizado
$(document).keypress(
    function (event) {
        if (event.which == '13') {
            event.preventDefault();
        }
    });//Para Evitar el submit del formulario con presionar Enter