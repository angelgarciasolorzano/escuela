import express from "express";
import { isLoggedIn, checkRol } from "../../lib/middleware/auth.js";
import pool from "../../database.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

//TODO Rutas de Perfiles (Administrador)
//*Enviando la vista para el perfil de administrador
router.get('/administrador', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  const contCard = await pool.query(`call sp_contPerfilAdmin()`);
  const value = contCard[0][0][0];
  res.render('interface/client/administrador/perfiladmin', { c_estudiante: value.c_estudiante, c_profesor: value.c_profesor, c_detallegrupo: value.c_detallegrupo, c_usuario: value.c_usuario });
});
router.get('/administrador/usuario', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  const [rol] = await pool.query('SELECT id_rol, nombre_rol FROM rol');
  res.render('interface/client/administrador/usuario', { rol: rol });
});
router.get('/administrador/estudiante/datos_personales', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  res.render('interface/client/administrador/datosP_estudiante');
});//Cargar plantilla Datos Personales estudiante
router.get('/administrador/profesor/grupo_guia', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  res.render('interface/client/administrador/grupoGuia');
});//Rutar para renderizar mi opcion asignar grupo guia
router.get('/administrador/profesor/materias_profe', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  res.render('interface/client/administrador/materiasProfe');
});//Rutar para renderizar mi opcion asignar las materias del profesor
router.get('/administrador/grupo/asignar_materias', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  res.render('interface/client/administrador/grupoProfeMaterias');
});//Rutar para renderizar mi opcion asignar materias
router.get('/administrador/academico/materias', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  res.render('interface/client/administrador/materias');
});//Rutar para renderizar mi opcion asignar materias

//api Profesor
router.get('/api/mostrar_profesor', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  try {
    const profesor = await pool.query(`select id_usuario, CONCAT(U.nombres,' ', U.apellidos) as Profesor 
                                      from usuario as U inner join rol as R on U.id_rol_fk = R.id_rol
                                      where R.nombre_rol = 'Profesor'`);
    console.log(profesor[0]);
    res.send(profesor[0]);
  } catch (error) {
    res.status(500).send('Error 500');
    console.log(error);
  }
});//Metodo para mostrar la materias recientes
router.post('/api/asignar_profeMateria', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  const { id_profesores, id_materia } = req.body;
  try {
    const verif_profeMateria = await pool.query(`select id_profesor_materia from profesor_materia 
                                                 where id_usuario_fk = ? and id_materia_fk = ? `, [id_profesores, id_materia]);
    if (verif_profeMateria[0].length > 0) {
      res.send({ success: false });
    } else {
      await pool.query(`insert into profesor_materia(id_usuario_fk, id_materia_fk) 
                      values (?,?)`, [id_profesores, id_materia]);
      res.send({ success: true });
    }
  } catch (error) {
    console.log(error);
  }
});//Metodo para asignar a los profesores su materia
router.post('/api/eliminar_profeMateria', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  const { id_profesor_materia } = req.body;
  try {
    await pool.query(`DELETE from profesor_materia where id_profesor_materia = ?`, id_profesor_materia);
    res.send({ success: true });
  } catch (error) {
    res.send({ success: false })
  }
});//Metodo para eliminar a los profesores su materia

router.get('/api/mostrar_profeMateria_reciente', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  try {

    var { draw, search } = req.query; //DesEstructuramos el request query

    //Buscador datos
    var search_value = search['value'].trim();
    var search_query = `
    AND (id_usuario LIKE '%${search_value}%'
    OR Profesor LIKE '%${search_value}%'
    OR Materia LIKE '%${search_value}%')`;
    //Número total de registros sin filtrar
    var [Data1] = await pool.query("SELECT COUNT(*) AS Total FROM vw_mostrarProfeMateria");
    var total_records = Data1[0].Total;

    //Número total de registros con filtrado
    var [Data2] = await pool.query(`SELECT COUNT(*) AS Total FROM vw_mostrarProfeMateria WHERE 1 ${search_query}`);
    var total_records_with_filter = Data2[0].Total;
    var query = `
            select * from vw_mostrarProfeMateria
            where 1 ${search_query}
            group by id_profesor_materia`; //Integramos en la consulta los parametros de busqueda, utilizando el Search del datatable

    var data_arr = [];
    var [Data3] = await pool.query(query);
    Data3.forEach(function (row) {
      data_arr.push({
        'id_profesor_materia': row.id_profesor_materia,
        'id_profesor': row.id_usuario,
        'Profesor': row.Profesor,
        'id_materia': row.id_materia,
        'Materia': row.Materia
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
});//Metodo para mostrar a los profesores su materia

router.get('/api/mostrar_gruposGuia', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  const grupo_guia = await pool.query(`call sp_mostrarGruposGuia`);
  res.send(grupo_guia[0][0]);
});//Metodo para mostrar los grupos disponibles
router.get('/api/mostrar_profesorGuia', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  const profesor_guia = await pool.query(`call sp_mostrarProfesorGuia`);
  res.send(profesor_guia[0][0]);
});//Metodo para mostrar los profesores disponibles
router.post('/api/asignar_gruposGuia', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  const { id_grupos, id_profesores } = req.body;
  try {
    await pool.query(`update detallegrupo set id_usuario_fk = ? 
                      where id_detallegrupo = ?`, [id_profesores, id_grupos]);
    res.send({ success: true });
  } catch (error) {
    console.log(error);
  }
});//Metodo para asignar los profesores disponibles
router.post('/api/eliminar_gruposGuia', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  const { id_detallegrupo } = req.body;
  const id_profesor = null;
  try {
    await pool.query(`update detallegrupo set id_usuario_fk = ? 
                      where id_detallegrupo = ?`, [id_profesor, id_detallegrupo]);
    res.send({ success: true });
  } catch (error) {
    console.log(error);
  }
});//Metodo para eliminar los profesores asignados
router.get('/api/gruposGuia_recientes', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  try {

    var { draw, search } = req.query; //DesEstructuramos el request query

    //Buscador datos
    var search_value = search['value'].trim();
    var search_query = `
    AND (id_detallegrupo LIKE '%${search_value}%' 
    OR Grupo LIKE '%${search_value}%'
    OR Profesor LIKE '%${search_value}%')`;
    //Número total de registros sin filtrar
    var [Data1] = await pool.query("SELECT COUNT(*) AS Total FROM vw_mostrarGruposGuiaAsignados");
    var total_records = Data1[0].Total;

    //Número total de registros con filtrado
    var [Data2] = await pool.query(`SELECT COUNT(*) AS Total FROM vw_mostrarGruposGuiaAsignados WHERE 1 ${search_query}`);
    var total_records_with_filter = Data2[0].Total;
    var query = `
            select * from vw_mostrarGruposGuiaAsignados
            where 1 ${search_query}
            group by id_detallegrupo`; //Integramos en la consulta los parametros de busqueda, utilizando el Search del datatable

    var data_arr = [];
    var [Data3] = await pool.query(query);
    Data3.forEach(function (row) {
      data_arr.push({
        'id_detallegrupo': row.id_detallegrupo,
        'Grupo': row.Grupo,
        'id_profesor': row.id_usuario,
        'Profesor': row.Profesor
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
});//Metodo para mostrar los profesores guias añadido recientemente
//api Profesor

//api Grupos
router.post('/api/mostrar_profeGuia', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  const {id_grupo} = req.body;
  try {
    const profesor = await pool.query(`select U.id_usuario, CONCAT(U.nombres, ' ', U.apellidos) as Profesor
	                                    from usuario as U
	                                    inner join rol as R on U.id_rol_fk = R.id_rol
	                                    inner join detallegrupo DG on DG.id_usuario_fk = U.id_usuario
	                                    where DG.id_detallegrupo = ? and R.nombre_rol = 'Profesor'`,[id_grupo]);
    console.log(profesor[0]);
    res.send(profesor[0]);
  } catch (error) {
    res.status(500).send('Error 500');
    console.log(error);
  }
});//Metodo para mostrar la materias recientes

router.post('/api/mostrar_profeGuiaMateria', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  const {id_usuario} = req.body;
  try {
    const profe_materia = await pool.query(`select CONCAT(U.nombres, ' ', U.apellidos) as Profesor, M.nombre as Materia
                                        from profesor_materia as PM
                                        inner join usuario as U on PM.id_usuario_fk = U.id_usuario
                                        inner join materia as M on PM.id_materia_fk = M.id_materia
                                        where U.id_usuario = ?`,[id_usuario]);
    res.send(profe_materia[0]);
  } catch (error) {
    res.status(500).send('Error 500');
    console.log(error);
  }
});//Metodo para mostrar la materias recientes
router.get('/api/mostrar_detalleGrupo', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  const detallegrupo = await pool.query(`call sp_mostrarDetallegrupo`);
  console.log(detallegrupo[0][0]);
  res.send(detallegrupo[0][0]);
});//Metodo para mostrar los profesores disponibles
router.post('/api/mostrar_profeMateria', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  const { id_materia } = req.body;
  try {
    const profesorMateria = await pool.query(`select * from vw_mostrarProfeMateria
                                        where id_materia = ?`, [id_materia]);
    console.log(profesorMateria[0]);
    res.send(profesorMateria[0]);
  } catch (error) {
    res.status(500).send('Error 500');
    console.log(error);
  }
});//Metodo para mostrar la materias recientes
router.post('/api/asignar_gruposProfeMate', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  const { id_grupos, id_materia, id_profesor } = req.body;
  try {
    const verif_grupoProfeMateria = await pool.query(`select GPM.id_grupo_profeMateria, PM.id_profesor_materia, M.id_materia, M.nombre as Materia from grupo_profeMateria as GPM
inner join profesor_materia as PM on GPM.id_profesor_materia_fk = PM.id_profesor_materia
inner join materia as M on PM.id_materia_fk = M.id_materia
where GPM.id_detallegrupo_fk = ? and M.id_materia = ?`, [id_grupos, id_materia]);
    if (verif_grupoProfeMateria[0].length > 0) {
      res.send({ success: false });
    } else {
      await pool.query(`insert into grupo_profeMateria(id_detallegrupo_fk, id_profesor_materia_fk)
                      values (?,?)`, [id_grupos, id_profesor]);
      res.send({ success: true });
    }
  } catch (error) {
    console.log(error);
  }
});//Metodo para asignar los profesores disponibles
router.post('/api/eliminar_grupoProfeMate', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  const { id_grupo_profeMateria } = req.body;
  try {
    await pool.query(`DELETE from grupo_profeMateria where id_grupo_profeMateria = ?`, id_grupo_profeMateria);
    res.send({ success: true });
  } catch (error) {
    res.send({ success: false })
  }
});//Metodo para eliminar a los profesores su materia
router.get('/api/gruposProfeMate_recientes', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  try {

    var { draw, search } = req.query; //DesEstructuramos el request query

    //Buscador datos
    var search_value = search['value'].trim();
    var search_query = `
    AND (id_detallegrupo LIKE '%${search_value}%' 
    OR Grupo LIKE '%${search_value}%'
    OR Profesor LIKE '%${search_value}%'
    OR Materia LIKE '%${search_value}%')`;
    //Número total de registros sin filtrar
    var [Data1] = await pool.query("SELECT COUNT(*) AS Total FROM vw_grupoProfeMateRecientes");
    var total_records = Data1[0].Total;

    //Número total de registros con filtrado
    var [Data2] = await pool.query(`SELECT COUNT(*) AS Total FROM vw_grupoProfeMateRecientes WHERE 1 ${search_query}`);
    var total_records_with_filter = Data2[0].Total;
    var query = `
            select * from vw_grupoProfeMateRecientes
            where 1 ${search_query}
            group by id_grupo_profeMateria`; //Integramos en la consulta los parametros de busqueda, utilizando el Search del datatable

    var data_arr = [];
    var [Data3] = await pool.query(query);
    Data3.forEach(function (row) {
      data_arr.push({
        'id_grupo_profeMateria': row.id_grupo_profeMateria,
        'id_detallegrupo': row.id_detallegrupo,
        'Grupo': row.Grupo,
        'id_profesor': row.id_usuario,
        'Profesor': row.Profesor,
        'id_materia': row.id_materia,
        'Materia': row.Materia
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
});//Metodo para mostrar los profesores guias añadido recientemente
//api Grupos

//api Usuario
router.post('/api/verificar_usuario', isLoggedIn, checkRol('Administrador'),
  [
    body('nombres_usuario').notEmpty().withMessage('Esta vacío!')
      .custom(value => {
        const regex = /^([A-ZÀ-ÿ][a-zÀ-ÿ]+)[\ ]?((de los )|(del ))?((([A-ZÀ-ÿ][a-zÀ-ÿ]+)[ ]?)+)?$/g;
        if (regex.test(value) === false) {
          throw new Error('Formato incorrecto');
        } else { return true; }
      }),
    body('apellidos_usuario').notEmpty().withMessage('Esta vacío!')
      .custom(value => {
        const regex = /^([A-ZÀ-ÿ][a-zÀ-ÿ]+)[\ ]?((de los )|(del ))?((([A-ZÀ-ÿ][a-zÀ-ÿ]+)[ ]?)+)?$/g;
        if (regex.test(value) === false) {
          throw new Error('Formato incorrecto');
        } else { return true; }
      }),
    body('correo_e_usuario').notEmpty().withMessage('Esta vacío!')
      .isEmail().withMessage('Este no es un Email')
      .custom(async (value, { req }) => {
        const correo_usuario = await pool.query('select correo_e from usuario where correo_e = ?', value);
        if (req.body.id_usuario_edit) {
          const id_usuario_edit = req.body.id_usuario_edit;
          console.log(id_usuario_edit);
          const usuario_edit = await pool.query(`select id_usuario
                                               from usuario where correo_e = ? and id_usuario = ?`, [value, id_usuario_edit]);
          if (correo_usuario[0].length > 0 && usuario_edit[0].length === 0) {
            throw new Error('Ya esta registrado!');
          } else { return true; }
        } else if (correo_usuario[0].length > 0) {
          throw new Error('Ya esta registrado!');
        } else { return true; }
      }),
    body('cedula_usuario').notEmpty().withMessage('Esta vacío!')
      .custom(value => {
        const regex = /^\d{3}\-([0-2][0-9]|3[0-1])()(0[1-9]|1[0-2])\2(\d{2})\-\d{4}\w$/g;
        if (regex.test(value) === false) {
          throw new Error('Formato de cédula incorrecto');
        } else { return true; }
      })
      .custom(async (value, { req }) => {
        const cedula_usuario = await pool.query('select cedula from usuario where cedula = ?', value);
        if (req.body.id_usuario_edit) {
          const id_usuario_edit = req.body.id_usuario_edit;
          const usuario_edit = await pool.query(`select id_usuario
                                               from usuario where cedula = ? and id_usuario = ?`, [value, id_usuario_edit]);
          if (cedula_usuario[0].length > 0 && usuario_edit[0].length === 0) {
            throw new Error('Ya esta registrado!');
          } else { return true; }
        } else if (cedula_usuario[0].length > 0) {
          throw new Error('Ya esta registrado!');
        } else { return true; }
      }),
    body('sexo_usuario').notEmpty().withMessage('Falta seleccionar!'),
    body('telefono_usuario').notEmpty().withMessage('Esta vacío!')
      .isInt().withMessage('Solo se aceptan numeros enteros')
      .isLength({ min: 8 }).withMessage('Tiene que ingresar 8 digitos')
      .custom(async (value, { req }) => {
        const telefono_usuario = await pool.query('select telefono from usuario where telefono= ?', value);
        if (req.body.id_usuario_edit) {
          const id_usuario_edit = req.body.id_usuario_edit;
          console.log(id_usuario_edit);
          const usuario_edit = await pool.query(`select id_usuario
                                               from usuario where telefono = ? and id_usuario = ?`, [value, id_usuario_edit]);
          if (telefono_usuario[0].length > 0 && usuario_edit[0].length === 0) {
            throw new Error('Ya esta registrado!');
          } else { return true; }
        } else if (telefono_usuario[0].length > 0) {
          throw new Error('Ya esta registrado!');
        } else { return true; }
      }),
    body('direccion_usuario').notEmpty().withMessage('Esta vacío!'),
    body('contrasena_usuario').notEmpty().withMessage('Esta vacío!'),
    body('rol_usuario').notEmpty().withMessage('Falta seleccionar!')
  ], (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.send({ errors: error.array({ onlyFirstError: true }), status: true });
    } else {
      res.send({ status: false });
    }
  });//Verifica el formulario usuario para su registro
router.post('/api/registrar_usuario', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  const { cedula_usuario } = req.body;
  const datosForm = req.body;
  const datos = [
    datosForm.nombres_usuario,//usuario
    datosForm.apellidos_usuario,
    datosForm.cedula_usuario,
    datosForm.correo_e_usuario,
    datosForm.contrasena_usuario,
    datosForm.sexo_usuario,
    datosForm.telefono_usuario,
    datosForm.direccion_usuario,
    datosForm.rol_usuario];
  const verif_usuario = await pool.query(`select id_usuario from usuario 
                                            where cedula = ?`, cedula_usuario);
  if (verif_usuario[0].length > 0) {
    res.send({ success: false });
  } else {
    try {
      await pool.query(`insert into usuario(nombres, apellidos, cedula, correo_e, contrasena, sexo, telefono, direccion, id_rol_fk) values(?,?,?,?,?,?,?,?,?)`, datos);
      res.send({ success: true });
    } catch (error) {
      console.log(error);
    }
  }
});//Metodo para ingresar usuarios
router.post('/api/editar_usuario', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  const { cedula_usuario, id_usuario_edit } = req.body
  const datosForm = req.body;
  const datos = [
    datosForm.nombres_usuario, datosForm.apellidos_usuario, datosForm.cedula_usuario,
    datosForm.correo_e_usuario, datosForm.contrasena_usuario, datosForm.sexo_usuario,
    datosForm.telefono_usuario, datosForm.direccion_usuario, datosForm.rol_usuario, datosForm.id_usuario_edit];

  console.log(datosForm);
  const usuario_ = await pool.query(`select id_usuario from usuario 
                                    where cedula = ?`,
    cedula_usuario);
  const usuario_modif = await pool.query(`select id_usuario from usuario 
                                          where cedula = ? and id_usuario = ?`,
    [cedula_usuario, id_usuario_edit]);
  if (usuario_modif[0].length === 0 && usuario_[0].length >= 1) {
    res.send({ success: false });
  } else {
    try {
      await pool.query(`UPDATE usuario SET nombres = ?, apellidos = ? , cedula = ? , 
                        correo_e = ? , contrasena = ?, sexo = ? , telefono = ?,
                        direccion = ?,  id_rol_fk = ? WHERE id_usuario = ?`, datos);
      res.send({ success: true });
    } catch (error) {
      console.log(error);
    }
  }
});//Metodo para eliminar la usuario seleccionada
router.post('/api/bloquear_usuario', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  try {
    const id_usuario = req.body.id_usuario; //Falta validar que no tenga notas registradas en el año actual
    await pool.query("UPDATE usuario SET estado = 'Bloqueado' WHERE id_usuario = ?", id_usuario);
    res.send({ success: true });
  } catch (error) {
    console.log(error);
    res.send({ success: false });
  }
});//Metodo para eliminar la usuario seleccionada
router.post('/api/activar_usuario', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  try {
    const id_usuario = req.body.id_usuario; //Falta validar que no tenga notas registradas en el año actual
    await pool.query("UPDATE usuario SET estado = 'Activo' WHERE id_usuario = ?", id_usuario);
    res.send({ success: true });
  } catch (error) {
    console.log(error);
    res.send({ success: false });
  }
});//Metodo para eliminar la usuario seleccionada
router.get('/api/usuarios_recientes', isLoggedIn, checkRol('Administrador'), async (req, res) => {

  try {

    var { draw, start, length, search } = req.query; //DesEstructuramos el request query

    //Buscador datos
    var search_value = search['value'].trim();
    var search_query = `
    AND (id_usuario LIKE '%${search_value}%' 
    OR nombres LIKE '%${search_value}%' 
    OR apellidos LIKE '%${search_value}%'
    OR cedula LIKE '%${search_value}%'
    OR nombre_rol LIKE '%${search_value}%')`;
    //Número total de registros sin filtrar
    var [Data1] = await pool.query("SELECT COUNT(*) AS Total FROM vw_usuarioReciente");
    var total_records = Data1[0].Total;

    //Número total de registros con filtrado
    var [Data2] = await pool.query(`SELECT COUNT(*) AS Total FROM vw_usuarioReciente WHERE 1 ${search_query}`);
    var total_records_with_filter = Data2[0].Total;
    var query = `
            select * from vw_usuarioReciente
            where 1 ${search_query} 
            limit ${start}, ${length}`; //Integramos en la consulta los parametros de busqueda, utilizando el Search del datatable

    var data_arr = [];
    var [Data3] = await pool.query(query);
    Data3.forEach(function (row) {
      data_arr.push({
        'id_usuario': row.id_usuario,
        'nombres_usuario': row.nombres,
        'apellidos_usuario': row.apellidos,
        'cedula_usuario': row.cedula,
        'correo_e_usuario': row.correo_e,
        'contrasena_usuario': row.contrasena,
        'sexo_usuario': row.sexo,
        'telefono_usuario': row.telefono,
        'direccion_usuario': row.direccion,
        'id_rol_usuario': row.id_rol,
        'rol_usuario': row.nombre_rol,
        'estado_usuario': row.estado
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
});//Metodo para buscar los usuarios recientes en tiempo real

//api Academico
router.post('/api/agregar_materia', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  const { nombre_materia } = req.body;
  const verif_materia = await pool.query(`select id_materia from materia
                                            where nombre = ?`, nombre_materia);
  if (verif_materia[0].length > 0) {
    res.send({ success: false });
  } else {
    try {
      await pool.query(`insert into materia(nombre) values(?)`, nombre_materia);
      res.send({ success: true });
    } catch (error) {
      console.log(error);
    }
  }
});//Metodo para ingresar materias
router.post('/api/editar_materia', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  const datosMateria = [req.body.nombre_materia, req.body.id_materia];
  console.log(datosMateria);
  try {
    await pool.query(`UPDATE materia SET nombre = ? WHERE id_materia = ?`, datosMateria);
    res.send({ success: true });
  } catch (error) {
    res.send({ success: false })
  }
});//Metodo para eliminar materias
router.post('/api/eliminar_materia', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  const { id_materia } = req.body;
  try {
    await pool.query(`DELETE from materia where id_materia = ?`, id_materia);
    res.send({ success: true });
  } catch (error) {
    res.send({ success: false })
  }
});//Metodo para eliminar materias
router.get('/api/materias_recientes', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  try {

    var { draw, start, length, search } = req.query; //DesEstructuramos el request query

    //Buscador datos
    var search_value = search['value'].trim();
    var search_query = `
    AND (id_materia LIKE '%${search_value}%' 
    OR nombre LIKE '%${search_value}%')`;
    //Número total de registros sin filtrar
    var [Data1] = await pool.query("SELECT COUNT(*) AS Total FROM materia");
    var total_records = Data1[0].Total;

    //Número total de registros con filtrado
    var [Data2] = await pool.query(`SELECT COUNT(*) AS Total FROM materia WHERE 1 ${search_query}`);
    var total_records_with_filter = Data2[0].Total;
    var query = `
            select * from materia
            where 1 ${search_query}
            group by id_materia
            order by fechaReg desc 
            limit ${start}, ${length}`; //Integramos en la consulta los parametros de busqueda, utilizando el Search del datatable

    var data_arr = [];
    var [Data3] = await pool.query(query);
    Data3.forEach(function (row) {
      data_arr.push({
        'id_materia': row.id_materia,
        'nombre_materia': row.nombre,
        'fechaReg': row.fechaReg.toLocaleDateString()
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
});//Metodo para mostrar la materias recientes
router.get('/api/mostrar_materias', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  try {
    const materia = await pool.query(`select * from materia`);
    res.send(materia[0]);
  } catch (error) {
    res.status(500).send('Error 500');
    console.log(error);
  }
});//Metodo para mostrar la materias recientes

export default router;