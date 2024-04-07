DROP DATABASE IF EXISTS escuela;
CREATE DATABASE escuela;

USE escuela;

CREATE TABLE Cargo (
  id_Cargo INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(30) NOT NULL
);

CREATE TABLE Usuario (
  id_Usuario INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  correo VARCHAR(100) NOT NULL,
  contra VARCHAR(100) NOT NULL,
  estado INT NULL,
  nombre VARCHAR(100) NULL,
  apellidos VARCHAR(100) NULL,
  cedula VARCHAR(100) NULL,
  sexo VARCHAR(1) NULL,
  direccion VARCHAR(200) NULL,
  id_Cargo_FK INT,

  FOREIGN KEY (id_Cargo_FK) REFERENCES Cargo(id_Cargo)
);

CREATE TABLE Estudiante (
  id_Estudiante INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  edad INT NOT NULL,
  direccio VARCHAR(150) NOT NULL,
  sexo VARCHAR(1) NOT NULL
);

ALTER TABLE Usuario MODIFY id_Cargo_FK INT NOT NULL;
ALTER TABLE Cargo CHANGE COLUMN nombre nombre_cargo VARCHAR(30) NOT NULL;

INSERT INTO Cargo (nombre) VALUES ('Administrador');
INSERT INTO Cargo (nombre) VALUES ('Secretaria');
INSERT INTO Cargo (nombre) VALUES ('Profesor');
INSERT INTO Usuario (correo, contra, id_Cargo_FK) VALUES ('angelgarcia', '123', '2');

SELECT * FROM Cargo;

DELIMITER $$
CREATE PROCEDURE UsuarioInformacion(IN CorreoUsuario VARCHAR(100), IN IdUsuario INT)
BEGIN
  IF CorreoUsuario IS NOT NULL THEN
    SELECT * FROM Usuario AS U 
    INNER JOIN Cargo AS C ON U.id_Cargo_FK = C.id_Cargo
    WHERE U.correo = CorreoUsuario;
  ELSEIF IdUsuario IS NOT NULL THEN
    SELECT * FROM Usuario AS U 
    INNER JOIN Cargo AS C ON U.id_Cargo_FK = C.id_Cargo
    WHERE U.id_Usuario = IdUsuario;
  END IF;  
END $$
DELIMITER ;

DESCRIBE Cargo;
DESCRIBE Usuario;

DROP PROCEDURE UsuarioInformacion;