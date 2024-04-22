import express from "express";
import { isLoggedIn } from "../../lib/middleware/auth.js";
import pool from "../../database.js";

const router = express.Router();

router.get('/secretaria', isLoggedIn, (req, res) => {
  res.render('interface/client/perfilsecret');
});

//TODO Rutas de Registros (Estudiantes)

router.get('/secretaria/registro', isLoggedIn, (req, res) => {
  res.render('interface/client/addmatricula');
});

router.get('/secretaria/registro/estudiante', isLoggedIn, (req, res) => {
  res.render('interface/client/addestudiante');
});

router.post('/secretaria/registro', async (req, res) => {
  console.log(req.body);
  const { nombre, apellidos, direccion, fechaNac, sexo } = req.body;
  const estudiante = { nombre, apellidos, fechaNac, direccion, sexo };

  await pool.query('INSERT INTO Estudiante SET ?', [estudiante]);
  res.redirect('/secretaria/lista');
});

router.get('/api/estudiante', isLoggedIn, async (req, res) => {
  
  //Declaramos Variables que representan la estructura del datatable
  var draw = req.query.draw;
  var start = req.query.start;
  var length = req.query.length;
  var order_data = req.query.order;

  if (typeof order_data == 'undefined') {
    var column_name = 'Estudiante.id_Estudiante';
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
     AND (id_Estudiante LIKE '%${search_value}%' 
      OR nombre LIKE '%${search_value}%' 
      OR apellidos LIKE '%${search_value}%'
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
      'id_Estudiante': row.id_Estudiante,
      'nombre': row.nombre,
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
});

router.post('/api/matricula', isLoggedIn, async (req, res) => {
  console.log(await req.body);
});

export default router;