$(document).ready(function () {
    const name_estudiante = document.getElementById('name-estudiante');
    const form = document.querySelector('form');
    const mensaje = document.querySelector('.contenedor-alerta');
    let select_row = '';

    function showError(message) {
        const mensajeAnterior = document.querySelector('.mensaje');
        if (mensajeAnterior) {
            mensajeAnterior.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'mensaje';
        errorDiv.innerHTML = `
    <div class="container p-2">
      <div class="row">
        <div class="col-md-5 mx-auto">
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Advertencia!</strong> ${message}.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        </di>
      </div>
    </div>`;
        mensaje.parentNode.insertBefore(errorDiv, mensaje);
    }; //Mensaje de error

    if (form && name_estudiante) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (name_estudiante.value === '') {
                isValid = false;
                showError('Todos los campos son requeridos.');
            } else { form.submit(); }
        });
    }; //Formulario matricula

    $('#exampleModal').on('show.bs.modal', function () {
        var url = '/api/estudiante_disponible';
        var table = $('#datatable_estudiante').DataTable({
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
                { data: "nombres" },
                { data: "apellidos" }
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
                style: 'os',
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
        if (table) {
            $('#datatable_estudiante').on("click", "td:not(:first-child)", function () {
                select_row = table.row(this).data();
                if (typeof select_row != 'undefined')
                    console.log(select_row);
            })
        }; //Seleccionar la fila
        $('#btn-aceptar').on('click', function () {
            if (typeof select_row != 'undefined') {
                name_estudiante.value = select_row.nombres + ' ' + select_row.apellidos;
                table.destroy();
            }
        });
    }); //Cargar Tabla dentro del Modal

});//Se ejecuta al cargar la pagina