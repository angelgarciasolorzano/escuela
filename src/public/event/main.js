document.addEventListener('DOMContentLoaded', function () {
    //Desplegar menu de opciones//
    const btn_sidebar = document.getElementById('btn_sidebar');
    const main_show = document.querySelector('#container-inicio_admin');
    const sidebar = document.querySelector('#sidebar');
    const sidebarList = document.querySelector('#sidebarList');
    var icono = document.querySelectorAll('#sidebar ul li');
    const btn_submenuEstudiante = document.getElementById('btn_submenuEstudiante');
    const submenuE = document.querySelector('#submenu');

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
            submenuE.classList.toggle('submenuShow');
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
            submenuE.classList.remove('submenuShow');
            icono.forEach(i => {
                i.classList.remove('moveIconOpen');
            });
        });
    }

    function showSidebar() {
        
    }

    // Comprobar el tamaño de la ventana al cambiar el tamaño
});