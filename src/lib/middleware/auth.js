//TODO Middleware para proteccion de rutas

//*Si el usuario esta autenticado pasamos con el siguiente Middleware
//*Si no esta autenticado lo mandamos a que Inicie Sesion
export function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
};

//*Si el usuario no esta autenticado pasamos con el siguiente Middleware
//*Si el usuario esta autenticado lo mandamos a su perfil
export function isNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  if (req.user[0].nombre_Role === 'Administrador') { return res.redirect('/administrador'); } 
  else if (req.user[0].nombre_Role === 'Secretaria') { return res.redirect('/secretaria'); } 
  else { return res.redirect('/profesor'); }
};