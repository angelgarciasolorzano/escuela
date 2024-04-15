import express from "express";
import passport from "passport";
import { isLoggedIn, isNotLoggedIn } from "../lib/middleware/auth.js";

const router = express.Router();

//TODO Rutas del login (Validacions y Vistas)

//TODO esta ruta solo la pueden visitar los usuarios con la sesion ya cerrada
//*Renderizando vista del login
router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('auth/login');
});

//*Validando con sesion.local los datos ingresados por el usuario
router.post('/login', (req, res, next) => {
  passport.authenticate('sesion.local', (err, user, info) => {
    if (err) { return next(err); } 
    //*Si el usuario no existe lo mandamos de nuevo al login
    if (!user) { return res.redirect('/login'); }
    //*Si el usuario existe pero no escogio bien su cargo lo mandamos al login 
    if (user.nombre_Role !== req.body.cargo) { return res.redirect('/login'); }

    req.logIn(user, (err) => {
      if (err) { return next(err); }

      //*Si el usuario es autenticado con exito lo mandamos a su respectivo perfil
      if (user.nombre_Role === 'Administrador') { return res.redirect('administrador') }
      else if (user.nombre_Role === 'Secretaria') { return res.redirect('secretaria') }
      else { return res.redirect('profesor') }
    });
  })(req, res, next);
});

//TODO Esta ruta solamente los usuarios con sesion activa pueden visitar
//*Ruta para cerrar la sesion del usuario
router.get('/cerrar', isLoggedIn, (req, res, next) => {
  req.logout(req.user, err => {
    if (err) return next(err);
    res.redirect('/login');
  });
});

export default router;