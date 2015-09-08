<?

    $config["js_apps"]["core.apps.events_categories"] = array(

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

    )


?>