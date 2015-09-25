<?php
$db =& mysql::get_instance();
$db->query('DROP TABLE calendar_categories');
$db->query('DROP TABLE calendar_events');

