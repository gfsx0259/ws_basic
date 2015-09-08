<?

    $config["js_apps"]["core.apps.picture"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "picture.js",
                    "picture.admin.js"
                ),
                "styles" => array(
                    "styles.css"
                )
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array("picture.js"),
                "styles" => array(
                    "styles.css"
                )
            ),


            USERTYPE_GUEST => array(
                "code" => array("picture.js"),
                "styles" => array(
                    "styles.css"
                )
            )
        )

    )


?>