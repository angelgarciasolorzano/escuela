import pool from "../config/database.js";
import { body, validationResult } from "express-validator";

const estudiantesDatosAPI = async (req, res) => {
  const [data] = await pool.query('SELECT * FROM Estudiante');
  if(data && data.length > 0) { res.send(data); }
};

const tutoresDatosAPI = async (req, res) => {
  const [data] = await pool.query('SELECT * FROM Tutor');
  if(data && data.length > 0) { res.send(data); }
};

const verificarDatosBodyAPI = [
  body('nombre_est').notEmpty().withMessage('El campo esta vacio'),
  body('apellidos_est').notEmpty().withMessage('El campo esta vacio'),
  body('direccion_est').notEmpty().withMessage('El campo esta vacio'),
  body('nivel_est').custom(value => {

    if (value === 'Primaria' || value === 'Secundaria') { return true; }
    else { throw new Error('El nivel aceptado es primaria o secundaria'); }

  }),
  body('grado_est').notEmpty().withMessage('El campo esta vacio').isNumeric().withMessage('Solo se aceptan numeros').custom((value, { req }) => {
    const nivelEst = req.body.nivel_est;

    if (nivelEst === 'Seleccionar Nivel') { throw new Error('Seleccione primero un nivel de estudio'); }

    if (nivelEst === 'Primaria' && (value < 1 || value > 6)) { throw new Error('El grado debe estar entre 1 y 6 grado'); } 
    else if (nivelEst === 'Secundaria' && (value < 1 || value > 5)) { throw new Error('El año debe estar entre 1 y 5 año'); }

    return true;
  }),
  body('fecha_est').notEmpty().withMessage('Esta vacio o Incompleto'),

  body('nombre_tutor').notEmpty().withMessage('El campo esta vacio'),
  body('apellido_tutor').notEmpty().withMessage('El campo esta vacio'),
  body('cedula_tutor').notEmpty().withMessage('El campo esta vacio').custom(value => {
    const regex = /^\d{3}\-([0-2][0-9]|3[0-1])()(0[1-9]|1[0-2])\2(\d{2})\-\d{4}\w$/g;
  
    if (regex.test(value) === false) { throw new Error('Formato de cédula incorrecto'); } 
    else { return true; }

  }).custom(async (value, { req }) => {
    const idTutor = req.body.id_tutor;
    const buscarCedula = await pool.query('SELECT cedula_Tutor FROM Tutor WHERE cedula_Tutor = ?', value);

    if(idTutor > 0) { return true }
    else {
      if(buscarCedula[0].length > 0) { throw new Error('Esta cedula ya esta registrada'); }
      else { return true; }
    }
  }),
  body('ocupacion_tutor').notEmpty().withMessage('El campo esta vacio'),
  body('telefono_tutor').notEmpty().withMessage('El campo esta vacio').isNumeric().withMessage('Solo se aceptan numeros').isLength( {
    min: 8, max: 8
  }).withMessage('Tiene que ingresar 8 digitos')
];

const verificarMatriculaAPI = (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) { res.send({ errors: error.array({ onlyFirstError: true }), status: true }); } 
  else { res.send({ status: false }) }
};

export {
  estudiantesDatosAPI,
  tutoresDatosAPI,
  verificarDatosBodyAPI,
  verificarMatriculaAPI
};