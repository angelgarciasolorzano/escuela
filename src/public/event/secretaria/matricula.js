//Matricula reingreso
const name_estudiante = document.getElementById('name-estudiante');
const direccion = document.getElementById('direccion');
const name_tutor = document.getElementById('name-tutor');
var modalidad_reingreso = document.getElementById('modalidad-reingreso');
var nivel_reingreso = document.getElementById('nivel-reingreso');
var grupo_reingreso = document.getElementById('grupo-reingreso');
const turno_reingreso = document.getElementById('turno-reingreso');
const form = document.getElementById('form-matricula');
const correo_usuario = document.getElementById('correo_usuario');
let select_row = '';
var datos_formReingreso = {};
//Matricula nuevo ingreso
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
const fechaNac_est = document.getElementById('fecha-est');
const sexo_est = document.getElementById('sexo-est');
const modalidad_est = document.getElementById('modalidad-est');
const nivel_est = document.getElementById('nivel-est');
const grupo_nuevoIngreso = document.getElementById('grupo-nuevoIngreso');
var turno_nuevoIngreso = document.getElementById('turno-nuevoIngreso');
const form_estudiante = document.getElementById('form-estudiante');
var datos_formNuevoingreso = {};
var aux = 0;

//Variables globales para editar matricula estudiante
const nombre_est_edit = document.getElementById('nombre-est-edit');
const registroNac_est_edit = document.getElementById('registroNac-est-edit');
const fechaNac_est_edit = document.getElementById('fechaNac-est-edit');
const sexo_est_edit = document.getElementById('sexo-est-edit');
const grupoactual_est_edit = document.getElementById('grupoactual-est-edit');
const modalidad_est_edit = document.getElementById('modalidad-est-edit');
const nivel_est_edit = document.getElementById('nivel-est-edit');
const grupo_est_edit = document.getElementById('grupo-est-edit');
const form_editar_matricula = document.getElementById('form-editar-matricula');

//Opcion Matricula de reingreso del nav tab
$('#estudianteModal').on('show.bs.modal', function () {
    var url = '/api/estudiante_disponible';
    var table_estudiante = $('#dt_estudiante').DataTable({
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
            { data: "tutor" },
            { data: "cedula_tutor" },
            { defaultContent: `<button type="button" class="buscar btn btn-primary"><i class="fa-solid fa-magnifying-glass"></i></button>` }
        ],
        columnDefs: [
            {
                className: "text-center", targets: [0,6]
            }
        ],
        destroy: true,
        select: true,
        select: {
            style: 'single',
            toggleable: false,
            item: 'row',
            selector: 'td:not(:first-child)'
        },
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
    if (table_estudiante) {
        $('#dt_estudiante').on("click", "td:not(:first-child)", function () {
            select_row = table_estudiante.row(this).data();
            if (typeof select_row != 'undefined')
                console.log(select_row);
        })
    }; //Seleccionar la fila
    $('#btn-aceptar-est').on('click', function () {
        if (typeof select_row != 'undefined') {
            name_estudiante.value = select_row.nombres_est + ' ' + select_row.apellidos_est;
            direccion.value = select_row.direccion_tutor;
            name_tutor.value = select_row.tutor;
            turno_reingreso.value = 'Matutino';
            $('#modalidad-reingreso').prop('disabled', false);
        }
    });
}); //Cargar dt_estudiante dentro del Modal
$('#btn_buscarEstudiantes').on('click', function () {
    limpiar_FormReingreso();
});//Antes de buscar limpio el formulario matricula de reingreso
$('#modalidad-reingreso').on('change', function () {
    const id_modalidad = $('#modalidad-reingreso').val();
    $('#nivel-reingreso').prop('disabled', false);
    mostrarNivel(id_modalidad, 'nivel-reingreso');
    $('#grupo-reingreso').prop('disabled', true).val('');
});//Desbloquea y muestra los niveles o grados en base a su modalidad en formulario matricula de reigreso ingreso
$('#nivel-reingreso').on('change', function () {
    const id_nivel_grado = $('#nivel-reingreso').val();
    $('#grupo-reingreso').prop('disabled', false);
    mostrarGrupos(id_nivel_grado, 'grupo-reingreso');
});//Desbloquea y muestra los niveles o grados en base a su modalidad en formulario matricula de reingreso ingreso
$('#btn-matricula_reingreso').on('click', function (e) {
    e.preventDefault();
    if (name_estudiante.value === '') {
        showMessage('alert-reingreso', 'danger', 'bi bi-exclamation-circle-fill', 'Debes seleccionar al estudiante!');
    } else {
        if (validarMatriculaReingreso() === 0) {
            crearModal('matricula_reingreso', 'btn-aceptar-matricula', '¿Deseas efectuar la matricula?');
            $("#matricula_reingreso").modal("show");
            $("#btn-aceptar-matricula").on("click", function (e) {
                e.preventDefault();
                datos_formReingreso = {
                    id_estudiante: select_row.id_estudiante,
                    grupo: parseInt(grupo_reingreso.value),
                    correo_usuario: correo_usuario.value
                }
                matriculaReingreso(datos_formReingreso);
            });//Evento del boton aceptar modal para permitir el ingreso de la matricula del estudiante
        }
    }
    const elements = ['#modalidad-reingreso', '#nivel-reingreso', '#grupo-reingreso'];
    elements.forEach(selector => {
        $(selector).on('change', function () {
            this.classList.remove('is-invalid');
            this.classList.replace('border-danger', 'border-secondary');
        });
    });//Para limpiar los errores de mi select en matricula de reingreso
});//Boton matricula reingreso

//Opcion Matricula de nuevo ingreso del nav tab
$("#checkTutor").change(function () {
    if ($(this).is(':checked')) {
        $("#btn-buscarTutor").prop('disabled', false);
        $('#form-tutor input, #form-tutor select').prop('disabled', true);
        aux = 1;
    } else {
        $("#btn-buscarTutor").prop('disabled', true);
        $('#form-tutor input, #form-tutor select').prop('disabled', false);
        aux = 0;
    }
    $("#form-tutor input, #form-tutor select").val('');
    cleanAll_Errors(form_tutor);
});// Habilitar y Deshabilitar el boton de buscar tutor y formulario tutor
$('#tutorModal').on('show.bs.modal', function () {
    var url = '/api/tutor_disponible';
    var table_tutor = $('#dt_tutor').DataTable({
        processing: true,
        serverSide: true,
        deferRender: true,
        ajax: {
            url: url,
            type: 'GET'
        },
        aaSorting: [],
        columns: [
            { data: "id_tutor" },
            { data: "nombres" },
            { data: "apellidos" },
            { data: "cedula" },
        ],
        columnDefs: [
            {
                className: "text-center", targets: 0
            }
        ],
        destroy: true,
        select: true,
        select: {
            style: 'single',
            toggleable: false,
            item: 'row',
            selector: 'td:not(:first-child)'
        },
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
    if (table_tutor) {
        $('#dt_tutor').on("click", "td:not(:first-child)", function () {
            select_row = table_tutor.row(this).data();
            if (typeof select_row != 'undefined')
                console.log(select_row);
        })
    }; //Seleccionar la fila
    $('#btn-aceptar-tutor').on('click', function () {
        if (typeof select_row != 'undefined') {
            nombres_tutor.value = select_row.nombres;
            apellidos_tutor.value = select_row.apellidos;
            cedula_tutor.value = select_row.cedula;
            correo_tutor.value = select_row.correo_e;
            sexo_tutor.value = select_row.sexo;
            telefono_tutor.value = select_row.telefono;
            direccion_tutor.value = select_row.direccion;
        }
        cleanAll_Errors(form_tutor);
    });
});//Cargar dt_tutor dentro del Modal
$('#modalidad-est').on('change', function () {
    const id_modalidad = $('#modalidad-est').val();
    $('#nivel-est').prop('disabled', false);
    turno_nuevoIngreso.value = 'Matutino';
    mostrarNivel(id_modalidad, 'nivel-est');
    $('#grupo-nuevoIngreso').prop('disabled', true).val('');
});//Desbloquea y muestra los niveles o grados en base a su modalidad en formulario matricula de nuevo ingreso
$('#nivel-est').on('change', function () {
    const id_nivel_est = parseInt($('#nivel-est').val());
    $('#grupo-nuevoIngreso').prop('disabled', false);
    mostrarGrupos(id_nivel_est, 'grupo-nuevoIngreso');
});//Desbloquea y muestra los grupos disponibles en base a su nivel o grado, en formulario matricula de nuevo ingreso
$('#btn-matriculaNuevo').on('click', function (e) {
    e.preventDefault();
    datos_formNuevoingreso = {
        nombres_tutor: nombres_tutor.value.trim(),//Tutor
        apellidos_tutor: apellidos_tutor.value.trim(),
        cedula_tutor: cedula_tutor.value.trim(),
        correo_e_tutor: correo_tutor.value.trim(),
        sexo_tutor: sexo_tutor.value,
        telefono_tutor: telefono_tutor.value.trim(),
        direccion_tutor: direccion_tutor.value.trim(),
        nombres_est: nombres_est.value.trim(),//Estudiante
        apellidos_est: apellidos_est.value.trim(),
        registroNac_est: registroNac_est.value.trim(),
        fechaNac_est: fechaNac_est.value,
        sexo_est: sexo_est.value.trim(),
        modalidad_est: modalidad_est.value.trim(),
        nivel_est: nivel_est.value.trim(),
        grupo_nuevoIngreso: grupo_nuevoIngreso.value,
        correo_usuario: correo_usuario.value,
        aux: aux
    };//Body para mandarlo con el axios
    validarFormularios(datos_formNuevoingreso);
    $("input[type='text'], input[type='date']").on('input', limpiarErrores);
    $('#sexo-est, #sexo-tutor, #modalidad-est, #nivel-est, #grupo-nuevoIngreso').on('change', limpiarErrores);
});//Boton para matricular estudiante de nuevo ingreso

//Opcion Historial del nav tab
$('#historial-tab').on('shown.bs.tab', function (e) {
    e.preventDefault();
    tabla_matricula.ajax.url(url).load();//Recarga el dt_matriculas_recientes
});//Muestra el datatable matricula al momnento de mostrar el tab historial

//Funciones de Matricula de nuevo ingreso
async function validarFormularios(datosForm) {
    try {
        const response = await axios.post('/api/verificar_tutorEstudiante', datosForm);
        const datosErrores = response.data;
        if (datosErrores.status === true) { respuestaServidor(datosErrores); }
        else { matricula_NuevoIngreso(datosForm); }
    } catch (error) { console.log('Error', error.message); }
};//Mandamos a evaluar con el express-validator
function mostrarNivel(id_modalidad, id_select) {
    const nivelView = document.getElementById(id_select);
    axios.post('/api/mostrar_nivel', { id_modalidad: id_modalidad })
        .then(response => {
            const nivel = response.data;
            nivelView.innerHTML = '<option selected disabled value="">Elegir...</option>';
            for (let i = 0; i < nivel.length; i++) {
                nivelView.innerHTML += `
                <option value=${nivel[i].id_nivel}>${nivel[i].nombre}</option>`;
                //turno_nuevoIngreso.value = nivel[i].turno;
            };
        })
        .catch(err => console.log('Error', err.message));
}//Mostramos que los grupos disponibles por cada nivel/grado
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
    $(this).removeClass('is-invalid');
    $(this).removeClass('border-danger');
    $(this).addClass('border-secondary');
};//Funcion para eliminar los inputs y selects al momento de modificar formulario de matricula de nuevo ingreso
function cleanAll_Errors(form) {
    const childrenLength = form.children.length;
    for (let i = 0; i < childrenLength; i++) {
        const child = form.children[i].children[1];
        child.classList.remove('is-invalid');
        child.classList.replace('border-danger', 'border-secondary');
    }
};//Borra todos los errores de los formularios estudiante y tutor
function limpiar_FormNuevoingreso() {
    if (aux === 0) {
        $("#formulario-matricula input, #formulario-matricula select").val('');
    } else {
        $("#form-estudiante input, #form-estudiante select").val('');
    }
    $('#nivel-est').prop('disabled', true);
    $('#grupo-nuevoIngreso').prop('disabled', true);
    select_row = '';
};//Limpia los inputs de matricula de nuevo ingreso
function matricula_NuevoIngreso(matricula) {
    crearModal('matricula_NuevoIngreso', 'btn-aceptar-matricula', '¿Deseas efectuar la matricula?');
    $("#matricula_NuevoIngreso").modal("show");
    $("#btn-aceptar-matricula").on("click", function (e) {
        e.preventDefault();
        datos_formNuevoingreso = {
            nombres_tutor: nombres_tutor.value.trim(),//Tutor
            apellidos_tutor: apellidos_tutor.value.trim(),
            cedula_tutor: cedula_tutor.value.trim(),
            correo_e_tutor: correo_tutor.value.trim(),
            sexo_tutor: sexo_tutor.value,
            telefono_tutor: parseInt(telefono_tutor.value.trim()),
            direccion_tutor: direccion_tutor.value.trim(),
            nombres_est: nombres_est.value.trim(),//Estudiante
            apellidos_est: apellidos_est.value.trim(),
            registroNac_est: registroNac_est.value.trim(),
            fechaNac_est: fechaNac_est.value,
            sexo_est: sexo_est.value.trim(),
            modalidad_est: modalidad_est.value.trim(),
            grupo_nuevoIngreso: grupo_nuevoIngreso.value,
            correo_usuario: correo_usuario.value,
            aux: aux
        };//Body para mandarlo con el axios
        axios.post('/api/matricula_nuevoingreso', matricula)
            .then(response => {
                const result = response.data;
                if (result.success == true) {
                    showToast('success', 'fa-solid fa-circle-check', 'La matricula se realizo con exito!');
                    //showMessage('alert-nuevoingreso', 'success', 'fa-solid fa-circle-check', 'La matricula se realizo con exito!');
                    limpiar_FormNuevoingreso();
                } else {
                    showToast('danger', 'bi bi-exclamation-circle-fill', 'Este estudiante ya esta matriculado!');
                    //showMessage('alert-nuevoingreso', 'danger', 'bi bi-exclamation-circle-fill', 'Este estudiante ya esta matriculado!');
                }
            })
            .catch(err => console.log('Error', err.message));
    })//Evento del boton aceptar modal para permitir el ingreso de la matricula del estudiante
};//funcion que permite matricular a los nuevos estudiantes previamente validados

//Funciones de Matricula de reingreso
function validarMatriculaReingreso() {
    // declaramos las variables
    const form_estudiante = [modalidad_reingreso, nivel_reingreso, grupo_reingreso];
    var aux2 = 0;
    //Validados que los campos esten correctos
    Array.from(form_estudiante).forEach(select => {
        if (!select.checkValidity()) {
            select.classList.add('is-invalid');
            aux2++;
        } else {
            select.classList.remove('is-invalid');
        }
    });
    return aux2; //Retornamos nuestra variable auxiliar que cuenta los errores de mis select de matricula Reingreso
};//Mandamos a evaluar con el express-validator
function matriculaReingreso(datos_formReingreso) {
    axios.post('/api/matricula_reingreso', datos_formReingreso)
        .then(response => {
            const result = response.data;
            if (result.success == true) {
                showToast('success', 'fa-solid fa-circle-check', 'La matricula se realizo con exito!');
                limpiar_FormReingreso();
            } else {
                showToast('danger', 'bi bi-exclamation-circle-fill', 'Este estudiante ya esta matriculado!');
                //showMessage('alert-reingreso', 'danger', 'bi bi-exclamation-circle-fill', 'Este estudiante ya esta matriculado!');
                $('#grupo').attr('disabled', 'disabled');
            }
        })
        .catch(err => console.log('Error', err.message));
}//Verificamos que el estudiante no este matriculado
function mostrarGrupos(id_nivel_grado, id_elemento) {
    const grupoView = document.getElementById(id_elemento);
    axios.post('/api/mostrar_grupo', { id_nivel_grado: id_nivel_grado })
        .then(response => {
            const grupo = response.data;
            grupoView.innerHTML = '<option selected disabled value="">Elegir...</option>';
            for (let i = 0; i < grupo.length; i++) {
                grupoView.innerHTML += `
                <option value=${grupo[i].id_detallegrupo}>${grupo[i].nombre}</option>`;
            }
        })
        .catch(err => console.log('Error', err.message));
}//Mostramos que los grupos disponibles por cada nivel/grado
function limpiar_FormReingreso() {
    $("#form-matricula").find("#name-estudiante, #name-tutor, #direccion, #modalidad-reingreso").val('');
    const elements = ['#nivel-reingreso', '#grupo-reingreso'];
    elements.forEach(selector => {
        $(selector).prop('disabled', true).val('');
    });
    select_row = '';
};//Limpia los inputs de matricula de reingreso

//Opcion Historial del nav tab
var url = '/api/matriculas_recientes';
var tabla_matricula = $('#dt-matricula').DataTable({
    processing: true,
    serverSide: true,
    deferRender: true,
    ajax: {
        url: url,
        type: 'GET'
    },
    aaSorting: [],
    columns: [
        { data: "id_matricula" },
        { data: "nombres_est" },
        { data: "apellidos_est" },
        { data: "nivel_grado" },
        { data: "grupo" },
        { data: "fecha" },
        { defaultContent: `<button type="button" class="editar btn btn-warning text-white" id="btn_editarMatricula" data-bs-target="#editMatriculaModal"><i class="fa-solid fa-square-pen"></i></button> <button type="button" class="imprimir btn btn-primary"><i class="fa-regular fa-file-pdf"></i></button> <button type="button" class="eliminar btn btn-danger"><i class="fa-solid fa-trash"></i></button>` }
    ],
    columnDefs: [
        {
            className: "text-center", targets: [0, 4, 5, 6]
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
        emptyTable: "Ninguna matricula registrada",
        zeroRecords: "Ningún registro encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún registro encontrado",
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
//Funciones para ejecutar las acciones de editar, imprimir y eliminar matricula
$('#dt-matricula tbody').on("click", "button.editar", function () {
    var data_matricula = tabla_matricula.row($(this).parents("tr")).data();
    const elements = ['#nivel-est-edit', '#grupo-est-edit'];
    $("#editMatriculaModal").modal("show");
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    elements.forEach(selector => {
        $(selector).prop('disabled', true).val('');
    });
    $('#modalidad-est-edit').val('');
    //cleanAll_Errors(form_editar_matricula);
    iniciarEditarMatricula(data_matricula);
});
$('#dt-matricula tbody').on("click", "button.imprimir", function () {
    var data_matricula = tabla_matricula.row($(this).parents("tr")).data();
    imprimirMatricula(data_matricula);
});
$('#dt-matricula tbody').on("click", "button.eliminar", function () {
    var data_matricula = tabla_matricula.row($(this).parents("tr")).data();
    eliminarMatricula(data_matricula.id_matricula);
});//Funciones para ejecutar las acciones de editar, imprimir y eliminar matricula

function eliminarMatricula(id_matricula) {
    crearModal('eliminarMatricula', 'btn-aceptar-eliminar-matricula', '¿Deseas eliminar esta matricula?');
    $("#eliminarMatricula").modal("show");
    $("#btn-aceptar-eliminar-matricula").on("click", function (e) {
        e.preventDefault();
        axios.post('/api/eliminar_matricula', { id_matricula: id_matricula })
            .then(response => {
                const result = response.data;
                if (result.success == true) {
                    showToast('success', 'fa-solid fa-circle-check', 'La matricula se elimino con exito!');
                    tabla_matricula.ajax.url(url).load();//Recarga el dt_matriculas_recientes
                } else {
                    showToast('danger', 'bi bi-exclamation-circle-fill', 'Este estudiante ya tiene notas registradas!');
                    //showMessage('alert-historial', 'danger', 'bi bi-exclamation-circle-fill', 'Este estudiante ya tiene notas registradas!');
                }
            })
            .catch(err => console.log('Error', err.message));
    })//Evento del boton aceptar modal para permitir el ingreso de la matricula del estudiante
};//Funcion para eliminar la matricula en base al id_matricula
function editarMatricula(datos_matriculaEdit) {
    axios.post('/api/editar_matricula', datos_matriculaEdit)
        .then(response => {
            const result = response.data;
            if (result.success == true) {
                showToast('success', 'fa-solid fa-circle-check', 'La matricula se modifico con exito!');
                //showMessage('alert-historial', 'success', 'fa-solid fa-circle-check', 'La matricula se edito con exito!');
                tabla_matricula.ajax.url(url).load();
            } else {
                showToast('danger', 'bi bi-exclamation-circle-fill', 'Ocurrio un error inesperado!');
                //showMessage('alert-historial', 'danger', 'bi bi-exclamation-circle-fill', 'Debes seleccionar al estudiante!');
            }
        })
        .catch(err => console.log('Error', err.message));
}//Funcion para editar la matricula en base al id_matricula
function imprimirMatricula(data_matricula) {
    axios.get('/api/imprimir_matricula', {
        params: { matricula: data_matricula },
        responseType: "blob",
        headers: {
            "Content-Type": "application/pdf"
        }
    }).then((response) => {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'hoja_matricula.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    })
        .catch(err => console.log('Error', err.message));
}//Funcion para imprimir la matricula

//Funciones de editar matricula
function iniciarEditarMatricula(data_matricula) {
    $('#modalidad-est-edit').on('change', function () {
        const id_modalidad_edit = $('#modalidad-est-edit').val();
        $('#nivel-est-edit').prop('disabled', false);
        $('#grupo-est-edit').prop('disabled', true).val('');
        mostrarNivel(id_modalidad_edit, 'nivel-est-edit');
    });//Desbloquea y muestra los niveles o grados en base a su modalidad
    $('#nivel-est-edit').on('change', function () {
        const id_nivel_est = parseInt($('#nivel-est-edit').val());
        $('#grupo-est-edit').prop('disabled', false);
        mostrarGrupos(id_nivel_est, 'grupo-est-edit');
    });//Desbloquea y muestra los grupos disponibles en base a su nivel o grado
    nombre_est_edit.value = data_matricula.nombres_est + ' ' + data_matricula.apellidos_est;
    registroNac_est_edit.value = data_matricula.registroNac_est;
    fechaNac_est_edit.value = data_matricula.fechaNac_est;
    sexo_est_edit.value = data_matricula.sexo_est === 'M' ? 'Masculino' : 'Femenino';
    grupoactual_est_edit.value = data_matricula.modalidad + ' ' + data_matricula.nivel_grado + ' ' + data_matricula.grupo;
    fechaNac_est_edit.value = fechaFormateada(data_matricula.fechaNac_est);
    $('#btn-modificar-matricula').on('click', function () {
        if (validarMatriculaEditar() === 0) {
            crearModal2('editar_matricula', 'btn-aceptar-editar-matricula', '¿Deseas guardar estos cambios?');
            $("#editar_matricula").modal("show");
            $("#btn-aceptar-editar-matricula").on("click", function (e) {
                e.preventDefault();
                $("#editar_matricula").modal("hide");
                $("#editMatriculaModal").modal("hide");
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                datos_matriculaEdit = {
                    id_matricula: data_matricula.id_matricula,
                    id_grupo: parseInt(grupo_est_edit.value)
                }
                editarMatricula(datos_matriculaEdit);
            });//Evento del boton aceptar modal para permitir el ingreso los datos editados de matricula
            $("#btn_cerrar_modal").on("click", function (e) {
                e.preventDefault();
                $("#editar_matricula").modal("hide");
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
            });//cierra el modal notificacion --> "¿Estas seguro?"
        }
        $('#modalidad-est-edit, #nivel-est-edit, #grupo-est-edit').on('change', limpiarErrores);
    });
};//Inicializa la opcion para editar los grupos de matricula
function validarMatriculaEditar() {
    // declaramos las variables
    const form_matricula_edit = [modalidad_est_edit, nivel_est_edit, grupo_est_edit];
    var aux3 = 0;
    //Validados que los campos esten correctos
    Array.from(form_matricula_edit).forEach(select => {
        if (!select.checkValidity()) {
            select.classList.add('is-invalid');
            aux3++;
        } else {
            select.classList.remove('is-invalid');
        }
    });
    return aux3; //Retornamos nuestra variable auxiliar que cuenta los errores de mis select de mi cambios de mi matricula
}//Valida que los inputs select no esten vacios

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
function showMessage(id, type, icon, message) {
    const messageDiv = document.getElementById(id);
    messageDiv.innerHTML = '';
    messageDiv.innerHTML = `
        <div class="alert alert-${type}" role="alert" id="alert-message">
            <div class="d-flex flex-row">
                <div class="error__icon pe-4">
                    <i class="${icon}"></i>
                </div>
                <div class="message__title">${message}</div>
            </div>
        </div>`;
    const alert = document.getElementById('alert-message');
    setTimeout(() => {
        alert.remove();
    }, 4000);
};//Funcion para mostrar la alerta en el formulario matricula
function fechaFormateada(fecha) {
    // Dividir la cadena en partes: día, mes y año
    var partesFecha = fecha.split('/');
    // Crear una nueva fecha en JavaScript con las partes de la fecha
    var fecha = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
    // Convertir la fecha a una cadena en formato YYYY-MM-DD
    var fechaFormateada = fecha.toISOString().slice(0, 10);
    return fechaFormateada;
}//Esta funcion permite convertir el formato de la fecha a uno que reconozca el input de tipo date

$(document).keypress(
    function (event) {
        if (event.which == '13') {
            event.preventDefault();
        }
    });//Para Evitar el submit del formulario con presionar Enter
