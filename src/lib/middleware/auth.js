export function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // return res.render('error');
};

export function isNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  if (req.user[0].nombre_cargo === 'Administrador') { return res.redirect('/administrador'); } 
  else if (req.user[0].nombre_cargo === 'Secretaria') { return res.redirect('/secretaria'); } 
  else { return res.redirect('/profesor'); }
};