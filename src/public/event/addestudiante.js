//Variables globales del evento progress bar y btns
const prevBtns = document.querySelectorAll(".btn-prev");
const nextBtns = document.querySelectorAll(".btn-next");
const progress = document.getElementById("progress");
const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");
let formStepsNum = 0;
//Variables globales para el formulario Tutor
const nombres_tutor = document.getElementById('nombres-tutor');
const apellidos_tutor = document.getElementById('apellidos-tutor');
const cedula_tutor = document.getElementById('cedula-tutor');
const correo_tutor = document.getElementById('correo-tutor');
const sexo_tutor = document.getElementById('sexo-tutor')
const telefono_tutor = document.getElementById('telefono-tutor');
const direccion_tutor = document.getElementById('direccion-tutor');
const form_tutor = document.getElementById('form-tutor');
var tutor = {}; //Inicializamos la variable global tutor
//Variables globales para el formulario Estudiante
const nombres_est = document.getElementById('nombres-est');
const apellidos_est = document.getElementById('apellidos-est');
const registroNac_est = document.getElementById('registroNac-est');
const fechaNac_est = document.getElementById('fecha-est');
const sexo_est = document.getElementById('sexo-est');
const modalidad_est = document.getElementById('modalidad-est');
const nivel_est = document.getElementById('nivel-est');
const form_estudiante = document.getElementById('form-estudiante');
var estudiante = {};

localStorage.clear();//Limpiar el localstorage
prevBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        formStepsNum--;
        updateFormSteps();
        updateProgressbar();
    });
});//Evento para regresar al otro fomulario
$('#btn_documento').on("click", function (e) {
    e.preventDefault();
    // declaramos las variables
    const doc_partida_nac = document.getElementById("doc-partida-nac");
    const doc_boletin = document.getElementById("doc-boletin");
    const doc_cedula = document.getElementById("doc-cedula");
    const form_doc = [doc_partida_nac, doc_boletin, doc_cedula];
    var aux = 0;

    //Validados que los campos esten correctos
    Array.from(form_doc).forEach(input => {
        if (!input.checkValidity()) {
            input.classList.add('is-invalid');
            aux++;
        } else {
            input.classList.remove('is-invalid');
        }
    });

    $("input[type='checkbox']").change(function () {
        if ($(this).is(':checked')) {
            this.classList.remove('is-invalid');
        }
    });

    if (aux == 0) {
        nextForm();
    }
});//Evento Validar los documentos obligatorios
$('#btn_tutor').on("click", function (e) {
    e.preventDefault();
    tutor = {
        nombres: nombres_tutor.value.trim(),
        apellidos: apellidos_tutor.value.trim(),
        cedula: cedula_tutor.value.trim(),
        correo_e: correo_tutor.value.trim(),
        sexo: sexo_tutor.value,
        telefono: telefono_tutor.value.trim(),
        direccion: direccion_tutor.value.trim()
    };//Body para mandarlo con el axios

    //Mandamos a evaluar con el express-validator
    axios.post('/api/verificar_tutor', tutor)
        .then(response => {
            const dataErrors = response.data;
            const validado = validarFormularios(dataErrors, form_tutor); // Validados que los campos sean correctos
            if (validado === true) {
                nextForm();
            }
        }).catch(err => console.log('Error', err.message));
    cleanErrors();
});//Evento validar el formulario del tutor
$("#btn-addestudiante").on("click", function (e) {
    e.preventDefault();
    estudiante = {
        nombres: nombres_est.value.trim(),
        apellidos: apellidos_est.value.trim(),
        registroNac: registroNac_est.value.trim(),
        fechaNac: fechaNac_est.value,
        sexo_text: sexo_est.options[sexo_est.selectedIndex].text.trim(),
        sexo_value: sexo_est.value.trim(),
        modalidad_text: modalidad_est.options[modalidad_est.selectedIndex].text.trim(),
        modalidad_value: modalidad_est.value.trim(),
        nivel_text: nivel_est.options[nivel_est.selectedIndex].text.trim(),
        nivel_value: nivel_est.value.trim()
    }; //Body para mandarlo con el axios

    //Mandamos a evaluar con el express-validator
    axios.post('/api/verificar_estudiante', estudiante)
        .then(response => {
            const dataErrors = response.data;
            const validado = validarFormularios(dataErrors, form_estudiante); //Validados que los campos sean correctos
            if (validado == true && matchRegistro() == false) {
                if (localStorage.getItem('ls-estudiantes') == null) {
                    let estudiantes = [];
                    estudiantes.push(estudiante);
                    localStorage.setItem('ls-estudiantes', JSON.stringify(estudiantes));
                } else {
                    let estudiantes = JSON.parse(localStorage.getItem('ls-estudiantes'));
                    estudiantes.push(estudiante);
                    localStorage.setItem('ls-estudiantes', JSON.stringify(estudiantes));
                }
                $('#nombres-est, #apellidos-est, #registroNac-est, #fecha-est, #sexo-est, #modalidad-est, #nivel-est').val(''); //limpiar los inputs mediante jquery
                $('#nivel-est').attr('disabled', 'disabled');//Vuelvo a deshabilitar el select de nivel estudiante
                getEstudiantes();
                registroNac_est.classList.remove('is-invalid');
                registroNac_est.classList.replace('border-danger', 'border-secondary');
            } else if (matchRegistro() == true){
                showError(`Error! Ya agregaste el #Registro de Nacimiento: ${registroNac_est.value.trim()}!`);
                registroNac_est.classList.add('is-invalid');
                registroNac_est.classList.replace('border-secondary', 'border-danger');
                form_estudiante.children[2].lastElementChild.innerHTML = '¡Ya ésta agregado!';
            }
        })
        .catch(err => console.log('Error', err.message));
    cleanErrors();
});//Evento validar y añadir card estudiante
$("#btn-modal-aceptar").on("click", function (e) {
    e.preventDefault();
    const estudiantes = JSON.parse(localStorage.getItem('ls-estudiantes'));
    const form = {
        tutor: tutor,
        estudiante: estudiantes
    };
    axios.post('/api/registrar', form)
        .then(response => {
            const result = response.data;
            if (result.success == true) {
                nextForm();
            } else { showError('Otra secretaria, ya realizo este registro!'); }
        })
        .catch(err => console.log('Error', err.message));
})//Evento del boton aceptar modal para permitir el ingreso de los datos de el tutor y estudiante
$('#modalidad-est').on('change', function () {
    const nivelView = document.getElementById('nivel-est');
    $('#nivel-est').removeAttr('disabled');
    axios.post('/api/mostrar_nivel', { id_modalidad: this.value })
        .then(response => {
            const nivel = response.data;
            nivelView.innerHTML = '<option selected disabled value="">Elegir...</option>';
            for (let i = 0; i < nivel.length; i++) {
                nivelView.innerHTML += `
                <option value=${nivel[i].id_nivel}>${nivel[i].nombre}</option>`; 
            }
        })
        .catch(err => console.log('Error', err.message));
});//Muestra los niveles o grados al momento de cambiar el select de modalidad-est
$("#btn_registrar").on("click", function (e) {
    e.preventDefault()
    const estudiantes = JSON.parse(localStorage.getItem('ls-estudiantes'));
    if (estudiantes != null && estudiantes.length > 0) {
        $("#modal-message").modal("show")
    } else {
        showError('Error! Debes agregar al ménos uno o más estudiantes!');//Mostramos el error si el arreglo de estudiantes esta vacio
    }
});//Evento para ingresar todos los formularios

//Espacio para declarar funciones
function nextForm() {
    formStepsNum++;
    updateFormSteps();
    updateProgressbar();
};//Habilita al siguiente formulario
function updateFormSteps() {
    formSteps.forEach((formStep) => {
        formStep.classList.contains("form-step-active") &&
            formStep.classList.remove("form-step-active");
    });
    formSteps[formStepsNum].classList.add("form-step-active");
};//Efecto css para los formStep
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
};//Efecto css para el progressBar
function getEstudiantes() {
    let estudiantes = JSON.parse(localStorage.getItem('ls-estudiantes'));
    let estudiantesView = document.getElementById('cargar-estudiantes');

    if (estudiantes != null && estudiantesView != null) {
        estudiantesView.innerHTML = '';
        for (let i = 0; i < estudiantes.length; i++) {
            estudiantesView.innerHTML +=
                `<div class="pt-3">
                    <div class="card w-100 border-secondary">
                         <div class="card-body">
                            <h5 class="card-title text-center">Estudiante ${i + 1}</h5>
                            <div class="w-100">
                                <p class="card-text">Nombres: ${estudiantes[i].nombres}.</p>
                            </div>
                            <div class="w-100">
                                <p class="card-text">Apellidos: ${estudiantes[i].apellidos}.</p>
                            </div>
                            <div class="w-100">
                                <p class="card-text">#Registro de Nacimiento: ${estudiantes[i].registroNac}.</p>
                            </div>
                            <div class="w-100">
                                <p class="card-text">Fecha de Nacimiento: ${estudiantes[i].fechaNac}.</p>
                            </div>
                            <div class="w-100">
                                <p class="card-text" value=${estudiantes[i].sexo_value}>
                                    Sexo: ${estudiantes[i].sexo_text}.</p>
                            </div>
                            <div class="w-100">
                                <p class="card-text" value=${estudiantes[i].modalidad_value}>
                                Modalidad: ${estudiantes[i].modalidad_text}.</p>
                            </div>
                            <div class="w-100">
                                <p class="card-text" value=${estudiantes[i].nivel_value}>
                                Grado/Nivel: ${estudiantes[i].nivel_text}.</p>
                            </div>
                            <div class="d-flex justify-content-center w-100 pt-2">
                                <a href="#" class="btn btn-warning w-100" 
                                    onclick="accionEstudiante('${estudiantes[i].registroNac}', 'modificar')">Modificar</a>
                                <a href="#" class="btn btn-danger w-100" 
                                    onclick="accionEstudiante('${estudiantes[i].registroNac}', 'eliminar')">Eliminar</a>
                            </div>
                        </div>
                    </div>
                </div>`;
        };
    };//Creamos las card de los estudiantes
};//Obtenemos los estudiantes, si es que existen lo ingresarlos a un div de clase card
function accionEstudiante(registroNac, accion) {
    let estudiantes = JSON.parse(localStorage.getItem('ls-estudiantes'));
    for (let i = 0; i < estudiantes.length; i++) {
        if (estudiantes[i].registroNac == registroNac && accion == 'eliminar') {
            estudiantes.splice(i, 1); //Eliminamos el estudiante
        } else if (estudiantes[i].registroNac == registroNac && accion == 'modificar') {
            nombres_est.value = estudiantes[i].nombres;
            apellidos_est.value = estudiantes[i].apellidos;
            registroNac_est.value = estudiantes[i].registroNac;
            fechaNac_est.value = estudiantes[i].fechaNac;
            sexo_est.value = estudiantes[i].sexo_value;
            modalidad_est.value = estudiantes[i].modalidad_value;
            nivel_est.value = estudiantes[i].nivel_value;//Mandamos a los inputs y select la informacion
            estudiantes.splice(i, 1);//Eliminamos el estudiante
        }
    };
    if(accion === 'modificar'){
        $('#nivel-est').removeAttr('disabled');
    }
    localStorage.setItem('ls-estudiantes', JSON.stringify(estudiantes));
    cleanAll_Errors(form_estudiante);
    getEstudiantes();
};//Funcion para eliminar o modificar estudiantes
function cleanErrors() {
    $("input[type='text']").on('input', function () {
        this.classList.remove('is-invalid');
        this.classList.replace('border-danger', 'border-secondary');
    });
    $("input[type='date']").on('input', function () {
        this.classList.remove('is-invalid');
        this.classList.replace('border-danger', 'border-secondary');
    });
    $('#sexo-est').on('change', function () {
        this.classList.remove('is-invalid');
        this.classList.replace('border-danger', 'border-secondary');
    });
    $('#sexo-tutor').on('change', function () {
        this.classList.remove('is-invalid');
        this.classList.replace('border-danger', 'border-secondary');
    });
    $('#modalidad-est').on('change', function () {
        this.classList.remove('is-invalid');
        this.classList.replace('border-danger', 'border-secondary');
    });
    $('#nivel-est').on('change', function () {
        this.classList.remove('is-invalid');
        this.classList.replace('border-danger', 'border-secondary');
    });
}//Funcion para eliminar los inputs y selects al momento de modificar
function cleanAll_Errors(form) {
    for (let i = 0; form.children.length > i; i++) {
        form.children[i].children[1].classList.remove('is-invalid');
        form.children[i].children[1].classList.replace('border-danger', 'border-secondary');
    }
}////Funcion para eliminar todos los inputs y selects
function matchRegistro() {
    let estudiantes = JSON.parse(localStorage.getItem('ls-estudiantes'));
    var aux = false;
    if (estudiantes != null) {
        for (let i = 0; i < estudiantes.length; i++) {
            if (estudiantes[i].registroNac == registroNac_est.value.trim()) {
                aux = true;
                break;
            }
        }
    }
    return aux;
}//Funcion para mostrar si existe coincidencia de los numeros de registros de nacimientos
function validarFormularios(dataErrors, form) {
    if (dataErrors.status === true) {
        for (let i = 0; form.children.length > i; i++) {
            for (let j = 0; dataErrors.errors.length > j; j++) {
                if (dataErrors.errors[j].path === form.children[i].children[1].getAttribute('name')) {
                    form.children[i].children[1].classList.add('is-invalid');
                    form.children[i].children[1].classList.replace('border-secondary', 'border-danger');
                    form.children[i].lastElementChild.innerHTML = dataErrors.errors[j].msg;
                }
            }
        }
        return false;
    } else {
        return true;
    }
};//Funcion para validar los formularios de tutor y estudiantes.
function showError(message) {
    const errorDiv = document.getElementById('mostrar-error');
    errorDiv.innerHTML = '';
    errorDiv.innerHTML = `
    <div class="alert alert-danger" role="alert" id="alert-estudiante">
        <div class="d-flex flex-row">
            <div class="error__icon pe-4">
                <i class="bi bi-exclamation-circle-fill"></i>
            </div>
            <div class="error__title">${message}</div>
        </div>
    </div>`;
    const alert = document.getElementById('alert-estudiante');
    setTimeout(() => {
        alert.remove();
    }, 4000);
};//Funcion para mostrar el error en el formulario estudiante
$(document).keypress(
    function (event) {
        if (event.which == '13') {
            event.preventDefault();
        }
    });//Para Evitar el submit del formulario con presionar Enter