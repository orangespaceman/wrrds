CREATE TABLE `canvas-letters-visualiser` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,  
  `message` varchar(255) NOT NULL,
  `isflagged` tinyint(1) NOT NULL DEFAULT '0',  
  `isbanned` tinyint(1) NOT NULL DEFAULT '0',  
  `plays` int(11) NOT NULL DEFAULT '0',
  `ip` varchar(20) NOT NULL,
  `dateadded` datetime NOT NULL,
  `datemodified` timestamp  NOT NULL,  
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `canvas-letters`
--


INSERT INTO `canvas-letters` VALUES(1, '8hy5e', 'ff9900', '000000', 15, 'Quidquid latine dictum sit; altum sonatur.', 10, 1, 'default', 1, 1, 5, 0, '192.168.0.7', '2010-10-13 11:40:52');