CREATE DATABASE  IF NOT EXISTS `colegiofdv` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `colegiofdv`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: colegiofdv
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `estudiante`
--

DROP TABLE IF EXISTS `estudiante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudiante` (
  `id_estudiante` int NOT NULL AUTO_INCREMENT,
  `nombres` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `registroNac` varchar(30) NOT NULL,
  `fechaNac` date NOT NULL,
  `sexo` char(1) DEFAULT NULL,
  `estado` varchar(10) NOT NULL DEFAULT 'Activo',
  `id_tutor_fk` int NOT NULL,
  `id_nivel_fk` int NOT NULL,
  PRIMARY KEY (`id_estudiante`),
  KEY `id_tutor_fk` (`id_tutor_fk`),
  KEY `id_nivel_fk` (`id_nivel_fk`),
  CONSTRAINT `estudiante_ibfk_1` FOREIGN KEY (`id_tutor_fk`) REFERENCES `tutor` (`id_tutor`),
  CONSTRAINT `estudiante_ibfk_2` FOREIGN KEY (`id_nivel_fk`) REFERENCES `nivel` (`id_nivel`),
  CONSTRAINT `ck_estudiante_estado` CHECK ((`estado` in (_utf8mb4'Activo',_utf8mb4'Inactivo'))),
  CONSTRAINT `ck_estudiante_sexo` CHECK ((`sexo` in (_utf8mb4'M',_utf8mb4'F')))
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiante`
--

LOCK TABLES `estudiante` WRITE;
/*!40000 ALTER TABLE `estudiante` DISABLE KEYS */;
INSERT INTO `estudiante` VALUES (1,'Pepe Antonio','Ruiz Garcia','014-587-695','2024-05-15','M','Activo',1,13),(2,'Paula Antonieta','Ruiz Garcia','254-125-856','2024-05-30','F','Activo',1,7),(3,'Raul Alexander','Mujica Soza','0147-574-869','2015-02-12','M','Activo',2,2),(4,'Fernando Steven','Mujica Soza','574-745-522','2004-12-16','M','Activo',2,10),(5,'Jessica Sarahi','Mujica Soza','247-852-698','2014-09-23','F','Activo',2,8),(6,'Yolanda Fabricia','Silva Solorzano','241-578-145','2000-04-16','F','Activo',3,8),(7,'Carlos Yubrant','Keller Sequeira','102-475-872','2017-12-11','M','Activo',4,4);
/*!40000 ALTER TABLE `estudiante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nivel`
--

DROP TABLE IF EXISTS `nivel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nivel` (
  `id_nivel` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `jerarquia` int NOT NULL,
  `turno` varchar(30) NOT NULL,
  PRIMARY KEY (`id_nivel`),
  UNIQUE KEY `nombre` (`nombre`),
  CONSTRAINT `ck_jerarquia` CHECK (((`jerarquia` > 0) and (`jerarquia` < 20))),
  CONSTRAINT `ck_nivel_turno` CHECK ((`turno` in (_utf8mb4'Matutino',_utf8mb4'Vespertino'))),
  CONSTRAINT `ck_tipo` CHECK ((`tipo` in (_utf8mb4'Preescolar',_utf8mb4'Primaria',_utf8mb4'Secundaria')))
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nivel`
--

LOCK TABLES `nivel` WRITE;
/*!40000 ALTER TABLE `nivel` DISABLE KEYS */;
INSERT INTO `nivel` VALUES (1,'Primer Nivel','Preescolar',1,'Matutino'),(2,'Segundo Nivel','Preescolar',2,'Matutino'),(3,'Tercer Nivel','Preescolar',3,'Matutino'),(4,'Primer Grado','Primaria',4,'Matutino'),(5,'Segundo Grado','Primaria',5,'Matutino'),(6,'Tercer Grado','Primaria',6,'Matutino'),(7,'Cuarto Grado','Primaria',7,'Matutino'),(8,'Quinto Grado','Primaria',8,'Matutino'),(9,'Sexto Grado','Primaria',9,'Matutino'),(10,'Septimo Grado','Secundaria',10,'Matutino'),(11,'Octavo Grado','Secundaria',11,'Matutino'),(12,'Noveno Grado','Secundaria',12,'Matutino'),(13,'Decimo Grado','Secundaria',13,'Matutino'),(14,'Undecimo Grado','Secundaria',14,'Matutino');
/*!40000 ALTER TABLE `nivel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(30) NOT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `nombre_rol` (`nombre_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'Administrador'),(3,'Profesor'),(2,'Secretaria');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('DOl59Uv4_iGIx7y7PHgfKzeE_CIMCbP9',1715005005,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('a8A0Hhghlbrx-eZ3IIHjGhvoIp1kHwu9',1715040939,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":2}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tutor`
--

DROP TABLE IF EXISTS `tutor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tutor` (
  `id_tutor` int NOT NULL AUTO_INCREMENT,
  `nombres` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `cedula` varchar(30) NOT NULL,
  `correo_e` varchar(50) NOT NULL,
  `sexo` char(1) NOT NULL,
  `telefono` int NOT NULL,
  `direccion` varchar(100) NOT NULL,
  PRIMARY KEY (`id_tutor`),
  UNIQUE KEY `cedula` (`cedula`),
  UNIQUE KEY `telefono` (`telefono`),
  CONSTRAINT `ck_tutor_sexo` CHECK ((`sexo` in (_utf8mb4'M',_utf8mb4'F')))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tutor`
--

LOCK TABLES `tutor` WRITE;
/*!40000 ALTER TABLE `tutor` DISABLE KEYS */;
INSERT INTO `tutor` VALUES (1,'Pepe Antonio','Ruiz Zamorano','852-201099-0142K','pepe_yt1@outlook.com','M',84545417,'urbanizacion xochitlan'),(2,'Josefina Belen','Soza Fernandez','525-241196-0125J','josef_874@gmail.com','M',84554152,'Praderas el doral'),(3,'Leonardo Fabio','Silva Mendez','287-121292-2451B','Leo-475@yahoo.com','M',87585652,'Laureles Norte'),(4,'Cristina Yamileth','Sequeria Baltodano','281-250398-0014J','Cris_Ya878@hotmail.com','F',87458568,'Tipitapa');
/*!40000 ALTER TABLE `tutor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombres` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `cedula` varchar(30) NOT NULL,
  `sexo` char(1) NOT NULL,
  `direccion` varchar(100) NOT NULL,
  `correo_e` varchar(60) NOT NULL,
  `contrasena` varchar(100) NOT NULL,
  `estado` varchar(10) DEFAULT 'Activo',
  `id_rol_fk` int NOT NULL,
  `telefono` int NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `cedula` (`cedula`),
  UNIQUE KEY `correo_e` (`correo_e`),
  UNIQUE KEY `telefono` (`telefono`),
  KEY `id_rol_fk` (`id_rol_fk`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_rol_fk`) REFERENCES `rol` (`id_rol`),
  CONSTRAINT `ck_usuario_estado` CHECK ((`estado` in (_utf8mb4'Activo',_utf8mb4'Inactivo'))),
  CONSTRAINT `ck_usuario_sexo` CHECK ((`sexo` in (_utf8mb4'M',_utf8mb4'F')))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Christian','Velasquez','000-547150-0005C','M','Managua','cristian@gmail.com','123','Activo',2,75845248),(2,'Angel','Garcia','000-544122-4555A','M','Managua','angelgarcia','123','Activo',2,87451254);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'colegiofdv'
--

--
-- Dumping routines for database 'colegiofdv'
--
/*!50003 DROP PROCEDURE IF EXISTS `UsuarioInformacion` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UsuarioInformacion`(IN CorreoUsuario VARCHAR(100), IN IdUsuario INT)
BEGIN
  IF CorreoUsuario IS NOT NULL THEN
    SELECT * FROM usuario AS U 
    INNER JOIN rol AS R ON U.id_rol_fk = R.id_rol
    WHERE U.correo_e = CorreoUsuario;
  ELSEIF IdUsuario IS NOT NULL THEN
    SELECT * FROM usuario AS U 
    INNER JOIN rol AS R ON U.id_rol_fk = R.id_rol
    WHERE U.id_usuario = IdUsuario;
  END IF;  
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-05 18:18:00
