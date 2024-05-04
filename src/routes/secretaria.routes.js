import express from "express";
import { isLoggedIn } from "../middleware/auth.js";
import { perfilSecretaria, matricula, listaEstudiantes, estudianteMatricula, estudiantesDatosAPI, tutoresDatosAPI } from "../controllers/secretaria.controller.js";

const router = express.Router();

router.get('/secretaria', isLoggedIn,perfilSecretaria );
router.get('/secretaria/registro', isLoggedIn, matricula);
router.get('/secretaria/lista', isLoggedIn, listaEstudiantes);
router.get('/api/estudiante', isLoggedIn, estudiantesDatosAPI);
router.get('/api/tutores', isLoggedIn, tutoresDatosAPI);

router.post('/secretaria/registro', isLoggedIn, estudianteMatricula);

export default router;