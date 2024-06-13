import express from "express";
import passport from "passport";
import { isLoggedIn, isNotLoggedIn } from "../lib/middleware/auth.js";

const router = express.Router();

router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('auth/login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('sesion.local', (err, user) => {
    if (err) { return next(err); } 
    if (!user) { return res.redirect('/login'); }
    if (user.nombre_rol !== req.body.rol) { return res.redirect('/login'); }

    req.logIn(user, (err) => {
      if (err) { return next(err); }

      if (user.nombre_rol === 'Administrador') { return res.redirect('administrador') }
      else if (user.nombre_rol === 'Secretaria') { return res.redirect('secretaria') }
      else { return res.redirect('profesor') }
    });
  })(req, res, next);
});

router.get('/cerrar', isLoggedIn, (req, res, next) => {
  req.logout(req.user, err => {
    if (err) return next(err);
    return res.redirect('/login');
  });
});

export default router;