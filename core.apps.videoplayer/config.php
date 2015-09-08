<?

    $config["js_apps"]["core.apps.videoplayer"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "videoplayer.js",
                    "videoplayer.admin.js"
                )
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array(
                    "videoplayer.js"
                )
            ),


            USERTYPE_GUEST => array(
                "code" => array(
                    "videoplayer.js"
                )
            )
        )

    )


?>