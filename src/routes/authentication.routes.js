import express from "express";
import passport from "passport";
import { isLoggedIn, isNotLoggedIn } from "../lib/middleware/auth.js";

const router = express.Router();

router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('auth/login', { styles: '<link rel="stylesheet" href="/css/login.css">' });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('sesion.local', (err, user, info) => {
    if (err) { return next(err); } 
    if (!user) { return res.redirect('/login'); }
    if (user.nombre_cargo !== req.body.cargo) { return res.redirect('/login'); }

    req.logIn(user, (err) => {
      if (err) { return next(err); }

      if (user.nombre_cargo === 'Administrador') { return res.redirect('administrador') }
      else if (user.nombre_cargo === 'Secretaria') { return res.redirect('secretaria') }
      else { return res.redirect('profesor') }
    });
  })(req, res, next);
});

router.get('/cerrar', isLoggedIn, (req, res, next) => {
  req.logout(req.user, err => {
    if (err) return next(err);
    res.redirect('/login');
  });
});

export default router;