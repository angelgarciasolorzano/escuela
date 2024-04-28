import passport from "passport";

const login = (req, res) => {
  res.render('auth/login');
};

const autenticacion = (req, res, next) => {
  passport.authenticate('sesion.local', (err, user, info) => {
    if (err) { return next(err); } 

    if (!user) { return res.redirect('/login'); }

    if (user.nombre_Role !== req.body.cargo) { return res.redirect('/login'); }

    req.logIn(user, (err) => {
      if (err) { return next(err); }

      if (user.nombre_Role === 'Administrador') { return res.redirect('administrador') }
      else if (user.nombre_Role === 'Secretaria') { return res.redirect('secretaria') }
      else { return res.redirect('profesor') }
    });
  })(req, res, next);
};

const cerrarSesion = (req, res, next) => {
  req.logout(req.user, err => {
    if (err) return next(err);
    res.redirect('/login');
  });
};

export { login, autenticacion, cerrarSesion };