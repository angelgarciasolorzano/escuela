import express from "express";
import { isLoggedIn } from "../../lib/middleware/auth.js";
import pool from "../../database.js";

const router = express.Router();

router.get('/secretaria', isLoggedIn, (req, res) => {
  res.render('interface/client/perfilsecret', { 
    styles: '<link rel="stylesheet" href="/css/client/navsecret.css"><link rel="stylesheet" href="/css/client/perfilsecret.css">' 
  });
});

// TODO Rutas de Registros (Estudiantes)

router.get('/secretaria/registro', isLoggedIn, (req, res) => {
  res.render('interface/client/addestudiantes', { 
    styles: '<link rel="stylesheet" href="/css/client/navsecret.css"><link rel="stylesheet" href="/css/client/addestudiantes.css">' 
  });
});

router.post('/secretaria/registro', async(req, res) => {
  console.log(req.body);
  const { nombre, apellidos, barrio, departamento, edad, sexo } = req.body;
  const estudiante = { nombre, apellidos, barrio, departamento, edad, sexo };

  await pool.query('INSERT INTO Estudiante SET ?', [estudiante]);
  res.redirect('/secretaria/lista');
});

router.get('/secretaria/lista', isLoggedIn, async(req, res) => {
  const [estudiante] = await pool.query('SELECT * FROM Estudiante');

  res.render('interface/client/listestudiantes', {
    styles: '<link rel="stylesheet" href="/css/client/navsecret.css">',
    estudiantes: estudiante
  });
});

export default router;