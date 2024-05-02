import express from "express";
import { isLoggedIn } from "../../lib/middleware/auth.js";
import pool from "../../database.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.get('/secretaria', isLoggedIn, (req, res) => {
  res.render('interface/client/perfilsecret');
});

router.get('/secretaria/registro', isLoggedIn, (req, res) => {
  res.render('interface/client/addmatricula');
});//Cargar plantilla matricula

router.get('/secretaria/registro/estudiante', isLoggedIn, async (req, res) => {
  res.render('interface/client/addestudiante');
});//Cargar plantilla Registro estudiante

router.post('/api/verificar_tutor', isLoggedIn,
  [
    body('nombres').notEmpty().withMessage('El campo esta vacío!')
      .isAlpha().withMessage('Solo Letras sin acento'),
    body('apellidos').notEmpty().withMessage('El campo esta vacío!')
      .isAlpha().withMessage('Solo Letras sin acento'),
    body('correo_e').notEmpty().withMessage('El campo esta vacío!')
      .isEmail().withMessage('Este no es un Email')
      .custom( async value => {
        const searchCorreo = await pool.query('select Correo_e from Tutor where Correo_e = ?', value);
        if (searchCorreo[0].length > 0) {
          throw new Error('Este Email ya esta registrado!');
        } else { return true; }}),
    body('cedula').notEmpty().withMessage('El campo esta vacío!')
      .custom(value => {
        const regex = /^\d{3}\-([0-2][0-9]|3[0-1])()(0[1-9]|1[0-2])\2(\d{2})\-\d{4}\w$/g;
        if (regex.test(value) === false) {
          throw new Error('Formato de cédula incorrecto');
        } else { return true; }})
      .custom( async value => {
        const searchCedula = await pool.query('select Cedula from Tutor where Cedula = ?', value);
        if (searchCedula[0].length > 0) {
          throw new Error('Esta cédula ya esta registrada!');
        } else { return true; }}),
    body('sexo').notEmpty().withMessage('El campo esta vacío!'),
    body('telefono').notEmpty().withMessage('El campo esta vacío!')
      .isNumeric().withMessage('Solo se aceptan numeros')
      .isLength({ min: 8 }).withMessage('Tiene que ingresar 8 digitos'),
    body('direccion').notEmpty().withMessage('El campo esta vacío!')
  ], (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.send({ errors: error.array({ onlyFirstError: true }), status: true });
    } else {
      res.send({ status: false });
    }
});//Verifica el formulario del tutor para su registro

router.get('/api/estudiante_disponible', isLoggedIn, async (req, res) => {

  try {
    //Declaramos Variables que representan la estructura del datatable
    var draw = req.query.draw;
    var start = req.query.start;
    var length = req.query.length;
    var order_data = req.query.order;

    if (typeof order_data == 'undefined') {
      var column_name = 'Estudiante.Id_Estudiante';
      var column_sort_order = 'asc';
    }
    else {
      var column_index = req.query.order[0]['column'];
      var column_name = req.query.columns[column_index]['data'];
      var column_sort_order = req.query.order[0]['dir'];
    }

    //Buscador datos
    var search_value = req.query.search['value'];
    var search_query = `
     AND (Id_Estudiante LIKE '%${search_value}%' 
      OR Nombres LIKE '%${search_value}%' 
      OR Apellidos LIKE '%${search_value}%'
     )
    `;

    //Número total de registros sin filtrar
    var [Data1] = await pool.query("SELECT COUNT(*) AS Total FROM Estudiante");
    var total_records = Data1[0].Total;

    //Número total de registros con filtrado
    var [Data2] = await pool.query(`SELECT COUNT(*) AS Total FROM Estudiante WHERE 1 ${search_query}`);
    var total_records_with_filter = Data2[0].Total;

    var query = `
            SELECT * FROM Estudiante
            WHERE 1 ${search_query} 
            ORDER BY ${column_name} ${column_sort_order} 
            LIMIT ${start}, ${length}
            `; //Integramos en la consulta los parametros de busqueda, utilizando el Search del datatable

    var data_arr = [];
    var [Data3] = await pool.query(query);
    Data3.forEach(function (row) {
      data_arr.push({
        'id_Estudiante': row.Id_Estudiante,
        'nombres': row.Nombres,
        'apellidos': row.Apellidos,
        'direccion': row.Direccion
      });//Agregamos al arreglo todos los campos que queros que contenga la data
    });

    var output = {
      'draw': draw,
      'iTotalRecords': total_records,
      'iTotalDisplayRecords': total_records_with_filter,
      'aaData': data_arr
    };//Estructura datatable
    res.json(output);//Envianmos al datatable la estructura en formato json
  } catch (error) {
    res.status(500).send('Error 500');
  }
});//Metodo para buscar en tiempo real los estudiantes disponibles para matricular

router.post('/api/matricula', isLoggedIn, async (req, res) => {
  console.log(await req.body);
});//Metodo para matricular

export default router;