import express from "express";
import { isLoggedIn, checkRol } from "../../lib/middleware/auth.js";
import pool from "../../database.js";

const router = express.Router();

//TODO Rutas de Perfiles (Profesor)
router.get('/profesor', isLoggedIn, checkRol('Profesor'), async (req, res) => {
  const contCard = await pool.query(`call sp_contPerfilAdmin()`);
  const value = contCard[0][0][0];
  res.render('interface/client/profesor/perfilprofe', { c_estudiante: value.c_estudiante, c_profesor: value.c_profesor, c_detallegrupo: value.c_detallegrupo, c_matricula: value.c_matricula });
});

export default router;