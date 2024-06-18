//Variables globales para el formulario usuario
const nombres_usuario = document.getElementById('nombres-usuario');
const apellidos_usuario = document.getElementById('apellidos-usuario');
const cedula_usuario = document.getElementById('cedula-usuario');
const correo_usuario = document.getElementById('correo-usuario');
const contrasena_usuario = document.getElementById('contrasena-usuario');
const sexo_usuario = document.getElementById('sexo-usuario')
const telefono_usuario = document.getElementById('telefono-usuario');
const direccion_usuario = document.getElementById('direccion-usuario');
const rol_usuario = document.getElementById('rol-usuario');
const form_usuario = document.getElementById('form-usuario');
var datos_FormUsuario = {};
var id_usuario_edit = 0;


$('#btn-generar').on('click', function (e) {
    e.preventDefault();
    $("#contrasena-usuario").val(generarContrasena).removeClass('is-invalid border-danger').addClass('border-secondary');
});//Este evento genera la asignacion de una contraseña aleatoria a mi input contrasena_usuario
$('#btn-registrar').on('click', function (e) {
    e.preventDefault();
    datos_FormUsuario = {
        nombres_usuario: nombres_usuario.value.trim(),//Usuario
        apellidos_usuario: apellidos_usuario.value.trim(),
        cedula_usuario: cedula_usuario.value.trim(),
        correo_e_usuario: correo_usuario.value.trim(),
        contrasena_usuario: contrasena_usuario.value.trim(),
        sexo_usuario: sexo_usuario.value,
        telefono_usuario: telefono_usuario.value.trim(),
        direccion_usuario: direccion_usuario.value.trim(),
        rol_usuario: rol_usuario.value,
        id_usuario_edit: id_usuario_edit
    };
    validarFormulariosReg(datos_FormUsuario);
    $("input[type='text']").on('input', limpiarErrores);
    $('#sexo-usuario, #rol-usuario').on('change', limpiarErrores);
});//evento click del Boton para registrar al usuario
$('#btn-cancelar_edit').on('click', function (e) {
    e.preventDefault();
    salirEditarUsuario(form_usuario);
});//Cancela la funcion editar usuario
$('#btn-guardar_edit').on('click', function (e) {
    e.preventDefault();
    datos_FormUsuario = {
        nombres_usuario: nombres_usuario.value.trim(),//Usuario
        apellidos_usuario: apellidos_usuario.value.trim(),
        cedula_usuario: cedula_usuario.value.trim(),
        correo_e_usuario: correo_usuario.value.trim(),
        contrasena_usuario: contrasena_usuario.value.trim(),
        sexo_usuario: sexo_usuario.value,
        telefono_usuario: telefono_usuario.value.trim(),
        direccion_usuario: direccion_usuario.value.trim(),
        rol_usuario: rol_usuario.value,
        id_usuario_edit: id_usuario_edit
    };
    validarFormulariosEdit(datos_FormUsuario);
    $("input[type='text']").on('input', limpiarErrores);
    $('#sexo-usuario, #rol-usuario').on('change', limpiarErrores);
});//Evento click para verificar y guardar los cambios realizados al usuario

//Funciones
function generarContrasena() {
    var chars = "abcdefghijklmnopqrstubwsyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let contrasena = '';
    const contrasenaLength = 8;
    for (i = 0; i < contrasenaLength; i++) {
        contrasena += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return contrasena;
}// Esta funcion genera una contraseña aleatoria de 8 digitos
async function validarFormulariosReg(datosForm) {
    try {
        const response = await axios.post('/api/verificar_usuario', datosForm);
        const datosErrores = response.data;
        if (datosErrores.status === true) { respuestaServidor(datosErrores); }
        else { registrarUsuario(datosForm); }
    } catch (error) { console.log('Error', error.message); }
};//Mandamos a evaluar con el express-validator
async function validarFormulariosEdit(datosForm) {
    try {
        const response = await axios.post('/api/verificar_usuario', datosForm);
        const datosErrores = response.data;
        if (datosErrores.status === true) { respuestaServidor(datosErrores); }
        else {
            editarUsuario(datosForm);
        }
    } catch (error) { console.log('Error', error.message); }
};//Mandamos a evaluar con el express-validator
function registrarUsuario(datos) {
    axios.post('/api/registrar_usuario', datos)
        .then(response => {
            const result = response.data;
            if (result.success == true) {
                showToast('success', 'fa-solid fa-circle-check', 'El usuario se registro con exito!');
                limpiar_FormRegistro();
                tabla_usuario.ajax.url(url).load();
            } else {
                showToast('danger', 'bi bi-exclamation-circle-fill', 'El usuario ya esta registrado!');
            }
        })
        .catch(err => console.log('Error', err.message));
}//Realiza la peticion post para ingresar los datos del usuario en la base de datos
function editarUsuario(datos) {
    crearModal('editarUsuario', 'btn-aceptar-editar-usuario', '¿Deseas guardar los cambios este usuario?');
    $("#editarUsuario").modal("show");
    $("#btn-aceptar-editar-usuario").on("click", function (e) {
        e.preventDefault();
        $("#editarUsuario").modal('hide')
        axios.post('/api/editar_usuario', datos)
            .then(response => {
                const result = response.data;
                if (result.success == true) {
                    showToast('success', 'fa-solid fa-circle-check', 'El usuario se edito con exito!');
                    limpiar_FormRegistro();
                    tabla_usuario.ajax.url(url).load();
                    $('#nombres-usuario').focus();
                    $('#btn-cancelar_edit').addClass('d-none');
                    $('#btn-guardar_edit').addClass('d-none');
                    $('#btn-registrar').removeClass('d-none');
                    $('#txt-accion').text('Registrar Usuario:');
                } else {
                    showToast('danger', 'bi bi-exclamation-circle-fill', 'Ocurrio un error inesperado!');
                }
            })
            .catch(err => console.log('Error', err.message));
    });
}//Realiza la peticion post para ingresar los datos del usuario en la base de datos
function activarUsuario(id_usuario) {
    crearModal('activarUsuario', 'btn-aceptar-activar-usuario', '¿Deseas activar este usuario?');
    $("#activarUsuario").modal("show");
    $("#btn-aceptar-activar-usuario").on("click", function (e) {
        e.preventDefault();
        $("#activarUsuario").modal('hide')
        axios.post('/api/activar_usuario', { id_usuario: id_usuario })
            .then(response => {
                const result = response.data;
                if (result.success == true) {
                    showToast('success', 'fa-solid fa-circle-check', 'Usuario activado con exito!');
                    tabla_usuario.ajax.url(url).load();
                } else {
                    showToast('danger', 'bi bi-exclamation-circle-fill', 'Ocurrio un error inesperado!');
                }
            })
            .catch(err => console.log('Error', err.message));
    });
}//Funcion para activar al usuario desde el datatable
function bloquearUsuario(id_usuario) {
    crearModal('bloquearUsuario', 'btn-aceptar-bloquear-usuario', '¿Deseas bloquear este usuario?');
    $("#bloquearUsuario").modal("show");
    $("#btn-aceptar-bloquear-usuario").on("click", function (e) {
        e.preventDefault();
        $("#bloquearUsuario").modal('hide')
        axios.post('/api/bloquear_usuario', { id_usuario: id_usuario })
            .then(response => {
                const result = response.data;
                if (result.success == true) {
                    showToast('success', 'fa-solid fa-circle-check', 'Usuario bloqueado con exito!');
                    tabla_usuario.ajax.url(url).load();
                } else {
                    showToast('danger', 'bi bi-exclamation-circle-fill', 'Error 500 server!');
                }
            })
            .catch(err => console.log('Error', err.message));
    });
}//Funcion que permite bloquear todos los usuarios en base a su id
function iniciarEditarUsuario(data_usuario) {
    $('#nombres-usuario').focus();
    $('#btn-cancelar_edit').removeClass('d-none');
    $('#btn-guardar_edit').removeClass('d-none');
    $('#btn-registrar').addClass('d-none');
    $('#txt-accion').text('Editar Usuario:');
    nombres_usuario.value = data_usuario.nombres_usuario;
    apellidos_usuario.value = data_usuario.apellidos_usuario;
    cedula_usuario.value = data_usuario.cedula_usuario;
    correo_usuario.value = data_usuario.correo_e_usuario;
    contrasena_usuario.value = data_usuario.contrasena_usuario;
    sexo_usuario.value = data_usuario.sexo_usuario;
    telefono_usuario.value = data_usuario.telefono_usuario;
    direccion_usuario.value = data_usuario.direccion_usuario;
    rol_usuario.value = data_usuario.id_rol_usuario;
    id_usuario_edit = data_usuario.id_usuario;
    cleanAll_Errors(form_usuario);
}//Funcion para habilitar la funcion editar y llena campos input y select del usuario
function salirEditarUsuario() {
    $('#btn-cancelar_edit').addClass('d-none');
    $('#btn-guardar_edit').addClass('d-none');
    $('#btn-registrar').removeClass('d-none');
    $('#txt-accion').text('Registrar Usuario:');
    limpiar_FormRegistro();
    cleanAll_Errors(form_usuario);
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
};//Funcion para eliminar los inputs y selects al momento de modificar formulario de usuario
function cleanAll_Errors(form) {
    $(form).find('.is-invalid').removeClass('is-invalid').end().find('.border-danger').removeClass('border-danger').addClass('border-secondary');
};
function limpiar_FormRegistro() {
    $("input[type='text']").val('');
    $('#sexo-usuario').val('');
    $('#rol-usuario').val('');
};//Limpia los inputs de matricula de reingreso

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


//Datatable Usuarios recientes
var url = '/api/usuarios_recientes';
var tabla_usuario = new DataTable('#dt-usuario', {
    processing: true,
    serverSide: true,
    deferRender: true,
    ajax: {
        url: url,
        type: 'GET'
    },
    aaSorting: [],
    columns: [
        { data: "id_usuario" },
        { data: "nombres_usuario" },
        { data: "apellidos_usuario" },
        { data: "rol_usuario" },
        { data: "estado_usuario" },
        { data: "cedula_usuario" },
        { defaultContent: `<button type="button" class="editar btn btn-warning text-white"><i class="fa-solid fa-square-pen"></i></button> <button type="button" class="activar btn btn-success"><i class="fa-solid fa-user-check"></i></button> <button type="button" class="bloquear btn btn-danger"><i class="fa-solid fa-user-slash"></i></button>` }
    ],
    columnDefs: [
        {
            className: "text-center", targets: [0, 3, 4, 5, 6]
        },
        {
            className: "dt-items-center", targets: [0, 1, 2, 3, 4, 5]
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
        zeroRecords: "Ningún Usuario encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún Usuario encontrado",
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

$('#dt-usuario tbody').on("click", "button.editar", function () {
    var data_usuario = tabla_usuario.row($(this).parents("tr")).data();
    iniciarEditarUsuario(data_usuario);
});
$('#dt-usuario tbody').on("click", "button.activar", function () {
    var data_usuario = tabla_usuario.row($(this).parents("tr")).data();
    activarUsuario(data_usuario.id_usuario);
});
$('#dt-usuario tbody').on("click", "button.bloquear", function () {
    var data_usuario = tabla_usuario.row($(this).parents("tr")).data();
    bloquearUsuario(data_usuario.id_usuario);
});

// $('#dt-usuario tbody').on("click", "button", function () {
//     var data_usuario = tabla_usuario.row($(this).parents("tr")).data();
    
//     if ($(this).hasClass("editar")) {
//         iniciarEditarUsuario(data_usuario);
//     } else if ($(this).hasClass("activar")) {
//         activarUsuario(data_usuario.id_usuario);
//     } else if ($(this).hasClass("bloquear")) {
//         iniciarEditarUsuario(data_usuario.id_usuario);
//     }
// });