//Variables globales para el formulario Tutor
const nombres_tutor = document.getElementById('nombres-tutor');
const apellidos_tutor = document.getElementById('apellidos-tutor');
const cedula_tutor = document.getElementById('cedula-tutor');
const correo_tutor = document.getElementById('correo-tutor');
const sexo_tutor = document.getElementById('sexo-tutor')
const telefono_tutor = document.getElementById('telefono-tutor');
const direccion_tutor = document.getElementById('direccion-tutor');
const form_tutor = document.getElementById('form-tutor');
//Variables globales para el formulario Estudiante
const nombres_est = document.getElementById('nombres-est');
const apellidos_est = document.getElementById('apellidos-est');
const registroNac_est = document.getElementById('registroNac-est');
const fechaNac_est = document.getElementById('fechaNac-est');
const sexo_est = document.getElementById('sexo-est');
const fechaReg_est = document.getElementById('fechaReg-est');
const form_estudiante = document.getElementById('form-estudiante');
const form_datosPersonales = document.getElementById('card-datosPersonales');
var id_tutor = 0;
var id_estudiante = 0;
var datos_FormET = {};


$('#btn-cerrar-mostrar').on('click', function (e) {
    e.preventDefault();
    $('#card-datosPersonales').addClass('d-none');
});//Boton para esconder el formulario datos personales
$('#btn-cancelar_edit').on('click', function (e) {
    e.preventDefault();
    salirEditarEstudiante(form_datosPersonales);
});//Cancela la funcion editar usuario
$('#btn-guardar_edit').on('click', function (e) {
    e.preventDefault();
    datos_FormET = {
        id_estudiante: id_estudiante,//Estudiante
        nombres_est: nombres_est.value,
        apellidos_est: apellidos_est.value,
        registroNac_est: registroNac_est.value,
        fechaNac_est: fechaNac_est.value,
        sexo_est: sexo_est.value,

        id_tutor: id_tutor,//Tutor
        nombres_tutor: nombres_tutor.value,
        apellidos_tutor: apellidos_tutor.value,
        cedula_tutor: cedula_tutor.value,
        correo_e_tutor: correo_tutor.value,
        sexo_tutor: sexo_tutor.value,
        telefono_tutor: telefono_tutor.value,
        direccion_tutor: direccion_tutor.value
    };
    console.log(datos_FormET);
    validarFormulariosEdit(datos_FormET);
    $("input[type='text']").on('input', limpiarErrores);
    $("input[type='date']").on('input', limpiarErrores);
    $('#sexo-est, #sexo-tutor').on('change', limpiarErrores);
});//Evento click para verificar y guardar los cambios realizados al estudiante y tutor


async function validarFormulariosEdit(datosForm) {
    try {
        const response = await axios.post('/api/verificar_estudianteTutorEdit', datosForm);
        const datosErrores = response.data;
        if (datosErrores.status === true) { respuestaServidor(datosErrores); }
        else {
            editarEstudiante(datos_FormET);
        }
    } catch (error) { console.log('Error', error.message); }
};//Mandamos a evaluar con el express-validator
function mostrarEstudiante(data_estudiante) {
    $('#nombres-est').focus();
    //$('#btn-cancelar_edit, #btn-guardar_edit').removeClass('d-none');
    $('#card-datosPersonales, #btn-cerrar-mostrar').removeClass('d-none');
    $('#btn-cancelar_edit').addClass('d-none');
    $('#btn-guardar_edit').addClass('d-none');
    //$('#btn-registrar').addClass('d-none');
    $('#txt-accion').text('Mostrar Datos Personales:');
    nombres_est.value = data_estudiante.nombres_est;//Estudiante
    apellidos_est.value = data_estudiante.apellidos_est;
    registroNac_est.value = data_estudiante.registroNac_est;
    fechaNac_est.value = fechaFormateada(data_estudiante.fechaNac_est);
    $('#sexo-est').val(data_estudiante.sexo_est);
    fechaReg_est.value = data_estudiante.fechaReg_est;//Estudiante

    nombres_tutor.value = data_estudiante.nombres_tutor;//Tutor
    apellidos_tutor.value = data_estudiante.apellidos_tutor;
    cedula_tutor.value = data_estudiante.cedula_tutor;
    correo_tutor.value = data_estudiante.correo_e_tutor;
    $('#sexo-tutor').val(data_estudiante.sexo_tutor);
    telefono_tutor.value = data_estudiante.telefono_tutor;
    direccion_tutor.value = data_estudiante.direccion_tutor;
    cleanAll_Errors(form_datosPersonales);
}//Funcion para activar al estudiante desde el datatable
function iniciarEditarEstudiante(data_estudiante) {
    $('#nombres-est').focus();
    $('#btn-cerrar-mostrar').addClass('d-none');
    $('#txt-accion').text('Editar Datos Personales:');
    $('#card-datosPersonales, #btn-cancelar_edit, #btn-guardar_edit').removeClass('d-none');
    $('#txt-accion').text('Mostrar Datos Personales:');
    id_estudiante = data_estudiante.id_estudiante;
    nombres_est.value = data_estudiante.nombres_est;//Estudiante
    apellidos_est.value = data_estudiante.apellidos_est;
    registroNac_est.value = data_estudiante.registroNac_est;
    fechaNac_est.value = fechaFormateada(data_estudiante.fechaNac_est);
    $('#sexo-est').val(data_estudiante.sexo_est);
    fechaReg_est.value = data_estudiante.fechaReg_est;//Estudiante

    id_tutor = data_estudiante.id_tutor;//Tutor
    nombres_tutor.value = data_estudiante.nombres_tutor;
    apellidos_tutor.value = data_estudiante.apellidos_tutor;
    cedula_tutor.value = data_estudiante.cedula_tutor;
    correo_tutor.value = data_estudiante.correo_e_tutor;
    $('#sexo-tutor').val(data_estudiante.sexo_tutor);
    telefono_tutor.value = data_estudiante.telefono_tutor;
    direccion_tutor.value = data_estudiante.direccion_tutor;
}//Funcion para habilitar la funcion editar y llena campos input y select del estudiante
function editarEstudiante(datos_FormET){
    crearModal('editarEstudiante', 'btn-aceptar-editar-estudiante', '¿Deseas guardar los cambios este estudiante y tutor?');
    $("#editarEstudiante").modal("show");
    $("#btn-aceptar-editar-estudiante").on("click", function (e) {
        e.preventDefault();
        $("#editarEstudiante").modal('hide')
        axios.post('/api/editar_estudianteTutor', datos_FormET)
            .then(response => {
                const result = response.data;
                if (result.success == true) {
                    showToast('success', 'fa-solid fa-circle-check', 'El estudiante y tutor se editaron con exito!');
                    limpiar_FormRegistro();
                    tabla_estudiante.ajax.url(url).load();
                    $('#card-datosPersonales').addClass('d-none');
                    $('#btn-cancelar_edit').addClass('d-none');
                    $('#btn-guardar_edit').addClass('d-none');
                    $('#btn-cerrar-mostrar').removeClass('d-none');
                    $('#txt-accion').text('Datos Personales:');
                } else {
                    showToast('danger', 'bi bi-exclamation-circle-fill', 'Ocurrio un error inesperado!');
                }
            })
            .catch(err => console.log('Error', err.message));
    });
}
function activarEstudiante(id_estudiante) {
    crearModal('activarEstudiante', 'btn-aceptar-activar-estudiante', '¿Deseas activar este estudiante?');
    $("#activarEstudiante").modal("show");
    $("#btn-aceptar-activar-estudiante").on("click", function (e) {
        e.preventDefault();
        $("#activarEstudiante").modal('hide')
        axios.post('/api/activar_estudiante', { id_estudiante: id_estudiante })
            .then(response => {
                const result = response.data;
                if (result.success == true) {
                    showToast('success', 'fa-solid fa-circle-check', 'Estudiante activado con exito!');
                    tabla_estudiante.ajax.url(url).load();
                } else {
                    showToast('danger', 'bi bi-exclamation-circle-fill', 'Ocurrio un error inesperado!');
                }
            })
            .catch(err => console.log('Error', err.message));
    });
}//Funcion para activar al estudiante desde el datatable
function inactivarEstudiante(id_estudiante) {
    crearModal('inactivarEstudiante', 'btn-aceptar-inactivar-estudiante', '¿Deseas cambiar a inactivo este estudiante?');
    $("#inactivarEstudiante").modal("show");
    $("#btn-aceptar-inactivar-estudiante").on("click", function (e) {
        e.preventDefault();
        $("#inactivarEstudiante").modal('hide')
        axios.post('/api/inactivar_estudiante', { id_estudiante: id_estudiante })
            .then(response => {
                const result = response.data;
                if (result.success == true) {
                    showToast('success', 'fa-solid fa-circle-check', 'Estado cambiado a inactivo con exito!');
                    tabla_estudiante.ajax.url(url).load();
                } else {
                    showToast('danger', 'bi bi-exclamation-circle-fill', 'Error 500 server!');
                }
            })
            .catch(err => console.log('Error', err.message));
    });
}//Funcion que permite bloquear todos los estudiante en base a su id


function salirEditarEstudiante() {
    $('#btn-cancelar_edit').addClass('d-none');
    $('#btn-guardar_edit').addClass('d-none');
    $('#btn-cerrar-mostrar').removeClass('d-none');
    $('#txt-accion').text('Datos Personales:');
    $('#card-datosPersonales').addClass('d-none');
    limpiar_FormRegistro();
    cleanAll_Errors(form_datosPersonales);
};//Funcion para deshabilitar la funcion editar y reestaura la funcion editar del usuario
function respuestaServidor(dataErrors) {
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
        }
        return false;
    } else {
        return true;
    }
};//Funcion para mostrar los errores en caso de que existan
function limpiarErrores() {
    $(this).removeClass('is-invalid border-danger').addClass('border-secondary');
};//Funcion para eliminar los errores inputs y selects al momento de modificar formulario de datos personales
function limpiar_FormRegistro() {
    $("input[type='text']").val('');
    $('#sexo-est, #sexo-tutor').val('');
};//Limpia los inputs y select de mi formulario datos personales
function cleanAll_Errors(form) {
    $(form).find('.is-invalid').removeClass('is-invalid').end().find('.border-danger').removeClass('border-danger').addClass('border-secondary');
};//Limpia todos los errores de mi formulario Datos Personales

var url = '/api/estudiante_disponible';
var tabla_estudiante = $('#dt-estudiante').DataTable({
    processing: true,
    serverSide: true,
    deferRender: true,
    ajax: {
        url: url,
        type: 'GET'
    },
    aaSorting: [],
    columns: [
        { data: "id_estudiante" },
        { data: "nombres_est" },
        { data: "apellidos_est" },
        { data: "estado_est" },
        { data: "registroNac_est" },
        { data: "tutor" },
        { data: "cedula_tutor" },
        {
            defaultContent: `<button type="button" class="mostrar btn btn-primary text-white"><i class="fa-solid fa-magnifying-glass"></i></button>
            <button type="button" class="editar btn btn-warning text-white"><i class="fa-solid fa-square-pen"></i></button> <button type="button" class="activar btn btn-success"><i class="fa-solid fa-user-check"></i></button> <button type="button" class="inactivo btn btn-danger"><i class="fa-solid fa-user-slash"></i></button>`
        }
    ],
    columnDefs: [
        {
            className: "text-center", targets: 0
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
        zeroRecords: "Ningún Estudiante encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún Estudiante encontrado",
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
$('#dt-estudiante tbody').on("click", "button.mostrar", function () {
    var data_estudiante = tabla_estudiante.row($(this).parents("tr")).data();
    mostrarEstudiante(data_estudiante);
});
$('#dt-estudiante tbody').on("click", "button.editar", function () {
    var data_estudiante = tabla_estudiante.row($(this).parents("tr")).data();
    iniciarEditarEstudiante(data_estudiante);
});
$('#dt-estudiante tbody').on("click", "button.activar", function () {
    var data_estudiante = tabla_estudiante.row($(this).parents("tr")).data();
    activarEstudiante(data_estudiante.id_estudiante);
});
$('#dt-estudiante tbody').on("click", "button.inactivo", function () {
    var data_estudiante = tabla_estudiante.row($(this).parents("tr")).data();
    inactivarEstudiante(data_estudiante.id_estudiante);
});

//Otras herramientas
function fechaFormateada(fecha) {
    // Dividir la cadena en partes: día, mes y año
    var partesFecha = fecha.split('/');
    // Crear una nueva fecha en JavaScript con las partes de la fecha
    var fecha = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
    // Convertir la fecha a una cadena en formato YYYY-MM-DD
    var fechaFormateada = fecha.toISOString().slice(0, 10);
    return fechaFormateada;
}//Esta funcion permite convertir el formato de la fecha a uno que reconozca el input de tipo date
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
$(document).keypress(
    function (event) {
        if (event.which == '13') {
            event.preventDefault();
        }
    });//Para Evitar el submit del formulario con presionar Enter