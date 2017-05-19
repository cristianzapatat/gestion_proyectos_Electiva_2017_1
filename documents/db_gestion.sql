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

/*Table structure for table `activity` */

DROP TABLE IF EXISTS `activity`;

CREATE TABLE `activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `start` date NOT NULL,
  `end` date NOT NULL,
  `project` int(11) NOT NULL,
  `member` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_activity_project` (`project`),
  KEY `FK_activity_member` (`member`),
  CONSTRAINT `FK_activity_member` FOREIGN KEY (`member`) REFERENCES `member` (`id`),
  CONSTRAINT `FK_activity_project` FOREIGN KEY (`project`) REFERENCES `project` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `activity` */

insert  into `activity`(`id`,`name`,`description`,`start`,`end`,`project`,`member`) values (1,'test111111','test111111111111','2017-05-17','2017-04-20',307,2),(3,'1212121','12121212','2017-05-06','2017-05-19',307,2),(4,'121212','121212','2017-05-17','2017-05-25',308,3),(6,'12121212','12121212','2017-05-04','2017-05-24',308,4);

/*Table structure for table `meeting` */

DROP TABLE IF EXISTS `meeting`;

CREATE TABLE `meeting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ubication` varchar(255) NOT NULL,
  `thematic` varchar(200) NOT NULL,
  `start` date NOT NULL,
  `project` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_meeting` (`project`),
  CONSTRAINT `FK_meeting` FOREIGN KEY (`project`) REFERENCES `project` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `meeting` */

insert  into `meeting`(`id`,`ubication`,`thematic`,`start`,`project`) values (3,'3333','3333','2017-05-26',308);

/*Table structure for table `member` */

DROP TABLE IF EXISTS `member`;

CREATE TABLE `member` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `member_uni` (`project`,`user`),
  KEY `FK_member_user` (`user`),
  CONSTRAINT `FK_member_project` FOREIGN KEY (`project`) REFERENCES `project` (`id`),
  CONSTRAINT `FK_member_user` FOREIGN KEY (`user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `member` */

insert  into `member`(`id`,`project`,`user`) values (1,307,5),(2,307,44),(3,308,5),(4,308,44);

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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

/*Data for the table `position` */

insert  into `position`(`id`,`project`,`name`,`description`,`schedule`,`salary`) values (1,300,'lider yo','lider de algo','Nocturno',30000999),(2,300,'sub-lider','otro lider de otra cosa','nocturno',20000),(3,301,'alguien','no se sabe que hace','diurno',20000),(6,303,'11111','1111','Nocturno',11111),(8,304,'web master','Desarrllador','Nocturno',9999999);

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
) ENGINE=InnoDB AUTO_INCREMENT=309 DEFAULT CHARSET=utf8;

/*Data for the table `project` */

insert  into `project`(`id`,`user`,`name`,`start`,`end`,`stage`) values (300,5,'Test oioui','2017-05-03','2017-06-15','50% - 75%'),(301,7,'Concep','2017-02-02','2017-06-09','25% - 50%'),(303,5,'1234','2017-05-03','2017-05-05','0% – 25%'),(304,43,'Proyecto web','2017-05-04','2017-05-30','0% – 25%'),(306,43,'Proyecto movil','2017-05-01','2017-05-26','0% – 25%'),(307,8,'un proyecto','2017-05-13','2017-05-26','0% – 25%'),(308,8,'otro project','2017-05-12','2017-05-20','25% - 50%');

/*Table structure for table `reserve` */

DROP TABLE IF EXISTS `reserve`;

CREATE TABLE `reserve` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task` int(11) NOT NULL,
  `resource` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_reserve_resource` (`resource`),
  KEY `FK_reserve_task` (`task`),
  CONSTRAINT `FK_reserve_resource` FOREIGN KEY (`resource`) REFERENCES `resources` (`id`),
  CONSTRAINT `FK_reserve_task` FOREIGN KEY (`task`) REFERENCES `task` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `reserve` */

/*Table structure for table `resources` */

DROP TABLE IF EXISTS `resources`;

CREATE TABLE `resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `quantity` int(10) NOT NULL,
  `ubication` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `user` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_resources_user` (`user`),
  CONSTRAINT `FK_resources_user` FOREIGN KEY (`user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `resources` */

insert  into `resources`(`id`,`name`,`quantity`,`ubication`,`description`,`user`) values (1,'tv',1,'aqui','un tv ffffff',8);

/*Table structure for table `task` */

DROP TABLE IF EXISTS `task`;

CREATE TABLE `task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `activity` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `start` date NOT NULL,
  `end` date NOT NULL,
  `state` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_task_activity` (`activity`),
  CONSTRAINT `FK_task_activity` FOREIGN KEY (`activity`) REFERENCES `activity` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `task` */

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
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;

/*Data for the table `user` */

insert  into `user`(`id`,`document`,`name`,`last_name`,`date`,`password`,`type_user`,`type_document`,`mail`) values (5,'1','admin','admin','2017-05-03','admin',2,2,'admin@admin.com'),(7,'2','12121','12121','2017-05-02','1234',1,1,'121212@wqwq.com'),(8,'3','otro','otro','2017-05-12','otro',1,1,'otro@otro.com'),(9,'4','mas','mas','2017-05-10','mas',1,1,'mas@mas.com'),(11,'5','1212','1212','2017-05-12','1212',1,1,'1212@algo.com'),(43,'12345','Johnny','Salazar','2017-05-09','123',1,1,'alexander9052@gmail.com'),(44,'123456','asSs','sdas','2017-05-03','1234',2,1,'aahahah@djdj.com');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
