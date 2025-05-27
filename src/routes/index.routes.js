import express from "express";
import { isLoggedIn, isNotLoggedIn, checkRol } from "../lib/middleware/auth.js";
import pool from "../database.js";

const router = express.Router();

//Rutas Publicas
router.get('/', isNotLoggedIn, (req, res) => {
  res.render('inicio');
});//Landing page principal

//Rutas Protegidas
router.get('/home', isLoggedIn, checkRol('Administrador', 'Secretaria', 'Profesor'), async (req, res) => {
  const anio_lectivo = await pool.query(`SELECT MAX(anio) AS anio_mayor FROM aniolectivo`);
  const contCard = await pool.query(`call sp_contPerfilAdmin(?)`, anio_lectivo[0][0].anio_mayor);
  const value = contCard[0][0][0];
  const data = { c_estudiante: value.c_estudiante, c_profesor: value.c_profesor, c_detallegrupo: value.c_detallegrupo, c_usuario: value.c_usuario , c_matricula: value.c_matricula};
  
  res.render('interface/client/home', data);
});//Rutar para renderizar home page
router.get('/usuarios', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  const [rol] = await pool.query('SELECT id_rol, nombre_rol FROM rol');
  res.render('interface/client/administrador/usuario', { rol: rol });
});//Rutar para renderizar la plantilla usuarios
router.get('/estudiantes/expediente', isLoggedIn, checkRol('Administrador', 'Secretaria'), async (req, res) => {
  res.render('interface/client/administrador/expediente');
});//Rutar para renderizar la plantilla expediente estudiantes
router.get('/profesores/grupo_guia', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  res.render('interface/client/administrador/grupoGuia');
});//Rutar para renderizar la plantilla grupo guia
router.get('/profesores/materias_profesor', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  res.render('interface/client/administrador/materiasProfe');
});//Rutar para renderizar la plantilla las materias del profesor
router.get('/grupos/asignar_profesores', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  res.render('interface/client/administrador/grupoProfeMaterias');
});;//Rutar para renderizar la plantilla profegrupomaterias
router.get('/academico/anio_lectivo', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  res.render('interface/client/administrador/anioLectivo');
});//Rutar para renderizar la plantilla anioLectivo
router.get('/matricula', isLoggedIn, checkRol('Secretaria'), async (req, res) => {
  const anio_lectivo = await pool.query(`SELECT MAX(anio) AS anio_mayor FROM aniolectivo`);
  const [modalidad] = await pool.query('SELECT id_modalidad, nombre FROM modalidad');
  res.render('interface/client/secretaria/matricula', { anioLectivo: anio_lectivo[0][0].anio_mayor, modalidad: modalidad });
});//Rutar para renderizar la plantilla matricula
router.get('/reportes', isLoggedIn, checkRol('Administrador', 'Secretaria'), async (req, res) => {
  res.render('interface/client/secretaria/reportes');
});//Rutar para renderizar la plantilla reportes
router.get('/grupos/calificaciones', isLoggedIn, checkRol('Profesor'), async (req, res) => {
  res.render('interface/client/profesor/agregar_notas');
});//Rutar para renderizar la plantilla reportes

export default router;