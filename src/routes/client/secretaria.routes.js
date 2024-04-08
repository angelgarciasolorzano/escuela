import express from "express";
import { isLoggedIn } from "../../lib/middleware/auth.js";
import pool from "../../database.js";

const router = express.Router();

router.get('/secretaria', isLoggedIn, (req, res) => {
  res.render('interface/client/perfilsecret', { 
    styles: '<link rel="stylesheet" href="/css/client/navsecret.css"><link rel="stylesheet" href="/css/client/perfilsecret.css">' 
  });
});

//TODO Rutas de Registros (Estudiantes)

router.get('/secretaria/registro', isLoggedIn, (req, res) => {
  res.render('interface/client/addestudiantes', { 
    styles: '<link rel="stylesheet" href="/css/client/navsecret.css"><link rel="stylesheet" href="/css/client/addestudiantes.css">' 
  });
});

router.post('/secretaria/registro', async(req, res) => {
  console.log(req.body);
  const { nombre, apellidos, direccion, edad, sexo } = req.body;
  const estudiante = { nombre, apellidos, edad, direccion, sexo };

  await pool.query('INSERT INTO Estudiante SET ?', [estudiante]);
  res.redirect('/secretaria/lista');
});

router.get('/secretaria/lista', isLoggedIn, async(req, res) => {
  const ITEMS_PER_PAGE = 10; // Número de estudiantes por página
  const page = req.query.page || 1; // Página actual, por defecto la primera página
  const offset = (page - 1) * ITEMS_PER_PAGE; // Índice de inicio de los registros a seleccionar

  // Consulta para obtener los registros de estudiantes de la página actual
  const [estudiantes] = await pool.query('SELECT * FROM Estudiante LIMIT ? OFFSET ?', [ITEMS_PER_PAGE, offset]);

  // Consulta para obtener el número total de registros de estudiantes
  const [totalEstudiantes] = await pool.query('SELECT COUNT(*) as total FROM Estudiante');
  const totalItems = totalEstudiantes[0].total; // Total de estudiantes

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE); // Número total de páginas

  let startPage = 1;
  let endPage = totalPages;

  if (totalPages > 5) {
    if (page > 3) {
      startPage = page - 2;
      endPage = Math.min(page + 2, totalPages);
    } else {
      endPage = 5;
    }
  }

  const hasNextPage = parseInt(page) < totalPages; // Determina si hay una página siguiente
  const hasPrevPage = parseInt(page) > 1; // Determina si hay una página anterior

  res.render('interface/client/listestudiantes', {
    styles: '<link rel="stylesheet" href="/css/client/navsecret.css">',
    estudiantes: estudiantes,
    currentPage: parseInt(page),
    totalPages: totalPages,
    hasNextPage: hasNextPage,
    hasPrevPage: hasPrevPage,
    startPage: startPage,
    endPage: endPage,
    pages: Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
  });
});



export default router;