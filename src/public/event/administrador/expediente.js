// //Variables globales para el formulario Tutor
const nombres_tutor = document.getElementById('nombres-tutor');
const cedula_tutor = document.getElementById('cedula-tutor');
const correo_tutor = document.getElementById('correo-tutor');
const telefono_tutor = document.getElementById('telefono-tutor');
const ocupacion_tutor = document.getElementById('ocupacion-tutor');
const direccion_tutor = document.getElementById('direccion-tutor');
// const form_tutor = document.getElementById('form-tutor');
// //Variables globales para el formulario Estudiante
const nombres_est = document.getElementById('nombres-est');
const apellidos_est = document.getElementById('apellidos-est');
const codigo_est = document.getElementById('codigo-est');
const cedula_est = document.getElementById('cedula-est');
const registroNac_est = document.getElementById('registroNac-est');
const fechaNac_est = document.getElementById('fechaNac-est');
const sexo_est = document.getElementById('sexo-est');
const etnia_est = document.getElementById('etnia-est');
const lengua_est = document.getElementById('lengua-est');
const discapacidad_est = document.getElementById('discapacidad-est');
const telefono_est = document.getElementById('telefono-est');
const lugarNac_est = document.getElementById('lugarNac-est');
const nacionalidad_est = document.getElementById('nacionalidad-est');
const direccionDom_est = document.getElementById('direccionDom-est');
const relacion_tutor = document.getElementById('relacion-tutor');
const nombres_madre = document.getElementById('nombres-madre');
const cedula_madre = document.getElementById('cedula-madre');
const telefono_madre = document.getElementById('telefono-madre');
const nombres_padre = document.getElementById('nombres-padre');
const cedula_padre = document.getElementById('cedula-padre');
const telefono_padre = document.getElementById('telefono-padre');
const form_estudiante = document.getElementById('form-estudiante');
const form_datosPersonales = document.getElementById('card-datosPersonales');
const form_tutor = document.getElementById('form-tutor');
const form_madre = document.getElementById('form-madre');
const form_padre = document.getElementById('form-padre');
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
        codigo_est: codigo_est.value,
        cedula_est: cedula_est.value,
        registroNac_est: registroNac_est.value,
        fechaNac_est: fechaNac_est.value,
        sexo_est: sexo_est.value,
        etnia_est: etnia_est.value,
        lengua_est: lengua_est.value,
        discapacidad_est: discapacidad_est.value,
        telefono_est: telefono_est.value,
        lugarNac_est: lugarNac_est.value,
        nacionalidad_est: nacionalidad_est.value,
        direccionDom_est: direccionDom_est.value,
        relacion_tutor: relacion_tutor.value,
        nombres_madre: nombres_madre.value,
        cedula_madre: cedula_madre.value,
        telefono_madre: telefono_madre.value,
        nombres_padre: nombres_padre.value,
        cedula_padre: cedula_padre.value,
        telefono_padre: telefono_padre.value,//Estudiante

        id_tutor: id_tutor,//Tutor
        nombres_tutor: nombres_tutor.value,
        cedula_tutor: cedula_tutor.value,
        correo_e_tutor: correo_tutor.value,
        telefono_tutor: telefono_tutor.value,
        ocupacion_tutor:  ocupacion_tutor.value,
        direccion_tutor: direccion_tutor.value
    };
    console.log(datos_FormET);
    validarFormulariosEdit(datos_FormET);
    $("input[type='text']").on('input', limpiarErrores);
    $("input[type='date']").on('input', limpiarErrores);
    $('#sexo-est, #etnia-est, #lengua-est, #discapacidad-est, #relacion-tutor').on('change', limpiarErrores);
});//Evento click para verificar y guardar los cambios realizados al estudiante y tutor
$("#nombres-tutor, #cedula-tutor, #telefono-tutor").on('input', function () {
    if (nombres_tutor.value != '' && cedula_tutor.value != '') {
        $('#relacion-tutor').prop('disabled', false);
    }
    if (relacion_tutor.value === 'Madre') {
        nombres_madre.value = nombres_tutor.value;
        cedula_madre.value = cedula_tutor.value;
        telefono_madre.value = telefono_tutor.value;
    }
    if (relacion_tutor.value === 'Padre') {
        nombres_padre.value = nombres_tutor.value;
        cedula_padre.value = cedula_tutor.value;
        telefono_padre.value = telefono_tutor.value;
    }
});//Cada vez que modifico el nombre, cedula y telefono del tutor me permitira visualizar los campos de los padres
$('#nombres-tutor').on('input', function () {
    if (relacion_tutor.value === 'Madre') {
        limpiarErrorEspecial('#nombres-madre');
    }
    if (relacion_tutor.value === 'Padre') {
        limpiarErrorEspecial('#nombres-padre');
    }
});//Limpiar el input nombres-madre o nombres-padre al hacer un input en nombres-tutor
$('#cedula-tutor').on('input', function () {
    if (relacion_tutor.value === 'Madre') {
        limpiarErrorEspecial('#cedula-madre');
    }
    if (relacion_tutor.value === 'Padre') {
        limpiarErrorEspecial('#cedula-padre');
    }
});//Limpiar el input cedula-madre o cedula-padre al hacer un input en cedula-tutor
$('#telefono-tutor').on('input', function () {
    if (relacion_tutor.value === 'Madre') {
        limpiarErrorEspecial('#telefono-madre');
    }
    if (relacion_tutor.value === 'Padre') {
        limpiarErrorEspecial('#telefono-padre');
    }
});//Limpiar el input telefono-madre o telefono-padre al hacer un input en telefono-tutor
$('#relacion-tutor').on('change', function () {
    var inputMadreDes = $('#nombres-madre').prop('disabled');
    var inpuPadreDes = $('#nombres-padre').prop('disabled');
    $("#fieldsetMadre, #fieldsetPadre").removeClass('d-none');
    if (relacion_tutor.value === 'Madre') {
        nombres_madre.value = nombres_tutor.value;
        cedula_madre.value = cedula_tutor.value;
        telefono_madre.value = telefono_tutor.value;
        $('#nombres-madre, #cedula-madre, #telefono-madre').prop('disabled', true);
        cleanAll_Errors(form_madre);
    }
    if (relacion_tutor.value === 'Padre') {
        nombres_padre.value = nombres_tutor.value;
        cedula_padre.value = cedula_tutor.value;
        telefono_padre.value = telefono_tutor.value;
        $('#nombres-padre, #cedula-padre, #telefono-padre').prop('disabled', true);
        cleanAll_Errors(form_padre);
    }
    if (inputMadreDes) {
        $('#nombres-madre, #cedula-madre, #telefono-madre').prop('disabled', false)
        $("#form-madre").find('#nombres-madre, #cedula-madre, #telefono-madre').val('');
        cleanAll_Errors(form_madre);
    }
    if (inpuPadreDes) {
        $('#nombres-padre, #cedula-padre, #telefono-padre').prop('disabled', false)
        $("#form-padre").find('#nombres-padre, #cedula-padre, #telefono-padre').val('');
        cleanAll_Errors(form_padre);
    }
});//Cada vez que hago un cambio en mi select relacion-estudiante se agregara la informacion de la madre o padre asignado como tutor
$("#cedula-madre, #telefono-madre").on('input', function () {
    limpiarErrorEspecial('#nombres-madre');
});//Limpiamos nombres-madre, telefono-est y cedula-est
$("#cedula-padre, #telefono-padre").on('input', function () {
    limpiarErrorEspecial('#nombres-padre');
});//Limpiamos nombres-padre, telefono-est y cedula-est

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
    $('#nombres-tutor').focus();
    //$('#btn-cancelar_edit, #btn-guardar_edit').removeClass('d-none');
    $('#card-datosPersonales, #btn-cerrar-mostrar').removeClass('d-none');
    $('#btn-cancelar_edit').addClass('d-none');
    $('#btn-guardar_edit').addClass('d-none');
    //$('#btn-registrar').addClass('d-none');
    $('#txt-accion').text('Expediente Estudiantil:');
    nombres_est.value = data_estudiante.nombres_est;//Estudiante
    apellidos_est.value = data_estudiante.apellidos_est;
    codigo_est.value = data_estudiante.codigo_est;
    cedula_est.value = data_estudiante.cedula_est;
    registroNac_est.value = data_estudiante.registroNac_est;
    fechaNac_est.value = fechaFormateada(data_estudiante.fechaNac_est);
    $('#sexo-est').val(data_estudiante.sexo_est);
    $('#etnia-est').val(data_estudiante.etnia_est);
    $('#lengua-est').val(data_estudiante.lengua_est);
    $('#discapacidad-est').val(data_estudiante.discapacidad_est);
    lugarNac_est.value = data_estudiante.lugarNac_est;
    telefono_est.value = data_estudiante.telefono_est;
    nacionalidad_est.value = data_estudiante.nacionalidad_est;
    direccionDom_est.value = data_estudiante.direccion_est;
    $('#relacion-tutor').val(data_estudiante.relacion_tutor);
    nombres_madre.value = data_estudiante.nombres_madre;
    cedula_madre.value = data_estudiante.cedula_madre;
    telefono_madre.value = data_estudiante.telefono_madre;
    nombres_padre.value = data_estudiante.nombres_padre;
    cedula_padre.value = data_estudiante.cedula_padre;
    telefono_padre.value = data_estudiante.telefono_padre;//Estudiante

    nombres_tutor.value = data_estudiante.nombres_tutor;//Tutor
    cedula_tutor.value = data_estudiante.cedula_tutor;
    correo_tutor.value = data_estudiante.correo_e_tutor;
    telefono_tutor.value = data_estudiante.telefono_tutor;
    ocupacion_tutor.value = data_estudiante.ocupacion_tutor;
    direccion_tutor.value = data_estudiante.direccion_tutor;

    if (relacion_tutor.value === 'Madre') {
        nombres_madre.value = nombres_tutor.value;
        cedula_madre.value = cedula_tutor.value;
        telefono_madre.value = telefono_tutor.value;
        $('#nombres-madre, #cedula-madre, #telefono-madre').prop('disabled', true);
        $('#nombres-padre, #cedula-padre, #telefono-padre').prop('disabled', false);
    }
    if (relacion_tutor.value === 'Padre') {
        nombres_padre.value = nombres_tutor.value;
        cedula_padre.value = cedula_tutor.value;
        telefono_padre.value = telefono_tutor.value;
        $('#nombres-padre, #cedula-padre, #telefono-padre').prop('disabled', true);
        $('#nombres-madre, #cedula-madre, #telefono-madre').prop('disabled', false);
    }
    cleanAll_Errors(form_datosPersonales);
}//Funcion para activar al estudiante desde el datatable
function iniciarEditarEstudiante(data_estudiante) {
    $('#nombres-tutor').focus();
    $('#btn-cerrar-mostrar').addClass('d-none');
    $('#txt-accion').text('Editar Datos Personales:');
    $('#card-datosPersonales, #btn-cancelar_edit, #btn-guardar_edit').removeClass('d-none');
    $('#txt-accion').text('Editar Expediente Estudiantil:');
    id_estudiante = data_estudiante.id_estudiante;//Estudiante
    nombres_est.value = data_estudiante.nombres_est;
    apellidos_est.value = data_estudiante.apellidos_est;
    codigo_est.value = data_estudiante.codigo_est;
    cedula_est.value = data_estudiante.cedula_est;
    registroNac_est.value = data_estudiante.registroNac_est;
    fechaNac_est.value = fechaFormateada(data_estudiante.fechaNac_est);
    $('#sexo-est').val(data_estudiante.sexo_est);
    $('#etnia-est').val(data_estudiante.etnia_est);
    $('#lengua-est').val(data_estudiante.lengua_est);
    $('#discapacidad-est').val(data_estudiante.discapacidad_est);
    lugarNac_est.value = data_estudiante.lugarNac_est;
    telefono_est.value = data_estudiante.telefono_est;
    nacionalidad_est.value = data_estudiante.nacionalidad_est;
    direccionDom_est.value = data_estudiante.direccion_est;
    $('#relacion-tutor').val(data_estudiante.relacion_tutor);
    nombres_madre.value = data_estudiante.nombres_madre;
    cedula_madre.value = data_estudiante.cedula_madre;
    telefono_madre.value = data_estudiante.telefono_madre;
    nombres_padre.value = data_estudiante.nombres_padre;
    cedula_padre.value = data_estudiante.cedula_padre;
    telefono_padre.value = data_estudiante.telefono_padre;//Estudiante

    id_tutor = data_estudiante.id_tutor
    nombres_tutor.value = data_estudiante.nombres_tutor;//Tutor
    cedula_tutor.value = data_estudiante.cedula_tutor;
    correo_tutor.value = data_estudiante.correo_e_tutor;
    telefono_tutor.value = data_estudiante.telefono_tutor;
    ocupacion_tutor.value = data_estudiante.ocupacion_tutor;
    direccion_tutor.value = data_estudiante.direccion_tutor;

    if (relacion_tutor.value === 'Madre') {
        nombres_madre.value = nombres_tutor.value;
        cedula_madre.value = cedula_tutor.value;
        telefono_madre.value = telefono_tutor.value;
        $('#nombres-madre, #cedula-madre, #telefono-madre').prop('disabled', true);
        $('#nombres-padre, #cedula-padre, #telefono-padre').prop('disabled', false);
    }
    if (relacion_tutor.value === 'Padre') {
        nombres_padre.value = nombres_tutor.value;
        cedula_padre.value = cedula_tutor.value;
        telefono_padre.value = telefono_tutor.value;
        $('#nombres-padre, #cedula-padre, #telefono-padre').prop('disabled', true);
        $('#nombres-madre, #cedula-madre, #telefono-madre').prop('disabled', false);
    }
    cleanAll_Errors(form_datosPersonales);
}//Funcion para habilitar la funcion editar y llena campos input y select del estudiante
function editarEstudiante(datos_FormET) {
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
}//
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
            inputElement.focus();
        }
        return false;
    } else {
        return true;
    }
};//Funcion para mostrar los errores en caso de que existan
function limpiarErrorEspecial(id_input) {
    $(id_input).removeClass('is-invalid');
    $(id_input).removeClass('border-danger');
    $(id_input).addClass('border-secondary');
}//Funcion para limpiar un error cuando se modifica desde otro input
function limpiarErrores() {
    $(this).removeClass('is-invalid border-danger').addClass('border-secondary');
};//Funcion para eliminar los errores inputs y selects al momento de modificar formulario de datos personales
function limpiar_FormRegistro() {
    $("input[type='text']").val('');
    $('#sexo-est, #etnia-est, #lengua-est, #discapacidad-est, #relacion-tutor').val('');
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
    ordering: false,
    columns: [
        { data: "codigo_est" },
        { data: "nombres_est" },
        { data: "apellidos_est" },
        { data: "estado_est" },
        { data: "nombres_tutor" },
        { data: "cedula_tutor" },
        {
            defaultContent: `<button type="button" class="mostrar btn btn-primary text-white"><i class="fa-solid fa-magnifying-glass"></i></button>
            <button type="button" class="editar btn btn-warning text-white"><i class="fa-solid fa-square-pen"></i></button> <button type="button" class="activar btn btn-success"><i class="fa-solid fa-user-check"></i></button> <button type="button" class="inactivo btn btn-danger"><i class="fa-solid fa-user-slash"></i></button>`
        }
    ],
    columnDefs: [
        {
            className: "text-center", targets: [3, 6]
        }
    ],
    //destroy: true,
    responsive: {
        breakpoints: [
            { name: 'desktop', width: Infinity },  // Pantallas grandes (>1024px)
            { name: 'tablet-l', width: 1024 },     // Tabletas en landscape (mayor o igual a 1024px)
            { name: 'tablet-p', width: 768 },      // Tabletas en portrait (mayor o igual a 768px)
            { name: 'mobile-l', width: 600 },      // Móviles en landscape (mayor o igual a 600px)
            { name: 'mobile-p', width: 320 }       // Móviles en portrait (mayor o igual a 320px)
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