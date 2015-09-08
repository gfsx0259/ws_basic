<?

    $config["js_apps"]["core.apps.image_gallery"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "image_gallery.js",
                    "image_gallery.admin.js"
                )
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array(
                    "image_gallery.js"
                 )
            ),


            USERTYPE_GUEST => array(
                "code" => array(
                    "image_gallery.js"
                )
            )
        )

    )


?>