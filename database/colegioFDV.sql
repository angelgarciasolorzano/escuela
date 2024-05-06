create database colegiofdv;
use colegiofdv;

create table rol(
	id_rol int primary key auto_increment,
	nombre_rol varchar(30) not null unique);
    
create table usuario(
	id_usuario int primary key auto_increment,
	nombres varchar(50) not null,
	apellidos varchar(50) not null,
	cedula varchar(30) not null unique,
	sexo char(1) not null,
	direccion varchar(100) not null,
	correo_e varchar(60) not null unique,
	contrasena varchar(100) not null,
	estado varchar(10) default 'Activo',
	id_rol_fk int not null,
	telefono int not null unique,
	foreign key (id_rol_fk) references rol(id_rol),
	constraint ck_usuario_sexo check (sexo in ('M', 'F')),
	constraint ck_usuario_estado check(estado in ('Activo','Inactivo'))
);

insert into rol(nombre_rol) values ('Administrador'),('Secretaria'),('Profesor');
insert into usuario(nombres, apellidos, cedula, sexo, direccion, 
			correo_e, contrasena, id_rol_fk, telefono)
            values ('Christian', 'Velasquez', '000-547150-0005C', 
					'M', 'Managua', 'cristian@gmail.com', '123', 2, 75845248),
                    ('Angel', 'Garcia', '000-544122-4555A', 
					'M', 'Managua', 'angelgarcia', '123', 2, 87451254);

create table tutor(
	id_tutor int primary key auto_increment,
	nombres varchar(50) not null,
	apellidos varchar(50) not null,
	cedula varchar(30) not null unique,
    correo_e varchar(50) not null,
	sexo char(1) not null,
    telefono int not null unique,
	direccion varchar(100) not null,
	constraint ck_tutor_sexo check (sexo in ('M', 'F'))
);

create table nivel(
	id_nivel int primary key auto_increment,
	nombre varchar(50) not null unique,
    tipo varchar(50) not null,
    jerarquia int not null,
	turno varchar(30) not null,
	constraint ck_nivel_turno check (turno in ('Matutino', 'Vespertino')),
    constraint ck_tipo check (tipo in ('Preescolar','Primaria', 'Secundaria')),
    constraint ck_jerarquia check (jerarquia > 0 and jerarquia < 20)
);

create table estudiante(
	id_estudiante int primary key auto_increment,
	nombres varchar(50) not null,
	apellidos varchar(50) not null,
    registroNac varchar(30) not null,
    fechaNac date not null,
	sexo char(1),
    estado varchar(10) not null default 'Activo',
    id_tutor_fk int not null,
    id_nivel_fk int not null,
    foreign key (id_tutor_fk) references tutor(id_tutor),
    foreign key (id_nivel_fk) references nivel(id_nivel),
	constraint ck_estudiante_sexo check (sexo in ('M', 'F')),
    constraint ck_estudiante_estado check (estado in ('Activo', 'Inactivo'))
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
