<?

    $config["js_apps"]["core.apps.calendar_categories"] = array(
        'general' => array(
            'title' => 'Calendar categories',
            'name' => 'calendar_categories',//should be like 3th part of folder
            'version' => '1.0.0',
            'category' => CATEGORY_HIDDEN,
            'depends' => [
                'calendar'
            ]
        ),
        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array("calendar_categories.js"),
                "templates" => array(
                    "templates/calendar_categories.xml"
                )
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array("calendar_categories.js"),
                "templates" => array(
                    "templates/calendar_categories.xml"
                )
            )
        )

    )


?>