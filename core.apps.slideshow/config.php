<?

    $config["js_apps"]["core.apps.slideshow"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "slideshow.js",
                    "slideshow.admin.js"
                ),
                "styles" => array(
                    "styles.css"
                )
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array("slideshow.js"),
                "styles" => array(
                    "styles.css"
                )
            ),


            USERTYPE_GUEST => array(
                "code" => array("slideshow.js"),
                "styles" => array(
                    "styles.css"
                )
            )
        )

    )


?>