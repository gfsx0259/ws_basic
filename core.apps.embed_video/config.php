<?

    $config["js_apps"]["core.apps.embed_video"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "embed_video.js",
                    "embed_video.admin.js"
                )
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array("embed_video.js")
            ),


            USERTYPE_GUEST => array(
                "code" => array("embed_video.js")
            )
        )

    )


?>