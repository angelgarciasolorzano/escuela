$(document).ready(function () {
    const name_estudiante = document.getElementById('name-estudiante');
    //const form = document.querySelector('form');
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

    // if (form && name_estudiante) {
    //     form.addEventListener('submit', (e) => {
    //         e.preventDefault();
    //         if (name_estudiante.value === '') {
    //             isValid = false;
    //             showError('Todos los campos son requeridos.');
    //         } else { form.submit(); }
    //     });
    // }; //Formulario matricula

    $('#btn-pagos').on('click', function(e){
        e.preventDefault();
    });

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
                mostrarPagos();
            }
        });
    }); //Cargar Tabla dentro del Modal

function mostrarPagos(){
    const mostrar_detalles = document.getElementById('mostrar-detalles');
    const mostrar_pagos = document.getElementById('mostrar-pagos');
    mostrar_detalles.innerHTML = '';
    mostrar_detalles.innerHTML = `<div class="container text-center" id="mostrar-detalles"> 
                                    <strong>Detalles</strong>
                                 </div>
                <div class="row g-3 py-2">
                    <div class="col-md-6">
                        <label for="inputState" class="form-label">Modo:</label>
                        <select class="form-select border-secondary" name="modo" id="modo">
                            <option selected disabled value="">Elegir...</option>
                            <option value="">Efectivo</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label for="inputState" class="form-label">Moneda:</label>
                        <select class="form-select border-secondary" name="moneda" id="moneda">
                            <option selected disabled value="">Elegir...</option>
                            <option value="">Córdobas</option>
                            <option value="">Dólares</option>
                        </select>
                    </div>
                </div>`;

    mostrar_pagos.innerHTML = '';
    mostrar_pagos.innerHTML = `<table class="table">
        <thead>
        <tr>
            <th scope="col">Concepto</th>
            <th scope="col" class="text-center">Precio</th>
        </tr>
        </thead>
        <tbody class="table-group-divider">
        <tr>
            <th>Matricula</th>
            <td class="text-end">2545.00</td>
        </tr>
        <tr>
            <th>Mensualidad: Enero</th>
            <td class="text-end">900.00</td>
        </tr>
        <tr>
            <th>Mensualidad: Febrero</th>
            <td class="text-end">900.00</td>
        </tr>
        </tbody>
    </table>
    <div class="d-flex flex-row-reverse bd-highlight">
        <strong class="p-2 bd-highlight">4345.00</strong>
        <strong class="p-2 bd-highlight">Total C$:</strong>
    </div>
    <div class="d-flex flex-row-reverse bd-highlight">
        <strong class="p-2 bd-highlight">118.64</strong>
        <strong class="p-2 bd-highlight">Total $:</strong>
    </div>`;
}
});//Se ejecuta al cargar la pagina