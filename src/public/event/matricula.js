$(document).ready(function(){
const estudiante = document.getElementById('name-estudiante');
const form = document.querySelector('form');
const mensaje = document.querySelector('.contenedor-alerta');

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

if (form && estudiante) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (estudiante.value === '') {
            isValid = false;
            showError('Todos los campos son requeridos.');
        } else { form.submit(); }
    });
}; //Formulario matricula

$('#exampleModal').on('show.bs.modal', function () {
    var url = 'http://localhost:4000/api/estudiante';
    var table = $('#datatable_estudiante').DataTable({
        ajax: {
            url: url,
            dataSrc: "",
        },
        columns: [
            { data: "id_Estudiante" },
            { data: "nombre" },
            { data: "apellidos" },
            {
                data: null,
                orderable: false,
                targets: 0,
            }
        ],
        columnDefs: [
            {
                className: "text-center", targets: [0, 3],
            }
        ],
        destroy: true,
        select: true,
        fixedColumns: {
            start: 2
        },
        select: {
            style: 'single',
            item: 'row'
        },
        responsive: true,
        scrollX: '100%',
        scrollY: 300,
        lengthMenu: [5, 10, 15, 20],
        pageLength: 5,
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
    })
    if (table) {
        var select_row = "";
        $('#datatable_estudiante').on("click", "tr", function () {
            select_row = table.row(this).data();
        })
    }; //Seleccionar la fila
    $('#btn-aceptar').on('click', function () {
        if (select_row != "") {
            const options = {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(select_row)
            };
            fetch('/api/matricula', options).then(res => res.json());
        }
        table.destroy();
    });
}); //Cargar Tabla dentro del Modal

});//Se ejecuta al cargar la pagina