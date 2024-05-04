import pool from "../config/database.js";

//TODO VISTAS (PERFIL, MATRICULAS, LISTAS)

const perfilSecretaria = (req, res) => {
  res.render('interface/client/perfilsecret');
};

const matricula = (req, res) => {
  res.render('interface/client/addestudiantes');
};

const listaEstudiantes = (req, res) => {
  res.render('interface/client/listestudiantes');
};

//TODO ESTUDIANTES (ENVIO Y RECIBIMIENTO DE DATOS)

const estudianteMatricula = async (req, res) => {
  try {
    const estudianteTutor = req.body;
    const procedure = 'CALL EstudianteTutor(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const datos = [estudianteTutor.nombre_est,
      estudianteTutor.apellidos_est,
      estudianteTutor.direccion_est,
      estudianteTutor.fecha_est,
      estudianteTutor.sexo_est,
      estudianteTutor.nombre_tutor,
      estudianteTutor.apellido_tutor,
      estudianteTutor.ocupacion_tutor,
      estudianteTutor.cedula_tutor,
      estudianteTutor.telefono_tutor,
    ];

    await pool.query(procedure, datos);
    res.redirect('/secretaria/lista');
  } catch (error) {
    console.log(error);
    res.redirect('/secretaria/registro');
  }
};

const estudiantesDatosAPI = async (req, res) => {
  const [data] = await pool.query('SELECT * FROM Estudiante');
  if(data && data.length > 0) { res.send(data); }
};

const tutoresDatosAPI = async (req, res) => {
  const [data] = await pool.query('SELECT * FROM Tutor');
  if(data && data.length > 0) { res.send(data); }
};

export {
  perfilSecretaria,
  matricula,
  listaEstudiantes,
  estudianteMatricula,
  estudiantesDatosAPI,
  tutoresDatosAPI
};