<?

    $config["js_apps"]["core.apps.events_manager"] = array(

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