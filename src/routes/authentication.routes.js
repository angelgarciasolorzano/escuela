import express from "express";
import passport from "passport";
import { isLoggedIn, isNotLoggedIn } from "../lib/middleware/auth.js";

const router = express.Router();

router.get('/login', (req, res) => {
  let error = req.flash('info')[0];
  res.render('auth/login', { messages: error });
});
router.post('/login', (req, res, next) => {
  passport.authenticate('sesion.local', { failureFlash: true }, (err, user, info) => {
    if (err) { return next(err); } 
    if (!user) { req.flash('info', info.message); return res.redirect('/login'); }

    req.logIn(user, (err) => {
      if (err) { return next(err); }

      if (user.nombre_rol) { return res.redirect('/home') }
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