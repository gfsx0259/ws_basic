<?

$config["js_apps"]["core.apps.events_manager"] = array(
    'general' => array(
        'title' => 'Event manager',
        'name' => 'events_manager',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_HIDDEN,
        'depends' => [
            'calendar'
        ]
    ),
    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array("events_manager.js"),
            "templates" => array(
                "templates/events_manager.xml",
                "templates/events_manager_events.xml",
                "templates/events_manager_categories.xml"
            )
        )
    )

)


?>