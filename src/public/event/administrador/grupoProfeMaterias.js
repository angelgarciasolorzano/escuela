document.addEventListener('DOMContentLoaded', (event) => {
  //Variables para asignar profesor al grupo
  const grupos = document.getElementById('grupos');
  const profesor = document.getElementById('profesor');
  const materia = document.getElementById('materia');
  const profesor_Guia = document.getElementById('profesor-guia');
  var datos_formGrupoProfeMate = {}

  //Variables para asignar profesor guia
  const grupos_guia = document.getElementById('grupos_guia');
  const profesor_guia = document.getElementById('profesor_guia');
  var datos_formGrupoGuia = {};

  //Eventos click de asignar materia y profesor
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
  $('#grupos').on('click', function (e) {
    if (!$(e.target).hasClass('grupo-item')) {
      mostrarGruposDisponibles('grupos');
    }
  });
  $('#grupos').on('click', '.grupo-item', function (e) {
    e.preventDefault();
    const grupoSelect = $(this).text();
    tabla_grupoProfeMate.search(grupoSelect).draw();
  });
  $('#materia').on('click', function (e) {
    if (!$(e.target).hasClass('materia-item')) {
      mostrarMateriasDisponibles('materia');
    }
  });
  $('#materia').on('click', '.materia-item', function (e) {
    e.preventDefault();
    const id_materia = $('#materia').val();
    $('#profesor').prop('disabled', false);
    mostrarProfesor(id_materia, 'profesor');
  });

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
      { data: "Profesor" },
      { data: "Materia" },
      { defaultContent: `<button type="button" class="eliminar btn btn-danger"><i class="fa-solid fa-xmark"></i></button>` }
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
    pageLength: 8,
    language: {
      lengthMenu: "Mostrar _MENU_ registros por página",
      emptyTable: "No hay grupos ingresados...",
      zeroRecords: "Aún no se ha asignado!",
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
  });//Datatable para asignar profesor al grupo

  $('#dt-grupoProfeMate tbody').on("click", "button.eliminar", function () {
    var data_grupoProfeMate = tabla_grupoProfeMate.row($(this).parents("tr")).data();
    eliminarAsignacion(data_grupoProfeMate);
  });


  //Funcionalidad para asignar profesor guia
  $('#grupos_guia').on('click', function (e){
    if (!$(e.target).hasClass('grupos_guia-item')) {
      gruposDisponibles('grupos_guia');
    }
  });
  $('#grupos_guia').on('click', '.grupos_guia-item', function (e) {
    e.preventDefault();
    const grupoSelect = $(this).val();
    profesoresDisponibles(grupoSelect, 'profesor_guia');
    profesor_Guia.value = '';
    mostrarProfeGuia(grupoSelect);
  });

  $('#btn-asignarGrupo').on('click', function (e) {
    e.preventDefault();
    if (validarProfesorGuia() === 0) {
      datos_formGrupoGuia = { id_grupos: grupos_guia.value, id_profesores: profesor_guia.value };
      agregarGrupoGuia(datos_formGrupoGuia);
    }

    const elements = ['#grupos_guia', '#profesor_guia'];
    elements.forEach(selector => {
      $(selector).on('change', function () {
        this.classList.remove('is-invalid');
        this.classList.replace('border-danger', 'border-secondary');
      });
    });//Para limpiar los errores de mi select en agregar profesor guia
  });


  var url2 = '/api/gruposGuia_recientes';
  var tabla_grupoGuia = new DataTable('#dt-grupoGuia', {
    processing: true,
    serverSide: true,
    deferRender: true,
    ajax: {
      url: url2,
      type: 'GET'
    },
    aaSorting: [],
    columns: [
      { data: "id_detallegrupo" },
      { data: "Grupo" },
      { data: "Profesor" },
      { defaultContent: `<button type="button" class="eliminar btn btn-danger"><i class="fa-solid fa-xmark"></i></button>` }
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
      zeroRecords: "Sín grupo asignado",
      info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
      infoEmpty: "Sín grupo asignado",
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
  });//Datatable para asignar profesor guia

  $('#dt-grupoGuia tbody').on("click", "button.eliminar", function () {
    var data_grupoGuia = tabla_grupoGuia.row($(this).parents("tr")).data();
    eliminarAsignacionGuia(data_grupoGuia);
  });
  

  //Funciones asignar profesor
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
  function agregarGrupoProfeMate(datos_formGrupoProfeMate) {
    axios.post('/api/asignar_gruposProfeMate', datos_formGrupoProfeMate)
      .then(response => {
        const result = response.data;
        if (result.success == true) {
          showToast('success', 'fa-solid fa-circle-check', result.msg);
          limpiar_FormGrupoProfeMate();
          tabla_grupoProfeMate.ajax.reload(null, false);
        } else {
          showToast('danger', 'bi bi-exclamation-circle-fill', result.msg);
        }
      })
      .catch(err => console.log('Error', err.message));
  }
  function eliminarAsignacion(data_grupoProfeMate) {
    const data = { id_grupo_profeMateria: data_grupoProfeMate.id_grupo_profeMateria , 
      id_detallegrupo: data_grupoProfeMate.id_detallegrupo, id_profesor: data_grupoProfeMate.id_profesor };
    crearModal('eliminar-grupoProfeMate', 'btn-aceptar-eliminar-materia', '¿Deseas quitar este materia y profesor?');
    $("#eliminar-grupoProfeMate").modal("show");
    $("#btn-aceptar-eliminar-materia").on("click", function () {
      axios.post('/api/eliminar_grupoProfeMate', data)
        .then(response => {
          const result = response.data;
          if (result.success == true) {
            showToast('success', 'fa-solid fa-circle-check', result.msg);
            tabla_grupoProfeMate.ajax.reload(null, false);
            tabla_grupoGuia.ajax.url(url2).load();
            grupos_guia.value = '';
            profesor_guia.value = '';
            profesor_Guia.value = '';
          } else {
            showToast('danger', 'bi bi-exclamation-circle-fill', result.msg);
          }
        })
        .catch(err => console.log('Error', err.message));
    });
  }
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
                    <option class="grupo-item" value=${grupo[i].id_detallegrupo}>${grupo[i].Grupo}</option>`;
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
                    <option class="materia-item" value=${materia[i].id_materia}>${materia[i].nombre}</option>`;
        };
      })
      .catch(err => console.log('Error', err.message));
  }//Mostramos que las materias disponibles
  function mostrarProfeGuia(id_grupo) {
    axios.post('/api/mostrar_profeGuia', { id_grupo: id_grupo })
      .then(response => {
        const profesor = response.data;
        profesor_Guia.value = '';
        if(profesor[0]){
          profesor_Guia.value = profesor[0].Profesor;
        }
      })
      .catch(err => console.log('Error', err.message));
  }

  //Funciones para asignar profesor guia
  function validarProfesorGuia() {
    // declaramos las variables
    const form_grupoGuia = [grupos_guia, profesor_guia];
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
    const elements = ['#grupos_guia', '#profesor_guia'];
    elements.forEach(selector => {
      $(selector).val('');
    });
    datos_formGrupoGuia = '';
    grupos.value = '';
    profesor_Guia.value = '';
  };//Limpia los inputs
  function agregarGrupoGuia(datos_formGrupoGuia) {
    crearModal('asignar-grupoGuia', 'btn-aceptar-asignar-grupoGuia', '¿Deseas asignar este profesor como guía?');
    $("#asignar-grupoGuia").modal("show");
    $("#btn-aceptar-asignar-grupoGuia").on("click", function () { 
      axios.post('/api/asignar_gruposGuia', datos_formGrupoGuia)
      .then(response => {
        const result = response.data;
        if (result.success == true) {
          showToast('success', 'fa-solid fa-circle-check', result.msg);
          limpiar_FormGrupoGuia();
          tabla_grupoGuia.ajax.url(url2).load();
        } else {
          showToast('danger', 'bi bi-exclamation-circle-fill', result.msg);
        }
      })
      .catch(err => console.log('Error', err.message));
    });
  }
  function eliminarAsignacionGuia(data_grupoGuia) {
    const data = { id_detallegrupo: data_grupoGuia.id_detallegrupo };
    crearModal('eliminar-grupoGuia', 'btn-aceptar-eliminar-grupo', '¿Deseas quitar este profesor guia?');
    $("#eliminar-grupoGuia").modal("show");
    $("#btn-aceptar-eliminar-grupo").on("click", function () {
      axios.post('/api/eliminar_gruposGuia', data)
        .then(response => {
          const result = response.data;
          if (result.success == true) {
            showToast('success', 'fa-solid fa-circle-check', result.msg);
            limpiar_FormGrupoGuia();
            tabla_grupoGuia.ajax.url(url2).load();
          } else {
            showToast('danger', 'bi bi-exclamation-circle-fill', result.msg);
          }
        })
        .catch(err => console.log('Error', err.message));
    });
  }
  function gruposDisponibles(id_select) {
    const grupoView = document.getElementById(id_select);
    axios.get('/api/mostrar_detalleGrupo')
      .then(response => {
        const grupo = response.data;
        grupoView.innerHTML = '<option selected disabled value="">Elegir...</option>';
        for (let i = 0; i < grupo.length; i++) {
          grupoView.innerHTML += `
                <option class="grupos_guia-item" value=${grupo[i].id_detallegrupo}>${grupo[i].Grupo}</option>`;
        };
      })
      .catch(err => console.log('Error', err.message));
  }//Mostramos que los grupos disponibles sin asignar
  function profesoresDisponibles(id_grupo, id_select) {
    const profesorView = document.getElementById(id_select);
    axios.post('/api/mostrar_profesorGuia', { id_detallegrupo: id_grupo })
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


  //Componentes
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