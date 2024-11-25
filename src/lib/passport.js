import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import pool from "../database.js";

passport.use('sesion.local', new LocalStrategy({
  usernameField: 'usuario',
  passwordField: 'contrasena',
  passReqToCallback: true
}, async(req, usuario, contrasena, done) => {
  const [datos] = await pool.query('CALL UsuarioInformacion(?, ?)', [usuario, null]);

  if (datos && datos[0].length > 0) {
    const usuarioDatos = datos[0][0];
    
    if (usuarioDatos.contrasena === contrasena && usuarioDatos.estado === 'Activo') { done(null, usuarioDatos); } 
    else { done(null, false, { message: 'Email o contraseña incorrecta' }); }
    
  } else { return done(null, false, { message: 'Email o contraseña incorrecta' }); }
}));

passport.serializeUser((user, done) => {
  done(null, user.id_usuario);
});

passport.deserializeUser(async(id, done) => {
  const[datos] = await pool.query('CALL UsuarioInformacion(?, ?)', [null, id]);
  done(null, datos[0]);
});