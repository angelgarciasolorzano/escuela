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
  `Id_Estudiante` int NOT NULL AUTO_INCREMENT,
  `Nombres` varchar(30) NOT NULL,
  `Apellidos` varchar(40) NOT NULL,
  `Estado` varchar(10) NOT NULL DEFAULT 'ACTIVO',
  `FechaNac` date NOT NULL,
  `Sexo` char(1) DEFAULT NULL,
  `Direccion` varchar(100) DEFAULT NULL,
  `Id_Tutor_FK` int NOT NULL,
  PRIMARY KEY (`Id_Estudiante`),
  CONSTRAINT `CK_Estudiante_Estado` CHECK ((`Estado` in (_utf8mb4'ACTIVO',_utf8mb4'INACTIVO'))),
  CONSTRAINT `CK_Estudiante_Sexo` CHECK ((`Sexo` in (_utf8mb4'M',_utf8mb4'F')))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiante`
--

LOCK TABLES `estudiante` WRITE;
/*!40000 ALTER TABLE `estudiante` DISABLE KEYS */;
INSERT INTO `estudiante` VALUES (1,'Stephanie Michelle','Silva Gonzalez','ACTIVO','2013-05-15','F','dakhkasdhllsah',1),(2,'Jonathan Jose','Alvarado Mercado','ACTIVO','2010-06-08','M','falklsajnddskjdaj',2),(3,'Maria Antonieta','Bismarck Estrada','ACTIVO','2008-01-28','F','gewaerwerwer',3);
/*!40000 ALTER TABLE `estudiante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nivel`
--

DROP TABLE IF EXISTS `nivel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nivel` (
  `Id_Nivel` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(30) NOT NULL,
  `Tipo` varchar(30) NOT NULL,
  `Jerarquia` int NOT NULL,
  `Turno` varchar(30) NOT NULL,
  PRIMARY KEY (`Id_Nivel`),
  UNIQUE KEY `Nombre` (`Nombre`),
  CONSTRAINT `CK_Jerarquia` CHECK (((`Jerarquia` > 0) and (`Jerarquia` < 20))),
  CONSTRAINT `CK_Nivel_Turno` CHECK ((`Turno` in (_utf8mb4'Matutino',_utf8mb4'Vespertino'))),
  CONSTRAINT `CK_Tipo` CHECK ((`Tipo` in (_utf8mb4'Preescolar',_utf8mb4'Primaria',_utf8mb4'Secundaria')))
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nivel`
--

LOCK TABLES `nivel` WRITE;
/*!40000 ALTER TABLE `nivel` DISABLE KEYS */;
INSERT INTO `nivel` VALUES (1,'Primer Nivel','Preescolar',1,'Matutino'),(2,'Segundo Nivel','Preescolar',2,'Matutino'),(3,'Tercer Nivel','Preescolar',3,'Matutino'),(4,'Primer Grado','Primaria',4,'Matutino'),(5,'Segundo Grado','Primaria',5,'Matutino'),(6,'Tercer Grado','Primaria',6,'Matutino'),(7,'Cuarto Grado','Primaria',7,'Matutino'),(8,'Quinto Grado','Primaria',8,'Matutino'),(9,'Sexto  Grado','Primaria',9,'Matutino'),(10,'Septimo Grado','Secundaria',10,'Matutino'),(11,'Octavo Grado','Secundaria',11,'Matutino'),(12,'Noveno Grado','Secundaria',12,'Matutino'),(13,'Decimo Grado','Secundaria',13,'Matutino'),(14,'Undecimo Grado','Secundaria',14,'Matutino');
/*!40000 ALTER TABLE `nivel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `Id_Rol` int NOT NULL AUTO_INCREMENT,
  `Nombre_Rol` varchar(30) NOT NULL,
  PRIMARY KEY (`Id_Rol`),
  UNIQUE KEY `Nombre_Rol` (`Nombre_Rol`)
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
INSERT INTO `sessions` VALUES ('DQKoOVuf2bqinAxMUyEHusu2zejBdJBY',1714768915,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tutor`
--

DROP TABLE IF EXISTS `tutor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tutor` (
  `Id_Tutor` int NOT NULL AUTO_INCREMENT,
  `Nombres` varchar(30) NOT NULL,
  `Apellidos` varchar(40) NOT NULL,
  `Cedula` varchar(30) NOT NULL,
  `Correo_e` varchar(50) NOT NULL,
  `Sexo` char(1) NOT NULL,
  `Telefono` int NOT NULL,
  `Direccion` varchar(100) NOT NULL,
  PRIMARY KEY (`Id_Tutor`),
  UNIQUE KEY `Telefono` (`Telefono`),
  UNIQUE KEY `UE_Tutor_Cedula` (`Cedula`),
  CONSTRAINT `CK_Tutor_Sexo` CHECK ((`Sexo` in (_utf8mb4'M',_utf8mb4'F')))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tutor`
--

LOCK TABLES `tutor` WRITE;
/*!40000 ALTER TABLE `tutor` DISABLE KEYS */;
INSERT INTO `tutor` VALUES (1,'Marco Jose','Silva Benavidez','231-150486-0012B','marcos_silva23@gmail.com','M',87412525,'dakhkasdhllsah'),(2,'Vanessa Sophia','Mercado Sotelo','123-200195-0123C','vane245@yahoo.com','F',72145685,'falklsajnddskjdaj'),(3,'Carolina Judith','Estrada Carcamo','254-020998-0178T','cjestrada@outlook.com','F',85412541,'gewaerwerwer');
/*!40000 ALTER TABLE `tutor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `Id_Usuario` int NOT NULL AUTO_INCREMENT,
  `Nombres` varchar(30) NOT NULL,
  `Apellidos` varchar(40) NOT NULL,
  `Cedula` varchar(30) NOT NULL,
  `Sexo` char(1) NOT NULL,
  `Direccion` varchar(100) NOT NULL,
  `Correo_e` varchar(60) NOT NULL,
  `Contrasena` varchar(100) NOT NULL,
  `Estado` varchar(10) DEFAULT 'ACTIVO',
  `Id_Rol_FK` int NOT NULL,
  `Telefono` int NOT NULL,
  PRIMARY KEY (`Id_Usuario`),
  UNIQUE KEY `Correo_e` (`Correo_e`),
  UNIQUE KEY `Telefono` (`Telefono`),
  UNIQUE KEY `UE_Usuario_Cedula` (`Cedula`),
  KEY `Id_Rol_FK` (`Id_Rol_FK`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`Id_Rol_FK`) REFERENCES `rol` (`Id_Rol`),
  CONSTRAINT `CK_Usuario_Estado` CHECK ((`Estado` in (_utf8mb4'ACTIVO',_utf8mb4'INACTIVO'))),
  CONSTRAINT `CK_Usuario_Sexo` CHECK ((`Sexo` in (_utf8mb4'M',_utf8mb4'F')))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (3,'Christian','Velasquez','000-547150-0005C','M','Managua','cristian@gmail.com','123','ACTIVO',2,75845248),(4,'Angel','Garcia','000-544122-4555A','M','Managua','angelgarcia','123','ACTIVO',2,87451254);
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
    SELECT * FROM Usuario AS U 
    INNER JOIN Rol AS R ON U.Id_Rol_FK = R.Id_Rol
    WHERE U.correo_e = CorreoUsuario;
  ELSEIF IdUsuario IS NOT NULL THEN
    SELECT * FROM Usuario AS U 
    INNER JOIN Rol AS R ON U.Id_Rol_FK = R.Id_Rol
    WHERE U.Id_Usuario = IdUsuario;
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

-- Dump completed on 2024-05-02 15:08:11
