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
  if (req.user[0].Nombre_Rol === 'Administrador') { return res.redirect('/administrador'); } 
  else if (req.user[0].Nombre_Rol === 'Secretaria') { return res.redirect('/secretaria'); } 
  else { return res.redirect('/profesor'); }
};