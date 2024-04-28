import express from "express";
import passport from "passport";
import { isLoggedIn, isNotLoggedIn } from "../middleware/auth.js";
import { login, autenticacion, cerrarSesion } from "../controllers/auth.controller.js";

const router = express.Router();

router.get('/login', isNotLoggedIn, login);
router.get('/cerrar', isLoggedIn, cerrarSesion);

router.post('/login', isNotLoggedIn, autenticacion);

export default router;