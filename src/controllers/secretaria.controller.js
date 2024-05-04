import pool from "../config/database.js";

const perfilSecretaria = (req, res) => { res.render('interface/client/perfilsecret'); };
const matricula = (req, res) => { res.render('interface/client/addestudiantes'); };
const listaEstudiantes = (req, res) => { res.render('interface/client/listestudiantes'); };

const estudianteMatricula = async (req, res) => {
  try {
    const estudianteTutor = req.body;
    const procedure = 'CALL EstudianteTutor(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const datos = [estudianteTutor.nombre_est, estudianteTutor.apellidos_est, estudianteTutor.direccion_est,
      estudianteTutor.fecha_est, estudianteTutor.sexo_est, estudianteTutor.nombre_tutor, 
      estudianteTutor.apellido_tutor, estudianteTutor.ocupacion_tutor, estudianteTutor.cedula_tutor,
      estudianteTutor.telefono_tutor,
    ];

    console.log('hola mundo');
    await pool.query(procedure, datos);
    res.redirect('/secretaria/lista');

  } catch (error) { res.redirect('/secretaria/registro'); }
};

export {
  perfilSecretaria,
  matricula,
  listaEstudiantes,
  estudianteMatricula
};