const anioslectivos = [];


$('#aniolectivo').on('change', function () {
    const anioSelect = $('#aniolectivo').val();
    const found = anioslectivos.find((element) => element === anioSelect);
    if (found != anioSelect) {
        anioslectivos.push(anioSelect);
        anioslectivos.sort((a, b) => a - b);
        console.log(anioslectivos);
        getAnios(anioslectivos);
    }
});//Imprime el reporte con los gráficos


$('#btn-generar-reporte').on('click', function () {
    if (anioslectivos.length > 0) {
        $("#btn-generar-reporte").addClass('d-none');
        $("#btn-loading").removeClass('d-none');
        imprimirReporteMatricula(anioslectivos);
    } else {
        showToast('danger', 'bi bi-exclamation-circle-fill', 'No ha ingresado los años lectivos!');
    }
});//Imprime el reporte con los gráficos


function getAnios(anioslectivos) {
    let aniolectivoView = document.getElementById('cargar-anios');

    if (anioslectivos != null && aniolectivoView != null) {
        aniolectivoView.innerHTML = '';
        for (let i = 0; i < anioslectivos.length; i++) {
            aniolectivoView.innerHTML += `
            <li class="badge rounded-pill text-bg-info mx-1"style="list-style: none; font-size: 0.9rem;" id="${anioslectivos[i]}">
             <div class="m-2">
                 <a class="link-dark" href="#" style="text-decoration: none;"
                 onclick="eliminarAnio(${anioslectivos[i]})">${anioslectivos[i]}
                     <i class="fa-solid fa-xmark"></i>
                 </a>
             </div>
        </li>`;
        }
    }
}// Crea los pill con la informacion de años lectivos

function eliminarAnio(anioEliminar) {
    for (let i = 0; i < anioslectivos.length; i++) {
        if (anioslectivos[i] == anioEliminar) {
            anioslectivos.splice(i, 1);
        }
    }
    anioslectivos.sort((a, b) => a - b);
    getAnios(anioslectivos);
}//Funcion para eliminar el año lectivo seleccionado 

function imprimirReporteMatricula(anioslectivos) {
    axios.get('/api/reporte_matricula', {
        params: { aniolectivo: anioslectivos },
        responseType: "blob",
        headers: {
            "Content-Type": "application/pdf"
        }
    }).then((response) => {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'reporte2024.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        $("#btn-loading").addClass('d-none');
        $("#btn-generar-reporte").removeClass('d-none');
    })
        .catch(err => console.log('Error', err.message));
}//Funcion para imprimir la matricula

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

$(document).keypress(
    function (event) {
        if (event.which == '13') {
            event.preventDefault();
        }
    });//Para Evitar el submit del formulario con presionar Enter