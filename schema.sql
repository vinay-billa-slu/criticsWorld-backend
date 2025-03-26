CREATE DATABASE IF NOT EXISTS criticsworld;

-- MySQL dump 10.13  Distrib 8.0.35, for Linux (x86_64)
--
-- Host: localhost    Database: CriticsWorld
-- ------------------------------------------------------
-- Server version	8.0.35-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Movie`
--

DROP TABLE IF EXISTS `Movie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Movie` (
  `MovieID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) NOT NULL,
  `ReleaseYear` int DEFAULT NULL,
  `Actors` text,
  `PosterImage` varchar(255) DEFAULT NULL,
  `Director` varchar(255) DEFAULT NULL,
  `Timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`MovieID`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(255) NOT NULL,
  `LastName` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `isAdmin` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `Review`
--

DROP TABLE IF EXISTS `Review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Review` (
  `ReviewID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `MovieID` int DEFAULT NULL,
  `ReviewTitle` varchar(255) NOT NULL,
  `Rating` int DEFAULT NULL,
  `Timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ReviewID`),
  KEY `UserID` (`UserID`),
  KEY `MovieID` (`MovieID`),
  CONSTRAINT `Review_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`),
  CONSTRAINT `Review_ibfk_2` FOREIGN KEY (`MovieID`) REFERENCES `Movie` (`MovieID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

INSERT INTO `User` (`UserID`, `FirstName`, `LastName`, `Email`, `Password`, `Timestamp`, `isAdmin`) VALUES
(41, 'Admin', 'Hello', 'admin@gmail.com', 'U2FsdGVkX1+KWBu7dXl9ztgGXdK2OpPzhLt3fb5/9qE=', '2025-03-23 19:29:56', 0),
(42, 'Hello', 'User', 'user@gmail.com', 'U2FsdGVkX18pFMyvUtzBlW7zcEoe/RsJxCYWqCC+LF4=', '2025-03-23 19:30:33', 0);


INSERT INTO Movie (Title, ReleaseYear, PosterImage)
VALUES
    ('Jawan', 2023, '/images/1701588190660--jawan-movie.jpg'),
    ('The Northman', 2022, '/images/upcoming-1.png'),
    ('Doctor Strange in the Multiverse of Madness', 2022, '/images/upcoming-2.png'),
    ('Memory', 2022, '/images/upcoming-3.png'),
    ('The Unbearable Weight of Massive Talent', 2022, '/images/upcoming-4.png'),
    ('Sonic the Hedgehog 2', 2022, '/images/movie-1.png'),
    ('Morbius', 2022, '/images/movie-2.png'),
    ('The Adam Project', 2022, '/images/movie-3.png'),
    ('Free Guy', 2022, '/images/movie-4.png'),
    ('The Batman', 2022, '/images/movie-5.png'),
    ('Uncharted', 2022, '/images/movie-6.png'),
    ('Death on the Nile', 2022, '/images/movie-7.png'),
    ('The King\'s Man', 2022, '/images/movie-8.png'),
    ('Moon Knight', 2022, '/images/series-1.png'),
    ('Halo', 2022, '/images/series-2.png'),
    ('Vikings: Valhalla', 2022, '/images/series-3.png'),
    ('Money Heist', 2022, '/images/series-4.png');

-- Dump completed on 2023-12-03 16:26:32

-- SELECT * FROM Movie;
-- SELECT * FROM User;
