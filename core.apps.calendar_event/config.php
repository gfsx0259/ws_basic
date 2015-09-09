<?

$config["js_apps"]["core.apps.calendar_event"] = array(
    'general' => array(
        'title' => 'Calendar event',
        'name' => 'calendar_event',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_HIDDEN,
        'depends' => [
            'calendar'
        ]
    ),
    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array("calendar_event.js"),
            "templates" => array(
                "templates/calendar_event_edit.xml",
                "templates/calendar_event_edit_rec.xml"
            ),
            "styles" => array("styles.css")
        ),

        USERTYPE_CONTRIBUTOR => array(
            "code" => array("calendar_event.js"),
            "templates" => array(
                "templates/calendar_event_edit.xml",
                "templates/calendar_event_edit_rec.xml"
            ),
            "styles" => array("styles.css")
        )

    )

)


?>