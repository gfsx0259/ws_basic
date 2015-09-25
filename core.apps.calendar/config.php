<?php

$config['js_apps']['core.apps.calendar'] = array(
    'general' => array(
        'title' => 'Calendar',
        'name' => 'calendar',//should be like 3th part of folder
        'version' => '1.0.0',
        'icon' => 'icon.png',
        'category' => CATEGORY_DATES,
        'description' => '',
        'depends' => [
            'calendar_event',
            'calendar_categories'
        ]
    ),
    'content' => array(
        USERTYPE_ADMIN => array(
            'templates' => array(
                'templates/calendar_content.xml',
                'templates/calendar_list.xml',
                'templates/calendar_event_popup.xml'
            ),
            'code' => array(
                'calendar.js',
                'calendar.std.js',
                'calendar.admin.js'
            )
        ),


        USERTYPE_CONTRIBUTOR => array(
            'code' => array('calendar.js'),
            'templates' => array(
                'templates/calendar_content.xml',
                'templates/calendar_list.xml',
                'templates/calendar_event_popup.xml'
            )
        ),


        USERTYPE_GUEST => array(
            'code' => array(
                'calendar.js',
                'calendar.std.js'
            ),
            'templates' => array(
                'templates/calendar_content.xml',
                'templates/calendar_list.xml',
                'templates/calendar_event_popup.xml'
            )
        )
    )

);