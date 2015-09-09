<?

$config["js_apps"]["core.apps.gmap_events"] = array(

    'general' => array(
        'title' => 'Events on Map',
        'name' => 'gmap_events',//should be like 3th part of folder
        'version' => '1.0.0',
        'icon' => 'icon.png',
        'category' => CATEGORY_MAPS,
        'description' => '',
        'depends' => [
            'calendar'
        ]
    ),


    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "gmap_events.js",
                "gmap_events.admin.js"
            ),
            "templates" => array("templates/gmap_events_content.xml")
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array(
                "gmap_events.js"
            ),
            "templates" => array("templates/gmap_events_content.xml")
        ),


        USERTYPE_GUEST => array(
            "code" => array(
                "gmap_events.js"
            ),
            "templates" => array("templates/gmap_events_content.xml")
        )

    )

)


?>