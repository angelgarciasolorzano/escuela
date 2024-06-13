import express from "express";
import { isLoggedIn, checkRol } from "../../lib/middleware/auth.js";
import pool from "../../database.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

//TODO Rutas de Perfiles (Administrador)
//*Enviando la vista para el perfil de administrador
router.get('/administrador', isLoggedIn, checkRol('Administrador'), (req, res) => {
  res.render('interface/client/administrador/perfiladmin');
});
router.get('/administrador/usuario', isLoggedIn, checkRol('Administrador'), async (req, res) => {
  const [rol] = await pool.query('SELECT id_rol, nombre_rol FROM rol');
  res.render('interface/client/administrador/usuario', { rol: rol });
});
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
        if(req.body.id_usuario_edit) {
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
        if(req.body.id_usuario_edit) {
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
        if(req.body.id_usuario_edit) {
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
  const { cedula_usuario} = req.body;
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
  const {cedula_usuario, id_usuario_edit} = req.body
  const datosForm = req.body;
  const datos = [
    datosForm.nombres_usuario, datosForm.apellidos_usuario, datosForm.cedula_usuario,
    datosForm.correo_e_usuario,datosForm.contrasena_usuario, datosForm.sexo_usuario,
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
    OR cedula LIKE '%${search_value}%')`;
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

export default router;