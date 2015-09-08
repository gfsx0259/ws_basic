<?

    $config["js_apps"]["core.apps.gmap"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "gmap.js",
                    "gmap.admin.js"
                ),
                "styles" => array(
                    "styles.admin.css"
                )
            ),



            USERTYPE_CONTRIBUTOR => array(
                "code" => array("gmap.js")
            ),


            USERTYPE_GUEST => array(
                "code" => array("gmap.js")
            )
        )

    )


?>