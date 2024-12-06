//Variables globales del evento progress bar y btns
const prevBtns = document.querySelectorAll(".btn-prev");
const nextBtns = document.querySelectorAll(".btn-next");
const progress = document.getElementById("progress");
const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");
let formStepsNum = 0;

//Matricula nuevo ingreso
//Variables globales para el formulario Tutor
const nombres_tutor = document.getElementById('nombres-tutor');
const cedula_tutor = document.getElementById('cedula-tutor');
const correo_tutor = document.getElementById('correo-tutor');
const relacion_tutor = document.getElementById('relacion-tutor');
const telefono_tutor = document.getElementById('telefono-tutor');
const ocupacion_tutor = document.getElementById('ocupacion-tutor');
const direccion_tutor = document.getElementById('direccion-tutor');
const nombres_madre = document.getElementById('nombres-madre');
const cedula_madre = document.getElementById('cedula-madre');
const telefono_madre = document.getElementById('telefono-madre');
const nombres_padre = document.getElementById('nombres-padre');
const cedula_padre = document.getElementById('cedula-padre');
const telefono_padre = document.getElementById('telefono-padre');
const form_tutor = document.getElementById('form-tutor');
const form_madre = document.getElementById('form-madre');
const form_padre = document.getElementById('form-padre');
//Variables globales para el formulario Estudiante
const nombres_est = document.getElementById('nombres-est');
const apellidos_est = document.getElementById('apellidos-est');
const codigo_est = document.getElementById('codigo-est');
const cedula_est = document.getElementById('cedula-est');
const registroNac_est = document.getElementById('registroNac-est');
const fechaNac_est = document.getElementById('fecha-est');
const sexo_est = document.getElementById('sexo-est');
const etnia_est = document.getElementById('etnia-est');
const lengua_est = document.getElementById('lengua-est');
const discapacidad_est = document.getElementById('discapacidad-est');
const telefono_est = document.getElementById('telefono-est');
const lugarNac_est = document.getElementById('lugarNac-est');
const nacionalidad_est = document.getElementById('nacionalidad-est');
const direccionDom_est = document.getElementById('direccionDom-est');
const modalidad_est = document.getElementById('modalidad-est');
const nivel_est = document.getElementById('nivel-est');
const repitente_est = document.getElementById('repitente-est');
const trasladado_est = document.getElementById('trasladado-est');
const checkTrasladadoNuevo_est = document.getElementById('checkTrasladadoNuevo-est');
const grupo_nuevoIngreso = document.getElementById('grupo-nuevoIngreso');

var turno_nuevoIngreso = document.getElementById('turno-nuevoIngreso');
const form_estudiante = document.getElementById('form-estudiante');
var datos_formNuevoingreso = {};
var aux = 0;
let selectRow = '';

//Navegacion entre los botones
$('#btn-tutor').on("click", function (e) {
    e.preventDefault();
    const formTutor = {
        nombres_tutor: nombres_tutor.value.trim(),//Tutor
        cedula_tutor: cedula_tutor.value.trim(),
        correo_e_tutor: correo_tutor.value.trim(),
        telefono_tutor: telefono_tutor.value.trim(),
        ocupacion_tutor: ocupacion_tutor.value,
        direccion_tutor: direccion_tutor.value.trim(),
        relacion_tutor: relacion_tutor.value,
        cedula_madre: cedula_madre.value.trim(),
        telefono_madre: telefono_madre.value.trim(),
        cedula_padre: cedula_padre.value.trim(),
        telefono_padre: telefono_padre.value.trim(),
        aux: aux
    };//Body para mandarlo con el axios
    if ($('#checkTutor').is(':checked') && nombres_tutor.value === '') {
        showToast('danger', 'bi bi-exclamation-circle-fill', 'Debe seleccionar al tutor!');
    } else {
        verificarForms(formTutor, '/api/verificar_tutor');
        $("input[type='text'], input[type='date']").on('input', limpiarErrores);
        $('#relacion-tutor').on('change', limpiarErrores);
    }
});//Evento Validar los documentos obligatorios
$('#btn-padres').on("click", function () {
    const formPadres = {
        nombres_madre: nombres_madre.value.trim(),
        cedula_madre: cedula_madre.value.trim(),
        telefono_madre: telefono_madre.value.trim(),
        nombres_padre: nombres_padre.value.trim(),
        cedula_padre: cedula_padre.value.trim(),
        telefono_padre: telefono_padre.value.trim(),
        relacion_tutor: relacion_tutor.value,
        cedula_tutor: cedula_tutor.value.trim(),
        telefono_tutor: telefono_tutor.value.trim(),
        cedula_est: cedula_est.value.trim(),
        telefono_est: telefono_est.value.trim(),
        aux: aux
    };//Body para mandarlo con el axios
    verificarForms(formPadres, '/api/verificar_padres');
    $("input[type='text']").on('input', limpiarErrores);
});//Evento validar el formulario del tutor
$("#btn-estudiante").on("click", function (e) {
    e.preventDefault();
    const formEstudiante = {
        nombres_est: nombres_est.value.trim(),//Estudiante
        apellidos_est: apellidos_est.value.trim(),
        codigo_est: codigo_est.value.trim(),
        cedula_est: cedula_est.value.trim(),
        fechaNac_est: fechaNac_est.value,
        sexo_est: sexo_est.value,
        etnia_est: etnia_est.value,
        lengua_est: lengua_est.value,
        discapacidad_est: discapacidad_est.value,
        telefono_est: telefono_est.value.trim(),
        lugarNac_est: lugarNac_est.value.trim(),
        nacionalidad_est: nacionalidad_est.value.trim(),
        direccionDom_est: direccionDom_est.value.trim(),
        cedula_tutor: cedula_tutor.value.trim(),
        telefono_tutor: telefono_tutor.value.trim(),
        cedula_madre: cedula_madre.value.trim(),
        telefono_madre: telefono_madre.value.trim(),
        cedula_padre: cedula_padre.value.trim(),
        telefono_padre: telefono_padre.value.trim(),
        aux: aux
    };//Body para mandarlo con el axios
    verificarForms(formEstudiante, '/api/verificar_estudiante');
    $("input[type='text'], input[type='date']").on('input', limpiarErrores);
    $('#sexo-est, #etnia-est, #lengua-est, #discapacidad-est').on('change', limpiarErrores);
});//Evento validar y añadir card estudiante
$("#btn-ingresarMatricula").on("click", function (e) {
    e.preventDefault();
    const formDatosMatricula = {
        modalidad_est: modalidad_est.value.trim(),
        nivel_est: nivel_est.value.trim(),
        repitente_est: repitente_est.value,
        trasladado_est: trasladado_est.value,
        grupo_nuevoIngreso: grupo_nuevoIngreso.value,
        aux: aux
    };//Body para mandarlo con el axios
    verificarFormMatricula(formDatosMatricula, '/api/verificar_formMatricula');
    $("input[type='text'], input[type='date']").on('input', limpiarErrores);
    $('#modalidad-est, #nivel-est, #grupo-nuevoIngreso, #repitente-est, #trasladado-est').on('change', limpiarErrores);
});//Evento para ingresar la matricula


//Opcion Matricula de nuevo ingreso del nav tab

//Acciones de form tutor y padres
$("#checkTutor").change(function () {
    if ($(this).is(':checked')) {
        $("#btn-buscarTutor").prop('disabled', false);
        $('#form-tutor input, #form-tutor select').prop('disabled', true);
        aux = 1;
    } else {
        $("#btn-buscarTutor").prop('disabled', true);
        $('#form-tutor input, #form-tutor select').prop('disabled', false);
        $('#relacion-tutor').prop('disabled', true);
        aux = 0;
    }
    $("#form-tutor input, #form-tutor select").val('');
    $("#form-madre input, #form-madre select").val('');
    $("#form-padre input, #form-padre select").val('');
    cleanAll_Errors(form_tutor);
    cleanAll_Errors(form_madre);
    cleanAll_Errors(form_padre);
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
            { data: "cedula" },
        ],
        columnDefs: [
            {
                className: "text-center", targets: 0
            }
        ],
        destroy: true,
        select: {
            style: 'single',
            toggleable: false,
            item: 'row',
            selector: 'td:not(:first-child)'
        },
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
            selectRow = table_tutor.row(this).data();
        })
    }; //Seleccionar la fila
    $('#btn-aceptar-tutor').on('click', function () {
        if (typeof selectRow != 'undefined') {
            nombres_tutor.value = selectRow.nombres;
            cedula_tutor.value = selectRow.cedula;
            correo_tutor.value = selectRow.correo_e;
            ocupacion_tutor.value = selectRow.ocupacion;
            telefono_tutor.value = selectRow.telefono;
            direccion_tutor.value = selectRow.direccion_trab;
        }
        cleanAll_Errors(form_tutor);
        $('#relacion-tutor').prop('disabled', false);
        //$("#fieldsetMadre, #fieldsetPadre").removeClass('d-none');
    });
});//Cargar dt_tutor dentro del Modal
$('#relacion-tutor').on('change', function () {
    var inputMadreDes = $('#nombres-madre').prop('disabled');
    var inpuPadreDes = $('#nombres-padre').prop('disabled');
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
$("#cedula-madre, #telefono-madre").on('input', function () {
    limpiarErrorEspecial('#nombres-madre');
    limpiarErrorEspecial('#cedula-padre');
    limpiarErrorEspecial('#telefono-padre');
});//Limpiamos nombres-madre, telefono-est y cedula-est
$("#cedula-padre, #telefono-padre").on('input', function () {
    limpiarErrorEspecial('#nombres-padre');
    limpiarErrorEspecial('#cedula-madre');
    limpiarErrorEspecial('#telefono-madre');
});//Limpiamos nombres-padre, telefono-est y cedula-est
$('#grupo-nuevoIngreso').on('focus', function() {
    id_nivel_grado = nivel_est.value;
    mostrarGruposNuevoIngreso(id_nivel_grado);
});
//Opcion Matricula de nuevo ingreso del nav tab


$("#trasladado-est").on('change', function () {
    const trasladadohojas_est = $('#trasladado-est').val();
    if (trasladadohojas_est === 'Si') {
        $("#hojasTrasladoNuevo").removeClass('d-none');
    } else {
        $("#hojasTrasladoNuevo").addClass('d-none');
    }
});// Habilitar y Deshabilitar el check para las 2 hojas de traslado en matricula nuevo ingreso
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
        cedula_tutor: cedula_tutor.value.trim(),
        correo_e_tutor: correo_tutor.value.trim(),
        telefono_tutor: telefono_tutor.value.trim(),
        ocupacion_tutor: ocupacion_tutor.value,
        direccion_tutor: direccion_tutor.value.trim(),
        relacion_tutor: relacion_tutor.value,
        nombres_est: nombres_est.value.trim(),//Estudiante
        apellidos_est: apellidos_est.value.trim(),
        codigo_est: codigo_est.value.trim(),
        cedula_est: cedula_est.value.trim(),
        registroNac_est: registroNac_est.value.trim(),
        fechaNac_est: fechaNac_est.value,
        sexo_est: sexo_est.value,
        etnia_est: etnia_est.value,
        lengua_est: lengua_est.value,
        discapacidad_est: discapacidad_est.value,
        telefono_est: telefono_est.value.trim(),
        lugarNac_est: lugarNac_est.value.trim(),
        nacionalidad_est: nacionalidad_est.value.trim(),
        direccionDom_est: direccionDom_est.value.trim(),
        nombres_madre: nombres_madre.value.trim(),
        cedula_madre: cedula_madre.value.trim(),
        telefono_madre: telefono_madre.value.trim(),
        nombres_padre: nombres_padre.value.trim(),
        cedula_padre: cedula_padre.value.trim(),
        telefono_padre: telefono_padre.value.trim(),
        modalidad_est: modalidad_est.value.trim(),
        nivel_est: nivel_est.value.trim(),
        repitente_est: repitente_est.value,
        trasladado_est: trasladado_est.value,
        grupo_nuevoIngreso: grupo_nuevoIngreso.value,
        correo_usuario: correo_usuario.value,
        aux: aux
    };//Body para mandarlo con el axios
    validarFormularios(datos_formNuevoingreso);
    $("input[type='text'], input[type='date']").on('input', limpiarErrores);
    $('#sexo-tutor, #relacion-tutor, #sexo-est, #etnia-est, #lengua-est, #discapacidad-est, #modalidad-est, #nivel-est, #grupo-nuevoIngreso, #repitente-est, #trasladado-est').on('change', limpiarErrores);
});//Boton para matricular estudiante de nuevo ingreso
function mostrarGruposNuevoIngreso(id_nivel_grado) {
    const grupoView = document.getElementById('grupo-nuevoIngreso');
    axios.post('/api/mostrar_grupo', { id_nivel_grado: id_nivel_grado })
        .then(response => {
            const grupo = response.data;
            grupoView.innerHTML = ' ';
            grupoView.innerHTML = '<option selected disabled value="">Elegir...</option>';
            for (let i = 0; i < grupo.length; i++) {
                grupoView.innerHTML += `
                <option value=${grupo[i].id_detallegrupo}>
                    ${grupo[i].nombre} - Cupos: ${grupo[i].capacidad}
                </option>`;
            }
        })
        .catch(err => console.log('Error', err.message));
}//Mostramos que los grupos disponibles por cada nivel/grado

async function verificarForms(formTutor, url) {
    try {
        const response = await axios.post(url, formTutor);
        const datosErrores = response.data;
        if (datosErrores.status === true) {
            respuestaServidor(datosErrores);
        }
        else { nextForm(); }
    } catch (error) { console.log('Error', error.message); }
};//Evalua que los datos ingresados en el form-tutor sean los correctos
async function verificarFormMatricula(formDatosMatricula, url) {
    datos_formNuevoingreso = {
        nombres_tutor: nombres_tutor.value.trim(),//Tutor
        cedula_tutor: cedula_tutor.value.trim(),
        correo_e_tutor: correo_tutor.value.trim(),
        telefono_tutor: telefono_tutor.value.trim(),
        ocupacion_tutor: ocupacion_tutor.value,
        direccion_tutor: direccion_tutor.value.trim(),
        nombres_est: nombres_est.value.trim(),//Estudiante
        apellidos_est: apellidos_est.value.trim(),
        codigo_est: codigo_est.value.trim(),
        cedula_est: cedula_est.value.trim(),
        fechaNac_est: fechaNac_est.value,
        sexo_est: sexo_est.value,
        etnia_est: etnia_est.value,
        lengua_est: lengua_est.value,
        discapacidad_est: discapacidad_est.value,
        telefono_est: telefono_est.value.trim(),
        lugarNac_est: lugarNac_est.value.trim(),
        nacionalidad_est: nacionalidad_est.value.trim(),
        direccionDom_est: direccionDom_est.value.trim(),
        relacion_tutor: relacion_tutor.value,
        nombres_madre: nombres_madre.value.trim(),
        cedula_madre: cedula_madre.value.trim(),
        telefono_madre: telefono_madre.value.trim(),
        nombres_padre: nombres_padre.value.trim(),
        cedula_padre: cedula_padre.value.trim(),
        telefono_padre: telefono_padre.value.trim(),
        modalidad_est: modalidad_est.value.trim(),
        nivel_est: nivel_est.value.trim(),
        repitente_est: repitente_est.value,
        trasladado_est: trasladado_est.value,
        grupo_nuevoIngreso: grupo_nuevoIngreso.value,
        aux: aux
    };//Body para mandarlo con el axios
    try {
        const response = await axios.post(url, datos_formNuevoingreso);
        const datosErrores = response.data;
        if (datosErrores.status === true) {
            respuestaServidor(datosErrores);
        }
        else { matricula_NuevoIngreso(datos_formNuevoingreso); }
    } catch (error) { console.log('Error', error.message); }
};//Evalua que los datos ingresados en el form-tutor sean los correctos
function matricula_NuevoIngreso(matricula) {
    crearModal('matricula_NuevoIngreso', 'btn-aceptar-matricula', '¿Deseas efectuar la matricula?');
    $("#matricula_NuevoIngreso").modal("show");
    $("#btn-aceptar-matricula").on("click", function (e) {
        e.preventDefault();
        axios.post('/api/matricula_nuevoingreso', matricula)
            .then(response => {
                const result = response.data;
                if (result.success == true) {
                    showToast('success', 'fa-solid fa-circle-check', 'La matricula se realizo con exito!');
                    limpiar_FormNuevoingreso();
                } else {
                    showToast('danger', 'bi bi-exclamation-circle-fill', result.msg);
                }
            })
            .catch(err => console.log('Error', err.message));
    })//Evento del boton aceptar modal para permitir el ingreso de la matricula del estudiante
};//funcion que permite matricular a los nuevos estudiantes previamente validados



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
function limpiar_FormNuevoingreso() {
    if (aux === 0) {
        $("#form-tutor input").val('');
        $("#form-madre input").prop('disabled', false).val('');
        $("#form-padre input").prop('disabled', false).val('');
        $('#relacion-tutor').prop('disabled', true).val('');
    }
    $("#form-estudiante input, #form-estudiante select").val('');
    $("#form-matriculaNuevo input, #form-matriculaNuevo select").val('');
    $('#nivel-est').prop('disabled', true);
    $('#grupo-nuevoIngreso').prop('disabled', true);
    initialForm();//Reiniciamos el step bar
    selectRow = '';
    tabla_matricula.ajax.url('/api/matriculas_recientes').load();
};//Limpia los inputs de matricula de nuevo ingreso
function cleanAll_Errors(form) {
    const childrenLength = form.children.length;
    for (let i = 0; i < childrenLength; i++) {
        const child = form.children[i].children[1];
        child.classList.remove('is-invalid');
        child.classList.replace('border-danger', 'border-secondary');
    }
};//Borra todos los errores de los formularios estudiante y tutor
function limpiarErrorEspecial(id_input) {
    $(id_input).removeClass('is-invalid');
    $(id_input).removeClass('border-danger');
    $(id_input).addClass('border-secondary');
}//Funcion para limpiar un error cuando se modifica desde otro input
function limpiarErrores() {
    $(this).removeClass('is-invalid');
    $(this).removeClass('border-danger');
    $(this).addClass('border-secondary');
};//Funcion para eliminar los inputs y selects al momento de modificar formulario de matricula de nuevo ingreso
//Herramientas
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


//Funcionalidad del bar progress
function nextForm() {
    formStepsNum++;
    updateFormSteps();
    updateProgressbar();
};//Habilita al siguiente formulario
prevBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        formStepsNum--;
        updateFormSteps();
        updateProgressbar();
    });
});//Evento para regresar al otro fomulario
//Espacio para declarar funciones progress bar
function nextForm() {
    formStepsNum++;
    updateFormSteps();
    updateProgressbar();
};//Habilita al siguiente formulario
function initialForm() {
    formStepsNum = 0;
    updateFormSteps();
    updateProgressbar();
}//Inicializa los pasos para el formulario
function updateFormSteps() {
    formSteps.forEach((formStep) => {
        formStep.classList.contains("form-step-active") &&
            formStep.classList.remove("form-step-active");
    });
    formSteps[formStepsNum].classList.add("form-step-active");
};//Efecto css para los formStep
function updateProgressbar() {
    progressSteps.forEach((progressStep, idx) => {
        if (idx < formStepsNum + 1) {
            progressStep.classList.add("progress-step-active");
        } else {
            progressStep.classList.remove("progress-step-active");
        }
    });
    const progressActive = document.querySelectorAll(".progress-step-active");
    progress.style.width =
        ((progressActive.length - 1) / (progressSteps.length - 1)) * 100 + "%";
};//Efecto css para el progressBar


