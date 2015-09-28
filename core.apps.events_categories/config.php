<?php

$config["js_apps"]["core.apps.events_categories"] = array(
    'general' => array(
        'title' => 'Calendar/Events Categories',
        'name' => 'events_categories',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_DATES,
        'description' => '',
        'depends' => [
            'calendar'
        ]
    ),
    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "events_categories.js",
                "events_categories.admin.js"
            )
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array(
                "events_categories.js"
            )
        ),


        USERTYPE_GUEST => array(
            "code" => array(
                "events_categories.js"
            )
        )
    )
);