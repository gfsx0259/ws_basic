<?

    $config["js_apps"]["core.apps.calendar_event"] = array(

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