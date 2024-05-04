import express from "express";
import { isLoggedIn } from "../middleware/auth.js";
import { perfilSecretaria, matricula, listaEstudiantes, estudianteMatricula } from "../controllers/secretaria.controller.js";
import { estudiantesDatosAPI, tutoresDatosAPI, verificarDatosBodyAPI, verificarMatriculaAPI } from "../api/secretaria.api.js";

const router = express.Router();

router.get('/secretaria', isLoggedIn,perfilSecretaria );
router.get('/secretaria/registro', isLoggedIn, matricula);
router.get('/secretaria/lista', isLoggedIn, listaEstudiantes);
router.get('/api/estudiante', isLoggedIn, estudiantesDatosAPI);
router.get('/api/tutores', isLoggedIn, tutoresDatosAPI);

router.post('/secretaria/registro', isLoggedIn, estudianteMatricula);
router.post('/api/verificar_tutor', isLoggedIn, verificarDatosBodyAPI, verificarMatriculaAPI);

export default router;