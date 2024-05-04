import pool from "../config/database.js";
import { body, validationResult } from "express-validator";
import { estudianteMatricula } from "../controllers/secretaria.controller.js";

const estudiantesDatosAPI = async (req, res) => {
  const [data] = await pool.query('SELECT * FROM Estudiante');
  if(data && data.length > 0) { res.send(data); }
};

const tutoresDatosAPI = async (req, res) => {
  const [data] = await pool.query('SELECT * FROM Tutor');
  if(data && data.length > 0) { res.send(data); }
};

const verificarDatosBodyAPI = [
  body('nombre_tutor').notEmpty().withMessage('El campo esta vacio').isAlpha().withMessage('Solo letras sin acentos'),
  body('apellido_tutor').notEmpty().withMessage('El campo esta vacio').isAlpha().withMessage('Solo letras sin acentos'),
  body('cedula_tutor').notEmpty().withMessage('El campo esta vacio').custom(value => {
    const regex = /^\d{3}\-([0-2][0-9]|3[0-1])()(0[1-9]|1[0-2])\2(\d{2})\-\d{4}\w$/g;
  
    if (regex.test(value) === false) { throw new Error('Formato de cédula incorrecto'); } 
    else { return true; }
  
    }).custom(async value => {
      const buscarCedula = await pool.query('SELECT cedula_Tutor FROM Tutor WHERE cedula_Tutor = ?', value);
  
      if(buscarCedula[0].length > 0) { throw new Error('Esta cedula ya esta registrada'); }
      else { return true; }
    }),
  body('ocupacion_tutor').notEmpty().withMessage('El campo esta vacio'),
  body('telefono_tutor').notEmpty().withMessage('El campo esta vacio').isNumeric().withMessage('Solo se aceptan numeros').isLength( {
    min: 8
  }).withMessage('Tiene que ingresar 8 digitos')
];

const verificarMatriculaAPI = (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) { res.send({ errors: error.array({ onlyFirstError: true }), status: true }); } 
  else { estudianteMatricula; res.send({ status: false }); }
};

export {
  estudiantesDatosAPI,
  tutoresDatosAPI,
  verificarDatosBodyAPI,
  verificarMatriculaAPI
};