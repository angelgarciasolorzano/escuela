import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import pool from "../database.js";

passport.use('sesion.local', new LocalStrategy({
  usernameField: 'usuario',
  passwordField: 'contra',
  passReqToCallback: true
}, async(req, usuario, contra, done) => {
  const [rows] = await pool.query('SELECT * FROM Usuario AS U INNER JOIN Cargo AS C ON U.id_Cargo_FK = C.id_Cargo WHERE correo =?', [usuario]);
  console.log(rows[0]);

  if (rows.length > 0) {
    const usuarioDatos = rows[0];

    if (usuarioDatos.contra === contra) { done(null, usuarioDatos); } 
    else { done(null, false); }
    
  } else {
    return done(null, use);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id_Usuario);
});

passport.deserializeUser(async(id, done) => {
  const [rows] = await pool.query('SELECT * FROM Usuario AS U INNER JOIN Cargo AS C ON U.id_Cargo_FK = C.id_Cargo WHERE id_Usuario =?', [id]);
  done(null, rows);
});