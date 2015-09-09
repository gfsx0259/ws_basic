<?

$config["js_apps"]["core.apps.slideshow"] = array(

    'general' => array(
        'title' => 'Slideshow',
        'name' => 'slideshow',//should be like 3th part of folder
        'version' => '1.0.0',
        'icon' => 'icon.png',
        'category' => CATEGORY_BASIC,
        'description' => '',
        'depends'=>[
            'files_manager',
            'list_editor'
        ]
    ),

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