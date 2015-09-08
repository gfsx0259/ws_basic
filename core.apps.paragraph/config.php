<?

    $config["js_apps"]["core.apps.paragraph"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "templates" => array(
                    "templates/paragraph_content.xml"
                ),
                "code" => array(
                    "paragraph.js",
                    "paragraph.admin.js"
                ),
                "styles" => array("style.css")
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array(
                    "paragraph.js",
                    "paragraph.contributor.js"
                ),
                "templates" => array("templates/paragraph_content.xml"),
                "styles" => array("style.css")
            ),


            USERTYPE_GUEST => array(
                "code" => array("paragraph.js"),
                "templates" => array("templates/paragraph_content.xml"),
                "styles" => array("style.css")
            )
        )


    )

?>