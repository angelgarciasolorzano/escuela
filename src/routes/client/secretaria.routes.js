import express from "express";
import { isLoggedIn } from "../../lib/middleware/auth.js";
import pool from "../../database.js";

const router = express.Router();

//TODO Rutas de Perfiles (Secretaria)

//*Enviando la vista para el perfil de secretaria
router.get('/secretaria', isLoggedIn, (req, res) => {
  res.render('interface/client/perfilsecret');
});

//TODO Rutas de Registros (Estudiantes)

//*Enviando la vista para el registro de estudiantes
router.get('/secretaria/registro', isLoggedIn, (req, res) => {
  res.render('interface/client/addestudiantes');
});

//*Obteniendo los datos del registro de estudiantes
router.post('/secretaria/registro', async(req, res) => {
  console.log(req.body);
  const { nombre, apellidos, direccion, edad, sexo } = req.body;
  const estudiante = { nombre, apellidos, edad, direccion, sexo };

  await pool.query('INSERT INTO Estudiante SET ?', [estudiante]);
  res.redirect('/secretaria/lista');
});

//TODO Rutas de Listas (Estudiantes)

//*Enviando la vista para mostrar los datos de los estudiantes
router.get('/secretaria/lista', isLoggedIn, (req, res) => {
  res.render('interface/client/listestudiantes');
});

//* Enviando los datos de los estudiantes
router.get('/api/estudiante', isLoggedIn, async(req, res) => {
  const [data] = await pool.query('SELECT * FROM Estudiante');

  if(data && data.length > 0) { res.send(data); }
});

export default router;