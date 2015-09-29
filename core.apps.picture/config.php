<?

$config["js_apps"]["core.apps.picture"] = array(

    'general' => array(
        'title' => 'Picture',
        'name' => 'picture',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_BASIC,
        'description' => '',
        'depends'=>[
            'files_manager'
        ]
    ),


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