const anioslectivos = [];

const filtro_reporte = document.getElementById('filtro_reporte');
const aniolectivo = document.getElementById('aniolectivo');
const aniolectivo_inicial = document.getElementById('aniolectivo_inicial');
const aniolectivo_final = document.getElementById('aniolectivo_final');
var aux = 0;

$("#optionEspecifico").change(function () {
  if ($(this).is(':checked')) {
    $("#formEspecificoAnio").removeClass('d-none');
    $("#formRangoAnio").addClass('d-none');
    aniolectivo_inicial.value = '';
    aniolectivo_final.value = '';
    aux = 0;
  }
});// Habilitar y Deshabilitar los forms de opcion especifico
$("#optionRango").change(function () {
  if ($(this).is(':checked')) {
    $("#formEspecificoAnio").addClass('d-none');
    $("#formRangoAnio").removeClass('d-none');
    aniolectivo.value = '';
    aux = 1;
  }
});// Habilitar y Deshabilitar los forms de opcion rangos


$('#btn-generar-reporte').on('click', function () {
  if ((filtro_reporte.value != '' && aniolectivo.value != '') || (filtro_reporte.value != '' && aniolectivo_inicial.value != '' && aniolectivo_final.value != '')) {
    if (aux == 0) {
      reporteMatriculaEspecifico(aniolectivo.value, filtro_reporte.value);
    } else {
      reporteMatriculaRangos(aniolectivo_inicial.value, aniolectivo_final.value, filtro_reporte.value);
    }
  } else {
    showToast('danger', 'bi bi-exclamation-circle-fill', 'Debe llenar todos los campos!');
  }
});//Imprime el reporte con los gráficos

$('#aniolectivo').on('focus', function (e) {
  e.preventDefault()
  mostrarAnioLectivo('#aniolectivo');
});//Muestra los años lectivos para la opcion especifico
$('#aniolectivo_inicial').on('focus', function (e) {
  e.preventDefault()
  mostrarAnioLectivo('#aniolectivo_inicial');
});//Muestra los años lectivos para el rango inicial
$('#aniolectivo_final').on('focus', function (e) {
  e.preventDefault()
  mostrarAnioLectivo('#aniolectivo_final');
});//Muestra los años lectivos para el rango final

// function getAnios(anioslectivos) {
//     let aniolectivoView = document.getElementById('cargar-anios');

//     if (anioslectivos != null && aniolectivoView != null) {
//         aniolectivoView.innerHTML = '';
//         for (let i = 0; i < anioslectivos.length; i++) {
//             aniolectivoView.innerHTML += `
//             <li class="badge rounded-pill text-bg-info mx-1"style="list-style: none; font-size: 0.9rem;" id="${anioslectivos[i]}">
//              <div class="mx-2">
//                  <a class="link-dark" href="#" style="text-decoration: none;"
//                  onclick="eliminarAnio(${anioslectivos[i]})">${anioslectivos[i]}
//                      <i class="fa-solid fa-xmark"></i>
//                  </a>
//              </div>
//         </li>`;
//         }
//     }
// }// Crea los pill con la informacion de años lectivos
// function eliminarAnio(anioEliminar) {
//     for (let i = 0; i < anioslectivos.length; i++) {
//         if (anioslectivos[i] == anioEliminar) {
//             anioslectivos.splice(i, 1);
//         }
//     }
//     anioslectivos.sort((a, b) => a - b);
//     getAnios(anioslectivos);
// }//Funcion para eliminar el año lectivo seleccionado 

function imprimirReporteMatricula(anioslectivos, filtro_reporte) {
  axios.get('/api/reporte_matricula', {
    params: { aniolectivo: anioslectivos, atributos: filtro_reporte },
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

function mostrarAnioLectivo(id_select) {
  const anioLectivoView = $(id_select);  // Seleccionamos el select 'anioLectivo'
  // Aseguramos que el select esté vacío antes de agregar nuevas opciones
  anioLectivoView.empty();
  axios.get('/api/mostrar_anioLectivo')
    .then(response => {
      const anioLectivo = response.data;

      // Aseguramos que el select esté vacío antes de agregar nuevas opciones
      anioLectivoView.empty();

      // Agregamos la opción predeterminada
      anioLectivoView.append('<option selected disabled value="">Elegir...</option>');

      // Poblar el select con las nuevas opciones
      anioLectivo.forEach(m => {
        anioLectivoView.append(`
              <option value="${m.anio}">${m.anio}</option>
            `);
      });
    })
    .catch(err => {
      console.error('Error al cargar los anios lectivos:', err.message);
      anioLectivoView.empty();
      anioLectivoView.append('<option selected disabled value="">Error al cargar</option>');
    });
}//Funcion para mostrar los años lectivos al hacer click
function reporteMatriculaEspecifico(aniolectivo, filtro_reporte) {
  anioslectivos.length = 0;
  anioslectivos.push(aniolectivo);
  $("#btn-generar-reporte").addClass('d-none');
  $("#btn-loading").removeClass('d-none');
  imprimirReporteMatricula(anioslectivos, filtro_reporte);
}
function reporteMatriculaRangos(aniolectivo_inicial, aniolectivo_final, filtro_reporte) {
  anioslectivos.length = 0;
  if (aniolectivo_inicial < aniolectivo_final) {
    for (let i = aniolectivo_inicial; i <= aniolectivo_final; i++) {
      anioslectivos.push(i);
    }
    $("#btn-generar-reporte").addClass('d-none');
    $("#btn-loading").removeClass('d-none');
    imprimirReporteMatricula(anioslectivos, filtro_reporte);
  } else {
    showToast('danger', 'bi bi-exclamation-circle-fill', 'Error en el rango de los años!');
  }

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

$(document).keypress(
  function (event) {
    if (event.which == '13') {
      event.preventDefault();
    }
  });//Para Evitar el submit del formulario con presionar Enter