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
  res.render('interface/client/addmatricula', { anioActual: fechaHoy.getFullYear() });
});//Cargar plantilla matricula

router.get('/secretaria/registro/estudiante', isLoggedIn, async (req, res) => {
  const [modalidad] = await pool.query('SELECT id_modalidad, nombre FROM modalidad');
  res.render('interface/client/addestudiante', { modalidad: modalidad });
});//Cargar plantilla Registro estudiante

router.post('/api/mostrar_nivel', isLoggedIn, async(req,res) => {
  const id_modalidad = req.body.id_modalidad;
  const nivel_est = await pool.query(`select id_nivel, nombre from nivel where id_modalidad_fk = ${id_modalidad}`);
  res.send(nivel_est[0]);
})//Carga los niveles o grados mediante el id de la modalidad 

router.post('/api/verificar_tutor', isLoggedIn,
  [
    body('nombres').notEmpty().withMessage('Esta vacío!')
      .custom(value => {
        const regex = /^([A-ZÀ-ÿ][a-zÀ-ÿ]+)[\ ]?((de los )|(del ))?((([A-ZÀ-ÿ][a-zÀ-ÿ]+)[ ]?)+)?$/g;
        if (regex.test(value) === false) {
          throw new Error('Formato incorrecto');
        } else { return true; }
      }),
    body('apellidos').notEmpty().withMessage('Esta vacío!')
      .custom(value => {
        const regex = /^([A-ZÀ-ÿ][a-zÀ-ÿ]+)[\ ]?((de los )|(del ))?((([A-ZÀ-ÿ][a-zÀ-ÿ]+)[ ]?)+)?$/g;
        if (regex.test(value) === false) {
          throw new Error('Formato incorrecto');
        } else { return true; }
      }),
    body('correo_e').notEmpty().withMessage('Esta vacío!')
      .isEmail().withMessage('Este no es un Email')
      .custom(async value => {
        const correo_e_tutor = await pool.query('select correo_e from tutor where correo_e = ?', value);
        const correo_e_usuario = await pool.query('select correo_e from usuario where correo_e = ?', value);
        if (correo_e_tutor[0].length > 0 || correo_e_usuario[0].length > 0) {
          throw new Error('Ya esta registrado!');
        } else { return true; }
      }),
    body('cedula').notEmpty().withMessage('Esta vacío!')
      .custom(value => {
        const regex = /^\d{3}\-([0-2][0-9]|3[0-1])()(0[1-9]|1[0-2])\2(\d{2})\-\d{4}\w$/g;
        if (regex.test(value) === false) {
          throw new Error('Formato de cédula incorrecto');
        } else { return true; }
      })
      .custom(async value => {
        const cedula_tutor = await pool.query('select cedula from tutor where cedula = ?', value);
        const cedula_usuario = await pool.query('select cedula from usuario where cedula = ?', value);
        if (cedula_tutor[0].length > 0 || cedula_usuario[0].length > 0) {
          throw new Error('Ya esta registrado!');
        } else { return true; }
      }),
    body('sexo').notEmpty().withMessage('Falta seleccionar!'),
    body('telefono').notEmpty().withMessage('Esta vacío!')
      .isInt().withMessage('Solo se aceptan numeros enteros')
      .isLength({ min: 8 }).withMessage('Tiene que ingresar 8 digitos')
      .custom(async value => {
        const telefono_tutor = await pool.query('select telefono from tutor where telefono= ?', value);
        const telefono_usuario = await pool.query('select telefono from usuario where telefono= ?', value);
        if (telefono_tutor[0].length > 0 || telefono_usuario[0].length > 0) {
          throw new Error('Ya esta registrado!');
        } else { return true; }
      }),
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
        } else { return true; }
      }),
    body('apellidos').notEmpty().withMessage('Esta vacío!')
      .custom(value => {
        const regex = /^([A-ZÀ-ÿ][a-zÀ-ÿ]+)[\ ]?((de los )|(del ))?((([A-ZÀ-ÿ][a-zÀ-ÿ]+)[ ]?)+)?$/g;
        if (regex.test(value) === false) {
          throw new Error('Formato incorrecto');
        } else { return true; }
      }),
    body('registroNac').notEmpty().withMessage('Esta vacío!')
      .custom(value => {
        const regex = /^\d{2,4}-\d{2,4}-\d{2,4}$/g;
        if (regex.test(value) === false) {
          throw new Error('Formato incorrecto');
        } else { return true; }
      })
      .custom(async value => {
        const searchRegistroNac = await pool.query('select registroNac from estudiante where registroNac = ?', value);
        if (searchRegistroNac[0].length > 0) {
          throw new Error('Ya esta registrado!');
        } else { return true; }
      }),
    body('fechaNac').notEmpty().withMessage('Esta vacío ó incompleto!'),
    body('sexo_value').notEmpty().withMessage('Falta seleccionar!'),
    body('modalidad_value').notEmpty().withMessage('Falta seleccionar!'),
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

  const verif_cedula = await pool.query(`select cedula from tutor where cedula = ?`, req.body.tutor.cedula);
  
  var verif_RegistroNac = '';
  var aux = false;

  console.log(verif_cedula[0].length);

  for(let i = 0; i < estudiante.length; i++){
    verif_RegistroNac = await pool.query(`select registroNac from estudiante where registroNac =?`,estudiante[i].registroNac);
    if(verif_RegistroNac && verif_RegistroNac[0].length > 0){
      console.log(verif_RegistroNac[0].length);
      aux = true;
      break;
    }
  }
  
  if(verif_cedula && verif_cedula[0].length === 0 && aux === false) {
    try {
      await pool.query(`INSERT INTO tutor(nombres, apellidos, cedula, correo_e, sexo, telefono, direccion)
                        VALUES(?,?,?,?,?,?,?)`, tutor);
    } catch (error) {
      console.log(error);
      res.send({ success: false });
    }

    try {
      const search_tutor = await pool.query('SELECT id_tutor FROM tutor WHERE cedula =?', req.body.tutor.cedula);
      for (let i = 0; i < estudiante.length; i++) {
        await pool.query(`INSERT INTO estudiante(nombres, apellidos, registroNac, fechaNac, sexo, id_tutor_fk, id_nivel_fk)
                        VALUES(?,?,?,?,?,?,?)`,
          [estudiante[i].nombres, estudiante[i].apellidos, estudiante[i].registroNac,
          estudiante[i].fechaNac, estudiante[i].sexo_value, search_tutor[0][0].id_tutor,
          estudiante[i].nivel_value]);
      }
      res.send({ success: true });
    } catch (error) {
      console.log(error)
      res.send({ success: false });
    }
  } else{
    res.send({ success: false });
  }

});//Registramos todos los formularios

router.get('/api/estudiante_disponible', isLoggedIn, async (req, res) => {

  try {

    var { draw, start, length, order, columns, search } = req.query; //DesEstructuramos el request query

    if (typeof order == 'undefined') {
      var column_name = 'vw_estudianteMatricula.id_estudiante';
      var column_sort_order = 'asc';
    }
    else {
      var column_index = order[0]['column'];
      var column_name = columns[column_index]['data'];
      var column_sort_order = order[0]['dir'];
    }

    //Buscador datos
    var search_value = search['value'].trim();
    var search_query = `
    AND (id_estudiante LIKE '%${search_value}%' 
    OR nombres LIKE '%${search_value}%' 
    OR apellidos LIKE '%${search_value}%'
    OR tutor_cedula LIKE '%${search_value}%')`;
    //Número total de registros sin filtrar
    var [Data1] = await pool.query("SELECT COUNT(*) AS Total FROM vw_estudianteMatricula");
    var total_records = Data1[0].Total;

    //Número total de registros con filtrado
    var [Data2] = await pool.query(`SELECT COUNT(*) AS Total FROM vw_estudianteMatricula WHERE 1 ${search_query}`);
    var total_records_with_filter = Data2[0].Total;
    var query = `
            select * from vw_estudianteMatricula
            where 1 ${search_query} 
            order by ${column_name} ${column_sort_order} 
            limit ${start}, ${length}`; //Integramos en la consulta los parametros de busqueda, utilizando el Search del datatable

    var data_arr = [];
    var [Data3] = await pool.query(query);
    Data3.forEach(function (row) {
      data_arr.push({
        'id_estudiante': row.id_estudiante,
        'nombres': row.nombres,
        'apellidos': row.apellidos,
        'tutor': row.tutor_nombres +' '+ row.tutor_apellidos,
        'direccion': row.direccion,
        'nivel_grado': row.nivel_grado,
        'modalidad': row.modalidad,
        'estado': row.estado,
        'id_nivel_grado': row.id_nivel_fk
      });//Agregamos al arreglo todos los campos que queremos que contenga la data
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

router.post('/api/mostrar_grupo', isLoggedIn, async (req, res) => {
  const id_nivel_grado = req.body.id_nivel_grado;
  const grupo_est = await pool.query(`select DG.id_detallegrupo, G.nombre from detallegrupo as DG 
                                      inner join nivel as N on DG.id_nivel_fk = N.id_nivel
                                      inner join grupo as G on DG.id_grupo_fk = G.id_grupo
                                      where DG.id_nivel_fk = ?`,id_nivel_grado);
  res.send(grupo_est[0]);
});
router.post('/api/agregar_matricula', isLoggedIn, async (req, res) => {
  const {id_estudiante, grupo, name_secretaria} = req.body;
  const verif_matricula = await pool.query(`select M.id_matricula from matricula as M 
                                            inner join estudiante as E on M.id_estudiante_fk = E.id_estudiante
                                            inner join aniolectivo as AL on M.id_aniolectivo_fk = AL.id_aniolectivo
                                            where E.id_estudiante = ? and AL.anio = year(now());`,id_estudiante);
  if(verif_matricula[0].length > 0){
    res.send({success: false});
  } else {
    try {
      const id_aniolectivo = await pool.query(`select id_aniolectivo from aniolectivo where anio = year(now());`);
      const id_secretaria = await pool.query(`select id_usuario from usuario where correo_e = ?`, name_secretaria);
      await pool.query(`insert into matricula(id_estudiante_fk, id_aniolectivo_fk, id_usuario_fk, id_detallegrupo_fk)
                        values(?,?,?,?)`,[id_estudiante,id_aniolectivo[0][0].id_aniolectivo,id_secretaria[0][0].id_usuario,grupo]);
      res.send({success: true});
    } catch (error) {
      console.log(error);
    }
  }
});//Metodo para matricular

export default router;