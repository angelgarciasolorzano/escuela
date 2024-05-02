CREATE DATABASE colegioFDV;
USE colegioFDV;

CREATE TABLE Rol(
	Id_Rol INT PRIMARY KEY AUTO_INCREMENT,
	Nombre_Rol VARCHAR(30) NOT NULL UNIQUE);
    
CREATE TABLE Usuario(
	Id_Usuario INT PRIMARY KEY AUTO_INCREMENT,
	Nombres VARCHAR(30) NOT NULL,
	Apellidos VARCHAR(40) NOT NULL,
	Cedula VARCHAR(30) NOT NULL,
	Sexo CHAR(1) NOT NULL,
	Direccion VARCHAR(100) NOT NULL,
	Correo_e VARCHAR(60) NOT NULL UNIQUE,
	Contrasena VARCHAR(100) NOT NULL,
	Estado VARCHAR(10) DEFAULT 'ACTIVO',
	Id_Rol_FK INT NOT NULL,
	Telefono INT NOT NULL UNIQUE,
	FOREIGN KEY (Id_Rol_FK) REFERENCES Rol(Id_Rol),
	CONSTRAINT CK_Usuario_Sexo CHECK (Sexo IN ('M', 'F')),
	CONSTRAINT UE_Usuario_Cedula UNIQUE (Cedula),
	CONSTRAINT CK_Usuario_Estado CHECK(Estado IN ('ACTIVO','INACTIVO'))
);

INSERT INTO Rol (Nombre_Rol) VALUE ('Administrador'),('Secretaria'),('Profesor');
INSERT INTO Usuario (Nombres, Apellidos, Cedula, Sexo, Direccion, 
			Correo_e, Contrasena, Id_Rol_FK, Telefono)
            VALUES ('Christian', 'Velasquez', '000-547150-0005C', 
					'M', 'Managua', 'cristian@gmail.com', '123', 2, 75845248),
                    ('Angel', 'Garcia', '000-544122-4555A', 
					'M', 'Managua', 'angelgarcia', '123', 2, 87451254);

CREATE TABLE Tutor(
	Id_Tutor INT PRIMARY KEY AUTO_INCREMENT,
	Nombres VARCHAR(30) NOT NULL,
	Apellidos VARCHAR(40) NOT NULL,
	Cedula VARCHAR(30) NOT NULL,
    Correo_e VARCHAR(50) NOT NULL,
	Sexo CHAR(1) NOT NULL,
    Telefono INT NOT NULL UNIQUE,
	Direccion VARCHAR(100) NOT NULL,
	CONSTRAINT CK_Tutor_Sexo CHECK (Sexo IN ('M', 'F')),
	CONSTRAINT UE_Tutor_Cedula UNIQUE (Cedula)
);

CREATE TABLE Estudiante(
	Id_Estudiante INT PRIMARY KEY AUTO_INCREMENT,
	Nombres VARCHAR(30) NOT NULL,
	Apellidos VARCHAR(40) NOT NULL,
    Estado VARCHAR(10) NOT NULL DEFAULT 'ACTIVO',
	FechaNac DATE NOT NULL,
	Sexo CHAR(1),
	Direccion VARCHAR(100),
    Id_Tutor_FK INT NOT NULL,
	CONSTRAINT CK_Estudiante_Sexo CHECK (Sexo IN ('M', 'F')), CONSTRAINT CK_Estudiante_Estado CHECK
	(Estado IN ('ACTIVO', 'INACTIVO'))
);

CREATE TABLE Nivel(
	Id_Nivel INT PRIMARY KEY AUTO_INCREMENT,
	Nombre VARCHAR(30) NOT NULL UNIQUE,
    Tipo VARCHAR(30) NOT NULL,
    Jerarquia INT NOT NULL,
	Turno VARCHAR(30) NOT NULL,
	CONSTRAINT CK_Nivel_Turno CHECK (Turno IN ('Matutino', 'Vespertino')),
    CONSTRAINT CK_Tipo CHECK (Tipo IN ('Preescolar','Primaria', 'Secundaria')),
    CONSTRAINT CK_Jerarquia CHECK (Jerarquia > 0 AND Jerarquia < 20)
);

--PROCEDIMIENTO ALMACENADO: BUSCANDO INFORMACION DE USUARIOS
DELIMITER $$
CREATE PROCEDURE UsuarioInformacion(IN CorreoUsuario VARCHAR(100), IN IdUsuario INT)
BEGIN
  IF CorreoUsuario IS NOT NULL THEN
    SELECT * FROM Usuario AS U 
    INNER JOIN Rol AS R ON U.Id_Rol_FK = R.Id_Rol
    WHERE U.Correo_e = CorreoUsuario;
  ELSEIF IdUsuario IS NOT NULL THEN
    SELECT * FROM Usuario AS U 
    INNER JOIN Rol AS R ON U.Id_Rol_FK = R.Id_Rol
    WHERE U.Id_Usuario = IdUsuario;
  END IF;  
END $$
DELIMITER ;
