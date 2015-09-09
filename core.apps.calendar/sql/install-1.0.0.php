<?php
$db =& mysql::get_instance();
$db->query(
    'CREATE TABLE IF NOT EXISTS `calendar_categories` (
    `id` int(10) unsigned NOT NULL,
      `title` varchar(120) NOT NULL,
      `color` varchar(16) CHARACTER SET latin1 NOT NULL,
      `textcolor` varchar(16) CHARACTER SET latin1 NOT NULL
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8;'
);

$db->query(
    'ALTER TABLE `calendar_categories` ADD PRIMARY KEY (`id`)'
);
$db->query(
    'ALTER TABLE `calendar_categories` MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT'
);


$db->query(
    "CREATE TABLE IF NOT EXISTS `calendar_events` (
      `id` int(11) unsigned NOT NULL,
      `category_id` int(10) unsigned NOT NULL,
      `what` varchar(250) NOT NULL,
      `street` varchar(80) NOT NULL,
      `city` varchar(80) NOT NULL,
      `state` varchar(40) NOT NULL,
      `country` varchar(40) NOT NULL,
      `tags` varchar(250) NOT NULL,
      `description` text NOT NULL,
      `contact_name` varchar(250) NOT NULL,
      `contact_phone` varchar(32) NOT NULL,
      `rsvp_date` date NOT NULL,
      `cost` varchar(16) CHARACTER SET latin1 NOT NULL,
      `date` date NOT NULL,
      `time_start` time NOT NULL,
      `time_end` time NOT NULL,
      `has_time_end` smallint(6) NOT NULL DEFAULT '1',
      `all_day` tinyint(4) NOT NULL DEFAULT '0',
      `repeat_mode` enum('d','w','m','y','') CHARACTER SET latin1 NOT NULL,
      `offset` int(11) NOT NULL DEFAULT '0',
      `repeat_data` text CHARACTER SET latin1 NOT NULL,
      `repeat_date_end` date NOT NULL,
      `repeat_period` int(11) NOT NULL DEFAULT '0',
      `repeat_weekdays` tinyint(3) unsigned DEFAULT NULL,
      `more_info` text
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8;"
);

$db->query(
    'ALTER TABLE `calendar_events` ADD PRIMARY KEY (`id`);'
);
$db->query(
    'ALTER TABLE `calendar_events` MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT'
);