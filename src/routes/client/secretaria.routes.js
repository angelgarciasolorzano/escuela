import express from "express";
import { isLoggedIn, checkRol } from "../../lib/middleware/auth.js";
import pool from "../../database.js";
import { body, validationResult } from "express-validator";
import { buildPDF, reporteMatricula } from "../../lib/pdfkit.js";

const router = express.Router();

//TODO Rutas de Perfiles (Secretario)
router.get('/secretaria', isLoggedIn, checkRol('Secretaria'), async (req, res) => {
  const contCard = await pool.query(`call sp_contPerfilAdmin()`);
  const value = contCard[0][0][0];
  res.render('interface/client/secretaria/perfilsecret', { c_estudiante: value.c_estudiante, c_profesor: value.c_profesor, c_detallegrupo: value.c_detallegrupo, c_matricula: value.c_matricula });
});
router.get('/secretaria/matricula', isLoggedIn, checkRol('Secretaria'), async (req, res) => {
  const fechaHoy = new Date(Date.now());
  const [modalidad] = await pool.query('SELECT id_modalidad, nombre FROM modalidad');
  res.render('interface/client/secretaria/addmatricula', { anioActual: fechaHoy.getFullYear(), modalidad: modalidad });
});//Cargar plantilla matricula
router.get('/secretaria/estudiante/datos_personales', isLoggedIn, checkRol('Secretaria'), async (req, res) => {
  res.render('interface/client/secretaria/datosP_estudiante');
});//Cargar plantilla Datos Personales estudiante
router.get('/secretaria/reporte/matricula', isLoggedIn, checkRol('Secretaria'), async (req, res) => {
  res.render('interface/client/secretaria/reporte_matricula');
});//Cargar la opcion reporte-matricula
//Rutas Paginas
//Api

router.get('/api/imprimir_matricula', isLoggedIn, (req, res) => {
  const datos = req.query.matricula;
  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment; filename=invoice.pdf",
  });
  buildPDF(
    (data) => stream.write(data),
    () => stream.end(), datos
  );
});

router.get('/api/reporte_matricula', isLoggedIn, (req, res) => {
  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment; filename=invoice.pdf",
  });
  reporteMatricula(
    (data) => stream.write(data),
    () => stream.end()
  );
});
router.post('/api/verificar_tutorEstudiante', isLoggedIn, checkRol('Secretaria'),
  [
    body('nombres_tutor').notEmpty().withMessage('Esta vacío!')
      .custom(value => {
        const regex = /^([A-ZÀ-ÿ][a-zÀ-ÿ]+)[\ ]?((de los )|(del ))?((([A-ZÀ-ÿ][a-zÀ-ÿ]+)[ ]?)+)?$/g;
        if (regex.test(value) === false) {
          throw new Error('Formato incorrecto');
        } else { return true; }
      }),
    body('correo_e_tutor')
      .custom(async (value, { req }) => {
        const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/g;
        if (regex.test(value) === false && value != "") {
          throw new Error('Formato incorrecto');
        } else { return true; }
    })
      .custom(async (value, { req }) => {
        const correo_e_tutor = await pool.query('select correo_e from tutor where correo_e = ?', value);
        if (correo_e_tutor[0].length > 0 && req.body.aux === 0 && value != "") {
          throw new Error('Ya esta registrado!');
        } else { return true; }
      }),
    body('cedula_tutor').notEmpty().withMessage('Esta vacío!')
      .custom(value => {
        const regex = /^\d{3}\-([0-2][0-9]|3[0-1])()(0[1-9]|1[0-2])\2(\d{2})\-\d{4}\w$/g;
        if (regex.test(value) === false) {
          throw new Error('Formato de cédula incorrecto');
        } else { return true; }
      })
      .custom(async (value, { req }) => {
        const cedula_tutor = await pool.query('select cedula from tutor where cedula = ?', value);
        if (cedula_tutor[0].length > 0 && req.body.aux === 0) {
          console.log(req.body);
          throw new Error('Ya esta registrado!');
        } else { return true; }
      }),
    body('sexo_tutor').notEmpty().withMessage('Falta seleccionar!'),
    body('relacion_tutor').notEmpty().withMessage('Falta seleccionar!'),
    body('telefono_tutor').notEmpty().withMessage('Esta vacío!')
      .isInt().withMessage('Solo se aceptan numeros enteros')
      .isLength({ min: 8 }).withMessage('Tiene que ingresar 8 digitos')
      .custom(async (value, { req }) => {
        const telefono_tutor = await pool.query('select telefono from tutor where telefono= ?', value);
        if (telefono_tutor[0].length > 0 && req.body.aux === 0) {
          throw new Error('Ya esta registrado!');
        } else { return true; }
      }),
    body('ocupacion_tutor').notEmpty().withMessage('Esta vacío!'),
    body('direccion_tutor').notEmpty().withMessage('Esta vacío!'),
    body('nombres_est').notEmpty().withMessage('Esta vacío!')
      .custom(value => {
        const regex = /^([A-ZÀ-ÿ][a-zÀ-ÿ]+)[\ ]?((de los )|(del ))?((([A-ZÀ-ÿ][a-zÀ-ÿ]+)[ ]?)+)?$/g;
        if (regex.test(value) === false) {
          throw new Error('Formato incorrecto');
        } else { return true; }
      }),
    body('apellidos_est').notEmpty().withMessage('Esta vacío!')
      .custom(value => {
        const regex = /^([A-ZÀ-ÿ][a-zÀ-ÿ]+)[\ ]?((de los )|(del ))?((([A-ZÀ-ÿ][a-zÀ-ÿ]+)[ ]?)+)?$/g;
        if (regex.test(value) === false) {
          throw new Error('Formato incorrecto');
        } else { return true; }
      }),
    body('codigo_est').notEmpty().withMessage('Esta vacío!')
      .custom(value => {
        const regex = /^[A-Z]{4}\-([0-2][0-9]|3[0-1])()(0[1-9]|1[0-2])\2(\d{2})\-\d{7}$/g;
        if (regex.test(value) === false) {
          throw new Error('Formato incorrecto');
        } else { return true; }
      }),
    body('cedula_est')
      .custom(value => {
        const regex = /^\d{3}\-([0-2][0-9]|3[0-1])()(0[1-9]|1[0-2])\2(\d{2})\-\d{4}\w$/g;
        if (regex.test(value) === false && value != "") {
          throw new Error('Formato de cédula incorrecto');
        } else { return true; }
      })
      // .custom(async (value, { req }) => {
      //   const cedula_tutor = await pool.query('select cedula from tutor where cedula = ?', value);
      //   if (req.body.id_tutor) {
      //     const id_tutor = req.body.id_tutor;
      //     const tutor = await pool.query(`select id_tutor
      //                                     from tutor where cedula = ? and id_tutor = ?`, [value, id_tutor]);
      //     if (cedula_tutor[0].length > 0 && tutor[0].length === 0) {
      //       throw new Error('Ya esta registrado!');
      //     } else { return true; }
      //   }
      // })
      .custom(async (value, { req }) => {
        if (value === req.body.cedula_tutor && value != "") {
          throw new Error('La cédula es igual a la del tutor!');
        } else { return true; }
      }),
    body('registroNac_est').notEmpty().withMessage('Esta vacío!')
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
    body('fechaNac_est').notEmpty().withMessage('Esta vacío ó incompleto!'),
    body('sexo_est').notEmpty().withMessage('Falta seleccionar!'),
    body('etnia_est').notEmpty().withMessage('Falta seleccionar!'),
    body('lengua_est').notEmpty().withMessage('Falta seleccionar!'),
    body('discapacidad_est').notEmpty().withMessage('Falta seleccionar!'),
    body('telefono_est')
      .custom(async (value, { req }) => {
        const regex = /^\d{2,4}-\d{2,4}-\d{2,4}$/g;
        if (regex.test(value) === false && value != "") {
          throw new Error('Solo número con 8 digitos!');
        } else { return true; }
    })
      .custom(async (value, { req }) => {
        if (value === req.body.telefono_tutor && value != "") {
          throw new Error('Este número es el mismo del tutor!');
        } else { return true; }
      }),
    body('lugarNac_est').notEmpty().withMessage('Esta vacío!'),
    body('nacionalidad_est').notEmpty().withMessage('Esta vacío!'),
    body('direccionDom_est').notEmpty().withMessage('Esta vacío!'),
    body('modalidad_est').notEmpty().withMessage('Falta seleccionar!'),
    body('nivel_est').notEmpty().withMessage('Falta seleccionar!'),
    body('grupo_nuevoIngreso').notEmpty().withMessage('Falta seleccionar!')
  ], (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.send({ errors: error.array({ onlyFirstError: true }), status: true });
    } else {
      res.send({ status: false });
    }
  });//Verifica el formulario del tutor y estudiante para su registro
router.post('/api/registrar', isLoggedIn, checkRol('Secretaria'), async (req, res) => {

  const tutor = [req.body.tutor.nombres, req.body.tutor.apellidos, req.body.tutor.cedula,
  req.body.tutor.correo_e, req.body.tutor.sexo, req.body.tutor.telefono, req.body.tutor.direccion];
  const estudiante = req.body.estudiante;

  const verif_cedula = await pool.query(`select cedula from tutor where cedula = ?`, req.body.tutor.cedula);

  var verif_RegistroNac = '';
  var aux = false;

  console.log(verif_cedula[0].length);

  for (let i = 0; i < estudiante.length; i++) {
    verif_RegistroNac = await pool.query(`select registroNac from estudiante where registroNac =?`, estudiante[i].registroNac);
    if (verif_RegistroNac && verif_RegistroNac[0].length > 0) {
      console.log(verif_RegistroNac[0].length);
      aux = true;
      break;
    }
  }

  if (verif_cedula && verif_cedula[0].length === 0 && aux === false) {
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
  } else {
    res.send({ success: false });
  }

});//Registramos todos los formularios
router.get('/api/estudiante_disponible', isLoggedIn, async (req, res) => {

  try {

    var { draw, start, length, order, columns, search } = req.query; //DesEstructuramos el request query

    //Buscador datos
    var search_value = search['value'].trim();
    var search_query = `
    AND (id_estudiante LIKE '%${search_value}%' 
    OR nombres_est LIKE '%${search_value}%' 
    OR apellidos_est LIKE '%${search_value}%'
    OR registroNac_est LIKE '%${search_value}%'
    OR cedula_tutor LIKE '%${search_value}%')`;
    //Número total de registros sin filtrar
    var [Data1] = await pool.query("SELECT COUNT(*) AS Total FROM vw_estudianteMatricula");
    var total_records = Data1[0].Total;

    //Número total de registros con filtrado
    var [Data2] = await pool.query(`SELECT COUNT(*) AS Total FROM vw_estudianteMatricula WHERE 1 ${search_query}`);
    var total_records_with_filter = Data2[0].Total;
    var query = `
            select * from vw_estudianteMatricula
            where 1 ${search_query}
            limit ${start}, ${length}`; //Integramos en la consulta los parametros de busqueda, utilizando el Search del datatable

    var data_arr = [];
    var [Data3] = await pool.query(query);
    Data3.forEach(function (row) {
      data_arr.push({
        'id_estudiante': row.id_estudiante,
        'nombres_est': row.nombres_est,
        'apellidos_est': row.apellidos_est,
        'registroNac_est': row.registroNac_est,
        'fechaNac_est': row.fechaNac_est.toLocaleDateString(),
        'sexo_est': row.sexo_est,
        'estado_est': row.estado_est,
        'fechaReg_est': row.fechaReg_est.toLocaleDateString(),
        'tutor': row.nombres_tutor + ' ' + row.apellidos_tutor,
        'id_tutor': row.id_tutor,
        'nombres_tutor': row.nombres_tutor,
        'apellidos_tutor': row.apellidos_tutor,
        'cedula_tutor': row.cedula_tutor,
        'correo_e_tutor': row.correo_e_tutor,
        'sexo_tutor': row.sexo_tutor,
        'telefono_tutor': row.telefono_tutor,
        'direccion_tutor': row.direccion_tutor,
        //'turno': row.turno
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
});//Metodo para buscar en tiempo real a los estudiantes disponibles para matricular
router.get('/api/tutor_disponible', isLoggedIn, checkRol('Secretaria'), async (req, res) => {

  try {

    var { draw, start, length, search } = req.query; //DesEstructuramos el request query

    //Buscador datos
    var search_value = search['value'].trim();
    var search_query = `
    AND (id_tutor LIKE '%${search_value}%' 
    OR nombres LIKE '%${search_value}%' 
    OR apellidos LIKE '%${search_value}%'
    OR cedula LIKE '%${search_value}%')`;
    //Número total de registros sin filtrar
    var [Data1] = await pool.query("SELECT COUNT(*) AS Total FROM vw_tutorRecientes");
    var total_records = Data1[0].Total;

    //Número total de registros con filtrado
    var [Data2] = await pool.query(`SELECT COUNT(*) AS Total FROM vw_tutorRecientes WHERE 1 ${search_query}`);
    var total_records_with_filter = Data2[0].Total;
    var query = `
            select * from vw_tutorRecientes
            where 1 ${search_query} 
            limit ${start}, ${length}`; //Integramos en la consulta los parametros de busqueda, utilizando el Search del datatable

    var data_arr = [];
    var [Data3] = await pool.query(query);
    Data3.forEach(function (row) {
      data_arr.push({
        'id_tutor': row.id_tutor,
        'nombres': row.nombres,
        'apellidos': row.apellidos,
        'cedula': row.cedula,
        'correo_e': row.correo_e,
        'sexo': row.sexo,
        'telefono': row.telefono,
        'direccion': row.direccion,
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
});//Metodo para buscar en tiempo real a los tutores
router.post('/api/mostrar_nivel', isLoggedIn, checkRol('Secretaria'), async (req, res) => {
  const id_modalidad = req.body.id_modalidad;
  const nivel_est = await pool.query(`select id_nivel, nombre from nivel where id_modalidad_fk = ${id_modalidad}`);
  res.send(nivel_est[0]);//Falta enviar turno Matutino o Vespertino!
})//Carga los niveles o grados mediante el id de la modalidad 
router.post('/api/mostrar_grupo', isLoggedIn, checkRol('Secretaria'), async (req, res) => {
  const id_nivel_grado = req.body.id_nivel_grado;
  const grupo_est = await pool.query(`select DG.id_detallegrupo, G.nombre from detallegrupo as DG 
                                      inner join nivel as N on DG.id_nivel_fk = N.id_nivel
                                      inner join grupo as G on DG.id_grupo_fk = G.id_grupo
                                      where DG.id_nivel_fk = ?`, id_nivel_grado);
  res.send(grupo_est[0]);
});//Metodo para mostrar los grupos disponibles
router.post('/api/matricula_reingreso', isLoggedIn, checkRol('Secretaria'), async (req, res) => {
  const { id_estudiante, grupo, correo_usuario } = req.body;
  const verif_matricula = await pool.query(`select M.id_matricula from matricula as M 
                                            inner join estudiante as E on M.id_estudiante_fk = E.id_estudiante
                                            inner join aniolectivo as AL on M.id_aniolectivo_fk = AL.id_aniolectivo
                                            where E.id_estudiante = ? and AL.anio = year(now());`, id_estudiante);
  if (verif_matricula[0].length > 0) {
    res.send({ success: false });
  } else {
    try {
      const id_aniolectivo = await pool.query(`select id_aniolectivo from aniolectivo where anio = year(now());`);
      const id_secretaria = await pool.query(`select id_usuario from usuario where correo_e = ?`, correo_usuario);
      await pool.query(`insert into matricula(id_estudiante_fk, id_aniolectivo_fk, id_usuario_fk, id_detallegrupo_fk)
                        values(?,?,?,?)`, [id_estudiante, id_aniolectivo[0][0].id_aniolectivo, id_secretaria[0][0].id_usuario, grupo]);
      res.send({ success: true });
    } catch (error) {
      console.log(error);
    }
  }
});//Metodo para matricula de reingreso
router.post('/api/matricula_nuevoingreso', isLoggedIn, checkRol('Secretaria'), async (req, res) => {
  const datosForm = req.body;
  const datos = [
    datosForm.nombres_tutor,//tutor
    datosForm.apellidos_tutor,
    datosForm.cedula_tutor,
    datosForm.correo_e_tutor,
    datosForm.sexo_tutor,
    datosForm.telefono_tutor,
    datosForm.direccion_tutor,
    datosForm.nombres_est,//Estudiante
    datosForm.apellidos_est,
    datosForm.registroNac_est,
    datosForm.fechaNac_est,
    datosForm.sexo_est,
    datosForm.grupo_nuevoIngreso,
    datosForm.correo_usuario,
    datosForm.aux
  ];
  const verif_matricula = await pool.query(`select M.id_matricula from matricula as M 
                                            inner join estudiante as E on M.id_estudiante_fk = E.id_estudiante
                                            inner join aniolectivo as AL on M.id_aniolectivo_fk = AL.id_aniolectivo
                                            where E.registroNac = ? and AL.anio = year(now());`, datosForm.registroNac_est);
  if (verif_matricula[0].length > 0) {
    res.send({ success: false });
  } else {
    try {
      await pool.query('call sp_matriculaNuevoIngreso(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', datos);
      res.send({ success: true });
    } catch (error) {
      console.log(error);
    }
  }
});//Metodo para matricular
router.get('/api/matriculas_recientes', isLoggedIn, checkRol('Secretaria'), async (req, res) => {

  try {

    var { draw, start, length, search } = req.query; //DesEstructuramos el request query

    //Buscador datos
    var search_value = search['value'].trim();
    var search_query = `
    AND (id_matricula LIKE '%${search_value}%' 
    OR nombres_est LIKE '%${search_value}%' 
    OR apellidos_est LIKE '%${search_value}%'
    OR registroNac_est LIKE '%${search_value}%'
    OR cedula_tutor LIKE '%${search_value}%')`;
    //Número total de registros sin filtrar
    var [Data1] = await pool.query("SELECT COUNT(*) AS Total FROM vw_matriculaReciente");
    var total_records = Data1[0].Total;

    //Número total de registros con filtrado
    var [Data2] = await pool.query(`SELECT COUNT(*) AS Total FROM vw_matriculaReciente WHERE 1 ${search_query}`);
    var total_records_with_filter = Data2[0].Total;
    var query = `
            select * from vw_matriculaReciente
            where 1 ${search_query} 
            limit ${start}, ${length}`; //Integramos en la consulta los parametros de busqueda, utilizando el Search del datatable

    var data_arr = [];
    var [Data3] = await pool.query(query);
    Data3.forEach(function (row) {
      data_arr.push({
        'id_matricula': row.id_matricula,
        'nombres_est': row.nombres_est,
        'apellidos_est': row.apellidos_est,
        'registroNac_est': row.registroNac_est,
        'fechaNac_est': row.fechaNac_est.toLocaleDateString(),
        'sexo_est': row.sexo_est,
        'nivel_est': row.nivel_est,
        'nombres_tutor': row.nombres_tutor,
        'apellidos_tutor': row.apellidos_tutor,
        'cedula_tutor': row.cedula_tutor,
        'correo_e_tutor': row.correo_e_tutor,
        'sexo_tutor': row.sexo_tutor,
        'telefono_tutor': row.telefono_tutor,
        'direccion_tutor': row.direccion_tutor,
        'nivel_grado': row.nivel_grado,
        'modalidad': row.modalidad,
        'id_grupo': row.id_grupo,
        'grupo': row.grupo,
        'fecha': row.fecha.toLocaleDateString(),
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
    console.log(error);
  }
});//Metodo para buscar las matriculas recientes en tiempo real
router.post('/api/eliminar_matricula', isLoggedIn, checkRol('Secretaria'), async (req, res) => {
  try {
    const id_matricula = req.body.id_matricula; //Falta validar que no tenga notas registradas en el año actual
    await pool.query('DELETE FROM matricula WHERE id_matricula = ?', id_matricula);
    res.send({ success: true });
  } catch (error) {
    console.log(error);
    res.send({ success: false });
  }
});//Metodo para eliminar la matricula seleccionada
router.post('/api/editar_matricula', isLoggedIn, checkRol('Secretaria'), async (req, res) => {
  const datos_matriculaEdit = req.body;
  const datos = [
    datos_matriculaEdit.id_grupo,
    datos_matriculaEdit.id_matricula
  ];
  try {
    await pool.query(`UPDATE matricula SET id_detallegrupo_fk = ? WHERE id_matricula = ?`, datos);
    res.send({ success: true });
  } catch (error) {
    console.log(error);
    res.send({ success: false });
  }
});//Metodo para eliminar la matricula seleccionada

router.post('/api/verificar_estudianteTutorEdit', isLoggedIn,
  [
    body('nombres_tutor').notEmpty().withMessage('Esta vacío!')
      .custom(value => {
        const regex = /^([A-ZÀ-ÿ][a-zÀ-ÿ]+)[\ ]?((de los )|(del ))?((([A-ZÀ-ÿ][a-zÀ-ÿ]+)[ ]?)+)?$/g;
        if (regex.test(value) === false) {
          throw new Error('Formato incorrecto');
        } else { return true; }
      }),
    body('apellidos_tutor').notEmpty().withMessage('Esta vacío!')
      .custom(value => {
        const regex = /^([A-ZÀ-ÿ][a-zÀ-ÿ]+)[\ ]?((de los )|(del ))?((([A-ZÀ-ÿ][a-zÀ-ÿ]+)[ ]?)+)?$/g;
        if (regex.test(value) === false) {
          throw new Error('Formato incorrecto');
        } else { return true; }
      }),
    body('correo_e_tutor').notEmpty().withMessage('Esta vacío!')
      .isEmail().withMessage('Este no es un Email')
      .custom(async (value, { req }) => {
        const correo_e_tutor = await pool.query('select correo_e from tutor where correo_e = ?', value);
        if (req.body.id_tutor) {
          const id_tutor = req.body.id_tutor;
          const tutor = await pool.query(`select id_tutor
                                          from tutor where correo_e = ? and id_tutor = ?`, [value, id_tutor]);
          if (correo_e_tutor[0].length > 0 && tutor[0].length === 0) {
            throw new Error('Ya esta registrado!');
          } else { return true; }
        } else if (correo_e_tutor[0] > 0) {
          throw new Error('Ya esta registrado!');
        } else { return true; }
      }),
    body('cedula_tutor').notEmpty().withMessage('Esta vacío!')
      .custom(value => {
        const regex = /^\d{3}\-([0-2][0-9]|3[0-1])()(0[1-9]|1[0-2])\2(\d{2})\-\d{4}\w$/g;
        if (regex.test(value) === false) {
          throw new Error('Formato de cédula incorrecto');
        } else { return true; }
      })
      .custom(async (value, { req }) => {
        const cedula_tutor = await pool.query('select cedula from tutor where cedula = ?', value);
        if (req.body.id_tutor) {
          const id_tutor = req.body.id_tutor;
          const tutor = await pool.query(`select id_tutor
                                          from tutor where cedula = ? and id_tutor = ?`, [value, id_tutor]);
          if (cedula_tutor[0].length > 0 && tutor[0].length === 0) {
            throw new Error('Ya esta registrado!');
          } else { return true; }
        }
      }),
    body('sexo_tutor').notEmpty().withMessage('Falta seleccionar!'),
    body('telefono_tutor').notEmpty().withMessage('Esta vacío!')
      .isInt().withMessage('Solo se aceptan numeros enteros')
      .isLength({ min: 8 }).withMessage('Tiene que ingresar 8 digitos')
      .custom(async (value, { req }) => {
        const telefono_tutor = await pool.query('select telefono from tutor where telefono= ?', value);
        if (req.body.id_tutor) {
          const id_tutor = req.body.id_tutor;
          const tutor = await pool.query(`select id_tutor
                                          from tutor where telefono = ? and id_tutor = ?`, [value, id_tutor]);
          if (telefono_tutor[0].length > 0 && tutor[0].length === 0) {
            throw new Error('Ya esta registrado!');
          } else { return true; }
        } else if (telefono_tutor[0] > 0) {
          throw new Error('Ya esta registrado!');
        } else { return true; }
      }),
    body('direccion_tutor').notEmpty().withMessage('Esta vacío!'),

    body('nombres_est').notEmpty().withMessage('Esta vacío!')
      .custom(value => {
        const regex = /^([A-ZÀ-ÿ][a-zÀ-ÿ]+)[\ ]?((de los )|(del ))?((([A-ZÀ-ÿ][a-zÀ-ÿ]+)[ ]?)+)?$/g;
        if (regex.test(value) === false) {
          throw new Error('Formato incorrecto');
        } else { return true; }
      }),
    body('apellidos_est').notEmpty().withMessage('Esta vacío!')
      .custom(value => {
        const regex = /^([A-ZÀ-ÿ][a-zÀ-ÿ]+)[\ ]?((de los )|(del ))?((([A-ZÀ-ÿ][a-zÀ-ÿ]+)[ ]?)+)?$/g;
        if (regex.test(value) === false) {
          throw new Error('Formato incorrecto');
        } else { return true; }
      }),
    body('registroNac_est').notEmpty().withMessage('Esta vacío!')
      .custom(value => {
        const regex = /^\d{2,4}-\d{2,4}-\d{2,4}$/g;
        if (regex.test(value) === false) {
          throw new Error('Formato incorrecto');
        } else { return true; }
      })
      .custom(async (value, { req }) => {
        const searchRegistroNac = await pool.query('select registroNac from estudiante where registroNac = ?', value);
        if (req.body.id_estudiante) {
          const id_estudiante = req.body.id_estudiante;
          const estudiante = await pool.query(`select id_estudiante
                                               from estudiante where registroNac = ? and id_estudiante = ?`, [value, id_estudiante]);
          if (searchRegistroNac[0].length > 0 && estudiante[0].length === 0) {
            throw new Error('Ya esta registrado!');
          } else { return true; }
        } else if (searchRegistroNac[0].length > 0) {
          throw new Error('Ya esta registrado!');
        } else { return true; }
      }),
    body('fechaNac_est').notEmpty().withMessage('Esta vacío ó incompleto!'),
    body('sexo_est').notEmpty().withMessage('Falta seleccionar!'),
  ], (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.send({ errors: error.array({ onlyFirstError: true }), status: true });
    } else {
      res.send({ status: false });
    }
  });//Verifica el formulario del tutor y estudiante para su registro
router.post('/api/editar_estudianteTutor', isLoggedIn, async (req, res) => {
  const datosForm = req.body;
  const datosTutor = [
    datosForm.nombres_tutor,//tutor
    datosForm.apellidos_tutor,
    datosForm.cedula_tutor,
    datosForm.correo_e_tutor,
    datosForm.sexo_tutor,
    datosForm.telefono_tutor,
    datosForm.direccion_tutor,
    datosForm.id_tutor
  ];
  const datosEstudiante = [
    datosForm.nombres_est,//Estudiante
    datosForm.apellidos_est,
    datosForm.registroNac_est,
    datosForm.fechaNac_est,
    datosForm.sexo_est,
    datosForm.id_estudiante
  ];
  try {
    await pool.query(`UPDATE tutor SET nombres = ?, apellidos = ? , cedula = ? , 
                      correo_e = ? , sexo = ? , telefono = ?,
                      direccion = ? WHERE id_tutor = ?`, datosTutor);
    await pool.query(`UPDATE estudiante SET nombres = ?, apellidos = ? , registroNac = ? , 
                        fechaNac = ? , sexo = ? WHERE id_estudiante = ?`, datosEstudiante);
    res.send({ success: true });
  } catch (error) {
    console.log(error);
  }
});//funcion para editar al estudiante y tutor en simultaneo
router.post('/api/inactivar_estudiante', isLoggedIn, async (req, res) => {
  try {
    const id_estudiante = req.body.id_estudiante; //Falta validar que no tenga notas registradas en el año actual
    await pool.query("UPDATE estudiante SET estado = 'Inactivo' WHERE id_estudiante = ?", id_estudiante);
    res.send({ success: true });
  } catch (error) {
    console.log(error);
    res.send({ success: false });
  }
});
router.post('/api/activar_estudiante', isLoggedIn, async (req, res) => {
  try {
    const id_estudiante = req.body.id_estudiante; //Falta validar que no tenga notas registradas en el año actual
    await pool.query("UPDATE estudiante SET estado = 'Activo' WHERE id_estudiante = ?", id_estudiante);
    res.send({ success: true });
  } catch (error) {
    console.log(error);
    res.send({ success: false });
  }
});

//Api
export default router;