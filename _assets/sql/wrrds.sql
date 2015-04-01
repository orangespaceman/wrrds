CREATE TABLE `wrrds` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `message` varchar(255) NOT NULL,
  `isflagged` tinyint(1) NOT NULL DEFAULT '0',
  `isbanned` tinyint(1) NOT NULL DEFAULT '0',
  `plays` int(11) NOT NULL DEFAULT '0',
  `ip` varchar(20) NOT NULL,
  `dateadded` datetime NOT NULL,
  `datemodified` timestamp NOT NULL,
PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- data for table `wrrds`
--
INSERT INTO `wrrds` VALUES(1, 'Pete G', 'Is this thing on?', 0, 0, 0, '192.168.11.38', '2011-12-08 18:49:13', '2011-12-08 18:49:25');

