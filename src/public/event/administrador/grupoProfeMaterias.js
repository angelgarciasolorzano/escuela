document.addEventListener('DOMContentLoaded', (event) => {
  const grupos = document.getElementById('grupos');
  const profesor = document.getElementById('profesor');
  const materia = document.getElementById('materia');
  const profesor_Guia = document.getElementById('profesor-guia');
  const profeMaterias = document.getElementById('profesorMateria');

  var datos_formGrupoProfeMate = {}

  mostrarGruposDisponibles('grupos');
  mostrarMateriasDisponibles('materia');

  $('#btn-asignarGrupoProfMate').on('click', function (e) {
    e.preventDefault();
    if (validarAsignar() === 0) {
      datos_formGrupoProfeMate = { id_grupos: grupos.value, id_materia: materia.value, id_profesor: profesor.value };
      agregarGrupoProfeMate(datos_formGrupoProfeMate);
    }

    const elements = ['#grupos', '#profesor', '#materia'];
    elements.forEach(selector => {
      $(selector).on('change', function () {
        this.classList.remove('is-invalid');
        this.classList.replace('border-danger', 'border-secondary');
      });
    });//Para limpiar los errores de mi select en agregar profesor guia
  });

  $('#grupos').on('change', function () {
    const grupoSelect = $("#grupos option:selected").text();
    tabla_grupoProfeMate.search(grupoSelect).draw();
    profesor_Guia.value = '';
    mostrarProfeGuia(grupos.value);
  });

  $('#materia').on('change', function () {
    const id_materia = $('#materia').val();
    $('#profesor').prop('disabled', false);
    mostrarProfesor(id_materia, 'profesor');
  });


  function agregarGrupoProfeMate(datos_formGrupoProfeMate) {
    axios.post('/api/asignar_gruposProfeMate', datos_formGrupoProfeMate)
      .then(response => {
        const result = response.data;
        if (result.success == true) {
          showToast('success', 'fa-solid fa-circle-check', 'La materia y el profesor se asignaron con exito!');
          limpiar_FormGrupoProfeMate();
          tabla_grupoProfeMate.ajax.reload(null, false);
        } else {
          showToast('danger', 'bi bi-exclamation-circle-fill', 'Ya ingresaste esta materia y profesor!');
        }
      })
      .catch(err => console.log('Error', err.message));
  }
  function eliminarAsignacion(data_grupoProfeMate) {
    const data = { id_grupo_profeMateria: data_grupoProfeMate.id_grupo_profeMateria };
    crearModal('eliminar-grupoProfeMate', 'btn-aceptar-eliminar-materia', '¿Deseas eliminar este materia y profesor?');
    $("#eliminar-grupoProfeMate").modal("show");
    $("#btn-aceptar-eliminar-materia").on("click", function () {
      axios.post('/api/eliminar_grupoProfeMate', data)
        .then(response => {
          const result = response.data;
          if (result.success == true) {
            showToast('success', 'fa-solid fa-circle-check', 'Se elimino la materia y el profesor con exito!');
            tabla_grupoProfeMate.ajax.reload(null, false);
          } else {
            showToast('danger', 'bi bi-exclamation-circle-fill', 'Error 500 server!');
          }
        })
        .catch(err => console.log('Error', err.message));
    });
  }

  var url = '/api/gruposProfeMate_recientes';
  var tabla_grupoProfeMate = new DataTable('#dt-grupoProfeMate', {
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
      { data: "Materia" },
      { data: "Profesor" },
      { defaultContent: `<button type="button" class="eliminar btn btn-danger"><i class="fa-solid fa-trash"></i></button>` }
    ],
    columnDefs: [
      {
        className: "text-center", targets: [0, 4]
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
      zeroRecords: "Ninguna materia encontrada",
      info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
      infoEmpty: "Ninguna materia asignada",
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

  $('#dt-grupoProfeMate tbody').on("click", "button.eliminar", function () {
    var data_grupoProfeMate = tabla_grupoProfeMate.row($(this).parents("tr")).data();
    eliminarAsignacion(data_grupoProfeMate);
  });
  //Funciones
  function validarAsignar() {
    // declaramos las variables
    const form_grupoGuia = [grupos, profesor, materia];
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

  function limpiar_FormGrupoProfeMate() {
    const elements = ['#profesor'];
    elements.forEach(selector => {
      $(selector).val('');
    });
    datos_formGrupoProfeMate = '';
    $('#profesor').prop('disabled', true);
    mostrarMateriasDisponibles('materia');
  };//Limpia los inputs

  function mostrarGruposDisponibles(id_select) {
    const grupoView = document.getElementById(id_select);
    axios.get('/api/mostrar_detalleGrupo')
      .then(response => {
        const grupo = response.data;
        grupoView.innerHTML = '<option selected disabled value="">Elegir...</option>';
        for (let i = 0; i < grupo.length; i++) {
          grupoView.innerHTML += `
                    <option value=${grupo[i].id_detallegrupo}>${grupo[i].Grupo}</option>`;
        };
      })
      .catch(err => console.log('Error', err.message));
  }//Mostramos que los grupos disponibles
  function mostrarProfesor(id_materia, id_select) {
    const profesorView = document.getElementById(id_select);
    axios.post('/api/mostrar_profeMateria', { id_materia: id_materia })
      .then(response => {
        const profesor = response.data;
        profesorView.innerHTML = '<option selected disabled value="">Elegir...</option>';
        for (let i = 0; i < profesor.length; i++) {
          profesorView.innerHTML += `
                <option value=${profesor[i].id_profesor_materia}>${profesor[i].Profesor}</option>`;
        };
      })
      .catch(err => console.log('Error', err.message));
  }//Mostramos los profesores
  function mostrarMateriasDisponibles(id_select) {
    const materiaView = document.getElementById(id_select);
    axios.get('/api/mostrar_materias')
      .then(response => {
        const materia = response.data;
        materiaView.innerHTML = '<option selected disabled value="">Elegir...</option>';
        for (let i = 0; i < materia.length; i++) {
          materiaView.innerHTML += `
                    <option value=${materia[i].id_materia}>${materia[i].nombre}</option>`;
        };
      })
      .catch(err => console.log('Error', err.message));
  }//Mostramos que las materias disponibles

  function mostrarProfeGuia(id_grupo){
    axios.post('/api/mostrar_profeGuia', { id_grupo: id_grupo })
      .then(response => {
        const profesor = response.data;
        profesor_Guia.value = profesor[0].Profesor;
        mostrarProfeGuiaMateria(profesor[0].id_usuario);
      })
      .catch(err => console.log('Error', err.message));
      profeMaterias.innerHTML = '';
  }
  function mostrarProfeGuiaMateria(id_usuario){
    axios.post('/api/mostrar_profeGuiaMateria', { id_usuario: id_usuario })
      .then(response => {
        const data = response.data;
        for (let i = 0; i < data.length; i++) {
          profeMaterias.innerHTML += `
                <option value="">${data[i].Materia}</option>`;
        };
      })
      .catch(err => console.log('Error', err.message));
  }
  

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


});