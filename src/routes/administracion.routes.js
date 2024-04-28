//TODO Importando modulos
import express from "express";
import { isLoggedIn } from "../middleware/auth.js";
import pool from "../config/database.js";

const router = express.Router();

//TODO Rutas de Perfiles (Administracion)

//*Enviando la vista para el perfil de administracion
router.get('/administrador', isLoggedIn, (req, res) => {
  res.render('interface/client/perfilsecret');
});

export default router;