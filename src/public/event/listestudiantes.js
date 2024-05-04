//TODO CONFIGURANDO DATATABLE

$(document).ready(function() {
  var url = '/api/estudiante';

  $('#datatable_estudiante').DataTable({
    ajax: {
      url: url,
      dataSrc: ''
    },
    columns: [
      { data: "id_Estudiante" },
      { data: "nombre_Estudiante" },
      { data: "apellidos_Estudiante" },
      { 
        data: null, 
        defaultContent: '<i class="fa-solid fa-check"></i>'
      },
      { 
        data: null, 
        defaultContent: `<button type="button" class="btn btn-primary">Registro</button>
        <button type="button" class="ms-2 btn btn-warning">Editar</button>`
      }
    ],
    columnsDefs: [{
      targets: [3,4],
      orderable: false, targets: "_all",
      searchable: false, targets: [3, 4], 
      width: "10%", targets: [3, 4],
    }],
    destroy: true,
    fixedColumn: {
      start: 2
    },
    responsive: true,
    scrollX: '100%',
    scrollY: 300,
    lengthMenu: [5, 8, 10],
    pageLength: 8,
    language: {
      lengthMenu: "Mostrar _MENU_ registros por página",
      zeroRecords: "Estudiante No Encontrado",
      info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros ",
      infoEmpty: "Ningún Estudiante encontrado",
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
});