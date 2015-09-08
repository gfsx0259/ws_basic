<?

    $config["js_apps"]["core.apps.audioplayer"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "audioplayer.js",
                    "audioplayer.admin.js"
                ),
                "styles" => array("styles/audioplayer.admin.css")
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array(
                    "audioplayer.js"
                )
            ),


            USERTYPE_GUEST => array(
                "code" => array(
                    "audioplayer.js"
                )
            )
        )

    )

?>
