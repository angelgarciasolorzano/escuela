--CREANDO BASE DE DATOS
DROP DATABASE IF EXISTS escuela;
CREATE DATABASE escuela;

--USANDO LA BASE DE DATOS
USE escuela;

--CREANDO TABLAS
CREATE TABLE Roles (
  id_Role INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  nombre_Role VARCHAR(30) NOT NULL
);

CREATE TABLE Usuario (
  id_Usuario INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  correo VARCHAR(100) NOT NULL,
  contra VARCHAR(100) NOT NULL,
  estado_Usuario INT NULL,
  nombre_Usuario VARCHAR(100) NULL,
  apellido_Usuario VARCHAR(100) NULL,
  cedula_Usuario VARCHAR(100) NULL,
  sexo_Usuario VARCHAR(1) NULL,
  direccion_Usuario VARCHAR(200) NULL,
  id_Role_FK INT NOT NULL,

  FOREIGN KEY (id_Role_FK) REFERENCES Roles(id_Role)
);

CREATE TABLE Estudiante (
  id_Estudiante INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  nombre_Estudiante VARCHAR(100) NOT NULL,
  apellidos_Estudiante VARCHAR(100) NOT NULL,
  fechaNac_Estudiante DATE NOT NULL,
  direccion_Estudiante VARCHAR(150) NOT NULL,
  sexo_Estudiante VARCHAR(1) NOT NULL
);

CREATE TABLE Tutor (
  id_Tutor INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  nombre_Tutor VARCHAR(100) NOT NULL,
  apellido_Tutor VARCHAR(100) NOT NULL,
  ocupacion VARCHAR(100) NOT NULL,
  cedula_Tutor VARCHAR(100) NOT NULL,
  telefono_Tutor INT NOT NULL,
  id_Estudiante_FK INT NOT NULL,

  FOREIGN KEY (id_Estudiante_FK) REFERENCES Estudiante(id_Estudiante)
);

--INSERTANDO DATOS DE PRUEBA
INSERT INTO Roles (nombre_Role) VALUES ('Administrador');
INSERT INTO Roles (nombre_Role) VALUES ('Secretaria');
INSERT INTO Roles (nombre_Role) VALUES ('Profesor');
INSERT INTO Usuario (correo, contra, id_Role_FK) VALUES ('angelgarcia', '123', '2');

--MOSTRANDO DATOS DE LAS TABLAS
SELECT * FROM Usuario;
SELECT * FROM Tutor;
SELECT * FROM Estudiante;
SELECT * FROM Roles;

--PROCEDIMIENTO ALMACENADO: BUSCANDO INFORMACION DE USUARIOS
DELIMITER $$
CREATE PROCEDURE UsuarioInformacion(IN CorreoUsuario VARCHAR(100), IN IdUsuario INT)
BEGIN
  IF CorreoUsuario IS NOT NULL THEN
    SELECT * FROM Usuario AS U 
    INNER JOIN Roles AS R ON U.id_Role_FK = R.id_Role
    WHERE U.correo = CorreoUsuario;
  ELSEIF IdUsuario IS NOT NULL THEN
    SELECT * FROM Usuario AS U 
    INNER JOIN Roles AS R ON U.id_Role_FK = R.id_Role
    WHERE U.id_Usuario = IdUsuario;
  END IF;  
END $$
DELIMITER ;

--PROCEDIMIENTO ALMACENADO: INSERTAR DATOS DEL ESTUDIANTE Y TUTOR
DELIMITER $$
CREATE PROCEDURE EstudianteTutor(
  IN nombre_est VARCHAR(100),
  IN apellidos_est VARCHAR(100),
  IN direccion_est VARCHAR(150),
  IN fechaNac_est DATE,
  IN sexo_est VARCHAR(1),
  IN nombre_tut VARCHAR(100),
  IN apellidos_tut VARCHAR(100),
  IN ocupacion VARCHAR(100),
  IN cedula_tut VARCHAR(100),
  IN telefono_tut INT
)
BEGIN
 INSERT INTO Estudiante (nombre_Estudiante, apellidos_Estudiante, fechaNac_Estudiante, direccion_Estudiante, sexo_Estudiante)
 VALUES (nombre_est, apellidos_est, fechaNac_est, direccion_est, sexo_est);
 SET @id_estudiante = LAST_INSERT_ID();

 INSERT INTO Tutor (nombre_Tutor, apellido_Tutor, ocupacion, cedula_Tutor, telefono_Tutor, id_Estudiante_FK)
 VALUES (nombre_tut, apellidos_tut, ocupacion, cedula_tut,telefono_tut, @id_estudiante);
END $$
DELIMITER ;

--MOSTRAR DESCRIPCIONES DE LAS TABLAS
DESCRIBE Roles;
DESCRIBE Usuario;
DESCRIBE Estudiante;

--ELIMINANDO TABLAS
DROP TABLE Estudiante;
DROP TABLE Usuario;
DROP TABLE Roles;
DROP TABLE Tutor;

--ELIMINANDO PROCEDIMIENTOS ALMACENADOS
DROP PROCEDURE UsuarioInformacion;