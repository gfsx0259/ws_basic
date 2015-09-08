<?

    $config["js_apps"]["core.apps.calendar"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "templates" => array(
                    "templates/calendar_content.xml",
                    "templates/calendar_list.xml",
                    "templates/calendar_event_popup.xml"
                ),
                "code" => array(
                    "calendar.js",
                    "calendar.std.js",
                    "calendar.admin.js"
                )
            ),



            USERTYPE_CONTRIBUTOR => array(
                "code" => array("calendar.js"),
                "templates" => array(
                    "templates/calendar_content.xml",
                    "templates/calendar_list.xml",
                    "templates/calendar_event_popup.xml"
                )
            ),



            USERTYPE_GUEST => array(
                "code" => array(
                    "calendar.js",
                    "calendar.std.js"
                ),
                "templates" => array(
                    "templates/calendar_content.xml",
                    "templates/calendar_list.xml",
                    "templates/calendar_event_popup.xml"
                )
            )
        )

    )


?>