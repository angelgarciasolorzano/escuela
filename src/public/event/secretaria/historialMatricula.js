//Variables globales para editar matricula estudiante
const nombre_est_edit = document.getElementById('nombre-est-edit');
const codigo_est_edit = document.getElementById('codigo-est-edit');
const fechaNac_est_edit = document.getElementById('fechaNac-est-edit');
const sexo_est_edit = document.getElementById('sexo-est-edit');
const repitente_est_edit = document.getElementById('repitente-est-edit');
const trasladado_est_edit = document.getElementById('trasladado-est-edit');
const grupoactual_est_edit = document.getElementById('grupoactual-est-edit');
const modalidad_est_edit = document.getElementById('modalidad-est-edit');
const nivel_est_edit = document.getElementById('nivel-est-edit');
const grupo_est_edit = document.getElementById('grupo-est-edit');
const form_editar_matricula = document.getElementById('form-editar-matricula');


//Opcion Historial de matriculas recientes
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
    ordering: false,
    columns: [
        { data: "codigo_est" },
        { data: "nombres_est" },
        { data: "apellidos_est" },
        { data: "nivel_grado" },
        { data: "grupo" },
        { data: "estado_matricula" },
        { data: "fecha" },
        { defaultContent: `<button type="button" class="editar btn btn-warning text-white" id="btn_editarMatricula" data-bs-target="#editMatriculaModal"><i class="fa-solid fa-square-pen"></i></button> <button type="button" class="imprimir btn btn-primary"><i class="fa-regular fa-file-pdf"></i></button> <button type="button" class="eliminar btn btn-danger"><i class="fa-solid fa-xmark"></i></button>` }
    ],
    columnDefs: [
        {
            className: "text-center", targets: [0, 4, 5, 6]
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
        }
    }
});
// //Funciones para ejecutar las acciones de editar, imprimir y eliminar matricula
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
    cancelarMatricula(data_matricula.id_matricula);
});//Funciones para ejecutar las acciones de editar, imprimir y cancelar matricula

function editarMatricula(datos_matriculaEdit) {
    axios.post('/api/editar_matricula', datos_matriculaEdit)
        .then(response => {
            const result = response.data;
            if (result.success == true) {
                showToast('success', 'fa-solid fa-circle-check', 'La matricula se modifico con exito!');
                tabla_matricula.ajax.url(url).load();
            } else {
                showToast('danger', 'bi bi-exclamation-circle-fill', 'Ocurrio un error inesperado!');
            }
        })
        .catch(err => console.log('Error', err.message));
}//Funcion para editar la matricula en base al id_matricula
function cancelarMatricula(id_matricula) {
    crearModal('cancelarMatricula', 'btn-aceptar-cancelar-matricula', '¿Deseas cancelar esta matricula?');
    $("#cancelarMatricula").modal("show");
    $("#btn-aceptar-cancelar-matricula").on("click", function (e) {
        e.preventDefault();
        axios.post('/api/cancelar_matricula', { id_matricula: id_matricula })
            .then(response => {
                const result = response.data;
                if (result.success == true) {
                    showToast('success', 'fa-solid fa-circle-check', 'La matricula se cancelo con exito!');
                    tabla_matricula.ajax.url(url).load();//Recarga el dt_matriculas_recientes
                } else {
                    showToast('danger', 'bi bi-exclamation-circle-fill', result.msg)
                    //showMessage('alert-historial', 'danger', 'bi bi-exclamation-circle-fill', 'Este estudiante ya tiene notas registradas!');
                }
            })
            .catch(err => console.log('Error', err.message));
    })//Evento del boton aceptar modal para permitir el ingreso de la matricula del estudiante
};//Funcion para eliminar la matricula en base al id_matricula
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

$('#grupo-est-edit').on('focus', function() {
    const id_nivel_est = parseInt($('#nivel-est-edit').val());
    mostrarGruposEdit(id_nivel_est);
});

//Funciones de editar matricula
function iniciarEditarMatricula(data_matricula) {
    $('#modalidad-est-edit').on('change', function () {
        const id_modalidad_edit = $('#modalidad-est-edit').val();
        $('#nivel-est-edit').prop('disabled', false);
        $('#grupo-est-edit').prop('disabled', true).val('');
        mostrarNivel(id_modalidad_edit, 'nivel-est-edit');
    });//Desbloquea y muestra los niveles o grados en base a su modalidad
    $('#nivel-est-edit').on('change', function () {
        $('#grupo-est-edit').prop('disabled', false);
    });//Desbloquea y muestra los grupos disponibles en base a su nivel o grado
    nombre_est_edit.value = data_matricula.nombres_est + ' ' + data_matricula.apellidos_est;
    codigo_est_edit.value = data_matricula.codigo_est;
    $('#repitente-est-edit').val(data_matricula.repitente_est);
    $('#trasladado-est-edit').val(data_matricula.traslado_est);
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
                    id_grupo: parseInt(grupo_est_edit.value),
                    repitente: repitente_est_edit.value,
                    traslado: trasladado_est_edit.value,
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
function mostrarGruposEdit(id_nivel_est) {
    const grupoView = document.getElementById('grupo-est-edit');
    axios.post('/api/mostrar_grupo', { id_nivel_grado: id_nivel_est })
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
function limpiarErrores() {
    $(this).removeClass('is-invalid');
    $(this).removeClass('border-danger');
    $(this).addClass('border-secondary');
};//Funcion para eliminar los inputs y selects al momento de modificar formulario de matricula de nuevo ingreso
function fechaFormateada(fecha) {
    // Dividir la cadena en partes: día, mes y año
    var partesFecha = fecha.split('/');
    // Crear una nueva fecha en JavaScript con las partes de la fecha
    var fecha = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
    // Convertir la fecha a una cadena en formato YYYY-MM-DD
    var fechaFormateada = fecha.toISOString().slice(0, 10);
    return fechaFormateada;
}//Esta funcion permite convertir el formato de la fecha a uno que reconozca el input de tipo date