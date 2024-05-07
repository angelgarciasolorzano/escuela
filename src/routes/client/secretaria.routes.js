import express from "express";
import { isLoggedIn } from "../../lib/middleware/auth.js";
import pool from "../../database.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.get('/secretaria', isLoggedIn, (req, res) => {
  res.render('interface/client/perfilsecret');
});

router.get('/secretaria/registro', isLoggedIn, (req, res) => {
  const fechaHoy = new Date(Date.now());
  res.render('interface/client/addmatricula', {anioActual : fechaHoy.getFullYear()});
});//Cargar plantilla matricula

router.get('/secretaria/registro/estudiante', isLoggedIn, async (req, res) => {
  const [nivel] = await pool.query('SELECT id_nivel, nombre, tipo FROM nivel');
  res.render('interface/client/addestudiante', {nivel: nivel});
});//Cargar plantilla Registro estudiante

router.post('/api/verificar_tutor', isLoggedIn,
  [
    body('nombres').notEmpty().withMessage('Esta vacío!')
    .custom(value => {
      const regex = /^([A-ZÀ-ÿ][a-zÀ-ÿ]+)[\ ]?((de los )|(del ))?((([A-ZÀ-ÿ][a-zÀ-ÿ]+)[ ]?)+)?$/g;
      if (regex.test(value) === false) {
        throw new Error('Formato incorrecto');
      } else { return true; }}),
    body('apellidos').notEmpty().withMessage('Esta vacío!')
    .custom(value => {
      const regex = /^([A-ZÀ-ÿ][a-zÀ-ÿ]+)[\ ]?((de los )|(del ))?((([A-ZÀ-ÿ][a-zÀ-ÿ]+)[ ]?)+)?$/g;
      if (regex.test(value) === false) {
        throw new Error('Formato incorrecto');
      } else { return true; }}),
    body('correo_e').notEmpty().withMessage('Esta vacío!')
      .isEmail().withMessage('Este no es un Email')
      .custom( async value => {
        const correo_e_tutor = await pool.query('select correo_e from tutor where correo_e = ?', value);
        const correo_e_usuario = await pool.query('select correo_e from usuario where correo_e = ?', value);
        if (correo_e_tutor[0].length > 0 || correo_e_usuario[0].length > 0) {
          throw new Error('Ya esta registrado!');
        } else { return true; }}),
    body('cedula').notEmpty().withMessage('Esta vacío!')
      .custom(value => {
        const regex = /^\d{3}\-([0-2][0-9]|3[0-1])()(0[1-9]|1[0-2])\2(\d{2})\-\d{4}\w$/g;
        if (regex.test(value) === false) {
          throw new Error('Formato de cédula incorrecto');
        } else { return true; }})
      .custom( async value => {
        const cedula_tutor = await pool.query('select cedula from tutor where cedula = ?', value);
        const cedula_usuario = await pool.query('select cedula from usuario where cedula = ?', value);
        if (cedula_tutor[0].length > 0 || cedula_usuario[0].length > 0) {
          throw new Error('Ya esta registrado!');
        } else { return true; }}),
    body('sexo').notEmpty().withMessage('Falta seleccionar!'),
    body('telefono').notEmpty().withMessage('Esta vacío!')
      .isInt().withMessage('Solo se aceptan numeros enteros')
      .isLength({ min: 8 }).withMessage('Tiene que ingresar 8 digitos')
      .custom( async value => {
        const telefono_tutor = await pool.query('select telefono from tutor where telefono= ?', value);
        const telefono_usuario = await pool.query('select telefono from usuario where telefono= ?', value);
        if (telefono_tutor[0].length > 0 || telefono_usuario[0].length > 0) {
          throw new Error('Ya esta registrado!');
        } else { return true; }}),
    body('direccion').notEmpty().withMessage('Esta vacío!')
  ], (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.send({ errors: error.array({ onlyFirstError: true }), status: true });
    } else {
      res.send({ status: false });
    }
});//Verifica el formulario del tutor para su registro

router.post('/api/verificar_estudiante', isLoggedIn,
  [
    body('nombres').notEmpty().withMessage('Esta vacío!')
    .custom(value => {
      const regex = /^([A-ZÀ-ÿ][a-zÀ-ÿ]+)[\ ]?((de los )|(del ))?((([A-ZÀ-ÿ][a-zÀ-ÿ]+)[ ]?)+)?$/g;
      if (regex.test(value) === false) {
        throw new Error('Formato incorrecto');
      } else { return true; }}),
    body('apellidos').notEmpty().withMessage('Esta vacío!')
    .custom(value => {
      const regex = /^([A-ZÀ-ÿ][a-zÀ-ÿ]+)[\ ]?((de los )|(del ))?((([A-ZÀ-ÿ][a-zÀ-ÿ]+)[ ]?)+)?$/g;
      if (regex.test(value) === false) {
        throw new Error('Formato incorrecto');
      } else { return true; }}),
    body('registroNac').notEmpty().withMessage('Esta vacío!')
      .custom(value => {
        const regex = /^\d{2,4}-\d{2,4}-\d{2,4}$/g;
        if (regex.test(value) === false) {
          throw new Error('Formato incorrecto');
        } else { return true; }})
      .custom( async value => {
        const searchRegistroNac = await pool.query('select registroNac from estudiante where registroNac = ?', value);
        if (searchRegistroNac[0].length > 0) {
          throw new Error('Ya esta registrado!');
        } else { return true; }}),
    body('fechaNac').notEmpty().withMessage('Esta vacío!')
    .custom(value => {
      const regex = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/g;
      if (regex.test(value) === false) {
        throw new Error('Formato incorrecto');
      } else { return true; }}),
    body('sexo_value').notEmpty().withMessage('Falta seleccionar!'),
    body('nivel_value').notEmpty().withMessage('Falta seleccionar!')
  ], (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.send({ errors: error.array({ onlyFirstError: true }), status: true });
    } else {
      res.send({ status: false });
    }
});//Verifica el formulario del estudiante para su registro

router.post('/api/registrar', isLoggedIn, async (req, res) => {

  const tutor = [req.body.tutor.nombres, req.body.tutor.apellidos, req.body.tutor.cedula,
                req.body.tutor.correo_e, req.body.tutor.sexo, req.body.tutor.telefono, req.body.tutor.direccion];
  const estudiante = req.body.estudiante;

  try{
    await pool.query(`INSERT INTO tutor(nombres, apellidos, cedula, correo_e, sexo, telefono, direccion)
                      VALUES(?,?,?,?,?,?,?)`, tutor);
  } catch (error) {
    console.log(error);
    res.send({success: false});
  }

  try {
    const search_tutor = await pool.query('SELECT id_tutor FROM tutor WHERE cedula =?', req.body.tutor.cedula);
    for(let i = 0; i < estudiante.length; i++) {
      await pool.query(`INSERT INTO estudiante(nombres, apellidos, registroNac, fechaNac, sexo, id_tutor_fk, id_nivel_fk)
                      VALUES(?,?,?,?,?,?,?)`,
                    [estudiante[i].nombres, estudiante[i].apellidos, estudiante[i].registroNac,
                    estudiante[i].fechaNac, estudiante[i].sexo_value, search_tutor[0][0].id_tutor, 
                    estudiante[i].nivel_value]);
    }
    res.send({success: true});
  } catch (error) {
    console.log(error)
    res.send({success: false});
  }

});//Registramos todos los formularios

router.get('/api/estudiante_disponible', isLoggedIn, async (req, res) => {

  try {
    //Declaramos Variables que representan la estructura del datatable
    var draw = req.query.draw;
    var start = req.query.start;
    var length = req.query.length;
    var order_data = req.query.order;

    if (typeof order_data == 'undefined') {
      var column_name = 'estudiante.id_estudiante';
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
     AND (id_estudiante LIKE '%${search_value}%' 
      OR nombres LIKE '%${search_value}%' 
      OR apellidos LIKE '%${search_value}%'
     )
    `;

    //Número total de registros sin filtrar
    var [Data1] = await pool.query("SELECT COUNT(*) AS Total FROM estudiante");
    var total_records = Data1[0].Total;

    //Número total de registros con filtrado
    var [Data2] = await pool.query(`SELECT COUNT(*) AS Total FROM estudiante WHERE 1 ${search_query}`);
    var total_records_with_filter = Data2[0].Total;

    var query = `
            select * from estudiante
            where 1 ${search_query} 
            order by ${column_name} ${column_sort_order} 
            limit ${start}, ${length}
            `; //Integramos en la consulta los parametros de busqueda, utilizando el Search del datatable

    var data_arr = [];
    var [Data3] = await pool.query(query);
    Data3.forEach(function (row) {
      data_arr.push({
        'id_estudiante': row.id_estudiante,
        'nombres': row.nombres,
        'apellidos': row.apellidos,
        'direccion': row.direccion
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