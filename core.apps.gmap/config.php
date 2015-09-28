<?

$config["js_apps"]["core.apps.gmap"] = array(

    'general' => array(
        'title' => 'Google Maps',
        'name' => 'gmap',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_MAPS,
        'description' => ''
    ),


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