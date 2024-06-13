export function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  //return res.status(404).send("Error 404: No encontrado");
  return res.redirect('/login');
};

export function isNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  if (req.user[0].nombre_rol === 'Administrador') { return res.redirect('/administrador'); } 
  else if (req.user[0].nombre_rol === 'Secretaria') { return res.redirect('/secretaria'); } 
  else { return res.redirect('/profesor'); }
};

export function checkRol(rol) {
  return function(req, res, next) {
    // Verifica si el usuario tiene el rol adecuado
    console.log(req.user[0].nombre_rol);
    if (req.user && req.user[0].nombre_rol === rol) {
      return next(); // Permite el acceso
    } else {
      return res.status(403).send("Error 403: Acceso prohibido"); // Si no tiene el rol adecuado, envía un mensaje de error
    }
  };
}