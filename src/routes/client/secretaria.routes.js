//TODO Importando modulos
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
  try {
    const estudiante_tutor = req.body;
    console.log(estudiante_tutor);

    //? LLamando procedimiento almacenado
    const procedure = 'CALL EstudianteTutor(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    //? Agregando los datos de estduiantes_tutor a la variable datos
    const datos = [
      estudiante_tutor.nombre_est,
      estudiante_tutor.apellidos_est,
      estudiante_tutor.direccion_est,
      estudiante_tutor.fecha_est,
      estudiante_tutor.sexo_est,
      estudiante_tutor.nombre_tutor,
      estudiante_tutor.apellido_tutor,
      estudiante_tutor.ocupacion_tutor,
      estudiante_tutor.cedula_tutor,
      estudiante_tutor.telefono_tutor,
    ];

    //? Ejecutando el procedimiento almacenado
    await pool.query(procedure, datos);
    res.redirect('/secretaria/lista');
  } catch (error) {
    console.log(error);
    res.redirect('/secretaria/registro');
  }
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