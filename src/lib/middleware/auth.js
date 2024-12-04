export function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
};

export function isNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  if (req.user[0].nombre_rol) { return res.redirect('/home'); }
};

export function checkRol(...rol) {
  return function(req, res, next) {
    // Verifica si el usuario tiene el rol adecuado
    if (req.user && rol.includes(req.user[0].nombre_rol)) {
      return next(); // Permite el acceso
    } else {
      return res.status(403).render('auth/Error403'); // Si no tiene el rol adecuado, envía un mensaje de error
    }
  };
}