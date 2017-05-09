/*
SQLyog Community Edition- MySQL GUI v8.05 
MySQL - 5.7.18-log : Database - gestion_proyectos
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

CREATE DATABASE /*!32312 IF NOT EXISTS*/`gestion_proyectos` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `gestion_proyectos`;

/*Table structure for table `position` */

DROP TABLE IF EXISTS `position`;

CREATE TABLE `position` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(200) NOT NULL,
  `schedule` varchar(30) NOT NULL,
  `salary` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_position_project` (`project`),
  CONSTRAINT `FK_position_project` FOREIGN KEY (`project`) REFERENCES `project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `position` */

insert  into `position`(`id`,`project`,`name`,`description`,`schedule`,`salary`) values (1,300,'lider','lider del proyecto','diurno',30000),(2,300,'sub-lider','otro lider de otra cosa','nocturno',20000),(3,301,'alguien','no se sabe que hace','diurno',20000);

/*Table structure for table `project` */

DROP TABLE IF EXISTS `project`;

CREATE TABLE `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `start` date NOT NULL,
  `end` date NOT NULL,
  `stage` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_project_user` (`user`),
  CONSTRAINT `FK_project_user` FOREIGN KEY (`user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=303 DEFAULT CHARSET=utf8;

/*Data for the table `project` */

insert  into `project`(`id`,`user`,`name`,`start`,`end`,`stage`) values (300,5,'Test oioui','2017-05-03','2017-06-15','50% - 75%'),(301,7,'Concep','2017-02-02','2017-06-09','25% - 50%');

/*Table structure for table `type_document` */

DROP TABLE IF EXISTS `type_document`;

CREATE TABLE `type_document` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `type_document` */

insert  into `type_document`(`id`,`type`) values (1,'CC'),(2,'TI');

/*Table structure for table `type_user` */

DROP TABLE IF EXISTS `type_user`;

CREATE TABLE `type_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `type_user` */

insert  into `type_user`(`id`,`description`) values (1,'Director'),(2,'Integrante');

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `document` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `password` varchar(150) NOT NULL,
  `type_user` int(11) NOT NULL,
  `type_document` int(11) NOT NULL,
  `mail` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `document` (`document`),
  UNIQUE KEY `mail` (`mail`),
  KEY `FK_type_user` (`type_user`),
  KEY `FK_type_document` (`type_document`),
  CONSTRAINT `FK_typeDocument` FOREIGN KEY (`type_document`) REFERENCES `type_document` (`id`),
  CONSTRAINT `FK_typeUser` FOREIGN KEY (`type_user`) REFERENCES `type_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;

/*Data for the table `user` */

insert  into `user`(`id`,`document`,`name`,`last_name`,`date`,`password`,`type_user`,`type_document`,`mail`) values (5,'1','admin','admin','2017-05-03','admin',2,2,'admin@admin.com'),(7,'2','12121','12121','2017-05-02','1234',1,1,'121212@wqwq.com'),(8,'3','otro','otro','2017-05-12','otro',1,1,'otro@otro.com'),(9,'4','mas','mas','2017-05-10','mas',1,1,'mas@mas.com'),(11,'5','1212','1212','2017-05-12','1212',1,1,'1212@algo.com');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
