$(document).ready(function () {
    const name_estudiante = document.getElementById('name-estudiante');
    const direccion = document.getElementById('direccion');
    const name_tutor = document.getElementById('name-tutor');
    const modalidad = document.getElementById('modalidad');
    const nivel_grado = document.getElementById('nivel-grado');
    const grupo = document.getElementById('grupo');
    const form = document.getElementById('form-matricula');
    const name_secretaria = document.getElementById('name-secretaria');
    let select_row = '';
    var matricula = {};

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
                { data: "apellidos" },
                { data: "estado" },
                { data: "tutor" },
                { data: "cedula" }
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
                direccion.value = select_row.direccion;
                name_tutor.value = select_row.tutor;
                modalidad.value = select_row.modalidad;
                nivel_grado.value = select_row.nivel_grado;
                $('#grupo').removeAttr('disabled');
                mostrarGrupos(select_row.id_nivel_grado);
                //mostrarPagos();
            }
        });
    }); //Cargar Tabla dentro del Modal

    // function mostrarPagos(){
    //     const mostrar_detalles = document.getElementById('mostrar-detalles');
    //     const mostrar_pagos = document.getElementById('mostrar-pagos');
    //     mostrar_detalles.innerHTML = '';
    //     mostrar_detalles.innerHTML = `<div class="container text-center" id="mostrar-detalles"> 
    //                                     <strong>Detalles</strong>
    //                                  </div>
    //                 <div class="row g-3 py-2">
    //                     <div class="col-md-6">
    //                         <label for="inputState" class="form-label">Modo:</label>
    //                         <select class="form-select border-secondary" name="modo" id="modo">
    //                             <option selected disabled value="">Elegir...</option>
    //                             <option value="">Efectivo</option>
    //                         </select>
    //                     </div>
    //                     <div class="col-md-6">
    //                         <label for="inputState" class="form-label">Moneda:</label>
    //                         <select class="form-select border-secondary" name="moneda" id="moneda">
    //                             <option selected disabled value="">Elegir...</option>
    //                             <option value="">Córdobas</option>
    //                             <option value="">Dólares</option>
    //                         </select>
    //                     </div>
    //                 </div>`;

    //     mostrar_pagos.innerHTML = '';
    //     mostrar_pagos.innerHTML = `<table class="table">
    //         <thead>
    //         <tr>
    //             <th scope="col">Concepto</th>
    //             <th scope="col" class="text-center">Precio</th>
    //         </tr>
    //         </thead>
    //         <tbody class="table-group-divider">
    //         <tr>
    //             <th>Matricula</th>
    //             <td class="text-end">2545.00</td>
    //         </tr>
    //         <tr>
    //             <th>Mensualidad: Enero</th>
    //             <td class="text-end">900.00</td>
    //         </tr>
    //         <tr>
    //             <th>Mensualidad: Febrero</th>
    //             <td class="text-end">900.00</td>
    //         </tr>
    //         </tbody>
    //     </table>
    //     <div class="d-flex flex-row-reverse bd-highlight">
    //         <strong class="p-2 bd-highlight">4345.00</strong>
    //         <strong class="p-2 bd-highlight">Total C$:</strong>
    //     </div>
    //     <div class="d-flex flex-row-reverse bd-highlight">
    //         <strong class="p-2 bd-highlight">118.64</strong>
    //         <strong class="p-2 bd-highlight">Total $:</strong>
    //     </div>`;
    // }

    $('#btn-matricula').on('click', function (e) {
        e.preventDefault();
        if (name_estudiante.value === '') {
            showMessage('Debe seleccionar un estudiante para llenar los campos!', 'error');
        } else if (grupo.value === '') {
            form.children[7].children[1].classList.add('is-invalid');
            form.children[7].children[1].classList.replace('border-secondary', 'border-danger');
            form.children[7].lastElementChild.innerHTML = 'Falta seleccionar!';
        } else {
            $("#modal-message").modal("show")
        }
        $('#grupo').on('change', function () {
            this.classList.remove('is-invalid');
            this.classList.replace('border-danger', 'border-secondary');
        });
    });

    $("#btn-aceptar-matricula").on("click", function (e) {
        e.preventDefault();
        matricula = {
            id_estudiante: select_row.id_estudiante,
            grupo: parseInt(grupo.value),
            name_secretaria: name_secretaria.value
        }
        evaluarMatricula(matricula);
        
    })//Evento del boton aceptar modal para permitir el ingreso de la matricula del estudiante

    function mostrarGrupos(id_nivel_grado) {
        const grupoView = document.getElementById('grupo');
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
    }

    function showMessage(message, type) {
        const messageDiv = document.getElementById('mostrar-error');
        messageDiv.innerHTML = '';
        if (type === 'error') {
            messageDiv.innerHTML = `
    <div class="alert alert-danger" role="alert" id="alert-estudiante">
        <div class="d-flex flex-row">
            <div class="error__icon pe-4">
                <i class="bi bi-exclamation-circle-fill"></i>
            </div>
            <div class="error__title">${message}</div>
        </div>
    </div>`;
        } else if (type === 'success') {
            messageDiv.innerHTML = `
    <div class="alert alert-success" role="alert" id="alert-estudiante">
        <div class="d-flex flex-row">
            <div class="error__icon pe-4">
            <i class="fa-solid fa-circle-check"></i>
            </div>
            <div class="error__title">${message}</div>
        </div>
    </div>`;
        }
        const alert = document.getElementById('alert-estudiante');
        setTimeout(() => {
            alert.remove();
        }, 4000);
    };//Funcion para mostrar el error en el formulario estudiante

    function evaluarMatricula(matricula) {
        axios.post('/api/agregar_matricula', matricula)
            .then(response => {
                const result = response.data;
                if (result.success == true) {
                    showMessage('La matricula se realizo con exito!', 'success');
                    limpiar();
                } else {
                    showMessage('Este estudiante ya esta matriculado!', 'error');
                    $('#grupo').attr('disabled', 'disabled');
                }
            })
            .catch(err => console.log('Error', err.message));
    }

    function limpiar() {
        $("input[type='text']").val('');
        $('#grupo').attr('disabled', 'disabled');
        $('#grupo').val('');
        select_row = '';
    }

});