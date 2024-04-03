import express from "express";
import { isLoggedIn, isNotLoggedIn } from "../lib/middleware/auth.js";

const router = express.Router();

router.get('/', isNotLoggedIn, (req, res) => {
  res.render('inicio', { styles: '<link rel="stylesheet" href="/css/inicio.css">' });
});

export default router;