<?

    $config["js_apps"]["core.apps.embed_flash"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "embed_flash.js",
                    "embed_flash.admin.js"
                )
            ),



            USERTYPE_CONTRIBUTOR => array(
                "code" => array("embed_flash.js")
            ),



            USERTYPE_GUEST => array(
                "code" => array("embed_flash.js")
            )
        )

    )


?>