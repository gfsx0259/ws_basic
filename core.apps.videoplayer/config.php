<?

$config["js_apps"]["core.apps.videoplayer"] = array(

    'general' => array(
        'title' => 'Videoplayer',
        'name' => 'videoplayer',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_MEDIA,
        'description' => '',
        'depends' => [
            'files_manager'
        ]
    ),

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