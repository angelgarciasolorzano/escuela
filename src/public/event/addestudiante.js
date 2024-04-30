const prevBtns = document.querySelectorAll(".btn-prev");
const nextBtns = document.querySelectorAll(".btn-next");
const progress = document.getElementById("progress");
const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");

let formStepsNum = 0;
//Efecto del progressbar
// nextBtns.forEach((btn) => {
//     btn.addEventListener("click", () => {
//         formStepsNum++;
//         updateFormSteps();
//         updateProgressbar();
//     });
// });

prevBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        formStepsNum--;
        updateFormSteps();
        updateProgressbar();
    });
});//Evento para regresar al otro fomulario

function updateFormSteps() {
    formSteps.forEach((formStep) => {
        formStep.classList.contains("form-step-active") &&
            formStep.classList.remove("form-step-active");
    });

    formSteps[formStepsNum].classList.add("form-step-active");
}

function updateProgressbar() {
    progressSteps.forEach((progressStep, idx) => {
        if (idx < formStepsNum + 1) {
            progressStep.classList.add("progress-step-active");
        } else {
            progressStep.classList.remove("progress-step-active");
        }
    });

    const progressActive = document.querySelectorAll(".progress-step-active");

    progress.style.width =
        ((progressActive.length - 1) / (progressSteps.length - 1)) * 100 + "%";
}

$('#btn_documento').on("click", function (e) {
    e.preventDefault();
    // declaramos las variables
    const doc_partida_nac = document.getElementById("doc-partida-nac");
    const doc_boletin = document.getElementById("doc-boletin");
    const doc_cedula = document.getElementById("doc-cedula");
    const forms = [doc_partida_nac, doc_boletin, doc_cedula];
    var aux = 0;

    // Validados que los campos esten correctos
    Array.from(forms).forEach(input => {
        if (!input.checkValidity()) {
            input.classList.add('is-invalid');
            aux++;
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    $("input[type='checkbox']").change(function () {
        if ($(this).is(':checked')){
            this.classList.remove('is-invalid');
        }
    });

    if (aux == 0) {
        formStepsNum++;
        updateFormSteps();
        updateProgressbar();
    }
});//Validamos los documentos obligatorios

$('#btn_tutor').on("click", function (e) {
    e.preventDefault();
    const nombres_tutor = document.getElementById('nombres-tutor');
    const apellidos_tutor = document.getElementById('apellidos-tutor');
    const correo_tutor = document.getElementById('correo-tutor');
    const cedula_tutor = document.getElementById('cedula-tutor');
    const telefono_tutor = document.getElementById('telefono-tutor');
    const form = [nombres_tutor, apellidos_tutor, correo_tutor, cedula_tutor, cedula_tutor, telefono_tutor];

    const data = {nombres: nombres_tutor.value, apellidos: apellidos_tutor.value, 
        correo_e: correo_tutor.value, cedula: cedula_tutor.value, telefono: telefono_tutor.value};

    axios.post('/api/verificar_tutor', data)
        .then(response => console.log(response.data))
        .catch(err => console.log('Error', err.message));
    
    // Validados que los campos esten correctos
    Array.from(form).forEach(input => {
        if (!input.checkValidity()) {
            input.classList.add('is-invalid');
        }
    });
    
});//Validamos el formulario del tutor

$("#btn_ingresar").on("click", function (e) {
    e.preventDefault();
    formStepsNum++;
    updateFormSteps();
    updateProgressbar();
});//Ingresa todos los formularios

//Agregar Estudiantes
$("#btn-addestudiante").on("click", function (e) {
    let nombres_est = document.getElementById('nombres-est').value;
    let apellidos_est = document.getElementById('apellidos-est').value;

    const estudiante = {
        nombres_est, //nombres
        apellidos_est //apellidos
    };

    if (localStorage.getItem('ls-estudiantes') == null) {
        let estudiantes = [];
        estudiantes.push(estudiante);
        localStorage.setItem('ls-estudiantes', JSON.stringify(estudiantes));
    } else {
        let estudiantes = JSON.parse(localStorage.getItem('ls-estudiantes'));
        estudiantes.push(estudiante);
        localStorage.setItem('ls-estudiantes', JSON.stringify(estudiantes));
    }

    $('#nombres-est, #apellidos-est').val(''); //limpiar los inputs mediante jquery
    getEstudiantes();
    e.preventDefault();
});

function getEstudiantes() {
    let estudiantes = JSON.parse(localStorage.getItem('ls-estudiantes'));
    let estudiantesView = document.getElementById('cargar-estudiantes');

    if (estudiantes != null && estudiantesView != null) {
        estudiantesView.innerHTML = '';
        for (let i = 0; i < estudiantes.length; i++) {
            estudiantesView.innerHTML +=
                `<div class="d-flex pt-3">
                        <div class="card w-100">
                            <div class="card-body">
                                <h5 class="card-title text-center">Estudiante ${i + 1}</h5>
                                <p class="card-text">Nombres: ${estudiantes[i].nombres_est}</p>
                                <p class="card-text">Apellidos: ${estudiantes[i].apellidos_est}</p>
                            </div>
                            <div class="container">
                                <div class="d-flex">
                                    <a href="#" class="btn btn-warning w-100">Modificar</a>
                                    <a href="#" class="btn btn-danger w-100" 
                                    onclick="eliminarEstudiante('${estudiantes[i].nombres_est}')">Eliminar</a>
                                </div>
                            </div>
                        </div>
                    </div>`;
        };
    }
}
getEstudiantes();

function eliminarEstudiante(nombres) {
    let estudiantes = JSON.parse(localStorage.getItem('ls-estudiantes'));
    for (i = 0; i < estudiantes.length; i++) {
        if (estudiantes[i].nombres_est == nombres) {
            estudiantes.splice(i, 1);
        }
    };
    localStorage.setItem('ls-estudiantes', JSON.stringify(estudiantes));
    getEstudiantes();
}; //Funcion para eliminar estudiantes