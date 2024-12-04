document.addEventListener('DOMContentLoaded', function () {
  // Selección de elementos
  const btn_sidebar = document.getElementById('btn_sidebar');
  const main_show = document.querySelector('#container-inicio_usuario');
  const sidebar = document.querySelector('#sidebar');
  const sidebarList = document.querySelector('#sidebarList');
  const icono = document.querySelectorAll('#sidebar ul li');
  // Detectar si el dispositivo es móvil (sin mouse)
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  const navbarToggler = document.getElementById('navbarToggler');
  const navbar = document.getElementById('navbarNavDropdown');

  if (btn_sidebar) {
    // Submenús y botones
    const submenus = [
      { btn: document.getElementById('btn_submenuEstudiante'), element: document.querySelector('#elementEstudiante') },
      { btn: document.getElementById('btn_submenuGrupo'), element: document.querySelector('#elementGrupo') },
      { btn: document.getElementById('btn_submenuProfesor'), element: document.querySelector('#elementProfesor') },
      { btn: document.getElementById('btn_submenuAcademico'), element: document.querySelector('#elementAcademico') },
      { btn: document.getElementById('btn_submenuServicios'), element: document.querySelector('#elementServicios') }
    ];

    // Función para manejar la apertura/cierre del sidebar
    const toggleSidebar = () => {
      if (sidebar.style.display === 'none' || sidebar.style.display === '') {
        sidebar.style.display = 'block';
        sidebar.style.position = 'fixed';
        sidebar.classList.add('showBarOpen');
        icono.forEach(i => i.classList.add('moveIconOpen'));
        // Remover la clase 'show' si está presente en el navbar
        if (navbar.classList.contains('show')) {
          navbar.classList.remove('show');
        }
      } else {
        sidebar.style.display = 'none';
      }

    };

    // Añadir el evento de clic al botón del sidebar
    if (btn_sidebar) {
      btn_sidebar.addEventListener('click', toggleSidebar);
    }

    // Manejo de los submenús
    submenus.forEach(({ btn, element }) => {
      if (btn) {
        btn.addEventListener('click', () => {
          element.classList.toggle('submenuShow');
        });
      }
    });

    navbarToggler.addEventListener('click', () => {
      // Remover la clase 'show' si está presente en el navbar
      if (!navbar.classList.contains('show')) {
        sidebar.style.display = 'none';
      }
    });

    // Evento de hover para mostrar el sidebar (solo si no es dispositivo táctil)
    if (!isTouchDevice) {
      sidebarList.addEventListener('mouseover', () => {
        sidebar.classList.add('showBarOpen');
        main_show.classList.add('moveMainOpen');
        icono.forEach(i => i.classList.add('moveIconOpen'));
      });

      // Evento de hover para ocultar el sidebar
      main_show.addEventListener('mouseover', () => {
        sidebar.classList.remove('showBarOpen');
        main_show.classList.remove('moveMainOpen');
        submenus.forEach(({ element }) => element.classList.remove('submenuShow'));
        icono.forEach(i => i.classList.remove('moveIconOpen'));
      });
    }
  }
});