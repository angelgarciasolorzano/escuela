document.addEventListener('DOMContentLoaded', function () {
    //Desplegar menu de opciones//
    const btn_sidebar = document.getElementById('btn_sidebar');
    const main_show = document.querySelector('#container-inicio_admin');
    const sidebar = document.querySelector('#sidebar');
    const sidebarList = document.querySelector('#sidebarList');
    var icono = document.querySelectorAll('#sidebar ul li');
    const btn_submenuEstudiante = document.getElementById('btn_submenuEstudiante');
    const elementEstudiante = document.querySelector('#elementEstudiante');
    const btn_submenuGrupo = document.getElementById('btn_submenuGrupo');
    const elementGrupo = document.querySelector('#elementGrupo');
    const btn_submenuProfesor = document.getElementById('btn_submenuProfesor');
    const elementProfesor = document.querySelector('#elementProfesor');
    const btn_submenuAcademico = document.getElementById('btn_submenuAcademico');
    const elementAcademico = document.querySelector('#elementAcademico');

    if (btn_sidebar) {
        btn_sidebar.addEventListener('click', function() {
            if (sidebar.style.display === 'none' || sidebar.style.display === '') {
                sidebar.style.display = 'block';
                sidebar.style.position = 'fixed';
                sidebar.classList.add('showBarOpen');
                icono.forEach(i => {
                    i.classList.add('moveIconOpen');
                });
            } else {
                sidebar.style.display = 'none';
            }
        });
        btn_submenuEstudiante.addEventListener('click', function () {
            elementEstudiante.classList.toggle('submenuShow');
        });
        btn_submenuGrupo.addEventListener('click', function () {
            elementGrupo.classList.toggle('submenuShow');
        });
        btn_submenuProfesor.addEventListener('click', function () {
            elementProfesor.classList.toggle('submenuShow');
        });
        btn_submenuAcademico.addEventListener('click', function () {
            elementAcademico.classList.toggle('submenuShow');
        });
       sidebarList.addEventListener('mouseover', function(){
            sidebar.classList.add('showBarOpen');
            main_show.classList.add('moveMainOpen');
            icono.forEach(i => {
                i.classList.add('moveIconOpen');
            });
        });
        main_show.addEventListener('mouseover', function(){
            sidebar.classList.remove('showBarOpen');
            main_show.classList.remove('moveMainOpen');
            elementEstudiante.classList.remove('submenuShow');
            elementGrupo.classList.remove('submenuShow');
            elementProfesor.classList.remove('submenuShow');
            elementAcademico.classList.remove('submenuShow');
            icono.forEach(i => {
                i.classList.remove('moveIconOpen');
            });
        });
    }
});