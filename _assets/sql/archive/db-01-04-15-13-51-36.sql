DROP TABLE wrrds;

CREATE TABLE `wrrds` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `message` varchar(255) NOT NULL,
  `isflagged` tinyint(1) NOT NULL DEFAULT '0',
  `isbanned` tinyint(1) NOT NULL DEFAULT '0',
  `plays` int(11) NOT NULL DEFAULT '0',
  `ip` varchar(20) NOT NULL,
  `dateadded` datetime NOT NULL,
  `datemodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

INSERT INTO wrrds VALUES("1","Pete G","Is this thing on?","0","0","7","192.168.11.38","2011-12-08 18:49:13","2015-04-01 14:48:42");
INSERT INTO wrrds VALUES("2","PG","Hello there!","0","0","11","127.0.0.1","2015-04-01 14:37:48","2015-04-01 14:48:50");



