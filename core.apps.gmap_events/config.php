<?

    $config["js_apps"]["core.apps.gmap_events"] = array(

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