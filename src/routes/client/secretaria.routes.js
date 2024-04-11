import express from "express";
import { isLoggedIn } from "../../lib/middleware/auth.js";
import pool from "../../database.js";

const router = express.Router();

router.get('/secretaria', isLoggedIn, (req, res) => {
  res.render('interface/client/perfilsecret');
});

//TODO Rutas de Registros (Estudiantes)

router.get('/secretaria/registro', isLoggedIn, (req, res) => {
  res.render('interface/client/addestudiantes');
});

router.post('/secretaria/registro', async(req, res) => {
  console.log(req.body);
  const { nombre, apellidos, direccion, fechaNac, sexo } = req.body;
  const estudiante = { nombre, apellidos, fechaNac, direccion, sexo };

  await pool.query('INSERT INTO Estudiante SET ?', [estudiante]);
  res.redirect('/secretaria/lista');
});

router.get('/secretaria/lista', isLoggedIn, (req, res) => {
  res.render('interface/client/listestudiantes');
});

router.get('/api/estudiante', isLoggedIn, async (req,res)=>{
   const [Data] = await pool.query('select * from Estudiante');
   if(Data && Data.length > 0)
   res.send(Data);
});

export default router;