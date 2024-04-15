//TODO Configurando DataTables

$(document).ready(function() {
  var url = 'http://localhost:4000/api/estudiante';

  $('#datatable_estudiante').DataTable({
    ajax: {
      url: url,
      dataSrc: ''
    },
    columns: [
      { data: "id_Estudiante" },
      { data: "nombre" },
      { data: "apellidos" },
      { 
        data: null, 
        defaultContent: '<i class="fa-solid fa-check"></i>'
      },
      { 
        data: null, 
        defaultContent: '<button type="button" class="btn btn-success">Agregar</button>'
      }
    ],
    columnsDefs: [{
      className: "centered", targets: [3,4],
      orderable: false, targets: "_all",
      searchable: false, targets: [3, 4], 
      width: "10%", targets: [3, 4],
    }],
    lengthMenu: [5, 8, 10, 15],
    pageLength: 8,
    language: {
      lengthMenu: "Mostrar _MENU_ registros por página",
      zeroRecords: "Ningún usuario encontrado",
      info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
      infoEmpty: "Ningún usuario encontrado",
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