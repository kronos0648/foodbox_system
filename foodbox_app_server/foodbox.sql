-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        10.11.2-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- foodbox 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `foodbox` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `foodbox`;

-- 테이블 foodbox.consumer 구조 내보내기
CREATE TABLE IF NOT EXISTS `consumer` (
  `cons_id` varchar(255) NOT NULL,
  `cons_pw` varchar(255) NOT NULL,
  PRIMARY KEY (`cons_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 foodbox.consumer:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `consumer` DISABLE KEYS */;
/*!40000 ALTER TABLE `consumer` ENABLE KEYS */;

-- 테이블 foodbox.device 구조 내보내기
CREATE TABLE IF NOT EXISTS `device` (
  `dev_id` int(8) NOT NULL,
  `battery` char(1) NOT NULL DEFAULT '1',
  `alloc` char(1) NOT NULL DEFAULT '0',
  `lock` char(1) NOT NULL DEFAULT '0',
  `latitude` decimal(18,10) NOT NULL,
  `longitude` decimal(18,10) NOT NULL,
  PRIMARY KEY (`dev_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 foodbox.device:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `device` DISABLE KEYS */;
/*!40000 ALTER TABLE `device` ENABLE KEYS */;

-- 테이블 foodbox.orders 구조 내보내기
CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` int(10) NOT NULL,
  `dev_id` int(8) DEFAULT NULL,
  `cons_id` varchar(255) NOT NULL,
  `store_id` varchar(255) NOT NULL,
  `state` char(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`order_id`),
  KEY `dev_id` (`dev_id`),
  KEY `cons_id` (`cons_id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `cons_id` FOREIGN KEY (`cons_id`) REFERENCES `consumer` (`cons_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `dev_id` FOREIGN KEY (`dev_id`) REFERENCES `device` (`dev_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `store_id` FOREIGN KEY (`store_id`) REFERENCES `store` (`store_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 foodbox.orders:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;

-- 테이블 foodbox.store 구조 내보내기
CREATE TABLE IF NOT EXISTS `store` (
  `store_id` varchar(255) NOT NULL,
  `store_pw` varchar(255) NOT NULL DEFAULT '',
  `store_name` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`store_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 foodbox.store:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `store` DISABLE KEYS */;
INSERT INTO `store` (`store_id`, `store_pw`, `store_name`) VALUES
	('a', '2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6', 'b');
/*!40000 ALTER TABLE `store` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
