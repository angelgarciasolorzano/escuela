//Matricula reingreso
const name_estudiante = document.getElementById('name-estudiante');
const codigo_est_reingreso = document.getElementById('codigo-est-reingreso');
const name_tutor = document.getElementById('name-tutor');
var repitente_est_reingreso = document.getElementById('repitente-est-reingreso');
var trasladado_est_reingreso = document.getElementById('trasladado-est-reingreso');
var modalidad_reingreso = document.getElementById('modalidad-reingreso');
var nivel_reingreso = document.getElementById('nivel-reingreso');
var grupo_reingreso = document.getElementById('grupo-reingreso');
const turno_reingreso = document.getElementById('turno-reingreso');
const correo_usuario = document.getElementById('correo_usuario');
let select_row = '';
var datos_formReingreso = {};


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
            { data: "codigo_est" },
            { data: "nombres_est" },
            { data: "apellidos_est" },
            { data: "estado_est" },
            { data: "nombres_tutor" },
            { data: "cedula_tutor" },
            { defaultContent: `<button type="button" class="buscar btn btn-primary"><i class="fa-solid fa-magnifying-glass"></i></button>` }
        ],
        columnDefs: [
            {
                className: "text-center", targets: [0, 6]
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
            codigo_est_reingreso.value = select_row.codigo_est;
            name_tutor.value = select_row.nombres_tutor;
            turno_reingreso.value = 'Matutino';
            $('#modalidad-reingreso, #repitente-est-reingreso, #trasladado-est-reingreso').prop('disabled', false);
        }
    });
}); //Cargar dt_estudiante dentro del Modal
$('#btn_buscarEstudiantes').on('click', function () {
    limpiar_FormReingreso();
});//Antes de buscar limpio el formulario matricula de reingreso
$("#trasladado-est-reingreso").on('change', function () {
    const trasladadohojas_est = $('#trasladado-est-reingreso').val();
    if (trasladadohojas_est === 'Si') {
        $("#hojasTrasladoReingreso").removeClass('d-none');
    } else {
        $("#hojasTrasladoReingreso").addClass('d-none');
    }
});// Habilitar y Deshabilitar el check para las 2 hojas de traslado en matricula nuevo ingreso
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
        showToast('danger', 'bi bi-exclamation-circle-fill', 'Debe seleccionar el estudiante!');
    } else {
        if (validarMatriculaReingreso() === 0) {
            crearModal('matricula_reingreso', 'btn-aceptar-matricula', '¿Deseas efectuar la matricula?');
            $("#matricula_reingreso").modal("show");
            $("#btn-aceptar-matricula").on("click", function (e) {
                e.preventDefault();
                datos_formReingreso = {
                    id_estudiante: select_row.id_estudiante,
                    repitente: repitente_est_reingreso.value,
                    traslado: trasladado_est_reingreso.value,
                    grupo: parseInt(grupo_reingreso.value),
                    correo_usuario: correo_usuario.value
                }
                matriculaReingreso(datos_formReingreso);
            });//Evento del boton aceptar modal para permitir el ingreso de la matricula del estudiante
        }
    }
    const elements = ['#repitente-est-reingreso', '#trasladado-est-reingreso', '#modalidad-reingreso', '#nivel-reingreso', '#grupo-reingreso'];
    elements.forEach(selector => {
        $(selector).on('change', function () {
            this.classList.remove('is-invalid');
            this.classList.replace('border-danger', 'border-secondary');
        });
    });//Para limpiar los errores de mi select en matricula de reingreso
});//Boton matricula reingreso

//Funciones de Matricula de reingreso
function validarMatriculaReingreso() {
    // declaramos las variables
    const form_estudiante = [repitente_est_reingreso, trasladado_est_reingreso, modalidad_reingreso, nivel_reingreso, grupo_reingreso];
    var aux2 = 0;
    //Validados que los campos esten correctos
    Array.from(form_estudiante).forEach(select => {
        if (!select.checkValidity()) {
            select.classList.add('is-invalid');
            select.classList.remove('border-secondary');
            select.classList.add('border-danger');
            aux2++;
        } else {
            select.classList.remove('is-invalid');
            select.classList.remove('border-danger');
            select.classList.add('border-secondary');
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
                showToast('danger', 'bi bi-exclamation-circle-fill', result.msg);
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
                <option value=${grupo[i].id_detallegrupo}>
                    ${grupo[i].nombre} - Cupos: ${grupo[i].capacidad}
                </option>`;
            }
        })
        .catch(err => console.log('Error', err.message));
}//Mostramos que los grupos disponibles por cada nivel/grado
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
function limpiar_FormReingreso() {
    $("#form-matricula").find("#name-estudiante, #name-tutor, #codigo-est-reingreso, #modalidad-reingreso, #repitente-est-reingreso, #trasladado-est-reingreso").val('');
    const elements = ['#nivel-reingreso', '#grupo-reingreso', '#repitente-est-reingreso', '#trasladado-est-reingreso'];
    elements.forEach(selector => {
        $(selector).prop('disabled', true).val('');
    });
    select_row = '';
    tabla_matricula.ajax.url('/api/matriculas_recientes').load();
};//Limpia los inputs de matricula de reingreso
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

//Componente reutilizable que muestra un toast de notificacion
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
};

